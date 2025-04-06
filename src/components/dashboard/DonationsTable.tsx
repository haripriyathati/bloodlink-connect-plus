
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DonationOffer } from "@/types/models";
import { useState } from "react";

interface DonationsTableProps {
  donations: DonationOffer[];
  isAdmin?: boolean;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

const DonationsTable: React.FC<DonationsTableProps> = ({
  donations,
  isAdmin = false,
  onApprove,
  onReject,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold">Donor Name</TableHead>
            <TableHead className="font-semibold">Blood Group</TableHead>
            <TableHead className="font-semibold">Units</TableHead>
            <TableHead className="font-semibold">Date</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold">City</TableHead>
            <TableHead className="font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {donations.map((donation) => (
            <>
              <TableRow key={donation.id}>
                <TableCell className="font-medium">{donation.donorName}</TableCell>
                <TableCell>{donation.bloodGroup}</TableCell>
                <TableCell>{donation.units}</TableCell>
                <TableCell>{new Date(donation.offerDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeColor(donation.status)}`}>
                    {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                  </span>
                </TableCell>
                <TableCell>{donation.city}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => toggleExpand(donation.id)}
                    >
                      {expandedId === donation.id ? "Hide" : "Details"}
                    </Button>
                    
                    {isAdmin && donation.status === "pending" && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                          onClick={() => onApprove && onApprove(donation.id)}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                          onClick={() => onReject && onReject(donation.id)}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
              {expandedId === donation.id && (
                <TableRow>
                  <TableCell colSpan={7} className="bg-gray-50">
                    <div className="p-4">
                      <h4 className="font-semibold mb-2">Donation Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p><span className="font-medium">Address:</span> {donation.address}</p>
                          <p><span className="font-medium">Mobile:</span> {donation.mobile}</p>
                        </div>
                        <div>
                          <p><span className="font-medium">City:</span> {donation.city}</p>
                          <p><span className="font-medium">State:</span> {donation.state}</p>
                          {donation.adminResponse && (
                            <p><span className="font-medium">Admin Response:</span> {donation.adminResponse}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </>
          ))}
          {donations.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                No donation offers found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default DonationsTable;
