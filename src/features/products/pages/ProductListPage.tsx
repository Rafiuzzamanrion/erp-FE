import { useState, useEffect, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Plus, RotateCw, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAppSelector } from "@/app/hooks";
import { useGetProductsQuery, useDeleteProductMutation } from "../productApi";
import ProductTable from "../components/ProductTable";
import NoDataFound from "@/components/shared/NoDataFound";
import ProductTableSkeleton from "@/components/shared/ProductTableSkeleton";

export default function ProductListPage() {
  const user = useAppSelector((state) => state.auth.user);
  const isEmployee = user?.role === "employee";

  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get("search") ?? "");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const search = searchParams.get("search") ?? "";
  const category = searchParams.get("category") ?? "";
  const page = Number(searchParams.get("page")) || 1;
  const limit = 10;

  const { data, isLoading, isFetching, isError, error, refetch } = useGetProductsQuery(
    { search, category, page, limit },
    { skip: false }
  );

  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        Object.entries(updates).forEach(([key, value]) => {
          if (value) {
            next.set(key, value);
          } else {
            next.delete(key);
          }
        });
        if (updates.search !== undefined || updates.category !== undefined) {
          next.delete("page");
        }
        return next;
      });
    },
    [setSearchParams]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== search) {
        updateParams({ search: searchInput });
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput, search, updateParams]);

  const handleCategoryChange = (value: string) => {
    updateParams({ category: value });
  };

  const handlePageChange = (newPage: number) => {
    updateParams({ page: String(newPage) });
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteProduct(deleteId).unwrap();
      toast.success("Product deleted successfully");
    } catch {
      toast.error("Failed to delete product");
    } finally {
      setDeleteId(null);
    }
  };

  const isFirstLoad = isLoading && !data;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Products</h1>
        {!isEmployee && (
          <Button asChild>
            <Link to="/products/new">
              <Plus className="h-4 w-4" />
              Add Product
            </Link>
          </Button>
        )}
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-9"
          />
        </div>
        <Input
          placeholder="Category filter..."
          value={category}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="max-w-[200px]"
        />
        {isFetching && !isLoading && (
          <RotateCw className="h-4 w-4 animate-spin self-center text-muted-foreground" />
        )}
      </div>

      {isFirstLoad ? (
        <ProductTableSkeleton />
      ) : isError ? (
        <NoDataFound
          title="Failed to load products"
          description={
            (error as { data?: { message?: string } })?.data?.message ??
            "An unexpected error occurred. Please try again."
          }
          action={
            <Button variant="outline" onClick={() => refetch()}>
              <RotateCw className="h-4 w-4" />
              Retry
            </Button>
          }
        />
      ) : data && data.data.length === 0 ? (
        <NoDataFound
          title="No products found"
          description={
            search || category
              ? "No products match your search criteria. Try adjusting your filters."
              : "Get started by adding your first product to the inventory."
          }
          action={
            !isEmployee && !search && !category ? (
              <Button asChild>
                <Link to="/products/new">
                  <Plus className="h-4 w-4" />
                  Add Product
                </Link>
              </Button>
            ) : undefined
          }
        />
      ) : (
        <ProductTable
          products={data?.data ?? []}
          isLoading={isFetching}
          meta={data?.meta}
          onPageChange={handlePageChange}
          onDelete={handleDelete}
        />
      )}

      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" loading={isDeleting} onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
