"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Eye, Trash2, Search, Building2, Phone, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

const API_BASE_URL = "https://api.abigailgeneralcleaningservice.com/api"

interface Client {
  _id: string
  companyName: string
  contactPerson: {
    name: string
    phone: string
    email?: string
    position?: string
  }
  companyInfo: {
    industry?: string
    size?: string
    website?: string
    address?: string
    city?: string
    region?: string
  }
  services: string[]
  projects: any[]
  status: string
  priority: string
  notes?: string
  slug: string
  createdAt: string
  updatedAt: string
}

export default function ClientManagement() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showViewDialog, setShowViewDialog] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [filterPriority, setFilterPriority] = useState("")
  const [clientForm, setClientForm] = useState({
    companyName: "",
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    contactPosition: "",
    industry: "",
    size: "medium",
    website: "",
    address: "",
    city: "",
    region: "",
    services: "",
    status: "active",
    priority: "medium",
    notes: "",
  })
  const [editForm, setEditForm] = useState({
    companyName: "",
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    contactPosition: "",
    industry: "",
    size: "medium",
    website: "",
    address: "",
    city: "",
    region: "",
    services: "",
    status: "active",
    priority: "medium",
    notes: "",
  })

  useEffect(() => {
    loadClients()
  }, [])

  const loadClients = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/clients`)
      if (response.ok) {
        const data = await response.json()
        setClients(data.data || data)
      } else {
        console.error("Failed to load clients")
      }
    } catch (error) {
      console.error("Error loading clients:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!clientForm.companyName || !clientForm.contactName || !clientForm.contactPhone) {
      alert("Company name, contact name, and phone are required")
      return
    }

    const clientData = {
      companyName: clientForm.companyName,
      contactPerson: {
        name: clientForm.contactName,
        phone: clientForm.contactPhone,
        email: clientForm.contactEmail,
        position: clientForm.contactPosition
      },
      companyInfo: {
        industry: clientForm.industry,
        size: clientForm.size,
        website: clientForm.website,
        address: clientForm.address,
        city: clientForm.city,
        region: clientForm.region
      },
      services: clientForm.services ? clientForm.services.split(',').map(s => s.trim()).filter(s => s) : [],
      status: clientForm.status,
      priority: clientForm.priority,
      notes: clientForm.notes
    }

    try {
      const response = await fetch(`${API_BASE_URL}/clients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(clientData)
      })

      if (response.ok) {
        alert("Client created successfully!")
        setShowCreateDialog(false)
        resetClientForm()
        loadClients()
      } else {
        const error = await response.json()
        alert(error.message || "Failed to create client")
      }
    } catch (error) {
      alert("Failed to create client")
    }
  }

  const handleEditClient = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedClient || !editForm.companyName || !editForm.contactName || !editForm.contactPhone) {
      alert("Company name, contact name, and phone are required")
      return
    }

    const clientData = {
      companyName: editForm.companyName,
      contactPerson: {
        name: editForm.contactName,
        phone: editForm.contactPhone,
        email: editForm.contactEmail,
        position: editForm.contactPosition
      },
      companyInfo: {
        industry: editForm.industry,
        size: editForm.size,
        website: editForm.website,
        address: editForm.address,
        city: editForm.city,
        region: editForm.region
      },
      services: editForm.services ? editForm.services.split(',').map(s => s.trim()).filter(s => s) : [],
      status: editForm.status,
      priority: editForm.priority,
      notes: editForm.notes
    }

    try {
      const response = await fetch(`${API_BASE_URL}/clients/${selectedClient._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(clientData)
      })

      if (response.ok) {
        alert("Client updated successfully!")
        setShowEditDialog(false)
        setSelectedClient(null)
        loadClients()
      } else {
        const error = await response.json()
        alert(error.message || "Failed to update client")
      }
    } catch (error) {
      alert("Failed to update client")
    }
  }

  const handleDeleteClient = async (id: string) => {
    if (!confirm("Are you sure you want to delete this client?")) return

    try {
      const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        alert("Client deleted successfully!")
        loadClients()
      } else {
        const error = await response.json()
        alert(error.message || "Failed to delete client")
      }
    } catch (error) {
      alert("Failed to delete client")
    }
  }

  const openEditDialog = (client: Client) => {
    setSelectedClient(client)
    setEditForm({
      companyName: client.companyName,
      contactName: client.contactPerson.name,
      contactPhone: client.contactPerson.phone,
      contactEmail: client.contactPerson.email || "",
      contactPosition: client.contactPerson.position || "",
      industry: client.companyInfo.industry || "",
      size: client.companyInfo.size || "medium",
      website: client.companyInfo.website || "",
      address: client.companyInfo.address || "",
      city: client.companyInfo.city || "",
      region: client.companyInfo.region || "",
      services: client.services.join(", "),
      status: client.status,
      priority: client.priority,
      notes: client.notes || "",
    })
    setShowEditDialog(true)
  }

  const openViewDialog = (client: Client) => {
    setSelectedClient(client)
    setShowViewDialog(true)
  }

  const resetClientForm = () => {
    setClientForm({
      companyName: "",
      contactName: "",
      contactPhone: "",
      contactEmail: "",
      contactPosition: "",
      industry: "",
      size: "medium",
      website: "",
      address: "",
      city: "",
      region: "",
      services: "",
      status: "active",
      priority: "medium",
      notes: "",
    })
  }

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.contactPerson.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !filterStatus || client.status === filterStatus
    const matchesPriority = !filterPriority || client.priority === filterPriority
    return matchesSearch && matchesStatus && matchesPriority
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
        <h2 className="text-xl font-semibold text-purple-700">Client Management</h2>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="purple-gradient text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Client
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-effect border-purple-200 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-purple-700">Add New Client</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateClient} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-700">Company Name</Label>
                  <Input
                    value={clientForm.companyName}
                    onChange={(e) => setClientForm({ ...clientForm, companyName: e.target.value })}
                    className="bg-white border-purple-200 text-gray-800"
                    required
                  />
                </div>
                <div>
                  <Label className="text-gray-700">Contact Person Name</Label>
                  <Input
                    value={clientForm.contactName}
                    onChange={(e) => setClientForm({ ...clientForm, contactName: e.target.value })}
                    className="bg-white border-purple-200 text-gray-800"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-700">Contact Phone</Label>
                  <Input
                    value={clientForm.contactPhone}
                    onChange={(e) => setClientForm({ ...clientForm, contactPhone: e.target.value })}
                    className="bg-white border-purple-200 text-gray-800"
                    required
                  />
                </div>
                <div>
                  <Label className="text-gray-700">Contact Email</Label>
                  <Input
                    value={clientForm.contactEmail}
                    onChange={(e) => setClientForm({ ...clientForm, contactEmail: e.target.value })}
                    className="bg-white border-purple-200 text-gray-800"
                    type="email"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-700">Status</Label>
                  <Select value={clientForm.status} onValueChange={(value) => setClientForm({ ...clientForm, status: value })}>
                    <SelectTrigger className="bg-white border-purple-200 text-gray-800">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="prospect">Prospect</SelectItem>
                      <SelectItem value="former">Former</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-gray-700">Priority</Label>
                  <Select value={clientForm.priority} onValueChange={(value) => setClientForm({ ...clientForm, priority: value })}>
                    <SelectTrigger className="bg-white border-purple-200 text-gray-800">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="vip">VIP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-gray-700">Services (comma separated)</Label>
                <Input
                  value={clientForm.services}
                  onChange={(e) => setClientForm({ ...clientForm, services: e.target.value })}
                  className="bg-white border-purple-200 text-gray-800"
                  placeholder="Service 1, Service 2, Service 3"
                />
              </div>

              <div className="flex space-x-4">
                <Button type="submit" className="flex-1 purple-gradient text-white">
                  Add Client
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
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white border-purple-200"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40 bg-white border-purple-200">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="prospect">Prospect</SelectItem>
              <SelectItem value="former">Former</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger className="w-40 bg-white border-purple-200">
              <SelectValue placeholder="All Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Priority</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="vip">VIP</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Clients List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.length > 0 ? (
          filteredClients.map((client) => (
            <Card key={client._id} className="glass-effect border-purple-200">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <Building2 className="w-8 h-8 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">{client.companyName}</h4>
                  <p className="text-sm text-gray-600 mb-3">{client.contactPerson.name}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-3 justify-center">
                    <Badge className={
                      client.status === 'active' ? 'bg-green-100 text-green-700 border border-green-200' :
                      client.status === 'inactive' ? 'bg-red-100 text-red-700 border border-red-200' :
                      client.status === 'prospect' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                      'bg-gray-100 text-gray-700 border border-gray-200'
                    }>
                      {client.status}
                    </Badge>
                    <Badge className={
                      client.priority === 'vip' ? 'bg-purple-100 text-purple-700 border border-purple-200' :
                      client.priority === 'high' ? 'bg-red-100 text-red-700 border border-red-200' :
                      client.priority === 'medium' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                      'bg-gray-100 text-gray-700 border border-gray-200'
                    }>
                      {client.priority}
                    </Badge>
                  </div>

                  <div className="text-sm text-gray-600 mb-3">
                    <div className="flex items-center justify-center space-x-2 mb-1">
                      <Phone className="w-4 h-4" />
                      <span>{client.contactPerson.phone}</span>
                    </div>
                    {client.contactPerson.email && (
                      <div className="flex items-center justify-center space-x-2">
                        <Mail className="w-4 h-4" />
                        <span>{client.contactPerson.email}</span>
                      </div>
                    )}
                  </div>

                  <div className="text-sm text-gray-600 mb-3">
                    <p>Projects: {client.projects.length}</p>
                    <p>Services: {client.services.length}</p>
                  </div>

                  <div className="flex justify-center space-x-2">
                    <Button
                      onClick={() => openViewDialog(client)}
                      size="sm"
                      variant="outline"
                      className="text-purple-600 border-purple-200 hover:bg-purple-50"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => openEditDialog(client)}
                      size="sm"
                      variant="outline"
                      className="text-blue-600 border-blue-200 hover:bg-blue-50"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleDeleteClient(client._id)}
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
            No clients found.
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="glass-effect border-purple-200 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-purple-700">Edit Client</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditClient} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-700">Company Name</Label>
                <Input
                  value={editForm.companyName}
                  onChange={(e) => setEditForm({ ...editForm, companyName: e.target.value })}
                  className="bg-white border-purple-200 text-gray-800"
                  required
                />
              </div>
              <div>
                <Label className="text-gray-700">Contact Person Name</Label>
                <Input
                  value={editForm.contactName}
                  onChange={(e) => setEditForm({ ...editForm, contactName: e.target.value })}
                  className="bg-white border-purple-200 text-gray-800"
                  required
                />
              </div>
            </div>

            <div className="flex space-x-4">
              <Button type="submit" className="flex-1 purple-gradient text-white">
                Update Client
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
            <DialogTitle className="text-purple-700">{selectedClient?.companyName}</DialogTitle>
          </DialogHeader>
          {selectedClient && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-700">Contact Person</Label>
                  <p className="text-gray-800">{selectedClient.contactPerson.name}</p>
                  <p className="text-gray-600 text-sm">{selectedClient.contactPerson.position}</p>
                </div>
                <div>
                  <Label className="text-gray-700">Contact Information</Label>
                  <p className="text-gray-800">{selectedClient.contactPerson.phone}</p>
                  {selectedClient.contactPerson.email && (
                    <p className="text-gray-800">{selectedClient.contactPerson.email}</p>
                  )}
                </div>
              </div>

              <div>
                <Label className="text-gray-700">Services</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedClient.services.map((service, index) => (
                    <Badge key={index} className="bg-purple-100 text-purple-700 border border-purple-200">
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-700">Status</Label>
                  <Badge className={
                    selectedClient.status === 'active' ? 'bg-green-100 text-green-700 border border-green-200' :
                    selectedClient.status === 'inactive' ? 'bg-red-100 text-red-700 border border-red-200' :
                    selectedClient.status === 'prospect' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                    'bg-gray-100 text-gray-700 border border-gray-200'
                  }>
                    {selectedClient.status}
                  </Badge>
                </div>
                <div>
                  <Label className="text-gray-700">Priority</Label>
                  <Badge className={
                    selectedClient.priority === 'vip' ? 'bg-purple-100 text-purple-700 border border-purple-200' :
                    selectedClient.priority === 'high' ? 'bg-red-100 text-red-700 border border-red-200' :
                    selectedClient.priority === 'medium' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                    'bg-gray-100 text-gray-700 border border-gray-200'
                  }>
                    {selectedClient.priority}
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
