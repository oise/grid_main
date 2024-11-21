import { fireEvent, render, screen } from "@testing-library/react";
import { Provider, useMutation, useSubscription } from "urql";
import { urqlClient } from "../../utils/urqlClient";
import { describe, it, vi } from "vitest";
import GridManager from "../grid-manager";
import { act, ReactElement } from "react";

const renderWithUrql = (component: ReactElement) => {
  return render(<Provider value={urqlClient}>{component}</Provider>);
};

vi.mock("urql", async (importOriginal) => ({
  ...(await importOriginal<typeof import("urql")>()),
  useSubscription: vi.fn(),
  useMutation: vi
    .fn()
    .mockReturnValue([{ fetching: false, data: null, error: null }, vi.fn().mockResolvedValue({})]),
}));

vi.mock("@remix-run/react", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@remix-run/react")>()),
  useNavigate: () => vi.fn(),
}));

const mockedUseSubscription = vi.mocked(useSubscription);
const mockedUseMutation = vi.mocked(useMutation);

describe("Index page", () => {
  it("displays loading state initially", () => {
    mockedUseSubscription.mockReturnValue([{ stale: true, fetching: true }, vi.fn()]);

    renderWithUrql(<GridManager />);

    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("should display error state when query fails", () => {
    mockedUseSubscription.mockReturnValue([
      {
        fetching: false,
        stale: true,
        error: {
          message: "Failed to fetch",
          name: "whaetever",
          graphQLErrors: [],
        },
      },
      vi.fn(),
    ]);

    renderWithUrql(<GridManager />);

    expect(screen.getByTestId("error")).toHaveTextContent("Error: Failed to fetch");
  });
  it("should display a list of grids when data is fetched", () => {
    const mockDataGrids = [
      { id: "1", name: "Grid One" },
      { id: "2", name: "Grid Two" },
    ];

    mockedUseSubscription.mockReturnValue([
      { fetching: false, data: { DataGrid: mockDataGrids }, stale: false },
      vi.fn(),
    ]);

    renderWithUrql(<GridManager />);
    const gridListItems = screen.getAllByRole("listitem");
    expect(gridListItems).toHaveLength(mockDataGrids.length);
  });

  it("should call addGrid mutation with the correct params", async () => {
    mockedUseSubscription.mockReturnValue([
      { fetching: false, stale: false, data: { DataGrid: [] } },
      vi.fn(),
    ]);

    const addGridMock = vi.fn().mockResolvedValue({});

    mockedUseMutation.mockReturnValue([{ fetching: false, stale: false }, addGridMock]);

    renderWithUrql(<GridManager />);

    act(() => {
      fireEvent.change(screen.getByTestId("grid-input"), {
        target: { value: "New Grid" },
      });

      fireEvent.click(screen.getByTestId("add-button"));
    });

    expect(screen.getByTestId("grid-input")).toHaveValue("New Grid");

    expect(addGridMock).toHaveBeenCalledWith({ name: "New Grid" });
  });
});
