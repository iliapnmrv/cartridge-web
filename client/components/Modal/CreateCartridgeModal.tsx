import { gql, useMutation } from "@apollo/client";
import { Button, TextField } from "@mui/material";
import { Form, Formik } from "formik";
import { AddCartridgeModal } from "pages";
import React, { Dispatch } from "react";
import Modal from "./Modal";

type Props = {
  createModalVisible: boolean;
  setCreateModalVisible: Dispatch<boolean>;
};

interface CreateCartridges {
  amount: number;
  name: string;
  info: string;
}

const UpdateCartridgeMutation = gql`
  mutation createCartridge($name: String!, $amount: Float!, $info: String) {
    createCartridge(
      createCartridgeInput: { name: $name, amount: $amount, info: $info }
    ) {
      id
      amount
      name
      info
    }
  }
`;

const CreateCartridgeModal = ({
  createModalVisible,
  setCreateModalVisible,
}: Props) => {
  const [
    createCartridge,
    { data: updateResponseData, loading: updateLoading, error: updateError },
  ] = useMutation(UpdateCartridgeMutation);

  return (
    <Modal
      handleClose={() => {
        setCreateModalVisible(false);
      }}
      isOpen={createModalVisible}
      title="Добавить картридж"
    >
      <p style={{ marginTop: "10px" }}>Введите данные картриджа</p>
      <Formik
        initialValues={{
          amount: 0,
          name: "",
          info: "",
        }}
        onSubmit={(values: CreateCartridges) => {
          const { amount, info, name } = values;
          createCartridge({
            variables: {
              amount,
              info,
              name,
            },
          });
          setCreateModalVisible(false);
        }}
      >
        {({ handleChange }) => (
          <Form>
            <TextField
              id="name"
              label="Наименование"
              type="text"
              variant="standard"
              autoFocus
              fullWidth
              required
              style={{ marginTop: "10px" }}
              onChange={(e) => handleChange(e)}
            />
            <TextField
              id="amount"
              label="Количество картриджей"
              type="number"
              variant="standard"
              fullWidth
              required
              defaultValue={0}
              style={{ marginTop: "10px" }}
              onChange={(e) => handleChange(e)}
            />
            <TextField
              id="info"
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

export default CreateCartridgeModal;
