
export type UserRole = 'admin' | 'donor' | 'patient';

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type RequestStatus = 'pending' | 'approved' | 'rejected';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  bloodGroup: BloodGroup;
  address: string;
  city: string;
  state: string;
  mobile: string;
  createdAt: Date;
}

export interface BloodRequest {
  id: string;
  patientId: string;
  patientName: string;
  bloodGroup: BloodGroup;
  units: number;
  reason: string;
  status: RequestStatus;
  adminResponse?: string;
  requestDate: Date;
  address: string;
  city: string;
  state: string;
  mobile: string;
}

export interface DonationOffer {
  id: string;
  donorId: string;
  donorName: string;
  bloodGroup: BloodGroup;
  units: number;
  status: RequestStatus;
  adminResponse?: string;
  offerDate: Date;
  address: string;
  city: string;
  state: string;
  mobile: string;
  slotBooked?: boolean;
  donationSlot?: Date;
}

export interface BloodStock {
  bloodGroup: BloodGroup;
  units: number;
  lastUpdated: Date;
}
