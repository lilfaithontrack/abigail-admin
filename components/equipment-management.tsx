"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Eye, Trash2, Search, Wrench } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

const API_BASE_URL = "http://localhost:5000/api"

interface Equipment {
  _id: string
  name: string
  description: string
  category: string
  equipmentType: string
  status: string
  condition: string
  image: string
  slug: string
  createdAt: string
  updatedAt: string
}

export default function EquipmentManagement() {
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showViewDialog, setShowViewDialog] = useState(false)
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [equipmentForm, setEquipmentForm] = useState({
    name: "",
    description: "",
    category: "Floor Cleaning Equipment",
    equipmentType: "Floor Machine",
    status: "active",
    condition: "good",
    image: null as File | null,
  })
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    category: "Floor Cleaning Equipment",
    equipmentType: "Floor Machine",
    status: "active",
    condition: "good",
    image: null as File | null,
  })

  useEffect(() => {
    loadEquipment()
  }, [])

  const loadEquipment = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/equipment`)
      if (response.ok) {
        const data = await response.json()
        setEquipment(data.data || data)
      } else {
        console.error("Failed to load equipment")
      }
    } catch (error) {
      console.error("Error loading equipment:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateEquipment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!equipmentForm.name || !equipmentForm.description) {
      alert("Name and description are required")
      return
    }

    const formData = new FormData()
    formData.append("name", equipmentForm.name)
    formData.append("description", equipmentForm.description)
    formData.append("category", equipmentForm.category)
    formData.append("equipmentType", equipmentForm.equipmentType)
    formData.append("status", equipmentForm.status)
    formData.append("condition", equipmentForm.condition)
    
    if (equipmentForm.image) {
      formData.append("image", equipmentForm.image)
    }

    try {
      const response = await fetch(`${API_BASE_URL}/equipment`, {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        alert("Equipment created successfully!")
        setShowCreateDialog(false)
        resetEquipmentForm()
        loadEquipment()
      } else {
        const error = await response.json()
        alert(error.message || "Failed to create equipment")
      }
    } catch (error) {
      alert("Failed to create equipment")
    }
  }

  const handleEditEquipment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedEquipment || !editForm.name || !editForm.description) {
      alert("Name and description are required")
      return
    }

    const formData = new FormData()
    formData.append("name", editForm.name)
    formData.append("description", editForm.description)
    formData.append("category", editForm.category)
    formData.append("equipmentType", editForm.equipmentType)
    formData.append("status", editForm.status)
    formData.append("condition", editForm.condition)
    
    if (editForm.image) {
      formData.append("image", editForm.image)
    }

    try {
      const response = await fetch(`${API_BASE_URL}/equipment/${selectedEquipment._id}`, {
        method: "PUT",
        body: formData,
      })

      if (response.ok) {
        alert("Equipment updated successfully!")
        setShowEditDialog(false)
        setSelectedEquipment(null)
        loadEquipment()
      } else {
        const error = await response.json()
        alert(error.message || "Failed to update equipment")
      }
    } catch (error) {
      alert("Failed to update equipment")
    }
  }

  const handleDeleteEquipment = async (id: string) => {
    if (!confirm("Are you sure you want to delete this equipment?")) return

    try {
      const response = await fetch(`${API_BASE_URL}/equipment/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        alert("Equipment deleted successfully!")
        loadEquipment()
      } else {
        const error = await response.json()
        alert(error.message || "Failed to delete equipment")
      }
    } catch (error) {
      alert("Failed to delete equipment")
    }
  }

  const openEditDialog = (equipment: Equipment) => {
    setSelectedEquipment(equipment)
    setEditForm({
      name: equipment.name,
      description: equipment.description,
      category: equipment.category,
      equipmentType: equipment.equipmentType,
      status: equipment.status,
      condition: equipment.condition,
      image: null,
    })
    setShowEditDialog(true)
  }

  const openViewDialog = (equipment: Equipment) => {
    setSelectedEquipment(equipment)
    setShowViewDialog(true)
  }

  const resetEquipmentForm = () => {
    setEquipmentForm({
      name: "",
      description: "",
      category: "Floor Cleaning Equipment",
      equipmentType: "Floor Machine",
      status: "active",
      condition: "good",
      image: null,
    })
  }

  const filteredEquipment = equipment.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !filterCategory || item.category === filterCategory
    const matchesStatus = !filterStatus || item.status === filterStatus
    return matchesSearch && matchesCategory && matchesStatus
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
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-purple-700">Equipment Management</h2>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="purple-gradient text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Equipment
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-effect border-purple-200 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-purple-700">Add New Equipment</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateEquipment} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-700">Equipment Name</Label>
                  <Input
                    value={equipmentForm.name}
                    onChange={(e) => setEquipmentForm({ ...equipmentForm, name: e.target.value })}
                    className="bg-white border-purple-200 text-gray-800"
                    required
                  />
                </div>
                <div>
                  <Label className="text-gray-700">Category</Label>
                  <Select value={equipmentForm.category} onValueChange={(value) => setEquipmentForm({ ...equipmentForm, category: value })}>
                    <SelectTrigger className="bg-white border-purple-200 text-gray-800">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Floor Cleaning Equipment">Floor Cleaning Equipment</SelectItem>
                      <SelectItem value="Pressure Washing Equipment">Pressure Washing Equipment</SelectItem>
                      <SelectItem value="Vacuum Equipment">Vacuum Equipment</SelectItem>
                      <SelectItem value="Steam Equipment">Steam Equipment</SelectItem>
                      <SelectItem value="Extraction Equipment">Extraction Equipment</SelectItem>
                      <SelectItem value="Drying Equipment">Drying Equipment</SelectItem>
                      <SelectItem value="Safety Equipment">Safety Equipment</SelectItem>
                      <SelectItem value="Transportation Equipment">Transportation Equipment</SelectItem>
                      <SelectItem value="Access Equipment">Access Equipment</SelectItem>
                      <SelectItem value="Specialized Tools">Specialized Tools</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-gray-700">Description</Label>
                <Textarea
                  value={equipmentForm.description}
                  onChange={(e) => setEquipmentForm({ ...equipmentForm, description: e.target.value })}
                  className="bg-white border-purple-200 text-gray-800"
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-700">Equipment Type</Label>
                  <Select value={equipmentForm.equipmentType} onValueChange={(value) => setEquipmentForm({ ...equipmentForm, equipmentType: value })}>
                    <SelectTrigger className="bg-white border-purple-200 text-gray-800">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Floor Machine">Floor Machine</SelectItem>
                      <SelectItem value="Pressure Washer">Pressure Washer</SelectItem>
                      <SelectItem value="Vacuum Machine">Vacuum Machine</SelectItem>
                      <SelectItem value="Steam Machine">Steam Machine</SelectItem>
                      <SelectItem value="Extractor Machine">Extractor Machine</SelectItem>
                      <SelectItem value="Steam Extractor Machine">Steam Extractor Machine</SelectItem>
                      <SelectItem value="Air Blower">Air Blower</SelectItem>
                      <SelectItem value="Compressor">Compressor</SelectItem>
                      <SelectItem value="Dryer Fan">Dryer Fan</SelectItem>
                      <SelectItem value="Professional Rope">Professional Rope</SelectItem>
                      <SelectItem value="Scaffolding">Scaffolding</SelectItem>
                      <SelectItem value="Winches">Winches</SelectItem>
                      <SelectItem value="Different Types of Ladders">Different Types of Ladders</SelectItem>
                      <SelectItem value="Mini Van Truck">Mini Van Truck</SelectItem>
                      <SelectItem value="Mini Bus">Mini Bus</SelectItem>
                      <SelectItem value="Pickup Truck">Pickup Truck</SelectItem>
                      <SelectItem value="Window Zipper">Window Zipper</SelectItem>
                      <SelectItem value="Floor Zipper">Floor Zipper</SelectItem>
                      <SelectItem value="Different Floor Pads for Various Purposes">Different Floor Pads for Various Purposes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-gray-700">Status</Label>
                  <Select value={equipmentForm.status} onValueChange={(value) => setEquipmentForm({ ...equipmentForm, status: value })}>
                    <SelectTrigger className="bg-white border-purple-200 text-gray-800">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="repair">Repair</SelectItem>
                      <SelectItem value="retired">Retired</SelectItem>
                      <SelectItem value="reserved">Reserved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-gray-700">Equipment Image</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEquipmentForm({ ...equipmentForm, image: e.target.files?.[0] || null })}
                  className="bg-white border-purple-200 text-gray-800"
                  required
                />
              </div>

              <div className="flex space-x-4">
                <Button type="submit" className="flex-1 purple-gradient text-white">
                  Create Equipment
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowCreateDialog(false)}
                  className="flex-1 bg-gray-600 text-white hover:bg-gray-700"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search equipment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white border-purple-200"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-40 bg-white border-purple-200">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              <SelectItem value="Floor Cleaning Equipment">Floor Cleaning Equipment</SelectItem>
              <SelectItem value="Pressure Washing Equipment">Pressure Washing Equipment</SelectItem>
              <SelectItem value="Vacuum Equipment">Vacuum Equipment</SelectItem>
              <SelectItem value="Steam Equipment">Steam Equipment</SelectItem>
              <SelectItem value="Extraction Equipment">Extraction Equipment</SelectItem>
              <SelectItem value="Drying Equipment">Drying Equipment</SelectItem>
              <SelectItem value="Safety Equipment">Safety Equipment</SelectItem>
              <SelectItem value="Transportation Equipment">Transportation Equipment</SelectItem>
              <SelectItem value="Access Equipment">Access Equipment</SelectItem>
              <SelectItem value="Specialized Tools">Specialized Tools</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40 bg-white border-purple-200">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="repair">Repair</SelectItem>
              <SelectItem value="retired">Retired</SelectItem>
              <SelectItem value="reserved">Reserved</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Equipment List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEquipment.length > 0 ? (
          filteredEquipment.map((item) => (
            <Card key={item._id} className="glass-effect border-purple-200">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <Wrench className="w-8 h-8 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">{item.name}</h4>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-3 justify-center">
                    <Badge className="bg-purple-100 text-purple-700 border border-purple-200">
                      {item.category}
                    </Badge>
                    <Badge className={
                      item.status === 'active' ? 'bg-green-100 text-green-700 border border-green-200' :
                      item.status === 'maintenance' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                      item.status === 'repair' ? 'bg-red-100 text-red-700 border border-red-200' :
                      item.status === 'retired' ? 'bg-gray-100 text-gray-700 border border-gray-200' :
                      'bg-blue-100 text-blue-700 border border-blue-200'
                    }>
                      {item.status}
                    </Badge>
                  </div>

                  <div className="flex justify-center space-x-2">
                    <Button
                      onClick={() => openViewDialog(item)}
                      size="sm"
                      variant="outline"
                      className="text-purple-600 border-purple-200 hover:bg-purple-50"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => openEditDialog(item)}
                      size="sm"
                      variant="outline"
                      className="text-blue-600 border-blue-200 hover:bg-blue-50"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleDeleteEquipment(item._id)}
                      size="sm"
                      variant="outline"
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-gray-500">
            No equipment found.
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="glass-effect border-purple-200 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-purple-700">Edit Equipment</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditEquipment} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-700">Equipment Name</Label>
                <Input
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="bg-white border-purple-200 text-gray-800"
                  required
                />
              </div>
              <div>
                <Label className="text-gray-700">Category</Label>
                <Select value={editForm.category} onValueChange={(value) => setEditForm({ ...editForm, category: value })}>
                  <SelectTrigger className="bg-white border-purple-200 text-gray-800">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Floor Cleaning Equipment">Floor Cleaning Equipment</SelectItem>
                    <SelectItem value="Pressure Washing Equipment">Pressure Washing Equipment</SelectItem>
                    <SelectItem value="Vacuum Equipment">Vacuum Equipment</SelectItem>
                    <SelectItem value="Steam Equipment">Steam Equipment</SelectItem>
                    <SelectItem value="Extraction Equipment">Extraction Equipment</SelectItem>
                    <SelectItem value="Drying Equipment">Drying Equipment</SelectItem>
                    <SelectItem value="Safety Equipment">Safety Equipment</SelectItem>
                    <SelectItem value="Transportation Equipment">Transportation Equipment</SelectItem>
                    <SelectItem value="Access Equipment">Access Equipment</SelectItem>
                    <SelectItem value="Specialized Tools">Specialized Tools</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-gray-700">Description</Label>
              <Textarea
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                className="bg-white border-purple-200 text-gray-800"
                rows={3}
                required
              />
            </div>

            <div className="flex space-x-4">
              <Button type="submit" className="flex-1 purple-gradient text-white">
                Update Equipment
              </Button>
              <Button
                type="button"
                onClick={() => setShowEditDialog(false)}
                className="flex-1 bg-gray-600 text-white hover:bg-gray-700"
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="glass-effect border-purple-200 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-purple-700">{selectedEquipment?.name}</DialogTitle>
          </DialogHeader>
          {selectedEquipment && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-700">Category</Label>
                  <p className="text-gray-800">{selectedEquipment.category}</p>
                </div>
                <div>
                  <Label className="text-gray-700">Equipment Type</Label>
                  <p className="text-gray-800">{selectedEquipment.equipmentType}</p>
                </div>
              </div>

              <div>
                <Label className="text-gray-700">Description</Label>
                <p className="text-gray-800 mt-2">{selectedEquipment.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-700">Status</Label>
                  <Badge className={
                    selectedEquipment.status === 'active' ? 'bg-green-100 text-green-700 border border-green-200' :
                    selectedEquipment.status === 'maintenance' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                    selectedEquipment.status === 'repair' ? 'bg-red-100 text-red-700 border border-red-200' :
                    selectedEquipment.status === 'retired' ? 'bg-gray-100 text-gray-700 border border-gray-200' :
                    'bg-blue-100 text-blue-700 border border-blue-200'
                  }>
                    {selectedEquipment.status}
                  </Badge>
                </div>
                <div>
                  <Label className="text-gray-700">Condition</Label>
                  <Badge className={
                    selectedEquipment.condition === 'excellent' ? 'bg-green-100 text-green-700 border border-green-200' :
                    selectedEquipment.condition === 'good' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                    selectedEquipment.condition === 'fair' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                    selectedEquipment.condition === 'poor' ? 'bg-red-100 text-red-700 border border-red-200' :
                    'bg-gray-100 text-gray-700 border border-gray-200'
                  }>
                    {selectedEquipment.condition}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
