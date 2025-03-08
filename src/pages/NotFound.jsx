
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import Navbar from "@/components/layout/Navbar";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-crime-50 dark:bg-crime-900 flex flex-col">
      <Navbar />
      
      <div className="flex-grow container mx-auto px-4 flex items-center justify-center">
        <div className="text-center max-w-md animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
            <AlertTriangle className="w-8 h-8" />
          </div>
          
          <h1 className="text-5xl font-bold mb-4 text-crime-800 dark:text-white">404</h1>
          <p className="text-xl text-crime-600 dark:text-crime-300 mb-8">
            The page you are looking for could not be found.
          </p>
          
          <Link 
            to="/" 
            className="btn-primary inline-flex items-center gap-2 px-6 py-3"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
