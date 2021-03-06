import React, { useRef, useEffect, useState } from "react";
import firebase from "firebase/app";
import "firebase/database";
import { Chart } from "chart.js";
import { connect } from "react-redux";
import nanoid from "nanoid";

import { countPrices } from "./counters";

function EarningsBarChart(props) {
  let [dataset, setDataset] = useState([]);
  let labels = [];
  let { twoWeeks } = props;

  for (let index = 0; index < 7; index++) {
    labels.push(`${twoWeeks[0][index].yearAndMonth}-${twoWeeks[0][index].day}`);
  }
  for (let index = 0; index < 7; index++) {
    labels.push(`${twoWeeks[1][index].yearAndMonth}-${twoWeeks[1][index].day}`);
  }
  async function getPrevMonth(prevWeek) {
    const snapshot = await firebase
      .database()
      .ref(`weekTracking/${prevWeek}`)
      .once("value", snapshot => {
        return snapshot.val();
      });

    return snapshot;
  }

  useEffect(() => {
    let { twoWeeks } = props;

    firebase
      .database()
      .ref(`weekTracking/`)
      .on("value", snapshot => {
        getPrevMonth(twoWeeks[2] - 1).then(prevSnapshot => {
          let data = [];
          if (snapshot.val() !== null)
            data.push(countPrices(snapshot, 1, twoWeeks));
          if (prevSnapshot.val() !== null) {
            data.push(countPrices(prevSnapshot, 0, twoWeeks));
          }

          setDataset(data);
        });
      });
  }, [props]);
  const ref = useRef();

  const data = {
    labels,
    datasets: [
      {
        // label: 'dataset 1',
        backgroundColor: "#34bfa3",
        data: dataset[0]
      },
      {
        // label: 'dataset 2',
        backgroundColor: "#f4f4fb",
        data: dataset[1]
      }
    ]
  };
  useEffect(() => {
    const chart = new Chart(ref.current, {
      data,
      type: "bar",

      options: {
        title: { display: false },
        tooltips: {
          intersect: false,
          mode: "nearest",
          xPadding: 10,
          yPadding: 10,
          caretPadding: 10
        },
        legend: { display: false },
        responsive: true,
        maintainAspectRatio: false,
        barRadius: 4,

        scales: {
          xAxes: [{ display: false, gridLines: false, stacked: true }],
          yAxes: [{ display: false, stacked: true, gridLines: false }]
        },
        layout: { padding: { left: 0, right: 0, top: 0, bottom: 0 } },
        datasetKeyProvider: nanoid
      }
    });

    return () => {
      chart.destroy();
    };
  }, [data]);
  return <canvas ref={ref} />;
}

const mapStateToProps = state => {
  return {
    twoWeeks: state.homeReducer.twoWeeks
  };
};
const WrappedComponent = connect(mapStateToProps)(EarningsBarChart);
export default WrappedComponent;
