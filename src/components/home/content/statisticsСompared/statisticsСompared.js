import React from "react";
import { Row, Col, Card } from "antd";
import SalesBarChart from "./recordsBar";
import "antd/dist/antd.css";
import "./statistics.css";
import { connect } from "react-redux";
import EarningsBarChart from "./earningsBar";
import MoneyOrderBarChart from "./moneyToOrder";

import { cardLoading } from "../../../../store/home/statisticsCompared/actions";
import StatisticWidgets from "./statisticks";
class StatisticsCompared extends React.Component {
  constructor(props) {
    super(props);
    let { dispatch } = this.props;
    dispatch(cardLoading(true));
  }

  render() {
    return (
      <div className="site-card-wrapper">
        <Row gutter={2}>
          <Col span={12}>
            <Card
              title="Total statistic"
              bordered={true}
              loading={this.props.cardLoading}
            >
              <StatisticWidgets />
            </Card>
          </Col>
          <Col span={12}>
            <Card
              bodyStyle={{ marginLeft: "30%" }}
              loading={this.props.cardLoading}
              //loading={true}
              title="Last month earnings goal"
              bordered={true}
            >
              <EarningsBarChart />
            </Card>
          </Col>
        </Row>
        <Row>
          <Col span={18}>
            <Card
              loading={this.props.cardLoading}
              bodyStyle={{ marginLeft: "30%" }}
              title="Purpose of people records for a week "
              bordered={true}
            >
              <SalesBarChart />
            </Card>
          </Col>
          <Col span={6}>
            <Card
              bodyStyle={{ marginLeft: "30%" }}
              loading={this.props.cardLoading}
              //loading={true}
              title="Сomparison of money to orders"
              bordered={true}
            >
              <MoneyOrderBarChart />
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    cardLoading: state.statisticsReducer.cardLoading
  };
};
const WrappedComponent = connect(mapStateToProps)(StatisticsCompared);
export default WrappedComponent;
