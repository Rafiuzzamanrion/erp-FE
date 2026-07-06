import { useState, useMemo, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { useGetProductsQuery } from "../../products/productApi";
import type { Product } from "@/types";

interface ProductSelectorProps {
  onSelect: (product: Product) => void;
  excludeIds?: string[];
}

export default function ProductSelector({
  onSelect,
  excludeIds = [],
}: ProductSelectorProps) {
  const [search, setSearch] = useState("");

  const { data } = useGetProductsQuery(
    { search: search || undefined, limit: 50 },
    { skip: false }
  );

  const filteredProducts = useMemo(() => {
    if (!data?.data) return [];
    return data.data.filter(
      (p) => p.stockQuantity > 0 && !excludeIds.includes(p._id)
    );
  }, [data, excludeIds]);

  const handleSelect = useCallback(
    (product: Product) => {
      onSelect(product);
      setSearch("");
    },
    [onSelect]
  );

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-8"
        />
      </div>
      <div className="space-y-1 max-h-[60vh] overflow-y-auto">
        {filteredProducts.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No products found
          </p>
        )}
        {filteredProducts.map((product) => (
          <button
            key={product._id}
            type="button"
            onClick={() => handleSelect(product)}
            className="w-full flex items-center justify-between p-2 rounded-lg border hover:bg-accent transition-colors text-left"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{product.name}</p>
              <p className="text-xs text-muted-foreground">{product.sku}</p>
            </div>
            <Badge
              variant={
                product.stockQuantity > 5
                  ? "success"
                  : product.stockQuantity > 0
                    ? "warning"
                    : "secondary"
              }
              className="ml-2 shrink-0"
            >
              {product.stockQuantity} in stock
            </Badge>
          </button>
        ))}
      </div>
    </div>
  );
}
