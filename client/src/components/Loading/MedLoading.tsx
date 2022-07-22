import { Skeleton } from "@mui/material";
import React from "react";

type Props = {};

const MedLoading = (props: Props) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Табельный номер</th>
          <th>ФИО</th>
          <th>Должность</th>
          <th>Дата последнего прохождения</th>
          <th>Количество дней</th>
          <th>Предполагаемая дата прохождения</th>
          <th align="right">№ смены</th>
          <th>Вредные и (или) опасные производственные факторы и виды работ</th>
          <th>№ пукнта</th>
          <th>Действия</th>
        </tr>
      </thead>
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
