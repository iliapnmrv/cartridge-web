import { Skeleton } from "@mui/material";
import TableHead from "components/Table/TableHead";
import React from "react";

type Props = {};

const MedLoading = (props: Props) => {
  return (
    <table>
      <TableHead />
      <tbody>
        {[...Array(5)].map((_, index) => (
          <tr key={index}>
            {[...Array(10)].map((_, index) => (
              <td key={index}>
                <Skeleton variant="rectangular" sx={{ my: 4, mx: 1 }} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default MedLoading;
