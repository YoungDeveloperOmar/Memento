import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Heart, User, Users } from "lucide-react";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const [isSignUp, setIsSignUp] = useState(searchParams.get("mode") === "signup");
  const [role, setRole] = useState<"patient" | "caregiver">("patient");

  return (
    <Layout>
      <section className="py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-md">
          <div className="text-center space-y-3 mb-10">
            <Heart className="w-10 h-10 text-primary mx-auto fill-primary" />
            <h1 className="text-section-sm md:text-section font-heading">
              {isSignUp ? "Create Your Account" : "Welcome Back"}
            </h1>
            <p className="text-muted-foreground text-lg">
              {isSignUp ? "Join Memento and start your journey." : "Sign in to your Memento account."}
            </p>
          </div>

          <div className="bg-card rounded-2xl p-8 md:p-10 shadow-sm border space-y-6">
            {isSignUp && (
              <div className="space-y-3">
                <label className="block text-lg font-medium">I am a...</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setRole("patient")}
                    className={`flex flex-col items-center gap-2 p-5 rounded-xl border-2 transition-all ${
                      role === "patient" ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                    }`}
                  >
                    <User className="w-8 h-8 text-primary" />
                    <span className="text-lg font-medium">Patient</span>
                  </button>
                  <button
                    onClick={() => setRole("caregiver")}
                    className={`flex flex-col items-center gap-2 p-5 rounded-xl border-2 transition-all ${
                      role === "caregiver" ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                    }`}
                  >
                    <Users className="w-8 h-8 text-primary" />
                    <span className="text-lg font-medium">Caregiver</span>
                  </button>
                </div>
              </div>
            )}

            {isSignUp && (
              <div>
                <label htmlFor="fullname" className="block text-lg font-medium mb-2">Full Name</label>
                <input id="fullname" type="text" className="w-full rounded-xl border bg-background px-5 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Enter your full name" />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-lg font-medium mb-2">Email Address</label>
              <input id="email" type="email" className="w-full rounded-xl border bg-background px-5 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Enter your email" />
            </div>

            <div>
              <label htmlFor="password" className="block text-lg font-medium mb-2">Password</label>
              <input id="password" type="password" className="w-full rounded-xl border bg-background px-5 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Enter your password" />
            </div>

            <Button size="lg" className="w-full text-lg py-6">
              {isSignUp ? "Create Account" : "Sign In"}
            </Button>

            <p className="text-center text-muted-foreground">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <button onClick={() => setIsSignUp(!isSignUp)} className="text-primary font-semibold hover:underline">
                {isSignUp ? "Sign In" : "Sign Up"}
              </button>
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Auth;
