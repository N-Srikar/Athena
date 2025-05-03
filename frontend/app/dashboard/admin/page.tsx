"use client";

import { User } from "lucide-react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/components/dashboard-layout";
import { getLibrarians } from "@/services/api";
import Cookies from "js-cookie";

export default function AdminDashboard() {
  const [userName, setUserName] = useState("User");
  const [librarianCount, setLibrarianCount] = useState(0);

  useEffect(() => {
    const storedUserName = Cookies.get("userName");
    if (storedUserName) {
      setUserName(storedUserName);
    }
    getLibrarians()
      .then((data) => {
        setLibrarianCount(data.length);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold ">Welcome {userName}!</h1>
            <p className="text-muted-foreground">
              Here's an overview of the Library System.
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-800 dark:text-purple-300">
                Total Librarians
              </CardTitle>
              <User className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-800 dark:text-purple-300">
                {librarianCount}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
