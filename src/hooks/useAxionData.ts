import { useState, useEffect } from 'react';

export interface AxionBuild {
  datetime: number;
  filename: string;
  id: string;
  romtype: string;
  size: number;
  url: string;
  version: string;
}

export interface AxionData {
  gms: AxionBuild | null;
  vanilla: AxionBuild | null;
  changelog: string;
  bannerUrl: string;
}

export function useAxionData() {
  const [data, setData] = useState<AxionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [gmsRes, vanillaRes, changelogRes] = await Promise.all([
          fetch('https://raw.githubusercontent.com/AxionAOSP/official_devices/main/OTA/GMS/cancunf.json').then(r => r.ok ? r.json() : null).catch(() => null),
          fetch('https://raw.githubusercontent.com/AxionAOSP/official_devices/main/OTA/VANILLA/cancunf.json').then(r => r.ok ? r.json() : null).catch(() => null),
          fetch('https://raw.githubusercontent.com/AxionAOSP/official_devices/main/OTA/CHANGELOG/cancunf.txt').then(r => r.ok ? r.text() : '').catch(() => '')
        ]);

        if (!active) return;

        const gmsBuild = gmsRes?.response?.[0] || null;
        const vanillaBuild = vanillaRes?.response?.[0] || null;
        const version = gmsBuild?.version || vanillaBuild?.version || '1.6';
        const majorVersion = version.split('.')[0];
        const bannerUrl = majorVersion === '1' 
          ? 'https://raw.githubusercontent.com/AxionAOSP/official_devices/main/OTA/Banners/1.3.png'
          : `https://raw.githubusercontent.com/AxionAOSP/official_devices/main/OTA/Banners/${majorVersion}.x.png`;

        setData({
          gms: gmsBuild,
          vanilla: vanillaBuild,
          changelog: changelogRes || '',
          bannerUrl
        });
        setError(null);
      } catch (err) {
        if (active) {
          console.error(err);
          setError(err);
        }
      } finally {
        if (active) setIsLoading(false);
      }
    };

    fetchData();
    return () => {
      active = false;
    };
  }, []);

  return { data, isLoading, error };
}

export function formatFileSize(bytes: number): string {
  if (!bytes) return '0 GB';
  const gb = bytes / (1024 * 1024 * 1024);
  return `${gb.toFixed(2)} GB`;
}

export function formatDate(timestamp: number): string {
  if (!timestamp) return '';
  return new Date(timestamp * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}
