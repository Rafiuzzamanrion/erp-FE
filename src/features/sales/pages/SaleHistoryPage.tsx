import { useState } from "react";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import PageHeader from "@/components/shared/PageHeader";
import DataTable from "@/components/shared/DataTable";
import NoDataFound from "@/components/shared/NoDataFound";
import { useGetSalesQuery } from "../saleApi";
import type { Sale } from "@/types";

export default function SaleHistoryPage() {
  const [page, setPage] = useState(1);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  const { data, isLoading } = useGetSalesQuery({
    page,
    limit: 10,
    sort: "-createdAt",
  });

  const columns = [
    {
      key: "date",
      header: "Date",
      render: (sale: Sale) =>
        new Date(sale.createdAt).toLocaleDateString(),
    },
    {
      key: "items",
      header: "# Items",
      render: (sale: Sale) => (
        <Badge variant="secondary">{sale.items.length}</Badge>
      ),
    },
    {
      key: "grandTotal",
      header: "Grand Total",
      render: (sale: Sale) => (
        <span className="font-semibold">
          {formatCurrency(sale.grandTotal)}
        </span>
      ),
    },
    {
      key: "soldBy",
      header: "Sold By",
      render: (sale: Sale) =>
        typeof sale.soldBy === "object" && sale.soldBy !== null
          ? sale.soldBy.name
          : "-",
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (sale: Sale) => (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSelectedSale(sale)}
        >
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader>Sale History</PageHeader>

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        meta={data?.meta}
        onPageChange={setPage}
        emptyComponent={
          <NoDataFound
            message="No sales yet"
            ctaLabel="Create Sale"
            ctaTo="/sales/new"
          />
        }
      />

      <Dialog
        open={!!selectedSale}
        onOpenChange={(open) => {
          if (!open) setSelectedSale(null);
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Sale Details —{" "}
              {selectedSale &&
                new Date(selectedSale.createdAt).toLocaleDateString()}
            </DialogTitle>
          </DialogHeader>
          {selectedSale && (
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead>Subtotal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedSale.items.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">
                        {item.productName}
                      </TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>
                        {formatCurrency(item.unitPrice)}
                      </TableCell>
                      <TableCell>
                        {formatCurrency(item.subtotal)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex items-center justify-between border-t pt-4">
                <span className="text-lg font-bold">Grand Total</span>
                <span className="text-lg font-bold">
                  {formatCurrency(selectedSale.grandTotal)}
                </span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
