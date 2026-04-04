import { spawn } from "node:child_process";

const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";

const serverProcess = spawn(process.execPath, ["server/index.mjs", "--dev"], {
  stdio: "inherit",
});

const clientProcess = spawn(npmCommand, ["run", "dev:client"], {
  stdio: "inherit",
});

const shutdown = (signal = "SIGTERM") => {
  serverProcess.kill(signal);
  clientProcess.kill(signal);
};

serverProcess.on("exit", (code) => {
  if (code && code !== 0) {
    shutdown();
    process.exit(code);
  }
});

clientProcess.on("exit", (code) => {
  shutdown();
  process.exit(code ?? 0);
});

process.on("SIGINT", () => {
  shutdown("SIGINT");
  process.exit(0);
});

process.on("SIGTERM", () => {
  shutdown("SIGTERM");
  process.exit(0);
});
