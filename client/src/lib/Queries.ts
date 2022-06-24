import { gql } from "@apollo/client";
import { IWorker } from "types/worker";
import { ICartridge } from "../types/cartridge";

export type CartridgesData = {
  cartridge: ICartridge[];
};

export type WorkersData = {
  workers: IWorker[];
};

export const AllCartridgesQuery = gql`
  query findAllCartridges {
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

export const AllWorkersQuery = gql`
  query findAllWorkers {
    workers {
      tabNom
      name
      position
      dateOfBirth
      shift
      lastMed
      isException
      harm {
        id
      }
    }
  }
`;

export const SearchCartridgesQuery = gql`
  query searchCartridges($field: String!) {
    searchCartridges(field: $field) {
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
