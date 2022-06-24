import { gql, useMutation } from "@apollo/client";
import { Button, TextField } from "@mui/material";
import { RemoveCartridgeMutation } from "lib/Mutations";
import { AllCartridgesQuery, CartridgesData } from "lib/Queries";
import { DeleteCartridgeModal } from "pages/cartridge/index";
import React, { Dispatch } from "react";
import Modal from "./Modal";

type Props = {
  deleteCartridgeModal: DeleteCartridgeModal;
  setDeleteCartridgeModal: Dispatch<DeleteCartridgeModal>;
};

const DeleteCartridgeModal = ({
  setDeleteCartridgeModal,
  deleteCartridgeModal,
}: Props) => {
  const [
    removeCartridge,
    { data: removeResponseData, loading: removeLoading, error: removeError },
  ] = useMutation(RemoveCartridgeMutation);

  return (
    <Modal
      handleClose={() => {
        setDeleteCartridgeModal({ id: 0, name: "" });
      }}
      isOpen={deleteCartridgeModal.id !== 0}
      title={`Удаление картриджа`}
    >
      <p style={{ marginTop: "10px" }}>
        Вы уверены, что хотите удалить картридж с наименованием{" "}
        {deleteCartridgeModal.name}?
      </p>
      <div
        className="buttons"
        style={{
          marginTop: "10px",
          justifyContent: "space-between",
          display: "flex",
        }}
      >
        <Button variant="contained">Не удалять</Button>
        <Button
          variant="outlined"
          color="error"
          onClick={() => {
            removeCartridge({
              variables: { id: deleteCartridgeModal.id },
              update: (cache, { data: { deleteCartridge } }) => {
                const cartridgeData = cache.readQuery<CartridgesData>({
                  query: AllCartridgesQuery,
                });

                cache.writeQuery<CartridgesData>({
                  query: AllCartridgesQuery,
                  data: {
                    cartridge: [
                      ...cartridgeData!.cartridge.filter(
                        (item) => item.id !== deleteCartridgeModal.id
                      ),
                    ],
                  },
                });
              },
            }),
              setDeleteCartridgeModal({ id: 0, name: "" });
          }}
        >
          Удалить
        </Button>
      </div>
    </Modal>
  );
};

export default DeleteCartridgeModal;
