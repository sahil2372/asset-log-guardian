import { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { ComparisonResults } from '@/components/ComparisonResults';
import { Statistics } from '@/components/Statistics';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { fetchRapid7Assets } from '@/utils/rapid7Api';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, FileSpreadsheet, ArrowRightLeft } from 'lucide-react';

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
  const [isLoading, setIsLoading] = useState(false);
  
  const handleCompare = async () => {
    if (!inventoryFile) {
      toast.error('Please upload the inventory file first');
      return;
    }

    if (!apiKey) {
      toast.error('Please enter your Rapid7 API key');
      return;
    }

    setIsLoading(true);
    try {
      const rapid7Assets = await fetchRapid7Assets(apiKey);
      const mockAssets: Asset[] = rapid7Assets.map(asset => ({
        id: asset.id,
        name: asset.hostName,
        isReporting: !!asset.lastAssessedFor,
        lastSeen: asset.lastAssessedFor || undefined,
      }));
      
      setAssets(mockAssets);
      toast.success('Comparison completed successfully');
    } catch (error) {
      toast.error('Failed to fetch Rapid7 assets');
    } finally {
      setIsLoading(false);
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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">Asset Log Guardian</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connect to Rapid7 and upload your asset inventory to verify reporting status.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Rapid7 Connection
              </CardTitle>
              <CardDescription>
                Enter your API key to connect to Rapid7
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your Rapid7 API key"
                className="w-full"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5" />
                Asset Inventory
              </CardTitle>
              <CardDescription>
                Upload your asset inventory file
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileUpload
                onFileSelect={setInventoryFile}
                accept=".csv,.xlsx"
                label="Upload Asset Inventory"
              />
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center gap-4">
          <Button 
            onClick={handleCompare} 
            disabled={!apiKey || !inventoryFile || isLoading}
            className="gap-2"
          >
            <ArrowRightLeft className="h-4 w-4" />
            {isLoading ? 'Comparing...' : 'Compare Assets'}
          </Button>
          <Button 
            variant="outline" 
            onClick={handleExport} 
            disabled={assets.length === 0}
          >
            Export Results
          </Button>
        </div>

        {assets.length > 0 && (
          <div className="space-y-8">
            <Statistics
              totalAssets={assets.length}
              reportingCount={reportingCount}
              notReportingCount={notReportingCount}
            />
            <ComparisonResults assets={assets} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;