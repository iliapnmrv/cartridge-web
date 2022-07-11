import { useMutation, useQuery } from "@apollo/client";
import {
  Autocomplete,
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
  TextField,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
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

type Props = {};

const Med = (props: Props) => {
  const { data, loading, error, refetch } =
    useQuery<WorkersData>(AllWorkersQuery);
  const { data: harms, loading: harmsLoading } =
    useQuery<HarmsData>(AllHarmsQuery);
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
    console.log("harms", harms);
  }, [harms]);

  const [search, setSearch] = useState<string>("");
  const [shifts, setShifts] = useState<string[]>([]);

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

  // console.log(updateResponseData.harm.harmNum);

  return (
    <div className={styles.container}>
      <h1>Медкомиссия</h1>

      <div className={styles.filters}>
        <FormControl sx={{ width: 300, mt: 3 }}>
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
              <em>Выберите смену сотрудников</em>
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
      </div>
      <Search
        value={search}
        setValue={setSearch}
        placeholder="Поиск по ФИО..."
      />
      <>
        <table>
          <thead>
            <tr>
              <th>Исключить</th>
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
            {data?.workers
              .filter((worker) => worker.name.includes(search))
              .filter((worker) =>
                !shifts.length ? true : shifts.includes(worker.shift)
              )
              .map((worker) => {
                const medDate = moment(worker.lastMed).add(335, "days");
                const medWeekDay = medDate.isoWeekday();
                const workerHarm = harms?.harms.filter(
                  (harm) => harm.position === worker.position
                );

                return (
                  <tr key={worker.id}>
                    <td>
                      <Checkbox
                        {...checkboxLabel}
                        checked={worker.isException}
                        onClick={() => {
                          updateWorkerData(
                            worker.id,
                            "isException",
                            !worker.isException
                          );
                        }}
                      />
                    </td>
                    <td>{worker.tabNom}</td>
                    <td>{worker.name}</td>
                    <td>{worker.position}</td>
                    <td>{moment(worker.lastMed).format("LLLL")}</td>
                    <td>{moment(Date.now()).diff(worker.lastMed, "days")}</td>
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
                        freeSolo
                        disableClearable
                        disablePortal
                        id="combo-box-demo"
                        loading={harmsLoading}
                        options={harmsOptions}
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
                      />
                    </td>
                    <td>
                      {worker.id === updateResponseData?.updateWorker?.id
                        ? updateResponseData?.updateWorker.harm.harmNum
                        : worker?.harm?.harmNum}
                    </td>
                    <td>
                      <DatePicker
                        label="Выберите дату"
                        value={
                          moment(worker.lastMed).month() === moment().month() &&
                          moment(worker.lastMed).year() === moment().year()
                            ? worker.lastMed
                            : null
                        }
                        onChange={(newValue) => {
                          updateWorkerData(worker.id, "lastMed", newValue);
                        }}
                        renderInput={({ inputRef, inputProps, InputProps }) => (
                          <Box
                            sx={{ display: "flex", alignItems: "center" }}
                            ref={inputRef}
                          >
                            {InputProps?.endAdornment}
                          </Box>
                        )}
                      />
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </>
    </div>
  );
};

export default Med;
