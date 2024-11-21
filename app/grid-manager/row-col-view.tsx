import { useMutation, useSubscription } from "urql";
import { GetGridDataSubscription, UpdateColumnMutation, UpdateRowMutation } from "./graphql";

import RowColCreator from "./row-col-creator";
import { Link, useParams } from "@remix-run/react";
import { FormEvent, useState } from "react";
import { RowCol } from "~/shared/types";

export default function RowColView() {
  const { id } = useParams();
  const [newTitle, setNewTitle] = useState("");
  const [, updateRow] = useMutation(UpdateRowMutation);
  const [, updateColumn] = useMutation(UpdateColumnMutation);

  let lastHtml = "";

  const [{ data, fetching, error }] = useSubscription({
    query: GetGridDataSubscription,
    variables: { gridId: id },
  });

  if (fetching) return <div className={"alert alert-info"}>Loading rows and columns...</div>;

  if (error)
    return (
      <div className={"alert alert-danger"}>Error loading rows and columns: {error.message}</div>
    );

  const { Rows, GridColumns, Cells } = data.DataGrid_by_pk;

  const handleChange = (e: FormEvent<HTMLElement>) => {
    const html = e.currentTarget.innerHTML;
    if (html !== lastHtml) {
      setNewTitle(html);
    }
    lastHtml = html;
  };

  //Submit on blur; preference would be to add a button to contenteditable for submit or debounce to avoid double submit
  const handleSubmit = async (id: string, titleType: RowCol) => {
    if (titleType === "row") {
      await updateRow({ id, title: newTitle });
    } else {
      await updateColumn({ id, title: newTitle });
    }
  };

  return (
    <>
      <h2>Rows and Columns</h2>

      <div className="d-flex mb-4 p-2 justify-content-between align-items-end">
        <Link to={"/grids"}> Back</Link>
        <div className="d-flex gap-2">
          <RowColCreator gridId={id!} />
        </div>
      </div>

      <div className="d-grid overflow-y-scroll">
        <div className="grid-header bg-body-tertiary m-2 px-4 py-1 rounded-1">
          {GridColumns.map((col) => {
            return (
              <h5
                key={col.id}
                contentEditable={true}
                className={"d-inline-flex"}
                onInput={handleChange}
                onBlur={() => handleSubmit(col.id, "col")}
                dangerouslySetInnerHTML={{ __html: col.title }}
              />
            );
          })}
        </div>
        {Rows.map((row) => (
          <div className="bg-body-tertiary m-2 p-4 rounded-1" key={row.id}>
            <h5
              contentEditable={true}
              className={"d-inline-flex"}
              onInput={handleChange}
              onBlur={(e) => handleSubmit(e, row.id, "row")}
              dangerouslySetInnerHTML={{ __html: row.title }}
            />

            <div className="grid-row">
              {GridColumns.map((col) => {
                const cell = Cells.find((c) => c.row_id === row.id && c.column_id === col.id);
                return (
                  <div className="card grid-cell" key={col.id}>
                    <div className="card-body">
                      <p className={"mb-4"}>{cell?.content}</p>
                      <p>{cell?.comment}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
