
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import DashboardCard from '@/components/dashboard/DashboardCard';
import DonationsTable from '@/components/dashboard/DonationsTable';
import { 
  getDonationOffersByDonorId, 
  createDonationOffer, 
  getBloodStock,
  getDonorsInSameCity
} from '@/services/dataService';
import { DonationOffer, BloodStock, User } from '@/types/models';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import BloodStockTable from '@/components/dashboard/BloodStockTable';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import DonorEligibilityQuestionnaire from '@/components/donor/DonorEligibilityQuestionnaire';
import DonationSlotBooking from '@/components/donor/DonationSlotBooking';
import { Bell } from 'lucide-react';
import { 
  checkForDonationEligibilityNotification, 
  getUserNotifications,
  Notification,
  markNotificationAsRead
} from '@/services/notificationService';
import { toast } from 'sonner';

const DonorDashboard = () => {
  const { user } = useAuth();
  const [donationHistory, setDonationHistory] = useState<DonationOffer[]>([]);
  const [bloodStock, setBloodStock] = useState<BloodStock[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [donationUnits, setDonationUnits] = useState(1);
  const [localDonors, setLocalDonors] = useState<User[]>([]);
  const [isQuestionnaireOpen, setIsQuestionnaireOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [selectedDonationId, setSelectedDonationId] = useState<string | null>(null);
  const [isSlotBookingOpen, setIsSlotBookingOpen] = useState(false);
  
  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  useEffect(() => {
    // Check for donation eligibility notifications
    if (user) {
      checkForDonationEligibilityNotification(user, donationHistory);
      setNotifications(getUserNotifications(user.id));
    }
  }, [user, donationHistory]);

  const fetchDashboardData = () => {
    if (user) {
      const donations = getDonationOffersByDonorId(user.id);
      const stock = getBloodStock();
      setDonationHistory(donations);
      setBloodStock(stock);

      // Get donors in same city
      const donors = getDonorsInSameCity(user.city);
      setLocalDonors(donors.filter(donor => donor.id !== user.id));
    }
  };

  const handleDonateClick = () => {
    setIsQuestionnaireOpen(true);
  };

  const handleEligibilityPassed = () => {
    setIsQuestionnaireOpen(false);
    setIsDialogOpen(true);
  };

  const handleDonationSubmit = () => {
    if (!user) return;
    
    const newDonation = createDonationOffer({
      donorId: user.id,
      donorName: user.name,
      bloodGroup: user.bloodGroup,
      units: donationUnits,
      address: user.address,
      city: user.city,
      state: user.state,
      mobile: user.mobile
    });
    
    setDonationHistory([newDonation, ...donationHistory]);
    setIsDialogOpen(false);
    setDonationUnits(1);
  };

  const handleNotificationClick = (notificationId: string) => {
    markNotificationAsRead(notificationId);
    setNotifications(prevNotifications => 
      prevNotifications.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
  };

  const handleBookSlot = (donationId: string) => {
    setSelectedDonationId(donationId);
    setIsSlotBookingOpen(true);
  };

  const handleSlotBookingClose = () => {
    setIsSlotBookingOpen(false);
    setSelectedDonationId(null);
    // Refresh donation history to reflect changes
    if (user) {
      const donations = getDonationOffersByDonorId(user.id);
      setDonationHistory(donations);
    }
  };

  const unreadNotifications = notifications.filter(n => !n.read).length;

  const totalDonations = donationHistory.filter(don => don.status === 'approved').length;
  const pendingDonations = donationHistory.filter(don => don.status === 'pending').length;
  const rejectedDonations = donationHistory.filter(don => don.status === 'rejected').length;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Donor Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.name}</p>
          </div>
          
          <div className="flex items-center mt-4 md:mt-0 space-x-4">
            <div className="relative">
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative"
              >
                <Bell className="h-5 w-5" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-bloodred text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                )}
              </Button>
              
              {isNotificationsOpen && notifications.length > 0 && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-10 max-h-96 overflow-y-auto">
                  <div className="p-2 border-b border-gray-200">
                    <h3 className="font-semibold">Notifications</h3>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {notifications.map(notification => (
                      <div 
                        key={notification.id}
                        className={`p-3 hover:bg-gray-50 cursor-pointer ${!notification.read ? 'bg-blue-50' : ''}`}
                        onClick={() => handleNotificationClick(notification.id)}
                      >
                        <p className="text-sm font-medium">{notification.message}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <Button 
              className="bg-bloodred hover:bg-bloodred-dark"
              onClick={handleDonateClick}
            >
              Donate Blood
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <DashboardCard
            title="Total Donations"
            value={totalDonations}
            description="Completed donations"
            className="bg-green-50 border-green-200"
          />
          
          <DashboardCard
            title="Pending Donations"
            value={pendingDonations}
            description="Awaiting approval"
            className="bg-yellow-50 border-yellow-200"
          />
          
          <DashboardCard
            title="Rejected Donations"
            value={rejectedDonations}
            description="Not approved"
            className="bg-red-50 border-red-200"
          />
        </div>
        
        <Tabs defaultValue="donation-history" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
            <TabsTrigger value="donation-history">Donation History</TabsTrigger>
            <TabsTrigger value="blood-stock">Blood Stock</TabsTrigger>
            <TabsTrigger value="local-donors">Local Donors</TabsTrigger>
          </TabsList>
          
          <TabsContent value="donation-history" className="space-y-4">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Your Donation History</h2>
              <DonationsTable 
                donations={donationHistory} 
                onBookSlot={handleBookSlot}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="blood-stock" className="space-y-4">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Current Blood Stock</h2>
              <BloodStockTable stockData={bloodStock} />
            </div>
          </TabsContent>

          <TabsContent value="local-donors" className="space-y-4">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Donors in {user?.city}</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="py-3 text-left">Name</th>
                      <th className="py-3 text-left">Blood Group</th>
                      <th className="py-3 text-left">Mobile</th>
                    </tr>
                  </thead>
                  <tbody>
                    {localDonors.length > 0 ? (
                      localDonors.map((donor) => (
                        <tr key={donor.id} className="border-b">
                          <td className="py-3">{donor.name}</td>
                          <td className="py-3">{donor.bloodGroup}</td>
                          <td className="py-3">{donor.mobile}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="py-3 text-center">No other donors in your city</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Eligibility Questionnaire */}
      <DonorEligibilityQuestionnaire 
        isOpen={isQuestionnaireOpen}
        onClose={() => setIsQuestionnaireOpen(false)}
        onEligible={handleEligibilityPassed}
      />
      
      {/* Donation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Donate Blood</DialogTitle>
            <DialogDescription>
              Fill in the details below to submit your blood donation offer.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <div className="space-y-2">
                <Label htmlFor="bloodGroup">Blood Group</Label>
                <Input
                  id="bloodGroup"
                  value={user?.bloodGroup || ''}
                  disabled
                />
              </div>
            </div>
            
            <div>
              <div className="space-y-2">
                <Label htmlFor="units">Units to Donate</Label>
                <Input
                  id="units"
                  type="number"
                  min="1"
                  max="3"
                  value={donationUnits}
                  onChange={(e) => setDonationUnits(parseInt(e.target.value) || 1)}
                />
                <p className="text-xs text-gray-500">Maximum 3 units allowed per donation</p>
              </div>
            </div>
            
            <div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={user?.address || ''}
                  disabled
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={user?.city || ''}
                  disabled
                />
              </div>
              
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={user?.state || ''}
                  disabled
                />
              </div>
            </div>
            
            <div>
              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile</Label>
                <Input
                  id="mobile"
                  value={user?.mobile || ''}
                  disabled
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button 
              className="bg-bloodred hover:bg-bloodred-dark"
              onClick={handleDonationSubmit}
            >
              Submit Donation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Slot Booking Dialog */}
      {selectedDonationId && (
        <DonationSlotBooking
          isOpen={isSlotBookingOpen}
          onClose={handleSlotBookingClose}
          donationId={selectedDonationId}
        />
      )}
    </Layout>
  );
};

export default DonorDashboard;
