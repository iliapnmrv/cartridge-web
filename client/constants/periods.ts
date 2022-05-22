export interface IPeriod {
  value: number;
  label: string;
}

export const Periods: IPeriod[] = [
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
  {
    value: 366,
    label: "С начала года",
  },
];
