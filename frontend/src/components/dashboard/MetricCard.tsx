
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  trend?: number;
  yoyChange?: number;
  className?: string;
  delay?: number;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  description,
  trend,
  yoyChange,
  className,
  delay = 0
}) => {
  return (
    <Card className={cn(
      "metric-card overflow-hidden transition-all hover:shadow-md", 
      className
    )}
    style={{ animationDelay: `${delay * 0.1}s` }}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="h-8 w-8 rounded-md bg-bizerta-gold/10 flex items-center justify-center">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-display font-semibold">{value}</div>
        <div className="flex flex-col gap-1">
          {description && (
            <p className="text-xs text-muted-foreground">
              {description}
              {trend !== undefined && (
                <span className={cn(
                  "ml-1 font-medium",
                  trend > 0 ? "text-green-500" : trend < 0 ? "text-red-500" : ""
                )}>
                  {trend > 0 ? "+" : ""}{trend}%
                </span>
              )}
            </p>
          )}
          {yoyChange !== undefined && (
            <div className="flex items-center gap-1 text-xs">
              <span className="text-muted-foreground">vs Last Year:</span>
              <span className={cn(
                "font-medium flex items-center gap-0.5",
                yoyChange > 0 ? "text-green-500" : yoyChange < 0 ? "text-red-500" : ""
              )}>
                {yoyChange > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {yoyChange > 0 ? "+" : ""}{yoyChange.toFixed(1)}%
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricCard;
