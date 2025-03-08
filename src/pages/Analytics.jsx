
import React, { useState, useEffect } from 'react';
import { useCrimeStore } from '@/store/crimeStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Calendar, Sliders, TrendingUp, MapPin, FileBarChart } from 'lucide-react';

const Analytics = () => {
  const { crimeReports } = useCrimeStore();
  const [timeRange, setTimeRange] = useState('month'); // 'week', 'month', 'year'
  const [crimesByType, setCrimesByType] = useState([]);
  const [crimesByStatus, setCrimesByStatus] = useState([]);
  const [crimesByDate, setCrimesByDate] = useState([]);
  const [crimesByLocation, setCrimesByLocation] = useState([]);
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A020F0', '#FF6347', '#A0522D'];
  
  // Prepare data for charts
  useEffect(() => {
    if (crimeReports.length === 0) return;
    
    // Process crime types for pie chart
    const typeCount = {};
    crimeReports.forEach(report => {
      typeCount[report.crimeType] = (typeCount[report.crimeType] || 0) + 1;
    });
    
    const typeData = Object.keys(typeCount).map(type => ({
      name: type.charAt(0).toUpperCase() + type.slice(1),
      value: typeCount[type]
    }));
    setCrimesByType(typeData);
    
    // Process crime status for pie chart
    const statusCount = {};
    crimeReports.forEach(report => {
      statusCount[report.status] = (statusCount[report.status] || 0) + 1;
    });
    
    const statusData = Object.keys(statusCount).map(status => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: statusCount[status]
    }));
    setCrimesByStatus(statusData);
    
    // Process crimes by date for line chart
    const dateCount = {};
    const now = new Date();
    
    // Set date range based on timeRange
    let startDate = new Date();
    if (timeRange === 'week') {
      startDate.setDate(startDate.getDate() - 7);
    } else if (timeRange === 'month') {
      startDate.setMonth(startDate.getMonth() - 1);
    } else if (timeRange === 'year') {
      startDate.setFullYear(startDate.getFullYear() - 1);
    }
    
    // Filter reports within the selected time range
    const filteredReports = crimeReports.filter(report => {
      const reportDate = new Date(report.date);
      return reportDate >= startDate && reportDate <= now;
    });
    
    // Group by date format depending on time range
    filteredReports.forEach(report => {
      const date = new Date(report.date);
      let dateKey;
      
      if (timeRange === 'week') {
        // For week view, group by day
        dateKey = date.toLocaleDateString(undefined, { weekday: 'short' });
      } else if (timeRange === 'month') {
        // For month view, group by day of month
        dateKey = date.getDate().toString();
      } else if (timeRange === 'year') {
        // For year view, group by month
        dateKey = date.toLocaleDateString(undefined, { month: 'short' });
      }
      
      dateCount[dateKey] = (dateCount[dateKey] || 0) + 1;
    });
    
    // Convert to array for chart
    let dateData = [];
    
    if (timeRange === 'week') {
      // For week, ensure all days of the week are included
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      dateData = days.map(day => ({
        name: day,
        count: dateCount[day] || 0
      }));
    } else if (timeRange === 'month') {
      // For month, ensure all days are included
      for (let i = 1; i <= 31; i++) {
        dateData.push({
          name: i.toString(),
          count: dateCount[i.toString()] || 0
        });
      }
    } else if (timeRange === 'year') {
      // For year, ensure all months are included
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      dateData = months.map(month => ({
        name: month,
        count: dateCount[month] || 0
      }));
    }
    
    setCrimesByDate(dateData);
    
    // Process crimes by location for bar chart
    const locationCount = {};
    crimeReports.forEach(report => {
      // Extract main location part (e.g., "Downtown Mall" from "123 Main Street, Downtown Mall")
      const locationParts = report.location.split(',');
      const mainLocation = locationParts.length > 1 
        ? locationParts[1].trim() 
        : locationParts[0].trim();
      
      locationCount[mainLocation] = (locationCount[mainLocation] || 0) + 1;
    });
    
    // Sort by count and take top 5
    const sortedLocations = Object.entries(locationCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, value]) => ({ name, value }));
    
    setCrimesByLocation(sortedLocations);
    
  }, [crimeReports, timeRange]);
  
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-crime-800 p-2 border border-crime-100 dark:border-crime-700 rounded shadow-sm">
          <p className="text-sm font-medium">{`${label}`}</p>
          <p className="text-sm text-crime-500 dark:text-crime-400">{`Cases: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-crime-800 dark:text-white mb-2">Crime Analytics</h1>
        <p className="text-crime-500 dark:text-crime-400">Visualize crime data and identify patterns</p>
      </div>
      
      {/* Time range selector */}
      <div className="bg-white dark:bg-crime-800 rounded-xl shadow-sm border border-crime-100 dark:border-crime-700 p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Calendar className="w-5 h-5 text-crime-500 dark:text-crime-400 mr-2" />
            <h3 className="text-md font-medium text-crime-800 dark:text-white">Time Range</h3>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setTimeRange('week')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium 
                ${timeRange === 'week' 
                  ? 'bg-primary text-white' 
                  : 'text-crime-600 dark:text-crime-300 hover:bg-crime-100 dark:hover:bg-crime-700'
                }`}
            >
              Week
            </button>
            <button
              onClick={() => setTimeRange('month')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium 
                ${timeRange === 'month' 
                  ? 'bg-primary text-white' 
                  : 'text-crime-600 dark:text-crime-300 hover:bg-crime-100 dark:hover:bg-crime-700'
                }`}
            >
              Month
            </button>
            <button
              onClick={() => setTimeRange('year')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium 
                ${timeRange === 'year' 
                  ? 'bg-primary text-white' 
                  : 'text-crime-600 dark:text-crime-300 hover:bg-crime-100 dark:hover:bg-crime-700'
                }`}
            >
              Year
            </button>
          </div>
        </div>
      </div>
      
      {/* Summary stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white dark:bg-crime-800 rounded-xl shadow-sm border border-crime-100 dark:border-crime-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-md font-medium text-crime-800 dark:text-white">Total Cases</h3>
            <div className="p-2 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              <FileBarChart className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold text-crime-800 dark:text-white mb-1">
            {crimeReports.length}
          </div>
          <p className="text-crime-500 dark:text-crime-400 text-sm">All recorded cases</p>
        </div>
        
        <div className="bg-white dark:bg-crime-800 rounded-xl shadow-sm border border-crime-100 dark:border-crime-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-md font-medium text-crime-800 dark:text-white">Open Cases</h3>
            <div className="p-2 rounded-lg bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400">
              <Sliders className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold text-crime-800 dark:text-white mb-1">
            {crimeReports.filter(report => report.status === 'open').length}
          </div>
          <p className="text-crime-500 dark:text-crime-400 text-sm">Cases needing attention</p>
        </div>
        
        <div className="bg-white dark:bg-crime-800 rounded-xl shadow-sm border border-crime-100 dark:border-crime-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-md font-medium text-crime-800 dark:text-white">Investigating</h3>
            <div className="p-2 rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold text-crime-800 dark:text-white mb-1">
            {crimeReports.filter(report => report.status === 'investigating').length}
          </div>
          <p className="text-crime-500 dark:text-crime-400 text-sm">Cases in progress</p>
        </div>
        
        <div className="bg-white dark:bg-crime-800 rounded-xl shadow-sm border border-crime-100 dark:border-crime-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-md font-medium text-crime-800 dark:text-white">Closed Cases</h3>
            <div className="p-2 rounded-lg bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
              <MapPin className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold text-crime-800 dark:text-white mb-1">
            {crimeReports.filter(report => report.status === 'closed').length}
          </div>
          <p className="text-crime-500 dark:text-crime-400 text-sm">Resolved cases</p>
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Crimes by Date */}
        <div className="bg-white dark:bg-crime-800 rounded-xl shadow-sm border border-crime-100 dark:border-crime-700 p-6">
          <h3 className="text-md font-medium text-crime-800 dark:text-white mb-4">Cases Over Time</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={crimesByDate}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis 
                  dataKey="name" 
                  stroke="#888" 
                  style={{ fontSize: '12px' }} 
                />
                <YAxis 
                  allowDecimals={false} 
                  stroke="#888" 
                  style={{ fontSize: '12px' }} 
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="count"
                  name="Cases"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Crimes by Location */}
        <div className="bg-white dark:bg-crime-800 rounded-xl shadow-sm border border-crime-100 dark:border-crime-700 p-6">
          <h3 className="text-md font-medium text-crime-800 dark:text-white mb-4">Top 5 Crime Locations</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={crimesByLocation}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis 
                  type="number" 
                  stroke="#888" 
                  style={{ fontSize: '12px' }} 
                />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  stroke="#888" 
                  style={{ fontSize: '12px' }} 
                  width={160}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" name="Cases" fill="#8884d8" radius={[0, 4, 4, 0]}>
                  {crimesByLocation.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Crimes by Type */}
        <div className="bg-white dark:bg-crime-800 rounded-xl shadow-sm border border-crime-100 dark:border-crime-700 p-6">
          <h3 className="text-md font-medium text-crime-800 dark:text-white mb-4">Cases by Crime Type</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={crimesByType}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {crimesByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Crimes by Status */}
        <div className="bg-white dark:bg-crime-800 rounded-xl shadow-sm border border-crime-100 dark:border-crime-700 p-6">
          <h3 className="text-md font-medium text-crime-800 dark:text-white mb-4">Cases by Status</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={crimesByStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {crimesByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
