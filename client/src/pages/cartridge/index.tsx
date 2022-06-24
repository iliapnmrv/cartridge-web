import { gql, useLazyQuery, useMutation, useQuery } from "@apollo/client";
import moment from "moment";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { ISortConfig, useSortableData } from "hooks/useSortable";
import styles from "styles/Home.module.css";
import { ICartridge, LogTypesEnum } from "types/cartridge";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import KeyboardControlKeyRoundedIcon from "@mui/icons-material/KeyboardControlKeyRounded";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import {
  Button,
  ButtonGroup,
  Checkbox,
  Fab,
  MenuItem,
  SelectChangeEvent,
  Skeleton,
  TextField,
} from "@mui/material";
import { periods } from "constants/index";
import "moment/locale/ru";
import DoneRoundedIcon from "@mui/icons-material/DoneRounded";
import CreateCartridgeModal from "components/Modal/CreateCartridgeModal";
import DeleteCartridgeModal from "components/Modal/DeleteCartridgeModal";
import {
  AllCartridgesQuery,
  CartridgesData,
  SearchCartridgesQuery,
} from "lib/Queries";
import {
  UpdateCartridgeAmountMutation,
  UpdateCartridgeMutation,
} from "lib/Mutations";
import { QRCodeSVG } from "qrcode.react";
import CreateReport from "components/CreateReport/CreateReport";
import UpdateCartridgeModal from "components/Modal/UpdateCartridgeModal";
moment.locale("ru");

export interface AddCartridgeModal {
  type: "sub" | "add";
  id: number;
}
export interface DeleteCartridgeModal {
  name: string;
  id: number;
}

export interface EditableField {
  id: number;
  fieldName: string;
  value: string | number | undefined;
}

export interface IRowsSelected {
  id: number;
  name: string;
  value: string | number | undefined;
}

