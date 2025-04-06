
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { BloodRequest } from "@/types/models";
import { useState } from "react";

interface RequestsTableProps {
  requests: BloodRequest[];
  isAdmin?: boolean;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

const RequestsTable: React.FC<RequestsTableProps> = ({
  requests,
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
            <TableHead className="font-semibold">Patient Name</TableHead>
            <TableHead className="font-semibold">Blood Group</TableHead>
            <TableHead className="font-semibold">Units</TableHead>
            <TableHead className="font-semibold">Date</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold">City</TableHead>
            <TableHead className="font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            <>
              <TableRow key={request.id}>
                <TableCell className="font-medium">{request.patientName}</TableCell>
                <TableCell>{request.bloodGroup}</TableCell>
                <TableCell>{request.units}</TableCell>
                <TableCell>{new Date(request.requestDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeColor(request.status)}`}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </span>
                </TableCell>
                <TableCell>{request.city}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => toggleExpand(request.id)}
                    >
                      {expandedId === request.id ? "Hide" : "Details"}
                    </Button>
                    
                    {isAdmin && request.status === "pending" && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                          onClick={() => onApprove && onApprove(request.id)}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                          onClick={() => onReject && onReject(request.id)}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
              {expandedId === request.id && (
                <TableRow>
                  <TableCell colSpan={7} className="bg-gray-50">
                    <div className="p-4">
                      <h4 className="font-semibold mb-2">Request Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p><span className="font-medium">Reason:</span> {request.reason}</p>
                          <p><span className="font-medium">Address:</span> {request.address}</p>
                          <p><span className="font-medium">Mobile:</span> {request.mobile}</p>
                        </div>
                        <div>
                          <p><span className="font-medium">City:</span> {request.city}</p>
                          <p><span className="font-medium">State:</span> {request.state}</p>
                          {request.adminResponse && (
                            <p><span className="font-medium">Admin Response:</span> {request.adminResponse}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </>
          ))}
          {requests.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                No blood requests found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default RequestsTable;
