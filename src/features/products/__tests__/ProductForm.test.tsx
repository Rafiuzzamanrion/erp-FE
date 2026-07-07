import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import ProductForm from "../components/ProductForm";
import authReducer from "@/features/auth/authSlice";

vi.mock("@/components/shared/ImageUploader", () => ({
  ImageUploader: () => <div data-testid="image-uploader">ImageUploader</div>,
}));

vi.mock("@/features/categories/categoryApi", () => ({
  useGetCategoriesQuery: () => ({
    data: [
      { _id: "1", name: "Electronics", description: "" },
      { _id: "2", name: "Accessories", description: "" },
    ],
    isLoading: false,
  }),
}));

function createTestStore() {
  return configureStore({
    reducer: {
      auth: authReducer,
      api: () => ({}),
    },
    preloadedState: {
      auth: {
        user: null,
        token: "test-token",
        isAuthenticated: false,
        isLoading: false,
        error: null,
      },
    },
  });
}

function renderForm(props: Partial<Parameters<typeof ProductForm>[0]> = {}) {
  return render(
    <Provider store={createTestStore()}>
      <MemoryRouter>
        <ProductForm onSubmit={vi.fn()} {...props} />
      </MemoryRouter>
    </Provider>
  );
}

describe("ProductForm", () => {
  it("renders all fields (name, sku, category, prices, stock)", () => {
    renderForm();
    expect(screen.getByLabelText("Product Name")).toBeInTheDocument();
    expect(screen.getByLabelText("SKU")).toBeInTheDocument();
    expect(screen.getByLabelText("Category")).toBeInTheDocument();
    expect(screen.getByLabelText("Purchase Price")).toBeInTheDocument();
    expect(screen.getByLabelText("Selling Price")).toBeInTheDocument();
    expect(screen.getByLabelText("Stock Quantity")).toBeInTheDocument();
    expect(screen.getByTestId("image-uploader")).toBeInTheDocument();
  });

  it("shows validation errors when submitting empty form", async () => {
    renderForm();
    const submitButton = screen.getByRole("button", { name: "Create Product" });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText("Name is required")).toBeInTheDocument();
    });
    expect(screen.getByText("SKU is required")).toBeInTheDocument();
    expect(screen.getByText("Category is required")).toBeInTheDocument();
  });

  it('shows "Create Product" button when no initialData', () => {
    renderForm();
    expect(
      screen.getByRole("button", { name: "Create Product" })
    ).toBeInTheDocument();
  });

  it('shows "Update Product" button when initialData provided', () => {
    const initialData = {
      _id: "1",
      name: "Existing Product",
      sku: "SKU-001",
      category: "Electronics",
      purchasePrice: 100,
      sellingPrice: 150,
      stockQuantity: 10,
      imageUrl: "",
      imagePublicId: "",
      createdBy: "user1",
      createdAt: "2024-01-01",
      updatedAt: "2024-01-01",
    };
    renderForm({ initialData });
    expect(
      screen.getByRole("button", { name: "Update Product" })
    ).toBeInTheDocument();
  });
});
