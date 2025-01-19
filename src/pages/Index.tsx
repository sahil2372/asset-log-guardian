import { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { ComparisonResults } from '@/components/ComparisonResults';
import { Statistics } from '@/components/Statistics';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { fetchRapid7Assets } from '@/utils/rapid7Api';
import { Input } from '@/components/ui/input';

interface Asset {
  id: string;
  name: string;
  isReporting: boolean;
  lastSeen?: string;
}

const Index = () => {
  const [inventoryFile, setInventoryFile] = useState<File | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [apiKey, setApiKey] = useState('');
  
  const handleCompare = async () => {
    if (!inventoryFile) {
      toast.error('Please upload the inventory file first');
      return;
    }

    if (!apiKey) {
      toast.error('Please enter your Rapid7 API key');
      return;
    }

    try {
      const rapid7Assets = await fetchRapid7Assets(apiKey);
      
      // For now, we'll use mock comparison logic
      // In a real implementation, you would parse the inventory file and compare with rapid7Assets
      const mockAssets: Asset[] = rapid7Assets.map(asset => ({
        id: asset.id,
        name: asset.hostName,
        isReporting: !!asset.lastAssessedFor,
        lastSeen: asset.lastAssessedFor || undefined,
      }));
      
      setAssets(mockAssets);
      toast.success('Comparison completed');
    } catch (error) {
      toast.error('Failed to fetch Rapid7 assets');
    }
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
          Connect to Rapid7 and upload your asset inventory to verify reporting status.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Rapid7 API Key
          </label>
          <Input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your Rapid7 API key"
            className="w-full"
          />
        </div>
        <FileUpload
          onFileSelect={setInventoryFile}
          accept=".csv,.xlsx"
          label="Upload Asset Inventory"
        />
      </div>

      <div className="flex justify-center gap-4">
        <Button onClick={handleCompare} disabled={!apiKey || !inventoryFile}>
          Compare Assets
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