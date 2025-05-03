"use client";

import { useState, useEffect } from "react";
import { Search, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DashboardLayout from "@/components/dashboard-layout";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getBooks, submitBorrowRequest } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";

type Book = {
  _id: string;
  title: string;
  author: string;
  category: string;
  availableCopies: number;
  totalCopies: number;
  isbn: string;
};

export default function BrowseBooks() {
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [authorFilter, setAuthorFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const { toast } = useToast();

  // Fetch all books on component mount
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setIsLoading(true);
        const data = await getBooks();
        setAllBooks(data);
        setIsLoading(false);
      } catch (err) {
        setError("Failed to load books");
        setIsLoading(false);
      }
    };
    fetchBooks();
  }, []);

  // Compute unique authors from all books
  const uniqueAuthors = Array.from(
    new Set(allBooks.map((book) => book.author))
  );

  // Filter books based on search, category, and author
  const filteredBooks = allBooks.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || book.category === categoryFilter;
    const matchesAuthor =
      authorFilter === "all" || book.author === authorFilter;
    return matchesSearch && matchesCategory && matchesAuthor;
  });

  // Sort filtered books by title
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    const comparison = a.title.localeCompare(b.title);
    return sortOrder === "asc" ? comparison : -comparison;
  });

  // Handle sorting toggle
  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  // Handle book request
  const handleRequestBook = (book: Book) => {
    setSelectedBook(book);
    setRequestDialogOpen(true);
  };

  // Submit borrow request with toast notifications
  const submitRequest = async () => {
    if (!selectedBook) return;
    try {
      await submitBorrowRequest({ bookId: selectedBook._id });
      toast({ title: "Borrow request submitted successfully" , duration: 2000});
      setRequestDialogOpen(false);
      // Refetch books to ensure data is up-to-date
      const data = await getBooks();
      setAllBooks(data);
    } catch (err) {
      toast({
        title: "Failed to submit borrow request",
        variant: "destructive",
        duration: 2000
      });
    }
  };

  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Browse Books</h1>
          <p className="text-muted-foreground">
            Search and request books from our library collection
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search books by title or author..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-3 gap-2 w-full md:w-auto">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="fiction">Fiction</SelectItem>
                <SelectItem value="non-fiction">Non-Fiction</SelectItem>
                <SelectItem value="science">Science</SelectItem>
                <SelectItem value="history">History</SelectItem>
                <SelectItem value="biography">Biography</SelectItem>
              </SelectContent>
            </Select>
            <Select value={authorFilter} onValueChange={setAuthorFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Author" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Authors</SelectItem>
                {uniqueAuthors.map((author) => (
                  <SelectItem key={author} value={author}>
                    {author}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={toggleSortOrder}
              className="w-full"
            >
              Sort by Title{" "}
              {sortOrder === "asc" ? (
                <ArrowUp className="ml-2 h-4 w-4" />
              ) : (
                <ArrowDown className="ml-2 h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {isLoading ? (
          <p>Loading books...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {sortedBooks.map((book) => (
              <Card
                key={book._id}
                className="overflow-hidden flex flex-col relative"
              >
                <div className="absolute top-2 right-2">
                  {book.availableCopies > 0 ? (
                    <Badge className="bg-green-500 hover:bg-green-500">
                      Available: {book.availableCopies}
                    </Badge>
                  ) : (
                    <Badge className="bg-red-500 hover:bg-red-500">
                      Unavailable
                    </Badge>
                  )}
                </div>
                <CardHeader className="p-4 pt-10 pb-0">
                  <CardTitle className="text-lg line-clamp-1">
                    {book.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-2 flex-grow">
                  <p className="text-sm text-muted-foreground">
                    By {book.author}
                  </p>
                  <Badge variant="outline" className="mt-2">
                    {book.category}
                  </Badge>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button
                    className="w-full"
                    disabled={book.availableCopies === 0}
                    onClick={() => handleRequestBook(book)}
                  >
                    {book.availableCopies > 0 ? "Request Book" : "Unavailable"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={requestDialogOpen} onOpenChange={setRequestDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request Book</DialogTitle>
              <DialogDescription>
                Submit a request to borrow this book. The librarian will review
                your request.
              </DialogDescription>
            </DialogHeader>

            {selectedBook && (
              <div className="flex flex-col sm:flex-row gap-4 py-4">
                <div className="space-y-2">
                  <h3 className="font-semibold">{selectedBook.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    By {selectedBook.author}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="outline">{selectedBook.category}</Badge>
                    <span>•</span>
                    <span>
                      Available Copies: {selectedBook.availableCopies}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setRequestDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={submitRequest}>Submit Request</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
