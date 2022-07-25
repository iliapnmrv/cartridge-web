import { TextField } from "@mui/material";
import React, { Dispatch } from "react";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import styles from "./Search.module.css";

type Props = {
  value: string;
  setValue: Dispatch<string>;
  placeholder?: string;
  search?: Function;
};

const Search = ({ value, setValue, placeholder, search }: Props) => {
  return (
    <TextField
      id="search"
      type="text"
      variant="outlined"
      size="small"
      onBlur={(e) => {
        setValue(e.target.value);
      }}
      InputProps={{
        endAdornment: (
          <SearchOutlinedIcon
            fontSize="large"
            className={styles.searchField}
            onClick={search ? () => search() : undefined}
          />
        ),
      }}
      placeholder={placeholder}
      sx={{ mb: 1 }}
    />
  );
};

export default Search;
