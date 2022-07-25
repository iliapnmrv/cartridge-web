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
import { useAppSelector } from "hooks/redux";
import moment from "moment";
import React from "react";
import { filterOptions } from "src/utils/customOptionFilter";
import styles from "styles/Home.module.css";
import NoteAltOutlinedIcon from "@mui/icons-material/NoteAltOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import ErrorIcon from "@mui/icons-material/Error";
import { checkboxLabel } from "constants/index";
import { UpdateWorkerMutation } from "lib/Mutations";
import { useMutation } from "@apollo/client";

type Props = {
  index: number;
};

const TableRow = ({ index }: Props) => {
  const [
    updateWorker,
    { data: updateResponseData, loading: updateLoading, error: updateError },
  ] = useMutation(UpdateWorkerMutation);

  const updateWorkerData = (id: number, key: string, value: any) => {
    updateWorker({
      variables: {
        id,
        [key]: value,
      },
      // update:{

      // }
    });
  };

  const { workers, harms, dateFilter } = useAppSelector((state) => state.med);

  const medDate = moment(workers[index].lastMed).add(335, "days");
  const medWeekDay = medDate.isoWeekday();
  const workerHarm = harms.filter(
    (harm) => harm.position === workers[index].position
  );

  const daysFromToday = moment(dateFilter).diff(moment(), "days");

  return updateLoading ? (
    <tr>
      {[...Array(10)].map((_, index) => (
        <td key={index}>
          <Skeleton variant="rectangular" sx={{ my: 4, mx: 1 }} />
        </td>
      ))}
    </tr>
  ) : (
    <tr>
      <td>{workers[index].tabNom.padStart(10, "0")}</td>
      <td>{workers[index].name}</td>
      <td>{workers[index].position}</td>
      <td>{moment(workers[index].lastMed).format("LLLL")}</td>
      <td>
        {moment().diff(workers[index].lastMed, "days")}{" "}
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
      <td>{workers[index].shift}</td>
      <td>
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
          value={
            workers[index].harm?.harm
              ? harms.filter((harm) => harm.id === workers[index]?.harm?.id)[0]
              : workerHarm?.length
              ? workerHarm[0]
              : undefined
          }
          //@ts-ignore
          onChange={(event: any, newValue: IHarm) => {
            updateWorkerData(workers[index].id, "harmId", newValue?.id);
          }}
          sx={{ width: 300 }}
        />
      </td>
      <td>{workers[index]?.harm?.harmNum}</td>
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
              moment(workers[index].lastMed).month() === moment().month() &&
              moment(workers[index].lastMed).year() === moment().year()
                ? workers[index].lastMed
                : null
            }
            onChange={(newValue) => {
              updateWorkerData(workers[index].id, "lastMed", newValue);
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
          <span
            className={[styles.expandable, styles.icon].join(" ")}
            onClick={() =>
              setAddWorkerCommentModal({
                id: workers[index].id,
                name: workers[index].name,
                comment: workers[index].comment || "",
              })
            }
          >
            <Tooltip title={workers[index].comment || ""}>
              <Badge
                color="secondary"
                variant="dot"
                invisible={!!!workers[index].comment}
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
            checked={workers[index].isException}
            icon={<ErrorOutlineOutlinedIcon />}
            checkedIcon={<ErrorIcon />}
            onClick={() => {
              updateWorkerData(
                workers[index].id,
                "isException",
                !workers[index].isException
              );
            }}
          />
        </Stack>
      </td>
    </tr>
  );
};

export default TableRow;
