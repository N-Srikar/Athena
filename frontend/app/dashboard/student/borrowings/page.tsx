"use client";

import { useState, useEffect } from "react";
import { Search, ArrowUp, ArrowDown } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/dashboard-layout";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { getMyDueBooks, getMyBorrowHistory } from "@/services/api";

type Borrowing = {
  _id: string;
  book: { _id: string; title: string };
  approvedAt: string;
  dueDate: string;
  status: string;
  returnDate?: string;
  fine?: number;
  daysOverdue?: number;
  daysLeft?: number;
  requestDate?: string;
};

export default function StudentBorrowings() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [borrowings, setBorrowings] = useState<Borrowing[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Borrowing[]>([]);
  const [history, setHistory] = useState<Borrowing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc"); // For history tab
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);

      // Fetch current and pending borrowings
      const dueBooksResponse = await getMyDueBooks();
      const dueBooks = dueBooksResponse.dueBooks || [];

      // Fetch student's borrowing history (returned books)
      const historyRecords = await getMyBorrowHistory();

      // Process due books for current, overdue, and pending
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Normalize to midnight

      const processedBorrowings = dueBooks
        .filter((b: any) => b.status === "approved")
        .map((b: any) => {
          const dueDate = new Date(b.dueDate);
          dueDate.setHours(0, 0, 0, 0);
          const isOverdue = dueDate < today;
          const diffTime = Math.abs(dueDate.getTime() - today.getTime());
          const daysDiff = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          return {
            _id: b._id,
            book: { _id: b.book._id, title: b.book.title },
            approvedAt: b.borrowedAt || b.requestDate,
            dueDate: b.dueDate,
            status: b.status,
            returnDate: b.returnedAt,
            fine: b.fine,
            daysOverdue: isOverdue ? daysDiff : undefined,
            daysLeft: !isOverdue ? daysDiff : undefined,
          };
        });

      const processedPending = dueBooks
        .filter((b: any) => b.status === "pending")
        .map((b: any) => ({
          _id: b._id,
          book: { _id: b.book._id, title: b.book.title },
          requestDate: b.requestDate,
          status: b.status,
        }));

      // Process history for returned books
      const processedHistory = historyRecords.map((b: any) => ({
        _id: b._id,
        book: { _id: b.book._id, title: b.book.title },
        approvedAt: b.approvedAt,
        dueDate: b.dueDate,
        status: b.status,
        returnDate: b.returnedAt,
        fine: b.fine,
      }));

      setBorrowings(processedBorrowings);
      setPendingRequests(processedPending);
      setHistory(processedHistory);
    } catch (error) {
      console.error("Error fetching borrowings:", error);
      toast({
        title: "Error",
        description: "Failed to load borrowings. Please try again.",
        variant: "destructive",
        duration: 2000
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter borrowings based on search query
  const filterBySearch = (items: Borrowing[]) =>
    items.filter((item) =>
      item.book.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

  // Sort history by return date
  const sortedHistory = [...filterBySearch(history)].sort((a, b) => {
    const dateA = a.returnDate ? new Date(a.returnDate).getTime() : 0;
    const dateB = b.returnDate ? new Date(b.returnDate).getTime() : 0;
    return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
  });

  // Toggle sort order for history
  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  // Define tab-specific data
  const currentBorrowings = filterBySearch(
    borrowings.filter((b) => b.status === "approved")
  );
  const overdueBorrowings = filterBySearch(
    borrowings.filter((b) => b.status === "approved" && b.daysOverdue)
  );
  const pendingBorrowings = filterBySearch(pendingRequests);

  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Borrowings</h1>
          <p className="text-muted-foreground">Track your Borrowed Books</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by book title..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="current" className="w-full">
          <TabsList>
            <TabsTrigger value="current">Current</TabsTrigger>
            <TabsTrigger value="overdue" className="relative">
              Overdue
              {overdueBorrowings.length > 0 && (
                <Badge className="ml-2 bg-red-500">
                  {overdueBorrowings.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="returned">History</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Current Borrowings</CardTitle>
                <CardDescription>
                  Books that you currently possess
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Book Title</TableHead>
                      <TableHead>Borrow Date</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="text-center py-8 text-muted-foreground"
                        >
                          Loading borrowings...
                        </TableCell>
                      </TableRow>
                    ) : currentBorrowings.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="text-center py-8 text-muted-foreground"
                        >
                          No current borrowings found
                        </TableCell>
                      </TableRow>
                    ) : (
                      currentBorrowings.map((borrowing) => (
                        <TableRow key={borrowing._id}>
                          <TableCell className="font-medium">
                            {borrowing.book.title}
                          </TableCell>
                          <TableCell>
                            {new Date(
                              borrowing.approvedAt
                            ).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {new Date(borrowing.dueDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {borrowing.daysOverdue ? (
                              <span className="text-red-500 font-medium">
                                Overdue by {borrowing.daysOverdue} days
                              </span>
                            ) : (
                              <span className="text-green-600 font-medium">
                                {borrowing.daysLeft} days left
                              </span>
                            )}
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
                <CardDescription>
                  Books that are past their due date and need to be returned
                </CardDescription>
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
                        <TableCell
                          colSpan={4}
                          className="text-center py-8 text-muted-foreground"
                        >
                          Loading borrowings...
                        </TableCell>
                      </TableRow>
                    ) : overdueBorrowings.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="text-center py-8 text-muted-foreground"
                        >
                          No overdue books found
                        </TableCell>
                      </TableRow>
                    ) : (
                      overdueBorrowings.map((borrowing) => (
                        <TableRow key={borrowing._id}>
                          <TableCell className="font-medium">
                            {borrowing.book.title}
                          </TableCell>
                          <TableCell>
                            {new Date(
                              borrowing.approvedAt
                            ).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {new Date(borrowing.dueDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <span className="text-red-500 font-medium">
                              {borrowing.daysOverdue} days
                            </span>
                          </TableCell>
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
                <CardTitle className="flex justify-between items-center">
                  Borrowing History
                  <Button variant="outline" size="sm" onClick={toggleSortOrder}>
                    Sort by Date{" "}
                    {sortOrder === "asc" ? (
                      <ArrowUp className="ml-2 h-4 w-4" />
                    ) : (
                      <ArrowDown className="ml-2 h-4 w-4" />
                    )}
                  </Button>
                </CardTitle>
                <CardDescription>
                  Books that you have previously borrowed and returned
                </CardDescription>
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
                        <TableCell
                          colSpan={4}
                          className="text-center py-8 text-muted-foreground"
                        >
                          Loading history...
                        </TableCell>
                      </TableRow>
                    ) : sortedHistory.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="text-center py-8 text-muted-foreground"
                        >
                          No borrowing history found
                        </TableCell>
                      </TableRow>
                    ) : (
                      sortedHistory.map((borrowing) => (
                        <TableRow key={borrowing._id}>
                          <TableCell className="font-medium">
                            {borrowing.book.title}
                          </TableCell>
                          <TableCell>
                            {new Date(
                              borrowing.approvedAt
                            ).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {borrowing.returnDate
                              ? new Date(
                                  borrowing.returnDate
                                ).toLocaleDateString()
                              : "-"}
                          </TableCell>
                          <TableCell>
                            ₹{" "}
                            {borrowing.fine && borrowing.fine > 0
                              ? borrowing.fine.toFixed(2)
                              : "0.00"}
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
                <CardDescription>
                  Books that you have requested but are waiting for approval
                </CardDescription>
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
                        <TableCell
                          colSpan={3}
                          className="text-center py-8 text-muted-foreground"
                        >
                          Loading requests...
                        </TableCell>
                      </TableRow>
                    ) : pendingBorrowings.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={3}
                          className="text-center py-8 text-muted-foreground"
                        >
                          No pending requests found
                        </TableCell>
                      </TableRow>
                    ) : (
                      pendingBorrowings.map((request) => (
                        <TableRow key={request._id}>
                          <TableCell className="font-medium">
                            {request.book.title}
                          </TableCell>
                          <TableCell>
                            {request.requestDate
                              ? new Date(
                                  request.requestDate
                                ).toLocaleDateString()
                              : "-"}
                          </TableCell>
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
  );
}
