import { BookOpen, Clock, CheckCircle, AlertCircle, ArrowUpRight } from "lucide-react"
import Link from "next/link"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import DashboardLayout from "@/components/dashboard-layout"

export default function StudentDashboard() {
  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome back, Alex</h1>
            <p className="text-muted-foreground">Here's an overview of your library activities</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-300">Books Borrowed</CardTitle>
              <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-800 dark:text-blue-300">3</div>
              <p className="text-xs text-blue-600 dark:text-blue-400">Currently in your possession</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 border-amber-200 dark:border-amber-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-amber-800 dark:text-amber-300">Pending Requests</CardTitle>
              <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-800 dark:text-amber-300">2</div>
              <p className="text-xs text-amber-600 dark:text-amber-400">Awaiting librarian approval</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 border-red-200 dark:border-red-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-800 dark:text-red-300">Overdue Books</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-800 dark:text-red-300">1</div>
              <p className="text-xs text-red-600 dark:text-red-400">Please return as soon as possible</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

// Helper functions
function getDueDateColor(daysLeft: number) {
  if (daysLeft <= 0) return "bg-red-500"
  if (daysLeft <= 2) return "bg-amber-500"
  return "bg-green-500"
}

function getDueDateTextColor(daysLeft: number) {
  if (daysLeft <= 0) return "text-red-500 font-medium"
  if (daysLeft <= 2) return "text-amber-500"
  return "text-green-500"
}

// Sample data
const currentlyBorrowed = [
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    dueDate: "March 20, 2025",
    daysLeft: 4,
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    dueDate: "March 18, 2025",
    daysLeft: 2,
  },
  {
    title: "1984",
    author: "George Orwell",
    dueDate: "March 15, 2025",
    daysLeft: -1,
  },
]

const popularBooks = [
  { title: "Brave New World", author: "Aldous Huxley" },
  { title: "The Catcher in the Rye", author: "J.D. Salinger" },
  { title: "Lord of the Flies", author: "William Golding" },
  { title: "Animal Farm", author: "George Orwell" },
  { title: "Fahrenheit 451", author: "Ray Bradbury" },
  { title: "The Hobbit", author: "J.R.R. Tolkien" },
]
