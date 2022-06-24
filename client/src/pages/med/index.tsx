import { useQuery } from "@apollo/client";
import { TextField } from "@mui/material";
import Search from "components/Search/Search";
import { AllWorkersQuery, WorkersData } from "lib/Queries";
import moment from "moment";
import React, { useState } from "react";
import styles from "styles/Home.module.css";

type Props = {};

const Med = (props: Props) => {
  const { data, loading, error, refetch } =
    useQuery<WorkersData>(AllWorkersQuery);
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
            {data?.workers
              .filter((worker) => worker.name.includes(search))
              .map((worker) => {
                const medDate = moment(worker.lastMed).add(335, "days");
                const medWeekDay = medDate.isoWeekday();

                return (
                  <tr key={worker.id}>
                    <td>{worker.tabNom}</td>
                    <td>{worker.name}</td>
                    <td>{worker.position}</td>
                    <td>{moment(worker.lastMed).format("L")}</td>
                    <td>{moment(Date.now()).diff(worker.lastMed, "days")}</td>
                    <td>
                      {medWeekDay === 1 || medWeekDay === 3
                        ? medDate.format("L")
                        : medWeekDay === 2
                        ? medDate.isoWeekday(1).format("L")
                        : medDate.isoWeekday(3).format("L")}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </>
    </div>
  );
};

export default Med;
