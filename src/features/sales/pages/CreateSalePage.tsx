import { useNavigate } from "react-router-dom";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import PageHeader from "@/components/shared/PageHeader";
import ProductSelector from "../components/ProductSelector";
import SaleCart from "../components/SaleCart";
import { useCreateSaleMutation } from "../saleApi";
import type { Product } from "@/types";

const saleFormSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string(),
        productName: z.string(),
        quantity: z.number().min(1),
        unitPrice: z.number(),
        stockQuantity: z.number(),
      })
    )
    .min(1, "Add at least one product"),
});

type SaleFormValues = z.output<typeof saleFormSchema>;

export default function CreateSalePage() {
  const navigate = useNavigate();
  const [createSale, { isLoading: isSubmitting }] = useCreateSaleMutation();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SaleFormValues>({
    resolver: zodResolver(saleFormSchema),
    defaultValues: {
      items: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const watchedItems = watch("items");

  const grandTotal = (watchedItems || []).reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  const excludeIds = fields.map((f) => f.productId);

  const handleAddProduct = (product: Product) => {
    append({
      productId: product._id,
      productName: product.name,
      quantity: 1,
      unitPrice: product.sellingPrice,
      stockQuantity: product.stockQuantity,
    });
  };

  const onSubmit = async (data: SaleFormValues) => {
    try {
      await createSale({
        items: data.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      }).unwrap();
      toast.success("Sale created successfully");
      navigate("/sales");
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "data" in err
          ? (err as { data?: { message?: string } }).data?.message
          : "Failed to create sale";
      toast.error(message || "Failed to create sale");
    }
  };

  return (
    <div>
      <PageHeader>New Sale</PageHeader>
      <div className="flex gap-6 items-start">
        <div className="w-2/5">
          <div className="rounded-xl border bg-card p-4">
            <h2 className="font-semibold mb-3">Add Products</h2>
            <ProductSelector
              onSelect={handleAddProduct}
              excludeIds={excludeIds}
            />
          </div>
        </div>
        <div className="w-3/5">
          <div className="rounded-xl border bg-card p-4">
            <h2 className="font-semibold mb-3">Cart</h2>
            {errors.items?.root && (
              <p className="text-sm text-destructive mb-2">
                {errors.items.root.message}
              </p>
            )}
            {errors.items?.message && (
              <p className="text-sm text-destructive mb-2">
                {errors.items.message}
              </p>
            )}
            <SaleCart
              fields={fields}
              remove={remove}
              control={control as any}
              setValue={setValue as any}
              grandTotal={grandTotal}
              isSubmitting={isSubmitting}
              onSubmit={handleSubmit(onSubmit)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
