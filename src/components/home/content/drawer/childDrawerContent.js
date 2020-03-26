import React from "react";
import "firebase/auth";
import firebase from "firebase/app";
import { Form, Col, Row, Input, DatePicker, Button } from "antd";
import "antd/dist/antd.css";
import { Typography } from "antd";
import moment from "moment";
import TextArea from "antd/lib/input/TextArea";
const { Title } = Typography;
export class ChildDrawerContent extends React.Component {
  constructor(props) {
    super(props);
    this.rules = [
      {
        required: false
      },
      () => ({
        validator(rule, value) {
          const validURL = str => {
            let pattern = new RegExp(
              "^(https?:\\/\\/)?" +
                "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" +
                "((\\d{1,3}\\.){3}\\d{1,3}))" +
                "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
                "(\\?[;&a-z\\d%_.~+=-]*)?" +
                "(\\#[-a-z\\d_]*)?$",
              "i"
            );
            return !!pattern.test(str);
          };
          if (!value || validURL(value)) {
            return Promise.resolve();
          }

          return Promise.reject("Url is incorrect");
        }
      })
    ];
  }

  onFinish = fieldsValue => {
    const prevState = this.props.state;
    const values = {
      ...fieldsValue,
      birthday:
        fieldsValue["birthday"] !== undefined
          ? fieldsValue["birthday"].format()
          : prevState.birthday === undefined
          ? ""
          : prevState.birthday
    };
    console.log(fieldsValue);
    for (const key in values) {
      const element = values[key];
      element !== undefined
        ? (values[key] = element)
        : prevState[key] === undefined
        ? (values[key] = null)
        : (values[key] = prevState[key]);
    }
    let user = firebase.auth().currentUser;
    let updates = {};
    updates[`users/${user.uid}`] = { ...values };

    firebase
      .database()
      .ref()
      .update(updates);
    this.props.onChildrenDrawerClose();
  };
  // componentWillMount() {

  // }
  render() {
    console.log(this.props.state);
    const {
      name,
      birthday,
      city,
      email,
      about,
      country,
      instagram,
      facebook,
      twitter,
      google
    } = this.props.state;
    console.log(about);
    return (
      <Form layout="vertical" hideRequiredMark onFinish={this.onFinish}>
        <Title level={3}>User information</Title>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="name" label="Name">
              <Input placeholder="Please enter user name" defaultValue={name} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="birthday" label="Birthday">
              <DatePicker
                defaultValue={moment(birthday, " YYYY/MM/DD")}
                format={"YYYY/MM/DD"}
                style={{ width: "100%" }}
                getPopupContainer={trigger => trigger.parentNode}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="city" label="City">
              <Input placeholder="Please enter city" defaultValue={city} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="country" label="Country">
              <Input
                placeholder="Please enter Country"
                defaultValue={country}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="about" label="About me">
              <TextArea
                placeholder="About you"
                defaultValue={about}
                autoSize={{ minRows: 4, maxRows: 15 }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="email"
              label="Contact e-mail"
              rules={[
                {
                  type: "email"
                }
              ]}
            >
              <Input defaultValue={email} />
            </Form.Item>
          </Col>
        </Row>
        <Title level={3}>Socials</Title>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="instagram"
              label="Instagram"
              hasFeedback
              rules={this.rules}
            >
              <Input
                defaultValue={instagram}
                style={{ width: "100%" }}
                addonBefore="http://"
                placeholder="Please enter Instagram"
              />
            </Form.Item>
          </Col>{" "}
          <Col span={12}>
            <Form.Item
              name="facebook"
              label="Facebook"
              hasFeedback
              rules={this.rules}
            >
              <Input
                defaultValue={facebook}
                style={{ width: "100%" }}
                addonBefore="http://"
                placeholder="Please enter Facebook"
              />
            </Form.Item>
          </Col>{" "}
          <Col span={12}>
            <Form.Item
              name="twitter"
              label="Twitter"
              hasFeedback
              rules={this.rules}
            >
              <Input
                defaultValue={twitter}
                style={{ width: "100%" }}
                addonBefore="http://"
                placeholder="Please enter url"
              />
            </Form.Item>
          </Col>{" "}
          <Col span={12}>
            <Form.Item
              name="google"
              label="Google+"
              hasFeedback
              rules={this.rules}
            >
              <Input
                defaultValue={google}
                style={{ width: "100%" }}
                addonBefore="http://"
                placeholder="Please enter Google+"
              />
            </Form.Item>
          </Col>
        </Row>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form>
    );
  }
}
