"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Plus, Edit, Trash2, Eye, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

const API_BASE_URL = "https://api.abigailgeneralcleaningservice.com/api"

interface Blog {
  _id: string
  title: string
  author: string
  content: string
  excerpt?: string
  authorBio?: string
  tags: string[]
  category?: string
  featured?: boolean
  status?: string
  readingTime?: number
  views?: number
  likes?: number
  seoTitle?: string
  seoDescription?: string
  seoKeywords?: string[]
  imageUrl: string
  publishedAt?: string
  createdAt: string
  updatedAt: string
}

// Advanced Quill editor component - completely fixed
const QuillEditor = ({ value, onChange }: { value: string; onChange: (content: string) => void }) => {
  const quillRef = useRef<any>(null)
  const editorRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined" && editorRef.current && !quillRef.current) {
      // Dynamically import Quill to avoid SSR issues
      import("quill").then((Quill) => {
        const QuillClass = Quill.default || Quill

        // Completely clear the container
        if (editorRef.current) {
          editorRef.current.innerHTML = ''
          editorRef.current.className = 'quill-container'
        }

        // Create a custom toolbar configuration with specific ID
        const toolbarOptions = {
          container: [
            [{ header: [1, 2, 3, false] }],
              ["bold", "italic", "underline", "strike"],
              [{ color: [] }, { background: [] }],
            [{ list: "ordered" }, { list: "bullet" }],
              [{ align: [] }],
            ["link", "image"],
              ["blockquote", "code-block"],
              ["clean"],
          ]
        }

        quillRef.current = new QuillClass(editorRef.current!, {
          theme: "snow",
          modules: {
            toolbar: toolbarOptions
          },
          placeholder: "✨ Start writing your amazing blog content here...",
        })

        // Set initial content
        if (value) {
          quillRef.current.root.innerHTML = value
        }

        // Listen for text changes
        quillRef.current.on("text-change", () => {
          const content = quillRef.current.root.innerHTML
          onChange(content)
        })

        setIsLoaded(true)
      })
    }

    return () => {
      if (quillRef.current) {
        quillRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (quillRef.current && value !== quillRef.current.root.innerHTML) {
      quillRef.current.root.innerHTML = value
    }
  }, [value])

  return (
    <div className="advanced-quill-wrapper">
      <style jsx global>{`
        .advanced-quill-wrapper {
          position: relative;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          overflow: hidden;
          background: white;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
          transition: all 0.2s ease;
        }
        
        .advanced-quill-wrapper:focus-within {
          border-color: #8b5cf6;
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
        }
        
        .advanced-quill-wrapper .ql-toolbar.ql-snow {
          border: none !important;
          border-bottom: 1px solid #e5e7eb !important;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%) !important;
          padding: 12px 16px !important;
        }
        
        .advanced-quill-wrapper .ql-container.ql-snow {
          border: none !important;
          min-height: 320px;
          background: white;
        }
        
        .advanced-quill-wrapper .ql-editor {
          min-height: 320px !important;
          font-size: 16px !important;
          line-height: 1.7 !important;
          color: #374151 !important;
          padding: 20px !important;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
        }
        
        .advanced-quill-wrapper .ql-editor.ql-blank::before {
          color: #9ca3af !important;
          font-style: italic !important;
          font-size: 16px !important;
        }
        
        .advanced-quill-wrapper .ql-toolbar .ql-formats {
          margin-right: 16px !important;
        }
        
        .advanced-quill-wrapper .ql-toolbar .ql-picker,
        .advanced-quill-wrapper .ql-toolbar button {
          border-radius: 6px !important;
          transition: all 0.2s ease !important;
        }
        
        .advanced-quill-wrapper .ql-toolbar button:hover {
          background: rgba(139, 92, 246, 0.1) !important;
          color: #8b5cf6 !important;
        }
        
        .advanced-quill-wrapper .ql-toolbar button.ql-active {
          background: #8b5cf6 !important;
          color: white !important;
        }
        
        .advanced-quill-wrapper .ql-editor h1 {
          font-size: 2em;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.5em;
        }
        
        .advanced-quill-wrapper .ql-editor h2 {
          font-size: 1.5em;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.5em;
        }
        
        .advanced-quill-wrapper .ql-editor h3 {
          font-size: 1.25em;
          font-weight: 600;
          color: #4b5563;
          margin-bottom: 0.5em;
        }
        
        .advanced-quill-wrapper .ql-editor p {
          margin-bottom: 1em;
        }
        
        .advanced-quill-wrapper .ql-editor blockquote {
          border-left: 4px solid #8b5cf6;
          background: #f8fafc;
          padding: 16px 20px;
          margin: 1em 0;
          font-style: italic;
          color: #4b5563;
        }
        
        .advanced-quill-wrapper .ql-editor pre.ql-syntax {
          background: #1f2937;
          color: #f9fafb;
          border-radius: 8px;
          padding: 16px;
          margin: 1em 0;
          overflow-x: auto;
        }
      `}</style>
      
      <link href="https://cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet" />
      
      {!isLoaded && (
        <div className="flex items-center justify-center h-80 bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading editor...</p>
          </div>
        </div>
      )}
      
      <div ref={editorRef} className="quill-container" style={{ display: isLoaded ? 'block' : 'none' }} />
    </div>
  )
}

