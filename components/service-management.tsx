"use client"

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
  serviceType: string
  features: string[]
  benefits: string[]
  pricing: {
    type: string
    amount?: number
    currency: string
    perSquareMeter?: number
    perHour?: number
    description?: string
  }
  duration?: string
  status: string
  featured?: boolean
  image: string
  createdAt: string
  updatedAt: string
}

export default function ServiceManagement() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showViewDialog, setShowViewDialog] = useState(false)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  
  const [serviceForm, setServiceForm] = useState({
    title: "",
    description: "",
    shortDescription: "",
    category: "Furniture Cleaning",
    serviceType: "Coach Cleaning",
    features: "",
    benefits: "",
    pricingType: "custom",
    pricingAmount: "",
    pricingCurrency: "ETB",
    duration: "",
    status: "active",
    featured: false,
    image: null as File | null,
  })

  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    shortDescription: "",
    category: "Furniture Cleaning",
    serviceType: "Coach Cleaning",
    features: "",
    benefits: "",
    pricingType: "custom",
    pricingAmount: "",
    pricingCurrency: "ETB",
    duration: "",
    status: "active",
    featured: false,
    image: null as File | null,
  })

  useEffect(() => {
    loadServices()
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

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!serviceForm.title || !serviceForm.description || !serviceForm.shortDescription || !serviceForm.serviceType) {
      alert("Title, short description, full description, and service type are required")
      return
    }

    const formData = new FormData()
    formData.append("title", serviceForm.title)
    formData.append("description", serviceForm.description)
    formData.append("shortDescription", serviceForm.shortDescription)
    formData.append("category", serviceForm.category)
    formData.append("serviceType", serviceForm.serviceType)
    formData.append("features", JSON.stringify(serviceForm.features.split(",").map(f => f.trim()).filter(f => f)))
    formData.append("benefits", JSON.stringify(serviceForm.benefits.split(",").map(b => b.trim()).filter(b => b)))
    formData.append("pricing", JSON.stringify({
      type: serviceForm.pricingType,
      amount: serviceForm.pricingAmount ? parseFloat(serviceForm.pricingAmount) : undefined,
      currency: serviceForm.pricingCurrency,
      description: serviceForm.pricingAmount ? `Starting from ${serviceForm.pricingAmount} ${serviceForm.pricingCurrency}` : 'Contact for pricing'
    }))
    if (serviceForm.duration) formData.append("duration", serviceForm.duration)
    formData.append("status", serviceForm.status)
    formData.append("featured", serviceForm.featured.toString())
    if (serviceForm.image) {
      formData.append("image", serviceForm.image)
    }

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
    if (!selectedService || !editForm.title || !editForm.description || !editForm.shortDescription || !editForm.serviceType) {
      alert("Title, short description, full description, and service type are required")
      return
    }

    const formData = new FormData()
    formData.append("title", editForm.title)
    formData.append("description", editForm.description)
    formData.append("shortDescription", editForm.shortDescription)
    formData.append("category", editForm.category)
    formData.append("serviceType", editForm.serviceType)
    formData.append("features", JSON.stringify(editForm.features.split(",").map(f => f.trim()).filter(f => f)))
    formData.append("benefits", JSON.stringify(editForm.benefits.split(",").map(b => b.trim()).filter(b => b)))
    formData.append("pricing", JSON.stringify({
      type: editForm.pricingType,
      amount: editForm.pricingAmount ? parseFloat(editForm.pricingAmount) : undefined,
      currency: editForm.pricingCurrency,
      description: editForm.pricingAmount ? `Starting from ${editForm.pricingAmount} ${editForm.pricingCurrency}` : 'Contact for pricing'
    }))
    if (editForm.duration) formData.append("duration", editForm.duration)
    formData.append("status", editForm.status)
    formData.append("featured", editForm.featured.toString())
    if (editForm.image) {
      formData.append("image", editForm.image)
    }

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
      category: service.category || "Furniture Cleaning",
      serviceType: service.serviceType,
      features: Array.isArray(service.features) ? service.features.join(", ") : "",
      benefits: Array.isArray(service.benefits) ? service.benefits.join(", ") : "",
      pricingType: service.pricing.type || "custom",
      pricingAmount: service.pricing.amount?.toString() || "",
      pricingCurrency: service.pricing.currency || "ETB",
      duration: service.duration || "",
      status: service.status || "active",
      featured: service.featured || false,
      image: null,
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
      category: "Furniture Cleaning",
      serviceType: "Coach Cleaning",
      features: "",
      benefits: "",
      pricingType: "custom",
      pricingAmount: "",
      pricingCurrency: "ETB",
      duration: "",
      status: "active",
      featured: false,
      image: null,
    })
  }

  const filteredServices = services.filter(service => {
    return service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           service.description.toLowerCase().includes(searchTerm.toLowerCase())
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loader border-4 border-gray-200 border-t-purple-500 rounded-full w-12 h-12 animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-purple-700">Service Management</h2>
          <p className="text-gray-600 mt-1">Manage your cleaning services and offerings</p>
        </div>
        <Button
          onClick={() => setShowCreateDialog(true)}
          className="purple-gradient text-white hover:shadow-lg transition-all duration-300"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Service
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 border border-purple-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Services</p>
              <p className="text-2xl font-bold text-purple-700">{services.length}</p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Settings className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-green-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Services</p>
              <p className="text-2xl font-bold text-green-700">
                {services.filter(s => s.status === 'active').length}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-yellow-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Featured Services</p>
              <p className="text-2xl font-bold text-yellow-700">
                {services.filter(s => s.featured).length}
              </p>
            </div>
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <Star className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-blue-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Categories</p>
              <p className="text-2xl font-bold text-blue-700">
                {new Set(services.map(s => s.category)).size}
              </p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search services by title, description, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white border-purple-200"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Select value="" onValueChange={(value) => {
              if (value === 'all') setSearchTerm('')
              else setSearchTerm(value)
            }}>
              <SelectTrigger className="w-40 bg-white border-purple-200">
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
            <Select value="" onValueChange={(value) => {
              if (value === 'all') setSearchTerm('')
              else setSearchTerm(value)
            }}>
              <SelectTrigger className="w-40 bg-white border-purple-200">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Furniture Cleaning">Furniture Cleaning</SelectItem>
                <SelectItem value="Floor & Carpet Cleaning">Floor & Carpet Cleaning</SelectItem>
                <SelectItem value="Deep Cleaning">Deep Cleaning</SelectItem>
                <SelectItem value="Specialized Cleaning">Specialized Cleaning</SelectItem>
                <SelectItem value="Post-Construction Cleaning">Post-Construction Cleaning</SelectItem>
                <SelectItem value="Regular Maintenance">Regular Maintenance</SelectItem>
                <SelectItem value="Pest Prevention">Pest Prevention</SelectItem>
                <SelectItem value="Laundry Services">Laundry Services</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {searchTerm && (
          <div className="mt-2 text-sm text-gray-600">
            Showing {filteredServices.length} of {services.length} services
          </div>
        )}
      </div>

      {/* Services List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.length > 0 ? (
          filteredServices.map((service) => (
            <Card key={service._id} className="glass-effect border-purple-200 hover:shadow-lg transition-all duration-300 group">
              <CardContent className="p-0 overflow-hidden">
                {/* Image Section */}
                <div className="relative h-48 bg-gradient-to-br from-purple-100 to-blue-100">
                  {service.image ? (
                    <img
                      src={`http://localhost:5000/uploads/${service.image}`}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Settings className="w-16 h-16 text-purple-400" />
                    </div>
                  )}
                  {/* Status Badge Overlay */}
                  <div className="absolute top-3 right-3">
                    <Badge className={
                      service.status === 'active' ? 'bg-green-500 text-white border-0' :
                      service.status === 'inactive' ? 'bg-red-500 text-white border-0' :
                      'bg-yellow-500 text-white border-0'
                    }>
                      {service.status}
                    </Badge>
                  </div>
                  {/* Featured Badge */}
                  {service.featured && (
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-yellow-500 text-white border-0">
                        <Star className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    </div>
                  )}
                </div>
                
                {/* Content Section */}
                <div className="p-4">
                  <div className="mb-3">
                    <h4 className="font-semibold text-gray-800 mb-2 text-lg group-hover:text-purple-700 transition-colors">
                      {service.title}
                    </h4>
                    <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                      {service.shortDescription || service.description}
                    </p>
                  </div>
                  
                  {/* Category Badge */}
                  <div className="mb-3">
                    <Badge className="bg-purple-100 text-purple-700 border border-purple-200 text-xs">
                      {service.category}
                    </Badge>
                  </div>

                  {/* Pricing Info */}
                  <div className="mb-4">
                    <div className="flex items-center justify-center space-x-2 p-2 bg-gray-50 rounded-lg">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-gray-800">
                        {service.pricing.type === 'fixed' && service.pricing.amount ? 
                          `${service.pricing.amount} ${service.pricing.currency}` :
                          service.pricing.type === 'per-square-meter' && service.pricing.perSquareMeter ?
                          `${service.pricing.perSquareMeter} ${service.pricing.currency}/m²` :
                          service.pricing.type === 'per-hour' && service.pricing.perHour ?
                          `${service.pricing.perHour} ${service.pricing.currency}/hr` :
                          'Custom Quote'
                        }
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openViewDialog(service)}
                      className="border-purple-200 text-purple-700 hover:bg-purple-50 flex-1"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditDialog(service)}
                      className="border-purple-200 text-purple-700 hover:bg-purple-50 flex-1"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteService(service._id)}
                      className="border-red-200 text-red-700 hover:bg-red-50 flex-1"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
            <p className="text-gray-500">Get started by creating your first service.</p>
          </div>
        )}
      </div>

      {/* Create Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="glass-effect border-purple-200 w-[95vw] max-w-6xl max-h-[95vh] overflow-hidden rounded-2xl shadow-2xl">
          <DialogHeader className="sticky top-0 bg-gradient-to-r from-purple-50 via-white to-blue-50 z-20 pb-6 border-b-2 border-purple-200/50 backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-700 to-blue-700 bg-clip-text text-transparent">
                    Add New Service
                  </DialogTitle>
                  <p className="text-sm text-gray-600 mt-1">Create a professional cleaning service offering</p>
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
            <form onSubmit={handleCreateService} className="space-y-6 p-2">
              {/* Progress Indicator */}
              <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-purple-100 shadow-sm">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>Form Progress</span>
                  <span className="font-medium text-purple-700">Step 1 of 4</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-purple-500 to-blue-600 h-2 rounded-full transition-all duration-500" style={{width: '25%'}}></div>
                </div>
              </div>

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
                      <span className="text-red-500 mr-1">*</span>
                      Service Title
                    </Label>
                    <Input
                      value={serviceForm.title}
                      onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                      className="h-12 bg-white/80 border-2 border-purple-200/50 text-gray-800 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 placeholder:text-gray-400"
                      placeholder="Enter service title..."
                      required
                    />
                    <p className="text-xs text-gray-500">Choose a clear, descriptive title for your service</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium flex items-center">
                      <span className="text-red-500 mr-1">*</span>
                      Category
                    </Label>
                    <Select value={serviceForm.category} onValueChange={(value) => setServiceForm({ ...serviceForm, category: value })}>
                      <SelectTrigger className="h-12 bg-white/80 border-2 border-purple-200/50 text-gray-800 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-2 border-purple-200 rounded-xl shadow-xl">
                        <SelectItem value="Furniture Cleaning" className="hover:bg-purple-50 focus:bg-purple-100">🪑 Furniture Cleaning</SelectItem>
                        <SelectItem value="Floor & Carpet Cleaning" className="hover:bg-purple-50 focus:bg-purple-100">🧹 Floor & Carpet Cleaning</SelectItem>
                        <SelectItem value="Deep Cleaning" className="hover:bg-purple-50 focus:bg-purple-100">✨ Deep Cleaning</SelectItem>
                        <SelectItem value="Specialized Cleaning" className="hover:bg-purple-50 focus:bg-purple-100">🔧 Specialized Cleaning</SelectItem>
                        <SelectItem value="Post-Construction Cleaning" className="hover:bg-purple-50 focus:bg-purple-100">🏗️ Post-Construction Cleaning</SelectItem>
                        <SelectItem value="Regular Maintenance" className="hover:bg-purple-50 focus:bg-purple-100">📅 Regular Maintenance</SelectItem>
                        <SelectItem value="Pest Prevention" className="hover:bg-purple-50 focus:bg-purple-100">🦟 Pest Prevention</SelectItem>
                        <SelectItem value="Laundry Services" className="hover:bg-purple-50 focus:bg-purple-100">👕 Laundry Services</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500">Select the most appropriate category for your service</p>
                  </div>
                </div>
              </div>

              {/* Service Details Section */}
              <div className="bg-gradient-to-r from-blue-50/50 to-green-50/50 rounded-2xl p-6 border border-blue-100/50">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">2</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">Service Details</h3>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium flex items-center">
                      <span className="text-red-500 mr-1">*</span>
                      Service Type
                    </Label>
                    <Select value={serviceForm.serviceType} onValueChange={(value) => setServiceForm({ ...serviceForm, serviceType: value })}>
                      <SelectTrigger className="h-12 bg-white/80 border-2 border-blue-200/50 text-gray-800 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300">
                        <SelectValue placeholder="Select service type" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-2 border-blue-200 rounded-xl shadow-xl max-h-60">
                        <SelectItem value="Coach Cleaning" className="hover:bg-blue-50 focus:bg-blue-100">🛋️ Coach Cleaning</SelectItem>
                        <SelectItem value="Dining Seat Cleaning" className="hover:bg-blue-50 focus:bg-blue-100">🪑 Dining Seat Cleaning</SelectItem>
                        <SelectItem value="Mattress Cleaning" className="hover:bg-blue-50 focus:bg-blue-100">🛏️ Mattress Cleaning</SelectItem>
                        <SelectItem value="Curtain Cleaning" className="hover:bg-blue-50 focus:bg-blue-100">🪟 Curtain Cleaning</SelectItem>
                        <SelectItem value="Carpet Cleaning" className="hover:bg-blue-50 focus:bg-blue-100">🧹 Carpet Cleaning</SelectItem>
                        <SelectItem value="Pest Prevention Services" className="hover:bg-blue-50 focus:bg-blue-100">🦟 Pest Prevention Services</SelectItem>
                        <SelectItem value="Residential & Office Full Package Cleaning" className="hover:bg-blue-50 focus:bg-blue-100">🏠 Residential & Office Full Package Cleaning</SelectItem>
                        <SelectItem value="After Construction Cleaning" className="hover:bg-blue-50 focus:bg-blue-100">🏗️ After Construction Cleaning</SelectItem>
                        <SelectItem value="Water Tanker Cleaning" className="hover:bg-blue-50 focus:bg-blue-100">🚰 Water Tanker Cleaning</SelectItem>
                        <SelectItem value="Swimming Pool Cleaning" className="hover:bg-blue-50 focus:bg-blue-100">🏊 Swimming Pool Cleaning</SelectItem>
                        <SelectItem value="After Event Cleaning" className="hover:bg-blue-50 focus:bg-blue-100">🎉 After Event Cleaning</SelectItem>
                        <SelectItem value="Regular Cleaning" className="hover:bg-blue-50 focus:bg-blue-100">📅 Regular Cleaning</SelectItem>
                        <SelectItem value="Warehouse Cleaning" className="hover:bg-blue-50 focus:bg-blue-100">🏭 Warehouse Cleaning</SelectItem>
                        <SelectItem value="Factory Cleaning" className="hover:bg-blue-50 focus:bg-blue-100">🏭 Factory Cleaning</SelectItem>
                        <SelectItem value="Laundry Service" className="hover:bg-blue-50 focus:bg-blue-100">👕 Laundry Service</SelectItem>
                        <SelectItem value="Building Cleaning" className="hover:bg-blue-50 focus:bg-blue-100">🏢 Building Cleaning</SelectItem>
                        <SelectItem value="Mirror Cleaning" className="hover:bg-blue-50 focus:bg-blue-100">🪞 Mirror Cleaning</SelectItem>
                        <SelectItem value="Kitchen Deep Cleaning" className="hover:bg-blue-50 focus:bg-blue-100">🍳 Kitchen Deep Cleaning</SelectItem>
                        <SelectItem value="Toilet Cleaning" className="hover:bg-blue-50 focus:bg-blue-100">🚽 Toilet Cleaning</SelectItem>
                        <SelectItem value="Public Area Cleaning" className="hover:bg-blue-50 focus:bg-blue-100">🏛️ Public Area Cleaning</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500">Specify the exact type of cleaning service</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">Service Status</Label>
                    <Select value={serviceForm.status} onValueChange={(value) => setServiceForm({ ...serviceForm, status: value })}>
                      <SelectTrigger className="h-12 bg-white/80 border-2 border-blue-200/50 text-gray-800 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-2 border-blue-200 rounded-xl shadow-xl">
                        <SelectItem value="active" className="hover:bg-green-50 focus:bg-green-100">🟢 Active</SelectItem>
                        <SelectItem value="inactive" className="hover:bg-red-50 focus:bg-red-100">🔴 Inactive</SelectItem>
                        <SelectItem value="coming-soon" className="hover:bg-yellow-50 focus:bg-yellow-100">🟡 Coming Soon</SelectItem>
                        <SelectItem value="discontinued" className="hover:bg-gray-50 focus:bg-gray-100">⚫ Discontinued</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500">Set the current availability status</p>
                  </div>
                </div>
              </div>

              {/* Description Section */}
              <div className="bg-gradient-to-r from-green-50/50 to-yellow-50/50 rounded-2xl p-6 border border-green-100/50">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-yellow-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">3</span>
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
                        value={serviceForm.shortDescription}
                        onChange={(e) => setServiceForm({ ...serviceForm, shortDescription: e.target.value })}
                        className="h-12 bg-white/80 border-2 border-green-200/50 text-gray-800 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300 placeholder:text-gray-400 pr-20"
                        placeholder="Brief description of your service..."
                        required
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <span className={`text-xs font-medium ${serviceForm.shortDescription.length > 180 ? 'text-red-500' : serviceForm.shortDescription.length > 150 ? 'text-yellow-500' : 'text-green-500'}`}>
                          {serviceForm.shortDescription.length}/200
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
                        value={serviceForm.description}
                        onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                        className="h-28 bg-white/80 border-2 border-green-200/50 text-gray-800 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300 placeholder:text-gray-400"
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
                    <span className="text-white font-bold text-sm">4</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">Pricing & Media</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">Pricing Type</Label>
                    <Select value={serviceForm.pricingType} onValueChange={(value) => setServiceForm({ ...serviceForm, pricingType: value })}>
                      <SelectTrigger className="h-12 bg-white/80 border-2 border-yellow-200/50 text-gray-800 rounded-xl focus:border-yellow-500 focus:ring-4 focus:ring-yellow-100 transition-all duration-300">
                        <SelectValue placeholder="Select pricing type" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-2 border-yellow-200 rounded-xl shadow-xl">
                        <SelectItem value="fixed">Fixed Price</SelectItem>
                        <SelectItem value="per-square-meter">Per Square Meter</SelectItem>
                        <SelectItem value="per-hour">Per Hour</SelectItem>
                        <SelectItem value="custom">Custom Quote</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {serviceForm.pricingType !== 'custom' && (
                    <div className="space-y-2">
                      <Label className="text-gray-700 font-medium">Amount</Label>
                      <Input
                        type="number"
                        value={serviceForm.pricingAmount}
                        onChange={(e) => setServiceForm({ ...serviceForm, pricingAmount: e.target.value })}
                        className="h-12 bg-white/80 border-2 border-yellow-200/50 text-gray-800 rounded-xl focus:border-yellow-500 focus:ring-4 focus:ring-yellow-100 transition-all duration-300 placeholder:text-gray-400"
                        placeholder="e.g., 250"
                      />
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">Currency</Label>
                    <Select value={serviceForm.pricingCurrency} onValueChange={(value) => setServiceForm({ ...serviceForm, pricingCurrency: value })}>
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
                      value={serviceForm.duration}
                      onChange={(e) => setServiceForm({ ...serviceForm, duration: e.target.value })}
                      className="h-12 bg-white/80 border-2 border-yellow-200/50 text-gray-800 rounded-xl focus:border-yellow-500 focus:ring-4 focus:ring-yellow-100 transition-all duration-300 placeholder:text-gray-400"
                      placeholder="e.g., 2-3 hours, 1 day, 2 days"
                    />
                  </div>
                  
                  <div className="space-y-2 col-span-1 md:col-span-2 lg:col-span-3">
                    <Label className="text-gray-700 font-medium">Service Image</Label>
                    <Input
                      type="file"
                      onChange={(e) => setServiceForm({ ...serviceForm, image: e.target.files ? e.target.files[0] : null })}
                      className="block w-full text-sm text-gray-500
                               file:mr-4 file:py-2 file:px-4
                               file:rounded-full file:border-0
                               file:text-sm file:font-semibold
                               file:bg-purple-50 file:text-purple-700
                               hover:file:bg-purple-100 transition-all duration-300
                               border-none outline-none"
                    />
                  </div>
                </div>
              </div>
              
              {/* Dialog Footer */}
              <div className="sticky bottom-0 bg-white/80 backdrop-blur-sm pt-4 border-t-2 border-purple-200/50 z-20">
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateDialog(false)}
                    className="border-gray-300 text-gray-700 hover:bg-gray-100 transition-all duration-300"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="purple-gradient text-white hover:shadow-lg transition-all duration-300"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Service
                  </Button>
                </div>
              </div>
            </form>
          </div>
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
                    <Select value={editForm.category} onValueChange={(value) => setEditForm({ ...editForm, category: value })}>
                      <SelectTrigger className="h-12 bg-white/80 border-2 border-purple-200/50 text-gray-800 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-2 border-purple-200 rounded-xl shadow-xl">
                        <SelectItem value="Furniture Cleaning">Furniture Cleaning</SelectItem>
                        <SelectItem value="Floor & Carpet Cleaning">Floor & Carpet Cleaning</SelectItem>
                        <SelectItem value="Deep Cleaning">Deep Cleaning</SelectItem>
                        <SelectItem value="Specialized Cleaning">Specialized Cleaning</SelectItem>
                        <SelectItem value="Post-Construction Cleaning">Post-Construction Cleaning</SelectItem>
                        <SelectItem value="Regular Maintenance">Regular Maintenance</SelectItem>
                        <SelectItem value="Pest Prevention">Pest Prevention</SelectItem>
                        <SelectItem value="Laundry Services">Laundry Services</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium flex items-center">
                      <span className="text-red-500 mr-1">*</span>Service Type
                    </Label>
                    <Select value={editForm.serviceType} onValueChange={(value) => setEditForm({ ...editForm, serviceType: value })}>
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
                        <SelectItem value="Residential & Office Full Package Cleaning">Residential & Office Full Package Cleaning</SelectItem>
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
                        <span className={`text-xs font-medium ${editForm.shortDescription.length > 180 ? 'text-red-500' : editForm.shortDescription.length > 150 ? 'text-yellow-500' : 'text-green-500'}`}>
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
                    <Select value={editForm.pricingType} onValueChange={(value) => setEditForm({ ...editForm, pricingType: value })}>
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
                  
                  {editForm.pricingType !== 'custom' && (
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
                    <Select value={editForm.pricingCurrency} onValueChange={(value) => setEditForm({ ...editForm, pricingCurrency: value })}>
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
                    <Label className="text-gray-700 font-medium">Service Image</Label>
                    <Input
                      type="file"
                      onChange={(e) => setEditForm({ ...editForm, image: e.target.files ? e.target.files[0] : null })}
                      className="block w-full text-sm text-gray-500
                               file:mr-4 file:py-2 file:px-4
                               file:rounded-full file:border-0
                               file:text-sm file:font-semibold
                               file:bg-purple-50 file:text-purple-700
                               hover:file:bg-purple-100 transition-all duration-300
                               border-none outline-none"
                    />
                    {selectedService?.image && (
                      <p className="text-xs text-gray-500 mt-1">
                        Current image: <a href={`http://localhost:5000/uploads/${selectedService.image}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{selectedService.image}</a>
                      </p>
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
                  {selectedService.image ? (
                    <img
                      src={`http://localhost:5000/uploads/${selectedService.image}`}
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
                      <li><strong>Category:</strong> {selectedService.category}</li>
                      <li><strong>Service Type:</strong> {selectedService.serviceType}</li>
                      <li><strong>Status:</strong> <Badge className={selectedService.status === 'active' ? 'bg-green-500' : 'bg-red-500'}>{selectedService.status}</Badge></li>
                      <li><strong>Featured:</strong> {selectedService.featured ? 'Yes' : 'No'}</li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-800">Pricing & Duration</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li><strong>Pricing Type:</strong> {selectedService.pricing.type}</li>
                      <li><strong>Amount:</strong> {selectedService.pricing.amount ? `${selectedService.pricing.amount} ${selectedService.pricing.currency}` : 'N/A'}</li>
                      <li><strong>Duration:</strong> {selectedService.duration || 'N/A'}</li>
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