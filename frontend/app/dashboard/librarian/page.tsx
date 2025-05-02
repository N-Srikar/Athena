import { BookOpen, Users, Clock, AlertCircle, ArrowUpRight } from "lucide-react"
import Link from "next/link"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import DashboardLayout from "@/components/dashboard-layout"

export default function LibrarianDashboard() {
  return (
    <DashboardLayout role="librarian">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome back, Sarah</h1>
            <p className="text-muted-foreground">Here's an overview of the library system</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900 border-indigo-200 dark:border-indigo-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-indigo-800 dark:text-indigo-300">Total Books</CardTitle>
              <BookOpen className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-indigo-800 dark:text-indigo-300">1,248</div>
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
              <div className="text-2xl font-bold text-violet-800 dark:text-violet-300">573</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 border-amber-200 dark:border-amber-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-amber-800 dark:text-amber-300">Pending Requests</CardTitle>
              <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-800 dark:text-amber-300">24</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 border-red-200 dark:border-red-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-800 dark:text-red-300">Overdue Books</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-800 dark:text-red-300">18</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

// Sample data
const recentRequests = [
  {
    bookTitle: "To Kill a Mockingbird",
    student: "Alice Johnson",
    date: "Today, 10:23 AM",
  },
  {
    bookTitle: "The Great Gatsby",
    student: "Bob Smith",
    date: "Today, 9:15 AM",
  },
  {
    bookTitle: "Pride and Prejudice",
    student: "Charlie Brown",
    date: "Yesterday, 3:45 PM",
  },
]

const dueTodayBooks = [
  {
    title: "The Hobbit",
    student: "Ethan Hunt",
  },
  {
    title: "Brave New World",
    student: "Fiona Gallagher",
  },
  {
    title: "The Catcher in the Rye",
    student: "George Washington",
  },
]
