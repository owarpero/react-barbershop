import React, { useRef, useEffect, useState } from "react";
import firebase from "firebase/app";
import "firebase/database";
import { Chart } from "chart.js";
import { connect } from "react-redux";
import nanoid from "nanoid";
import { cardLoading } from "../../../../store/home/statisticsCompared/actions";
import { countRecords } from "./counters";

function SalesBarChart(props) {
  let [dataset, setDataset] = useState([]);
  let labels = [];
  let { twoWeeks } = props;
  let { dispatch } = props;

  for (let index = 0; index < 7; index++) {
    console.log();
    labels.push(`${twoWeeks[0][index].yearAndMonth}-${twoWeeks[0][index].day}`);
    labels.push(`${twoWeeks[1][index].yearAndMonth}-${twoWeeks[1][index].day}`);
  }

  async function getPrevMonth(prevWeek) {
    const snapshot = await firebase
      .database()
      .ref(`weeks/${prevWeek}`)
      .once("value", snapshot => {
        return snapshot.val();
      });

    return snapshot;
  }

  useEffect(() => {
    let { twoWeeks } = props;

    firebase
      .database()
      .ref(`weeks/`)
      .on("value", snapshot => {
        getPrevMonth(twoWeeks[2] - 1).then(prevSnapshot => {
          let data = [];
          if (snapshot.val() !== null)
            data.push(countRecords(snapshot, 1, twoWeeks));
          if (prevSnapshot.val() !== null) {
            data.push(countRecords(prevSnapshot, 0, twoWeeks));
          }

          setDataset(data);
        });
      });
  }, [props, dispatch]);
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
      // ,
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
        barRadius: 2,
        scales: {
          xAxes: [{ display: false, gridLines: false, stacked: true }],
          yAxes: [
            {
              display: false,
              stacked: true,
              gridLines: false
            }
          ]
        },
        width: "100%",
        height: "100%",
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
const WrappedComponent = connect(mapStateToProps)(SalesBarChart);
export default WrappedComponent;
