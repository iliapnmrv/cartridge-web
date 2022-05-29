import { gql } from "@apollo/client";
import { ICartridge } from "../types/cartridge";

export type CartridgesData = {
  cartridge: ICartridge[];
};

export const AllCartridgesQuery = gql`
  query {
    cartridge {
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
