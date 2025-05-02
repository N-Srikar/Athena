"use client"

import type React from "react"

import { useState } from "react"
import { Search, CheckCircle, XCircle, Clock } from "lucide-react"

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

export default function BorrowingRequests() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRequest, setSelectedRequest] = useState<BorrowRequest | null>(null)
  const [actionDialogOpen, setActionDialogOpen] = useState(false)
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")

  const filteredRequests = borrowRequests.filter(
    (request) =>
      request.bookTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.studentId.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAction = (request: BorrowRequest, action: "approve" | "reject") => {
    setSelectedRequest(request)
    setActionType(action)
    setActionDialogOpen(true)
    if (action === "reject") {
      setRejectionReason("")
    }
  }

  const confirmAction = () => {
    if (!selectedRequest || !actionType) return

    // In a real app, you would send this to the backend
    console.log(`${actionType === "approve" ? "Approving" : "Rejecting"} request:`, {
      requestId: selectedRequest.id,
      ...(actionType === "reject" && { reason: rejectionReason }),
    })

    setActionDialogOpen(false)
    setSelectedRequest(null)
    setActionType(null)
  }

  return (
    <DashboardLayout role="librarian">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Borrow Requests</h1>
          <p className="text-muted-foreground">Manage book borrowing requests from students</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Pending Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request Date</TableHead>
                  <TableHead>Book Title</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No pending requests found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>{request.requestDate}</TableCell>
                      <TableCell className="font-medium">{request.bookTitle}</TableCell>
                      <TableCell>{request.studentName}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 gap-1 text-destructive border-destructive hover:bg-destructive/10"
                            onClick={() => handleAction(request, "reject")}
                          >
                            <XCircle className="h-4 w-4" />
                            <span className="hidden sm:inline">Reject</span>
                          </Button>
                          <Button
                            size="sm"
                            className="h-8 gap-1 bg-green-600 hover:bg-green-700"
                            onClick={() => handleAction(request, "approve")}
                          >
                            <CheckCircle className="h-4 w-4" />
                            <span className="hidden sm:inline">Approve</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Action Dialog */}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{actionType === "approve" ? "Approve Request" : "Reject Request"}</DialogTitle>
            <DialogDescription>
              {actionType === "approve"
                ? "Confirm that you want to approve this borrowing request."
                : "Please provide a reason for rejecting this borrowing request."}
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="py-4">
              <div className="space-y-1 mb-4">
                <p className="text-sm font-medium">Book: {selectedRequest.bookTitle}</p>
                <p className="text-sm text-muted-foreground">
                  Student: {selectedRequest.studentName} ({selectedRequest.studentId})
                </p>
                <p className="text-sm text-muted-foreground">Requested on: {selectedRequest.requestDate}</p>
              </div>

              {actionType === "reject" && (
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for rejection</Label>
                  <Input
                    id="reason"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="e.g., Book is reserved, Student has overdue books"
                  />
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={confirmAction}
              className={
                actionType === "approve" ? "bg-green-600 hover:bg-green-700" : "bg-destructive hover:bg-destructive/90"
              }
            >
              {actionType === "approve" ? "Approve" : "Reject"}
            </Button>
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
type BorrowRequest = {
  id: string
  bookTitle: string
  bookId: string
  studentName: string
  studentId: string
  requestDate: string
}

// Sample data
const borrowRequests: BorrowRequest[] = [
  {
    id: "req-001",
    bookTitle: "To Kill a Mockingbird",
    bookId: "1",
    studentName: "Alice Johnson",
    studentId: "S12345",
    requestDate: "March 15, 2025",
  },
  {
    id: "req-002",
    bookTitle: "The Great Gatsby",
    bookId: "3",
    studentName: "Bob Smith",
    studentId: "S23456",
    requestDate: "March 14, 2025",
  },
  {
    id: "req-003",
    bookTitle: "Pride and Prejudice",
    bookId: "4",
    studentName: "Charlie Brown",
    studentId: "S34567",
    requestDate: "March 13, 2025",
  },
  {
    id: "req-004",
    bookTitle: "A Brief History of Time",
    bookId: "5",
    studentName: "Diana Prince",
    studentId: "S45678",
    requestDate: "March 12, 2025",
  },
]
