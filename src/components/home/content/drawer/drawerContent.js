import React from "react";

import "antd/dist/antd.css";
import "./drawer.scss";
import "firebase/auth";
import firebase from "firebase/app";
import { Button } from "antd";
import { Drawer, Divider, Col, Row } from "antd";
import ChildDrawerContent from "./childDrawerContent";

const DescriptionItem = ({ title, content }) => (
  <div
    className="site-description-item-profile-wrapper"
    style={{
      fontSize: 14,
      lineHeight: "22px",
      marginBottom: 7
    }}
  >
    <p
      className="site-description-item-profile-p"
      style={{
        marginRight: 8,
        display: "inline-block"
      }}
    >
      {title}:
    </p>
    {content}
  </div>
);
const pStyle = {
  fontSize: 16,
  lineHeight: "24px",
  display: "block",
  marginBottom: 16
};
export default class DrawerContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      childrenDrawer: false
    };
  }
  onChildrenDrawerClose = () => {
    this.setState({ childrenDrawer: false });
  };
  componentDidMount() {
    let user = firebase.auth().currentUser;
    firebase
      .database()
      .ref(`users/${user.uid}`)
      .on("value", snapshot => {
        this.setState({ ...snapshot.val() });
      });
  }
  showChildrenDrawer = () => {
    this.setState({ childrenDrawer: true });
  };
  render() {
    const {
      name,
      country,
      birthday,
      city,
      about,
      email,
      facebook,
      google,
      instagram,
      twitter
    } = this.state;

    return (
      <div>
        <p
          className="site-description-item-profile-p"
          style={{ ...pStyle, marginBottom: 24 }}
        >
          User Profile
        </p>
        <p className="site-description-item-profile-p" style={pStyle}>
          Personal
        </p>
        <Row>
          <Col span={12}>
            <DescriptionItem title="Full Name" content={name} />
          </Col>
          <Col span={12}>
            <DescriptionItem title="Birthday" content={birthday} />
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <DescriptionItem title="City" content={city} />
          </Col>
          <Col span={12}>
            <DescriptionItem title="Country" content={country} />
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <DescriptionItem title="Abowt me" content={about} />
          </Col>
        </Row>

        <Divider />
        <p className="site-description-item-profile-p" style={pStyle}>
          Contacts
        </p>
        <Row>
          <Col span={12}>
            <DescriptionItem title="Email" content={email} />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <DescriptionItem
              title="Socials"
              content={
                <ul className="socialIcons">
                  <li>
                    <a href={facebook} className="facebook">
                      <i className="fa fa-facebook "></i>
                    </a>
                  </li>
                  <li>
                    <a href={twitter} className="twitter">
                      <i className="fa fa-twitter"></i>
                    </a>
                  </li>
                  <li>
                    <a href={instagram} className="instagram">
                      <i className="fa fa-instagram"></i>
                    </a>
                  </li>
                  <li>
                    <a href={google} className="googlePlus">
                      <i className="fa fa-google-plus"></i>
                    </a>
                  </li>
                </ul>
              }
            />
          </Col>
          <Button type="primary" onClick={this.showChildrenDrawer}>
            Profile editing
          </Button>
          <Drawer
            title="Profile editing"
            width={720}
            closable={false}
            onClose={this.onChildrenDrawerClose}
            visible={this.state.childrenDrawer}
          >
            <ChildDrawerContent
              state={this.state}
              onChildrenDrawerClose={this.onChildrenDrawerClose}
            />
          </Drawer>
        </Row>
      </div>
    );
  }
}
