import React from "react";
import { Line } from "react-chartjs-2";
import firebase from "firebase/app";
import "firebase/database";
import { connect } from "react-redux";
import { moneyCounter } from "../statisticsСompared/counters";

class LineGraphTracking extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      snapshot: {},
      date: []
    };
    this.changeListen();
  }
  changeListen = () => {
    const { trackingDate } = this.props;

    firebase
      .database()
      .ref(`tracking/${trackingDate.yearAndMonth}`)
      .on("value", snapshot => {
        if (snapshot.val() !== null) {
          let date = moneyCounter(snapshot, trackingDate.daysInMonth);
          this.setState({ date });
        } else {
          this.setState({ date: [] });
        }
      });
  };
  componentDidUpdate(props) {
    if (this.props.trackingDate.fullDate !== props.trackingDate.fullDate) {
      this.changeListen();
    }
  }
  render() {
    const { trackingDate } = this.props;

    const labels = [];
    for (let index = 0; index <= trackingDate.daysInMonth; index++) {
      labels.push(index);
    }
    return (
      <div>
        <Line
          data={{
            labels: labels,
            datasets: [
              {
                data: this.state.date,
                label: "Monthly earnings",
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 2,
                lineTension: 0
              }
            ]
          }}
          width={500}
          height={500}
          options={{ maintainAspectRatio: false }}
        />
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    trackingDate: state.homeReducer.trackingDate
  };
};
const WrappedHomeComponent = connect(mapStateToProps)(LineGraphTracking);
export default WrappedHomeComponent;
