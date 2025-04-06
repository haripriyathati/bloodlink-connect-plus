
import { User, BloodRequest, DonationOffer, BloodStock, RequestStatus, UserRole, BloodGroup } from "@/types/models";
import { toast } from "sonner";
import { createNotification } from "./notificationService";

// Mock data storage (would be replaced with real API calls in production)
let users: User[] = [
  {
    id: "admin1",
    name: "Admin User",
    email: "admin@bloodlink.com",
    password: "admin123", // In a real app, this would be hashed
    role: "admin",
    bloodGroup: "O+",
    address: "Blood Bank HQ",
    city: "Delhi",
    state: "Delhi",
    mobile: "9876543210",
    createdAt: new Date(),
  },
  {
    id: "donor1",
    name: "John Donor",
    email: "donor@example.com",
    password: "donor123", // In a real app, this would be hashed
    role: "donor",
    bloodGroup: "A+",
    address: "123 Main St",
    city: "Mumbai",
    state: "Maharashtra",
    mobile: "8765432109",
    createdAt: new Date(),
  },
  {
    id: "patient1",
    name: "Sara Patient",
    email: "patient@example.com",
    password: "patient123", // In a real app, this would be hashed
    role: "patient",
    bloodGroup: "B+",
    address: "456 Hospital Rd",
    city: "Bangalore",
    state: "Karnataka",
    mobile: "7654321098",
    createdAt: new Date(),
  },
];

let bloodRequests: BloodRequest[] = [
  {
    id: "req1",
    patientId: "patient1",
    patientName: "Sara Patient",
    bloodGroup: "B+",
    units: 2,
    reason: "Surgery",
    status: "pending",
    requestDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    address: "456 Hospital Rd",
    city: "Bangalore",
    state: "Karnataka",
    mobile: "7654321098",
  }
];

let donationOffers: DonationOffer[] = [
  {
    id: "don1",
    donorId: "donor1",
    donorName: "John Donor",
    bloodGroup: "A+",
    units: 1,
    status: "pending",
    offerDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    address: "123 Main St",
    city: "Mumbai",
    state: "Maharashtra",
    mobile: "8765432109",
  }
];

let bloodStock: BloodStock[] = [
  { bloodGroup: "A+", units: 10, lastUpdated: new Date() },
  { bloodGroup: "A-", units: 5, lastUpdated: new Date() },
  { bloodGroup: "B+", units: 8, lastUpdated: new Date() },
  { bloodGroup: "B-", units: 4, lastUpdated: new Date() },
  { bloodGroup: "AB+", units: 3, lastUpdated: new Date() },
  { bloodGroup: "AB-", units: 2, lastUpdated: new Date() },
  { bloodGroup: "O+", units: 12, lastUpdated: new Date() },
  { bloodGroup: "O-", units: 6, lastUpdated: new Date() },
];

// Authentication
export const loginUser = (email: string, password: string): User | null => {
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    return user;
  }
  return null;
};

export const registerUser = (userData: Omit<User, 'id' | 'createdAt'>): User => {
  const newUser: User = {
    ...userData,
    id: `user${users.length + 1}`,
    createdAt: new Date(),
  };
  
  users.push(newUser);
  return newUser;
};

export const getCurrentUser = (): User | null => {
  const userJson = localStorage.getItem('currentUser');
  if (userJson) {
    return JSON.parse(userJson);
  }
  return null;
};

export const logoutUser = (): void => {
  localStorage.removeItem('currentUser');
};

// Blood Requests
export const getBloodRequests = (): BloodRequest[] => {
  return bloodRequests;
};

export const getBloodRequestsByPatientId = (patientId: string): BloodRequest[] => {
  return bloodRequests.filter(req => req.patientId === patientId);
};

