
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';

// Sample crime data for demo purposes
const sampleCrimeData = [
  {
    id: 'CR-1698245121000',
    title: 'Shoplifting at Downtown Mall',
    description: 'Store owner reported theft of merchandise valued at approximately $350. Security camera footage shows suspect concealing items in a backpack.',
    date: '2023-10-15',
    location: '123 Main Street, Downtown Mall',
    victimName: 'City Electronics Store',
    victimContact: '555-123-4567',
    crimeType: 'theft',
    status: 'open',
    reportedBy: {
      id: '1',
      name: 'John Officer',
      role: 'officer'
    },
    reportedAt: '2023-10-25T14:32:01.000Z',
    assignedTo: null,
    updates: []
  },
  {
    id: 'CR-1698159821000',
    title: 'Vehicle Break-in at West Side Parking',
    description: 'Victim reports their parked car was broken into overnight. Window was smashed and personal items including a laptop and wallet were stolen.',
    date: '2023-10-22',
    location: 'West Side Parking Garage, 456 Park Avenue',
    victimName: 'Michael Johnson',
    victimContact: '555-234-5678',
    crimeType: 'theft',
    status: 'investigating',
    reportedBy: {
      id: '1',
      name: 'John Officer',
      role: 'officer'
    },
    reportedAt: '2023-10-24T11:23:41.000Z',
    assignedTo: {
      id: '2',
      name: 'Jane Investigator',
      role: 'investigator'
    },
    updates: [
      {
        id: 'UPD-1698162821000',
        text: 'Obtained parking garage CCTV footage for review.',
        timestamp: '2023-10-24T14:20:21.000Z',
        createdBy: {
          id: '2',
          name: 'Jane Investigator',
          role: 'investigator'
        }
      }
    ]
  },
  {
    id: 'CR-1697986021000',
    title: 'Vandalism at Community Park',
    description: 'Park facilities including playground equipment and several benches were vandalized with graffiti overnight.',
    date: '2023-10-21',
    location: 'Riverside Community Park, 789 River Road',
    victimName: 'City Parks Department',
    victimContact: '555-345-6789',
    crimeType: 'vandalism',
    status: 'closed',
    reportedBy: {
      id: '1',
      name: 'John Officer',
      role: 'officer'
    },
    reportedAt: '2023-10-22T11:27:01.000Z',
    assignedTo: {
      id: '2',
      name: 'Jane Investigator',
      role: 'investigator'
    },
    updates: [
      {
        id: 'UPD-1698072421000',
        text: 'Interviewed nearby residents. One witness reports seeing group of teenagers in the park around midnight.',
        timestamp: '2023-10-23T11:27:01.000Z',
        createdBy: {
          id: '2',
          name: 'Jane Investigator',
          role: 'investigator'
        }
      },
      {
        id: 'UPD-1698158941000',
        text: 'Case closed. Perpetrators identified through park security cameras. Restitution arranged through juvenile justice program.',
        timestamp: '2023-10-24T11:09:01.000Z',
        createdBy: {
          id: '2',
          name: 'Jane Investigator',
          role: 'investigator'
        }
      }
    ]
  },
  {
    id: 'CR-1693312821000',
    title: 'Residential Burglary',
    description: 'Homeowner returned from vacation to find back door forced open and valuables missing including jewelry and electronics.',
    date: '2023-08-29',
    location: '567 Oak Street',
    victimName: 'Sarah Williams',
    victimContact: '555-456-7890',
    crimeType: 'burglary',
    status: 'closed',
    reportedBy: {
      id: '1',
      name: 'John Officer',
      role: 'officer'
    },
    reportedAt: '2023-08-29T10:47:01.000Z',
    assignedTo: {
      id: '2',
      name: 'Jane Investigator',
      role: 'investigator'
    },
    updates: [
      {
        id: 'UPD-1693399221000',
        text: 'Fingerprints collected from point of entry. Items listed for pawn shop alerts.',
        timestamp: '2023-08-30T10:47:01.000Z',
        createdBy: {
          id: '2',
          name: 'Jane Investigator',
          role: 'investigator'
        }
      },
      {
        id: 'UPD-1695472821000',
        text: 'Matching prints found in system. Suspect in custody on separate charges.',
        timestamp: '2023-09-23T10:47:01.000Z',
        createdBy: {
          id: '2',
          name: 'Jane Investigator',
          role: 'investigator'
        }
      },
      {
        id: 'UPD-1695559221000',
        text: 'Some stolen items recovered during execution of search warrant. Case closed with arrest.',
        timestamp: '2023-09-24T10:47:01.000Z',
        createdBy: {
          id: '2',
          name: 'Jane Investigator',
          role: 'investigator'
        }
      }
    ]
  }
];

