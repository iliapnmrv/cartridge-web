import { gql, useQuery } from "@apollo/client";
import moment from "moment";
import type { NextPage } from "next";
import { useState } from "react";
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

  return data ? (
    <div>
      <table>
        <thead>
          <th>Наименование</th>
          <th>Количество</th>
          <th>Дата последней поставки</th>
          <th>Дата последнего расхода</th>
          <th>Статистика за период (пришло/выдано)</th>
          <th>Примечания</th>
        </thead>
        <tbody>
          {data?.cartridge.map((cartridge) => {
            const lastSubtraction = cartridge.logs?.filter(
              (log) => log.type === LogTypesEnum.sub
            )?.[
              cartridge.logs?.filter((log) => log.type === LogTypesEnum.sub)
                .length - 1
            ]?.created_at;

            const lastAddition = cartridge.logs?.filter(
              (log) => log.type === LogTypesEnum.add
            )?.[
              cartridge.logs?.filter((log) => log.type === LogTypesEnum.add)
                .length - 1
            ]?.created_at;

            return (
              <>
                <tr key={cartridge.id}>
                  <td>{cartridge.name}</td>
                  <td>{cartridge.amount}</td>
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
                  <td>{cartridge.amount}</td>
                  <td>{cartridge.info}</td>
                </tr>
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  ) : (
    <>Loading</>
  );
};

export default Home;
