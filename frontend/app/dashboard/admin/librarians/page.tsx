"use client";

import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, MoreHorizontal, Search } from "lucide-react";

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DashboardLayout from "@/components/dashboard-layout";
import { useToast } from "@/components/ui/use-toast";

import {
  getLibrarians,
  addLibrarian,
  updateLibrarian,
  deleteLibrarian,
} from "@/services/api";

type Librarian = {
  _id: string;
  name: string;
  email: string;
  plainPassword?: string;
};

export default function ManageLibrarians() {
  const [searchQuery, setSearchQuery] = useState("");
  const [librarians, setLibrarians] = useState<Librarian[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Dialog state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<Librarian | null>(null);

  // Form state (used for add & edit)
  const [form, setForm] = useState({ name: "", email: "" });

  // --- Fetch all librarians ---
  const fetchAll = async () => {
    setIsLoading(true);
    try {
      const libs = await getLibrarians();
      setLibrarians(libs);
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
        duration: 2000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAddOpen) {
      setForm({ name: "", email: "" });
      setSelected(null);
    }
  }, [isAddOpen]);

  useEffect(() => {
    fetchAll();
  }, []);

  const filtered = librarians.filter(
    (l) =>
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- Handlers ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    if (!form.name || !form.email) {
      toast({
        title: "Error",
        description: "Name & email required",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }
    try {
      const { password, librarianId } = await addLibrarian({
        name: form.name,
        email: form.email,
      });
      // Append the new librarian
      setLibrarians((prev) => [
        ...prev,
        {
          _id: librarianId,
          name: form.name,
          email: form.email,
          plainPassword: password,
        },
      ]);
      toast({
        title: "Librarian Added Successfully!",
        description: `Password : ${password}`
      });
      setIsAddOpen(false);
      setForm({ name: "", email: "" });
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  const handleEditClick = (lib: Librarian) => {
    setSelected(lib);
    setForm({ name: lib.name, email: lib.email });
    setIsEditOpen(true);
  };

  const handleEdit = async () => {
    if (!selected) return;
    if (!form.name || !form.email) {
      toast({
        title: "Error",
        description: "Name & email required",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }
    try {
      const { librarian } = await updateLibrarian(selected._id, {
        name: form.name,
        email: form.email,
      });
      setLibrarians((prev) =>
        prev.map((l) => (l._id === selected._id ? librarian : l))
      );
      toast({ title: "Librarian Updated Successfully!", description: "" , duration: 2000} );
      setIsEditOpen(false);
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
        duration : 2000
      });
    }
  };

  const handleDeleteClick = (lib: Librarian) => {
    setSelected(lib);
    setIsDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!selected) return;
    try {
      await deleteLibrarian(selected._id);
      setLibrarians((prev) => prev.filter((l) => l._id !== selected._id));
      toast({ title: "Librarian Deleted Successfully!", description: "" , duration: 2000} );
      setIsDeleteOpen(false);
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Error!",
        description: err.message,
        variant: "destructive",
        duration  : 2000
      });
    }
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        {/* Header + Add button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Manage Librarians</h1>
            <p className="text-muted-foreground">
              Add, edit, or remove librarian accounts
            </p>
          </div>
          <Button onClick={() => setIsAddOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Librarian
          </Button>
        </div>

        {/* Search + Table */}
        <Card>
          <CardHeader>
            <CardTitle>Librarians</CardTitle>
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
          </CardHeader>

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Name</TableHead>
                  <TableHead className="text-center">Email</TableHead>
                  <TableHead className="text-center">Password</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      Loading…
                    </TableCell>
                  </TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      No librarians found
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((lib) => (
                    <TableRow key={lib._id}>
                      <TableCell className="text-center font-medium">
                        {lib.name}
                      </TableCell>
                      <TableCell className="text-center">{lib.email}</TableCell>
                      <TableCell className="text-center">
                        {lib.plainPassword}
                      </TableCell>
                      <TableCell className="text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleEditClick(lib)}
                            >
                              <Pencil className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteClick(lib)}
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

      {/* ——— Add Librarian Dialog ——— */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Librarian</DialogTitle>
            <DialogDescription>
              A password will be auto‐generated and shown here.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Label htmlFor="add-name">Full Name</Label>
            <Input
              id="add-name"
              name="name"
              value={form.name}
              onChange={handleChange}
            />
            <Label htmlFor="add-email">Email</Label>
            <Input
              id="add-email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAdd}>Add Librarian</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ——— Edit Librarian Dialog ——— */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Librarian</DialogTitle>
            <DialogDescription>
              Update the librarian’s name or email.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Label htmlFor="edit-name">Full Name</Label>
            <Input
              id="edit-name"
              name="name"
              value={form.name}
              onChange={handleChange}
            />
            <Label htmlFor="edit-email">Email</Label>
            <Input
              id="edit-email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ——— Delete Confirmation Dialog ——— */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Delete librarian <strong>{selected?.name}</strong>? This cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="bg-red-700 hover:bg-red-600"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
