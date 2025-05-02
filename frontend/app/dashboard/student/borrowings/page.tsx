"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DashboardLayout from "@/components/dashboard-layout"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"

type Borrowing = {
  id: string
  bookTitle: string
  bookId: string
  borrowDate: string
  dueDate: string
  status: string
  returnDate?: string
  isOverdue?: boolean
  fine?: number
  daysOverdue?: number
  daysLeft?: number
}

export default function StudentBorrowings() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [borrowings, setBorrowings] = useState<Borrowing[]>([])
  const [pendingRequests, setPendingRequests] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Mock student ID - in a real app, this would come from authentication
  const studentId = "S12345"

  useEffect(() => {
    fetchBorrowings()
  }, [])

  const fetchBorrowings = async () => {
    try {
      setIsLoading(true)

      // Sample data for demonstration
      // In a real app, you would fetch from the API
      // const response = await fetch(`/api/member/due?studentId=${studentId}`)
      // const data = await response.json()

      // Mock data
      const mockBorrowings = [
        {
          id: "borrow-001",
          bookTitle: "To Kill a Mockingbird",
          bookId: "1",
          borrowDate: "2025-03-01",
          dueDate: "2025-03-15",
          status: "borrowed",
          isOverdue: false,
          daysLeft: 4,
        },
        {
          id: "borrow-002",
          bookTitle: "The Great Gatsby",
          bookId: "3",
          borrowDate: "2025-03-05",
          dueDate: "2025-03-19",
          status: "borrowed",
          isOverdue: false,
          daysLeft: 2,
        },
        {
          id: "borrow-003",
          bookTitle: "Pride and Prejudice",
          bookId: "4",
          borrowDate: "2025-02-25",
          dueDate: "2025-03-11",
          status: "borrowed",
          isOverdue: true,
          daysOverdue: 1,
        },
        {
          id: "borrow-004",
          bookTitle: "The Hobbit",
          bookId: "8",
          borrowDate: "2025-02-15",
          dueDate: "2025-03-01",
          status: "returned",
          fine:10.1232,
          returnDate: "2025-03-01",
        },
      ]

      const mockPendingRequests = [
        {
          id: "req-001",
          bookTitle: "1984",
          requestDate: "2025-03-15",
          status: "pending",
        },
      ]

      setBorrowings(mockBorrowings)
      setPendingRequests(mockPendingRequests)
    } catch (error) {
      console.error("Error fetching borrowings:", error)
      toast({
        title: "Error",
        description: "Failed to load borrowings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filteredBorrowings = borrowings.filter(
    (borrowing) =>
      (statusFilter === "all" ||
        (statusFilter === "overdue" && borrowing.isOverdue) ||
        (statusFilter === "current" && !borrowing.isOverdue && borrowing.status === "borrowed") ||
        (statusFilter === "returned" && borrowing.status === "returned")) &&
      borrowing.bookTitle.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const currentBorrowings = filteredBorrowings.filter((b) => b.status === "borrowed" && !b.isOverdue)
  const overdueBorrowings = filteredBorrowings.filter((b) => b.status === "borrowed" && b.isOverdue)
  const returnedBorrowings = filteredBorrowings.filter((b) => b.status === "returned")

  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Borrowings</h1>
          <p className="text-muted-foreground">Track your borrowed books and their due dates</p>
        </div>

        <Tabs defaultValue="current" className="w-full">
          <TabsList>
            <TabsTrigger value="current">Current</TabsTrigger>
            <TabsTrigger value="overdue" className="relative">
              Overdue
              {overdueBorrowings.length > 0 && <Badge className="ml-2 bg-red-500">{overdueBorrowings.length}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="returned">History</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Current Borrowings</CardTitle>
                <CardDescription>Books that you currently have checked out</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Book Title</TableHead>
                      <TableHead>Borrow Date</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Days Left</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                          Loading borrowings...
                        </TableCell>
                      </TableRow>
                    ) : currentBorrowings.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                          No current borrowings found
                        </TableCell>
                      </TableRow>
                    ) : (
                      currentBorrowings.map((borrowing) => (
                        <TableRow key={borrowing.id}>
                          <TableCell className="font-medium">{borrowing.bookTitle}</TableCell>
                          <TableCell>{borrowing.borrowDate}</TableCell>
                          <TableCell>{borrowing.dueDate}</TableCell>
                          <TableCell>
                            <span className="text-green-600 font-medium">{borrowing.daysLeft} days</span>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="overdue" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Overdue Books</CardTitle>
                <CardDescription>Books that are past their due date and need to be returned</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Book Title</TableHead>
                      <TableHead>Borrow Date</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Days Overdue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          Loading borrowings...
                        </TableCell>
                      </TableRow>
                    ) : overdueBorrowings.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          No overdue books found
                        </TableCell>
                      </TableRow>
                    ) : (
                      overdueBorrowings.map((borrowing) => (
                        <TableRow key={borrowing.id}>
                          <TableCell className="font-medium">{borrowing.bookTitle}</TableCell>
                          <TableCell>{borrowing.borrowDate}</TableCell>
                          <TableCell>{borrowing.dueDate}</TableCell>
                          <TableCell className="text-red-500 font-medium">{borrowing.daysOverdue} days</TableCell>
                          
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="returned" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Borrowing History</CardTitle>
                <CardDescription>Books that you have previously borrowed and returned</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Book Title</TableHead>
                      <TableHead>Borrow Date</TableHead>
                      <TableHead>Return Date</TableHead>
                      <TableHead>Fine</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                          Loading borrowings...
                        </TableCell>
                      </TableRow>
                    ) : returnedBorrowings.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                          No borrowing history found
                        </TableCell>
                      </TableRow>
                    ) : (
                      returnedBorrowings.map((borrowing) => (
                        <TableRow key={borrowing.id}>
                          <TableCell className="font-medium">{borrowing.bookTitle}</TableCell>
                          <TableCell>{borrowing.borrowDate}</TableCell>
                          <TableCell>{borrowing.returnDate}</TableCell>
                          <TableCell>
                           ₹ {borrowing.fine && borrowing.fine > 0 ? `${borrowing.fine.toFixed(2)}` : "0"}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pending" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Pending Requests</CardTitle>
                <CardDescription>Books that you have requested but are waiting for approval</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Book Title</TableHead>
                      <TableHead>Request Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                          Loading requests...
                        </TableCell>
                      </TableRow>
                    ) : pendingRequests.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                          No pending requests found
                        </TableCell>
                      </TableRow>
                    ) : (
                      pendingRequests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell className="font-medium">{request.bookTitle}</TableCell>
                          <TableCell>{request.requestDate}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className="bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-300 dark:border-yellow-800"
                            >
                              Pending
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
