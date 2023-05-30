import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import LoginPage from "../login";

it("renders page", () => {
  render(<LoginPage />);

  expect(screen.getByRole("article")).toBeInTheDocument();
  expect(screen.getByRole("heading")).toBeInTheDocument();
  expect(screen.getByRole("form")).toBeInTheDocument();
});
