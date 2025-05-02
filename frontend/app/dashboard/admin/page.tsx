import { Users, BookOpen, User } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import DashboardLayout from "@/components/dashboard-layout"

export default function AdminDashboard() {
  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Here's an overview of the library system administration
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
              <div className="text-2xl font-bold text-purple-800 dark:text-purple-300">12</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

// Sample data
const librarians = [
  {
    name: "Jane Smith",
    email: "jane.smith@library.com",
    status: "active",
  },
  {
    name: "John Doe",
    email: "john.doe@library.com",
    status: "active",
  },
  {
    name: "Emily Johnson",
    email: "emily.johnson@library.com",
    status: "active",
  },
  {
    name: "Michael Brown",
    email: "michael.brown@library.com",
    status: "inactive",
  },
]
