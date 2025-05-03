"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Search, CheckCircle, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  getPendingRequests,
  approveRequest,
  rejectRequest,
} from "@/services/api";
import { useToast } from "@/components/ui/use-toast";

export default function BorrowingRequests() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<BorrowRequest | null>(
    null
  );
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(
    null
  );
  const [pendingRequests, setPendingRequests] = useState<BorrowRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch pending requests when the component mounts
  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        setIsLoading(true);
        const requests = await getPendingRequests();
        setPendingRequests(requests);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to load pending requests");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPendingRequests();
  }, []);

  // Filter requests based on search query
  const filteredRequests = pendingRequests.filter((request) => {
    const query = searchQuery.toLowerCase();

    return (
      String(request.book?.title).toLowerCase().includes(query) ||
      String(request.user?.name).toLowerCase().includes(query) ||
      String(request.user?.studentId).toLowerCase().includes(query)
    );
  });

  // Handle approve/reject button clicks
  const handleAction = (
    request: BorrowRequest,
    action: "approve" | "reject"
  ) => {
    setSelectedRequest(request);
    setActionType(action);
    setActionDialogOpen(true);
  };

  // Confirm the action and call the backend
  const confirmAction = async () => {
    if (!selectedRequest || !actionType) return;

    try {
      if (actionType === "approve") {
        await approveRequest(selectedRequest._id);
        toast({ title: "Request approved successfully" , duration: 2000});
      } else {
        await rejectRequest(selectedRequest._id);
        toast({ title: "Request rejected successfully" , duration: 2000});
      }
      // Remove the request from the list after successful action
      setPendingRequests((prev) =>
        prev.filter((req) => req._id !== selectedRequest._id)
      );
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
        duration: 2000
      });
    } finally {
      setActionDialogOpen(false);
      setSelectedRequest(null);
      setActionType(null);
    }
  };

  return (
    <DashboardLayout role="librarian">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Manage Borrow Requests
          </h1>
          <p className="text-muted-foreground">
            Approve or Reject borrowing requests from students
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Pending Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mt-4 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-8 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Request Date</TableHead>
                  <TableHead className="text-center">Book Title</TableHead>
                  <TableHead className="text-center">Student</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      Loading pending requests…
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-8 text-destructive"
                    >
                      Error: {error}
                    </TableCell>
                  </TableRow>
                ) : filteredRequests.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No pending requests found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRequests.map((request) => (
                    <TableRow key={request._id}>
                      <TableCell className="text-center">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-center font-medium">
                        {request.book.title}
                      </TableCell>
                      <TableCell className="text-center">
                        {request.user.name}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 gap-1 text-destructive border-red-500 hover:bg-destructive/10"
                            onClick={() => handleAction(request, "reject")}
                          >
                            <XCircle className="h-4 w-4 text-red-500" />
                            <span className="hidden sm:inline text-red-500">
                              Reject
                            </span>
                          </Button>
                          <Button
                            size="sm"
                            className="h-8 gap-1 bg-green-600 hover:bg-green-500"
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
            <DialogTitle>
              {actionType === "approve" ? "Approve Request" : "Reject Request"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "approve"
                ? "Confirm that you want to approve this borrowing request."
                : "Confirm that you want to reject this borrowing request."}
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="py-4">
              <div className="space-y-1 mb-4">
                <p className="text-sm font-medium">
                  Book : {selectedRequest.book.title}
                </p>
                <p className="text-sm text-medium">
                  Student : {selectedRequest.user.name}
                </p>
                <br></br>
                <p className="text-sm text-medium">
                  Requested on :{" "}
                  {new Date(selectedRequest.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setActionDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmAction}
              className={
                actionType === "approve"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-500 hover:bg-red-600"
              }
            >
              {actionType === "approve" ? "Approve" : "Reject"}
            </Button>
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
type BorrowRequest = {
  _id: string;
  book: {
    _id: string;
    title: string;
  };
  user: {
    _id: string;
    name: string;
    studentId: string;
  };
  status: string;
  createdAt: string;
};
