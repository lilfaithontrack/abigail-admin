"use client"

import { Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function UserManagement() {
  return (
    <div className="space-y-6">
      <div className="text-center py-12">
        <Users className="w-16 h-16 text-purple-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-purple-700 mb-2">Customer Management</h3>
        <p className="text-gray-600 mb-6">
          Customer management functionality will be available when customer endpoints are implemented.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card className="glass-effect border-purple-200">
            <CardHeader>
              <CardTitle className="text-purple-700 flex items-center justify-center">
                <Users className="w-5 h-5 mr-2" />
                View Customers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm text-center">View and manage all customers</p>
            </CardContent>
          </Card>

          <Card className="glass-effect border-purple-200">
            <CardHeader>
              <CardTitle className="text-purple-700 flex items-center justify-center">
                <Users className="w-5 h-5 mr-2" />
                Add Customers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm text-center">Add new customer accounts</p>
            </CardContent>
          </Card>

          <Card className="glass-effect border-purple-200">
            <CardHeader>
              <CardTitle className="text-purple-700 flex items-center justify-center">
                <Users className="w-5 h-5 mr-2" />
                Customer Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm text-center">Manage customer support tickets</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
