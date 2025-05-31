
import React from 'react';
import { Facebook, Instagram } from 'lucide-react';

interface MetaInsightsInfoProps {
  dataSource: 'mock' | 'imported' | 'meta';
}

const MetaInsightsInfo: React.FC<MetaInsightsInfoProps> = ({ dataSource }) => {
  if (dataSource !== 'meta') {
    return null;
  }

  return (
    <div className="mb-6 p-4 rounded-md border bg-white">
      <div className="flex items-center space-x-2 mb-4">
        <Facebook className="h-5 w-5 text-blue-600" />
        <Instagram className="h-5 w-5 text-purple-600" />
        <h2 className="text-lg font-semibold">Meta Business Insights</h2>
      </div>
      <p className="text-sm text-muted-foreground">
        This dashboard is displaying data imported from your connected Meta Business Suite accounts.
        Data is cleaned and processed using automated Python scripts.
      </p>
    </div>
  );
};

export default MetaInsightsInfo;
