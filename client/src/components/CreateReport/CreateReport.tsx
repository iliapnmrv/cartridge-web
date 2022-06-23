import React, { Dispatch, SetStateAction, useRef } from "react";
import { Fab } from "@mui/material";
import styles from "../../styles/CreateReport.module.css";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import moment from "moment";

type Props = {
  data: Array<any>;
  setData?: Dispatch<SetStateAction<any>>;
};

const CreateReport = ({ data }: Props) => {
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const exportToCSV = (csvData: Array<any>, fileName: string) => {
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  return (
    <>
      <Fab
        color="primary"
        aria-label="add"
        variant="extended"
        className={styles["export-button"]}
        onClick={() =>
          exportToCSV(data, `Заказ поставщику ${moment().format("l")}`)
        }
      >
        <FileDownloadOutlinedIcon sx={{ mr: 1 }} />
        Скачать
      </Fab>
    </>
  );
};

export default CreateReport;
