import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

jest.mock("@/services", () => ({
  __esmodule: true,
  useGetCsrfTokenQuery: jest.fn(() => ({
    data: undefined,
    error: undefined,
    isLoading: undefined,
  })),
  useLoginMutation: jest.fn(() => [() => undefined]),
}));

import LoginPage from "../login";

it("renders page", () => {
  render(<LoginPage />);

  expect(screen.getByRole("article")).toBeInTheDocument();
  expect(screen.getByRole("heading")).toBeInTheDocument();
  expect(screen.getByRole("form")).toBeInTheDocument();
  expect(screen.getByRole("banner")).toBeInTheDocument();
});
