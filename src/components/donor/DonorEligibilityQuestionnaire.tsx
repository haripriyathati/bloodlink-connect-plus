
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";

interface DonorEligibilityQuestionnaireProps {
  isOpen: boolean;
  onClose: () => void;
  onEligible: () => void;
}

const DonorEligibilityQuestionnaire = ({ isOpen, onClose, onEligible }: DonorEligibilityQuestionnaireProps) => {
  const [responses, setResponses] = useState({
    age: true,
    weight: true,
    recentIllness: false,
    onMedication: false,
    medications: '',
    recentTattoo: false,
    recentPiercing: false,
    recentSurgery: false,
    recentBloodTransfusion: false,
    recentPregnancy: false,
    menstruationRegular: 'na', // 'yes', 'no', or 'na'
    lastDonation: '',
    hemoglobinLevel: '',
  });

  const handleCheckboxChange = (field: string) => {
    setResponses({
      ...responses,
      [field]: !responses[field as keyof typeof responses]
    });
  };

  const handleRadioChange = (field: string, value: string) => {
    setResponses({
      ...responses,
      [field]: value
    });
  };

  const handleTextChange = (field: string, value: string) => {
    setResponses({
      ...responses,
      [field]: value
    });
  };

  const checkEligibility = () => {
    // Basic eligibility checks
    if (!responses.age || !responses.weight) {
      toast.error("You must be at least 18 years old and weigh at least 50kg to donate blood.");
      onClose();
      return;
    }

    if (responses.recentIllness || 
        responses.recentTattoo || 
        responses.recentPiercing || 
        responses.recentSurgery || 
        responses.recentBloodTransfusion || 
        responses.recentPregnancy) {
      toast.error("Based on your responses, you may not be eligible to donate at this time. Please consult with a healthcare professional.");
      onClose();
      return;
    }

    // Check for recent donation (must be at least 3 months)
    if (responses.lastDonation) {
      const lastDonationDate = new Date(responses.lastDonation);
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      
      if (lastDonationDate > threeMonthsAgo) {
        const nextEligibleDate = new Date(lastDonationDate);
        nextEligibleDate.setMonth(lastDonationDate.getMonth() + 3);
        toast.error(`You will be eligible to donate after ${nextEligibleDate.toLocaleDateString()}`);
        onClose();
        return;
      }
    }

    // Check hemoglobin level
    if (responses.hemoglobinLevel && parseFloat(responses.hemoglobinLevel) < 12.5) {
      toast.error("Your hemoglobin level appears to be too low for donation. Please consult with a healthcare professional.");
      onClose();
      return;
    }

    // If all checks pass
    toast.success("You are eligible to donate blood!");
    onEligible();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle>Donor Eligibility Questionnaire</DialogTitle>
          <DialogDescription>
            Please answer these questions truthfully to determine your eligibility to donate blood.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
          <div className="flex items-start space-x-2">
            <Checkbox 
              id="age" 
              checked={responses.age}
              onCheckedChange={() => handleCheckboxChange('age')}
            />
            <div className="grid gap-1.5">
              <Label htmlFor="age">
                I am at least 18 years old
              </Label>
            </div>
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox 
              id="weight" 
              checked={responses.weight}
              onCheckedChange={() => handleCheckboxChange('weight')}
            />
            <div className="grid gap-1.5">
              <Label htmlFor="weight">
                I weigh at least 50kg (110 lbs)
              </Label>
            </div>
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox 
              id="recentIllness" 
              checked={responses.recentIllness}
              onCheckedChange={() => handleCheckboxChange('recentIllness')}
            />
            <div className="grid gap-1.5">
              <Label htmlFor="recentIllness">
                I have been ill in the past 14 days
              </Label>
            </div>
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox 
              id="onMedication" 
              checked={responses.onMedication}
              onCheckedChange={() => handleCheckboxChange('onMedication')}
            />
            <div className="grid gap-1.5">
              <Label htmlFor="onMedication">
                I am currently taking medication
              </Label>
            </div>
          </div>

          {responses.onMedication && (
            <div className="pl-6">
              <Label htmlFor="medications">Please list your medications:</Label>
              <Textarea
                id="medications"
                value={responses.medications}
                onChange={(e) => handleTextChange('medications', e.target.value)}
                className="mt-1"
              />
            </div>
          )}

          <div className="flex items-start space-x-2">
            <Checkbox 
              id="recentTattoo" 
              checked={responses.recentTattoo}
              onCheckedChange={() => handleCheckboxChange('recentTattoo')}
            />
            <div className="grid gap-1.5">
              <Label htmlFor="recentTattoo">
                I have gotten a tattoo in the past 3 months
              </Label>
            </div>
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox 
              id="recentPiercing" 
              checked={responses.recentPiercing}
              onCheckedChange={() => handleCheckboxChange('recentPiercing')}
            />
            <div className="grid gap-1.5">
              <Label htmlFor="recentPiercing">
                I have gotten a piercing in the past 3 months
              </Label>
            </div>
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox 
              id="recentSurgery" 
              checked={responses.recentSurgery}
              onCheckedChange={() => handleCheckboxChange('recentSurgery')}
            />
            <div className="grid gap-1.5">
              <Label htmlFor="recentSurgery">
                I have had surgery in the past 6 months
              </Label>
            </div>
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox 
              id="recentBloodTransfusion" 
              checked={responses.recentBloodTransfusion}
              onCheckedChange={() => handleCheckboxChange('recentBloodTransfusion')}
            />
            <div className="grid gap-1.5">
              <Label htmlFor="recentBloodTransfusion">
                I have received a blood transfusion in the past 12 months
              </Label>
            </div>
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox 
              id="recentPregnancy" 
              checked={responses.recentPregnancy}
              onCheckedChange={() => handleCheckboxChange('recentPregnancy')}
            />
            <div className="grid gap-1.5">
              <Label htmlFor="recentPregnancy">
                I have been pregnant in the past 6 months
              </Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Do you have regular menstruation? (For women)</Label>
            <RadioGroup 
              value={responses.menstruationRegular} 
              onValueChange={(value) => handleRadioChange('menstruationRegular', value)}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="menstruation-yes" />
                <Label htmlFor="menstruation-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="menstruation-no" />
                <Label htmlFor="menstruation-no">No</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="na" id="menstruation-na" />
                <Label htmlFor="menstruation-na">Not applicable</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-1">
            <Label htmlFor="lastDonation">Date of last blood donation (if any):</Label>
            <Input
              type="date"
              id="lastDonation"
              value={responses.lastDonation}
              onChange={(e) => handleTextChange('lastDonation', e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="hemoglobinLevel">Hemoglobin level (g/dL) if known:</Label>
            <Input
              type="number"
              id="hemoglobinLevel"
              placeholder="e.g., 13.5"
              value={responses.hemoglobinLevel}
              onChange={(e) => handleTextChange('hemoglobinLevel', e.target.value)}
              step="0.1"
              min="0"
            />
            <p className="text-xs text-gray-500">
              Normal range is typically 13.5-17.5 g/dL for men and 12.0-15.5 g/dL for women
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            className="bg-bloodred hover:bg-bloodred-dark"
            onClick={checkEligibility}
          >
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DonorEligibilityQuestionnaire;
