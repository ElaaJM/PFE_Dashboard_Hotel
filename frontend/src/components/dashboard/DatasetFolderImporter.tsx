
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderUp, FileUp, Upload, Check, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { processBatchDatasets, BatchImportResult } from '@/lib/meta-data-processor';
import { Input } from "@/components/ui/input";

interface DatasetFolderImporterProps {
  onImport: (result: BatchImportResult) => void;
}

const DatasetFolderImporter: React.FC<DatasetFolderImporterProps> = ({ onImport }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [folderPath, setFolderPath] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    // In a real implementation, we would handle dropped folders
    // For now, we'll just show a toast explaining the limitation
    toast.info("Folder drop is not supported in this demo. Please use the folder path input.");
  };
  
  const handleFolderProcess = async () => {
    if (!folderPath.trim()) {
      toast.error("Please enter a folder path first");
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Process the folder of datasets
      const result = await processBatchDatasets(folderPath);
      
      toast.success(`Successfully processed ${result.processed} files with ${result.totalRecords} records`);
      onImport(result);
    } catch (error) {
      console.error("Error processing datasets:", error);
      toast.error("Failed to process datasets. Please check the folder path and try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className={`border border-border/40 shadow-sm ${isDragging ? 'border-bizerta-gold' : ''} transition-all`}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <FolderUp className="h-5 w-5 mr-2 text-bizerta-gold" />
          Dataset Folder Import
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          className={`flex flex-col space-y-4 p-4 rounded-md border-2 border-dashed
            ${isDragging ? 'border-bizerta-gold bg-bizerta-beige' : 'border-gray-300 bg-gray-50'}
            transition-all`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="text-center space-y-2">
            <Upload className="h-10 w-10 text-bizerta-gold mx-auto" />
            <h3 className="font-medium">Import Multiple CSV Datasets</h3>
            <p className="text-sm text-muted-foreground">
              Process an entire folder of CSV data files at once
            </p>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Folder Path</label>
            <div className="flex">
              <Input 
                type="text" 
                className="flex-grow rounded-l-md"
                placeholder="/path/to/datasets"
                value={folderPath}
                onChange={(e) => setFolderPath(e.target.value)}
              />
              <Button 
                variant="secondary" 
                className="rounded-l-none"
                onClick={() => fileInputRef.current?.click()}
              >
                <FileUp className="h-4 w-4" />
              </Button>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              // Use attribute assignment instead of direct props for non-standard attributes
              {...{
                webkitdirectory: "",
                directory: ""
              }}
              onChange={(e) => {
                // In a real implementation, we would handle the selected folder
                // For now, just set a mock path based on the number of files
                const files = e.target.files;
                if (files && files.length > 0) {
                  setFolderPath(`/uploads/datasets (${files.length} files)`);
                }
              }}
            />
            <p className="text-xs text-muted-foreground">
              Enter the folder path or select a folder containing your CSV datasets
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={handleFolderProcess}
          disabled={isProcessing || !folderPath.trim()}
        >
          {isProcessing ? (
            <>Processing...</>
          ) : (
            <>
              <FolderUp className="h-4 w-4 mr-2" />
              Process Dataset Folder
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DatasetFolderImporter;
