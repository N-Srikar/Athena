"use client";

import type React from "react";
import Cookies from "js-cookie";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, ArrowLeft, User, Lock, UserCircle } from "lucide-react";
import { loginUser } from "@/services/api";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<string>("student");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await loginUser(formData);
      if (response.token) {
        // Login successful, redirect to dashboard
        const role = response.role;
        const token = response.token;
        const name = response.name;
        Cookies.set("token", token, { expires: 1, path: "/" });
        window.location.href = `/dashboard/${role}`;
        Cookies.set("role", role, { expires: 1, path: "/" });
        Cookies.set("userName", name, { path: "/", expires: 1 });
        router.refresh();
        if (role === "student") {
          router.push("/dashboard/student");
        } else if (role === "librarian") {
          router.push("/dashboard/librarian");
        } else if (role === "admin") {
          router.push("/dashboard/admin");
        }
      } else {
        setError("Invalid credentials");
      }
    } catch (error) {
      setError("Login failed");
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
              Welcome Back
            </CardTitle>
            <CardDescription className="text-center">
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="role">Select Role</Label>
                <RadioGroup
                  id="role"
                  value={role}
                  onValueChange={setRole}
                  className="grid grid-cols-3 gap-2"
                >
                  <div className="flex flex-col items-center">
                    <div
                      className={`rounded-md border-2 p-3 ${role === "student" ? "border-primary" : "border-muted"} transition-colors cursor-pointer`}
                      onClick={() => setRole("student")}
                    >
                      <UserCircle
                        className={`h-6 w-6 mx-auto ${role === "student" ? "text-primary" : "text-muted-foreground"}`}
                      />
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <RadioGroupItem
                        value="student"
                        id="student"
                        className="sr-only"
                      />
                      <Label
                        htmlFor="student"
                        className={`text-sm ${role === "student" ? "font-medium text-primary" : "text-muted-foreground"}`}
                      >
                        Student
                      </Label>
                    </div>
                  </div>

                  <div className="flex flex-col items-center">
                    <div
                      className={`rounded-md border-2 p-3 ${role === "librarian" ? "border-primary" : "border-muted"} transition-colors cursor-pointer`}
                      onClick={() => setRole("librarian")}
                    >
                      <User
                        className={`h-6 w-6 mx-auto ${role === "librarian" ? "text-primary" : "text-muted-foreground"}`}
                      />
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <RadioGroupItem
                        value="librarian"
                        id="librarian"
                        className="sr-only"
                      />
                      <Label
                        htmlFor="librarian"
                        className={`text-sm ${role === "librarian" ? "font-medium text-primary" : "text-muted-foreground"}`}
                      >
                        Librarian
                      </Label>
                    </div>
                  </div>

                  <div className="flex flex-col items-center">
                    <div
                      className={`rounded-md border-2 p-3 ${role === "admin" ? "border-primary" : "border-muted"} transition-colors cursor-pointer`}
                      onClick={() => setRole("admin")}
                    >
                      <Lock
                        className={`h-6 w-6 mx-auto ${role === "admin" ? "text-primary" : "text-muted-foreground"}`}
                      />
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <RadioGroupItem
                        value="admin"
                        id="admin"
                        className="sr-only"
                      />
                      <Label
                        htmlFor="admin"
                        className={`text-sm ${role === "admin" ? "font-medium text-primary" : "text-muted-foreground"}`}
                      >
                        Admin
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-muted-foreground" />
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
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Lock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <Label htmlFor="password">Password</Label>
                  </div>
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
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              {error && <p className="text-red-500 text-md mb-5">{error}</p>}
              <Button type="submit" className="w-full">
                Login
              </Button>
              {role === "student" && (
                <p className="mt-4 text-center text-sm text-muted-foreground">
                  Don&apos;t have an account?{" "}
                  <Link href="/signup" className="text-primary hover:underline">
                    Sign up
                  </Link>
                </p>
              )}
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
