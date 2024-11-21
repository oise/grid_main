import { FormEvent, MouseEvent, useState } from "react";
import { useMutation, useSubscription } from "urql";
import { AddDataGridMutation, DataGridSubscription } from "./graphql";
import { useNavigate } from "@remix-run/react";
import { Button } from "~/shared/button";

export default function GridManager() {
  const [gridName, setGridName] = useState("");
  const [{ data, fetching, error }] = useSubscription({ query: DataGridSubscription });

  const navigate = useNavigate();

  const [, addGrid] = useMutation(AddDataGridMutation);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!gridName.trim()) return;

    const { error } = await addGrid({ name: gridName });

    if (!error) setGridName(""); // Clear input if the mutation is successful
  };

  const handleSelect = (e: MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLLIElement;
    if (target.tagName.toLowerCase() === "li") {
      const id = target.attributes.getNamedItem("data-id")?.value;
      navigate(`/grids/${id}`);
    }
  };

  return (
    <div className="container-fluid">
      <h2>Data Grids</h2>

      {/* Loading and Error States */}
      {fetching && (
        <div className="alert alert-info" data-testid="loading">
          Loading...
        </div>
      )}
      {error && (
        <div className="alert alert-error" data-testid="error">
          Error: {error.message}
        </div>
      )}

      <div className="row">
        <div className="col-8">
          <div onClick={handleSelect} role="group">
            <ul data-testid="grid-list" className="list-group">
              {data?.DataGrid?.map((grid: { id: string; name: string }) => (
                <li
                  key={grid.id}
                  data-id={grid.id}
                  className="list-group-item list-group-item-action cursor-p"
                >
                  {grid.name}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="col-4">
          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-auto">
              <input
                type="text"
                value={gridName}
                onChange={(e) => setGridName(e.target.value)}
                placeholder="Enter grid name"
                className="form-control form-control-lg"
                data-testid="grid-input"
              />
            </div>
            <div className="col-auto mt-4">
              <Button data-testid="add-button">Add Data Grid</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
