"use client"
// UI Consistency & Mobile Enhancements
import type React from "react"

import { useIsMobile } from "../hooks/use-mobile"
import { cn } from "../lib/utils"
// ...existing code...

// Move hook call inside component
// ...existing code...

// In modal/dialog components, add smooth transitions and mobile-friendly sizing
// Example: <Dialog className={cn("bg-white dark:bg-gray-900 rounded-lg shadow-lg transition-all duration-300", isMobile && "w-full h-full m-0 rounded-none")}> ... </Dialog>
// ...existing code...

import { useState, useEffect } from "react"
import { Plus, Edit, Eye, Trash2, Search, Settings, Star, DollarSign, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

const API_BASE_URL = "https://api.abigailgeneralcleaningservice.com/api/service"

interface Service {
  _id: string
  title: string
  description: string
  shortDescription?: string
  category: string
  subcategory?: string
  serviceType: string
  features: string[]
  benefits: string[]
  requirements?: string[]
  equipment?: string[]
  pricing: {
    type: string
    amount?: number
    currency: string
    perSquareMeter?: number
    perHour?: number
    description?: string
  }
  duration?: string
  coverage?: string
  status: string
  featured?: boolean
  priority?: number
  images: string[]
  mainImage: string
  gallery?: string[]
  beforeAfterImages?: {
    before: string[]
    after: string[]
  }
  seoTitle?: string
  seoDescription?: string
  seoKeywords?: string[]
  contactInfo?: {
    email?: string
    phone?: string
    website?: string
  }
  createdAt: string
  updatedAt: string
}

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
}

