"use client"

import type React from "react"

import { useState } from "react"
import { ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

const API_BASE_URL = "https://api.abigailgeneralcleaningservice.com/api"

interface LoginFormProps {
  onLogin: () => void
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        console.log('✅ Login response data:', data);
        console.log('✅ Token received:', data.token ? 'Yes' : 'No');
        console.log('✅ Token length:', data.token ? data.token.length : 0);
        console.log('✅ Token preview:', data.token ? data.token.substring(0, 50) + '...' : 'None');
        
        localStorage.setItem("adminToken", data.token)
        console.log('✅ Token stored in localStorage:', data.token ? 'Yes' : 'No');
        
        // Verify token was stored
        const storedToken = localStorage.getItem("adminToken")
        console.log('✅ Stored token verification:', storedToken ? 'Success' : 'Failed');
        console.log('✅ Stored token length:', storedToken ? storedToken.length : 0);
        
        toast({ title: "Success", description: "Login successful!" })
        onLogin()
      } else {
        console.error('❌ Login failed:', data);
        console.error('❌ Response status:', response.status);
        toast({ title: "Error", description: data.message || "Login failed", variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Error", description: "Network error. Please try again.", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-white to-purple-50">
      <Card className="glass-effect border-purple-200 w-full max-w-md">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 purple-gradient rounded-full mx-auto mb-4 flex items-center justify-center">
              <ShieldCheck className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-purple-700 mb-2">Admin Panel</h1>
            <p className="text-gray-600">Abigail Cleaning Service</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white border border-purple-200 rounded-lg focus:border-purple-500 focus:outline-none text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-purple-200"
                placeholder="admin@abigailcleaning.com"
              />
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white border border-purple-200 rounded-lg focus:border-purple-500 focus:outline-none text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-purple-200"
                placeholder="••••••••"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full purple-gradient text-white font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity"
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
