"use client"

import type React from "react"

import { useState } from "react"
import { Plus, Pencil, Trash2, MoreHorizontal, Search } from "lucide-react"

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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import DashboardLayout from "@/components/dashboard-layout"

export default function ManageBooks() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    category: "fiction",
    availableCopies: "1",
    totalCopies: "1",
  })

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.isbn.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddBook = () => {
    // In a real app, you would send this data to the backend
    console.log("Adding book:", {
      ...formData,
      availableCopies: Number.parseInt(formData.availableCopies),
      totalCopies: Number.parseInt(formData.totalCopies),
    })
    setIsAddDialogOpen(false)
    // Reset form
    setFormData({
      title: "",
      author: "",
      isbn: "",
      category: "fiction",
      availableCopies: "1",
      totalCopies: "1",
    })
  }

  const handleEditClick = (book: Book) => {
    setSelectedBook(book)
    setFormData({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      category: book.category,
      availableCopies: book.availableCopies.toString(),
      totalCopies: book.totalCopies.toString(),
    })
    setIsEditDialogOpen(true)
  }

  const handleEditBook = () => {
    // In a real app, you would send this data to the backend
    console.log("Editing book:", {
      id: selectedBook?.id,
      ...formData,
      availableCopies: Number.parseInt(formData.availableCopies),
      totalCopies: Number.parseInt(formData.totalCopies),
    })
    setIsEditDialogOpen(false)
  }

  const handleDeleteClick = (book: Book) => {
    setSelectedBook(book)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteBook = () => {
    // In a real app, you would send this request to the backend
    console.log("Deleting book:", selectedBook?.id)
    setIsDeleteDialogOpen(false)
  }

  return (
    <DashboardLayout role="librarian">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Manage Books</h1>
            <p className="text-muted-foreground">Add, edit, or remove books from the library</p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)} className="sm:w-auto w-full">
            <Plus className="mr-2 h-4 w-4" /> Add Book
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardDescription>Manage the books available in the library</CardDescription>
            <div className="mt-4 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search books..."
                className="pl-8 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Available / Total</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBooks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No books found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBooks.map((book) => (
                    <TableRow key={book.id}>
                      <TableCell className="font-medium">{book.title}</TableCell>
                      <TableCell>{book.author}</TableCell>
                      <TableCell className="capitalize">{book.category}</TableCell>
                      <TableCell>
                        <span className={book.availableCopies === 0 ? "text-red-500" : ""}>
                          {book.availableCopies} / {book.totalCopies}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditClick(book)}>
                              <Pencil className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteClick(book)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Add Book Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Book</DialogTitle>
            <DialogDescription>Add a new book to the library collection</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Book Title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  placeholder="Author Name"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fiction">Fiction</SelectItem>
                    <SelectItem value="non-fiction">Non-Fiction</SelectItem>
                    <SelectItem value="science">Science</SelectItem>
                    <SelectItem value="history">History</SelectItem>
                    <SelectItem value="biography">Biography</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="availableCopies">Available Copies</Label>
                <Input
                  id="availableCopies"
                  name="availableCopies"
                  type="number"
                  min="0"
                  value={formData.availableCopies}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="totalCopies">Total Copies</Label>
                <Input
                  id="totalCopies"
                  name="totalCopies"
                  type="number"
                  min="1"
                  value={formData.totalCopies}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddBook}>Add Book</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Book Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Book</DialogTitle>
            <DialogDescription>Update book information in the library collection</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input id="edit-title" name="title" value={formData.title} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-author">Author</Label>
                <Input id="edit-author" name="author" value={formData.author} onChange={handleChange} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                  <SelectTrigger id="edit-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fiction">Fiction</SelectItem>
                    <SelectItem value="non-fiction">Non-Fiction</SelectItem>
                    <SelectItem value="science">Science</SelectItem>
                    <SelectItem value="history">History</SelectItem>
                    <SelectItem value="biography">Biography</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-availableCopies">Available Copies</Label>
                <Input
                  id="edit-availableCopies"
                  name="availableCopies"
                  type="number"
                  min="0"
                  value={formData.availableCopies}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-totalCopies">Total Copies</Label>
                <Input
                  id="edit-totalCopies"
                  name="totalCopies"
                  type="number"
                  min="1"
                  value={formData.totalCopies}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditBook}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedBook?.title}" from the library collection? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteBook}>
              Delete
            </Button>
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
