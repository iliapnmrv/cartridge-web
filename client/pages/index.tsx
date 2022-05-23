import { gql, useQuery } from "@apollo/client";
import moment from "moment";
import type { NextPage } from "next";
import { useState } from "react";
import { ISortConfig, useSortableData } from "../hooks/useSortable";
import styles from "../styles/Home.module.css";
import { ICartridge, LogTypesEnum } from "../types/cartridge";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import KeyboardControlKeyRoundedIcon from "@mui/icons-material/KeyboardControlKeyRounded";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import Modal from "../components/Modal/Modal";
import { Button, Skeleton, TextField } from "@mui/material";

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

  const [period, setPeriod] = useState<string>("");
  const [rowsExpanded, setRowsExpanded] = useState<number[]>([]);

  const [addCartridgeIsOpen, setAddCartridgeIsOpen] = useState<boolean>(false);

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
      <div className="filters">
        <button>Добавить картридж</button>
        <button>Press me</button>
      </div>
      <Modal
        handleClose={() => {
          setAddCartridgeIsOpen(false);
        }}
        isOpen={addCartridgeIsOpen}
        title="Добавить картридж"
      >
        <p style={{ marginTop: "10px" }}>
          Укажите количество поступивших картриджей
        </p>
        <TextField
          id="standard-basic"
          label="Количество картриджей"
          type="number"
          variant="standard"
          autoFocus
          fullWidth
          required
        />
        <TextField
          id="standard-basic"
          label="Примечания"
          type="number"
          variant="standard"
          autoFocus
          fullWidth
          style={{ marginTop: "10px" }}
        />
        <Button variant="contained" style={{ marginTop: "10px" }}>
          Добавить
        </Button>
      </Modal>

      <table>
        <thead>
          <th></th>
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
          <th>Действия</th>
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
                    <td
                      onClick={() =>
                        setRowsExpanded((prevValue) =>
                          prevValue.includes(id)
                            ? prevValue.filter((row) => row !== id)
                            : [...prevValue, id]
                        )
                      }
                    >
                      <span className={styles.expandable}>
                        {rowsExpanded.includes(id) ? (
                          <KeyboardControlKeyRoundedIcon />
                        ) : (
                          <KeyboardArrowDownRoundedIcon />
                        )}
                      </span>
                    </td>
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
                    <td>
                      <div className="actions">
                        <AddOutlinedIcon
                          onClick={() => setAddCartridgeIsOpen(true)}
                        />
                        <RemoveRoundedIcon
                          onClick={() => setAddCartridgeIsOpen(true)}
                        />
                        <DeleteOutlineOutlinedIcon />
                      </div>
                    </td>
                  </tr>
                  {rowsExpanded.includes(id) ? (
                    <>
                      {logs?.length ? (
                        <>
                          <tr key={id} className="noHover">
                            <td colSpan={8}>
                              <h3>История</h3>
                              <table>
                                <thead>
                                  <th>№ п/п</th>
                                  <th>Описание</th>
                                  <th>Количество</th>
                                  <th>Дата</th>
                                </thead>
                                <tbody>
                                  {logs?.map(
                                    (
                                      {
                                        id,
                                        description,
                                        amount,
                                        created_at,
                                        type,
                                      },
                                      index
                                    ) => (
                                      <tr key={id}>
                                        <td>{index + 1}</td>
                                        <td>{description}</td>
                                        <td>
                                          {type === LogTypesEnum.add
                                            ? "+"
                                            : "-"}
                                          {amount}
                                        </td>
                                        <td>
                                          {moment(created_at).format("LT")}
                                        </td>
                                      </tr>
                                    )
                                  )}
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </>
                      ) : (
                        <tr key={id} className="noHover">
                          <td colSpan={8}>
                            <h3>История отсутствует</h3>
                          </td>
                        </tr>
                      )}
                    </>
                  ) : null}
                </>
              );
            }
          )}
        </tbody>
      </table>
    </div>
  ) : (
    <>
      <Skeleton />
      <Skeleton />
      <Skeleton />
      <Skeleton />
    </>
  );
};

export default Home;
