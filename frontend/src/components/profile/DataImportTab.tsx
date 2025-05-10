
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { FolderUp } from "lucide-react";
import { toast } from "sonner";

const DataImportTab = () => {
  const [folderPath, setFolderPath] = useState("");

  const handleDataFolderUpload = () => {
    if (folderPath.trim()) {
      toast.success("Dataset folder path saved successfully");
    } else {
      toast.error("Please enter a valid folder path");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Import Settings</CardTitle>
        <CardDescription>
          Configure folder locations for bulk data imports
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="folderPath">Dataset Folder Path</Label>
          <div className="flex gap-2">
            <Input 
              id="folderPath" 
              placeholder="/path/to/your/datasets" 
              value={folderPath}
              onChange={(e) => setFolderPath(e.target.value)}
            />
            <Button onClick={handleDataFolderUpload}>Save Path</Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Specify the folder containing your CSV datasets for batch processing
          </p>
        </div>
        
        <Separator />
        
        <div className="space-y-2">
          <Label>Automatic Processing</Label>
          <div className="flex items-center space-x-2">
            <input type="checkbox" id="autoProcess" className="h-4 w-4 rounded border-gray-300" />
            <label htmlFor="autoProcess" className="text-sm">Enable automatic data processing with Python scripts</label>
          </div>
          <p className="text-xs text-muted-foreground">
            When enabled, uploaded datasets will be automatically cleaned and analyzed
          </p>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-md border">
          <h3 className="font-semibold mb-2">Recent Batch Imports</h3>
          <p className="text-sm text-muted-foreground">No recent batch imports found</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button>
          <FolderUp className="h-4 w-4 mr-2" />
          Run Batch Import
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DataImportTab;
