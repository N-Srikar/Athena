"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  ArrowLeft,
  User,
  Mail,
  Lock,
  BadgeIcon as IdCard,
} from "lucide-react";

import { registerUser } from "@/services/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNextStep = () => {
    // Grab the step-1 inputs
    const emailEl = document.getElementById("email") as HTMLInputElement;
    const nameEl = document.getElementById("name") as HTMLInputElement;

    // If either is invalid, show its browser tooltip and bail
    if (!emailEl.checkValidity()) {
      emailEl.reportValidity();
      return;
    }
    if (!nameEl.checkValidity()) {
      nameEl.reportValidity();
      return;
    }

    // Both valid → clear any custom error & advance
    setError("");
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      router.push("/dashboard/student");
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-muted">
      <div className="container py-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </div>
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg border-muted">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <div className="bg-primary h-12 w-12 rounded-full flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-primary-foreground" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center">
              Create an Account
            </CardTitle>
            <CardDescription className="text-center">
              Sign up as a student to access the library
            </CardDescription>

            {/* Progress indicator */}
            <div className="flex items-center justify-center mt-4">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-medium">
                  1
                </div>
                <div
                  className={`h-1 w-12 ${step === 2 ? "bg-primary" : "bg-muted"}`}
                ></div>
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${step === 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"} font-medium`}
                >
                  2
                </div>
              </div>
            </div>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {step === 1 ? (
                <>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      <Label htmlFor="email">Email</Label>
                    </div>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your.email@example.com"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="transition-all focus-visible:ring-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-muted-foreground" />
                      <Label htmlFor="name">Full Name</Label>
                    </div>
                    <Input
                      id="name"
                      name="name"
                      placeholder=""
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="transition-all focus-visible:ring-primary"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Lock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <Label htmlFor="password">Password</Label>
                    </div>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="transition-all focus-visible:ring-primary"
                    />
                    <p className="text-xs text-muted-foreground">
                      Password must be at least 6 characters
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Lock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                    </div>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="transition-all focus-visible:ring-primary"
                    />
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter className="flex flex-col">
              {step === 1 ? (
                <Button
                  type="button"
                  className="w-full"
                  onClick={handleNextStep}
                >
                  Continue
                </Button>
              ) : (
                <>
                  {error && (
                    <p className="text-red-500 text-sm mb-4">{error}</p>
                  )}
                  <Button type="submit" className="w-full">
                    Sign Up
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="mt-2"
                    onClick={() => setStep(1)}
                  >
                    Back
                  </Button>
                </>
              )}
              <p className="mt-4 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:underline">
                  Login
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