const Home = () => {
  const { data, loading, error, refetch } =
    useQuery<CartridgesData>(AllCartridgesQuery);
  const [
    updateCartridges,
    { data: updateResponseData, loading: updateLoading, error: updateError },
  ] = useMutation(UpdateCartridgeMutation);
  const [executeSearch, { data: searchCartridges }] = useLazyQuery(
    SearchCartridgesQuery
  );
  const [cartridgesData, setCartridgesData] = useState<ICartridge[]>([]);

  useEffect(() => {
    data?.cartridge ? setCartridgesData(data.cartridge) : null;
  }, [data]);

  useEffect(() => {
    searchCartridges?.searchCartridges
      ? setCartridgesData(searchCartridges.searchCartridges)
      : null;
  }, [searchCartridges]);

  const updateCartridgesData = () => {
    updateCartridges({
      variables: {
        id: editableField.id,
        [editableField.fieldName]: editableField.value
          ? editableField.value
          : "",
      },
    });
    setEditableField({
      id: 0,
      fieldName: "",
      value: "",
    });
  };

  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  const [deleteCartridgeModal, setDeleteCartridgeModal] =
    useState<DeleteCartridgeModal>({ id: 0, name: "" });
  const [period, setPeriod] = useState<string>("9999");
  const [editableField, setEditableField] = useState<EditableField>({
    id: 0,
    fieldName: "",
    value: "",
  });
  const [rowsExpanded, setRowsExpanded] = useState<number[]>([]);
  const [rowsSelected, setRowsSelected] = useState<IRowsSelected[]>([]);
  const [search, setSearch] = useState<string>("");
  const [addCartridgeModal, setAddCartridgeModal] = useState<AddCartridgeModal>(
    { type: "add", id: 0 }
  );

  useEffect(() => {
    executeSearch({
      variables: { field: search },
    });
  }, [search]);

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
    cartridgesData.length
      ? cartridgesData.map(({ id, name, amount, logs, info }) => ({
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
          logs: logs?.filter(({ created_at }) =>
            moment(created_at).isAfter(moment().subtract(period, "day"), "day")
          ),
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

  const label = { inputProps: { "aria-label": "Checkbox demo" } };

  return !loading ? (
    <div className={styles.container}>
      <h1>Картриджи</h1>
      <div className={styles.filters}>
        <Button
          variant="outlined"
          onClick={() => {
            setCreateModalVisible(true);
          }}
        >
          Добавить картридж
        </Button>

        <TextField
          value={period}
          label="Период"
          select
          placeholder="Период"
          onChange={(e: ChangeEvent<HTMLInputElement>) => handlePeriodChange(e)}
        >
          {periods.map((period, index) => (
            <MenuItem key={index} value={period.value}>
              {period.label}
            </MenuItem>
          ))}
        </TextField>
      </div>

      <TextField
        id="search"
        type="text"
        variant="outlined"
        size="small"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
        InputProps={{
          endAdornment: (
            <SearchOutlinedIcon
              fontSize="large"
              className={styles.expandable}
            />
          ),
        }}
        placeholder="Поиск по наименованию, примечанию..."
        sx={{ mb: 1 }}
      />

      <UpdateCartridgeModal
        setAddCartridgeModal={setAddCartridgeModal}
        addCartridgeModal={addCartridgeModal}
      />

      <CreateCartridgeModal
        createModalVisible={createModalVisible}
        setCreateModalVisible={setCreateModalVisible}
      />

      <DeleteCartridgeModal
        deleteCartridgeModal={deleteCartridgeModal}
        setDeleteCartridgeModal={setDeleteCartridgeModal}
      />

      <table>
        <thead>
          {/* <tr>
          <td colSpan={9}></td>
          </tr> */}
          <tr>
            <th></th>
            {/* Ячейка для стрелки */}
            <th></th>
            <th
              style={{ wordWrap: "break-word", maxWidth: "250px" }}
              onClick={() => requestSort("name")}
              className={getClassNamesFor("name")}
            >
              Наименование
            </th>
            <th
              style={{ wordWrap: "break-word", maxWidth: "100px" }}
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
            <th style={{ wordWrap: "break-word", maxWidth: "250px" }}>
              Примечания
            </th>
            <th align="right">Действия</th>
          </tr>
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
                    <td>
                      <Checkbox
                        {...label}
                        checked={rowsSelected.some((row) => row.id === id)}
                        onChange={(e) =>
                          rowsSelected.some((row) => row.id === id)
                            ? setRowsSelected((rows) =>
                                rows.filter((row) => row.id !== id)
                              )
                            : setRowsSelected((rows) => [
                                ...rows,
                                { id, value: 0, name },
                              ])
                        }
                      />
                    </td>
                    {rowsSelected.some((row) => row.id === id) ? (
                      <td
                        style={{
                          wordWrap: "break-word",
                          maxWidth: "42px",
                          padding: "7px 0px",
                        }}
                      >
                        <TextField
                          id="name"
                          type="number"
                          variant="outlined"
                          fullWidth
                          autoFocus
                          autoComplete="off"
                          size="small"
                          inputProps={{
                            style: {
                              padding: "10px 5px",
                            },
                          }}
                          value={
                            rowsSelected.filter((row) => row.id === id)[0].value
                          }
                          onChange={(e) =>
                            setRowsSelected((rows) =>
                              rows.map((row) =>
                                row.id === id
                                  ? {
                                      ...row,
                                      value: Number(e.target.value).toString(),
                                    }
                                  : row
                              )
                            )
                          }
                        />
                      </td>
                    ) : (
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
                    )}

                    <td style={{ wordWrap: "break-word", maxWidth: "250px" }}>
                      <div
                        style={{
                          maxWidth: "220px",
                          height: "50px",
                          overflow: "auto",
                        }}
                      >
                        {name}
                      </div>
                    </td>
                    <td
                      style={{ wordWrap: "break-word", maxWidth: "100px" }}
                      onDoubleClick={() =>
                        setEditableField({
                          fieldName: "amount",
                          id,
                          value: amount,
                        })
                      }
                    >
                      <div
                        style={{
                          maxWidth: "220px",
                          height: "50px",
                          overflow: "auto",
                        }}
                      >
                        {editableField.id === id &&
                        editableField.fieldName === "amount" ? (
                          <TextField
                            id="name"
                            type="number"
                            variant="outlined"
                            fullWidth
                            size="small"
                            value={editableField.value}
                            onChange={(e) =>
                              setEditableField((prevValue) => ({
                                ...prevValue,
                                value: +e.target.value,
                              }))
                            }
                            autoFocus
                            InputProps={{
                              style: {
                                padding: "0px",
                              },
                              endAdornment: (
                                <DoneRoundedIcon
                                  fontSize="large"
                                  className={styles.expandable}
                                  onClick={() => {
                                    updateCartridgesData();
                                  }}
                                />
                              ),
                            }}
                          />
                        ) : (
                          amount
                        )}
                      </div>
                    </td>
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
                    <td
                      style={{ wordWrap: "break-word", maxWidth: "250px" }}
                      onDoubleClick={() =>
                        setEditableField({ fieldName: "info", id, value: info })
                      }
                    >
                      <div
                        style={{
                          maxWidth: "220px",
                          height: "50px",
                          overflow: "auto",
                        }}
                      >
                        {editableField.id === id &&
                        editableField.fieldName === "info" ? (
                          <TextField
                            id="info"
                            type="text"
                            multiline
                            rows={2}
                            maxRows={4}
                            variant="outlined"
                            fullWidth
                            autoFocus
                            size="small"
                            value={editableField.value}
                            onChange={(e) =>
                              setEditableField((prevValue) => ({
                                ...prevValue,
                                value: e.target.value,
                              }))
                            }
                            InputProps={{
                              style: {
                                padding: "1.5px 9px",
                              },
                              endAdornment: (
                                <DoneRoundedIcon
                                  fontSize="large"
                                  className={styles.expandable}
                                  onClick={() => {
                                    updateCartridgesData();
                                  }}
                                />
                              ),
                            }}
                          />
                        ) : (
                          info
                        )}
                      </div>
                    </td>
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
                            <DeleteOutlineOutlinedIcon
                              color="error"
                              onClick={() =>
                                setDeleteCartridgeModal({ id, name })
                              }
                            />
                          </Button>
                        </ButtonGroup>
                      </div>
                    </td>
                  </tr>
                  {rowsExpanded.includes(id) ? (
                    <>
                      <tr key={id} className="noHover">
                        <td colSpan={9}>
                          <QRCodeSVG value={name} />
                        </td>
                      </tr>

                      {logs?.length ? (
                        <>
                          <tr key={id} className="noHover">
                            <td colSpan={9}>
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
                          <td colSpan={9}>
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

      {rowsSelected.length ? (
        <CreateReport
          data={rowsSelected.map(({ name, value }) => ({
            Наименование: name,
            Количество: value,
          }))}
          setData={() => setRowsSelected([])}
        />
      ) : null}
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
