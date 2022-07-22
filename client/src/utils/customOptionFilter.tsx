import Fuse from "fuse.js";
import { store } from "store/store";
import { IHarm } from "types/worker";

const fuse = new Fuse(store.getState().med.harms, {
  keys: ["harm"],
  shouldSort: true,
});

export const filterOptions = (options: IHarm[], { inputValue }: any) => {
  if (inputValue.length === 0) return options;
  const fuzzySearch = fuse.search(inputValue).map((res) => res.item);
  return fuzzySearch;
};
