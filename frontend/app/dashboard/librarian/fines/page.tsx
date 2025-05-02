"use client"

import type React from "react"

import { useState } from "react"
import { Search, DollarSign, CheckCircle, AlertCircle } from "lucide-react"

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DashboardLayout from "@/components/dashboard-layout"
import { Badge } from "@/components/ui/badge"

export default function ManageFines() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedFine, setSelectedFine] = useState<Fine | null>(null)
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)
  const [paymentAmount, setPaymentAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("cash")

  const filteredFines = fines.filter(
    (fine) =>
      (statusFilter === "all" || fine.status === statusFilter) &&
      (fine.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fine.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fine.bookTitle.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const unpaidFines = filteredFines.filter((fine) => fine.status === "unpaid")
  const paidFines = filteredFines.filter((fine) => fine.status === "paid")

  const handlePaymentClick = (fine: Fine) => {
    setSelectedFine(fine)
    setPaymentAmount(fine.amount.toString())
    setPaymentDialogOpen(true)
  }

  const confirmPayment = () => {
    if (!selectedFine) return

    // In a real app, you would send this to the backend
    console.log("Processing payment:", {
      fineId: selectedFine.id,
      amount: Number.parseFloat(paymentAmount),
      method: paymentMethod,
    })

    setPaymentDialogOpen(false)
    setSelectedFine(null)
  }

  return (
    <DashboardLayout role="librarian">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Fines</h1>
          <p className="text-muted-foreground">Track and collect fines for overdue or damaged books</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Fines</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${fines.reduce((total, fine) => total + fine.amount, 0).toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">From {fines.length} students</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unpaid Fines</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                $
                {fines
                  .filter((fine) => fine.status === "unpaid")
                  .reduce((total, fine) => total + fine.amount, 0)
                  .toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                From {fines.filter((fine) => fine.status === "unpaid").length} students
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Collected Fines</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                $
                {fines
                  .filter((fine) => fine.status === "paid")
                  .reduce((total, fine) => total + fine.amount, 0)
                  .toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                From {fines.filter((fine) => fine.status === "paid").length} students
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by student or book..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="unpaid">Unpaid</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="unpaid" className="w-full">
          <TabsList>
            <TabsTrigger value="unpaid" className="relative">
              Unpaid
              {unpaidFines.length > 0 && (
                <Badge className="ml-2 bg-primary text-primary-foreground">{unpaidFines.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="paid">Paid</TabsTrigger>
          </TabsList>

          <TabsContent value="unpaid" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Unpaid Fines</CardTitle>
                <CardDescription>Fines that need to be collected from students</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Issue Date</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Book</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {unpaidFines.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No unpaid fines found
                        </TableCell>
                      </TableRow>
                    ) : (
                      unpaidFines.map((fine) => (
                        <TableRow key={fine.id}>
                          <TableCell>{fine.issueDate}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{fine.studentName}</p>
                              <p className="text-xs text-muted-foreground">{fine.studentId}</p>
                            </div>
                          </TableCell>
                          <TableCell>{fine.bookTitle}</TableCell>
                          <TableCell>{fine.reason}</TableCell>
                          <TableCell className="font-medium">${fine.amount.toFixed(2)}</TableCell>
                          <TableCell className="text-right">
                            <Button size="sm" className="h-8 gap-1" onClick={() => handlePaymentClick(fine)}>
                              <DollarSign className="h-4 w-4" />
                              <span>Collect</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="paid" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Paid Fines</CardTitle>
                <CardDescription>History of fines that have been paid</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Issue Date</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Book</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Payment Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paidFines.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No paid fines found
                        </TableCell>
                      </TableRow>
                    ) : (
                      paidFines.map((fine) => (
                        <TableRow key={fine.id}>
                          <TableCell>{fine.issueDate}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{fine.studentName}</p>
                              <p className="text-xs text-muted-foreground">{fine.studentId}</p>
                            </div>
                          </TableCell>
                          <TableCell>{fine.bookTitle}</TableCell>
                          <TableCell>{fine.reason}</TableCell>
                          <TableCell className="font-medium">${fine.amount.toFixed(2)}</TableCell>
                          <TableCell>{fine.paymentDate}</TableCell>
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

      {/* Payment Dialog */}
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Collect Payment</DialogTitle>
            <DialogDescription>Record payment for the selected fine</DialogDescription>
          </DialogHeader>

          {selectedFine && (
            <div className="py-4">
              <div className="space-y-1 mb-4">
                <p className="text-sm font-medium">
                  Student: {selectedFine.studentName} ({selectedFine.studentId})
                </p>
                <p className="text-sm text-muted-foreground">Book: {selectedFine.bookTitle}</p>
                <p className="text-sm text-muted-foreground">Reason: {selectedFine.reason}</p>
                <p className="text-sm font-medium mt-2">Total Amount: ${selectedFine.amount.toFixed(2)}</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Payment Amount</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      min="0"
                      max={selectedFine.amount}
                      className="pl-8"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="method">Payment Method</Label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger id="method">
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="card">Credit/Debit Card</SelectItem>
                      <SelectItem value="online">Online Payment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setPaymentDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmPayment}>Record Payment</Button>
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
type Fine = {
  id: string
  studentName: string
  studentId: string
  bookTitle: string
  reason: string
  amount: number
  issueDate: string
  status: "paid" | "unpaid"
  paymentDate?: string
  paymentMethod?: string
  collectedBy?: string
}

// Sample data
const fines: Fine[] = [
  {
    id: "fine-001",
    studentName: "Alice Johnson",
    studentId: "S12345",
    bookTitle: "1984",
    reason: "Overdue by 15 days",
    amount: 15.0,
    issueDate: "March 10, 2025",
    status: "unpaid",
  },
  {
    id: "fine-002",
    studentName: "Bob Smith",
    studentId: "S23456",
    bookTitle: "The Hobbit",
    reason: "Damaged book",
    amount: 25.5,
    issueDate: "March 8, 2025",
    status: "unpaid",
  },
  {
    id: "fine-003",
    studentName: "Charlie Brown",
    studentId: "S34567",
    bookTitle: "Pride and Prejudice",
    reason: "Overdue by 7 days",
    amount: 7.0,
    issueDate: "March 5, 2025",
    status: "unpaid",
  },
  {
    id: "fine-004",
    studentName: "Diana Prince",
    studentId: "S45678",
    bookTitle: "The Great Gatsby",
    reason: "Overdue by 10 days",
    amount: 10.0,
    issueDate: "March 1, 2025",
    status: "paid",
    paymentDate: "March 12, 2025",
    paymentMethod: "cash",
    collectedBy: "Jane Smith",
  },
  {
    id: "fine-005",
    studentName: "Ethan Hunt",
    studentId: "S56789",
    bookTitle: "To Kill a Mockingbird",
    reason: "Lost book",
    amount: 35.0,
    issueDate: "February 25, 2025",
    status: "paid",
    paymentDate: "March 10, 2025",
    paymentMethod: "card",
    collectedBy: "John Doe",
  },
  {
    id: "fine-006",
    studentName: "Fiona Gallagher",
    studentId: "S67890",
    bookTitle: "A Brief History of Time",
    reason: "Overdue by 20 days",
    amount: 20.0,
    issueDate: "February 20, 2025",
    status: "paid",
    paymentDate: "March 5, 2025",
    paymentMethod: "online",
    collectedBy: "Jane Smith",
  },
]
