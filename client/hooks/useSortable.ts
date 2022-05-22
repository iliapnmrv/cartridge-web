import moment from "moment";
import { useMemo, useState } from "react";

export interface ISortConfig {
  key: string;
  direction: string;
}

export const useSortableData = (
  items: any[],
  config = { key: "", direction: "" }
) => {
  const [sortConfig, setSortConfig] = useState<ISortConfig>(config);

  const sortedItems = useMemo(() => {
    let sortableItems = [...items];
    if (sortConfig.key !== "") {
      sortableItems.sort((a, b) => {
        if (
          sortConfig.key === "lastAddition" ||
          sortConfig.key === "lastSubtraction"
        ) {
          if (a[sortConfig.key] === undefined) {
            return sortConfig.direction === "ascending" ? -1 : 1;
          }
          if (b[sortConfig.key] === undefined) {
            return sortConfig.direction === "ascending" ? 1 : -1;
          }
          if (moment(a[sortConfig.key]) < moment(b[sortConfig.key])) {
            return sortConfig.direction === "ascending" ? -1 : 1;
          }
          if (moment(a[sortConfig.key]) > moment(b[sortConfig.key])) {
            return sortConfig.direction === "ascending" ? 1 : -1;
          }
          return 0;
        }

        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [items, sortConfig]);

  const requestSort = (key: string): void => {
    let direction = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  return { items: sortedItems, requestSort, sortConfig };
};
