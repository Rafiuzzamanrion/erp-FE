import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import type { Control, UseFormSetValue } from "react-hook-form";
import { Controller } from "react-hook-form";
import { cn } from "@/lib/utils";

interface SaleCartField {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  stockQuantity: number;
}

interface SaleCartProps {
  fields: SaleCartField[];
  remove: (index: number) => void;
  control: Control<any>;
  setValue: UseFormSetValue<any>;
  grandTotal: number;
  isSubmitting: boolean;
  onSubmit: () => void;
}

export default function SaleCart({
  fields,
  remove,
  control,
  setValue,
  grandTotal,
  isSubmitting,
  onSubmit,
}: SaleCartProps) {
  if (fields.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center border rounded-xl bg-muted/20">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-3">
          <ShoppingCart className="h-6 w-6" />
        </div>
        <h3 className="font-medium">Your cart is empty</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Search and add products to start a sale.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {fields.map((item, index) => (
          <div
            key={item.id}
            className="flex items-center gap-3 p-3 border rounded-xl bg-card hover:shadow-sm transition-shadow"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{item.productName}</p>
              <p className="text-xs text-muted-foreground">
                {formatCurrency(item.unitPrice)} each ·{" "}
                <span
                  className={cn(
                    item.stockQuantity <= 5 && "text-warning font-medium"
                  )}
                >
                  {item.stockQuantity} in stock
                </span>
              </p>
            </div>

            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8"
                aria-label="Decrease quantity"
                disabled={item.quantity <= 1}
                onClick={() =>
                  setValue(`items.${index}.quantity`, item.quantity - 1)
                }
              >
                <Minus className="h-3 w-3" />
              </Button>
              <Controller
                control={control}
                name={`items.${index}.quantity`}
                render={({ field }) => (
                  <Input
                    type="number"
                    min={1}
                    max={item.stockQuantity}
                    className="h-8 w-14 text-center px-1 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    {...field}
                    value={field.value}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val >= 1 && val <= item.stockQuantity) {
                        field.onChange(val);
                      }
                    }}
                  />
                )}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8"
                aria-label="Increase quantity"
                disabled={item.quantity >= item.stockQuantity}
                onClick={() =>
                  setValue(`items.${index}.quantity`, item.quantity + 1)
                }
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>

            <div className="w-20 text-right">
              <p className="text-sm font-semibold">
                {formatCurrency(item.unitPrice * item.quantity)}
              </p>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive"
              aria-label={`Remove ${item.productName}`}
              onClick={() => remove(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <Separator />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Items</span>
          <Badge variant="secondary">{fields.length}</Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold">Grand Total</span>
          <span className="text-2xl font-bold text-primary">
            {formatCurrency(grandTotal)}
          </span>
        </div>
      </div>

      <Button
        className="w-full h-11 text-base"
        disabled={fields.length === 0}
        loading={isSubmitting}
        onClick={onSubmit}
        type="button"
      >
        <ShoppingCart className="h-4 w-4 mr-2" />
        Create Sale
      </Button>
    </div>
  );
}
