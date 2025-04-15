import React, { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, Shield, AlertTriangle, Mail, CheckCircle } from 'lucide-react';
import StatisticsCard from './StatisticsCard';
import LoadingSpinner from '../common/LoadingSpinner';
import SecurityTips from '../common/SecurityTips';
import { fetchDashboardStats } from '../../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getStats = async () => {
      try {
        setLoading(true);
        const data = await fetchDashboardStats();
        setStats(data);
        setError(null);
      } catch (err) {
        setError('Failed to load dashboard data. Please try again later.');
        console.error('Dashboard data loading error:', err);
      } finally {
        setLoading(false);
      }
    };

    getStats();
    // Set up polling for real-time updates
    const interval = setInterval(getStats, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);

  if (loading && !stats) {
    return <LoadingSpinner message="Loading dashboard data..." />;
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md text-red-800">
        <p className="font-medium">{error}</p>
        <button 
          className="mt-2 text-sm text-red-900 underline"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  // Fallback data in case API fails but we don't get an error
  const data = stats || {
    scannedEmails: 0,
    fraudDetected: 0,
    threatLevel: 'low',
    fraudPercentage: 0,
    recentActivity: [],
    weeklyStats: { labels: [], data: [] }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">Overview of your email security status</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatisticsCard 
          title="Scanned Emails"
          value={data.scannedEmails}
          icon={<Mail />}
          change={data.scannedEmailsChange || 5.2}
          changeDirection="up"
          color="blue"
        />
        <StatisticsCard 
          title="Fraud Detected"
          value={data.fraudDetected}
          icon={<AlertTriangle />}
          change={data.fraudDetectedChange || -2.1}
          changeDirection="down"
          color="red"
        />
        <StatisticsCard 
          title="Threat Level"
          value={data.threatLevel || "Low"}
          icon={<Shield />}
          valueSize="text-xl"
          color="green"
        />
        <StatisticsCard 
          title="Fraud Percentage"
          value={`${data.fraudPercentage}%`}
          icon={<CheckCircle />}
          change={data.fraudPercentageChange || -1.4}
          changeDirection="down"
          color="purple"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-4">Weekly Scan Activity</h2>
          {/* For simplicity, we're just showing a placeholder. In a real app, you'd use a chart library. */}
          <div className="h-64 bg-gray-50 rounded-md flex items-center justify-center">
            <p className="text-gray-500">Chart would be rendered here with real data</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-4">Recent Activity</h2>
          {data.recentActivity && data.recentActivity.length > 0 ? (
            <ul className="space-y-3">
              {data.recentActivity.map((activity, index) => (
                <li key={index} className="pb-3 border-b last:border-b-0">
                  <p className="font-medium">{activity.title}</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">{activity.time}</span>
                    <span className={`${
                      activity.status === 'Blocked' ? 'text-red-500' : 
                      activity.status === 'Safe' ? 'text-green-500' : 'text-yellow-500'
                    }`}>{activity.status}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No recent activity to display</p>
          )}
        </div>
      </div>
      
      <div className="mt-6">
        <SecurityTips />
      </div>
    </div>
  );
};

export default Dashboard;