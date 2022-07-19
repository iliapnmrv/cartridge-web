import { gql } from "@apollo/client";
import { IHarm, IWorker } from "types/worker";
import { ICartridge } from "../types/cartridge";

export type CartridgesData = {
  cartridge: ICartridge[];
};

export type WorkersData = {
  workers: IWorker[];
};

export type HarmsData = {
  harms: IHarm[];
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
      id
      tabNom
      name
      position
      shift
      lastMed
      isException
      harm {
        id
        position
        harm
        harmNum
      }
      comment
    }
  }
`;

export const AllHarmsQuery = gql`
  query findAllHarms {
    harms {
      id
      position
      harm
      harmNum
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
