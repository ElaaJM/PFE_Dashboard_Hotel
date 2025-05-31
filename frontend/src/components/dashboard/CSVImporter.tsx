import React, { useState, useRef, ChangeEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileUp, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface CSVImporterProps {
  onImport: (csvText: string) => void; // Keep the original signature for compatibility
}

const CSVImporter: React.FC<CSVImporterProps> = ({ onImport }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

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

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
        toast.error('Please drop a CSV file');
        return;
      }
      processFile(file);
    }
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
        toast.error('Please select a CSV file');
        return;
      }
      processFile(file);
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const processFile = async (file: File) => {
    setIsProcessing(true);

    try {
      // Read CSV content client-side
      const csvText = await file.text();
      if (!csvText || csvText.trim().length === 0) {
        toast.error('CSV file is empty');
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('No authentication token found. Please login.');
        return;
      }

      // Upload file to backend
      const formData = new FormData();
      formData.append('csvFile', file);

      const response = await fetch('http://localhost:5000/api/auth/upload-csv', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = errorData.message || `Upload failed (Status: ${response.status})`;
        toast.error(errorMsg);
        return;
      }

      const data = await response.json();
      toast.success(data.message || 'CSV file uploaded successfully');
      navigate('/csv-table');
      // Pass CSV content to onImport
      onImport(csvText);

    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload CSV file. Please try again.');
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Reset file input
      }
    }
  };

  return (
    <>
      <Card className={`border border-border/40 shadow-sm ${isDragging ? 'border-bizerta-gold' : ''} transition-all`}>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <FileUp className="h-5 w-5 mr-2 text-bizerta-gold" />
            Single CSV Import
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div 
            className={`flex flex-col items-center justify-center p-6 rounded-md border-2 border-dashed
              ${isDragging ? 'border-bizerta-gold bg-bizerta-beige' : 'border-gray-300 bg-gray-50'}
              transition-all cursor-pointer`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="h-8 w-8 text-bizerta-gold mb-2" />
            <span className="text-sm font-medium text-gray-700">Import CSV Data</span>
            <span className="text-xs text-muted-foreground">Drag and drop or click to select a CSV file</span>
            <input 
              type="file" 
              accept=".csv,text/csv" 
              ref={fileInputRef} 
              onChange={handleFileInput} 
              className="hidden" 
              disabled={isProcessing}
            />
            <Button
              variant="secondary"
              className="mt-4"
              onClick={handleButtonClick}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <FileUp className="mr-2 h-4 w-4" />
                  Select CSV File
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {isProcessing && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4 bg-white px-6 py-4 rounded-lg shadow-lg">
            <Loader2 className="h-8 w-8 animate-spin text-bizerta-gold" />
            <span className="text-sm font-medium text-gray-700">
              Uploading CSV file, please wait...
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default CSVImporter;