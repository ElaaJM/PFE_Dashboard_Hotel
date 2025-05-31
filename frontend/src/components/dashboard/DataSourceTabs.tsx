
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import CSVImporter from './CSVImporter';
import DatasetFolderImporter from './DatasetFolderImporter';
import { BatchImportResult } from '@/lib/meta-data-processor';
import { Button } from "@/components/ui/button";
import { Facebook, Instagram } from 'lucide-react';
import MetaConnector from './MetaConnector';

interface DataSourceTabsProps {
  onCSVImport: (csvText: string) => void;
  onFolderImport: (result: BatchImportResult) => void;
  onMetaDataFetch: () => void;
  isLoading: boolean;
  metaConnected: boolean;
}

const DataSourceTabs: React.FC<DataSourceTabsProps> = ({
  onCSVImport,
  onFolderImport,
  onMetaDataFetch,
  isLoading,
  metaConnected
}) => {
  const [activeTab, setActiveTab] = useState("csv");
  
  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="flex-shrink-0 w-full md:w-auto">
        <Card>
          <CardContent className="p-2">
            <Tabs 
              defaultValue="csv" 
              value={activeTab} 
              onValueChange={(value) => setActiveTab(value)}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="csv">CSV</TabsTrigger>
                <TabsTrigger value="folder">Folder</TabsTrigger>
                
              </TabsList>
              
              <div className="mt-2 relative">
                {isLoading && (
                  <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
                    <div className="animate-pulse text-bizerta-gold">Loading...</div>
                  </div>
                )}
                
                <TabsContent value="csv" className={`${isLoading ? 'opacity-50' : ''}`}>
                  <CSVImporter onImport={onCSVImport} />
                </TabsContent>
                
                <TabsContent value="folder" className={`${isLoading ? 'opacity-50' : ''}`}>
                  <DatasetFolderImporter onImport={onFolderImport} />
                </TabsContent>
                
                <TabsContent value="meta" className={`${isLoading ? 'opacity-50' : ''}`}>
                  <MetaConnector 
                    onConnect={onMetaDataFetch} 
                    isConnected={metaConnected} 
                  />
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      {metaConnected && (
        <div className="flex-shrink-0">
          <Button 
            className="h-full"
            variant="outline"
            onClick={onMetaDataFetch}
          >
            <div className="flex items-center space-x-1">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span>Meta Connected</span>
            </div>
          </Button>
        </div>
      )}
    </div>
  );
};

export default DataSourceTabs;
