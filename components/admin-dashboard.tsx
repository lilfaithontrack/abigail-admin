"use client"

import { useState } from "react"
import { Crown, LayoutDashboard, FileText, Menu, LogOut, User, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import Dashboard from "./dashboard"
import BlogManagement from "./blog-management"
import ServiceManagement from "./service-management"

interface AdminDashboardProps {
  onLogout: () => void
}

type Section = "dashboard" | "blogs" | "services"

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeSection, setActiveSection] = useState<Section>("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem("adminToken")
    onLogout()
  }

  const navigation = [
    { id: "dashboard", name: "Dashboard", icon: LayoutDashboard },
    { id: "blogs", name: "Blog Management", icon: FileText },
    { id: "services", name: "Service Management", icon: Settings },
  ]

  const sectionTitles = {
    dashboard: "Dashboard",
    blogs: "Blog Management",
    services: "Service Management",
  }

  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <Dashboard />
      case "blogs":
        return <BlogManagement />
      case "services":
        return <ServiceManagement />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-purple-50">
      {/* Sidebar */}
      <div
        className={`sidebar fixed inset-y-0 left-0 w-64 glass-effect border-r border-purple-200 z-50 transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 purple-gradient rounded-lg flex items-center justify-center">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-purple-700">Admin Panel</h2>
              <p className="text-xs text-gray-600">Abigail Cleaning Service</p>
            </div>
          </div>

          <nav className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id as Section)
                    setSidebarOpen(false)
                  }}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    activeSection === item.id ? "bg-purple-100 text-purple-700 border border-purple-200" : "hover:bg-purple-50 text-gray-700 hover:text-purple-600"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </button>
              )
            })}
          </nav>
        </div>

        <div className="absolute bottom-6 left-6 right-6">
          <Button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 p-3 rounded-lg bg-red-100 hover:bg-red-200 transition-colors text-red-700 border border-red-200"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </Button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/20 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <div className="md:ml-64 min-h-screen transition-all duration-300">
        {/* Header */}
        <header className="glass-effect border-b border-purple-200 p-4 md:p-6 sticky top-0 z-40">
          <div className="flex items-center justify-between">
            <Button onClick={() => setSidebarOpen(true)} className="md:hidden text-purple-700 p-2" variant="ghost">
              <Menu className="w-6 h-6" />
            </Button>
            <h1 className="text-2xl font-bold text-purple-700">{sectionTitles[activeSection]}</h1>
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm text-gray-600">Welcome back,</p>
                <p className="font-semibold text-purple-700">Administrator</p>
              </div>
              <div className="w-10 h-10 purple-gradient rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-4 md:p-6">{renderSection()}</div>
      </div>
    </div>
  )
}
