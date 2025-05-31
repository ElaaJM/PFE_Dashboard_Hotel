
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Instagram, Link } from 'lucide-react';
import { toast } from 'sonner';

interface MetaConnectorProps {
  onConnect: () => void;
  isConnected: boolean;
}

const MetaConnector: React.FC<MetaConnectorProps> = ({ onConnect, isConnected }) => {
  const [pageId, setPageId] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  
  const handleConnect = () => {
    if (!pageId.trim()) {
      toast.error("Please enter a Facebook page ID");
      return;
    }
    
    setIsConnecting(true);
    
    // Simulate connection process
    setTimeout(() => {
      onConnect();
      setIsConnecting(false);
      toast.success("Successfully connected to Meta Business Suite");
    }, 1500);
  };
  
  if (isConnected) {
    return (
      <Card className="border border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <div className="h-3 w-3 rounded-full bg-green-500"></div>
            <span className="text-green-700 font-medium">Connected to Meta Business Suite</span>
          </div>
          <div className="mt-4 flex space-x-3">
            <Facebook className="h-5 w-5 text-blue-600" />
            <Instagram className="h-5 w-5 text-purple-600" />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            variant="outline" 
            className="w-full border-green-200 text-green-700"
            onClick={onConnect}
          >
            Refresh Data
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  return (
    <Card className="border border-border/40 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Link className="h-5 w-5 mr-2 text-bizerta-gold" />
          Connect to Meta Business
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Facebook className="h-5 w-5 text-blue-600" />
            <Instagram className="h-5 w-5 text-purple-600" />
            <span className="text-sm text-muted-foreground">Import data from Facebook and Instagram</span>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Facebook Page ID</label>
            <Input 
              type="text" 
              placeholder="e.g. bizertaresort"
              value={pageId}
              onChange={(e) => setPageId(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Enter your Facebook page ID to connect to Meta Business Suite
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={handleConnect}
          disabled={isConnecting}
        >
          {isConnecting ? (
            <>Connecting...</>
          ) : (
            <>Connect to Meta</>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MetaConnector;
