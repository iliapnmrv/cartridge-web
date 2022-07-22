import {
  NetworkStatus,
  useLazyQuery,
  useMutation,
  useQuery,
} from "@apollo/client";
import {
  Autocomplete,
  Badge,
  Box,
  Checkbox,
  Skeleton,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
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
import { IHarm, IWorker } from "types/worker";
import NoteAltOutlinedIcon from "@mui/icons-material/NoteAltOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import ErrorIcon from "@mui/icons-material/Error";
import AddWorkerCommentModal from "components/Modal/AddWorkerCommentModal";
import ExportWorkers from "components/ExportWorkers/ExportWorkers";
import { useAppDispatch, useAppSelector } from "hooks/redux";
import {
  setHarms,
  setShifts,
  setShiftsAvailable,
} from "store/reducers/medReducer";
import MedFilters from "components/Filters/MedFilters";
import { InView } from "react-intersection-observer";
import MedLoading from "components/Loading/MedLoading";
import { filterOptions } from "src/utils/customOptionFilter";

type Props = {};

export interface IAddWorkerCommentModal {
  id: number;
  name: string;
  comment: string;
}

const Med = (props: Props) => {
  const { data: harmsData, loading: harmsLoading } =
    useQuery<HarmsData>(AllHarmsQuery);
  const { data, loading, fetchMore, networkStatus } = useQuery<WorkersData>(
    AllWorkersQuery,
    {
      variables: { offset: 0, limit: 30 },
    }
  );
  const { data: shiftsData } = useQuery<ShiftsData>(AllShiftsQuery);
  const [executeSearch, { data: filteredWorkers, loading: filterLoading }] =
    useLazyQuery(FilterWorkersQuery);

  const { shifts, dateFilter, dateFilterCancel, harms } = useAppSelector(
    (state) => state.med
  );

  console.log(harms);

  const dispatch = useAppDispatch();

  const [
    updateWorker,
    { data: updateResponseData, loading: updateLoading, error: updateError },
  ] = useMutation(UpdateWorkerMutation);

  useEffect(() => {
    harmsData ? dispatch(setHarms(harmsData.harms)) : null;
  }, [harmsData]);

  const [search, setSearch] = useState<string>("");
  const [addWorkerCommentModal, setAddWorkerCommentModal] =
    useState<IAddWorkerCommentModal>({ id: 0, name: "", comment: "" });
  const [workers, setWorkers] = useState<IWorker[]>([]);

  useEffect(() => {
    filteredWorkers?.filterWorkers
      ? setWorkers(filteredWorkers.filterWorkers)
      : null;
  }, [filteredWorkers]);

  useEffect(() => {
    data?.workers ? setWorkers(data?.workers) : null;
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

  const updateWorkerData = (id: number, key: string, value: any) => {
    updateWorker({
      variables: {
        id,
        [key]: value,
      },
    });
  };

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
        ) : (
          <table>
            <thead>
              <tr>
                <th>Табельный номер</th>
                <th>ФИО</th>
                <th>Должность</th>
                <th>Дата последнего прохождения</th>
                <th>Количество дней</th>
                <th>Предполагаемая дата прохождения</th>
                <th align="right">№ смены</th>
                <th>
                  Вредные и (или) опасные производственные факторы и виды работ
                </th>
                <th>№ пукнта</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {workers.length ? (
                workers
                  .filter((worker) =>
                    dateFilter
                      ? moment(worker.lastMed)
                          .add(
                            moment(moment()).diff(dateFilter, "days"),
                            "days"
                          )
                          .diff(moment(), "days") <= -335
                      : true
                  )
                  .map((worker) => {
                    const medDate = moment(worker.lastMed).add(335, "days");
                    const medWeekDay = medDate.isoWeekday();
                    const workerHarm = harms.filter(
                      (harm) => harm.position === worker.position
                    );

                    const daysFromToday = moment(dateFilter).diff(
                      moment(),
                      "days"
                    );

                    return (
                      <tr key={worker.tabNom}>
                        <td>{worker.tabNom}</td>
                        <td>{worker.name}</td>
                        <td>{worker.position}</td>
                        <td>{moment(worker.lastMed).format("LLLL")}</td>
                        <td>
                          {moment().diff(worker.lastMed, "days")}{" "}
                          {daysFromToday && daysFromToday !== 0 ? (
                            <span style={{ color: "gray" }}>
                              {daysFromToday > 0 ? "+" : null}
                              {daysFromToday}
                            </span>
                          ) : null}
                        </td>
                        <td>
                          {medWeekDay === 1 || medWeekDay === 3
                            ? medDate.format("LLLL")
                            : medWeekDay === 2
                            ? medDate.isoWeekday(1).format("LLLL")
                            : medDate.isoWeekday(3).format("LLLL")}
                        </td>
                        <td>{worker.shift}</td>
                        <td>
                          <Autocomplete
                            selectOnFocus
                            id="combo-box-demo"
                            loading={harmsLoading}
                            options={harms ? harms : []}
                            filterOptions={filterOptions}
                            isOptionEqualToValue={(option, value) =>
                              option.id === value.id
                            }
                            //@ts-ignore
                            getOptionLabel={(option: IHarm) => option!.harm}
                            renderInput={(params) => (
                              <TextField {...params} label="Вредности" />
                            )}
                            value={
                              worker.harm?.harm
                                ? harms.filter(
                                    (harm) => harm.id === worker?.harm?.id
                                  )[0]
                                : workerHarm?.length
                                ? workerHarm[0]
                                : undefined
                            }
                            //@ts-ignore
                            onChange={(event: any, newValue: IHarm) => {
                              updateWorkerData(
                                worker.id,
                                "harmId",
                                newValue?.id
                              );
                            }}
                            sx={{ width: 300 }}
                          />
                        </td>
                        <td>{worker?.harm?.harmNum}</td>
                        <td>
                          <Stack
                            direction="row"
                            spacing={2}
                            m={0}
                            sx={{ "span:last-child": { marginLeft: 0 } }}
                          >
                            <DatePicker
                              label="Выберите дату"
                              value={
                                moment(worker.lastMed).month() ===
                                  moment().month() &&
                                moment(worker.lastMed).year() ===
                                  moment().year()
                                  ? worker.lastMed
                                  : null
                              }
                              onChange={(newValue) => {
                                updateWorkerData(
                                  worker.id,
                                  "lastMed",
                                  newValue
                                );
                              }}
                              renderInput={({
                                inputRef,
                                inputProps,
                                InputProps,
                              }) => (
                                <Box
                                  sx={{ display: "flex", alignItems: "center" }}
                                  ref={inputRef}
                                >
                                  {InputProps?.endAdornment}
                                </Box>
                              )}
                            />
                            <span
                              className={[styles.expandable, styles.icon].join(
                                " "
                              )}
                              onClick={() =>
                                setAddWorkerCommentModal({
                                  id: worker.id,
                                  name: worker.name,
                                  comment: worker.comment || "",
                                })
                              }
                            >
                              <Tooltip title={worker.comment || ""}>
                                <Badge
                                  color="secondary"
                                  variant="dot"
                                  invisible={!!!worker.comment}
                                >
                                  <NoteAltOutlinedIcon />
                                </Badge>
                              </Tooltip>
                            </span>
                            <Checkbox
                              sx={{
                                width: "40px",
                                height: "40px",
                                marginLeft: "0px",
                                padding: "0px",
                              }}
                              {...checkboxLabel}
                              checked={worker.isException}
                              icon={<ErrorOutlineOutlinedIcon />}
                              checkedIcon={<ErrorIcon />}
                              onClick={() => {
                                updateWorkerData(
                                  worker.id,
                                  "isException",
                                  !worker.isException
                                );
                              }}
                            />
                          </Stack>
                        </td>
                      </tr>
                    );
                  })
              ) : (
                <>Сотрудники не найдены</>
              )}
            </tbody>
          </table>
        )}

        {workers && (
          <InView
            onChange={async (inView) => {
              const currentLength = data?.workers.length || 0;

              if (inView) {
                await fetchMore({
                  variables: {
                    offset: currentLength,
                  },
                  updateQuery(previousQueryResult, options) {
                    setWorkers((prevState) => [
                      ...prevState,
                      ...options.fetchMoreResult.workers,
                    ]);
                    return previousQueryResult;
                  },
                });
              }
            }}
          />
        )}
      </>
    </div>
  );
};

export default Med;
