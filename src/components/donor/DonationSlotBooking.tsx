
import React, { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { DonationOffer } from '@/types/models';
import { bookDonationSlot } from '@/services/dataService';

interface DonationSlotBookingProps {
  isOpen: boolean;
  onClose: () => void;
  donationId: string;
}

const timeSlots = [
  '09:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '01:00 PM', '02:00 PM',
  '03:00 PM', '04:00 PM', '05:00 PM',
];

const DonationSlotBooking: React.FC<DonationSlotBookingProps> = ({
  isOpen,
  onClose,
  donationId,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);

  const handleBookSlot = () => {
    if (!selectedDate || !selectedTime) {
      toast.error("Please select both date and time slot");
      return;
    }

    // Combine selected date and time
    const bookingDateTime = new Date(selectedDate);
    const [hours, minutes] = selectedTime.split(':');
    const isPM = selectedTime.includes('PM');
    let hourValue = parseInt(hours);
    
    if (isPM && hourValue !== 12) {
      hourValue += 12;
    } else if (!isPM && hourValue === 12) {
      hourValue = 0;
    }
    
    bookingDateTime.setHours(hourValue, parseInt(minutes), 0);

    // Book the slot
    const updatedDonation = bookDonationSlot(donationId, bookingDateTime);
    
    if (updatedDonation) {
      toast.success("Donation slot booked successfully!");
      onClose();
    } else {
      toast.error("Failed to book donation slot");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Schedule Donation Slot</DialogTitle>
          <DialogDescription>
            Choose a convenient date and time for your blood donation at a nearby blood bank.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="date">Select Date</Label>
            <div className="flex justify-center">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, 'PPP') : <span>Select date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => {
                      // Disable past dates and dates more than 30 days in the future
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      const thirtyDaysLater = new Date();
                      thirtyDaysLater.setDate(today.getDate() + 30);
                      
                      return date < today || date > thirtyDaysLater;
                    }}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Select Time Slot</Label>
            <div className="grid grid-cols-3 gap-2">
              {timeSlots.map((time) => (
                <Button
                  key={time}
                  variant={selectedTime === time ? "default" : "outline"}
                  className={selectedTime === time ? "bg-bloodred hover:bg-bloodred-dark" : ""}
                  onClick={() => setSelectedTime(time)}
                >
                  <Clock className="mr-2 h-4 w-4" />
                  {time}
                </Button>
              ))}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleBookSlot}
            className="bg-bloodred hover:bg-bloodred-dark"
            disabled={!selectedDate || !selectedTime}
          >
            Book Slot
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DonationSlotBooking;
