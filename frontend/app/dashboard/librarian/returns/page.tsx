"use client"

import type React from "react"

import { useState } from "react"
import { Search, CheckCircle, AlertCircle, DollarSign } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import DashboardLayout from "@/components/dashboard-layout"

export default function ManageReturns() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedBorrowing, setSelectedBorrowing] = useState<Borrowing | null>(null)
  const [returnDialogOpen, setReturnDialogOpen] = useState(false)
  const [fineAmount, setFineAmount] = useState("0")

  const filteredBorrowings = borrowings.filter(
    (borrowing) =>
      borrowing.bookTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      borrowing.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      borrowing.studentId.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  function isOverdue(borrowing: Borrowing): boolean {
    const today = new Date()
    const dueDate = new Date(borrowing.dueDate)
    return today > dueDate
  }

  function getDaysOverdue(borrowing: Borrowing): number {
    if (!isOverdue(borrowing)) return 0
    const today = new Date()
    const dueDate = new Date(borrowing.dueDate)
    const diffTime = Math.abs(today.getTime() - dueDate.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const handleReturnClick = (borrowing: Borrowing) => {
    setSelectedBorrowing(borrowing)
    setFineAmount(isOverdue(borrowing) ? (getDaysOverdue(borrowing) * 1).toString() : "0")
    setReturnDialogOpen(true)
  }

  const confirmReturn = () => {
    if (!selectedBorrowing) return

    // In a real app, you would send this to the backend
    console.log("Processing return:", {
      borrowingId: selectedBorrowing.id,
      fineAmount: Number.parseFloat(fineAmount),
    })

    setReturnDialogOpen(false)
    setSelectedBorrowing(null)
  }

  return (
    <DashboardLayout role="librarian">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Borrowed Books</h1>
          <p className="text-muted-foreground">Process book returns and handle overdue items</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Current Borrowings</CardTitle>
            <CardDescription>Books that are currently checked out</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Book Title</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Borrow Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBorrowings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No borrowings found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBorrowings.map((borrowing) => (
                    <TableRow key={borrowing.id}>
                      <TableCell className="font-medium">{borrowing.bookTitle}</TableCell>
                      <TableCell>
                        <div>
                          <p>{borrowing.studentName}</p>
                        </div>
                      </TableCell>
                      <TableCell>{borrowing.borrowDate}</TableCell>
                      <TableCell>{borrowing.dueDate}</TableCell>
                      <TableCell>
                        {isOverdue(borrowing) ? (
                          <div className="flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-red-500" />
                            <span className="text-red-500">Overdue by {getDaysOverdue(borrowing)} days</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>Current</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" className="h-8 gap-1" onClick={() => handleReturnClick(borrowing)}>
                          <CheckCircle className="h-4 w-4" />
                          <span>Mark as Returned</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Return Dialog */}
      <Dialog open={returnDialogOpen} onOpenChange={setReturnDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Process Book Return</DialogTitle>
            <DialogDescription>Record the return of a book and assess any fines if necessary</DialogDescription>
          </DialogHeader>

          {selectedBorrowing && (
            <div className="py-4">
              <div className="space-y-1 mb-4">
                <p className="text-sm font-medium">Book: {selectedBorrowing.bookTitle}</p>
                <p className="text-sm text-muted-foreground">
                  Student: {selectedBorrowing.studentName} ({selectedBorrowing.studentId})
                </p>
                <p className="text-sm text-muted-foreground">Borrowed on: {selectedBorrowing.borrowDate}</p>
                <p className="text-sm text-muted-foreground">Due date: {selectedBorrowing.dueDate}</p>

                {isOverdue(selectedBorrowing) && (
                  <p className="text-sm font-medium text-red-500 mt-2">
                    Overdue by {getDaysOverdue(selectedBorrowing)} days
                  </p>
                )}
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fine">Fine Amount</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="fine"
                      type="number"
                      step="0.01"
                      min="0"
                      className="pl-8"
                      value={fineAmount}
                      onChange={(e) => setFineAmount(e.target.value)}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {!isOverdue(selectedBorrowing) && "No fine for on-time returns."}
                    {isOverdue(selectedBorrowing) &&
                      `$1.00 per day overdue (${getDaysOverdue(selectedBorrowing)} days).`}
                  </p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setReturnDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmReturn}>Process Return</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}

// Helper component for the Label
function Label({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    >
      {children}
    </label>
  )
}

// Types
type Borrowing = {
  id: string
  bookTitle: string
  bookId: string
  studentName: string
  studentId: string
  borrowDate: string
  dueDate: string
}

// Sample data
const borrowings: Borrowing[] = [
  {
    id: "borrow-001",
    bookTitle: "To Kill a Mockingbird",
    bookId: "1",
    studentName: "Alice Johnson",
    studentId: "S12345",
    borrowDate: "March 1, 2025",
    dueDate: "March 15, 2025",
  },
  {
    id: "borrow-002",
    bookTitle: "The Great Gatsby",
    bookId: "3",
    studentName: "Bob Smith",
    studentId: "S23456",
    borrowDate: "March 5, 2025",
    dueDate: "March 19, 2025",
  },
  {
    id: "borrow-003",
    bookTitle: "Pride and Prejudice",
    bookId: "4",
    studentName: "Charlie Brown",
    studentId: "S34567",
    borrowDate: "February 25, 2025",
    dueDate: "March 11, 2025",
  },
  {
    id: "borrow-004",
    bookTitle: "1984",
    bookId: "2",
    studentName: "Diana Prince",
    studentId: "S45678",
    borrowDate: "February 20, 2025",
    dueDate: "March 6, 2025",
  },
]
