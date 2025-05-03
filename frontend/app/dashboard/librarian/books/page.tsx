"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, MoreHorizontal, Search } from "lucide-react";
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
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DashboardLayout from "@/components/dashboard-layout";
import { getBooks, addBook, updateBook, deleteBook } from "@/services/api";

export default function ManageBooks() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    availableCopies: "1",
    totalCopies: "1",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [books, setBooks] = useState<Book[]>([]);

  const categories = [
    "fiction",
    "non-fiction",
    "science",
    "history",
    "biography",
  ];

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setIsLoading(true);
        const list = await getBooks();
        setBooks(list);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAll();
  }, []);

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddBook = async () => {
    if (!formData.title || !formData.author || !formData.category) {
      toast({ title: "Title, author, and category are required" , duration: 2000});
      return;
    }
    try {
      const total = parseInt(formData.totalCopies, 10);
      const payload = {
        title: formData.title,
        author: formData.author,
        category: formData.category,
        totalCopies: total,
        availableCopies: total,
      };
      const data = await addBook(payload);
      const newBook = data.book;
      setBooks((prev) => [
        ...prev,
        {
          _id: newBook._id,
          title: newBook.title,
          author: newBook.author,
          category: newBook.category,
          totalCopies: newBook.totalCopies,
          availableCopies: newBook.availableCopies,
          isbn: "",
        },
      ]);
      toast({ title: "Book added successfully" , duration  : 2000});
      setIsAddDialogOpen(false);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  const handleEditClick = (book: Book) => {
    setSelectedBook(book);
    const normalizedCategory = book.category.toLowerCase();
    const category = categories.includes(normalizedCategory)
      ? normalizedCategory
      : "";
    setFormData({
      title: book.title,
      author: book.author,
      category,
      availableCopies: book.availableCopies.toString(),
      totalCopies: book.totalCopies.toString(),
    });
    setIsEditDialogOpen(true);
  };

  const handleEditBook = async () => {
    if (!selectedBook) return;
    try {
      const updatedBook = {
        title: formData.title,
        author: formData.author,
        category: formData.category,
        availableCopies: Number.parseInt(formData.availableCopies),
        totalCopies: Number.parseInt(formData.totalCopies),
      };
      const response = await updateBook(selectedBook._id, updatedBook);
      const updatedBooks = books.map((book) => {
        if (book._id === selectedBook._id) {
          return { ...book, ...updatedBook };
        }
        return book;
      });
      setBooks(updatedBooks);
      toast({ title: "Book updated successfully" , duration:2000});
      setIsEditDialogOpen(false);
    } catch (error) {
      toast({ title: "Error", variant: "destructive" , duration:2000});
    }
  };

  const handleDeleteClick = (book: Book) => {
    setSelectedBook(book);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteBook = async () => {
    if (!selectedBook) return;
    try {
      await deleteBook(selectedBook._id);
      const updatedBooks = books.filter(
        (book) => book._id !== selectedBook._id
      );
      setBooks(updatedBooks);
      toast({ title: "Book deleted successfully" , duration:2000});
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast({ title: "Error", variant: "destructive" ,  duration:2000});
    }
  };

  return (
    <DashboardLayout role="librarian">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Manage Books</h1>
            <p className="text-muted-foreground">
              Add, Edit, or Remove Books from the library
            </p>
          </div>
          <Button
            onClick={() => {
              setFormData({
                title: "",
                author: "",
                category: "",
                totalCopies: "1",
                availableCopies: "1",
              });
              setIsAddDialogOpen(true);
            }}
            className="sm:w-auto w-full"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Book
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Books available in the Library</CardTitle>
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
                  <TableHead className="text-center">Title</TableHead>
                  <TableHead className="text-center">Author</TableHead>
                  <TableHead className="text-center">Category</TableHead>
                  <TableHead className="text-center">
                    Available / Total
                  </TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow key="loading">
                    <TableCell colSpan={5} className="text-center py-8">
                      Loading books…
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow key="error">
                    <TableCell
                      colSpan={5}
                      className="text-center py-8 text-destructive"
                    >
                      Error: {error}
                    </TableCell>
                  </TableRow>
                ) : filteredBooks.length === 0 ? (
                  <TableRow key="no-books">
                    <TableCell
                      colSpan={5}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No books found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBooks.map((book) => (
                    <TableRow key={book._id}>
                      <TableCell className="text-center">
                        {book.title}
                      </TableCell>
                      <TableCell className="text-center">
                        {book.author}
                      </TableCell>
                      <TableCell className="text-center capitalize">
                        {book.category}
                      </TableCell>
                      <TableCell className="text-center">
                        {book.availableCopies} / {book.totalCopies}
                      </TableCell>
                      <TableCell className="text-center w-20">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleEditClick(book)}
                            >
                              <Pencil className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteClick(book)}
                              className="text-red-500 focus:text-red-500"
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
            <DialogDescription>
              Add a new book to the library collection
            </DialogDescription>
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
            <div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    handleSelectChange("category", value)
                  }
                >
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
            <div className="space-y-2">
              <Label htmlFor="totalCopies">Total Copies</Label>
              <Input
                id="totalCopies"
                name="totalCopies"
                type="number"
                min="1"
                value={formData.totalCopies}
                onChange={(e) => {
                  handleChange(e);
                  setFormData((fd) => ({
                    ...fd,
                    totalCopies: e.target.value,
                    availableCopies: e.target.value,
                  }));
                }}
              />
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
            <DialogDescription>
              Update book information in the library collection
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-author">Author</Label>
                <Input
                  id="edit-author"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <div className="space-y-2">
                <Label htmlFor="edit-category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    handleSelectChange("category", value)
                  }
                >
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
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
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
              Are you sure you want to delete "{selectedBook?.title}" from the
              library collection?
              <br></br>
              <br></br>
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="bg-red-700 hover:bg-red-600"
              onClick={handleDeleteBook}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}

type Book = {
  _id: string;
  title: string;
  author: string;
  category: string;
  availableCopies: number;
  totalCopies: number;
};
