import { gql, useMutation } from "@apollo/client";
import { Button, TextField } from "@mui/material";
import { Form, Formik } from "formik";
import { UpdateCartridgeMutation } from "lib/Mutations";
import { AllCartridgesQuery, CartridgesData } from "lib/Queries";
import { AddCartridgeModal } from "pages";
import React, { Dispatch } from "react";
import Modal from "./Modal";

type Props = {
  addCartridgeModal: AddCartridgeModal;
  setAddCartridgeModal: Dispatch<AddCartridgeModal>;
};

interface AddCartridges {
  amount: number;
  description: string;
}

const UpdateCartridgeModal = ({
  addCartridgeModal,
  setAddCartridgeModal,
}: Props) => {
  const [
    updateCartridges,
    { data: updateResponseData, loading: updateLoading, error: updateError },
  ] = useMutation(UpdateCartridgeMutation);

  const updateCartridgesAmount = (amount: number, description?: string) => {
    updateCartridges({
      variables: {
        id: addCartridgeModal.id,
        amount,
        type: addCartridgeModal.type,
        description,
      },
    });
  };

  return (
    <Modal
      handleClose={() => {
        setAddCartridgeModal({ type: "sub", id: 0 });
      }}
      isOpen={addCartridgeModal.id !== 0}
      title="Добавить картридж"
    >
      <p style={{ marginTop: "10px" }}>
        Укажите количество{" "}
        {addCartridgeModal.type === "sub" ? "расходных" : "поступивших"}{" "}
        картриджей
      </p>
      <Formik
        initialValues={{
          amount: 0,
          description: "",
        }}
        onSubmit={(values: AddCartridges) => {
          const { amount, description } = values;
          updateCartridgesAmount(amount, description);
          setAddCartridgeModal({ type: "sub", id: 0 });
        }}
      >
        {({ handleChange }) => (
          <Form>
            <TextField
              id="amount"
              label="Количество картриджей"
              type="number"
              variant="standard"
              autoFocus
              fullWidth
              required
              onChange={(e) => handleChange(e)}
            />
            <TextField
              id="description"
              label="Примечания (не обязательно)"
              type="text"
              variant="standard"
              fullWidth
              style={{ marginTop: "10px" }}
              onChange={(e) => handleChange(e)}
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

export default UpdateCartridgeModal;
