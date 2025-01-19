import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface Asset {
  id: string;
  name: string;
  isReporting: boolean;
  lastSeen?: string;
}

interface ComparisonResultsProps {
  assets: Asset[];
}

export const ComparisonResults = ({ assets }: ComparisonResultsProps) => {
  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Asset ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Seen</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assets.map((asset) => (
            <TableRow key={asset.id}>
              <TableCell>{asset.id}</TableCell>
              <TableCell>{asset.name}</TableCell>
              <TableCell>
                <Badge variant={asset.isReporting ? "default" : "destructive"}>
                  {asset.isReporting ? 'Reporting' : 'Not Reporting'}
                </Badge>
              </TableCell>
              <TableCell>{asset.lastSeen || 'N/A'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};