
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FilePlus2, Calendar, MapPin, User, FileText, Send } from 'lucide-react';
import { useCrimeStore } from '@/store/crimeStore';
import { toast } from 'sonner';

const CrimeReportForm = () => {
  const navigate = useNavigate();
  const { addCrimeReport } = useCrimeStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    victimName: '',
    victimContact: '',
    crimeType: 'theft', // Default value
    status: 'open', // Default status
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title || !formData.description || !formData.date || !formData.location) {
      toast.error('Please fill all required fields');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Add the current timestamp and a unique ID
      const newReport = {
        ...formData,
        id: `CR-${Date.now()}`,
        reportedBy: JSON.parse(localStorage.getItem('user')),
        reportedAt: new Date().toISOString(),
        assignedTo: null,
        updates: []
      };
      
      // Save to store
      addCrimeReport(newReport);
      
      toast.success('Crime report submitted successfully');
      navigate('/dashboard/cases');
    } catch (error) {
      console.error('Error submitting report:', error);
      toast.error('Failed to submit report');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-6 flex items-center">
        <div className="p-2 rounded-lg bg-primary/10 text-primary mr-3">
          <FilePlus2 className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-semibold text-crime-800 dark:text-white">New Crime Report</h2>
      </div>
      
      <div className="bg-white dark:bg-crime-800 rounded-xl shadow-sm border border-crime-100 dark:border-crime-700 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-md font-medium text-crime-700 dark:text-crime-300 pb-2 border-b border-crime-100 dark:border-crime-700">
              Basic Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-crime-700 dark:text-crime-300 mb-1">
                  Case Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Brief title of the incident"
                  className="input-field"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="crimeType" className="block text-sm font-medium text-crime-700 dark:text-crime-300 mb-1">
                  Crime Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="crimeType"
                  name="crimeType"
                  value={formData.crimeType}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value="theft">Theft</option>
                  <option value="assault">Assault</option>
                  <option value="burglary">Burglary</option>
                  <option value="fraud">Fraud</option>
                  <option value="vandalism">Vandalism</option>
                  <option value="homicide">Homicide</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-crime-700 dark:text-crime-300 mb-1">
                  Date of Incident <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="input-field pl-10"
                    required
                  />
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-crime-500 dark:text-crime-400" />
                </div>
              </div>
              
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-crime-700 dark:text-crime-300 mb-1">
                  Location <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="location"
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Address where incident occurred"
                    className="input-field pl-10"
                    required
                  />
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-crime-500 dark:text-crime-400" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Victim Information */}
          <div className="space-y-4">
            <h3 className="text-md font-medium text-crime-700 dark:text-crime-300 pb-2 border-b border-crime-100 dark:border-crime-700">
              Victim Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="victimName" className="block text-sm font-medium text-crime-700 dark:text-crime-300 mb-1">
                  Victim Name
                </label>
                <div className="relative">
                  <input
                    id="victimName"
                    name="victimName"
                    type="text"
                    value={formData.victimName}
                    onChange={handleChange}
                    placeholder="Full name of the victim"
                    className="input-field pl-10"
                  />
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-crime-500 dark:text-crime-400" />
                </div>
              </div>
              
              <div>
                <label htmlFor="victimContact" className="block text-sm font-medium text-crime-700 dark:text-crime-300 mb-1">
                  Victim Contact
                </label>
                <input
                  id="victimContact"
                  name="victimContact"
                  type="text"
                  value={formData.victimContact}
                  onChange={handleChange}
                  placeholder="Phone or email"
                  className="input-field"
                />
              </div>
            </div>
          </div>
          
          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-crime-700 dark:text-crime-300 mb-1">
              Incident Description <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                placeholder="Provide a detailed description of the incident including what happened, any witnesses, and other relevant details..."
                className="input-field pl-10"
                required
              />
              <FileText className="absolute left-3 top-6 w-4 h-4 text-crime-500 dark:text-crime-400" />
            </div>
          </div>
          
          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="btn-outline mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex items-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit Report
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CrimeReportForm;
