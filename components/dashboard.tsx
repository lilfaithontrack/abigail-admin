"use client"

import { useState, useEffect } from "react"
import { FileText, Settings, TrendingUp, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

  const API_BASE_URL = "https://api.abigailgeneralcleaningservice.com/api"

interface Blog {
  _id: string
  title: string
  author: string
  createdAt: string
  status: string
  views: number
  featured: boolean
}

interface DashboardStats {
  totalBlogs: number
  totalServices: number
  publishedBlogs: number
  draftBlogs: number
  featuredBlogs: number
  totalBlogViews: number
  activeServices: number
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalBlogs: 0,
    totalServices: 0,
    publishedBlogs: 0,
    draftBlogs: 0,
    featuredBlogs: 0,
    totalBlogViews: 0,
    activeServices: 0
  })
  const [recentBlogs, setRecentBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      // Load blogs
      const blogsResponse = await fetch(`${API_BASE_URL}/blogs`)
      if (blogsResponse.ok) {
        const blogs = await blogsResponse.json()
        const blogData = blogs.data || blogs // Handle both new and old API response formats
        const publishedCount = blogData.filter((blog: Blog) => blog.status === 'published').length || 0
        const draftCount = blogData.filter((blog: Blog) => blog.status === 'draft').length || 0
        const featuredCount = blogData.filter((blog: Blog) => blog.featured).length || 0
        const totalViews = blogData.reduce((sum: number, blog: Blog) => sum + (blog.views || 0), 0) || 0
        
        setStats((prev) => ({ 
          ...prev, 
          totalBlogs: blogData.length || 0,
          publishedBlogs: publishedCount,
          draftBlogs: draftCount,
          featuredBlogs: featuredCount,
          totalBlogViews: totalViews
        }))
        setRecentBlogs(blogData.slice(0, 5) || []) // Get 5 most recent blogs
      }

      // Load services
      const servicesResponse = await fetch(`${API_BASE_URL}/service`)
      if (servicesResponse.ok) {
        const services = await servicesResponse.json()
        const serviceData = services.data || services
        const activeServices = serviceData.filter((service: any) => service.status === 'active').length || 0
        
        setStats((prev) => ({
          ...prev,
          totalServices: serviceData.length || 0,
          activeServices: activeServices
        }))
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loader border-4 border-gray-200 border-t-purple-500 rounded-full w-12 h-12 animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-effect border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Blogs</p>
                <p className="text-2xl font-bold text-purple-600">{stats.totalBlogs}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Published</p>
                <p className="text-2xl font-bold text-green-600">{stats.publishedBlogs}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Featured</p>
                <p className="text-2xl font-bold text-purple-600">{stats.featuredBlogs}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Views</p>
                <p className="text-2xl font-bold text-purple-600">{stats.totalBlogViews}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="glass-effect border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Draft Blogs</p>
                <p className="text-2xl font-bold text-orange-600">{stats.draftBlogs}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Services</p>
                <p className="text-2xl font-bold text-purple-600">{stats.totalServices}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Settings className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active Services</p>
                <p className="text-2xl font-bold text-purple-600">{stats.activeServices}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-effect border-purple-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-purple-700 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Recent Blogs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentBlogs.length > 0 ? (
                recentBlogs.map((blog) => (
                  <div key={blog._id} className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="font-medium text-gray-800 truncate">{blog.title}</p>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span>by {blog.author}</span>
                        <span>•</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          blog.status === 'published' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-orange-100 text-orange-700'
                        }`}>
                          {blog.status}
                        </span>
                        {blog.views > 0 && (
                          <>
                            <span>•</span>
                            <span>{blog.views} views</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">{new Date(blog.createdAt).toLocaleDateString()}</div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No blogs created yet.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-purple-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-purple-700 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">API Status</span>
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs border border-green-200">Online</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Database</span>
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs border border-green-200">Connected</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Blog System</span>
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs border border-green-200">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Service System</span>
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs border border-green-200">Active</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-700">Last Updated</span>
                <span className="text-gray-600 text-sm flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date().toLocaleDateString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="glass-effect border-purple-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-purple-700">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-purple-50 rounded-lg text-center hover:bg-purple-100 transition-colors cursor-pointer border border-purple-100">
              <FileText className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-gray-800 font-medium">Create Blog</p>
              <p className="text-gray-600 text-sm">Write a new blog post</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg text-center hover:bg-purple-100 transition-colors cursor-pointer border border-purple-100">
              <Settings className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-gray-800 font-medium">Manage Services</p>
              <p className="text-gray-600 text-sm">Update service offerings</p>
            </div>

          </div>
        </CardContent>
      </Card>
    </div>
  )
}
