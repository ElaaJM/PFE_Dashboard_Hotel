
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, FileUp } from 'lucide-react';
import { toast } from 'sonner';

interface CSVImporterProps {
  onImport: (csvText: string) => void;
}

const CSVImporter: React.FC<CSVImporterProps> = ({ onImport }) => {
  const [isDragging, setIsDragging] = useState(false);
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
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  };
  
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      processFile(file);
    }
  };
  
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const processFile = (file: File) => {
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      toast.error('Please upload a CSV file');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        onImport(content);
      }
    };
    reader.onerror = () => {
      toast.error('Failed to read the file');
    };
    reader.readAsText(file);
  };

  return (
    <Card className={`border border-border/40 shadow-sm ${isDragging ? 'border-bizerta-gold' : ''} transition-all`}>
      <CardContent className="p-2">
        <div 
          className={`flex items-center justify-center p-4 rounded-md border-2 border-dashed
            ${isDragging ? 'border-bizerta-gold bg-bizerta-beige' : 'border-gray-300 bg-gray-50'}
            transition-all cursor-pointer`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleButtonClick}
        >
          <div className="flex flex-col items-center space-y-2">
            <Upload className="h-6 w-6 text-bizerta-gold" />
            <span className="text-sm text-muted-foreground">Import CSV Data</span>
            <input 
              type="file" 
              accept=".csv" 
              ref={fileInputRef} 
              onChange={handleFileInput} 
              className="hidden" 
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CSVImporter;
