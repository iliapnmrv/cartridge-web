import { TextField } from "@mui/material";
import Search from "components/Search/Search";
import React, { useState } from "react";
import styles from "styles/Home.module.css";

type Props = {};

const Med = (props: Props) => {
  const [search, setSearch] = useState<string>("");
  return (
    <div className={styles.container}>
      <h1>Медкомиссия</h1>

      <div className={styles.filters}></div>
      <Search
        value={search}
        setValue={setSearch}
        placeholder="Поиск по ФИО..."
      />
      <>
        <div>Фильтры</div>
        <table>
          <thead>
            <tr>
              <th></th>
              {/* Ячейка для стрелки */}
              <th></th>
              <th>Табельный номер</th>
              <th>ФИО</th>
              <th>Должность</th>
              <th>Дата последнего прохождения</th>
              <th>Количество дней</th>
              <th>Предполагаемая дата прохождения</th>
              <th align="right">№ смены</th>
              <th>
                Вредные и (или) опасные производственные факторы и виды работ
              </th>
              <th>№ пукнта</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td></td>
            </tr>
          </tbody>
        </table>
      </>
    </div>
  );
};

export default Med;
