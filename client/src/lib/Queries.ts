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

export type ShiftsData = {
  shifts: { shift: string }[];
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
  query findAllWorkers($offset: Int, $limit: Int) {
    workers(offset: $offset, limit: $limit) {
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

export const AllShiftsQuery = gql`
  query findAllShifts {
    shifts {
      shift
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

export const FilterWorkersQuery = gql`
  query filterWorkers($name: String, $date: DateTime, $shifts: [String!]) {
    filterWorkers(filters: { name: $name, date: $date, shifts: $shifts }) {
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
