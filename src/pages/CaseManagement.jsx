
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter, Plus, Search, FileSpreadsheet, RefreshCw } from 'lucide-react';
import { useCrimeStore } from '@/store/crimeStore';
import { useAuthStore } from '@/store/authStore';
import CaseList from '@/components/crime/CaseList';

const CaseManagement = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { filterCrimeReports } = useCrimeStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [crimeTypeFilter, setCrimeTypeFilter] = useState('');
  const [filteredCases, setFilteredCases] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  
  const isOfficer = user?.role === 'officer';
  const isInvestigator = user?.role === 'investigator';
  const isAdmin = user?.role === 'admin';
  
  // Apply filters
  useEffect(() => {
    const filters = {
      search: searchTerm,
      status: statusFilter,
      crimeType: crimeTypeFilter,
      dateFrom,
      dateTo
    };
    
    const results = filterCrimeReports(filters);
    setFilteredCases(results);
  }, [searchTerm, statusFilter, crimeTypeFilter, dateFrom, dateTo, filterCrimeReports]);
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setCrimeTypeFilter('');
    setDateFrom('');
    setDateTo('');
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-crime-800 dark:text-white mb-2">Case Management</h1>
          <p className="text-crime-500 dark:text-crime-400">View, filter, and manage crime reports</p>
        </div>
        
        {isOfficer && (
          <button 
            onClick={() => navigate('/dashboard/report-crime')}
            className="btn-primary flex items-center mt-4 md:mt-0"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Report
          </button>
        )}
      </div>
      
      <div className="bg-white dark:bg-crime-800 rounded-xl shadow-sm border border-crime-100 dark:border-crime-700 mb-6">
        <div className="p-4 border-b border-crime-100 dark:border-crime-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="relative w-full md:w-auto md:flex-grow max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-crime-500 dark:text-crime-400" />
            <input
              type="text"
              placeholder="Search cases..."
              className="input-field pl-10"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`btn-outline flex items-center ${isFilterOpen ? 'bg-crime-100 dark:bg-crime-700' : ''}`}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </button>
            
            <button 
              onClick={resetFilters}
              className="btn-outline flex items-center"
              title="Reset filters"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            
            <button 
              className="btn-outline flex items-center"
              title="Export to CSV"
            >
              <FileSpreadsheet className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {isFilterOpen && (
          <div className="p-4 border-b border-crime-100 dark:border-crime-700 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-crime-700 dark:text-crime-300 mb-1 block">
                Status
              </label>
              <select 
                className="input-field"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="open">Open</option>
                <option value="investigating">Investigating</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            
            <div>
              <label className="text-sm font-medium text-crime-700 dark:text-crime-300 mb-1 block">
                Crime Type
              </label>
              <select 
                className="input-field"
                value={crimeTypeFilter}
                onChange={(e) => setCrimeTypeFilter(e.target.value)}
              >
                <option value="">All Types</option>
                <option value="theft">Theft</option>
                <option value="assault">Assault</option>
                <option value="burglary">Burglary</option>
                <option value="fraud">Fraud</option>
                <option value="vandalism">Vandalism</option>
                <option value="homicide">Homicide</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="text-sm font-medium text-crime-700 dark:text-crime-300 mb-1 block">
                From Date
              </label>
              <input 
                type="date" 
                className="input-field"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-crime-700 dark:text-crime-300 mb-1 block">
                To Date
              </label>
              <input 
                type="date" 
                className="input-field"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
          </div>
        )}
        
        <CaseList cases={filteredCases} />
      </div>
    </div>
  );
};

export default CaseManagement;
