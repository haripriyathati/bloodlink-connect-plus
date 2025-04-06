
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BloodStock } from "@/types/models";

interface BloodStockTableProps {
  stockData: BloodStock[];
}

const BloodStockTable: React.FC<BloodStockTableProps> = ({ stockData }) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold">Blood Group</TableHead>
            <TableHead className="font-semibold">Units Available</TableHead>
            <TableHead className="font-semibold">Last Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stockData.map((stock) => (
            <TableRow key={stock.bloodGroup}>
              <TableCell className="font-medium">{stock.bloodGroup}</TableCell>
              <TableCell>
                <span className={`${stock.units < 5 ? 'text-red-600' : 'text-green-600'} font-semibold`}>
                  {stock.units}
                </span>
              </TableCell>
              <TableCell>{new Date(stock.lastUpdated).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default BloodStockTable;
