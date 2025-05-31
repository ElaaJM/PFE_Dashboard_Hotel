
import React from 'react';

interface DashboardHeaderProps {
  title: string;
  description: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ title, description }) => {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-display font-semibold tracking-wide">{title}</h1>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default DashboardHeader;
