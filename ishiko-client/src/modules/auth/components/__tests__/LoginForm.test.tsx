import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

jest.mock("@/services", () => ({
  __esmodule: true,
  useLoginMutation: jest.fn(() => [() => undefined]),
}));

import { LoginForm } from "../.";

it("renders form", () => {
  render(<LoginForm />);
  expect(screen.getByRole("form")).toBeInTheDocument();
});

it("renders username field", () => {
  render(<LoginForm />);
  expect(
    screen.getByLabelText("Username", { exact: false })
  ).toBeInTheDocument();
});

it("renders password field", () => {
  render(<LoginForm />);
  expect(
    screen.getByLabelText("Password", { exact: false })
  ).toBeInTheDocument();
});

it("renders submit button", () => {
  render(<LoginForm />);
  expect(screen.getByRole("button")).toBeInTheDocument();
});

it("renders link to sign up page", () => {
  render(<LoginForm />);
  expect(screen.getByRole("link")).toBeInTheDocument();
});

it("calls handler on submit", async () => {
  const user = userEvent.setup();
  const mockFn = jest.fn();
  render(<LoginForm onSubmit={mockFn} />);

  // fill in fields and submit
  await user.type(screen.getByLabelText("Username", { exact: false }), "test");
  await user.type(screen.getByLabelText("Password", { exact: false }), "test");
  await user.click(screen.getByRole("button"));

  expect(mockFn).toBeCalledTimes(1);
});

it("does not submit with empty fields", async () => {
  const user = userEvent.setup();
  let mockFn = jest.fn();
  render(<LoginForm onSubmit={mockFn} />);
  const btnSubmit = screen.getByRole("button");

  // both fields empty
  await user.click(btnSubmit);
  expect(mockFn).toBeCalledTimes(0);

  mockFn = jest.fn();
  render(<LoginForm onSubmit={mockFn} />);

  // username empty
  await user.type(screen.getByLabelText("Password", { exact: false }), "test");
  await user.click(btnSubmit);
  expect(mockFn).toBeCalledTimes(0);

  mockFn = jest.fn();
  render(<LoginForm onSubmit={mockFn} />);

  // password empty
  await user.type(screen.getByLabelText("Username", { exact: false }), "test");
  await user.click(btnSubmit);
  expect(mockFn).toBeCalledTimes(0);
});