export const useCrimeStore = create(
  persist(
    (set, get) => ({
      crimeReports: [...sampleCrimeData],
      isLoading: false,
      error: null,
      
      // Add a new crime report
      addCrimeReport: (report) => {
        set((state) => ({
          crimeReports: [report, ...state.crimeReports]
        }));
        return report;
      },
      
      // Update a crime report
      updateCrimeReport: (reportId, updatedData) => {
        set((state) => ({
          crimeReports: state.crimeReports.map((report) =>
            report.id === reportId
              ? { ...report, ...updatedData }
              : report
          ),
        }));
      },
      
      // Add an update to a case
      addCaseUpdate: (reportId, update) => {
        const { crimeReports } = get();
        const reportIndex = crimeReports.findIndex(report => report.id === reportId);
        
        if (reportIndex === -1) {
          toast.error("Case not found");
          return;
        }
        
        const updatedReports = [...crimeReports];
        const report = { ...updatedReports[reportIndex] };
        
        report.updates = [...report.updates, update];
        updatedReports[reportIndex] = report;
        
        set({ crimeReports: updatedReports });
        toast.success("Case update added");
      },
      
      // Assign a case to an investigator
      assignCase: (reportId, investigator) => {
        set((state) => ({
          crimeReports: state.crimeReports.map((report) =>
            report.id === reportId
              ? { ...report, assignedTo: investigator, status: 'investigating' }
              : report
          ),
        }));
        toast.success(`Case assigned to ${investigator.name}`);
      },
      
      // Change case status
      changeStatus: (reportId, status) => {
        set((state) => ({
          crimeReports: state.crimeReports.map((report) =>
            report.id === reportId
              ? { ...report, status }
              : report
          ),
        }));
        toast.success(`Case status updated to ${status}`);
      },
      
      // Get a specific crime report by ID
      getCrimeReport: (reportId) => {
        const { crimeReports } = get();
        return crimeReports.find(report => report.id === reportId);
      },
      
      // Filter crime reports by various criteria
      filterCrimeReports: (filters) => {
        const { crimeReports } = get();
        
        return crimeReports.filter(report => {
          let match = true;
          
          if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            const searchMatch = 
              report.title.toLowerCase().includes(searchTerm) || 
              report.description.toLowerCase().includes(searchTerm) ||
              report.location.toLowerCase().includes(searchTerm) ||
              report.victimName?.toLowerCase().includes(searchTerm);
            
            if (!searchMatch) match = false;
          }
          
          if (filters.status && report.status !== filters.status) {
            match = false;
          }
          
          if (filters.crimeType && report.crimeType !== filters.crimeType) {
            match = false;
          }
          
          if (filters.dateFrom) {
            const dateFrom = new Date(filters.dateFrom);
            const reportDate = new Date(report.date);
            if (reportDate < dateFrom) match = false;
          }
          
          if (filters.dateTo) {
            const dateTo = new Date(filters.dateTo);
            const reportDate = new Date(report.date);
            if (reportDate > dateTo) match = false;
          }
          
          return match;
        });
      }
    }),
    {
      name: 'crime-store',
    }
  )
);
