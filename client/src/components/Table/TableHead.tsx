import React, { ReactNode } from "react";
import styles from "styles/Table.module.css";

type Props = {};

const TableHead = ({}: Props) => {
  return (
    <thead>
      <tr>
        <th>Табельный номер</th>
        <th style={{ minWidth: 100 }}>ФИО</th>
        <th>Должность</th>
        <th>Дата последнего прохождения</th>
        <th>Кол-во дней</th>
        <th>Предполагаемая дата прохождения</th>
        <th align="right">
          № <br /> смены
        </th>
        <th>Вредные и (или) опасные производственные факторы и виды работ</th>
        <th>
          № <br /> пукнта
        </th>
        <th>Действия</th>
      </tr>
    </thead>
  );
};

export default TableHead;
