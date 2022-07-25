import {
  NetworkStatus,
  useLazyQuery,
  useMutation,
  useQuery,
} from "@apollo/client";
import { DatePicker } from "@mui/x-date-pickers";
import Search from "components/Search/Search";
import { checkboxLabel } from "constants/index";
import { UpdateWorkerMutation } from "lib/Mutations";
import {
  AllHarmsQuery,
  AllShiftsQuery,
  AllWorkersQuery,
  FilterWorkersQuery,
  HarmsData,
  ShiftsData,
  WorkersData,
} from "lib/Queries";
import moment, { Moment } from "moment";
import React, { ChangeEvent, useEffect, useState } from "react";
import styles from "styles/Home.module.css";
import AddWorkerCommentModal from "components/Modal/AddWorkerCommentModal";
import ExportWorkers from "components/ExportWorkers/ExportWorkers";
import { useAppDispatch, useAppSelector } from "hooks/redux";
import {
  setHarms,
  setShifts,
  setShiftsAvailable,
  setWorkers,
  setWorkersInitial,
} from "store/reducers/medReducer";
import MedFilters from "components/Filters/MedFilters";
import MedLoading from "components/Loading/MedLoading";
import TableRow from "components/Table/TableRow";
import TableHead from "components/Table/TableHead";
import { AutoSizer, Column, Table } from "react-virtualized";
import { useVirtual } from "react-virtual";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  Row,
  useReactTable,
} from "@tanstack/react-table";
import { IHarm, IWorker } from "types/worker";
import { Autocomplete, TextField } from "@mui/material";
import { filterOptions } from "src/utils/customOptionFilter";

type Props = {};

export interface IAddWorkerCommentModal {
  id: number;
  name: string;
  comment: string;
}

