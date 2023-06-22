import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

jest.mock("@/services", () => ({
  __esmodule: true,
  useGetProjectsQuery: jest.fn(() => ({
    data: [
      { id: 1, title: "project 1" },
      { id: 2, title: "project 2" },
    ],
  })),
}));

jest.mock("@/hooks", () => ({
  __esmodule: true,
  useAppSelector: jest.fn(() => 1),
}));

import Projects from "../Projects";

it("renders projects", () => {
  render(<Projects />);

  expect(screen.getByRole("list")).toBeInTheDocument();
  expect(screen.getAllByRole("listitem").length).toBe(2);
  expect(screen.getByText("project 1")).toBeInTheDocument();
  expect(screen.getByText("project 2")).toBeInTheDocument();
});
