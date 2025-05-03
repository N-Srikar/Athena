"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Search, CheckCircle, AlertCircle, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DashboardLayout from "@/components/dashboard-layout";
import { getBorrowHistory, returnBook } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";

export default function ManageReturns() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBorrowing, setSelectedBorrowing] = useState<Borrowing | null>(
    null
  );
  const [returnDialogOpen, setReturnDialogOpen] = useState(false);
  const [fineAmount, setFineAmount] = useState("0");
  const [borrowings, setBorrowings] = useState<Borrowing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch active borrowings on component mount
  useEffect(() => {
    const fetchBorrowings = async () => {
      try {
        setIsLoading(true);
        const history = await getBorrowHistory();
        // Filter for currently borrowed books: approved and not yet returned
        const activeBorrowings = history.filter(
          (record: Borrowing) =>
            record.status === "approved" && !record.returnedAt
        );
        setBorrowings(activeBorrowings);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to load borrowings");
      } finally {
        setIsLoading(false);
      }
    };
    fetchBorrowings();
  }, []);

  // Filter borrowings based on search query
  const filteredBorrowings = borrowings.filter(
    (borrowing) =>
      String(borrowing.book.title)
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      String(borrowing.user.name)
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  // Helper functions for date calculations
  function isOverdue(borrowing: Borrowing): boolean {
    const today = new Date();
    const dueDate = new Date(borrowing.dueDate);
    return today > dueDate;
  }

  function normalizeDate(date: Date): Date {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  function getDaysOverdue(borrowing: Borrowing): number {
    const today = normalizeDate(new Date());
    const dueDate = normalizeDate(new Date(borrowing.dueDate));
    if (dueDate >= today) return 0;
    const diffTime = today.getTime() - dueDate.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }

  function getDaysLeft(borrowing: Borrowing): number {
    const today = normalizeDate(new Date());
    const dueDate = normalizeDate(new Date(borrowing.dueDate));
    if (dueDate < today) return 0;
    const diffTime = dueDate.getTime() - today.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }

  // Handle "Mark as Returned" button click
  const handleReturnClick = (borrowing: Borrowing) => {
    setSelectedBorrowing(borrowing);
    const daysOverdue = getDaysOverdue(borrowing);
    const fine = daysOverdue > 0 ? (daysOverdue * 1).toFixed(2) : "0.00"; // $1 per day
    setFineAmount(fine);
    setReturnDialogOpen(true);
  };

  // Confirm return and call the backend
  const confirmReturn = async () => {
    if (!selectedBorrowing) return;

    try {
      await returnBook(selectedBorrowing._id, parseFloat(fineAmount));
      toast({ title: "Book marked as returned successfully", duration: 2000 });
      // Remove the returned book from the list
      setBorrowings((prev) =>
        prev.filter((b) => b._id !== selectedBorrowing._id)
      );
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to process return",
        variant: "destructive",
        duration: 2000,
      });
    } finally {
      setReturnDialogOpen(false);
      setSelectedBorrowing(null);
    }
  };

  return (
    <DashboardLayout role="librarian">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Manage Borrowed Books
          </h1>
          <p className="text-muted-foreground">
            Manage Book Returns and handle Overdues
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Current Borrowings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mt-4 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by Book Title or Student Name..."
                className="pl-8 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Book Title</TableHead>
                  <TableHead className="text-center">Student</TableHead>
                  <TableHead className="text-center">Borrow Date</TableHead>
                  <TableHead className="text-center">Due Date</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Loading borrowings…
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 text-destructive"
                    >
                      Error: {error}
                    </TableCell>
                  </TableRow>
                ) : filteredBorrowings.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No active borrowings found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBorrowings.map((borrowing) => (
                    <TableRow key={borrowing._id}>
                      <TableCell className="text-center font-medium">
                        {borrowing.book.title}
                      </TableCell>
                      <TableCell className="text-center">
                        {borrowing.user.name}
                      </TableCell>
                      <TableCell className="text-center">
                        {new Date(borrowing.requestDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-center">
                        {new Date(borrowing.dueDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-center">
                        {isOverdue(borrowing) ? (
                          <div className="flex justify-center items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-red-500" />
                            <span className="text-red-500">
                              Overdue by {getDaysOverdue(borrowing)} days
                            </span>
                          </div>
                        ) : (
                          <div className="flex justify-center items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>{getDaysLeft(borrowing)} days left</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          size="sm"
                          className="h-8 gap-1"
                          onClick={() => handleReturnClick(borrowing)}
                        >
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
            <DialogDescription>
              Record the return of a book and assess any fines if necessary
            </DialogDescription>
          </DialogHeader>

          {selectedBorrowing && (
            <div className="py-4">
              <div className="space-y-1 mb-4">
                <p className="text-sm font-medium">
                  Book : {selectedBorrowing.book.title}
                </p>
                <p className="text-sm text-medium">
                  Student : {selectedBorrowing.user.name}
                </p>
                <br></br>
                <p className="text-sm text-muted-foreground">
                  Borrowed on :{" "}
                  {new Date(selectedBorrowing.requestDate).toLocaleDateString()}
                </p>
                <p className="text-sm text-muted-foreground">
                  Due date :{" "}
                  {new Date(selectedBorrowing.dueDate).toLocaleDateString()}
                </p>
                <p className="text-sm text-muted-foreground">
                  Returned on : {new Date().toLocaleDateString()}
                </p>
                {isOverdue(selectedBorrowing) && (
                  <p className="text-sm font-medium text-red-500 mt-2">
                    Overdue by {getDaysOverdue(selectedBorrowing)} days
                  </p>
                )}
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fine">
                    <span className="text-xl">Fine Amount : </span>
                    <span className="text-xl font-medium">
                      ₹{" "}
                      {isOverdue(selectedBorrowing)
                        ? (getDaysOverdue(selectedBorrowing) * 1.0).toFixed(2)
                        : "0.00"}
                    </span>
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {!isOverdue(selectedBorrowing) &&
                      "No fine for on-time returns."}
                  </p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setReturnDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={confirmReturn}>Mark as Returned</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}

// Helper component for the Label
function Label({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    >
      {children}
    </label>
  );
}

// Type definition based on backend BorrowHistory schema
type Borrowing = {
  _id: string;
  book: {
    _id: string;
    title: string;
  };
  user: {
    _id: string;
    name: string;
  };
  status: string;
  requestDate: string;
  dueDate: string;
  returnedAt?: string;
  fine?: number;
};
