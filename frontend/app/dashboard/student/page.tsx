"use client";

import { useState, useEffect } from "react";
import { BookOpen, Clock, AlertCircle } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/components/dashboard-layout";
import { getMyDueBooks } from "@/services/api"; // Adjust path to your api.js file
import Cookies from "js-cookie";

// Define the type for borrow records
type BorrowRecord = {
  status: string;
  dueDate: string;
  book?: any;
};

export default function StudentDashboard() {
  // State variables for counts, loading, and errors
  const [booksBorrowed, setBooksBorrowed] = useState(0);
  const [pendingRequests, setPendingRequests] = useState(0);
  const [overdueBooks, setOverdueBooks] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    const storedUserName = Cookies.get("userName");
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, []);

  // Fetch data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await getMyDueBooks();
        const dueBooks: BorrowRecord[] = data.dueBooks;

        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize to midnight for comparison

        // Calculate counts
        const borrowed = dueBooks.filter(
          (book) => book.status === "approved"
        ).length;
        const pending = dueBooks.filter(
          (book) => book.status === "pending"
        ).length;
        const overdue = dueBooks.filter((book) => {
          if (book.status !== "approved") return false;
          const dueDate = new Date(book.dueDate);
          dueDate.setHours(0, 0, 0, 0);
          return dueDate < today;
        }).length;

        // Update state
        setBooksBorrowed(borrowed);
        setPendingRequests(pending);
        setOverdueBooks(overdue);
        setIsLoading(false);
      } catch (err) {
        setError("Failed to load dashboard data");
        setIsLoading(false);
      }
    };
    fetchData();
  }, []); // Empty dependency array to run once on mount

  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome {userName}!
            </h1>
            <p className="text-muted-foreground">
              Here's an overview of your library activities
            </p>
          </div>
        </div>

        {/* Display error message if fetch fails */}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-300">
                Books Borrowed
              </CardTitle>
              <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-sm text-muted-foreground">Loading...</p>
              ) : (
                <>
                  <div className="text-2xl font-bold text-blue-800 dark:text-blue-300">
                    {booksBorrowed}
                  </div>
                  <br></br>
                  <p className="text-xs text-blue-600 dark:text-blue-400">
                    currently in your possession
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 border-amber-200 dark:border-amber-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-amber-800 dark:text-amber-300">
                Pending Requests
              </CardTitle>
              <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-sm text-muted-foreground">Loading...</p>
              ) : (
                <>
                  <div className="text-2xl font-bold text-amber-800 dark:text-amber-300">
                    {pendingRequests}
                  </div>
                  <br></br>
                  <p className="text-xs text-amber-600 dark:text-amber-400">
                    awaiting librarian approval
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 border-red-200 dark:border-red-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-800 dark:text-red-300">
                Overdue Books
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-sm text-muted-foreground">Loading...</p>
              ) : (
                <>
                  <div className="text-2xl font-bold text-red-800 dark:text-red-300">
                    {overdueBooks}
                  </div>
                  <br></br>
                  <p className="text-xs text-red-600 dark:text-red-400">
                    return as soon as possible
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

