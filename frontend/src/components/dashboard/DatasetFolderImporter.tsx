import React, { useState, useRef, ChangeEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderUp, FileUp, Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { BatchImportResult } from '@/lib/meta-data-processor';
import { Input } from "@/components/ui/input";
import { useNavigate } from 'react-router-dom';

interface DatasetFolderImporterProps {
  onImport: (result: BatchImportResult) => void;
}

const DatasetFolderImporter: React.FC<DatasetFolderImporterProps> = ({ onImport }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [folderPath, setFolderPath] = useState("");
  const navigate = useNavigate();
  const [filesToUpload, setFilesToUpload] = useState<FileList | null>(null);
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
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const csvFiles = Array.from(files).filter(file => file.type === 'text/csv' || file.name.endsWith('.csv'));
      if (csvFiles.length === 0) {
        toast.error("No valid CSV files found in dropped items");
        return;
      }
      setFilesToUpload(files);
      setFolderPath(`/uploads/datasets (${csvFiles.length} files)`);
    } else {
      toast.info("Folder drop is not supported. Please use the folder picker.");
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const csvFiles = Array.from(files).filter(file => file.type === 'text/csv' || file.name.endsWith('.csv'));
      if (csvFiles.length === 0) {
        toast.error("Please select CSV files only");
        return;
      }
      setFilesToUpload(files);
      setFolderPath(`/uploads/datasets (${csvFiles.length} files)`);
    }
  };

  const handleFolderProcess = async () => {
    if (!filesToUpload || filesToUpload.length === 0) {
      toast.error("Please select a folder with CSV files first");
      return;
    }

    setIsProcessing(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('No authentication token found. Please login.');
        return;
      }

      const formData = new FormData();
      for (let i = 0; i < filesToUpload.length; i++) {
        const file = filesToUpload[i];
        if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
          formData.append("csvFiles", file, file.name);
        }
      }

      const response = await fetch('http://localhost:5000/api/auth/upload-csv-folder', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = errorData.message || `Failed to process datasets (Status: ${response.status})`;
        toast.error(errorMsg);
        return;
      }

      const data = await response.json();
      toast.success(data.message || `Successfully processed ${data.files?.length || 0} files.`);
      onImport(data);
      navigate('/csv-table');
    } catch (error) {
      console.error("Error processing datasets:", error);
      toast.error("Failed to process datasets. Please try again.");
    } finally {
      setIsProcessing(false);
      setFilesToUpload(null);
      setFolderPath("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <>
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
                Drag and drop a folder or select CSV files
              </p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Selected Files</label>
              <div className="flex">
                <Input 
                  type="text" 
                  className="flex-grow rounded-l-md"
                  placeholder="No files selected"
                  value={folderPath}
                  readOnly
                />
                <Button 
                  variant="secondary" 
                  className="rounded-l-none"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessing}
                >
                  <FileUp className="h-4 w-4" />
                </Button>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                multiple
                {...({ webkitdirectory: true, directory: true } as any)}
                onChange={handleFileInputChange}
                disabled={isProcessing}
                accept=".csv,text/csv"
              />
              <p className="text-xs text-muted-foreground">
                Select a folder or multiple CSV files
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={handleFolderProcess}
            disabled={isProcessing || !filesToUpload || filesToUpload.length === 0}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <FolderUp className="h-4 w-4 mr-2" />
                Process CSV Files
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {isProcessing && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4 bg-white px-6 py-4 rounded-lg shadow-lg">
            <Loader2 className="h-8 w-8 animate-spin text-bizerta-gold" />
            <span className="text-sm font-medium text-gray-700">
              Processing CSV files, please wait...
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default DatasetFolderImporter;