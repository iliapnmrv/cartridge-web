import { gql, useMutation } from "@apollo/client";

export const RemoveCartridgeMutation = gql`
  mutation removeCartridge($id: Int!) {
    removeCartridge(id: $id)
  }
`;

export const CreateCartridgeMutation = gql`
  mutation createCartridge($name: String!, $amount: Float!, $info: String) {
    createCartridge(
      createCartridgeInput: { name: $name, amount: $amount, info: $info }
    ) {
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
  }
`;

export const UpdateCartridgeAmountMutation = gql`
  mutation updateCartridge(
    $id: Float!
    $amount: Float!
    $type: CartridgeAction!
    $description: String
  ) {
    updateCartridge(
      updateCartridgeInput: {
        id: $id
        amount: $amount
        type: $type
        description: $description
      }
    ) {
      id
      amount
      logs {
        id
        description
        amount
        created_at
        type
      }
    }
  }
`;

export const UpdateCartridgeMutation = gql`
  mutation updateCartridge(
    $id: Float!
    $name: String
    $info: String
    $amount: Float
  ) {
    updateCartridge(
      updateCartridgeInput: {
        id: $id
        name: $name
        info: $info
        amount: $amount
      }
    ) {
      id
      name
      info
      amount
    }
  }
`;

export const UpdateWorkerMutation = gql`
  mutation updateWorker(
    $id: Float!
    $lastMed: DateTime
    $harmId: Float
    $isException: Boolean
  ) {
    updateWorker(
      updateWorkerInput: {
        id: $id
        lastMed: $lastMed
        harmId: $harmId
        isException: $isException
      }
    ) {
      id
      lastMed
      isException
      harm {
        harm
        harmNum
      }
    }
  }
`;
