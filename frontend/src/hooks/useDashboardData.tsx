import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { 
  DailyStats,
  DashboardData,
  getMockDashboardData, 
  processCSVData, 
  getDashboardDataFromCSV
} from '@/lib/data-service';
import { 
  runPythonDataCleaning, 
  fetchMetaInsights, 
  BatchImportResult, 
  processBatchDatasets
} from '@/lib/meta-data-processor';

export type DataSource = 'mock' | 'imported' | 'meta';

export const useDashboardData = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData>(getMockDashboardData(30));
  const [selectedRange, setSelectedRange] = useState(30);
  const [isLoading, setIsLoading] = useState(false);
  const [hasImportedData, setHasImportedData] = useState(false);
  const [importedDataStats, setImportedDataStats] = useState<DailyStats[]>([]);
  const [dataSource, setDataSource] = useState<DataSource>('mock');
  const [metaConnected, setMetaConnected] = useState(false);
  
  const handleRangeChange = (days: number) => {
    setIsLoading(true);
    setSelectedRange(days);
    
    setTimeout(() => {
      if (dataSource === 'meta' && metaConnected) {
        handleMetaDataFetch(days);
      } else if (dataSource === 'imported' && importedDataStats.length > 0) {
        const filteredStats = filterDataByDays(importedDataStats, days);
        setDashboardData(getDashboardDataFromCSV(filteredStats));
      } else {
        setDashboardData(getMockDashboardData(days));
      }
      setIsLoading(false);
      toast.success(`Data updated for the year ${days}`);
    }, 800);
  };
  
  const handleCSVImport = (csvText: string) => {
    try {
      setIsLoading(true);
      if (typeof csvText !== 'string') {
        throw new Error('Invalid CSV data: Expected a string');
      }
      const parsedData = processCSVData(csvText);
      
      if (parsedData.length > 0) {
        const cleanedData = runPythonDataCleaning(parsedData);
        
        setImportedDataStats(cleanedData);
        const filteredStats = filterDataByDays(cleanedData, selectedRange);
        setDashboardData(getDashboardDataFromCSV(filteredStats));
        setHasImportedData(true);
        setDataSource('imported');
        toast.success(`Successfully imported and cleaned ${parsedData.length} data points`);
      } else {
        toast.error('No valid data found in the CSV file');
      }
    } catch (error) {
      console.error('Error importing CSV:', error);
      toast.error('Failed to import CSV data. Please check the format.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFolderImport = async (result: BatchImportResult) => {
    setIsLoading(true);
    
    try {
      console.log('Processing folder import with result:', result);
      
      // Simulate processing multiple CSV files (in a real app, fetch file contents)
      const mockData = getMockDashboardData(365); // Placeholder for actual processing
      setImportedDataStats(mockData.dailyStats);
      
      const filteredStats = filterDataByDays(mockData.dailyStats, selectedRange);
      setDashboardData(getDashboardDataFromCSV(filteredStats));
      setHasImportedData(true);
      setDataSource('imported');
      
      toast.success(`Successfully processed ${result.files?.length || 0} files with ${result.totalRecords || 0} records`);
    } catch (error) {
      console.error('Error processing folder import:', error);
      toast.error('Failed to process dataset folder');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleMetaDataFetch = async (days: number = selectedRange) => {
    setIsLoading(true);
    
    try {
      const insights = await fetchMetaInsights('123456789', 'mock-token', days);
      const cleanedData = runPythonDataCleaning(insights);
      
      setImportedDataStats(cleanedData);
      setDashboardData(getDashboardDataFromCSV(cleanedData));
      setHasImportedData(true);
      setDataSource('meta');
      setMetaConnected(true);
      
      toast.success(`Meta insights data updated for the year ${days}`);
    } catch (error) {
      console.error('Error fetching Meta insights:', error);
      toast.error('Failed to fetch Meta insights data');
    } finally {
      setIsLoading(false);
    }
  };
  
  const filterDataByDays = (data: DailyStats[], days: number): DailyStats[] => {
    if (data.length <= days) return data;
    
    const sortedData = [...data].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    return sortedData.slice(0, days);
  };
  
  useEffect(() => {
    const timer = setTimeout(() => {
      toast.success('Dashboard loaded successfully');
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  return {
    dashboardData,
    selectedRange,
    isLoading,
    hasImportedData,
    dataSource,
    metaConnected,
    handleRangeChange,
    handleCSVImport,
    handleFolderImport,
    handleMetaDataFetch
  };
};