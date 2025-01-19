import { toast } from "sonner";

interface Rapid7Asset {
  id: string;
  hostName: string;
  lastAssessedFor: string;
}

export const fetchRapid7Assets = async (apiKey: string): Promise<Rapid7Asset[]> => {
  try {
    const response = await fetch('https://us.api.insight.rapid7.com/vm/v4/assets', {
      headers: {
        'X-Api-Key': apiKey,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch Rapid7 assets');
    }

    const data = await response.json();
    return data.resources.map((asset: any) => ({
      id: asset.id,
      hostName: asset.hostName || 'Unknown',
      lastAssessedFor: asset.lastAssessedFor || null,
    }));
  } catch (error) {
    toast.error('Error fetching Rapid7 assets');
    throw error;
  }
};