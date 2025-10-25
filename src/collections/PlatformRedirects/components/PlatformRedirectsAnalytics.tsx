// 'use client';

// import React, { useEffect, useState } from 'react';
// import { Card } from 'payload/components/elements';
// import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// type RedirectDoc = {
//     title: string;
//     platform: string;
//     clicks: number;
// };

// export const PlatformRedirectsAnalytics: React.FC = () => {
//     const [data, setData] = useState<RedirectDoc[]>([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchData = async () => {
//             const res = await fetch('/api/platform-redirects?limit=100');
//             const json = await res.json();
//             setData(json.docs || []);
//             setLoading(false);
//         };
//         fetchData();
//     }, []);

//     if (loading) return <Card><h3>Loading redirect analytics...</h3></Card>;

//     // Totals
//     const totalLinks = data.length;
//     const totalClicks = data.reduce((sum, d) => sum + (d.clicks || 0), 0);

//     // Top 5
//     const top5 = [...data]
//         .sort((a, b) => b.clicks - a.clicks)
//         .slice(0, 5);

//     // Platform summary
//     const platformCounts: Record<string, number> = {};
//     data.forEach((d) => {
//         platformCounts[d.platform] = (platformCounts[d.platform] || 0) + (d.clicks || 0);
//     });
//     const platformData = Object.entries(platformCounts).map(([name, clicks]) => ({
//         name,
//         clicks,
//     }));

//     return (
//         <Card>
//             <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>
//                 📊 Platform Redirects Analytics
//             </h2>

//             <p><strong>Total Links:</strong> {totalLinks}</p>
//             <p><strong>Total Clicks:</strong> {totalClicks}</p>

//             <h3 style={{ marginTop: '1rem' }}>🏆 Top 5 Redirects</h3>
//             <ul>
//                 {top5.map((d, i) => (
//                     <li key={i}>
//                         {i + 1}. {d.title} — {d.clicks} clicks
//                     </li>
//                 ))}
//             </ul>

//             <h3 style={{ marginTop: '1rem' }}>📈 Clicks by Platform</h3>
//             <ResponsiveContainer width="100%" height={250}>
//                 <BarChart data={platformData}>
//                     <XAxis dataKey="name" />
//                     <YAxis />
//                     <Tooltip />
//                     <Bar dataKey="clicks" fill="#124582" />
//                 </BarChart>
//             </ResponsiveContainer>
//         </Card>
//     );
// };

// ----------------------- add a “Download CSV Report” button --------------
/*
'use client';

import React, { useEffect, useState } from 'react';
import { Card, Button } from 'payload/components/elements';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

type RedirectDoc = {
  title: string;
  platform: string;
  slug: string;
  clicks: number;
  targetUrl: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
};

export const PlatformRedirectsAnalytics: React.FC = () => {
  const [data, setData] = useState<RedirectDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/platform-redirects?limit=1000');
      const json = await res.json();
      setData(json.docs || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  const exportToCSV = () => {
    if (!data.length) return;

    const header = [
      'Title',
      'Platform',
      'Slug',
      'Clicks',
      'Target URL',
      'UTM Source',
      'UTM Medium',
      'UTM Campaign',
    ];

    const rows = data.map((d) => [
      d.title,
      d.platform,
      d.slug,
      d.clicks,
      d.targetUrl,
      d.utm_source || '',
      d.utm_medium || '',
      d.utm_campaign || '',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [header, ...rows].map((e) => e.join(',')).join('\n');

    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `platform-redirects-report-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <Card><h3>Loading redirect analytics...</h3></Card>;

  // Totals
  const totalLinks = data.length;
  const totalClicks = data.reduce((sum, d) => sum + (d.clicks || 0), 0);

  // Top 5
  const top5 = [...data].sort((a, b) => b.clicks - a.clicks).slice(0, 5);

  // Platform summary
  const platformCounts: Record<string, number> = {};
  data.forEach((d) => {
    platformCounts[d.platform] = (platformCounts[d.platform] || 0) + (d.clicks || 0);
  });
  const platformData = Object.entries(platformCounts).map(([name, clicks]) => ({
    name,
    clicks,
  }));

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>📊 Platform Redirects Analytics</h2>
        <Button
          onClick={exportToCSV}
          className="btn btn-primary"
          style={{
            backgroundColor: '#124582',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            fontSize: '0.9rem',
          }}
        >
          ⬇️ Export CSV
        </Button>
      </div>

      <p><strong>Total Links:</strong> {totalLinks}</p>
      <p><strong>Total Clicks:</strong> {totalClicks}</p>

      <h3 style={{ marginTop: '1rem' }}>🏆 Top 5 Redirects</h3>
      <ul>
        {top5.map((d, i) => (
          <li key={i}>
            {i + 1}. {d.title} — {d.clicks} clicks
          </li>
        ))}
      </ul>

      <h3 style={{ marginTop: '1rem' }}>📈 Clicks by Platform</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={platformData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="clicks" fill="#124582" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

*/