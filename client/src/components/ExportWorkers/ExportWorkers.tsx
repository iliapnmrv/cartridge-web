import React, { Dispatch, SetStateAction, useRef } from "react";
import { Fab } from "@mui/material";
import styles from "../../styles/CreateReport.module.css";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import moment from "moment";
import { exportToCSV } from "src/utils/exportToCSV";

type Props = {
  data: Array<any>;
  setData?: Dispatch<SetStateAction<any>>;
};

const ExportWorkers = ({ data }: Props) => {
  return (
    <>
      <Fab
        color="primary"
        aria-label="add"
        variant="extended"
        className={styles["export-button"]}
        onClick={() => exportToCSV(data, `Медкомиссия ${moment().format("L")}`)}
      >
        <FileDownloadOutlinedIcon sx={{ mr: 1 }} />
        Экспорт сотрудников
      </Fab>
    </>
  );
};

export default ExportWorkers;
