import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { staggerContainer, slideUp } from "@/lib/motion";
import type { LowStockProduct } from "@/types";

interface LowStockListProps {
  products: LowStockProduct[];
  isLoading?: boolean;
}

export default function LowStockList({
  products,
  isLoading = false,
}: LowStockListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Low Stock Products</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : products.length === 0 ? (
          <motion.div
            variants={slideUp}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center justify-center py-12 text-center"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">
              All stock levels healthy
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              No products are running low
            </p>
          </motion.div>
        ) : (
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Stock Quantity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <motion.tbody
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                >
                  {products.map((product) => (
                    <motion.tr
                      key={product._id}
                      variants={slideUp}
                      className="border-b transition-colors hover:bg-muted/50"
                    >
                      <TableCell className="font-medium">
                        {product.name}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {product.sku}
                      </TableCell>
                      <TableCell>
                        <Badge variant="destructive">
                          {product.stockQuantity}
                        </Badge>
                      </TableCell>
                    </motion.tr>
                  ))}
                </motion.tbody>
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
