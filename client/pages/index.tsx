import { gql, useQuery } from "@apollo/client";
import moment from "moment";
import type { NextPage } from "next";
import { useState } from "react";
import { ISortConfig, useSortableData } from "../hooks/useSortable";
import styles from "../styles/Home.module.css";
import { ICartridge, LogTypesEnum } from "../types/cartridge";

type CartridgesData = {
  cartridge: ICartridge[];
};

const AllCartridgesQuery = gql`
  query {
    cartridge {
      id
      amount
      name
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

const Home = () => {
  const { data, loading, error } = useQuery<CartridgesData>(AllCartridgesQuery);

  console.log(error);
  console.log(data?.cartridge);

  const [period, setPeriod] = useState<string>("");

  interface IRequestSort {
    (key: string): void;
  }

  const {
    items,
    requestSort,
    sortConfig,
  }: {
    items: Array<
      ICartridge & {
        lastAddition: Date | undefined;
        lastSubtraction: Date | undefined;
      }
    >;
    requestSort: IRequestSort;
    sortConfig: ISortConfig;
  } = useSortableData(
    data?.cartridge.length
      ? data?.cartridge.map(({ name, amount, logs, info }, id) => ({
          id,
          name,
          amount,
          lastAddition: logs?.filter((log) => log.type === LogTypesEnum.add)?.[
            logs?.filter((log) => log.type === LogTypesEnum.add).length - 1
          ]?.created_at,
          lastSubtraction: logs?.filter(
            (log) => log.type === LogTypesEnum.sub
          )?.[logs?.filter((log) => log.type === LogTypesEnum.sub).length - 1]
            ?.created_at,
          info,
          logs,
        }))
      : []
  );

  const getClassNamesFor = (name: string) => {
    if (!sortConfig) {
      return;
    }
    return sortConfig.key === name ? sortConfig.direction : undefined;
  };

  return data ? (
    <div className={styles.container}>
      <table>
        <thead>
          <th
            onClick={() => requestSort("name")}
            className={getClassNamesFor("name")}
          >
            Наименование
          </th>
          <th
            onClick={() => requestSort("amount")}
            className={getClassNamesFor("amount")}
          >
            Количество
          </th>
          <th
            onClick={() => requestSort("lastAddition")}
            className={getClassNamesFor("lastAddition")}
          >
            Дата последней поставки
          </th>
          <th
            onClick={() => requestSort("lastSubtraction")}
            className={getClassNamesFor("lastSubtraction")}
          >
            Дата последнего расхода
          </th>
          <th>Статистика за период (пришло/выдано)</th>
          <th>Примечания</th>
        </thead>
        <tbody>
          {items.map(
            ({
              id,
              name,
              amount,
              lastAddition,
              lastSubtraction,
              info,
              logs,
            }) => {
              return (
                <>
                  <tr key={id}>
                    <td>{name}</td>
                    <td>{amount}</td>
                    <td>
                      {lastAddition
                        ? moment(lastAddition).format("LT")
                        : "Информация отсутствует"}
                    </td>
                    <td>
                      {lastSubtraction
                        ? moment(lastSubtraction).format("LT")
                        : "Информация отсутствует"}
                    </td>
                    <td>-</td>
                    <td>{info}</td>
                  </tr>
                </>
              );
            }
          )}
        </tbody>
      </table>
    </div>
  ) : (
    <>Loading</>
  );
};

export default Home;
