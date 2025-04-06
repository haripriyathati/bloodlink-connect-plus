
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Header = () => {
  const { isAuthenticated, user, logout, isAdmin, isDonor, isPatient } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <div className="blood-drop"></div>
          <span className="text-bloodred font-bold text-xl ml-1">BloodLink Connect</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-700 hover:text-bloodred">Home</Link>
          <Link to="/about" className="text-gray-700 hover:text-bloodred">About</Link>
          <Link to="/contact" className="text-gray-700 hover:text-bloodred">Contact</Link>
          
          {/* Conditional links based on authentication */}
          {isAuthenticated ? (
            <>
              {isAdmin && (
                <Link to="/admin/dashboard" className="text-gray-700 hover:text-bloodred">Admin Dashboard</Link>
              )}
              
              {isDonor && (
                <Link to="/donor/dashboard" className="text-gray-700 hover:text-bloodred">Donor Dashboard</Link>
              )}
              
              {isPatient && (
                <Link to="/patient/dashboard" className="text-gray-700 hover:text-bloodred">Patient Dashboard</Link>
              )}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="text-bloodred border-bloodred hover:bg-bloodred hover:text-white">
                    {user?.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem 
                    className="cursor-pointer"
                    onClick={() => {
                      if (isAdmin) {
                        window.location.href = '/admin/profile';
                      } else if (isDonor) {
                        window.location.href = '/donor/profile';
                      } else if (isPatient) {
                        window.location.href = '/patient/profile';
                      }
                    }}
                  >
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="cursor-pointer"
                    onClick={logout}
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" className="text-bloodred border-bloodred hover:bg-bloodred hover:text-white">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-bloodred hover:bg-bloodred-dark text-white">
                  Register
                </Button>
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"} />
          </svg>
        </button>
      </div>
      
      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-2 space-y-2">
            <Link to="/" className="block py-2 text-gray-700 hover:text-bloodred" onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>
            <Link to="/about" className="block py-2 text-gray-700 hover:text-bloodred" onClick={() => setMobileMenuOpen(false)}>
              About
            </Link>
            <Link to="/contact" className="block py-2 text-gray-700 hover:text-bloodred" onClick={() => setMobileMenuOpen(false)}>
              Contact
            </Link>
            
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link to="/admin/dashboard" className="block py-2 text-gray-700 hover:text-bloodred" onClick={() => setMobileMenuOpen(false)}>
                    Admin Dashboard
                  </Link>
                )}
                
                {isDonor && (
                  <Link to="/donor/dashboard" className="block py-2 text-gray-700 hover:text-bloodred" onClick={() => setMobileMenuOpen(false)}>
                    Donor Dashboard
                  </Link>
                )}
                
                {isPatient && (
                  <Link to="/patient/dashboard" className="block py-2 text-gray-700 hover:text-bloodred" onClick={() => setMobileMenuOpen(false)}>
                    Patient Dashboard
                  </Link>
                )}
                
                <div className="border-t border-gray-200 my-2"></div>
                
                <Link to={`/${user?.role}/profile`} className="block py-2 text-gray-700 hover:text-bloodred" onClick={() => setMobileMenuOpen(false)}>
                  Profile
                </Link>
                
                <button onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }} className="block w-full text-left py-2 text-gray-700 hover:text-bloodred">
                  Logout
                </button>
              </>
            ) : (
              <>
                <div className="border-t border-gray-200 my-2"></div>
                <Link to="/login" className="block py-2 text-gray-700 hover:text-bloodred" onClick={() => setMobileMenuOpen(false)}>
                  Login
                </Link>
                <Link to="/register" className="block py-2 text-gray-700 hover:text-bloodred" onClick={() => setMobileMenuOpen(false)}>
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
