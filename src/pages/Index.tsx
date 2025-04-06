
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { getBloodStock } from '@/services/dataService';
import { useState, useEffect } from 'react';
import { BloodStock } from '@/types/models';

const Index = () => {
  const { isAuthenticated, user } = useAuth();
  const [bloodStock, setBloodStock] = useState<BloodStock[]>([]);
  
  useEffect(() => {
    const fetchBloodStock = () => {
      const stock = getBloodStock();
      setBloodStock(stock);
    };
    
    fetchBloodStock();
  }, []);

  const redirectToDashboard = () => {
    if (user?.role === 'admin') {
      return '/admin/dashboard';
    } else if (user?.role === 'donor') {
      return '/donor/dashboard';
    } else if (user?.role === 'patient') {
      return '/patient/dashboard';
    }
    return '/login';
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-bloodred to-red-700 text-white py-20 px-4">
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
              Donate Blood, Save Lives
            </h1>
            <p className="text-lg md:text-xl mb-8">
              BloodLink Connect connects blood donors with patients in need.
              Join our community and be a lifesaver today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              {isAuthenticated ? (
                <Link to={redirectToDashboard()}>
                  <Button size="lg" className="bg-white text-bloodred hover:bg-gray-100">
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/register">
                    <Button size="lg" className="bg-white text-bloodred hover:bg-gray-100">
                      Register Now
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img 
              src="https://images.unsplash.com/photo-1615461066841-6116e61058f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1760&q=80" 
              alt="Blood Donation" 
              className="max-w-full h-auto rounded-lg shadow-lg"
              style={{ maxHeight: '400px' }}
            />
          </div>
        </div>
      </section>
      
      {/* Blood Availability Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold mb-12 text-center">Blood Availability</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {bloodStock.map((stock) => (
              <div 
                key={stock.bloodGroup}
                className="bg-white rounded-lg shadow-md p-6 text-center border-t-4"
                style={{ borderColor: '#e51937' }}
              >
                <span className="text-4xl font-bold text-bloodred">{stock.bloodGroup}</span>
                <div className="mt-2 text-gray-600">
                  <span className={`text-xl font-semibold ${stock.units < 5 ? 'text-red-600' : 'text-green-600'}`}>
                    {stock.units} units
                  </span>
                  <p className="text-sm mt-1">Available</p>
                </div>
              </div>
            ))}
          </div>
          
          {!isAuthenticated && (
            <div className="text-center mt-12">
              <p className="text-lg mb-4">Need blood urgently? Register as a patient to request blood.</p>
              <Link to="/register">
                <Button className="bg-bloodred hover:bg-bloodred-dark text-white">
                  Register as Patient
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold mb-12 text-center">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-bloodred font-bold text-3xl">1</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Register</h3>
              <p className="text-gray-600">
                Create an account as a donor or a patient in just a few steps.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-bloodred font-bold text-3xl">2</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Connect</h3>
              <p className="text-gray-600">
                Donate blood or request blood based on your needs. Our system will find the best matches.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-bloodred font-bold text-3xl">3</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Save Lives</h3>
              <p className="text-gray-600">
                Your donation can save up to three lives. Be a hero in someone's story.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Facts Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold mb-12 text-center">Blood Donation Facts</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-3xl font-bold text-bloodred mb-2">3 Lives</h3>
              <p className="text-gray-600">Every donation can save up to 3 lives</p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-3xl font-bold text-bloodred mb-2">1.2 Million</h3>
              <p className="text-gray-600">Units of blood needed every year</p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-3xl font-bold text-bloodred mb-2">30 Minutes</h3>
              <p className="text-gray-600">Average time it takes to donate blood</p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-3xl font-bold text-bloodred mb-2">56 Days</h3>
              <p className="text-gray-600">You can donate whole blood every 56 days</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 px-4 bg-bloodred text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl mb-8">Join our community of donors and help save lives today.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {isAuthenticated ? (
              <Link to={redirectToDashboard()}>
                <Button size="lg" className="bg-white text-bloodred hover:bg-gray-100">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/register">
                  <Button size="lg" className="bg-white text-bloodred hover:bg-gray-100">
                    Register as Donor
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
