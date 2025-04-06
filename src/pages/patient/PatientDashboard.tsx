
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import DashboardCard from '@/components/dashboard/DashboardCard';
import RequestsTable from '@/components/dashboard/RequestsTable';
import { 
  getBloodRequestsByPatientId, 
  createBloodRequest, 
  getBloodStock,
  getDonorsInSameCity 
} from '@/services/dataService';
import { BloodRequest, BloodStock, User, BloodGroup } from '@/types/models';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import BloodStockTable from '@/components/dashboard/BloodStockTable';
import { Card } from '@/components/ui/card';

const PatientDashboard = () => {
  const { user } = useAuth();
  const [requestHistory, setRequestHistory] = useState<BloodRequest[]>([]);
  const [bloodStock, setBloodStock] = useState<BloodStock[]>([]);
  const [localDonors, setLocalDonors] = useState<User[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>(user?.bloodGroup || 'O+');
  const [units, setUnits] = useState(1);
  const [reason, setReason] = useState('');
  
  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = () => {
    if (user) {
      const requests = getBloodRequestsByPatientId(user.id);
      const stock = getBloodStock();
      const donors = getDonorsInSameCity(user.city);
      
      setRequestHistory(requests);
      setBloodStock(stock);
      setLocalDonors(donors);
    }
  };

  const handleRequestSubmit = () => {
    if (!user) return;
    
    const newRequest = createBloodRequest({
      patientId: user.id,
      patientName: user.name,
      bloodGroup,
      units,
      reason,
      address: user.address,
      city: user.city,
      state: user.state,
      mobile: user.mobile
    });
    
    setRequestHistory([newRequest, ...requestHistory]);
    setIsDialogOpen(false);
    setUnits(1);
    setReason('');
  };

  const totalRequests = requestHistory.length;
  const approvedRequests = requestHistory.filter(req => req.status === 'approved').length;
  const pendingRequests = requestHistory.filter(req => req.status === 'pending').length;

  const bloodGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Patient Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.name}</p>
          </div>
          
          <Button 
            className="bg-bloodred hover:bg-bloodred-dark mt-4 md:mt-0"
            onClick={() => setIsDialogOpen(true)}
          >
            Request Blood
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <DashboardCard
            title="Total Requests"
            value={totalRequests}
            description="All blood requests"
            className="bg-blue-50 border-blue-200"
          />
          
          <DashboardCard
            title="Approved"
            value={approvedRequests}
            description="Approved requests"
            className="bg-green-50 border-green-200"
          />
          
          <DashboardCard
            title="Pending"
            value={pendingRequests}
            description="Awaiting approval"
            className="bg-yellow-50 border-yellow-200"
          />
        </div>
        
        <Tabs defaultValue="request-history" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
            <TabsTrigger value="request-history">Request History</TabsTrigger>
            <TabsTrigger value="blood-stock">Blood Stock</TabsTrigger>
            <TabsTrigger value="local-donors">Local Donors</TabsTrigger>
          </TabsList>
          
          <TabsContent value="request-history" className="space-y-4">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Your Request History</h2>
              <RequestsTable requests={requestHistory} />
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
              
              {localDonors.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {localDonors.map((donor) => (
                    <Card key={donor.id} className="p-4 border border-gray-200">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-semibold">{donor.name}</h3>
                          <p className="text-sm text-gray-500">{donor.city}, {donor.state}</p>
                        </div>
                        <div className="px-3 py-1 bg-red-100 text-bloodred rounded-full text-sm font-semibold">
                          {donor.bloodGroup}
                        </div>
                      </div>
                      <div className="mt-2 text-sm">
                        <p>Contact: {donor.mobile}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No donors found in your city</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Request Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Blood</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <div className="space-y-2">
                <Label htmlFor="bloodGroup">Blood Group Required</Label>
                <Select value={bloodGroup} onValueChange={(value) => setBloodGroup(value as BloodGroup)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select blood group" />
                  </SelectTrigger>
                  <SelectContent>
                    {bloodGroups.map((group) => (
                      <SelectItem key={group} value={group}>{group}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <div className="space-y-2">
                <Label htmlFor="units">Units Required</Label>
                <Input
                  id="units"
                  type="number"
                  min="1"
                  value={units}
                  onChange={(e) => setUnits(parseInt(e.target.value) || 1)}
                />
              </div>
            </div>
            
            <div>
              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Request</Label>
                <Textarea
                  id="reason"
                  placeholder="Please specify the medical reason for blood request"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                />
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
              onClick={handleRequestSubmit}
              disabled={!reason}
            >
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default PatientDashboard;
