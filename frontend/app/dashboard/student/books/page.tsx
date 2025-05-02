"use client"

import { useState } from "react"
import { Search, BookOpen } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import DashboardLayout from "@/components/dashboard-layout"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function BrowseBooks() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [authorFilter, setAuthorFilter] = useState("all")
  const [sortBy, setSortBy] = useState("title")
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [requestDialogOpen, setRequestDialogOpen] = useState(false)

  // Get unique authors for filter
  const uniqueAuthors = Array.from(new Set(books.map((book) => book.author)))

  // Filter and sort books
  const filteredBooks = books
    .filter(
      (book) =>
        (categoryFilter === "all" || book.category === categoryFilter) &&
        (authorFilter === "all" || book.author === authorFilter) &&
        (book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.author.toLowerCase().includes(searchQuery.toLowerCase())),
    )
    .sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title)
      if (sortBy === "author") return a.author.localeCompare(b.author)
      return 0
    })

  const handleRequestBook = (book: Book) => {
    setSelectedBook(book)
    setRequestDialogOpen(true)
  }

  const submitRequest = () => {
    // In a real app, you would send this request to the backend
    console.log("Requesting book:", selectedBook)
    setRequestDialogOpen(false)
  }

  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Browse Books</h1>
          <p className="text-muted-foreground">Search and request books from our library collection</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search books..."
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
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="author">Author</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredBooks.map((book) => (
            <Card key={book.id} className="overflow-hidden flex flex-col relative">
            <div className="absolute top-2 right-2">
              {book.availableCopies > 0 ? (
                <Badge className="bg-green-500 hover:bg-green-500">Available: {book.availableCopies}</Badge>
              ) : (
                <Badge className="bg-red-500 hover:bg-red-500">Unavailable</Badge>
              )}
            </div>
            <CardHeader className="p-4 pt-10 pb-0">
              <CardTitle className="text-lg line-clamp-1">{book.title}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-2 flex-grow">
              <p className="text-sm text-muted-foreground">By {book.author}</p>
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
      </div>

      <Dialog open={requestDialogOpen} onOpenChange={setRequestDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Book</DialogTitle>
            <DialogDescription>
              Submit a request to borrow this book. The librarian will review your request.
            </DialogDescription>
          </DialogHeader>

          {selectedBook && (
            <div className="flex flex-col sm:flex-row gap-4 py-4">
              <div className="space-y-2">
                <h3 className="font-semibold">{selectedBook.title}</h3>
                <p className="text-sm text-muted-foreground">By {selectedBook.author}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="outline">{selectedBook.category}</Badge>
                  <span>•</span>
                  <span>Available Copies: {selectedBook.availableCopies}</span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setRequestDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitRequest}>Submit Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}

// Types
type Book = {
  id: string
  title: string
  author: string
  category: string
  availableCopies: number
  totalCopies: number
  isbn: string
}

// Sample data
const books: Book[] = [
  {
    id: "1",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    category: "fiction",
    availableCopies: 3,
    totalCopies: 5,
    isbn: "978-0061120084",
  },
  {
    id: "2",
    title: "1984",
    author: "George Orwell",
    category: "fiction",
    availableCopies: 0,
    totalCopies: 4,
    isbn: "978-0451524935",
  },
  {
    id: "3",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    category: "fiction",
    availableCopies: 2,
    totalCopies: 3,
    isbn: "978-0743273565",
  },
  {
    id: "4",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    category: "fiction",
    availableCopies: 1,
    totalCopies: 3,
    isbn: "978-0141439518",
  },
  {
    id: "5",
    title: "A Brief History of Time",
    author: "Stephen Hawking",
    category: "science",
    availableCopies: 2,
    totalCopies: 2,
    isbn: "978-0553380163",
  },
  {
    id: "6",
    title: "The Diary of a Young Girl",
    author: "Anne Frank",
    category: "biography",
    availableCopies: 0,
    totalCopies: 2,
    isbn: "978-0553577129",
  },
  {
    id: "7",
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    category: "history",
    availableCopies: 3,
    totalCopies: 3,
    isbn: "978-0062316097",
  },
  {
    id: "8",
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    category: "fiction",
    availableCopies: 0,
    totalCopies: 4,
    isbn: "978-0547928227",
  },
]
