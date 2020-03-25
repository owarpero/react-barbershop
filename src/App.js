import React from "react";
import LoginPage from "./components/login/loginPage";
import { Route, Switch } from "react-router-dom";
import HomePage from "./components/home/home";
import RegistationPage from "./components/login/registationPage";
import { connect } from "react-redux";
import { dataChanged, dataTrackingChanged } from "./store/home/actions";
import { optionsSelectTracking } from "./store/home/customTracking/action";
import firebase from "firebase/app";
import "firebase/database";
import { prevCurrentWeeks } from "./store/home/actions";
class App extends React.Component {
  constructor(props) {
    super(props);
    this.props.dispatch(prevCurrentWeeks());
    this.props.dispatch(dataChanged());
    this.props.dispatch(dataTrackingChanged());
    firebase
      .database()
      .ref("/service")
      .once("value")
      .then(snapshot => {
        this.props.dispatch(optionsSelectTracking(Object.keys(snapshot.val())));
      });
  }
  render() {
    // let isLoggedIn = localStorage.getItem("currentUser") !== null;
    // isLoggedIn = isLoggedIn || this.props.state.LoginReducer.loginData;
    return (
      <Switch>
        <Route path="/login" component={LoginPage} />

        <Route path="/registration" component={RegistationPage} />

        <Route path="/home" component={HomePage} />
      </Switch>
    );
  }
}
const mapStateToProps = state => {
  return {
    state
  };
};
const WrappedAppComponent = connect(mapStateToProps)(App);
export default WrappedAppComponent;
