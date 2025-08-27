"use client"
// UI Consistency & Mobile Enhancements
import type React from "react"

import { useIsMobile } from "../hooks/use-mobile"
// ...existing code...

// ...existing code...

// In modal/dialog components, add smooth transitions and mobile-friendly sizing
// Example: <Dialog className={cn("bg-white dark:bg-purple-900 rounded-lg shadow-lg transition-all duration-300", isMobile && "w-full h-full m-0 rounded-none")}> ... </Dialog>
// ...existing code...

import { useState, useEffect } from "react"
import { Plus, Edit, Eye, Trash2, Search, FolderOpen, Star, ChevronDown, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

const API_BASE_URL = "https://api.abigailgeneralcleaningservice.com/api/categories"

interface Category {
  _id: string
  name: string
  description: string
  slug: string
  status: string
  featured: boolean
  priority: number
  icon: string
  color: string
  parentCategory?: {
    _id: string
    name: string
    slug: string
  } | null
  subcategories: Category[]
  serviceCount: number
  metadata?: {
    seoTitle?: string
    seoDescription?: string
    seoKeywords?: string[]
  }
  createdAt: string
  updatedAt: string
}

export default function CategoryManagement() {
  const isMobile = useIsMobile()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showViewDialog, setShowViewDialog] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const { toast } = useToast()

  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
    status: "active",
    featured: false,
    priority: 1,
    icon: "📁",
    color: "#8B5CF6",
    parentCategory: "none",
    metadata: {
      seoTitle: "",
      seoDescription: "",
      seoKeywords: "",
    },
  })

  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    status: "active",
    featured: false,
    priority: 1,
    icon: "📁",
    color: "#8B5CF6",
    parentCategory: "none",
    metadata: {
      seoTitle: "",
      seoDescription: "",
      seoKeywords: "",
    },
  })

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/hierarchy`)
      if (response.ok) {
        const data = await response.json()
        setCategories(data.data || [])
      } else {
        console.error("Failed to load categories")
        toast({
          title: "Error",
          description: "Failed to load categories",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error loading categories:", error)
      toast({
        title: "Error",
        description: "Error loading categories",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const formData = {
        name: categoryForm.name,
        description: categoryForm.description,
        status: categoryForm.status,
        featured: categoryForm.featured,
        priority: Number.parseInt(categoryForm.priority.toString()),
        icon: categoryForm.icon,
        color: categoryForm.color,
        parentCategory: categoryForm.parentCategory === "none" ? null : categoryForm.parentCategory || null,
        metadata: {
          seoTitle: categoryForm.metadata.seoTitle || undefined,
          seoDescription: categoryForm.metadata.seoDescription || undefined,
          seoKeywords: categoryForm.metadata.seoKeywords
            ? categoryForm.metadata.seoKeywords.split(",").map((k) => k.trim())
            : undefined,
        },
      }

      const response = await fetch(`${API_BASE_URL}/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({ title: "Success", description: "Category created successfully!" })
        setShowCreateDialog(false)
        resetCategoryForm()
        loadCategories()
      } else {
        const error = await response.json()
        toast({ title: "Error", description: error.message || "Failed to create category", variant: "destructive" })
      }
    } catch (error) {
      console.error("Error creating category:", error)
      toast({ title: "Error", description: "Failed to create category", variant: "destructive" })
    }
  }

  const handleEditCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCategory) return

    try {
      const formData = {
        name: editForm.name,
        description: editForm.description,
        status: editForm.status,
        featured: editForm.featured,
        priority: Number.parseInt(editForm.priority.toString()),
        icon: editForm.icon,
        color: editForm.color,
        parentCategory: editForm.parentCategory === "none" ? null : editForm.parentCategory || null,
        metadata: {
          seoTitle: editForm.metadata.seoTitle || undefined,
          seoDescription: editForm.metadata.seoDescription || undefined,
          seoKeywords: editForm.metadata.seoKeywords
            ? editForm.metadata.seoKeywords.split(",").map((k) => k.trim())
            : undefined,
        },
      }

      const response = await fetch(`${API_BASE_URL}/${selectedCategory._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({ title: "Success", description: "Category updated successfully!" })
        setShowEditDialog(false)
        loadCategories()
      } else {
        const error = await response.json()
        toast({ title: "Error", description: error.message || "Failed to update category", variant: "destructive" })
      }
    } catch (error) {
      console.error("Error updating category:", error)
      toast({ title: "Error", description: "Failed to update category", variant: "destructive" })
    }
  }

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return

    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({ title: "Success", description: "Category deleted successfully!" })
        loadCategories()
      } else {
        const error = await response.json()
        toast({ title: "Error", description: error.message || "Failed to delete category", variant: "destructive" })
      }
    } catch (error) {
      console.error("Error deleting category:", error)
      toast({ title: "Error", description: "Failed to delete category", variant: "destructive" })
    }
  }

  const openEditDialog = (category: Category) => {
    setSelectedCategory(category)
    setEditForm({
      name: category.name,
      description: category.description,
      status: category.status,
      featured: category.featured,
      priority: category.priority,
      icon: category.icon,
      color: category.color,
      parentCategory: category.parentCategory?._id || "none",
      metadata: {
        seoTitle: category.metadata?.seoTitle || "",
        seoDescription: category.metadata?.seoDescription || "",
        seoKeywords: category.metadata?.seoKeywords?.join(", ") || "",
      },
    })
    setShowEditDialog(true)
  }

  const openViewDialog = (category: Category) => {
    setSelectedCategory(category)
    setShowViewDialog(true)
  }

  const resetCategoryForm = () => {
    setCategoryForm({
      name: "",
      description: "",
      status: "active",
      featured: false,
      priority: 1,
      icon: "📁",
      color: "#8B5CF6",
      parentCategory: "none",
      metadata: {
        seoTitle: "",
        seoDescription: "",
        seoKeywords: "",
      },
    })
  }

  const toggleExpanded = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    setExpandedCategories(newExpanded)
  }

  const getParentCategories = (categories: Category[], excludeId?: string) => {
    return categories.filter((cat) => cat._id !== excludeId && !cat.parentCategory)
  }

  const renderCategoryTree = (categories: Category[], level = 0) => {
    return categories.map((category) => (
      <div key={category._id} className="space-y-2">
        <Card className={`${level > 0 ? "ml-3 sm:ml-6" : ""}`}>
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <button
                  onClick={() => toggleExpanded(category._id)}
                  className="p-1 hover:bg-purple-100 rounded touch-manipulation"
                >
                  {category.subcategories && category.subcategories.length > 0 ? (
                    expandedCategories.has(category._id) ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )
                  ) : (
                    <div className="w-4 h-4" />
                  )}
                </button>

                <span className="text-xl sm:text-2xl">{category.icon}</span>

                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-purple-900 text-sm sm:text-base truncate">{category.name}</h3>
                  <p className="text-xs sm:text-sm text-purple-600 line-clamp-2">{category.description}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                  {category.featured && (
                    <Badge className="bg-yellow-500 text-white text-xs">
                      <Star className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                  <Badge
                    className={
                      category.status === "active"
                        ? "bg-purple-600 text-white hover:bg-purple-700"
                        : "bg-purple-100 text-purple-800"
                    }
                  >
                    {category.status}
                  </Badge>
                  <Badge variant="outline" className="border-purple-200 text-purple-700 text-xs">
                    P: {category.priority}
                  </Badge>
                  <Badge variant="outline" className="border-purple-200 text-purple-700 text-xs">
                    {category.serviceCount} svc
                  </Badge>
                </div>

                <div className="flex gap-1 sm:gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openViewDialog(category)}
                    className="border-purple-200 text-purple-700 hover:bg-purple-50 h-8 w-8 p-0 touch-manipulation"
                  >
                    <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEditDialog(category)}
                    className="border-purple-200 text-purple-700 hover:bg-purple-50 h-8 w-8 p-0 touch-manipulation"
                  >
                    <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteCategory(category._id)}
                    className="text-red-600 hover:text-red-700 h-8 w-8 p-0 touch-manipulation"
                  >
                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {expandedCategories.has(category._id) && category.subcategories && category.subcategories.length > 0 && (
          <div className="ml-3 sm:ml-6">{renderCategoryTree(category.subcategories, level + 1)}</div>
        )}
      </div>
    ))
  }

  const filteredCategories = categories.filter((category) => {
    const matchesSearch =
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || category.status === filterStatus
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header Section - Mobile Responsive */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-purple-900">Category Management</h2>
          <p className="text-purple-600 mt-1">Manage service categories and hierarchy</p>
        </div>
        <Button
          onClick={() => setShowCreateDialog(true)}
          className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white"
          size="lg"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Category
        </Button>
      </div>

      {/* Search and Filter Section - Mobile Responsive */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-4 h-4" />
                <Input
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="featured">Featured</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categories Tree View - Mobile Responsive */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCategories.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <FolderOpen className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-purple-900 mb-2">No categories found</h3>
                <p className="text-purple-600 mb-4">
                  {searchTerm || filterStatus !== "all"
                    ? "Try adjusting your search or filters"
                    : "Get started by creating your first category"}
                </p>
                {!searchTerm && filterStatus === "all" && (
                  <Button
                    onClick={() => setShowCreateDialog(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Category
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">{renderCategoryTree(filteredCategories)}</div>
          )}
        </div>
      )}

      {/* Create Category Dialog - Mobile Responsive */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-[98vw] sm:max-w-2xl max-h-[95vh] overflow-y-auto m-1 sm:mx-auto p-4 sm:p-6">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-lg sm:text-xl">Create New Category</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateCategory} className="space-y-3 sm:space-y-4">
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              <div>
                <Label htmlFor="name" className="text-sm font-medium">
                  Category Name *
                </Label>
                <Input
                  id="name"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  placeholder="Enter category name"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-sm font-medium">
                  Description *
                </Label>
                <Textarea
                  id="description"
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  placeholder="Enter category description"
                  rows={3}
                  required
                  className="mt-1 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <Label htmlFor="status" className="text-sm font-medium">
                    Status
                  </Label>
                  <Select
                    value={categoryForm.status}
                    onValueChange={(value) => setCategoryForm({ ...categoryForm, status: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="featured">Featured</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="priority" className="text-sm font-medium">
                    Priority
                  </Label>
                  <Input
                    id="priority"
                    type="number"
                    min="1"
                    max="10"
                    value={categoryForm.priority}
                    onChange={(e) =>
                      setCategoryForm({ ...categoryForm, priority: Number.parseInt(e.target.value) || 1 })
                    }
                    placeholder="1-10"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <Label htmlFor="icon" className="text-sm font-medium">
                    Icon
                  </Label>
                  <Input
                    id="icon"
                    value={categoryForm.icon}
                    onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })}
                    placeholder="📁"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="color" className="text-sm font-medium">
                    Color
                  </Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      id="color"
                      type="color"
                      value={categoryForm.color}
                      onChange={(e) => setCategoryForm({ ...categoryForm, color: e.target.value })}
                      className="w-12 h-10 p-1 flex-shrink-0 rounded"
                    />
                    <Input
                      value={categoryForm.color}
                      onChange={(e) => setCategoryForm({ ...categoryForm, color: e.target.value })}
                      placeholder="#8B5CF6"
                      className="flex-1 min-w-0 text-sm"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="parentCategory" className="text-sm font-medium">
                  Parent Category
                </Label>
                <Select
                  value={categoryForm.parentCategory}
                  onValueChange={(value) => setCategoryForm({ ...categoryForm, parentCategory: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select parent category (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Parent (Top Level)</SelectItem>
                    {getParentCategories(categories).map((category) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">SEO Metadata (Optional)</Label>
                <div className="space-y-2">
                  <Input
                    placeholder="SEO Title"
                    value={categoryForm.metadata.seoTitle}
                    onChange={(e) =>
                      setCategoryForm({
                        ...categoryForm,
                        metadata: { ...categoryForm.metadata, seoTitle: e.target.value },
                      })
                    }
                    className="text-sm"
                  />
                  <Textarea
                    placeholder="SEO Description"
                    value={categoryForm.metadata.seoDescription}
                    onChange={(e) =>
                      setCategoryForm({
                        ...categoryForm,
                        metadata: { ...categoryForm.metadata, seoDescription: e.target.value },
                      })
                    }
                    rows={2}
                    className="text-sm resize-none"
                  />
                  <Input
                    placeholder="SEO Keywords (comma separated)"
                    value={categoryForm.metadata.seoKeywords}
                    onChange={(e) =>
                      setCategoryForm({
                        ...categoryForm,
                        metadata: { ...categoryForm.metadata, seoKeywords: e.target.value },
                      })
                    }
                    className="text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 py-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={categoryForm.featured}
                  onChange={(e) => setCategoryForm({ ...categoryForm, featured: e.target.checked })}
                  className="rounded w-4 h-4"
                />
                <Label htmlFor="featured" className="text-sm font-medium">
                  Featured Category
                </Label>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-3 border-t">
              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white h-11 touch-manipulation"
              >
                Create Category
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCreateDialog(false)}
                className="w-full border-purple-200 text-purple-700 hover:bg-purple-50 h-11 touch-manipulation"
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog - Mobile Responsive */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-[98vw] sm:max-w-2xl max-h-[95vh] overflow-y-auto m-1 sm:mx-auto p-4 sm:p-6">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-lg sm:text-xl">Edit Category</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditCategory} className="space-y-3 sm:space-y-4">
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              <div>
                <Label htmlFor="edit-name" className="text-sm font-medium">
                  Category Name *
                </Label>
                <Input
                  id="edit-name"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  placeholder="Enter category name"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="edit-description" className="text-sm font-medium">
                  Description *
                </Label>
                <Textarea
                  id="edit-description"
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  placeholder="Enter category description"
                  rows={3}
                  required
                  className="mt-1 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <Label htmlFor="edit-status" className="text-sm font-medium">
                    Status
                  </Label>
                  <Select
                    value={editForm.status}
                    onValueChange={(value) => setEditForm({ ...editForm, status: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="featured">Featured</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="edit-priority" className="text-sm font-medium">
                    Priority
                  </Label>
                  <Input
                    id="edit-priority"
                    type="number"
                    min="1"
                    max="10"
                    value={editForm.priority}
                    onChange={(e) => setEditForm({ ...editForm, priority: Number.parseInt(e.target.value) || 1 })}
                    placeholder="1-10"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <Label htmlFor="edit-icon" className="text-sm font-medium">
                    Icon
                  </Label>
                  <Input
                    id="edit-icon"
                    value={editForm.icon}
                    onChange={(e) => setEditForm({ ...editForm, icon: e.target.value })}
                    placeholder="📁"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="edit-color" className="text-sm font-medium">
                    Color
                  </Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      id="edit-color"
                      type="color"
                      value={editForm.color}
                      onChange={(e) => setEditForm({ ...editForm, color: e.target.value })}
                      className="w-12 h-10 p-1 flex-shrink-0 rounded"
                    />
                    <Input
                      value={editForm.color}
                      onChange={(e) => setEditForm({ ...editForm, color: e.target.value })}
                      placeholder="#8B5CF6"
                      className="flex-1 min-w-0 text-sm"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="edit-parentCategory" className="text-sm font-medium">
                  Parent Category
                </Label>
                <Select
                  value={editForm.parentCategory}
                  onValueChange={(value) => setEditForm({ ...editForm, parentCategory: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select parent category (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Parent (Top Level)</SelectItem>
                    {getParentCategories(categories, selectedCategory?._id).map((category) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">SEO Metadata (Optional)</Label>
                <div className="space-y-2">
                  <Input
                    placeholder="SEO Title"
                    value={editForm.metadata.seoTitle}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        metadata: { ...editForm.metadata, seoTitle: e.target.value },
                      })
                    }
                    className="text-sm"
                  />
                  <Textarea
                    placeholder="SEO Description"
                    value={editForm.metadata.seoDescription}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        metadata: { ...editForm.metadata, seoDescription: e.target.value },
                      })
                    }
                    rows={2}
                    className="text-sm resize-none"
                  />
                  <Input
                    placeholder="SEO Keywords (comma separated)"
                    value={editForm.metadata.seoKeywords}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        metadata: { ...editForm.metadata, seoKeywords: e.target.value },
                      })
                    }
                    className="text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 py-2">
                <input
                  type="checkbox"
                  id="edit-featured"
                  checked={editForm.featured}
                  onChange={(e) => setEditForm({ ...editForm, featured: e.target.checked })}
                  className="rounded w-4 h-4"
                />
                <Label htmlFor="edit-featured" className="text-sm font-medium">
                  Featured Category
                </Label>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-3 border-t">
              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white h-11 touch-manipulation"
              >
                Update Category
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowEditDialog(false)}
                className="w-full border-purple-200 text-purple-700 hover:bg-purple-50 h-11 touch-manipulation"
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Category Dialog - Mobile Responsive */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-[98vw] sm:max-w-2xl max-h-[95vh] overflow-y-auto m-1 sm:mx-auto p-4 sm:p-6">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-lg sm:text-xl">View Category</DialogTitle>
          </DialogHeader>
          {selectedCategory && (
            <div className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <Label className="text-xs sm:text-sm font-medium text-purple-700">Name</Label>
                  <p className="text-sm sm:text-base text-purple-900 mt-1">{selectedCategory.name}</p>
                </div>
                <div>
                  <Label className="text-xs sm:text-sm font-medium text-purple-700">Status</Label>
                  <div className="mt-1">
                    <Badge
                      className={
                        selectedCategory.status === "active"
                          ? "bg-purple-600 text-white"
                          : "bg-purple-100 text-purple-800"
                      }
                    >
                      {selectedCategory.status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-xs sm:text-sm font-medium text-purple-700">Priority</Label>
                  <p className="text-sm sm:text-base text-purple-900 mt-1">{selectedCategory.priority}</p>
                </div>
                <div>
                  <Label className="text-xs sm:text-sm font-medium text-purple-700">Featured</Label>
                  <div className="mt-1">
                    <Badge
                      className={
                        selectedCategory.featured ? "bg-purple-600 text-white" : "bg-purple-100 text-purple-800"
                      }
                    >
                      {selectedCategory.featured ? "Yes" : "No"}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-xs sm:text-sm font-medium text-purple-700">Icon</Label>
                  <p className="text-xl sm:text-2xl mt-1">{selectedCategory.icon}</p>
                </div>
                <div>
                  <Label className="text-xs sm:text-sm font-medium text-purple-700">Color</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <div
                      className="w-5 h-5 sm:w-6 sm:h-6 rounded border"
                      style={{ backgroundColor: selectedCategory.color }}
                    />
                    <span className="text-sm sm:text-base text-purple-900">{selectedCategory.color}</span>
                  </div>
                </div>
                <div className="col-span-1 sm:col-span-2">
                  <Label className="text-xs sm:text-sm font-medium text-purple-700">Description</Label>
                  <p className="text-sm sm:text-base text-purple-900 mt-1">{selectedCategory.description}</p>
                </div>
                <div>
                  <Label className="text-xs sm:text-sm font-medium text-purple-700">Parent Category</Label>
                  <p className="text-sm sm:text-base text-purple-900 mt-1">
                    {selectedCategory.parentCategory ? selectedCategory.parentCategory.name : "None (Top Level)"}
                  </p>
                </div>
                <div>
                  <Label className="text-xs sm:text-sm font-medium text-purple-700">Subcategories</Label>
                  <p className="text-sm sm:text-base text-purple-900 mt-1">{selectedCategory.subcategories.length}</p>
                </div>
                <div>
                  <Label className="text-xs sm:text-sm font-medium text-purple-700">Services</Label>
                  <p className="text-sm sm:text-base text-purple-900 mt-1">{selectedCategory.serviceCount}</p>
                </div>
                <div>
                  <Label className="text-xs sm:text-sm font-medium text-purple-700">Created</Label>
                  <p className="text-sm sm:text-base text-purple-900 mt-1">
                    {new Date(selectedCategory.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <Label className="text-xs sm:text-sm font-medium text-purple-700">Updated</Label>
                  <p className="text-sm sm:text-base text-purple-900 mt-1">
                    {new Date(selectedCategory.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {selectedCategory.metadata && (
                <div className="space-y-2">
                  <Label className="text-xs sm:text-sm font-medium text-purple-700">SEO Metadata</Label>
                  <div className="grid grid-cols-1 gap-2">
                    {selectedCategory.metadata.seoTitle && (
                      <div>
                        <span className="text-[0.6rem] sm:text-xs text-purple-500">Title:</span>
                        <p className="text-sm text-purple-900 mt-1">{selectedCategory.metadata.seoTitle}</p>
                      </div>
                    )}
                    {selectedCategory.metadata.seoDescription && (
                      <div>
                        <span className="text-[0.6rem] sm:text-xs text-purple-500">Description:</span>
                        <p className="text-sm text-purple-900 mt-1">{selectedCategory.metadata.seoDescription}</p>
                      </div>
                    )}
                    {selectedCategory.metadata.seoKeywords && selectedCategory.metadata.seoKeywords.length > 0 && (
                      <div>
                        <span className="text-[0.6rem] sm:text-xs text-purple-500">Keywords:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedCategory.metadata.seoKeywords.map((keyword, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-[0.6rem] sm:text-xs border-purple-200 text-purple-700"
                            >
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-2 pt-3 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowViewDialog(false)
                    openEditDialog(selectedCategory)
                  }}
                  className="w-full border-purple-200 text-purple-700 hover:bg-purple-50 h-11 touch-manipulation"
                >
                  Edit Category
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowViewDialog(false)}
                  className="w-full border-purple-200 text-purple-700 hover:bg-purple-50 h-11 touch-manipulation"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
