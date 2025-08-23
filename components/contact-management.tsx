"use client"

import { Mail } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ContactManagement() {
  return (
    <div className="space-y-6">
      <div className="text-center py-12">
        <Mail className="w-16 h-16 text-purple-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-purple-700 mb-2">Inquiry Management</h3>
        <p className="text-gray-600 mb-6">
          Inquiry management functionality will be available when inquiry endpoints are implemented.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card className="glass-effect border-purple-200">
            <CardHeader>
              <CardTitle className="text-purple-700 flex items-center justify-center">
                <Mail className="w-5 h-5 mr-2" />
                View Inquiries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm text-center">View and manage all inquiries</p>
            </CardContent>
          </Card>

          <Card className="glass-effect border-purple-200">
            <CardHeader>
              <CardTitle className="text-purple-700 flex items-center justify-center">
                <Mail className="w-5 h-5 mr-2" />
                Service Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm text-center">Handle service requests</p>
            </CardContent>
          </Card>

          <Card className="glass-effect border-purple-200">
            <CardHeader>
              <CardTitle className="text-purple-700 flex items-center justify-center">
                <Mail className="w-5 h-5 mr-2" />
                Quote Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm text-center">Process quote requests</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
