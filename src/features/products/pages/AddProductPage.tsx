import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useCreateProductMutation } from "../productApi";
import ProductForm from "../components/ProductForm";

export default function AddProductPage() {
  const navigate = useNavigate();
  const [createProduct, { isLoading }] = useCreateProductMutation();

  const handleSubmit = async (formData: FormData) => {
    try {
      await createProduct(formData).unwrap();
      toast.success("Product created successfully");
      navigate("/products");
    } catch (err) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ??
        "Failed to create product";
      toast.error(message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Add Product</h1>
      <div className="rounded-xl border bg-card p-6">
        <ProductForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </div>
  );
}