const Med = (props: Props) => {
  const { data: harmsData } = useQuery<HarmsData>(AllHarmsQuery);
  const { data, loading } = useQuery<WorkersData>(AllWorkersQuery, {
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    variables: {
      _size: 10,
    },
  });
  const { data: shiftsData } = useQuery<ShiftsData>(AllShiftsQuery);
  const [executeSearch, { data: filteredWorkers, loading: filterLoading }] =
    useLazyQuery(FilterWorkersQuery);

  const { shifts, dateFilter, workers, workersInitial, harms } = useAppSelector(
    (state) => state.med
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    harmsData ? dispatch(setHarms(harmsData.harms)) : null;
  }, [harmsData]);

  useEffect(() => {
    filterWorkers();
  }, [shifts]);

  const [search, setSearch] = useState<string>("");
  const [addWorkerCommentModal, setAddWorkerCommentModal] =
    useState<IAddWorkerCommentModal>({ id: 0, name: "", comment: "" });

  useEffect(() => {
    filteredWorkers?.filterWorkers
      ? dispatch(setWorkers(filteredWorkers.filterWorkers))
      : null;
  }, [filteredWorkers]);

  useEffect(() => {
    data?.workers ? dispatch(setWorkers(data?.workers)) : null;
  }, [data]);

  useEffect(() => {
    shiftsData?.shifts
      ? dispatch(
          setShiftsAvailable(shiftsData.shifts.map((shift) => shift.shift))
        )
      : null;
  }, [shiftsData]);

  const filterWorkers = () => {
    executeSearch({
      variables: { shifts, dateFilter, name: search },
    });
  };

  useEffect(() => {
    dateFilter
      ? dispatch(
          setWorkers(
            workers.filter(
              (worker) =>
                moment(worker.lastMed)
                  .add(moment(moment()).diff(dateFilter, "days"), "days")
                  .diff(moment(), "days") <= -335
            )
          )
        )
      : dispatch(setWorkers(workersInitial));
  }, [dateFilter]);

  const daysFromToday = moment(dateFilter).diff(moment(), "days");

  const columns = React.useMemo<ColumnDef<IWorker>[]>(
    () => [
      {
        accessorKey: "tabNom",
        header: "Табельный номер",
        size: 60,
        cell: (info) => <>{info.getValue<string>().padStart(10, "0")}</>,
      },
      {
        accessorKey: "name",
        header: "ФИО",
        size: 100,
      },
      {
        accessorKey: "position",
        header: "Должность",
        size: 150,
      },
      {
        accessorKey: "lastMed",
        cell: (info) => <>{moment(info.getValue<Date>()).format("LLLL")}</>,
        header: "Дата последнего прохождения",
        // size: 150,
      },
      {
        accessorKey: "lastMed2",
        accessorFn: (row) => row.lastMed,
        cell: (info) => {
          const lastMed = info.getValue<Date>();
          return (
            <>
              {moment().diff(lastMed, "days")}{" "}
              {daysFromToday && daysFromToday !== 0 ? (
                <span style={{ color: "gray" }}>
                  {daysFromToday > 0 ? "+" : null}
                  {daysFromToday}
                </span>
              ) : null}
            </>
          );
        },
        header: "Количество дней",
        // size: 150,
      },
      {
        accessorKey: "lastMed3",
        accessorFn: (row) => row.lastMed,
        cell: (info) => {
          const lastMed = info.getValue<Date>();
          const medDate = moment(lastMed).add(335, "days");
          const medWeekDay = medDate.isoWeekday();
          return (
            <>
              {medWeekDay === 1 || medWeekDay === 3
                ? medDate.format("LLLL")
                : medWeekDay === 2
                ? medDate.isoWeekday(1).format("LLLL")
                : medDate.isoWeekday(3).format("LLLL")}
            </>
          );
        },
        header: "Предполагаемая дата прохождения",
        // size: 150,
      },
      {
        accessorKey: "shift",
        header: "№ Смены",
      },
      {
        accessorKey: "harm",
        header: "№ Смены",
        cell: (info) => {
          const workerHarm = info.getValue<IHarm>();
          return (
            <Autocomplete
              selectOnFocus
              id="combo-box-demo"
              options={harms ? harms : []}
              filterOptions={filterOptions}
              // isOptionEqualToValue={(option, value) => option.id === value.id}
              //@ts-ignore
              getOptionLabel={(option: IHarm) => option!.harm}
              renderInput={(params) => (
                <TextField
                  {...params}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  label="Вредности"
                />
              )}
              value={workerHarm}
              //@ts-ignore
              onChange={(event: any, newValue: IHarm) => {
                // updateWorkerData(workers[index].id, "harmId", newValue?.id);
              }}
              sx={{ width: 300 }}
            />
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: workers,
    columns,
    getCoreRowModel: getCoreRowModel(),
    debugTable: true,
  });

  const tableContainerRef = React.useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtual({
    parentRef: tableContainerRef,
    size: workers.length,
    overscan: 10,
  });

  const { rows } = table.getRowModel();

  const { virtualItems: virtualRows, totalSize } = rowVirtualizer;

  return (
    <div className={styles.container}>
      <h1>Медкомиссия</h1>

      <AddWorkerCommentModal
        addWorkerCommentModal={addWorkerCommentModal}
        setAddWorkerCommentModal={setAddWorkerCommentModal}
      />

      <MedFilters workers={data?.workers} />

      <Search
        value={search}
        setValue={setSearch}
        placeholder="Поиск по ФИО..."
        search={filterWorkers}
      />

      {dateFilter ? (
        <ExportWorkers
          data={
            data
              ? workers.map(({ tabNom, name, lastMed }) => {
                  const medDate = moment(lastMed).add(335, "days");
                  const medWeekDay = medDate.isoWeekday();
                  return {
                    "Табельный номер": tabNom,
                    ФИО: name,
                    "Предыдущее прохождение медкомиссии":
                      moment(lastMed).format("L"),
                    "Предполагаемое прохождение":
                      medWeekDay === 1 || medWeekDay === 3
                        ? medDate.format("L")
                        : medWeekDay === 2
                        ? medDate.isoWeekday(1).format("L")
                        : medDate.isoWeekday(3).format("L"),
                  };
                })
              : []
          }
        />
      ) : null}
      <>
        {loading || filterLoading ? (
          <MedLoading />
        ) : workers.length ? (
          <>
            <div ref={tableContainerRef}>
              <table>
                <TableHead />
                <tbody>
                  {virtualRows.map((virtualRow) => {
                    const row = rows[virtualRow.index] as Row<IWorker>;
                    return (
                      <tr key={row.id}>
                        {row.getVisibleCells().map((cell) => {
                          return (
                            <td key={cell.id}>
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <>Сотрудники не найдены</>
        )}
      </>
    </div>
  );
};

export default Med;
