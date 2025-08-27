"use client"

import type React from "react"

import { useIsMobile } from "../hooks/use-mobile"
import { cn } from "../lib/utils"
import { useState, useEffect } from "react"
import { Plus, Edit, Eye, Trash2, Search, Star, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

const API_BASE_URL = "https://api.abigailgeneralcleaningservice.com/api/gallery"

interface GalleryImage {
  _id: string
  title: string
  description: string
  image: string
  category: string
  tags: string[]
  status: "active" | "inactive" | "featured"
  featured: boolean
  priority: number
  altText?: string
  caption?: string
  metadata?: {
    fileSize?: number
    dimensions?: { width?: number; height?: number }
    format?: string
    uploadedBy?: string
  }
  views: number
  likes: number
  createdAt: string
  updatedAt: string
}

export default function GalleryManagement() {
  const isMobile = useIsMobile()
  const [gallery, setGallery] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showViewDialog, setShowViewDialog] = useState(false)
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  const [galleryForm, setGalleryForm] = useState({
    title: "",
    description: "",
    category: "General",
    tags: "",
    status: "active",
    featured: false,
    priority: 1,
    altText: "",
    caption: "",
    image: null as File | null,
  })

  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    category: "General",
    tags: "",
    status: "active",
    featured: false,
    priority: 1,
    altText: "",
    caption: "",
    image: null as File | null,
  })

  useEffect(() => {
    loadGallery()
  }, [])

  const loadGallery = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}?status=active`)
      if (response.ok) {
        const data = await response.json()
        setGallery(data.data || [])
      } else {
        toast({ title: "Error", description: "Failed to load gallery", variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Error", description: "Error loading gallery", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateGallery = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append("title", galleryForm.title)
    formData.append("description", galleryForm.description)
    formData.append("category", galleryForm.category)
    formData.append("tags", galleryForm.tags)
    formData.append("status", galleryForm.status)
    formData.append("featured", galleryForm.featured.toString())
    formData.append("priority", galleryForm.priority.toString())
    formData.append("altText", galleryForm.altText)
    formData.append("caption", galleryForm.caption)
    if (galleryForm.image) formData.append("image", galleryForm.image)

    try {
      const response = await fetch(`${API_BASE_URL}/create`, {
        method: "POST",
        body: formData,
      })
      if (response.ok) {
        toast({ title: "Success", description: "Gallery image created!" })
        setShowCreateDialog(false)
        setGalleryForm({
          title: "",
          description: "",
          category: "General",
          tags: "",
          status: "active",
          featured: false,
          priority: 1,
          altText: "",
          caption: "",
          image: null,
        })
        loadGallery()
      } else {
        const error = await response.json()
        toast({ title: "Error", description: error.message || "Failed to create image", variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to create image", variant: "destructive" })
    }
  }

  const handleEditGallery = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedImage) return
    const formData = new FormData()
    formData.append("title", editForm.title)
    formData.append("description", editForm.description)
    formData.append("category", editForm.category)
    formData.append("tags", editForm.tags)
    formData.append("status", editForm.status)
    formData.append("featured", editForm.featured.toString())
    formData.append("priority", editForm.priority.toString())
    formData.append("altText", editForm.altText)
    formData.append("caption", editForm.caption)
    if (editForm.image) formData.append("image", editForm.image)

    try {
      const response = await fetch(`${API_BASE_URL}/${selectedImage._id}`, {
        method: "PUT",
        body: formData,
      })
      if (response.ok) {
        toast({ title: "Success", description: "Gallery image updated!" })
        setShowEditDialog(false)
        setEditForm({
          title: "",
          description: "",
          category: "General",
          tags: "",
          status: "active",
          featured: false,
          priority: 1,
          altText: "",
          caption: "",
          image: null,
        })
        loadGallery()
      } else {
        const error = await response.json()
        toast({ title: "Error", description: error.message || "Failed to update image", variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to update image", variant: "destructive" })
    }
  }

  const handleDeleteGallery = async (id: string) => {
    if (!confirm("Delete this image?")) return
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, { method: "DELETE" })
      if (response.ok) {
        toast({ title: "Success", description: "Image deleted!" })
        loadGallery()
      } else {
        const error = await response.json()
        toast({ title: "Error", description: error.message || "Failed to delete image", variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete image", variant: "destructive" })
    }
  }

  const openEditDialog = (img: GalleryImage) => {
    setSelectedImage(img)
    setEditForm({
      title: img.title,
      description: img.description,
      category: img.category,
      tags: img.tags.join(", "),
      status: img.status,
      featured: img.featured,
      priority: img.priority,
      altText: img.altText || "",
      caption: img.caption || "",
      image: null,
    })
    setShowEditDialog(true)
  }

  const openViewDialog = (img: GalleryImage) => {
    setSelectedImage(img)
    setShowViewDialog(true)
  }

  return (
    <div className="space-y-6">
      {/* Header Section - Mobile Responsive */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-purple-900">Gallery Management</h2>
          <p className="text-purple-600 mt-1">Manage gallery images and metadata</p>
        </div>
        <Button
          onClick={() => setShowCreateDialog(true)}
          className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white"
          size="lg"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Image
        </Button>
      </div>

      {/* Search Section - Mobile Responsive */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-4 h-4" />
            <Input
              placeholder="Search gallery..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Gallery Grid - Mobile Responsive */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gallery.filter(
            (img) =>
              img.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              img.description.toLowerCase().includes(searchTerm.toLowerCase()),
          ).length === 0 ? (
            <div className="col-span-full">
              <Card>
                <CardContent className="p-8 text-center">
                  <ImageIcon className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-purple-900 mb-2">No images found</h3>
                  <p className="text-purple-600 mb-4">
                    {searchTerm ? "Try adjusting your search terms" : "Get started by adding your first image"}
                  </p>
                  {!searchTerm && (
                    <Button onClick={() => setShowCreateDialog(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Image
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            gallery
              .filter(
                (img) =>
                  img.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  img.description.toLowerCase().includes(searchTerm.toLowerCase()),
              )
              .map((img) => (
                <Card key={img._id} className="border-purple-200 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="relative mb-4">
                      <img
                        src={`${API_BASE_URL.replace("/api/gallery", "")}/uploads/${img.image}`}
                        alt={img.altText || img.title}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <div className="absolute top-2 right-2 flex gap-1">
                        {img.featured && (
                          <Badge className="bg-purple-600 text-white text-xs">
                            <Star className="w-3 h-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                        <Badge variant={img.status === "active" ? "default" : "secondary"}>{img.status}</Badge>
                      </div>
                    </div>

                    <h3 className="font-semibold text-purple-900 mb-2">{img.title}</h3>
                    <p className="text-sm text-purple-600 mb-3 line-clamp-2">{img.description}</p>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {img.tags.slice(0, 3).map((tag, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {img.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{img.tags.length - 3} more
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-xs">
                          Priority: {img.priority}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Views: {img.views}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Likes: {img.likes}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => openViewDialog(img)} className="flex-1">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => openEditDialog(img)} className="flex-1">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteGallery(img._id)}
                        className="flex-1 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
          )}
        </div>
      )}

      {/* Create Dialog - Mobile Responsive */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent
          className={cn(
            "max-w-2xl max-h-[90vh] overflow-y-auto bg-white",
            isMobile && "w-full h-full m-0 rounded-none",
          )}
        >
          <DialogHeader>
            <DialogTitle className="text-purple-900">Add Gallery Image</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateGallery} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-purple-700 font-medium">Title *</Label>
              <Input
                value={galleryForm.title}
                onChange={(e) => setGalleryForm((f) => ({ ...f, title: e.target.value }))}
                className="bg-white border-purple-200 focus:border-purple-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-purple-700 font-medium">Description *</Label>
              <Textarea
                value={galleryForm.description}
                onChange={(e) => setGalleryForm((f) => ({ ...f, description: e.target.value }))}
                className="bg-white border-purple-200 focus:border-purple-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-purple-700 font-medium">Category</Label>
                <Input
                  value={galleryForm.category}
                  onChange={(e) => setGalleryForm((f) => ({ ...f, category: e.target.value }))}
                  className="bg-white border-purple-200 focus:border-purple-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-purple-700 font-medium">Status</Label>
                <Select
                  value={galleryForm.status}
                  onValueChange={(value) => setGalleryForm((f) => ({ ...f, status: value }))}
                >
                  <SelectTrigger className="bg-white border-purple-200 focus:border-purple-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="featured">Featured</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-purple-700 font-medium">Tags (comma separated)</Label>
              <Input
                value={galleryForm.tags}
                onChange={(e) => setGalleryForm((f) => ({ ...f, tags: e.target.value }))}
                className="bg-white border-purple-200 focus:border-purple-500"
                placeholder="e.g., cleaning, before-after, residential"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-purple-700 font-medium">Priority (1-10)</Label>
                <Input
                  type="number"
                  min={1}
                  max={10}
                  value={galleryForm.priority}
                  onChange={(e) => setGalleryForm((f) => ({ ...f, priority: Number(e.target.value) }))}
                  className="bg-white border-purple-200 focus:border-purple-500"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-purple-700 font-medium">Featured</Label>
                <div className="flex items-center space-x-2 pt-2">
                  <input
                    type="checkbox"
                    checked={galleryForm.featured}
                    onChange={(e) => setGalleryForm((f) => ({ ...f, featured: e.target.checked }))}
                    className="rounded border-purple-200"
                  />
                  <span className="text-sm text-purple-600">Mark as featured image</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-purple-700 font-medium">Alt Text</Label>
              <Input
                value={galleryForm.altText}
                onChange={(e) => setGalleryForm((f) => ({ ...f, altText: e.target.value }))}
                className="bg-white border-purple-200 focus:border-purple-500"
                placeholder="Describe the image for accessibility"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-purple-700 font-medium">Caption</Label>
              <Input
                value={galleryForm.caption}
                onChange={(e) => setGalleryForm((f) => ({ ...f, caption: e.target.value }))}
                className="bg-white border-purple-200 focus:border-purple-500"
                placeholder="Optional caption for the image"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-purple-700 font-medium">Image *</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setGalleryForm((f) => ({ ...f, image: e.target.files?.[0] || null }))}
                className="file:bg-purple-50 file:text-purple-700 file:border-0 file:rounded-full file:px-4 file:py-2"
                required
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCreateDialog(false)}
                className="flex-1 sm:flex-none"
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1 sm:flex-none bg-purple-600 hover:bg-purple-700 text-white">
                Create Image
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog - Mobile Responsive */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent
          className={cn(
            "max-w-2xl max-h-[90vh] overflow-y-auto bg-white",
            isMobile && "w-full h-full m-0 rounded-none",
          )}
        >
          <DialogHeader>
            <DialogTitle className="text-purple-900">Edit Gallery Image</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditGallery} className="space-y-4">
            {/* Similar form structure as create dialog with purple/white styling */}
            <div className="space-y-2">
              <Label className="text-purple-700 font-medium">Title *</Label>
              <Input
                value={editForm.title}
                onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
                className="bg-white border-purple-200 focus:border-purple-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-purple-700 font-medium">Description *</Label>
              <Textarea
                value={editForm.description}
                onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                className="bg-white border-purple-200 focus:border-purple-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-purple-700 font-medium">Category</Label>
                <Input
                  value={editForm.category}
                  onChange={(e) => setEditForm((f) => ({ ...f, category: e.target.value }))}
                  className="bg-white border-purple-200 focus:border-purple-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-purple-700 font-medium">Status</Label>
                <Select
                  value={editForm.status}
                  onValueChange={(value) => setEditForm((f) => ({ ...f, status: value }))}
                >
                  <SelectTrigger className="bg-white border-purple-200 focus:border-purple-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="featured">Featured</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-purple-700 font-medium">Tags (comma separated)</Label>
              <Input
                value={editForm.tags}
                onChange={(e) => setEditForm((f) => ({ ...f, tags: e.target.value }))}
                className="bg-white border-purple-200 focus:border-purple-500"
                placeholder="e.g., cleaning, before-after, residential"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-purple-700 font-medium">Priority (1-10)</Label>
                <Input
                  type="number"
                  min={1}
                  max={10}
                  value={editForm.priority}
                  onChange={(e) => setEditForm((f) => ({ ...f, priority: Number(e.target.value) }))}
                  className="bg-white border-purple-200 focus:border-purple-500"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-purple-700 font-medium">Featured</Label>
                <div className="flex items-center space-x-2 pt-2">
                  <input
                    type="checkbox"
                    checked={editForm.featured}
                    onChange={(e) => setEditForm((f) => ({ ...f, featured: e.target.checked }))}
                    className="rounded border-purple-200"
                  />
                  <span className="text-sm text-purple-600">Mark as featured image</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-purple-700 font-medium">Alt Text</Label>
              <Input
                value={editForm.altText}
                onChange={(e) => setEditForm((f) => ({ ...f, altText: e.target.value }))}
                className="bg-white border-purple-200 focus:border-purple-500"
                placeholder="Describe the image for accessibility"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-purple-700 font-medium">Caption</Label>
              <Input
                value={editForm.caption}
                onChange={(e) => setEditForm((f) => ({ ...f, caption: e.target.value }))}
                className="bg-white border-purple-200 focus:border-purple-500"
                placeholder="Optional caption for the image"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-purple-700 font-medium">Image</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setEditForm((f) => ({ ...f, image: e.target.files?.[0] || null }))}
                className="file:bg-purple-50 file:text-purple-700 file:border-0 file:rounded-full file:px-4 file:py-2"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowEditDialog(false)}
                className="flex-1 sm:flex-none"
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1 sm:flex-none bg-purple-600 hover:bg-purple-700 text-white">
                Update Image
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Dialog - Mobile Responsive */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent
          className={cn(
            "max-w-2xl max-h-[90vh] overflow-y-auto bg-white",
            isMobile && "w-full h-full m-0 rounded-none",
          )}
        >
          <DialogHeader>
            <DialogTitle className="text-purple-900">View Gallery Image</DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <div className="space-y-4">
              <img
                src={`${API_BASE_URL.replace("/api/gallery", "")}/uploads/${selectedImage.image}`}
                alt={selectedImage.altText || selectedImage.title}
                className="w-full h-64 object-cover rounded-lg"
              />
              <h3 className="font-semibold text-xl text-purple-900">{selectedImage.title}</h3>
              <p className="text-purple-600">{selectedImage.description}</p>

              <div className="flex flex-wrap gap-1 mt-2">
                {selectedImage.tags.map((tag, idx) => (
                  <Badge key={idx} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex space-x-2 mt-2">
                {selectedImage.featured && (
                  <Badge className="bg-purple-600 text-white text-xs">
                    <Star className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                )}
                <Badge variant={selectedImage.status === "active" ? "default" : "secondary"}>
                  {selectedImage.status}
                </Badge>
                <Badge variant="outline">Priority: {selectedImage.priority}</Badge>
                <Badge variant="outline">Views: {selectedImage.views}</Badge>
                <Badge variant="outline">Likes: {selectedImage.likes}</Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <Label className="text-purple-700 font-medium">Alt Text</Label>
                  <p className="text-purple-900">{selectedImage.altText || "Not provided"}</p>
                </div>
                <div>
                  <Label className="text-purple-700 font-medium">Caption</Label>
                  <p className="text-purple-900">{selectedImage.caption || "Not provided"}</p>
                </div>
              </div>

              {selectedImage.metadata && (
                <div className="mt-4">
                  <Label className="text-purple-700 font-medium">Metadata</Label>
                  <div className="bg-purple-50 p-3 rounded-lg mt-2">
                    <pre className="text-xs text-purple-800 whitespace-pre-wrap">
                      {JSON.stringify(selectedImage.metadata, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowViewDialog(false)
                    openEditDialog(selectedImage)
                  }}
                  className="flex-1 sm:flex-none"
                >
                  Edit Image
                </Button>
                <Button variant="outline" onClick={() => setShowViewDialog(false)} className="flex-1 sm:flex-none">
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
