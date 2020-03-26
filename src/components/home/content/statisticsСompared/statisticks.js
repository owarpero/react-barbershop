import React from "react";
import { Statistic } from "antd";
import { ArrowUpOutlined } from "@ant-design/icons";
import firebase from "firebase/app";
import "firebase/database";
import { connect } from "react-redux";
import "./statistics.css";
import { moneyCounter, recordsCounter } from "./counters";
class StatisticWidgets extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: [],
      dataRecord: [],
      complitedOrders: []
    };
    console.log(props);
  }
  componentDidMount() {
    const { trackingDate } = this.props;
    firebase
      .database()
      .ref(`tracking/${trackingDate.yearAndMonth}`)
      .on("value", snapshot => {
        console.log(snapshot.val());
        let date = [];

        if (snapshot.val() !== null)
          date = moneyCounter(snapshot, trackingDate.daysInMonth);
        else date.push(0);

        let sum = date.reduce((previous, current) => (previous += current), 0);
        this.setState({ date: sum });
      });

    firebase
      .database()
      .ref(`records/${trackingDate.yearAndMonth}`)
      .on("value", snapshot => {
        if (snapshot.val() !== null) {
          let data = recordsCounter(snapshot, trackingDate.daysInMonth);
          let sum = data.reduce(
            (previous, current) => (previous += current),
            0
          );
          this.setState({ dataRecord: sum });
        } else {
          this.setState({ dataRecord: [] });
        }
      });
    firebase
      .database()
      .ref(`tracking/${trackingDate.yearAndMonth}`)
      .on("value", snapshot => {
        if (snapshot.val() !== null) {
          let data = recordsCounter(snapshot, trackingDate.daysInMonth);
          let sum = data.reduce(
            (previous, current) => (previous += current),
            0
          );
          this.setState({ complitedOrders: sum });
        } else {
          this.setState({ complitedOrders: [] });
        }
      });
  }
  render() {
    return (
      <div className="total">
        <Statistic
          title="Money per month"
          value={this.state.date}
          precision={2}
          valueStyle={{ color: "#3f8600" }}
          prefix={<ArrowUpOutlined />}
          suffix="$"
        />

        <Statistic
          title="Record per month"
          value={this.state.dataRecord}
          valueStyle={{ color: "#3f8600" }}
          prefix={<ArrowUpOutlined />}
        />

        <Statistic
          title="Completed orders"
          value={this.state.complitedOrders}
          valueStyle={{ color: "#3f8600" }}
          prefix={<ArrowUpOutlined />}
        />
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    twoWeeks: state.homeReducer.twoWeeks,
    trackingDate: state.homeReducer.trackingDate
  };
};
const WrappedComponent = connect(mapStateToProps)(StatisticWidgets);
export default WrappedComponent;
