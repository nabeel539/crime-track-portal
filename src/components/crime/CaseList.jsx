
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle2, Clock, Tag } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

const CaseList = ({ cases }) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [currentPage, setCurrentPage] = useState(1);
  const casesPerPage = 10;
  
  // Handle pagination
  const indexOfLastCase = currentPage * casesPerPage;
  const indexOfFirstCase = indexOfLastCase - casesPerPage;
  const currentCases = cases.slice(indexOfFirstCase, indexOfLastCase);
  const totalPages = Math.ceil(cases.length / casesPerPage);
  
  // Status badge component
  const StatusBadge = ({ status }) => {
    switch(status) {
      case 'open':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500">
            <AlertCircle className="w-3 h-3 mr-1" />
            Open
          </span>
        );
      case 'investigating':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500">
            <Clock className="w-3 h-3 mr-1" />
            Investigating
          </span>
        );
      case 'closed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Closed
          </span>
        );
      default:
        return null;
    }
  };
  
  // Crime type badge component
  const CrimeTypeBadge = ({ type }) => {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-crime-100 text-crime-800 dark:bg-crime-800 dark:text-crime-300">
        <Tag className="w-3 h-3 mr-1" />
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    );
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Handle clicking on a case
  const handleCaseClick = (caseId) => {
    navigate(`/dashboard/case/${caseId}`);
  };
  
  // Pagination controls
  const changePage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  
  if (cases.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-crime-500 dark:text-crime-400">No cases found matching your criteria.</p>
      </div>
    );
  }
  
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-crime-50 dark:bg-crime-800/50">
            <tr>
              <th className="text-left py-3 px-4 text-xs font-medium text-crime-500 dark:text-crime-400 uppercase tracking-wider">
                Case ID
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-crime-500 dark:text-crime-400 uppercase tracking-wider">
                Title
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-crime-500 dark:text-crime-400 uppercase tracking-wider">
                Date
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-crime-500 dark:text-crime-400 uppercase tracking-wider">
                Type
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-crime-500 dark:text-crime-400 uppercase tracking-wider">
                Status
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-crime-500 dark:text-crime-400 uppercase tracking-wider">
                Assigned To
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-crime-100 dark:divide-crime-700">
            {currentCases.map((crimeCase) => (
              <tr 
                key={crimeCase.id}
                onClick={() => handleCaseClick(crimeCase.id)}
                className="hover:bg-crime-50 dark:hover:bg-crime-800/50 cursor-pointer transition-colors duration-150"
              >
                <td className="py-3 px-4 text-sm text-crime-800 dark:text-crime-300">
                  {crimeCase.id}
                </td>
                <td className="py-3 px-4">
                  <div className="text-sm font-medium text-crime-800 dark:text-white">
                    {crimeCase.title}
                  </div>
                  <div className="text-xs text-crime-500 dark:text-crime-400 truncate max-w-xs">
                    {crimeCase.location}
                  </div>
                </td>
                <td className="py-3 px-4 text-sm text-crime-800 dark:text-crime-300">
                  {formatDate(crimeCase.date)}
                </td>
                <td className="py-3 px-4">
                  <CrimeTypeBadge type={crimeCase.crimeType} />
                </td>
                <td className="py-3 px-4">
                  <StatusBadge status={crimeCase.status} />
                </td>
                <td className="py-3 px-4 text-sm text-crime-800 dark:text-crime-300">
                  {crimeCase.assignedTo ? (
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center mr-2 text-xs">
                        {crimeCase.assignedTo.name.charAt(0)}
                      </div>
                      {crimeCase.assignedTo.name}
                    </div>
                  ) : (
                    <span className="text-crime-500 dark:text-crime-400">Unassigned</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-4 flex justify-between items-center border-t border-crime-100 dark:border-crime-700">
          <div className="text-sm text-crime-500 dark:text-crime-400">
            Showing {indexOfFirstCase + 1}-{Math.min(indexOfLastCase, cases.length)} of {cases.length} cases
          </div>
          <div className="flex space-x-1">
            {currentPage > 1 && (
              <button
                onClick={() => changePage(currentPage - 1)}
                className="px-3 py-1 rounded-md text-sm font-medium text-crime-600 dark:text-crime-300 hover:bg-crime-100 dark:hover:bg-crime-700"
              >
                Previous
              </button>
            )}
            
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => changePage(i + 1)}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  currentPage === i + 1
                    ? 'bg-primary text-white'
                    : 'text-crime-600 dark:text-crime-300 hover:bg-crime-100 dark:hover:bg-crime-700'
                }`}
              >
                {i + 1}
              </button>
            ))}
            
            {currentPage < totalPages && (
              <button
                onClick={() => changePage(currentPage + 1)}
                className="px-3 py-1 rounded-md text-sm font-medium text-crime-600 dark:text-crime-300 hover:bg-crime-100 dark:hover:bg-crime-700"
              >
                Next
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseList;
