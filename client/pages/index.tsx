import { gql, useMutation, useQuery } from "@apollo/client";
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
import {
  Button,
  ButtonGroup,
  MenuItem,
  Select,
  SelectChangeEvent,
  Skeleton,
  TextField,
} from "@mui/material";
import { periods } from "../constants/index";
import { Field, Form, Formik, FormikHelpers } from "formik";
import "moment/locale/ru";
import UpdateCartridgeModal from "../components/Modal/UpdateCartridgeModal";
moment.locale("ru");

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

export interface AddCartridgeModal {
  type: "sub" | "add";
  id: number;
}

const Home = () => {
  const { data, loading, error } = useQuery<CartridgesData>(AllCartridgesQuery);

  const [period, setPeriod] = useState<string>("0");
  const [rowsExpanded, setRowsExpanded] = useState<number[]>([]);

  const [addCartridgeModal, setAddCartridgeModal] = useState<AddCartridgeModal>(
    { type: "add", id: 0 }
  );

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
      ? data?.cartridge.map(({ id, name, amount, logs, info }) => ({
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

  const handlePeriodChange = (event: SelectChangeEvent) => {
    setPeriod(event.target.value as string);
  };

  return data ? (
    <div className={styles.container}>
      <h1>Картриджи</h1>
      <div className="filters">
        <button>Добавить картридж</button>
        <Select
          id="demo-simple-select"
          value={period}
          label="Период"
          placeholder="Период"
          onChange={handlePeriodChange}
        >
          {periods.map((period, index) => (
            <MenuItem key={index} value={period.value}>
              {period.label}
            </MenuItem>
          ))}
        </Select>
      </div>

      <UpdateCartridgeModal
        setAddCartridgeModal={setAddCartridgeModal}
        addCartridgeModal={addCartridgeModal}
      />

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
          <th>
            Статистика за период <br /> (пришло/выдано)
          </th>
          <th>Примечания</th>
          <th align="right">Действия</th>
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
                        ? moment(lastAddition).format("lll")
                        : "Информация отсутствует"}
                    </td>
                    <td>
                      {lastSubtraction
                        ? moment(lastSubtraction).format("lll")
                        : "Информация отсутствует"}
                    </td>
                    <td>
                      {logs?.reduce(
                        (sum, log) =>
                          log.type === "add" ? (sum += log.amount) : (sum += 0),
                        0
                      )}{" "}
                      /{" "}
                      {logs?.reduce(
                        (sum, log) =>
                          log.type === "sub" ? (sum += log.amount) : (sum += 0),
                        0
                      )}
                    </td>
                    <td>{info}</td>
                    <td>
                      <div className="actions">
                        <ButtonGroup
                          size="small"
                          variant="text"
                          aria-label="text button group"
                        >
                          <Button>
                            <AddOutlinedIcon
                              onClick={() =>
                                setAddCartridgeModal({ type: "add", id })
                              }
                            />
                          </Button>
                          <Button>
                            <RemoveRoundedIcon
                              onClick={() =>
                                setAddCartridgeModal({ type: "sub", id })
                              }
                            />
                          </Button>
                          <Button>
                            <DeleteOutlineOutlinedIcon color="error" />
                          </Button>
                        </ButtonGroup>
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
                                          {moment(created_at).format("lll")}
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
