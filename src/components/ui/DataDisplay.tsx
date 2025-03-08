
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Filter, Search, X } from 'lucide-react';

interface Column<T> {
  header: string;
  accessor: keyof T;
  render?: (value: any, item: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataDisplayProps<T> {
  data: T[];
  columns: Column<T>[];
  title?: string;
  description?: string;
  showFilters?: boolean;
  showSearch?: boolean;
  itemsPerPage?: number;
  emptyMessage?: string;
}

function DataDisplay<T extends { id: string | number }>({
  data,
  columns,
  title,
  description,
  showFilters = true,
  showSearch = true,
  itemsPerPage = 10,
  emptyMessage = "No data to display"
}: DataDisplayProps<T>) {
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  
  // State for sorting
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | null;
    direction: 'asc' | 'desc' | null;
  }>({
    key: null,
    direction: null,
  });
  
  // State for search
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for filters (simplified for POC)
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Handle sorting
  const handleSort = (key: keyof T) => {
    let direction: 'asc' | 'desc' | null = 'asc';
    
    if (sortConfig.key === key) {
      if (sortConfig.direction === 'asc') {
        direction = 'desc';
      } else if (sortConfig.direction === 'desc') {
        direction = null;
      }
    }
    
    setSortConfig({ key, direction });
  };
  
  // Filter and sort data
  let filteredData = [...data];
  
  // Apply search filter
  if (searchTerm) {
    filteredData = filteredData.filter((item) => {
      return columns.some((column) => {
        const value = item[column.accessor];
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(searchTerm.toLowerCase());
      });
    });
  }
  
  // Apply sorting
  if (sortConfig.key && sortConfig.direction) {
    filteredData.sort((a, b) => {
      const aValue = a[sortConfig.key as keyof T];
      const bValue = b[sortConfig.key as keyof T];
      
      if (aValue === bValue) return 0;
      
      // Handle different types
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      // For numbers, dates, etc.
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return sortConfig.direction === 'asc' ? -1 : 1;
    });
  }
  
  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);
  
  // Page navigation
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };
  
  // Clear search
  const clearSearch = () => {
    setSearchTerm('');
  };
  
  return (
    <div className="w-full glass-panel overflow-hidden flex flex-col">
      {/* Header with title, search and filters */}
      <div className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between border-b border-crime-100 dark:border-crime-800/50">
        <div className="mb-4 sm:mb-0">
          {title && <h2 className="text-xl font-semibold text-crime-800 dark:text-white">{title}</h2>}
          {description && <p className="text-sm text-crime-500 dark:text-crime-400">{description}</p>}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {showSearch && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-crime-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-9 py-2 text-sm rounded-lg border border-crime-200 dark:border-crime-700 bg-white dark:bg-crime-800 text-crime-800 dark:text-crime-100 focus:outline-none focus:ring-2 focus:ring-primary/30 w-full"
              />
              {searchTerm && (
                <button 
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="w-4 h-4 text-crime-400 hover:text-crime-600 transition-colors" />
                </button>
              )}
            </div>
          )}
          
          {showFilters && (
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`px-3 py-2 rounded-lg border text-sm font-medium inline-flex items-center gap-1.5 transition-colors
                ${isFilterOpen 
                  ? 'bg-primary/10 border-primary/20 text-primary' 
                  : 'border-crime-200 dark:border-crime-700 bg-white dark:bg-crime-800 text-crime-600 dark:text-crime-300 hover:bg-crime-50 dark:hover:bg-crime-700'}`}
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          )}
        </div>
      </div>
      
      {/* Filters panel (simplified for POC) */}
      {isFilterOpen && (
        <div className="p-4 border-b border-crime-100 dark:border-crime-800/50 bg-crime-50/50 dark:bg-crime-800/30">
          <div className="text-sm text-crime-500 dark:text-crime-400">
            Filter panel would go here (simplified for POC)
          </div>
        </div>
      )}
      
      {/* Table */}
      <div className="overflow-x-auto flex-grow">
        {filteredData.length > 0 ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-crime-50 dark:bg-crime-800/50">
                {columns.map((column, i) => (
                  <th 
                    key={i} 
                    className="px-6 py-3 text-xs font-medium text-crime-500 dark:text-crime-400 uppercase tracking-wider border-b border-crime-100 dark:border-crime-800"
                  >
                    {column.sortable !== false ? (
                      <button
                        className="inline-flex items-center gap-1 hover:text-crime-800 dark:hover:text-white transition-colors"
                        onClick={() => handleSort(column.accessor)}
                      >
                        {column.header}
                        {sortConfig.key === column.accessor && (
                          <span className="text-primary">
                            {sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}
                          </span>
                        )}
                      </button>
                    ) : (
                      column.header
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-crime-100 dark:divide-crime-800">
              {paginatedData.map((item, rowIndex) => (
                <tr 
                  key={item.id.toString()} 
                  className="hover:bg-crime-50/80 dark:hover:bg-crime-800/30 transition-colors"
                >
                  {columns.map((column, colIndex) => (
                    <td key={`${rowIndex}-${colIndex}`} className="px-6 py-4 text-sm text-crime-700 dark:text-crime-300">
                      {column.render 
                        ? column.render(item[column.accessor], item)
                        : item[column.accessor] !== undefined 
                          ? String(item[column.accessor]) 
                          : '—'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex items-center justify-center py-12 text-crime-500 dark:text-crime-400">
            {emptyMessage}
          </div>
        )}
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-crime-100 dark:border-crime-800 flex items-center justify-between">
          <div className="text-sm text-crime-500 dark:text-crime-400">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredData.length)} of {filteredData.length} entries
          </div>
          
          <div className="flex items-center gap-1">
            <button
              onClick={() => goToPage(1)}
              disabled={currentPage === 1}
              className="p-1.5 rounded-md inline-flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-crime-100 dark:hover:bg-crime-800 transition-colors text-crime-500 dark:text-crime-400"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1.5 rounded-md inline-flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-crime-100 dark:hover:bg-crime-800 transition-colors text-crime-500 dark:text-crime-400"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <div className="text-sm text-crime-600 dark:text-crime-300 px-2">
              Page {currentPage} of {totalPages}
            </div>
            
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-md inline-flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-crime-100 dark:hover:bg-crime-800 transition-colors text-crime-500 dark:text-crime-400"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => goToPage(totalPages)}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-md inline-flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-crime-100 dark:hover:bg-crime-800 transition-colors text-crime-500 dark:text-crime-400"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataDisplay;
