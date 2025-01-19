import { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { ComparisonResults } from '@/components/ComparisonResults';
import { Statistics } from '@/components/Statistics';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Asset {
  id: string;
  name: string;
  isReporting: boolean;
  lastSeen?: string;
}

const Index = () => {
  const [rapid7File, setRapid7File] = useState<File | null>(null);
  const [inventoryFile, setInventoryFile] = useState<File | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  
  const handleCompare = () => {
    if (!rapid7File || !inventoryFile) {
      toast.error('Please upload both files first');
      return;
    }

    // Simulated comparison logic - replace with actual file parsing
    const mockAssets: Asset[] = [
      { id: '001', name: 'Server-A', isReporting: true, lastSeen: '2024-02-20' },
      { id: '002', name: 'Server-B', isReporting: false },
      { id: '003', name: 'Server-C', isReporting: true, lastSeen: '2024-02-19' },
    ];
    
    setAssets(mockAssets);
    toast.success('Comparison completed');
  };

  const handleExport = () => {
    if (assets.length === 0) {
      toast.error('No results to export');
      return;
    }
    // Add export logic here
    toast.success('Export started');
  };

  const reportingCount = assets.filter(a => a.isReporting).length;
  const notReportingCount = assets.filter(a => !a.isReporting).length;

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-4">Asset Log Verification</h1>
        <p className="text-muted-foreground">
          Upload your Rapid7 logs and asset inventory to verify reporting status.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <FileUpload
          onFileSelect={setRapid7File}
          accept=".csv,.xlsx"
          label="Upload Rapid7 Logs"
        />
        <FileUpload
          onFileSelect={setInventoryFile}
          accept=".csv,.xlsx"
          label="Upload Asset Inventory"
        />
      </div>

      <div className="flex justify-center gap-4">
        <Button onClick={handleCompare} disabled={!rapid7File || !inventoryFile}>
          Compare Files
        </Button>
        <Button variant="outline" onClick={handleExport} disabled={assets.length === 0}>
          Export Results
        </Button>
      </div>

      {assets.length > 0 && (
        <>
          <Statistics
            totalAssets={assets.length}
            reportingCount={reportingCount}
            notReportingCount={notReportingCount}
          />
          <ComparisonResults assets={assets} />
        </>
      )}
    </div>
  );
};

export default Index;