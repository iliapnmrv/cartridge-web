import { ApolloError, gql, useMutation } from "@apollo/client";
import { Button, TextField } from "@mui/material";
import { Form, Formik } from "formik";
import { CreateCartridgeMutation } from "lib/Mutations";
import { AddCartridgeModal } from "pages";
import React, { Dispatch, SetStateAction, useEffect } from "react";
import { ICartridge } from "../../types/cartridge";
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

const CreateCartridgeModal = ({
  createModalVisible,
  setCreateModalVisible,
}: Props) => {
  const [
    createCartridge,
    { data: createResponseData, loading: createLoading, error: createError },
  ] = useMutation(CreateCartridgeMutation, {
    update(cache, { data: { createCartridge } }) {
      cache.modify({
        fields: {
          cartridge(existingCartridges = []) {
            const newCartridgeRef = cache.writeFragment({
              data: createCartridge,
              fragment: gql`
                fragment NewCartridge on Cartridge {
                  id
                  amount
                  name
                  info
                  logs {
                    id
                    description
                    amount
                    created_at
                    type
                  }
                }
              `,
            });
            return [...existingCartridges, newCartridgeRef];
          },
        },
      });
    },
  });

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
