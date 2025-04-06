
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import DashboardCard from '@/components/dashboard/DashboardCard';
import DonationsTable from '@/components/dashboard/DonationsTable';
import { getDonationOffersByDonorId, createDonationOffer, getBloodStock } from '@/services/dataService';
import { DonationOffer, BloodStock } from '@/types/models';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
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

const DonorDashboard = () => {
  const { user } = useAuth();
  const [donationHistory, setDonationHistory] = useState<DonationOffer[]>([]);
  const [bloodStock, setBloodStock] = useState<BloodStock[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [donationUnits, setDonationUnits] = useState(1);
  
  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = () => {
    if (user) {
      const donations = getDonationOffersByDonorId(user.id);
      const stock = getBloodStock();
      setDonationHistory(donations);
      setBloodStock(stock);
    }
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
          
          <Button 
            className="bg-bloodred hover:bg-bloodred-dark mt-4 md:mt-0"
            onClick={() => setIsDialogOpen(true)}
          >
            Donate Blood
          </Button>
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
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="donation-history">Donation History</TabsTrigger>
            <TabsTrigger value="blood-stock">Blood Stock</TabsTrigger>
          </TabsList>
          
          <TabsContent value="donation-history" className="space-y-4">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Your Donation History</h2>
              <DonationsTable donations={donationHistory} />
            </div>
          </TabsContent>
          
          <TabsContent value="blood-stock" className="space-y-4">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Current Blood Stock</h2>
              <BloodStockTable stockData={bloodStock} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Donation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Donate Blood</DialogTitle>
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
    </Layout>
  );
};

export default DonorDashboard;
