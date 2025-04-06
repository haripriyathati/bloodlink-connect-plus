
import { User } from '@/types/models';
import { toast } from 'sonner';

export interface Notification {
  id: string;
  userId: string;
  message: string;
  type: 'info' | 'donation-reminder' | 'approval' | 'rejection';
  createdAt: Date;
  read: boolean;
}

// In-memory storage for notifications
let notifications: Notification[] = [];

export const createNotification = (
  userId: string,
  message: string,
  type: 'info' | 'donation-reminder' | 'approval' | 'rejection'
): Notification => {
  const notification: Notification = {
    id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId,
    message,
    type,
    createdAt: new Date(),
    read: false,
  };
  
  notifications.push(notification);
  return notification;
};

export const markNotificationAsRead = (notificationId: string): boolean => {
  const notification = notifications.find(n => n.id === notificationId);
  if (notification) {
    notification.read = true;
    return true;
  }
  return false;
};

export const getUserNotifications = (userId: string): Notification[] => {
  return notifications
    .filter(notification => notification.userId === userId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

export const checkForDonationEligibilityNotification = (user: User | null, donationHistory: any[]): void => {
  if (!user) return;
  
  // Find the latest approved donation
  const approvedDonations = donationHistory.filter(don => don.status === 'approved');
  if (approvedDonations.length === 0) return;
  
  // Sort by date, newest first
  approvedDonations.sort((a, b) => new Date(b.offerDate).getTime() - new Date(a.offerDate).getTime());
  
  const latestDonation = approvedDonations[0];
  const latestDonationDate = new Date(latestDonation.offerDate);
  
  // Check if it's been more than 3 months since last donation
  const threeMonthsLater = new Date(latestDonationDate);
  threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);
  
  const today = new Date();
  
  // If we're past the 3 month mark, create a notification
  if (today >= threeMonthsLater) {
    // Check if we already have a recent notification for this user
    const existingNotifications = getUserNotifications(user.id)
      .filter(n => 
        n.type === 'donation-reminder' && 
        new Date(n.createdAt).getTime() > today.getTime() - 7 * 24 * 60 * 60 * 1000
      );
    
    // Only create a notification if there isn't one in the last week
    if (existingNotifications.length === 0) {
      const notification = createNotification(
        user.id,
        "You are now eligible to donate blood again! It's been 3 months since your last donation.",
        'donation-reminder'
      );
      
      // Display a toast for the reminder
      toast.info("You're eligible to donate blood again!");
    }
  }
};
