import { useMutation, useQuery } from "@apollo/client";
import {
  Autocomplete,
  Badge,
  Box,
  Checkbox,
  CircularProgress,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Skeleton,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import { DatePicker, DesktopDatePicker } from "@mui/x-date-pickers";
import Search from "components/Search/Search";
import { checkboxLabel } from "constants/index";
import { UpdateWorkerMutation } from "lib/Mutations";
import {
  AllHarmsQuery,
  AllWorkersQuery,
  HarmsData,
  WorkersData,
} from "lib/Queries";
import moment, { Moment } from "moment";
import React, { ChangeEvent, useEffect, useState } from "react";
import styles from "styles/Home.module.css";
import { IHarm } from "types/worker";
import Fuse from "fuse.js";
import NoteAltOutlinedIcon from "@mui/icons-material/NoteAltOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import ErrorIcon from "@mui/icons-material/Error";
import AddWorkerCommentModal from "components/Modal/AddWorkerCommentModal";
import CancelIcon from "@mui/icons-material/Cancel";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import ExportWorkers from "components/ExportWorkers/ExportWorkers";

type Props = {};

export interface IAddWorkerCommentModal {
  id: number;
  name: string;
  comment: string;
}

const Med = (props: Props) => {
  const { data: harms, loading: harmsLoading } =
    useQuery<HarmsData>(AllHarmsQuery);
  const { data, loading, error, refetch } =
    useQuery<WorkersData>(AllWorkersQuery);
  const [
    updateWorker,
    { data: updateResponseData, loading: updateLoading, error: updateError },
  ] = useMutation(UpdateWorkerMutation);

  const [harmsOptions, setHarmsOptions] = useState<readonly IHarm[]>([]);

  useEffect(() => {
    harms
      ? setHarmsOptions(
          harms.harms.filter(
            (a, i) => harms.harms.findIndex((s) => a.harm === s.harm) === i
          )
        )
      : null;
  }, [harms]);

  const [search, setSearch] = useState<string>("");
  const [shifts, setShifts] = useState<string[]>([]);
  const [addWorkerCommentModal, setAddWorkerCommentModal] =
    useState<IAddWorkerCommentModal>({ id: 0, name: "", comment: "" });
  const [dateFilter, setDateFilter] = useState<Date | null>(null);
  const [dateFilterCancel, setDateFilterCancel] = useState<Date | null>(
    new Date()
  );

  const handleDateFilterChange = (newValue: Date | null) => {
    setDateFilter(newValue);
  };

  useEffect(() => {
    dateFilter ? setDateFilterCancel(null) : null;
  }, [dateFilter]);

  const handleShiftChange = (event: SelectChangeEvent<typeof shifts>) => {
    const {
      target: { value },
    } = event;
    setShifts(typeof value === "string" ? value.split(",") : value);
  };

  const updateWorkerData = (id: number, key: string, value: any) => {
    updateWorker({
      variables: {
        id,
        [key]: value,
      },
    });
  };

  const fuse = new Fuse(harmsOptions, {
    keys: ["harm"],
    shouldSort: true,
  });

  const filterOptions = (options: IHarm[], { inputValue }: any) => {
    if (inputValue.length === 0) return options;
    const fuzzySearch = fuse.search(inputValue).map((res) => res.item);
    return fuzzySearch;
  };

  return (
    <div className={styles.container}>
      <h1>Медкомиссия</h1>

      <AddWorkerCommentModal
        addWorkerCommentModal={addWorkerCommentModal}
        setAddWorkerCommentModal={setAddWorkerCommentModal}
      />

      <div className={styles.filters}>
        <FormControl sx={{ width: 300 }}>
          <InputLabel id="demo-multiple-checkbox-label">
            Смена сотрудников
          </InputLabel>
          <Select
            value={shifts}
            multiple
            input={<OutlinedInput label="Смена сотрудников" />}
            renderValue={(selected: string[]) => {
              if (selected.length === 0) {
                return <em>Выберите смену сотрудников</em>;
              }
              return selected.join(", ");
            }}
            onChange={(e: SelectChangeEvent<typeof shifts>) =>
              handleShiftChange(e)
            }
          >
            <MenuItem disabled value="">
              <em>Выберите смены сотрудников</em>
            </MenuItem>
            {data?.workers
              .map((worker) => worker.shift)
              .filter((value, index, self) => self.indexOf(value) === index)
              .map((shift) => (
                <MenuItem key={shift} value={shift}>
                  <Checkbox checked={shifts.indexOf(shift) > -1} />
                  <ListItemText primary={shift} />
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Checkbox
            onClick={() => {
              setDateFilterCancel(dateFilter ? dateFilter : null);
              setDateFilter(dateFilter ? null : dateFilterCancel);
            }}
            checked={!!dateFilterCancel}
            {...checkboxLabel}
            icon={<CancelOutlinedIcon />}
            checkedIcon={<CancelIcon />}
          />
          <DatePicker
            label="Предстоящая медкомиссия на"
            inputFormat="DD/MM/yyyy"
            value={dateFilter}
            onChange={handleDateFilterChange}
            renderInput={(params) => <TextField {...params} />}
          />
        </div>
      </div>
      <Search
        value={search}
        setValue={setSearch}
        placeholder="Поиск по ФИО..."
      />
      {dateFilter ? (
        <ExportWorkers
          data={
            data
              ? data.workers.map(({ tabNom, name, lastMed }) => {
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
          {loading ? (
            <tbody>
              {[...Array(5)].map((_, index) => (
                <tr key={index}>
                  {[...Array(10)].map((_, index) => (
                    <td key={index}>
                      <Skeleton variant="rectangular" sx={{ my: 4, mx: 1 }} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          ) : (
            <tbody>
              {data?.workers
                .filter((worker) => worker.name.includes(search))
                .filter((worker) =>
                  dateFilter
                    ? moment(worker.lastMed)
                        .add(moment(moment()).diff(dateFilter, "days"), "days")
                        .diff(moment(), "days") <= -335
                    : true
                )
                .filter((worker) =>
                  !shifts.length ? true : shifts.includes(worker.shift)
                )
                .map((worker) => {
                  const medDate = moment(worker.lastMed).add(335, "days");
                  const medWeekDay = medDate.isoWeekday();
                  const workerHarm = harms?.harms.filter(
                    (harm) => harm.position === worker.position
                  );

                  const daysFromToday = moment(dateFilter).diff(
                    moment(),
                    "days"
                  );

                  return (
                    <tr key={worker.id}>
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
                          options={harmsOptions}
                          filterOptions={filterOptions}
                          //@ts-ignore
                          getOptionLabel={(option: IHarm) => option!.harm}
                          renderInput={(params) => (
                            <TextField {...params} label="Вредности" />
                          )}
                          value={
                            worker.harm?.harm
                              ? harms?.harms.filter(
                                  (harm) => harm.id === worker?.harm?.id
                                )[0]
                              : workerHarm?.length
                              ? workerHarm[0]
                              : undefined
                          }
                          //@ts-ignore
                          onChange={(event: any, newValue: IHarm) => {
                            updateWorkerData(worker.id, "harmId", newValue?.id);
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
                              moment(worker.lastMed).year() === moment().year()
                                ? worker.lastMed
                                : null
                            }
                            onChange={(newValue) => {
                              updateWorkerData(worker.id, "lastMed", newValue);
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
                })}
            </tbody>
          )}
        </table>
      </>
    </div>
  );
};

export default Med;