export const createBloodRequest = (requestData: Omit<BloodRequest, 'id' | 'status' | 'requestDate'>): BloodRequest => {
  const newRequest: BloodRequest = {
    ...requestData,
    id: `req${bloodRequests.length + 1}`,
    status: 'pending',
    requestDate: new Date(),
  };
  
  bloodRequests.push(newRequest);
  toast.success("Blood request submitted successfully");
  return newRequest;
};

export const updateBloodRequestStatus = (requestId: string, status: RequestStatus, adminResponse?: string): BloodRequest | null => {
  const index = bloodRequests.findIndex(req => req.id === requestId);
  if (index !== -1) {
    bloodRequests[index] = {
      ...bloodRequests[index],
      status,
      adminResponse,
    };
    
    // If approved, update blood stock
    if (status === 'approved') {
      const request = bloodRequests[index];
      updateBloodStock(request.bloodGroup, -request.units);
    }

    // Create notification for patient
    const patientId = bloodRequests[index].patientId;
    let notificationMessage = "";
    let notificationType: 'approval' | 'rejection' | 'info' = 'info';
    
    if (status === 'approved') {
      notificationMessage = `Your blood request has been approved. ${adminResponse || ''}`;
      notificationType = 'approval';
    } else if (status === 'rejected') {
      notificationMessage = `Your blood request has been rejected. ${adminResponse || ''}`;
      notificationType = 'rejection';
    }
    
    createNotification(patientId, notificationMessage, notificationType);
    
    return bloodRequests[index];
  }
  return null;
};

// Donation Offers
export const getDonationOffers = (): DonationOffer[] => {
  return donationOffers;
};

export const getDonationOffersByDonorId = (donorId: string): DonationOffer[] => {
  return donationOffers.filter(offer => offer.donorId === donorId);
};

export const createDonationOffer = (offerData: Omit<DonationOffer, 'id' | 'status' | 'offerDate'>): DonationOffer => {
  const newOffer: DonationOffer = {
    ...offerData,
    id: `don${donationOffers.length + 1}`,
    status: 'pending',
    offerDate: new Date(),
  };
  
  donationOffers.push(newOffer);
  toast.success("Donation offer submitted successfully");
  return newOffer;
};

export const updateDonationOfferStatus = (offerId: string, status: RequestStatus, adminResponse?: string): DonationOffer | null => {
  const index = donationOffers.findIndex(offer => offer.id === offerId);
  if (index !== -1) {
    donationOffers[index] = {
      ...donationOffers[index],
      status,
      adminResponse,
    };
    
    // If approved, update blood stock
    if (status === 'approved') {
      const offer = donationOffers[index];
      updateBloodStock(offer.bloodGroup, offer.units);
    }
    
    // Create notification for donor
    const donorId = donationOffers[index].donorId;
    let notificationMessage = "";
    let notificationType: 'approval' | 'rejection' | 'info' = 'info';
    
    if (status === 'approved') {
      notificationMessage = `Your donation offer has been approved. ${adminResponse || ''}`;
      notificationType = 'approval';
    } else if (status === 'rejected') {
      notificationMessage = `Your donation offer has been rejected. ${adminResponse || ''}`;
      notificationType = 'rejection';
    }
    
    createNotification(donorId, notificationMessage, notificationType);
    
    return donationOffers[index];
  }
  return null;
};

// Blood Stock
export const getBloodStock = (): BloodStock[] => {
  return bloodStock;
};

export const updateBloodStock = (bloodGroup: BloodGroup, units: number): BloodStock | null => {
  const index = bloodStock.findIndex(stock => stock.bloodGroup === bloodGroup);
  if (index !== -1) {
    bloodStock[index] = {
      ...bloodStock[index],
      units: Math.max(0, bloodStock[index].units + units),
      lastUpdated: new Date(),
    };
    return bloodStock[index];
  }
  return null;
};

// Helper functions
export const getDonorsInSameCity = (city: string): User[] => {
  return users.filter(user => user.role === 'donor' && user.city.toLowerCase() === city.toLowerCase());
};
