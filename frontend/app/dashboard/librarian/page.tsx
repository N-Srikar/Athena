"use client";
import {
  BookOpen,
  Clock,
  AlertCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/components/dashboard-layout";
import Cookies from "js-cookie";
import {
  getBooks,
  getBorrowHistory,
  getPendingRequests,
  getOverdueRecords,
} from "@/services/api";

export default function LibrarianDashboard() {
  const [totalBooks, setTotalBooks] = useState<number>(0);
  const [borrowedCount, setBorrowedCount] = useState<number>(0);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [overdueCount, setOverdueCount] = useState<number>(0);
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    const storedUserName = Cookies.get("userName");
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, []);

  useEffect(() => {
    // Fetch all stats in parallel
    Promise.all([
      getBooks(),
      getBorrowHistory(),
      getPendingRequests(),
      getOverdueRecords(),
    ])
      .then(([books, history, pending, overdue]) => {
        // setTotalBooks(Array.isArray(books) ? books.length : 0);
        const totalBooks = books.reduce(
          (acc: number, book: any) => acc + book.totalCopies,
          0
        );
        setTotalBooks(totalBooks);

        // currently borrowed = those without a returnDate
        const currentlyBorrowed = Array.isArray(history)
          ? history.filter((r) => r.status === "approved" && !r.returnDate)
              .length
          : 0;
        setBorrowedCount(currentlyBorrowed);

        setPendingCount(Array.isArray(pending) ? pending.length : 0);
        setOverdueCount(Array.isArray(overdue) ? overdue.length : 0);
      })
      .catch((err) => {
        console.error("Dashboard load error:", err);
        // you might want to show a toast here
      });
  }, []);

  return (
    <DashboardLayout role="librarian">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome {userName}!
            </h1>
            <p className="text-muted-foreground">
              Here's an overview of the Library System.
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900 border-indigo-200 dark:border-indigo-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-indigo-800 dark:text-indigo-300">
                Total Books
              </CardTitle>
              <BookOpen className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-indigo-800 dark:text-indigo-300">
                {totalBooks}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-violet-50 to-violet-100 dark:from-violet-950 dark:to-violet-900 border-violet-200 dark:border-violet-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-violet-800 dark:text-violet-300">
                Books Borrowed
              </CardTitle>
              <BookOpen className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-violet-800 dark:text-violet-300">
                {borrowedCount}
              </div>
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
              <div className="text-2xl font-bold text-amber-800 dark:text-amber-300">
                {pendingCount}
              </div>
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
              <div className="text-2xl font-bold text-red-800 dark:text-red-300">
                {overdueCount}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}