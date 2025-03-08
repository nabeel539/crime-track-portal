
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, MapPin, Calendar, Clock, Edit, Tag, UserCheck, MessageSquarePlus, FileCheck } from 'lucide-react';
import { useCrimeStore } from '@/store/crimeStore';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';

const CaseDetail = () => {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const { getCrimeReport, addCaseUpdate, assignCase, changeStatus } = useCrimeStore();
  const { user } = useAuthStore();
  
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updateText, setUpdateText] = useState('');
  const [sendingUpdate, setSendingUpdate] = useState(false);
  
  // Check if user is officer, investigator or admin
  const isOfficer = user?.role === 'officer';
  const isInvestigator = user?.role === 'investigator';
  const isAdmin = user?.role === 'admin';
  
  // Load case data
  useEffect(() => {
    try {
      const reportData = getCrimeReport(caseId);
      if (reportData) {
        setCaseData(reportData);
      } else {
        toast.error('Case not found');
        navigate('/dashboard/cases');
      }
    } catch (error) {
      console.error('Error loading case:', error);
      toast.error('Error loading case data');
    } finally {
      setLoading(false);
    }
  }, [caseId, getCrimeReport, navigate]);
  
  // Handle case assignment
  const handleAssignCase = () => {
    assignCase(caseId, {
      id: user.id,
      name: user.name,
      role: user.role
    });
    
    // Update local state
    setCaseData({
      ...caseData,
      assignedTo: {
        id: user.id,
        name: user.name,
        role: user.role
      },
      status: 'investigating'
    });
  };
  
  // Handle status change
  const handleStatusChange = (newStatus) => {
    changeStatus(caseId, newStatus);
    
    // Update local state
    setCaseData({
      ...caseData,
      status: newStatus
    });
  };
  
  // Handle adding a case update
  const handleAddUpdate = () => {
    if (!updateText.trim()) {
      toast.error('Update text cannot be empty');
      return;
    }
    
    setSendingUpdate(true);
    
    try {
      const update = {
        id: `UPD-${Date.now()}`,
        text: updateText,
        timestamp: new Date().toISOString(),
        createdBy: {
          id: user.id,
          name: user.name,
          role: user.role
        }
      };
      
      addCaseUpdate(caseId, update);
      
      // Update local state
      setCaseData({
        ...caseData,
        updates: [...caseData.updates, update]
      });
      
      // Clear input
      setUpdateText('');
    } catch (error) {
      console.error('Error adding update:', error);
      toast.error('Failed to add update');
    } finally {
      setSendingUpdate(false);
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Format timestamp for display
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <div className="w-8 h-8 border-4 border-crime-200 border-t-crime-500 rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!caseData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-crime-800 dark:text-white mb-2">Case Not Found</h2>
          <p className="text-crime-500 dark:text-crime-400 mb-4">The case you are looking for does not exist or has been removed.</p>
          <button 
            onClick={() => navigate('/dashboard/cases')}
            className="btn-primary"
          >
            Back to Cases
          </button>
        </div>
      </div>
    );
  }
  
  // Determine if user can update case
  const canUpdateCase = isAdmin || isInvestigator || (isOfficer && !caseData.assignedTo);
  
  // Determine if user can change status
  const canChangeStatus = isAdmin || (isInvestigator && caseData.assignedTo?.id === user.id);
  
  // Determine if user can assign case
  const canAssignCase = (isInvestigator && !caseData.assignedTo) || isAdmin;
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with navigation */}
      <div className="mb-6">
        <button 
          onClick={() => navigate('/dashboard/cases')}
          className="flex items-center text-crime-500 dark:text-crime-400 hover:text-crime-700 dark:hover:text-crime-200 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Cases
        </button>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-crime-800 dark:text-white mb-2">{caseData.title}</h1>
            <div className="flex items-center text-crime-500 dark:text-crime-400 text-sm mb-2">
              <Tag className="w-4 h-4 mr-1" />
              <span className="capitalize mr-4">{caseData.crimeType}</span>
              
              <Clock className="w-4 h-4 mr-1 ml-2" />
              <span>Reported on {formatDate(caseData.reportedAt)}</span>
            </div>
          </div>
          
          <div className="flex items-center mt-4 md:mt-0 space-x-2">
            {/* Status indicator and controls */}
            <div className="relative group">
              <div className={`
                px-3 py-1.5 rounded-lg flex items-center text-sm font-medium
                ${caseData.status === 'open' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500' : ''}
                ${caseData.status === 'investigating' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500' : ''}
                ${caseData.status === 'closed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500' : ''}
              `}>
                <span className="capitalize">{caseData.status}</span>
                {canChangeStatus && <Edit className="w-3 h-3 ml-1.5" />}
              </div>
              
              {/* Status dropdown for authorized users */}
              {canChangeStatus && (
                <div className="absolute right-0 mt-1 w-32 bg-white dark:bg-crime-800 rounded-md shadow-lg overflow-hidden z-20 border border-crime-100 dark:border-crime-700 hidden group-hover:block">
                  <div className="py-1">
                    <button 
                      onClick={() => handleStatusChange('open')}
                      className="block w-full text-left px-4 py-2 text-sm text-crime-700 dark:text-crime-300 hover:bg-crime-100 dark:hover:bg-crime-700"
                    >
                      Open
                    </button>
                    <button 
                      onClick={() => handleStatusChange('investigating')}
                      className="block w-full text-left px-4 py-2 text-sm text-crime-700 dark:text-crime-300 hover:bg-crime-100 dark:hover:bg-crime-700"
                    >
                      Investigating
                    </button>
                    <button 
                      onClick={() => handleStatusChange('closed')}
                      className="block w-full text-left px-4 py-2 text-sm text-crime-700 dark:text-crime-300 hover:bg-crime-100 dark:hover:bg-crime-700"
                    >
                      Closed
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Case assignment */}
            {!caseData.assignedTo && canAssignCase && (
              <button 
                onClick={handleAssignCase}
                className="btn-outline flex items-center text-sm"
              >
                <UserCheck className="w-4 h-4 mr-1.5" />
                Assign to me
              </button>
            )}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column - Case details */}
        <div className="md:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white dark:bg-crime-800 rounded-xl shadow-sm border border-crime-100 dark:border-crime-700 p-6">
            <h2 className="text-lg font-semibold text-crime-800 dark:text-white mb-4">Case Information</h2>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <Calendar className="w-5 h-5 text-crime-500 dark:text-crime-400 mr-3 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-crime-700 dark:text-crime-300">Incident Date</div>
                  <div className="text-crime-800 dark:text-white">{formatDate(caseData.date)}</div>
                </div>
              </div>
              
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-crime-500 dark:text-crime-400 mr-3 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-crime-700 dark:text-crime-300">Location</div>
                  <div className="text-crime-800 dark:text-white">{caseData.location}</div>
                </div>
              </div>
              
              {(caseData.victimName || caseData.victimContact) && (
                <div className="flex items-start">
                  <User className="w-5 h-5 text-crime-500 dark:text-crime-400 mr-3 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-crime-700 dark:text-crime-300">Victim Information</div>
                    {caseData.victimName && <div className="text-crime-800 dark:text-white">{caseData.victimName}</div>}
                    {caseData.victimContact && <div className="text-crime-500 dark:text-crime-400 text-sm">{caseData.victimContact}</div>}
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-6 pt-6 border-t border-crime-100 dark:border-crime-700">
              <h3 className="text-md font-medium text-crime-800 dark:text-white mb-3">Description</h3>
              <p className="text-crime-700 dark:text-crime-300 whitespace-pre-line">
                {caseData.description}
              </p>
            </div>
          </div>
          
          {/* Case Updates */}
          <div className="bg-white dark:bg-crime-800 rounded-xl shadow-sm border border-crime-100 dark:border-crime-700 p-6">
            <h2 className="text-lg font-semibold text-crime-800 dark:text-white mb-4">Case Updates</h2>
            
            {canUpdateCase && (
              <div className="mb-6">
                <div className="relative">
                  <textarea 
                    placeholder="Add a case update..."
                    className="input-field pl-10 h-24"
                    value={updateText}
                    onChange={(e) => setUpdateText(e.target.value)}
                    disabled={sendingUpdate}
                  />
                  <MessageSquarePlus className="absolute left-3 top-3 w-5 h-5 text-crime-500 dark:text-crime-400" />
                </div>
                <div className="mt-2 flex justify-end">
                  <button 
                    className="btn-primary flex items-center"
                    onClick={handleAddUpdate}
                    disabled={!updateText.trim() || sendingUpdate}
                  >
                    {sendingUpdate ? (
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    ) : (
                      <FileCheck className="w-4 h-4 mr-2" />
                    )}
                    Add Update
                  </button>
                </div>
              </div>
            )}
            
            <div className="space-y-4">
              {caseData.updates.length === 0 ? (
                <div className="text-center py-8 text-crime-500 dark:text-crime-400">
                  <p>No updates yet</p>
                </div>
              ) : (
                caseData.updates.map((update, index) => (
                  <div 
                    key={update.id}
                    className={`
                      p-4 rounded-lg
                      ${index % 2 === 0 ? 'bg-crime-50 dark:bg-crime-800/50' : 'bg-crime-100/50 dark:bg-crime-700/30'}
                    `}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center mr-2 text-sm">
                          {update.createdBy.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-crime-800 dark:text-white">
                            {update.createdBy.name}
                          </div>
                          <div className="text-xs text-crime-500 dark:text-crime-400 capitalize">
                            {update.createdBy.role}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-crime-500 dark:text-crime-400">
                        {formatTimestamp(update.timestamp)}
                      </div>
                    </div>
                    <p className="text-crime-700 dark:text-crime-300 whitespace-pre-line">
                      {update.text}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        
        {/* Right column - Case sidebar */}
        <div className="space-y-6">
          {/* Case Meta */}
          <div className="bg-white dark:bg-crime-800 rounded-xl shadow-sm border border-crime-100 dark:border-crime-700 p-6">
            <h3 className="text-md font-medium text-crime-800 dark:text-white mb-4">Case Details</h3>
            
            <div className="space-y-4">
              <div>
                <div className="text-sm text-crime-500 dark:text-crime-400 mb-1">Case ID</div>
                <div className="font-medium text-crime-800 dark:text-white">{caseData.id}</div>
              </div>
              
              <div>
                <div className="text-sm text-crime-500 dark:text-crime-400 mb-1">Reported By</div>
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center mr-2 text-xs">
                    {caseData.reportedBy.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium text-crime-800 dark:text-white">
                      {caseData.reportedBy.name}
                    </div>
                    <div className="text-xs text-crime-500 dark:text-crime-400 capitalize">
                      {caseData.reportedBy.role}
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="text-sm text-crime-500 dark:text-crime-400 mb-1">Assigned To</div>
                {caseData.assignedTo ? (
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center mr-2 text-xs">
                      {caseData.assignedTo.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-crime-800 dark:text-white">
                        {caseData.assignedTo.name}
                      </div>
                      <div className="text-xs text-crime-500 dark:text-crime-400 capitalize">
                        {caseData.assignedTo.role}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-crime-500 dark:text-crime-400">Unassigned</div>
                )}
              </div>
              
              <div>
                <div className="text-sm text-crime-500 dark:text-crime-400 mb-1">Report Date</div>
                <div className="font-medium text-crime-800 dark:text-white">
                  {formatDate(caseData.reportedAt)}
                </div>
              </div>
              
              <div>
                <div className="text-sm text-crime-500 dark:text-crime-400 mb-1">Last Updated</div>
                <div className="font-medium text-crime-800 dark:text-white">
                  {caseData.updates.length > 0 
                    ? formatTimestamp(caseData.updates[caseData.updates.length - 1].timestamp)
                    : formatTimestamp(caseData.reportedAt)}
                </div>
              </div>
            </div>
          </div>
          
          {/* Evidence Files (placeholder for Phase 3) */}
          <div className="bg-white dark:bg-crime-800 rounded-xl shadow-sm border border-crime-100 dark:border-crime-700 p-6">
            <h3 className="text-md font-medium text-crime-800 dark:text-white mb-4">Evidence Files</h3>
            <div className="bg-crime-50 dark:bg-crime-700/30 rounded-lg p-6 text-center">
              <p className="text-crime-500 dark:text-crime-400 mb-2">File upload coming in Phase 3</p>
              <p className="text-xs text-crime-400 dark:text-crime-500">
                Evidence file management will be implemented in the next phase of development.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseDetail;
