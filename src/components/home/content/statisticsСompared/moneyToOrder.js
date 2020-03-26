import React, { useRef, useEffect, useState } from "react";
import firebase from "firebase/app";
import "firebase/database";
import { Chart } from "chart.js";
import { connect } from "react-redux";
import nanoid from "nanoid";

import { countPrices, countRecords } from "./counters";
import { cardLoading } from "../../../../store/home/statisticsCompared/actions";

function SalesBarChart(props) {
  let [dataset, setDataset] = useState([]);
  let labels = [];

  for (let index = 1; index < 5; index += 1) {
    labels.push(`week`);
    labels.push(`week`);
  }
  console.log(labels);
  async function getPrevMonth(prevWeek, catalog) {
    const snapshot = await firebase
      .database()
      .ref(`${catalog}/${prevWeek}`)
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
        let data = [];
        let recordsData = [];
        let valideRecordsData;
        let valideData;
        let datesOfMonth = [];
        let weeks = [...twoWeeks];
        weeks.shift();

        for (let index = 0; index < twoWeeks[3]; index++) {
          datesOfMonth.push({ day: index });
        }
        weeks.unshift(datesOfMonth);

        getPrevMonth(weeks[2] - 1, "weekTracking")
          .then(prevSnapshot => {
            if (prevSnapshot.val() !== null) {
              data.push(countPrices(prevSnapshot, 0, weeks));
              recordsData.push(countRecords(prevSnapshot, 0, weeks));
            } else {
              data.push([0]);
              recordsData.push([0]);
            }
          })
          .then(() => {
            getPrevMonth(weeks[2] - 2, "weekTracking")
              .then(prevSnapshot => {
                if (prevSnapshot.val() !== null) {
                  data.push(countPrices(prevSnapshot, 0, weeks));
                  recordsData.push(countRecords(prevSnapshot, 0, weeks));
                } else {
                  data.push([0]);
                  recordsData.push([0]);
                }
              })
              .then(() => {
                getPrevMonth(weeks[2] - 3, "weekTracking").then(
                  prevSnapshot => {
                    if (prevSnapshot.val() !== null) {
                      data.push(countPrices(prevSnapshot, 0, weeks));
                      recordsData.push(countRecords(prevSnapshot, 0, weeks));
                    } else {
                      data.push([0]);
                      recordsData.push([0]);
                    }
                    if (snapshot.val() !== null) {
                      data.push(countPrices(snapshot, 0, weeks));
                      recordsData.push(countRecords(snapshot, 0, weeks));
                    }

                    valideData = data.map(el =>
                      el.reduce((previous, current) => {
                        return (previous += current);
                      }, 0)
                    );

                    valideRecordsData = recordsData.map(el =>
                      el.reduce((previous, current) => {
                        return (previous += current);
                      }, 0)
                    );

                    setDataset([[...valideData], [...valideRecordsData]]);

                    props.dispatch(cardLoading(false));
                  }
                );
              });
          });
      });
  }, [props]);
  console.log(dataset);
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
