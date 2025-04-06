
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import DashboardCard from '@/components/dashboard/DashboardCard';
import BloodStockTable from '@/components/dashboard/BloodStockTable';
import RequestsTable from '@/components/dashboard/RequestsTable';
import DonationsTable from '@/components/dashboard/DonationsTable';
import { 
  getBloodRequests, 
  getDonationOffers, 
  getBloodStock,
  updateBloodRequestStatus,
  updateDonationOfferStatus 
} from '@/services/dataService';
import { BloodRequest, DonationOffer, BloodStock } from '@/types/models';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [bloodRequests, setBloodRequests] = useState<BloodRequest[]>([]);
  const [donationOffers, setDonationOffers] = useState<DonationOffer[]>([]);
  const [bloodStock, setBloodStock] = useState<BloodStock[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string>('');
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [itemType, setItemType] = useState<'request' | 'donation' | null>(null);
  const [adminResponse, setAdminResponse] = useState<string>('');
  
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = () => {
    const requests = getBloodRequests();
    const donations = getDonationOffers();
    const stock = getBloodStock();
    
    setBloodRequests(requests);
    setDonationOffers(donations);
    setBloodStock(stock);
  };

  const handleApproveRequest = (id: string) => {
    setSelectedItemId(id);
    setActionType('approve');
    setItemType('request');
    setAdminResponse('');
  };

  const handleRejectRequest = (id: string) => {
    setSelectedItemId(id);
    setActionType('reject');
    setItemType('request');
    setAdminResponse('');
  };

  const handleApproveDonation = (id: string) => {
    setSelectedItemId(id);
    setActionType('approve');
    setItemType('donation');
    setAdminResponse('');
  };

  const handleRejectDonation = (id: string) => {
    setSelectedItemId(id);
    setActionType('reject');
    setItemType('donation');
    setAdminResponse('');
  };

  const handleConfirmAction = () => {
    if (itemType === 'request') {
      const status = actionType === 'approve' ? 'approved' : 'rejected';
      const updatedRequest = updateBloodRequestStatus(selectedItemId, status, adminResponse);
      
      if (updatedRequest) {
        setBloodRequests(prev => 
          prev.map(request => request.id === selectedItemId ? updatedRequest : request)
        );
        toast.success(`Blood request ${status} successfully`);
        
        // Update blood stock if approved
        if (status === 'approved') {
          setBloodStock(getBloodStock());
        }
      }
    } else if (itemType === 'donation') {
      const status = actionType === 'approve' ? 'approved' : 'rejected';
      const updatedDonation = updateDonationOfferStatus(selectedItemId, status, adminResponse);
      
      if (updatedDonation) {
        setDonationOffers(prev => 
          prev.map(donation => donation.id === selectedItemId ? updatedDonation : donation)
        );
        toast.success(`Donation offer ${status} successfully`);
        
        // Update blood stock if approved
        if (status === 'approve') {
          setBloodStock(getBloodStock());
        }
      }
    }
    
    closeDialog();
  };

  const closeDialog = () => {
    setSelectedItemId('');
    setActionType(null);
    setItemType(null);
    setAdminResponse('');
  };

  const pendingRequests = bloodRequests.filter(req => req.status === 'pending').length;
  const pendingDonations = donationOffers.filter(don => don.status === 'pending').length;
  
  const totalBloodUnits = bloodStock.reduce((acc, stock) => acc + stock.units, 0);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-600 mb-8">Welcome back, {user?.name}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <DashboardCard
            title="Pending Blood Requests"
            value={pendingRequests}
            description="Requests awaiting your approval"
            className="bg-orange-50 border-orange-200"
          />
          
          <DashboardCard
            title="Pending Donation Offers"
            value={pendingDonations}
            description="Donations awaiting your approval"
            className="bg-blue-50 border-blue-200"
          />
          
          <DashboardCard
            title="Total Blood Units"
            value={totalBloodUnits}
            description="Total units available in blood bank"
            className="bg-green-50 border-green-200"
          />
        </div>
        
        <Tabs defaultValue="blood-stock" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
            <TabsTrigger value="blood-stock">Blood Stock</TabsTrigger>
            <TabsTrigger value="blood-requests">Blood Requests</TabsTrigger>
            <TabsTrigger value="donation-offers">Donation Offers</TabsTrigger>
          </TabsList>
          
          <TabsContent value="blood-stock" className="space-y-4">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Current Blood Stock</h2>
              <BloodStockTable stockData={bloodStock} />
            </div>
          </TabsContent>
          
          <TabsContent value="blood-requests" className="space-y-4">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Blood Requests</h2>
              <RequestsTable 
                requests={bloodRequests} 
                isAdmin={true}
                onApprove={handleApproveRequest}
                onReject={handleRejectRequest}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="donation-offers" className="space-y-4">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Donation Offers</h2>
              <DonationsTable 
                donations={donationOffers} 
                isAdmin={true}
                onApprove={handleApproveDonation}
                onReject={handleRejectDonation}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Action Confirmation Dialog */}
      <Dialog open={!!actionType} onOpenChange={closeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'approve' ? 'Approve' : 'Reject'} {itemType === 'request' ? 'Blood Request' : 'Donation Offer'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="adminResponse">Response Message</Label>
              <Input
                id="adminResponse"
                placeholder={actionType === 'approve' 
                  ? "Enter any additional instructions or notes" 
                  : "Please provide a reason for rejection"
                }
                value={adminResponse}
                onChange={(e) => setAdminResponse(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>Cancel</Button>
            <Button 
              onClick={handleConfirmAction}
              className={actionType === 'approve' ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
            >
              Confirm {actionType === 'approve' ? 'Approval' : 'Rejection'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default AdminDashboard;
