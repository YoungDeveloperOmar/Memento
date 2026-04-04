import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Auth from "@/pages/Auth";

const useMementoMock = vi.fn();

vi.mock("@/context/MementoContext", () => ({
  useMemento: () => useMementoMock(),
}));

vi.mock("@/hooks/use-toast", () => ({
  toast: vi.fn(),
}));

describe("Auth form inputs", () => {
  beforeEach(() => {
    useMementoMock.mockReturnValue({
      currentRole: null,
      isHydrating: false,
      caregiverSignIn: vi.fn(),
      caregiverSignUp: vi.fn(),
      patientSignIn: vi.fn(),
    });
  });

  it("accepts typed input for caregiver sign-in, caregiver sign-up, and patient login", () => {
    render(
      <MemoryRouter initialEntries={["/auth"]}>
        <Auth />
      </MemoryRouter>,
    );

    const signInEmail = screen.getByLabelText("Email Address");
    fireEvent.change(signInEmail, { target: { value: "caregiver@example.com" } });
    expect(signInEmail).toHaveValue("caregiver@example.com");

    fireEvent.click(screen.getByRole("button", { name: "Need an account?" }));

    const fullName = screen.getByLabelText("Full Name");
    fireEvent.change(fullName, { target: { value: "Jamie Caregiver" } });
    expect(fullName).toHaveValue("Jamie Caregiver");

    fireEvent.click(screen.getByRole("button", { name: "Patient Patient ID only" }));

    const patientId = screen.getByLabelText("Patient ID");
    fireEvent.change(patientId, { target: { value: "mem-123456" } });
    expect(patientId).toHaveValue("mem-123456");
  });
});
