
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Facebook, Instagram } from "lucide-react";
import { toast } from "sonner";

const MetaIntegrationTab = () => {
  const [metaConnected, setMetaConnected] = useState(false);

  const handleMetaConnect = () => {
    // In a real implementation, this would open Meta's OAuth flow
    toast.success("Connected to Meta Business Suite successfully");
    setMetaConnected(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Meta Business Suite Integration</CardTitle>
        <CardDescription>
          Connect your Facebook and Instagram business accounts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!metaConnected ? (
          <div className="flex flex-col items-center py-8">
            <div className="flex items-center space-x-4 mb-6">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Facebook className="h-6 w-6 text-blue-600" />
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                <Instagram className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <p className="text-center mb-6 max-w-md">
              Connect to your Meta Business Suite to automatically import insights data
              from your Facebook and Instagram business pages.
            </p>
            <Button onClick={handleMetaConnect} className="bg-blue-600 hover:bg-blue-700">
              Connect to Meta Business Suite
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-md flex items-center">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-4">
                <div className="h-5 w-5 text-green-600">✓</div>
              </div>
              <div>
                <h3 className="font-medium text-green-800">Connected to Meta Business Suite</h3>
                <p className="text-sm text-green-600">Your Facebook and Instagram insights are being imported</p>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <Label>Connected Accounts</Label>
              <div className="space-y-2">
                <div className="p-3 border rounded-md flex justify-between items-center">
                  <div className="flex items-center">
                    <Facebook className="h-5 w-5 text-blue-600 mr-2" />
                    <span>Bizerta Resort</span>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
                </div>
                <div className="p-3 border rounded-md flex justify-between items-center">
                  <div className="flex items-center">
                    <Instagram className="h-5 w-5 text-purple-600 mr-2" />
                    <span>@bizertaresort</span>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Data Sync Settings</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="syncFrequency" className="text-sm">Sync Frequency</Label>
                  <select id="syncFrequency" className="w-full p-2 border rounded-md">
                    <option value="daily">Daily</option>
                    <option value="hourly">Hourly</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="dataRange" className="text-sm">Data Range</Label>
                  <select id="dataRange" className="w-full p-2 border rounded-md">
                    <option value="30">Last 30 days</option>
                    <option value="90">Last 90 days</option>
                    <option value="365">Last 365 days</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      {metaConnected && (
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => setMetaConnected(false)}>
            Disconnect
          </Button>
          <Button>
            Sync Now
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default MetaIntegrationTab;