export default function BlogManagement() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showViewDialog, setShowViewDialog] = useState(false)
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null)
  const [blogForm, setBlogForm] = useState({
    title: "",
    author: "",
    content: "",
    excerpt: "",
    authorBio: "",
    tags: "",
    category: "Cleaning Tips & Tricks",
    featured: false,
    status: "draft",
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
    image: null as File | null,
  })
  const [editForm, setEditForm] = useState({
    title: "",
    author: "",
    content: "",
    excerpt: "",
    authorBio: "",
    tags: "",
    category: "Cleaning Tips & Tricks",
    featured: false,
    status: "draft",
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
    image: null as File | null,
  })
  const { toast } = useToast()

  // Safe form field update function
  const updateFormField = (field: keyof typeof blogForm, value: any) => {
    console.log(`Updating form field: ${field}`, { oldValue: blogForm[field], newValue: value })
    setBlogForm(prev => {
      const newState = { ...prev, [field]: value }
      console.log('New form state:', newState)
      return newState
    })
  }

  // Test authentication function
  const testAuthentication = async () => {
    const token = localStorage.getItem("adminToken")
    console.log("🧪 Testing authentication...")
    console.log("- Token:", token ? "Present" : "Missing")
    
    if (!token) {
      console.error("❌ No token found!")
      return
    }

    // First test basic route accessibility
    try {
      console.log("🔍 Testing basic route accessibility...")
      const basicResponse = await fetch(`${API_BASE_URL}/blogs/test-route`)
      if (basicResponse.ok) {
        const basicData = await basicResponse.json()
        console.log("✅ Basic route accessible:", basicData)
      } else {
        console.error("❌ Basic route failed:", basicResponse.status)
      }
    } catch (error) {
      console.error("❌ Basic route test error:", error)
    }

    // Then test authentication
    try {
      console.log("🔐 Testing authentication...")
      const response = await fetch(`${API_BASE_URL}/blogs/test-auth`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log("✅ Authentication test successful:", data)
      } else {
        const error = await response.json()
        console.error("❌ Authentication test failed:", error)
        console.error("Response status:", response.status)
        console.error("Response headers:", response.headers)
      }
    } catch (error) {
      console.error("❌ Authentication test error:", error)
    }
  }

  useEffect(() => {
    // Initialize blogs as empty array to prevent filter errors
    setBlogs([])
    loadBlogs()
  }, [])

  // Debug: Monitor form state changes
  useEffect(() => {
    console.log('Form state changed:', blogForm)
  }, [blogForm])

  // Debug: Check authentication status on component mount
  useEffect(() => {
    const token = localStorage.getItem("adminToken")
    console.log("🔐 Authentication check on mount:")
    console.log("- Token exists:", !!token)
    console.log("- Token length:", token ? token.length : 0)
    console.log("- Token preview:", token ? token.substring(0, 50) + "..." : "None")
  }, [])

  const loadBlogs = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/blogs`)
      if (response.ok) {
        const data = await response.json()
        // Ensure blogs is always an array, handle different API response formats
        const blogsArray = Array.isArray(data) ? data : (data.data && Array.isArray(data.data) ? data.data : [])
        console.log("Loaded blogs data:", { original: data, processed: blogsArray })
        setBlogs(blogsArray)
      } else {
        console.error("Failed to load blogs, status:", response.status)
        toast({ title: "Error", description: "Failed to load blogs", variant: "destructive" })
        setBlogs([]) // Set empty array on error
      }
    } catch (error) {
      console.error("Error loading blogs:", error)
      toast({ title: "Error", description: "Failed to load blogs", variant: "destructive" })
      setBlogs([]) // Set empty array on error
    } finally {
      setLoading(false)
    }
  }

  const handleCreateBlog = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submission - Current form state:", blogForm) // Debug log
    
    if (!blogForm.title || !blogForm.author || !blogForm.content || !blogForm.excerpt) {
      toast({ title: "Error", description: "Title, author, excerpt, and content are required", variant: "destructive" })
      return
    }

    const formData = new FormData()
    formData.append("title", blogForm.title)
    formData.append("author", blogForm.author)
    formData.append("excerpt", blogForm.excerpt)
    formData.append("content", blogForm.content)
    formData.append("category", blogForm.category)
    formData.append("status", blogForm.status)
    formData.append("featured", blogForm.featured.toString())
    formData.append("authorBio", blogForm.authorBio || "")
    formData.append("seoTitle", blogForm.seoTitle || "")
    formData.append("seoDescription", blogForm.seoDescription || "")
    formData.append("seoKeywords", blogForm.seoKeywords || "")
    
    // Handle tags properly - send as comma-separated string
    if (blogForm.tags) {
      const cleanTags = blogForm.tags
          .split(",")
          .map((tag) => tag.trim())
        .filter((tag) => tag)
      formData.append("tags", cleanTags.join(", "))
    }
    
    // Handle image upload
    if (blogForm.image) {
    formData.append("image", blogForm.image)
    }
    
    // Debug: Log what's being sent
    console.log("FormData contents:")
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value)
    }

    try {
      const token = localStorage.getItem("adminToken")
      console.log("🔐 Blog creation - Admin token from localStorage:", token)
      console.log("🔐 Blog creation - Admin token length:", token ? token.length : 0)
      console.log("🔐 Blog creation - Admin token preview:", token ? token.substring(0, 50) + "..." : "None")
      
      const headers: any = {}
      if (token) {
        headers.Authorization = `Bearer ${token}`
        console.log("🔐 Blog creation - Authorization header set:", headers.Authorization)
        console.log("🔐 Blog creation - Authorization header preview:", headers.Authorization.substring(0, 60) + "...")
      } else {
        console.error("❌ Blog creation - No admin token found in localStorage!")
        toast({ title: "Error", description: "Authentication token not found. Please login again.", variant: "destructive" })
        return
      }
      
      console.log("🔐 Blog creation - Request headers:", headers)
      
      const response = await fetch(`${API_BASE_URL}/blogs`, {
        method: "POST",
        headers,
        body: formData,
      })

      if (response.ok) {
        const result = await response.json()
        console.log("Blog created successfully:", result)
        toast({ title: "Success", description: "Blog created successfully!" })
        
        // Reset form
        setBlogForm({
          title: "",
          author: "",
          content: "",
          excerpt: "",
          authorBio: "",
          tags: "",
          category: "Cleaning Tips & Tricks",
          featured: false,
          status: "draft",
          seoTitle: "",
          seoDescription: "",
          seoKeywords: "",
          image: null,
        })
        setShowCreateDialog(false)
        
        // Reload blogs to show the new one
        await loadBlogs()
      } else {
        const error = await response.json()
        console.error("Blog creation failed:", error)
        toast({ title: "Error", description: error.message || "Failed to create blog", variant: "destructive" })
      }
    } catch (error) {
      console.error("Blog creation error:", error)
      toast({ title: "Error", description: "Failed to create blog", variant: "destructive" })
    }
  }

  const handleEditBlog = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedBlog || !editForm.title || !editForm.author || !editForm.content || !editForm.excerpt) {
      toast({ title: "Error", description: "Title, author, excerpt, and content are required", variant: "destructive" })
      return
    }

    const formData = new FormData()
    formData.append("title", editForm.title)
    formData.append("author", editForm.author)
    formData.append("excerpt", editForm.excerpt)
    formData.append("content", editForm.content)
    formData.append("category", editForm.category)
    formData.append("status", editForm.status)
    formData.append("featured", editForm.featured.toString())
    formData.append("authorBio", editForm.authorBio || "")
    formData.append("seoTitle", editForm.seoTitle || "")
    formData.append("seoDescription", editForm.seoDescription || "")
    formData.append("seoKeywords", editForm.seoKeywords || "")
    
    // Handle tags properly - send as comma-separated string
    if (editForm.tags) {
      const cleanTags = editForm.tags
          .split(",")
          .map((tag) => tag.trim())
        .filter((tag) => tag)
      formData.append("tags", cleanTags.join(", "))
    }
    
    // Handle image upload
    if (editForm.image) {
      formData.append("image", editForm.image)
    }

    try {
      const token = localStorage.getItem("adminToken")
      const response = await fetch(`${API_BASE_URL}/blogs/${selectedBlog._id}`, {
        method: "PUT",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      })

      if (response.ok) {
        toast({ title: "Success", description: "Blog updated successfully!" })
        setShowEditDialog(false)
        setSelectedBlog(null)
        loadBlogs()
      } else {
        const error = await response.json()
        toast({ title: "Error", description: error.message || "Failed to update blog", variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to update blog", variant: "destructive" })
    }
  }

  const handleDeleteBlog = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog?")) return

    try {
      const token = localStorage.getItem("adminToken")
      const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })

      if (response.ok) {
        toast({ title: "Success", description: "Blog deleted successfully!" })
        loadBlogs()
      } else {
        const error = await response.json()
        toast({ title: "Error", description: error.message || "Failed to delete blog", variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete blog", variant: "destructive" })
    }
  }

  const openEditDialog = (blog: Blog) => {
    console.log("Opening edit dialog for blog:", blog) // Debug log
    setSelectedBlog(blog)
    setEditForm({
      title: blog.title,
      author: blog.author,
      content: blog.content,
      excerpt: blog.excerpt || "",
      authorBio: blog.authorBio || "",
      tags: Array.isArray(blog.tags) ? blog.tags.join(", ") : "",
      category: blog.category || "Cleaning Tips & Tricks",
      featured: blog.featured || false,
      status: blog.status || "draft",
      seoTitle: blog.seoTitle || "",
      seoDescription: blog.seoDescription || "",
      seoKeywords: blog.seoKeywords && Array.isArray(blog.seoKeywords) ? blog.seoKeywords.join(", ") : "",
      image: null,
    })
    setShowEditDialog(true)
  }

  const openViewDialog = (blog: Blog) => {
    setSelectedBlog(blog)
    setShowViewDialog(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loader border-4 border-gray-200 border-t-purple-500 rounded-full w-12 h-12 animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 rounded-3xl p-8 text-white shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Blog Management</h1>
              <p className="text-purple-100 mt-2 text-lg">Create engaging content that connects with your audience</p>
              <div className="flex items-center space-x-4 mt-3 text-sm text-purple-200">
                <span className="flex items-center space-x-1">
                  <span>📝</span>
                  <span>{Array.isArray(blogs) ? blogs.length : 0} Total Posts</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span>🚀</span>
                  <span>{Array.isArray(blogs) ? blogs.filter(b => b.status === 'published').length : 0} Published</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span>✏️</span>
                  <span>{Array.isArray(blogs) ? blogs.filter(b => b.status === 'draft').length : 0} Drafts</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span>🔐</span>
                  <span>{localStorage.getItem("adminToken") ? "Authenticated" : "Not Authenticated"}</span>
                </span>
              </div>
            </div>
          </div>
                    <div className="mt-6 lg:mt-0">
            <Dialog open={showCreateDialog} onOpenChange={(open) => {
              console.log("Create dialog state changed to:", open) // Debug log
              if (open) {
                console.log("Opening create dialog with form state:", blogForm) // Debug log
              }
              setShowCreateDialog(open)
            }}>
              <div className="flex gap-4">
                <Button 
                  onClick={testAuthentication}
                  className="bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/30 h-12 px-6 font-medium text-base shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 rounded-xl"
                >
                  🧪 Test Auth
                </Button>
          <DialogTrigger asChild>
                  <Button className="bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/30 h-14 px-8 font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 rounded-2xl">
                    <div className="flex items-center space-x-2">
                      <Plus className="w-6 h-6" />
                      <span>Create New Blog</span>
                      <span>✨</span>
                    </div>
            </Button>
          </DialogTrigger>
              </div>
        <DialogContent className="bg-gradient-to-br from-white via-purple-50/30 to-white border-2 border-purple-200/50 max-w-6xl max-h-[95vh] overflow-y-auto shadow-2xl backdrop-blur-sm">
            <DialogHeader className="pb-6 border-b border-gradient-to-r from-purple-200 via-purple-300 to-purple-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-purple-700 via-purple-600 to-purple-800 bg-clip-text text-transparent">
                    Create New Blog Post
                  </DialogTitle>
                  <p className="text-gray-600 mt-1 font-medium">Craft engaging content that inspires and informs your audience</p>
                </div>
              </div>
            </DialogHeader>
            <form onSubmit={handleCreateBlog} className="space-y-8 pt-6">
              {/* Basic Information Section */}
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-purple-100/50 shadow-lg">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs font-bold">1</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">Basic Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label className="text-sm font-bold text-gray-700 flex items-center space-x-2">
                      <span>📝 Blog Title</span>
                      <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                  <Input
                    value={blogForm.title}
                        onChange={(e) => {
                          console.log("Title changed from:", blogForm.title, "to:", e.target.value)
                          setBlogForm(prev => ({ ...prev, title: e.target.value }))
                        }}
                        className="h-14 bg-white/80 border-2 border-purple-200/70 text-gray-800 focus:border-purple-500 focus:ring-4 focus:ring-purple-200/50 transition-all duration-300 pl-4 pr-12 rounded-xl shadow-sm font-medium"
                        placeholder="Enter a compelling blog title that grabs attention..."
                    required
                  />
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <span className="text-sm">{blogForm.title.length}/100</span>
                </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-sm font-bold text-gray-700 flex items-center space-x-2">
                      <span>👤 Author Name</span>
                      <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                  <Input
                    value={blogForm.author}
                        onChange={(e) => {
                          console.log("Author changed from:", blogForm.author, "to:", e.target.value)
                          setBlogForm(prev => ({ ...prev, author: e.target.value }))
                        }}
                        className="h-14 bg-white/80 border-2 border-purple-200/70 text-gray-800 focus:border-purple-500 focus:ring-4 focus:ring-purple-200/50 transition-all duration-300 pl-4 pr-12 rounded-xl shadow-sm font-medium"
                        placeholder="Enter the author's name..."
                    required
                  />
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-400">
                        <span className="text-sm">✓</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

                            {/* Excerpt Section */}
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-purple-100/50 shadow-lg">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs font-bold">2</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">Blog Summary</h3>
                </div>
                <div className="space-y-3">
                  <Label className="text-sm font-bold text-gray-700 flex items-center space-x-2">
                    <span>📄 Blog Excerpt</span>
                    <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Textarea
                      value={blogForm.excerpt}
                      onChange={(e) => {
                        console.log("Excerpt changed from:", blogForm.excerpt, "to:", e.target.value)
                        setBlogForm(prev => ({ ...prev, excerpt: e.target.value }))
                      }}
                      className="bg-white/80 border-2 border-purple-200/70 text-gray-800 focus:border-purple-500 focus:ring-4 focus:ring-purple-200/50 transition-all duration-300 resize-none rounded-xl p-4 font-medium min-h-[120px] shadow-sm"
                      rows={5}
                      placeholder="Write a compelling summary that captures the essence of your blog post and entices readers to continue reading... This excerpt will appear in blog previews and search results."
                      required
                      maxLength={300}
                    />
                    <div className="absolute bottom-3 right-3">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        blogForm.excerpt.length > 250 
                          ? 'bg-red-100 text-red-600' 
                          : blogForm.excerpt.length > 200 
                          ? 'bg-yellow-100 text-yellow-600' 
                          : 'bg-green-100 text-green-600'
                      }`}>
                        {blogForm.excerpt.length}/300
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <span>💡</span>
                    <span>Tip: Keep it between 150-250 characters for optimal SEO and readability</span>
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-purple-100/50 shadow-lg">
                <div className="flex items-center space-x-2 mb-6">
                  <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs font-bold">3</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">Blog Content</h3>
                  <div className="flex-1"></div>
                  <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    Rich Text Editor
                  </div>
                </div>
                <div className="space-y-3">
                  <Label className="text-sm font-bold text-gray-700 flex items-center space-x-2">
                    <span>✍️ Main Content</span>
                    <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <QuillEditor 
                      key="create-blog-editor"
                      value={blogForm.content} 
                      onChange={(content) => {
                        console.log("Content changed from:", blogForm.content, "to:", content)
                        // Only update the content field, preserve all other fields
                        setBlogForm(prev => ({ ...prev, content }))
                      }} 
                    />
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <span>🎨</span>
                    <span>Use the toolbar above to format your text, add images, links, and more</span>
                  </div>
                </div>
              </div>

              {/* Metadata Section */}
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-purple-100/50 shadow-lg">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs font-bold">4</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">Tags & Category</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label className="text-sm font-bold text-gray-700 flex items-center space-x-2">
                      <span>🏷️ Tags</span>
                    </Label>
                    <div className="relative">
                  <Input
                    value={blogForm.tags}
                        onChange={(e) => setBlogForm(prev => ({ ...prev, tags: e.target.value }))}
                        className="h-14 bg-white/80 border-2 border-purple-200/70 text-gray-800 focus:border-purple-500 focus:ring-4 focus:ring-purple-200/50 transition-all duration-300 pl-4 pr-12 rounded-xl shadow-sm font-medium"
                        placeholder="cleaning, tips, professional, maintenance, eco-friendly"
                      />
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <span className="text-xs">#{blogForm.tags ? blogForm.tags.split(',').filter(t => t.trim()).length : 0}</span>
                </div>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span>🎯</span>
                      <span>Separate with commas • Max 10 tags • Use relevant keywords</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-sm font-bold text-gray-700 flex items-center space-x-2">
                      <span>📂 Category</span>
                    </Label>
                    <div className="relative">
                      <select
                        value={blogForm.category}
                        onChange={(e) => setBlogForm(prev => ({ ...prev, category: e.target.value }))}
                        className="h-14 w-full px-4 bg-white/80 border-2 border-purple-200/70 rounded-xl text-gray-800 focus:border-purple-500 focus:ring-4 focus:ring-purple-200/50 transition-all duration-300 shadow-sm font-medium appearance-none"
                      >
                        <option value="Cleaning Tips & Tricks">🧽 Cleaning Tips & Tricks</option>
                        <option value="Company News & Updates">📢 Company News & Updates</option>
                        <option value="Service Spotlights">⭐ Service Spotlights</option>
                        <option value="Customer Success Stories">💖 Customer Success Stories</option>
                        <option value="Cleaning Industry Insights">📊 Cleaning Industry Insights</option>
                        <option value="Maintenance Guides">🔧 Maintenance Guides</option>
                        <option value="Eco-Friendly Cleaning">🌱 Eco-Friendly Cleaning</option>
                        <option value="Professional Advice">👨‍💼 Professional Advice</option>
                        <option value="Equipment & Technology">🛠️ Equipment & Technology</option>
                        <option value="Health & Safety">🛡️ Health & Safety</option>
                      </select>
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-purple-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Publishing Options Section */}
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-purple-100/50 shadow-lg">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-6 h-6 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs font-bold">5</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">Publishing Options</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label className="text-sm font-bold text-gray-700 flex items-center space-x-2">
                      <span>🖼️ Featured Image</span>
                    </Label>
                    <div className="relative">
                  <Input
                    type="file"
                    accept="image/*"
                        onChange={(e) => setBlogForm(prev => ({ ...prev, image: e.target.files?.[0] || null }))}
                        className="h-14 bg-white/80 border-2 border-purple-200/70 text-gray-800 focus:border-purple-500 focus:ring-4 focus:ring-purple-200/50 transition-all duration-300 rounded-xl shadow-sm file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-purple-50 file:to-purple-100 file:text-purple-700 hover:file:from-purple-100 hover:file:to-purple-200 file:transition-all file:duration-200"
                      />
                      {blogForm.image && (
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-500">
                          <span className="text-sm">✓ Selected</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span>📸</span>
                      <span>Recommended: 1200x630px • Max 5MB • JPG, PNG</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-sm font-bold text-gray-700 flex items-center space-x-2">
                      <span>🚀 Publication Status</span>
                    </Label>
                    <div className="relative">
                      <select
                        value={blogForm.status}
                        onChange={(e) => setBlogForm(prev => ({ ...prev, status: e.target.value }))}
                        className="h-14 w-full px-4 bg-white/80 border-2 border-purple-200/70 rounded-xl text-gray-800 focus:border-purple-500 focus:ring-4 focus:ring-purple-200/50 transition-all duration-300 shadow-sm font-medium appearance-none"
                      >
                        <option value="draft">📝 Draft (Save for later editing)</option>
                        <option value="published">🚀 Published (Make it live now)</option>
                      </select>
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-purple-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span>💡</span>
                      <span>Draft: Save changes • Published: Visible to everyone</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="bg-gradient-to-r from-purple-50 via-white to-purple-50 rounded-2xl p-6 border border-purple-100/50">
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                  <Button 
                    type="submit" 
                    className="flex-1 h-16 bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 hover:from-purple-700 hover:via-purple-800 hover:to-purple-900 text-white font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 rounded-xl"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <span>✨</span>
                      <span>Create Amazing Blog Post</span>
                      <span>🚀</span>
                    </div>
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowCreateDialog(false)}
                    className="flex-1 h-16 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 border-2 border-gray-300 hover:border-gray-400 font-semibold text-lg transition-all duration-300 rounded-xl"
                >
                    <div className="flex items-center justify-center space-x-2">
                      <span>❌</span>
                      <span>Cancel</span>
                    </div>
                </Button>
                </div>
                <div className="mt-4 text-center text-xs text-gray-500">
                  💡 Tip: Use Ctrl+S to quick save as draft
                </div>
              </div>
            </form>
          </DialogContent>
        </Dialog>
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="glass-effect border-purple-200 max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-4 border-b border-purple-100">
            <DialogTitle className="text-2xl font-bold text-purple-700">Edit Blog Post</DialogTitle>
            <p className="text-sm text-gray-600 mt-1">Update your blog post details below</p>
          </DialogHeader>
          <form onSubmit={handleEditBlog} className="space-y-6 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-700">Title</Label>
                <Input
                  value={editForm.title}
                  onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                  className="bg-white border-purple-200 text-gray-800"
                  required
                />
              </div>
              <div>
                <Label className="text-gray-700">Author</Label>
                <Input
                  value={editForm.author}
                  onChange={(e) => setEditForm(prev => ({ ...prev, author: e.target.value }))}
                  className="bg-white border-purple-200 text-gray-800"
                  required
                />
              </div>
            </div>

            <div>
              <Label className="text-gray-700">Excerpt (Required)</Label>
              <Textarea
                value={editForm.excerpt}
                onChange={(e) => setEditForm(prev => ({ ...prev, excerpt: e.target.value }))}
                className="bg-white border-purple-200 text-gray-800"
                rows={3}
                placeholder="Brief summary of the blog post (max 300 characters)"
                required
              />
            </div>

            <div>
              <Label className="text-gray-700">Content (Required)</Label>
              <QuillEditor 
                key="edit-blog-editor"
                value={editForm.content} 
                onChange={(content) => setEditForm(prev => ({ ...prev, content }))} 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-700">Tags (comma separated)</Label>
                <Input
                  value={editForm.tags}
                  onChange={(e) => setEditForm(prev => ({ ...prev, tags: e.target.value }))}
                  className="bg-white border-purple-200 text-gray-800"
                  placeholder="tag1, tag2, tag3"
                />
              </div>
              <div>
                <Label className="text-gray-700">Category</Label>
                <Input
                  value={editForm.category}
                  onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                  className="bg-white border-purple-200 text-gray-800"
                  placeholder="e.g., Cleaning Tips, Company News"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-700">Image (optional - leave empty to keep current)</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEditForm(prev => ({ ...prev, image: e.target.files?.[0] || null }))}
                  className="bg-white border-purple-200 text-gray-800"
                />
              </div>
              <div>
                <Label className="text-gray-700">Status</Label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 bg-white border border-purple-200 rounded-md text-gray-800 focus:border-purple-500 focus:outline-none"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button type="submit" className="flex-1 purple-gradient text-white">
                Update Blog
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
        <DialogContent className="glass-effect border-purple-200 max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-4 border-b border-purple-100">
            <DialogTitle className="text-2xl font-bold text-purple-700">{selectedBlog?.title}</DialogTitle>
            <p className="text-sm text-gray-600 mt-1">Blog post details and preview</p>
          </DialogHeader>
          {selectedBlog && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-700">Author</Label>
                  <p className="text-gray-800">{selectedBlog.author}</p>
                </div>
                <div>
                  <Label className="text-gray-700">Created</Label>
                  <p className="text-gray-800">{new Date(selectedBlog.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-700">Category</Label>
                  <p className="text-gray-800">{selectedBlog.category || 'Not specified'}</p>
                </div>
                <div>
                  <Label className="text-gray-700">Status</Label>
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    selectedBlog.status === 'published' 
                      ? 'bg-green-100 text-green-700 border border-green-200' 
                      : 'bg-orange-100 text-orange-700 border border-orange-200'
                  }`}>
                    {selectedBlog.status || 'draft'}
                  </span>
                </div>
              </div>

              {selectedBlog.imageUrl && (
                <div>
                  <Label className="text-gray-700">Image</Label>
                  <img
                    src={`${API_BASE_URL.replace("/api", "")}/uploads/${selectedBlog.imageUrl}`}
                    alt={selectedBlog.title}
                    className="w-full max-w-md h-48 object-cover rounded-lg mt-2"
                  />
                </div>
              )}

              <div>
                <Label className="text-gray-700">Tags</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {Array.isArray(selectedBlog.tags) ? selectedBlog.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-sm border border-purple-200">
                      {tag}
                    </span>
                  )) : (
                    <span className="text-gray-500">No tags available</span>
                  )}
                </div>
              </div>

              <div>
                <Label className="text-gray-700">Excerpt</Label>
                <p className="text-gray-800 mt-2">{selectedBlog.excerpt || 'No excerpt provided'}</p>
              </div>

              <div>
                <Label className="text-gray-700">Content</Label>
                <div
                  className="bg-white text-black p-4 rounded-lg mt-2 prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: selectedBlog.content }}
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Card className="glass-effect border-purple-200">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-purple-50">
                <tr>
                  <th className="text-left p-4 text-purple-700">Title</th>
                  <th className="text-left p-4 text-purple-700 hidden md:table-cell">Author</th>
                  <th className="text-left p-4 text-purple-700 hidden lg:table-cell">Status</th>
                  <th className="text-left p-4 text-purple-700 hidden lg:table-cell">Created</th>
                  <th className="text-left p-4 text-purple-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(blogs) && blogs.length > 0 ? (
                  blogs.map((blog) => (
                    <tr key={blog._id} className="border-b border-purple-100">
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-gray-800">{blog.title}</p>
                          <p className="text-sm text-gray-600 md:hidden">{blog.author}</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {Array.isArray(blog.tags) && blog.tags.slice(0, 2).map((tag, index) => (
                              <span key={index} className="px-1 py-0.5 bg-purple-100 text-purple-700 rounded text-xs border border-purple-200">
                                {tag}
                              </span>
                            ))}
                            {Array.isArray(blog.tags) && blog.tags.length > 2 && (
                              <span className="text-xs text-gray-500">+{blog.tags.length - 2} more</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-gray-700 hidden md:table-cell">{blog.author}</td>
                      <td className="p-4 text-gray-700 hidden lg:table-cell">
                        <span className={`px-2 py-1 rounded-full text-sm ${
                          blog.status === 'published' 
                            ? 'bg-green-100 text-green-700 border border-green-200' 
                            : 'bg-orange-100 text-orange-700 border border-orange-200'
                        }`}>
                          {blog.status || 'draft'}
                        </span>
                      </td>
                      <td className="p-4 text-gray-700 hidden lg:table-cell">
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => openViewDialog(blog)}
                            className="p-2 bg-green-600/20 text-green-400 hover:bg-green-600/30"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => openEditDialog(blog)}
                            className="p-2 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleDeleteBlog(blog._id)}
                            className="p-2 bg-red-600/20 text-red-400 hover:bg-red-600/30"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center p-8 text-gray-400">
                      No blogs created yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