export default function ServiceManagement() {
  const isMobile = useIsMobile()
  const [services, setServices] = useState<Service[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showViewDialog, setShowViewDialog] = useState(false)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  const [serviceForm, setServiceForm] = useState({
    title: "",
    description: "",
    shortDescription: "",
    category: "",
    subcategory: "",
    serviceType: "Coach Cleaning",
    features: "",
    benefits: "",
    requirements: "",
    equipment: "",
    pricingType: "custom",
    pricingAmount: "",
    pricingCurrency: "ETB",
    pricingDescription: "",
    duration: "",
    coverage: "all",
    status: "active",
    featured: false,
    priority: 1,
    images: [] as File[],
    mainImage: null as File | null,
    gallery: [] as File[],
    beforeImages: [] as File[],
    afterImages: [] as File[],
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
    contactEmail: "",
    contactPhone: "",
    contactWebsite: "",
  })

  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    shortDescription: "",
    category: "",
    subcategory: "",
    serviceType: "Coach Cleaning",
    features: "",
    benefits: "",
    requirements: "",
    equipment: "",
    pricingType: "custom",
    pricingAmount: "",
    pricingCurrency: "ETB",
    pricingDescription: "",
    duration: "",
    coverage: "all",
    status: "active",
    featured: false,
    priority: 1,
    images: [] as File[],
    mainImage: null as File | null,
    gallery: [] as File[],
    beforeImages: [] as File[],
    afterImages: [] as File[],
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
    contactEmail: "",
    contactPhone: "",
    contactWebsite: "",
  })

  useEffect(() => {
    loadServices()
    loadCategories()
  }, [])

  const loadServices = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}`)
      if (response.ok) {
        const data = await response.json()
        setServices(data.data || data)
      } else {
        console.error("Failed to load services")
      }
    } catch (error) {
      console.error("Error loading services:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const response = await fetch("https://api.abigailgeneralcleaningservice.com/api/categories")
      if (response.ok) {
        const data = await response.json()
        setCategories(data.data || [])
      } else {
        console.error("Failed to load categories")
      }
    } catch (error) {
      console.error("Error loading categories:", error)
    }
  }

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault()
    if (
      !serviceForm.title ||
      !serviceForm.description ||
      !serviceForm.shortDescription ||
      !serviceForm.serviceType ||
      !serviceForm.category
    ) {
      alert("Title, short description, full description, service type, and category are required")
      return
    }

    if (serviceForm.images.length === 0) {
      alert("At least one image is required")
      return
    }

    const formData = new FormData()
    formData.append("title", serviceForm.title)
    formData.append("description", serviceForm.description)
    formData.append("shortDescription", serviceForm.shortDescription)
    formData.append("category", serviceForm.category)
    if (serviceForm.subcategory) formData.append("subcategory", serviceForm.subcategory)
    formData.append("serviceType", serviceForm.serviceType)

    if (serviceForm.features) formData.append("features", serviceForm.features)
    if (serviceForm.benefits) formData.append("benefits", serviceForm.benefits)
    if (serviceForm.requirements) formData.append("requirements", serviceForm.requirements)
    if (serviceForm.equipment) formData.append("equipment", serviceForm.equipment)

    formData.append("pricingType", serviceForm.pricingType)
    if (serviceForm.pricingAmount) formData.append("pricingAmount", serviceForm.pricingAmount)
    formData.append("pricingCurrency", serviceForm.pricingCurrency)
    if (serviceForm.pricingDescription) formData.append("pricingDescription", serviceForm.pricingDescription)

    if (serviceForm.duration) formData.append("duration", serviceForm.duration)
    formData.append("coverage", serviceForm.coverage)
    formData.append("status", serviceForm.status)
    formData.append("featured", serviceForm.featured.toString())
    formData.append("priority", serviceForm.priority.toString())

    // Append multiple images
    serviceForm.images.forEach((image, index) => {
      formData.append("images", image)
    })

    // Append additional images
    if (serviceForm.gallery.length > 0) {
      serviceForm.gallery.forEach((image) => {
        formData.append("gallery", image)
      })
    }

    if (serviceForm.beforeImages.length > 0) {
      serviceForm.beforeImages.forEach((image) => {
        formData.append("beforeAfterImages[before]", image)
      })
    }

    if (serviceForm.afterImages.length > 0) {
      serviceForm.afterImages.forEach((image) => {
        formData.append("beforeAfterImages[after]", image)
      })
    }

    // SEO and contact info
    if (serviceForm.seoTitle) formData.append("seoTitle", serviceForm.seoTitle)
    if (serviceForm.seoDescription) formData.append("seoDescription", serviceForm.seoDescription)
    if (serviceForm.seoKeywords) formData.append("seoKeywords", serviceForm.seoKeywords)
    if (serviceForm.contactEmail) formData.append("contactEmail", serviceForm.contactEmail)
    if (serviceForm.contactPhone) formData.append("contactPhone", serviceForm.contactPhone)
    if (serviceForm.contactWebsite) formData.append("contactWebsite", serviceForm.contactWebsite)

    try {
      const response = await fetch(`${API_BASE_URL}/create`, {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        alert("Service created successfully!")
        setShowCreateDialog(false)
        resetServiceForm()
        loadServices()
      } else {
        const error = await response.json()
        alert(error.message || "Failed to create service")
      }
    } catch (error) {
      alert("Failed to create service")
    }
  }

  const handleEditService = async (e: React.FormEvent) => {
    e.preventDefault()
    if (
      !selectedService ||
      !editForm.title ||
      !editForm.description ||
      !editForm.shortDescription ||
      !editForm.serviceType ||
      !editForm.category
    ) {
      alert("Title, short description, full description, service type, and category are required")
      return
    }

    const formData = new FormData()
    formData.append("title", editForm.title)
    formData.append("description", editForm.description)
    formData.append("shortDescription", editForm.shortDescription)
    formData.append("category", editForm.category)
    if (editForm.subcategory) formData.append("subcategory", editForm.subcategory)
    formData.append("serviceType", editForm.serviceType)

    if (editForm.features) formData.append("features", editForm.features)
    if (editForm.benefits) formData.append("benefits", editForm.benefits)
    if (editForm.requirements) formData.append("requirements", editForm.requirements)
    if (editForm.equipment) formData.append("equipment", editForm.equipment)

    formData.append("pricingType", editForm.pricingType)
    if (editForm.pricingAmount) formData.append("pricingAmount", editForm.pricingAmount)
    formData.append("pricingCurrency", editForm.pricingCurrency)
    if (editForm.pricingDescription) formData.append("pricingDescription", editForm.pricingDescription)

    if (editForm.duration) formData.append("duration", editForm.duration)
    formData.append("coverage", editForm.coverage)
    formData.append("status", editForm.status)
    formData.append("featured", editForm.featured.toString())
    formData.append("priority", editForm.priority.toString())

    // Append multiple images if new ones are selected
    if (editForm.images.length > 0) {
      editForm.images.forEach((image) => {
        formData.append("images", image)
      })
    }

    // Append additional images
    if (editForm.gallery.length > 0) {
      editForm.gallery.forEach((image) => {
        formData.append("gallery", image)
      })
    }

    if (editForm.beforeImages.length > 0) {
      editForm.beforeImages.forEach((image) => {
        formData.append("beforeAfterImages[before]", image)
      })
    }

    if (editForm.afterImages.length > 0) {
      editForm.afterImages.forEach((image) => {
        formData.append("beforeAfterImages[after]", image)
      })
    }

    // SEO and contact info
    if (editForm.seoTitle) formData.append("seoTitle", editForm.seoTitle)
    if (editForm.seoDescription) formData.append("seoDescription", editForm.seoDescription)
    if (editForm.seoKeywords) formData.append("seoKeywords", editForm.seoKeywords)
    if (editForm.contactEmail) formData.append("contactEmail", editForm.contactEmail)
    if (editForm.contactPhone) formData.append("contactPhone", editForm.contactPhone)
    if (editForm.contactWebsite) formData.append("contactWebsite", editForm.contactWebsite)

    try {
      const response = await fetch(`${API_BASE_URL}/${selectedService._id}`, {
        method: "PUT",
        body: formData,
      })

      if (response.ok) {
        alert("Service updated successfully!")
        setShowEditDialog(false)
        setSelectedService(null)
        loadServices()
      } else {
        const error = await response.json()
        alert(error.message || "Failed to update service")
      }
    } catch (error) {
      alert("Failed to update service")
    }
  }

  const handleDeleteService = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return

    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        alert("Service deleted successfully!")
        loadServices()
      } else {
        const error = await response.json()
        alert(error.message || "Failed to delete service")
      }
    } catch (error) {
      alert("Failed to delete service")
    }
  }

  const openEditDialog = (service: Service) => {
    setSelectedService(service)
    setEditForm({
      title: service.title,
      description: service.description,
      shortDescription: service.shortDescription || "",
      category: service.category || "",
      subcategory: service.subcategory || "",
      serviceType: service.serviceType,
      features: Array.isArray(service.features) ? service.features.join(", ") : "",
      benefits: Array.isArray(service.benefits) ? service.benefits.join(", ") : "",
      requirements: Array.isArray(service.requirements) ? service.requirements.join(", ") : "",
      equipment: Array.isArray(service.equipment) ? service.equipment.join(", ") : "",
      pricingType: service.pricing.type || "custom",
      pricingAmount: service.pricing.amount?.toString() || "",
      pricingCurrency: service.pricing.currency || "ETB",
      pricingDescription: service.pricing.description || "",
      duration: service.duration || "",
      coverage: service.coverage || "all",
      status: service.status || "active",
      featured: service.featured || false,
      priority: service.priority || 1,
      images: [],
      mainImage: null,
      gallery: [],
      beforeImages: [],
      afterImages: [],
      seoTitle: service.seoTitle || "",
      seoDescription: service.seoDescription || "",
      seoKeywords: Array.isArray(service.seoKeywords) ? service.seoKeywords.join(", ") : "",
      contactEmail: service.contactInfo?.email || "",
      contactPhone: service.contactInfo?.phone || "",
      contactWebsite: service.contactInfo?.website || "",
    })
    setShowEditDialog(true)
  }

  const openViewDialog = (service: Service) => {
    setSelectedService(service)
    setShowViewDialog(true)
  }

  const resetServiceForm = () => {
    setServiceForm({
      title: "",
      description: "",
      shortDescription: "",
      category: "",
      subcategory: "",
      serviceType: "Coach Cleaning",
      features: "",
      benefits: "",
      requirements: "",
      equipment: "",
      pricingType: "custom",
      pricingAmount: "",
      pricingCurrency: "ETB",
      pricingDescription: "",
      duration: "",
      coverage: "all",
      status: "active",
      featured: false,
      priority: 1,
      images: [],
      mainImage: null,
      gallery: [],
      beforeImages: [],
      afterImages: [],
      seoTitle: "",
      seoDescription: "",
      seoKeywords: "",
      contactEmail: "",
      contactPhone: "",
      contactWebsite: "",
    })
  }

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || service.category === filterCategory
    const matchesStatus = filterStatus === "all" || service.status === filterStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Section - Mobile Responsive */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-purple-900">Service Management</h2>
          <p className="text-purple-600 mt-1">Manage your cleaning services and offerings</p>
        </div>
        <Button
          onClick={() => setShowCreateDialog(true)}
          className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white"
          size="lg"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Service
        </Button>
      </div>

      {/* Statistics Cards - Mobile Responsive */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600">Total Services</p>
                <p className="text-2xl font-bold text-purple-900">{services.length}</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Settings className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600">Active Services</p>
                <p className="text-2xl font-bold text-purple-900">
                  {services.filter((s) => s.status === "active").length}
                </p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600">Featured Services</p>
                <p className="text-2xl font-bold text-purple-900">{services.filter((s) => s.featured).length}</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Star className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600">Categories</p>
                <p className="text-2xl font-bold text-purple-900">{categories.length}</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters - Mobile Responsive */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-4 h-4" />
                <Input
                  placeholder="Search services by title, description, or category..."
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
                  <SelectItem value="coming-soon">Coming Soon</SelectItem>
                  <SelectItem value="discontinued">Discontinued</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category._id} value={category.name}>
                      {category.icon} {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {(searchTerm || filterCategory !== "all" || filterStatus !== "all") && (
            <div className="mt-2 text-sm text-purple-600">
              Showing {filteredServices.length} of {services.length} services
            </div>
          )}
        </CardContent>
      </Card>

      {/* Services Grid - Mobile Responsive */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.length > 0 ? (
          filteredServices.map((service) => (
            <Card key={service._id} className="border-purple-200 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-0 overflow-hidden">
                <div className="relative h-48 bg-gradient-to-br from-purple-100 to-purple-200">
                  {service.mainImage ? (
                    <img
                      src={`${API_BASE_URL.replace("/api/service", "")}/uploads/${service.mainImage}`}
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Settings className="w-12 h-12 text-purple-400" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3 flex gap-2">
                    {service.featured && (
                      <Badge className="bg-purple-600 text-white text-xs">
                        <Star className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                    <Badge variant={service.status === "active" ? "default" : "secondary"}>{service.status}</Badge>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-purple-900 mb-2">{service.title}</h3>
                  <p className="text-sm text-purple-600 mb-3 line-clamp-2">
                    {service.shortDescription || service.description}
                  </p>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-purple-500" />
                      <span className="text-sm font-medium text-purple-700">
                        {service.pricing?.amount
                          ? `${service.pricing.amount} ${service.pricing.currency}`
                          : "Custom Quote"}
                      </span>
                    </div>
                    {service.duration && (
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4 text-purple-500" />
                        <span className="text-xs text-purple-600">{service.duration}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" onClick={() => openViewDialog(service)} className="flex-1">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => openEditDialog(service)} className="flex-1">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteService(service._id)}
                      className="flex-1 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full">
            <Card>
              <CardContent className="p-8 text-center">
                <Settings className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-purple-900 mb-2">No services found</h3>
                <p className="text-purple-600 mb-4">
                  {searchTerm || filterCategory !== "all" || filterStatus !== "all"
                    ? "Try adjusting your search or filters"
                    : "Get started by creating your first service"}
                </p>
                {!searchTerm && filterCategory === "all" && filterStatus === "all" && (
                  <Button onClick={() => setShowCreateDialog(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Service
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Create Service Dialog - Mobile Responsive */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent
          className={cn(
            "max-w-4xl max-h-[90vh] overflow-y-auto bg-white",
            isMobile && "w-full h-full m-0 rounded-none",
          )}
        >
          <DialogHeader>
            <DialogTitle className="text-purple-900">Create New Service</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateService} className="space-y-6">
            <div className="bg-purple-50 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">1</span>
                </div>
                <h3 className="text-xl font-semibold text-purple-900">Basic Information</h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-purple-700 font-medium flex items-center">
                    <span className="text-red-500 mr-1">*</span>
                    Service Title
                  </Label>
                  <Input
                    value={serviceForm.title}
                    onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                    className="h-12 bg-white border-purple-200 focus:border-purple-500"
                    placeholder="Enter service title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-purple-700 font-medium flex items-center">
                    <span className="text-red-500 mr-1">*</span>
                    Category
                  </Label>
                  <Select
                    value={serviceForm.category}
                    onValueChange={(value) => setServiceForm({ ...serviceForm, category: value })}
                  >
                    <SelectTrigger className="h-12 bg-white border-purple-200 focus:border-purple-500">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category._id} value={category.name}>
                          {category.icon} {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Service Details Section */}
            <div className="bg-purple-50 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">2</span>
                </div>
                <h3 className="text-xl font-semibold text-purple-900">Service Details</h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-purple-700 font-medium flex items-center">
                    <span className="text-red-500 mr-1">*</span>
                    Service Type
                  </Label>
                  <Select
                    value={serviceForm.serviceType}
                    onValueChange={(value) => setServiceForm({ ...serviceForm, serviceType: value })}
                  >
                    <SelectTrigger className="h-12 bg-white border-purple-200 focus:border-purple-500">
                      <SelectValue placeholder="Select service type" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      <SelectItem value="Coach Cleaning">🛋️ Coach Cleaning</SelectItem>
                      <SelectItem value="Dining Seat Cleaning">🪑 Dining Seat Cleaning</SelectItem>
                      <SelectItem value="Mattress Cleaning">🛏️ Mattress Cleaning</SelectItem>
                      <SelectItem value="Curtain Cleaning">🪟 Curtain Cleaning</SelectItem>
                      <SelectItem value="Carpet Cleaning">🧹 Carpet Cleaning</SelectItem>
                      <SelectItem value="Pest Prevention Services">🦟 Pest Prevention Services</SelectItem>
                      <SelectItem value="Residential & Office Full Package Cleaning">
                        🏠 Residential & Office Full Package Cleaning
                      </SelectItem>
                      <SelectItem value="After Construction Cleaning">🏗️ After Construction Cleaning</SelectItem>
                      <SelectItem value="Water Tanker Cleaning">🚰 Water Tanker Cleaning</SelectItem>
                      <SelectItem value="Swimming Pool Cleaning">🏊 Swimming Pool Cleaning</SelectItem>
                      <SelectItem value="After Event Cleaning">🎉 After Event Cleaning</SelectItem>
                      <SelectItem value="Regular Cleaning">📅 Regular Cleaning</SelectItem>
                      <SelectItem value="Warehouse Cleaning">🏭 Warehouse Cleaning</SelectItem>
                      <SelectItem value="Factory Cleaning">🏭 Factory Cleaning</SelectItem>
                      <SelectItem value="Laundry Service">👕 Laundry Service</SelectItem>
                      <SelectItem value="Building Cleaning">🏢 Building Cleaning</SelectItem>
                      <SelectItem value="Mirror Cleaning">🪞 Mirror Cleaning</SelectItem>
                      <SelectItem value="Kitchen Deep Cleaning">🍳 Kitchen Deep Cleaning</SelectItem>
                      <SelectItem value="Toilet Cleaning">🚽 Toilet Cleaning</SelectItem>
                      <SelectItem value="Public Area Cleaning">🏛️ Public Area Cleaning</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-purple-700 font-medium">Service Status</Label>
                  <Select
                    value={serviceForm.status}
                    onValueChange={(value) => setServiceForm({ ...serviceForm, status: value })}
                  >
                    <SelectTrigger className="h-12 bg-white border-purple-200 focus:border-purple-500">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">🟢 Active</SelectItem>
                      <SelectItem value="inactive">🔴 Inactive</SelectItem>
                      <SelectItem value="coming-soon">🟡 Coming Soon</SelectItem>
                      <SelectItem value="discontinued">⚫ Discontinued</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="bg-purple-50 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">3</span>
                </div>
                <h3 className="text-xl font-semibold text-purple-900">Service Description</h3>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-purple-700 font-medium flex items-center">
                    <span className="text-red-500 mr-1">*</span>
                    Short Description
                  </Label>
                  <div className="relative">
                    <Input
                      value={serviceForm.shortDescription}
                      onChange={(e) => setServiceForm({ ...serviceForm, shortDescription: e.target.value })}
                      className="h-12 bg-white border-purple-200 focus:border-purple-500 pr-20"
                      placeholder="Brief description of your service..."
                      required
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <span
                        className={`text-xs font-medium ${serviceForm.shortDescription.length > 180 ? "text-red-500" : serviceForm.shortDescription.length > 150 ? "text-yellow-500" : "text-purple-500"}`}
                      >
                        {serviceForm.shortDescription.length}/200
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-purple-700 font-medium flex items-center">
                    <span className="text-red-500 mr-1">*</span>
                    Full Description
                  </Label>
                  <Textarea
                    value={serviceForm.description}
                    onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                    className="h-28 bg-white border-purple-200 focus:border-purple-500"
                    placeholder="Provide a detailed overview of the service..."
                    required
                  />
                </div>
              </div>
            </div>

            {/* Pricing & Media Section */}
            <div className="bg-purple-50 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">4</span>
                </div>
                <h3 className="text-xl font-semibold text-purple-900">Pricing & Media</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label className="text-purple-700 font-medium">Pricing Type</Label>
                  <Select
                    value={serviceForm.pricingType}
                    onValueChange={(value) => setServiceForm({ ...serviceForm, pricingType: value })}
                  >
                    <SelectTrigger className="h-12 bg-white border-purple-200 focus:border-purple-500">
                      <SelectValue placeholder="Select pricing type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">Fixed Price</SelectItem>
                      <SelectItem value="per-square-meter">Per Square Meter</SelectItem>
                      <SelectItem value="per-hour">Per Hour</SelectItem>
                      <SelectItem value="custom">Custom Quote</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {serviceForm.pricingType !== "custom" && (
                  <div className="space-y-2">
                    <Label className="text-purple-700 font-medium">Amount</Label>
                    <Input
                      type="number"
                      value={serviceForm.pricingAmount}
                      onChange={(e) => setServiceForm({ ...serviceForm, pricingAmount: e.target.value })}
                      className="h-12 bg-white border-purple-200 focus:border-purple-500"
                      placeholder="e.g., 250"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label className="text-purple-700 font-medium">Currency</Label>
                  <Select
                    value={serviceForm.pricingCurrency}
                    onValueChange={(value) => setServiceForm({ ...serviceForm, pricingCurrency: value })}
                  >
                    <SelectTrigger className="h-12 bg-white border-purple-200 focus:border-purple-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ETB">ETB (Ethiopian Birr)</SelectItem>
                      <SelectItem value="USD">USD (US Dollar)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 col-span-1 md:col-span-2 lg:col-span-3">
                  <Label className="text-purple-700 font-medium">Duration</Label>
                  <Input
                    value={serviceForm.duration}
                    onChange={(e) => setServiceForm({ ...serviceForm, duration: e.target.value })}
                    className="h-12 bg-white border-purple-200 focus:border-purple-500"
                    placeholder="e.g., 2-3 hours, 1 day, 2 days"
                  />
                </div>

                <div className="space-y-2 col-span-1 md:col-span-2 lg:col-span-3">
                  <Label className="text-purple-700 font-medium flex items-center">
                    <span className="text-red-500 mr-1">*</span>
                    Service Images
                  </Label>
                  <Input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                      const files = e.target.files ? Array.from(e.target.files) : []
                      setServiceForm({ ...serviceForm, images: files })
                    }}
                    className="block w-full text-sm text-purple-500
                             file:mr-4 file:py-2 file:px-4
                             file:rounded-full file:border-0
                             file:text-sm file:font-semibold
                             file:bg-purple-50 file:text-purple-700
                             hover:file:bg-purple-100"
                  />
                  <p className="text-xs text-purple-500">Upload multiple images. First image will be the main image.</p>
                  {serviceForm.images.length > 0 && (
                    <div className="text-xs text-purple-600">{serviceForm.images.length} image(s) selected</div>
                  )}
                </div>
              </div>
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
                <Plus className="w-4 h-4 mr-2" />
                Create Service
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="glass-effect border-purple-200 w-[95vw] max-w-6xl max-h-[95vh] overflow-hidden rounded-2xl shadow-2xl">
          <DialogHeader className="sticky top-0 bg-gradient-to-r from-purple-50 via-white to-blue-50 z-20 pb-6 border-b-2 border-purple-200/50 backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Edit className="w-6 h-6 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-700 to-blue-700 bg-clip-text text-transparent">
                    Edit Service
                  </DialogTitle>
                  <p className="text-sm text-gray-600 mt-1">Update the details for this service offering</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="hidden sm:flex items-center space-x-2 text-xs text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Required fields marked with *</span>
                </div>
              </div>
            </div>
          </DialogHeader>

          <div className="overflow-y-auto max-h-[calc(95vh-140px)] pr-2 custom-scrollbar">
            <form onSubmit={handleEditService} className="space-y-6 p-2">
              {/* Basic Information Section */}
              <div className="bg-gradient-to-r from-purple-50/50 to-blue-50/50 rounded-2xl p-6 border border-purple-100/50">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">1</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">Basic Information</h3>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium flex items-center">
                      <span className="text-red-500 mr-1">*</span>Service Title
                    </Label>
                    <Input
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      className="h-12 bg-white/80 border-2 border-purple-200/50 text-gray-800 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 placeholder:text-gray-400"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium flex items-center">
                      <span className="text-red-500 mr-1">*</span>Category
                    </Label>
                    <Select
                      value={editForm.category}
                      onValueChange={(value) => setEditForm({ ...editForm, category: value })}
                    >
                      <SelectTrigger className="h-12 bg-white/80 border-2 border-purple-200/50 text-gray-800 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-2 border-purple-200 rounded-xl shadow-xl">
                        {categories.map((category) => (
                          <SelectItem key={category._id} value={category.name}>
                            {category.icon} {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium flex items-center">
                      <span className="text-red-500 mr-1">*</span>Service Type
                    </Label>
                    <Select
                      value={editForm.serviceType}
                      onValueChange={(value) => setEditForm({ ...editForm, serviceType: value })}
                    >
                      <SelectTrigger className="h-12 bg-white/80 border-2 border-purple-200/50 text-gray-800 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-2 border-blue-200 rounded-xl shadow-xl max-h-60">
                        <SelectItem value="Coach Cleaning">Coach Cleaning</SelectItem>
                        <SelectItem value="Dining Seat Cleaning">Dining Seat Cleaning</SelectItem>
                        <SelectItem value="Mattress Cleaning">Mattress Cleaning</SelectItem>
                        <SelectItem value="Curtain Cleaning">Curtain Cleaning</SelectItem>
                        <SelectItem value="Carpet Cleaning">Carpet Cleaning</SelectItem>
                        <SelectItem value="Pest Prevention Services">Pest Prevention Services</SelectItem>
                        <SelectItem value="Residential & Office Full Package Cleaning">
                          Residential & Office Full Package Cleaning
                        </SelectItem>
                        <SelectItem value="After Construction Cleaning">After Construction Cleaning</SelectItem>
                        <SelectItem value="Water Tanker Cleaning">Water Tanker Cleaning</SelectItem>
                        <SelectItem value="Swimming Pool Cleaning">Swimming Pool Cleaning</SelectItem>
                        <SelectItem value="After Event Cleaning">After Event Cleaning</SelectItem>
                        <SelectItem value="Regular Cleaning">Regular Cleaning</SelectItem>
                        <SelectItem value="Warehouse Cleaning">Warehouse Cleaning</SelectItem>
                        <SelectItem value="Factory Cleaning">Factory Cleaning</SelectItem>
                        <SelectItem value="Laundry Service">Laundry Service</SelectItem>
                        <SelectItem value="Building Cleaning">Building Cleaning</SelectItem>
                        <SelectItem value="Mirror Cleaning">Mirror Cleaning</SelectItem>
                        <SelectItem value="Kitchen Deep Cleaning">Kitchen Deep Cleaning</SelectItem>
                        <SelectItem value="Toilet Cleaning">Toilet Cleaning</SelectItem>
                        <SelectItem value="Public Area Cleaning">Public Area Cleaning</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Description Section */}
              <div className="bg-gradient-to-r from-blue-50/50 to-green-50/50 rounded-2xl p-6 border border-blue-100/50">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">2</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">Service Description</h3>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium flex items-center">
                      <span className="text-red-500 mr-1">*</span>
                      Short Description
                    </Label>
                    <div className="relative">
                      <Input
                        value={editForm.shortDescription}
                        onChange={(e) => setEditForm({ ...editForm, shortDescription: e.target.value })}
                        className="h-12 bg-white/80 border-2 border-blue-200/50 text-gray-800 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 placeholder:text-gray-400 pr-20"
                        placeholder="Brief description of your service..."
                        required
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <span
                          className={`text-xs font-medium ${editForm.shortDescription.length > 180 ? "text-red-500" : editForm.shortDescription.length > 150 ? "text-yellow-500" : "text-green-500"}`}
                        >
                          {editForm.shortDescription.length}/200
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">Keep it concise but informative (max 200 characters)</p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium flex items-center">
                      <span className="text-red-500 mr-1">*</span>
                      Full Description
                    </Label>
                    <div className="relative">
                      <Textarea
                        value={editForm.description}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        className="h-28 bg-white/80 border-2 border-blue-200/50 text-gray-800 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 placeholder:text-gray-400"
                        placeholder="Provide a detailed overview of the service..."
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing, Duration & Image Section */}
              <div className="bg-gradient-to-r from-yellow-50/50 to-orange-50/50 rounded-2xl p-6 border border-yellow-100/50">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">3</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">Pricing & Media</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">Pricing Type</Label>
                    <Select
                      value={editForm.pricingType}
                      onValueChange={(value) => setEditForm({ ...editForm, pricingType: value })}
                    >
                      <SelectTrigger className="h-12 bg-white/80 border-2 border-yellow-200/50 text-gray-800 rounded-xl focus:border-yellow-500 focus:ring-4 focus:ring-yellow-100 transition-all duration-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-2 border-yellow-200 rounded-xl shadow-xl">
                        <SelectItem value="fixed">Fixed Price</SelectItem>
                        <SelectItem value="per-square-meter">Per Square Meter</SelectItem>
                        <SelectItem value="per-hour">Per Hour</SelectItem>
                        <SelectItem value="custom">Custom Quote</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {editForm.pricingType !== "custom" && (
                    <div className="space-y-2">
                      <Label className="text-gray-700 font-medium">Amount</Label>
                      <Input
                        type="number"
                        value={editForm.pricingAmount}
                        onChange={(e) => setEditForm({ ...editForm, pricingAmount: e.target.value })}
                        className="h-12 bg-white/80 border-2 border-yellow-200/50 text-gray-800 rounded-xl focus:border-yellow-500 focus:ring-4 focus:ring-yellow-100 transition-all duration-300"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">Currency</Label>
                    <Select
                      value={editForm.pricingCurrency}
                      onValueChange={(value) => setEditForm({ ...editForm, pricingCurrency: value })}
                    >
                      <SelectTrigger className="h-12 bg-white/80 border-2 border-yellow-200/50 text-gray-800 rounded-xl focus:border-yellow-500 focus:ring-4 focus:ring-yellow-100 transition-all duration-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-2 border-yellow-200 rounded-xl shadow-xl">
                        <SelectItem value="ETB">ETB (Ethiopian Birr)</SelectItem>
                        <SelectItem value="USD">USD (US Dollar)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 col-span-1 md:col-span-2 lg:col-span-3">
                    <Label className="text-gray-700 font-medium">Duration</Label>
                    <Input
                      value={editForm.duration}
                      onChange={(e) => setEditForm({ ...editForm, duration: e.target.value })}
                      className="h-12 bg-white/80 border-2 border-yellow-200/50 text-gray-800 rounded-xl focus:border-yellow-500 focus:ring-4 focus:ring-yellow-100 transition-all duration-300"
                    />
                  </div>

                  <div className="space-y-2 col-span-1 md:col-span-2 lg:col-span-3">
                    <Label className="text-gray-700 font-medium">Service Images</Label>
                    <Input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => {
                        const files = e.target.files ? Array.from(e.target.files) : []
                        setEditForm({ ...editForm, images: files })
                      }}
                      className="block w-full text-sm text-gray-500
                               file:mr-4 file:py-2 file:px-4
                               file:rounded-full file:border-0
                               file:text-sm file:font-semibold
                               file:bg-purple-50 file:text-purple-700
                               hover:file:bg-purple-100 transition-all duration-300
                               border-none outline-none"
                    />
                    {selectedService?.images && selectedService.images.length > 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        Current images: {selectedService.images.length} image(s)
                      </p>
                    )}
                    {editForm.images.length > 0 && (
                      <div className="text-xs text-green-600">{editForm.images.length} new image(s) selected</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Dialog Footer */}
              <div className="sticky bottom-0 bg-white/80 backdrop-blur-sm pt-4 border-t-2 border-purple-200/50 z-20">
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowEditDialog(false)}
                    className="border-gray-300 text-gray-700 hover:bg-gray-100 transition-all duration-300"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="purple-gradient text-white hover:shadow-lg transition-all duration-300"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Update Service
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="glass-effect border-purple-200 w-[95vw] max-w-4xl max-h-[95vh] overflow-hidden rounded-2xl shadow-2xl">
          <DialogHeader className="sticky top-0 bg-gradient-to-r from-purple-50 via-white to-blue-50 z-20 pb-6 border-b-2 border-purple-200/50 backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-700 to-blue-700 bg-clip-text text-transparent">
                  {selectedService?.title}
                </DialogTitle>
                <p className="text-sm text-gray-600 mt-1">{selectedService?.shortDescription}</p>
              </div>
            </div>
          </DialogHeader>

          {selectedService && (
            <div className="overflow-y-auto max-h-[calc(95vh-140px)] pr-2 custom-scrollbar">
              <div className="space-y-6 p-2">
                {/* Image Section */}
                <div className="rounded-xl overflow-hidden shadow-md border-purple-100/50 border-2">
                  {selectedService.mainImage ? (
                    <img
                      src={`https://api.abigailgeneralcleaningservice.com/uploads/${selectedService.mainImage}`}
                      alt={selectedService.title}
                      className="w-full h-80 object-cover"
                    />
                  ) : selectedService.images && selectedService.images.length > 0 ? (
                    <img
                      src={`https://api.abigailgeneralcleaningservice.com/uploads/${selectedService.images[0]}`}
                      alt={selectedService.title}
                      className="w-full h-80 object-cover"
                    />
                  ) : (
                    <div className="w-full h-80 flex items-center justify-center bg-gray-100">
                      <Settings className="w-20 h-20 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-800">Service Information</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li>
                        <strong>Category:</strong> {selectedService.category}
                      </li>
                      <li>
                        <strong>Service Type:</strong> {selectedService.serviceType}
                      </li>
                      <li>
                        <strong>Status:</strong>{" "}
                        <Badge className={selectedService.status === "active" ? "bg-green-500" : "bg-red-500"}>
                          {selectedService.status}
                        </Badge>
                      </li>
                      <li>
                        <strong>Featured:</strong> {selectedService.featured ? "Yes" : "No"}
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-800">Pricing & Duration</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li>
                        <strong>Pricing Type:</strong> {selectedService.pricing.type}
                      </li>
                      <li>
                        <strong>Amount:</strong>{" "}
                        {selectedService.pricing.amount
                          ? `${selectedService.pricing.amount} ${selectedService.pricing.currency}`
                          : "N/A"}
                      </li>
                      <li>
                        <strong>Duration:</strong> {selectedService.duration || "N/A"}
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Full Description */}
                <div className="space-y-2">
                  <h4 className="text-lg font-semibold text-gray-800">Full Description</h4>
                  <p className="text-gray-700 leading-relaxed">{selectedService.description}</p>
                </div>

                {/* Features & Benefits */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-gray-800">Features</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      {selectedService.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-gray-800">Benefits</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      {selectedService.benefits.map((benefit, index) => (
                        <li key={index}>{benefit}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
