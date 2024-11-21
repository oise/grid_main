import { useMutation } from "urql";
import { AddColumnMutation, AddRowMutation } from "~/grid-manager/graphql";
import { Button } from "~/shared/button";
import { Modal } from "~/shared/modal";
import { FormEvent, useState } from "react";
import { RowCol } from "~/shared/types";

const RowColCreator = ({ gridId }: { gridId: string }) => {
  const [, addRow] = useMutation(AddRowMutation);
  const [, addColumn] = useMutation(AddColumnMutation);
  const [title, setTitle] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [rowOrCol, setRowOrCol] = useState<RowCol>("row");
  const [formError, setFormError] = useState<string | undefined>("");

  const handlePopView = (value: RowCol) => {
    setRowOrCol(value);
    setIsOpen(true);
    setFormError("");
    setTitle("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!title) {
      setFormError("Please enter a title!");
    }

    if (title && rowOrCol === "col") {
      const { error } = await addColumn({ variables: { gridId, title } });
      setFormError(error!.message);
      if (!error) setIsOpen(false);
    }

    if (title && rowOrCol === "row") {
      const { error } = await addRow({ variables: { gridId, title } });
      setFormError(error?.message);
      if (!error) setIsOpen(false);
    }
  };

  return (
    <>
      <Modal title={`Add ${rowOrCol}`} isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <form onSubmit={handleSubmit}>
          {formError && <div className="text-danger mb-4">{formError}</div>}
          <div className="mb-3">
            <label htmlFor="addItem" className="form-label">
              Enter title
            </label>
            <input
              className="form-control form-control-lg"
              onChange={(e) => setTitle(e.target.value)}
              placeholder="title"
            />
          </div>
          <div className="mb-3">
            <Button type={"submit"}>Submit</Button>
          </div>
        </form>
      </Modal>
      <Button onClick={() => handlePopView("row")}>Add Row</Button>
      <Button onClick={() => handlePopView("col")}>Add Column</Button>
    </>
  );
};
export default RowColCreator;
