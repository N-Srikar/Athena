"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import DashboardLayout from "@/components/dashboard-layout"
import { useToast } from "@/components/ui/use-toast"

type Librarian = {
  id: string
  name: string
  email: string
  status: string
  password?: string
}

export default function ManageLibrarians() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedLibrarian, setSelectedLibrarian] = useState<Librarian | null>(null)
  const [librarians, setLibrarians] = useState<Librarian[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  // Fetch librarians on component mount
  useEffect(() => {
    fetchLibrarians()
  }, [])

  const fetchLibrarians = async () => {
    try {
      setIsLoading(true)
      // Sample data for demonstration
      const sampleLibrarians = [
        {
          id: "1",
          name: "Jane Smith",
          email: "jane.smith@library.com",
          status: "active",
        },
        {
          id: "2",
          name: "John Doe",
          email: "john.doe@library.com",
          status: "active",
        },
        {
          id: "3",
          name: "Emily Johnson",
          email: "emily.johnson@library.com",
          status: "active",
        },
      ]

      // In a real app, you would fetch from the API
      // const response = await fetch("/api/admin/librarians")
      // const data = await response.json()

      setLibrarians(sampleLibrarians)
    } catch (error) {
      console.error("Error fetching librarians:", error)
      toast({
        title: "Error",
        description: "Failed to load librarians. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filteredLibrarians = librarians.filter(
    (librarian) =>
      librarian.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      librarian.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddLibrarian = async () => {
    try {
      // Validate form
      if (!formData.name || !formData.email) {
        toast({
          title: "Error",
          description: "Name and email are required",
          variant: "destructive",
        })
        return
      }

      // In a real app, you would send this to the API
      // const response = await fetch("/api/admin/librarians", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     name: formData.name,
      //     email: formData.email,
      //   }),
      // })

      // Mock response
      const newLibrarian = {
        id: (librarians.length + 1).toString(),
        name: formData.name,
        email: formData.email,
        status: "active",
        password: "generated-password",
      }

      // Update local state
      setLibrarians([...librarians, newLibrarian])

      toast({
        title: "Success",
        description: `Librarian added successfully. Password: ${newLibrarian.password}`,
      })

      setIsAddDialogOpen(false)
      // Reset form
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      })
    } catch (error) {
      console.error("Error adding librarian:", error)
      toast({
        title: "Error",
        description: "Failed to add librarian. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEditClick = (librarian: Librarian) => {
    setSelectedLibrarian(librarian)
    setFormData({
      name: librarian.name,
      email: librarian.email,
      password: "",
      confirmPassword: "",
    })
    setIsEditDialogOpen(true)
  }

  const handleEditLibrarian = async () => {
    try {
      if (!selectedLibrarian) return

      // Validate form
      if (!formData.name || !formData.email) {
        toast({
          title: "Error",
          description: "Name and email are required",
          variant: "destructive",
        })
        return
      }

      // In a real app, you would send this to the API
      // const response = await fetch(`/api/admin/librarians/${selectedLibrarian.id}`, {
      //   method: "PUT",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     name: formData.name,
      //     email: formData.email,
      //   }),
      // })

      // Mock response
      const updatedLibrarian = {
        ...selectedLibrarian,
        name: formData.name,
        email: formData.email,
      }

      // Update local state
      setLibrarians(librarians.map((lib) => (lib.id === selectedLibrarian.id ? updatedLibrarian : lib)))

      toast({
        title: "Success",
        description: "Librarian updated successfully",
      })

      setIsEditDialogOpen(false)
    } catch (error) {
      console.error("Error updating librarian:", error)
      toast({
        title: "Error",
        description: "Failed to update librarian. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteClick = (librarian: Librarian) => {
    setSelectedLibrarian(librarian)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteLibrarian = async () => {
    try {
      if (!selectedLibrarian) return

      // In a real app, you would send this to the API
      // const response = await fetch(`/api/admin/librarians/${selectedLibrarian.id}`, {
      //   method: "DELETE",
      // })

      // Update local state
      setLibrarians(librarians.filter((lib) => lib.id !== selectedLibrarian.id))

      toast({
        title: "Success",
        description: "Librarian deleted successfully",
      })

      setIsDeleteDialogOpen(false)
    } catch (error) {
      console.error("Error deleting librarian:", error)
      toast({
        title: "Error",
        description: "Failed to delete librarian. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Manage Librarians</h1>
            <p className="text-muted-foreground">Add, edit, or remove librarian accounts</p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)} className="sm:w-auto w-full">
            <Plus className="mr-2 h-4 w-4" /> Add Librarian
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Librarians</CardTitle>
            <CardDescription>Manage librarian accounts and their access to the system</CardDescription>
            <div className="mt-4 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search librarians..."
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
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      Loading librarians...
                    </TableCell>
                  </TableRow>
                ) : filteredLibrarians.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      No librarians found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLibrarians.map((librarian) => (
                    <TableRow key={librarian.id}>
                      <TableCell className="font-medium">{librarian.name}</TableCell>
                      <TableCell>{librarian.email}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            librarian.status === "active"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                          }`}
                        >
                          {librarian.status === "active" ? "Active" : "Inactive"}
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
                            <DropdownMenuItem onClick={() => handleEditClick(librarian)}>
                              <Pencil className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteClick(librarian)}
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

      {/* Add Librarian Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Librarian</DialogTitle>
            <DialogDescription>Create a new librarian account with system access</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john.doe@library.com"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              A password will be automatically generated for the new librarian.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddLibrarian}>Add Librarian</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Librarian Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Librarian</DialogTitle>
            <DialogDescription>Update librarian account information</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Full Name</Label>
              <Input id="edit-name" name="name" value={formData.name} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input id="edit-email" name="email" type="email" value={formData.email} onChange={handleChange} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditLibrarian}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the librarian account for {selectedLibrarian?.name}? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteLibrarian}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
