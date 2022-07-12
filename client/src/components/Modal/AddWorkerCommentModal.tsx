import { gql, useMutation } from "@apollo/client";
import { Button, TextField } from "@mui/material";
import { Form, Formik } from "formik";
import { UpdateWorkerMutation } from "lib/Mutations";
import { IAddWorkerCommentModal } from "pages/med";
import React, { Dispatch } from "react";
import Modal from "./Modal";

type Props = {
  addWorkerCommentModal: IAddWorkerCommentModal;
  setAddWorkerCommentModal: Dispatch<IAddWorkerCommentModal>;
};

interface AddComment {
  comment: string;
}

const AddWorkerCommentModal = ({
  addWorkerCommentModal,
  setAddWorkerCommentModal,
}: Props) => {
  const [
    updateWorker,
    { data: updateResponseData, loading: updateLoading, error: updateError },
  ] = useMutation(UpdateWorkerMutation);

  const updateWorkerComment = (comment: string) => {
    updateWorker({
      variables: {
        id: addWorkerCommentModal.id,
        comment,
      },
    });
  };

  return (
    <Modal
      handleClose={() => {
        setAddWorkerCommentModal({ id: 0, name: "", comment: "" });
      }}
      isOpen={addWorkerCommentModal.id !== 0}
      title="Добавить примечание"
    >
      <p style={{ marginTop: "10px" }}>
        Добавьте примечание к сотруднику {addWorkerCommentModal.name}
      </p>

      <Formik
        initialValues={{
          comment: addWorkerCommentModal.comment,
        }}
        enableReinitialize
        onSubmit={(values: AddComment) => {
          const { comment } = values;
          updateWorkerComment(comment);
          setAddWorkerCommentModal({ id: 0, name: "", comment: "" });
        }}
      >
        {({ handleChange, values }) => (
          <Form>
            <TextField
              id="comment"
              label="Примечания"
              type="text"
              variant="standard"
              fullWidth
              style={{ marginTop: "10px" }}
              onChange={(e) => handleChange(e)}
              value={values.comment}
            />
            <Button
              variant="contained"
              type="submit"
              style={{ marginTop: "10px" }}
            >
              Добавить
            </Button>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default AddWorkerCommentModal;
