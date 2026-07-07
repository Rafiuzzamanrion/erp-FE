import { useState, useEffect } from "react";
import { RotateCw, Tag, Trash2, Search, Pencil } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "../categoryApi";
import PageHeader from "@/components/shared/PageHeader";
import NoDataFound from "@/components/shared/NoDataFound";
import CategoriesListSkeleton from "../components/CategoriesListSkeleton";

export default function CategoriesListPage() {
  const {
    data: categories,
    isLoading,
    isError,
    refetch,
  } = useGetCategoriesQuery();
  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchInput), 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const filteredCategories = categories?.filter(
    (category) =>
      category.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      (category.description ?? "")
        .toLowerCase()
        .includes(debouncedSearch.toLowerCase())
  );

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<{
    _id: string;
    name: string;
    description?: string;
  } | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setFormName("");
    setFormDescription("");
  };

  const handleCreate = async () => {
    if (!formName) return;
    setIsSubmitting(true);
    try {
      await createCategory({
        name: formName,
        description: formDescription,
      }).unwrap();
      toast.success("Category created");
      setIsCreateOpen(false);
      resetForm();
    } catch {
      toast.error("Failed to create category");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    if (!editCategory) return;
    setIsSubmitting(true);
    try {
      const data: Record<string, string> = {};
      if (formName) data.name = formName;
      if (formDescription) data.description = formDescription;
      await updateCategory({ id: editCategory._id, ...data }).unwrap();
      toast.success("Category updated");
      setEditCategory(null);
      resetForm();
    } catch {
      toast.error("Failed to update category");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteCategory(deleteId).unwrap();
      toast.success("Category deleted");
    } catch (err: unknown) {
      const message =
        err &&
        typeof err === "object" &&
        "data" in err &&
        err.data &&
        typeof err.data === "object" &&
        "message" in err.data
          ? String(err.data.message)
          : "Failed to delete category";
      toast.error(message);
    } finally {
      setDeleteId(null);
    }
  };

  const openEdit = (category: {
    _id: string;
    name: string;
    description?: string;
  }) => {
    setEditCategory(category);
    setFormName(category.name);
    setFormDescription(category.description ?? "");
  };

  return (
    <div>
      <PageHeader
        title="Categories"
        description="Organize products into categories"
      >
        <Button
          onClick={() => {
            resetForm();
            setIsCreateOpen(true);
          }}
        >
          <Tag className="h-4 w-4" />
          Add Category
        </Button>
      </PageHeader>

      <Card className="mb-6 border-none shadow-sm">
        <CardContent className="p-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search categories..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <CategoriesListSkeleton />
      ) : isError ? (
        <NoDataFound
          title="Failed to load categories"
          action={
            <Button variant="outline" onClick={() => refetch()}>
              <RotateCw className="h-4 w-4" />
              Retry
            </Button>
          }
        />
      ) : !filteredCategories || filteredCategories.length === 0 ? (
        <NoDataFound
          title={
            debouncedSearch
              ? "No categories match your search"
              : "No categories found"
          }
          description={
            debouncedSearch
              ? "Try a different search term."
              : "Get started by adding your first category."
          }
          action={
            !debouncedSearch ? (
              <Button
                onClick={() => {
                  resetForm();
                  setIsCreateOpen(true);
                }}
              >
                <Tag className="h-4 w-4" />
                Add Category
              </Button>
            ) : undefined
          }
          variant={debouncedSearch ? "search" : "empty"}
        />
      ) : (
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-24 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.map((category) => (
                <TableRow key={category._id}>
                  <TableCell className="font-medium capitalize">
                    {category.name}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {category.description ?? "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Edit ${category.name}`}
                        onClick={() => openEdit(category)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Delete ${category.name}`}
                        onClick={() => setDeleteId(category._id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Category</DialogTitle>
            <DialogDescription>
              Create a new product category.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="category-name">Name</Label>
              <Input
                id="category-name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g. electronics"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="category-description">Description</Label>
              <Input
                id="category-description"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Optional description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button loading={isSubmitting} onClick={handleCreate}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={!!editCategory}
        onOpenChange={(open) => {
          if (!open) setEditCategory(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>Update category details.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="edit-category-name">Name</Label>
              <Input
                id="edit-category-name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-category-description">Description</Label>
              <Input
                id="edit-category-description"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Optional description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditCategory(null)}>
              Cancel
            </Button>
            <Button loading={isSubmitting} onClick={handleUpdate}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog
        open={!!deleteId}
        onOpenChange={(open) => {
          if (!open) setDeleteId(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
