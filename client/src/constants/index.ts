export interface IPeriod {
  value: number;
  label: string;
}

export const exportFileType =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
export const exportFileExtension = ".xlsx";

export const periods: IPeriod[] = [
  {
    value: 30,
    label: "1 месяц",
  },
  {
    value: 180,
    label: "6 месяцев",
  },
  {
    value: 365,
    label: "1 год",
  },
  // {
  //   value: 366,
  //   label: "С начала года",
  // },
  {
    value: 9999,
    label: "Все время",
  },
];

export const checkboxLabel = { inputProps: { "aria-label": "Checkbox" } };
