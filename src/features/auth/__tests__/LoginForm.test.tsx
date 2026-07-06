import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../authSlice";
import LoginForm from "../components/LoginForm";

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, className, ...rest }: any) => {
      const { variants, initial, animate, transition, ...htmlProps } = rest;
      return <div className={className} {...htmlProps}>{children}</div>;
    },
    h3: ({ children, className, ...rest }: any) => {
      const { variants, initial, animate, transition, ...htmlProps } = rest;
      return <h3 className={className} {...htmlProps}>{children}</h3>;
    },
    p: ({ children, className, ...rest }: any) => {
      const { variants, initial, animate, transition, ...htmlProps } = rest;
      return <p className={className} {...htmlProps}>{children}</p>;
    },
  },
}));

vi.mock("../authApi", () => ({
  useLoginMutation: () => {
    const login = vi.fn().mockResolvedValue({
      data: {
        data: {
          token: "test-token",
          user: {
            _id: "1",
            name: "Test User",
            email: "test@example.com",
            role: "admin",
            isActive: true,
          },
        },
      },
    });
    return [login, { isLoading: false }];
  },
}));

function createMockStore() {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
  });
}

function renderLoginForm() {
  const store = createMockStore();
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    </Provider>
  );
}

describe("LoginForm", () => {
  it("renders email and password fields", () => {
    renderLoginForm();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Sign In" })
    ).toBeInTheDocument();
  });

  it("shows validation error for empty email", async () => {
    renderLoginForm();
    const submitButton = screen.getByRole("button", { name: "Sign In" });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText("Valid email required")).toBeInTheDocument();
    });
  });

  it("shows validation error for invalid email", async () => {
    renderLoginForm();
    const emailInput = screen.getByLabelText("Email");
    fireEvent.change(emailInput, { target: { value: "invalid" } });
    const form = emailInput.closest("form")!;
    fireEvent.submit(form);
    await waitFor(() => {
      expect(screen.getByText("Valid email required")).toBeInTheDocument();
    });
  });
});
