import { exportFileExtension, exportFileType } from "constants/index";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

export const exportToCSV = (csvData: Array<any>, fileName: string) => {
  const ws = XLSX.utils.json_to_sheet(csvData);
  const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const data = new Blob([excelBuffer], { type: exportFileType });
  FileSaver.saveAs(data, fileName + exportFileExtension);
};
