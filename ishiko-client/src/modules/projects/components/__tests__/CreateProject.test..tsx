import React from "react";
import { act } from "react-dom/test-utils";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

const mockCreateProjectFn = jest.fn();

jest.mock("@/services", () => ({
  __esmodule: true,
  useCreateProjectMutation: jest.fn(() => [mockCreateProjectFn, undefined]),
}));

import CreateProject from "../CreateProject";

it("renders button", () => {
  render(<CreateProject />);
  expect(screen.getByRole("button")).toBeInTheDocument();
});

it("opens dialog on button click", async () => {
  const user = userEvent.setup();
  render(<CreateProject />);

  await user.click(screen.getByRole("button"));
  expect(screen.getByRole("dialog")).toBeInTheDocument();
  expect(screen.getByRole("textbox")).toBeInTheDocument();
  expect(screen.getByText("Cancel")).toBeInTheDocument();
  expect(screen.getByText("Create Project")).toBeInTheDocument();
});

it("closes dialog on cancel button click", async () => {
  const user = userEvent.setup();
  render(<CreateProject />);

  await user.click(screen.getByRole("button"));
  const cancelButton = screen.getByText("Cancel");
  await user.click(cancelButton);
  await waitFor(() => {
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});

it("closes dialog on submit", async () => {
  const user = userEvent.setup();
  render(<CreateProject />);

  await user.click(screen.getByRole("button"));
  const titleTextField = screen.getByRole("textbox");
  await user.type(titleTextField, "project 1");
  await user.click(screen.getByText("Create Project"));
  await waitFor(() => {
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});

it("creates project on submit", async () => {
  mockCreateProjectFn.mockReset();
  const user = userEvent.setup();
  render(<CreateProject />);

  await user.click(screen.getByRole("button"));
  const titleTextField = screen.getByRole("textbox");
  await user.type(titleTextField, "project 1");
  await user.click(screen.getByText("Create Project"));
  await waitFor(() => {
    expect(mockCreateProjectFn).toHaveBeenCalledTimes(1);
    expect(mockCreateProjectFn).toBeCalledWith({ title: "project 1" });
  });
});
