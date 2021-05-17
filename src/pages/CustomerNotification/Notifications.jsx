import React, { PureComponent, Fragment } from "react";
import { connect } from "dva";
import moment from "moment";
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Modal,
  Steps,
  Radio, Divider, Popconfirm, Dropdown, DatePicker
} from "antd";
import StandardTable from "@/components/StandardTable";
import PageHeaderWrapper from "@/components/PageHeaderWrapper";

import { getAuthority } from "@/utils/authority";

import VehicleDetail from "@/pages/Vehicle/VehicleDetail";
import CustomerDetail from "@/pages/Customer/CustomerDetail";

import {formatPhoneNumber} from "@/utils/utils"

const authority = getAuthority();

const { RangePicker } = DatePicker;

import styles from "./Notification.less";

const Option = Select.Option;

const FormItem = Form.Item;

const TextArea = Input.TextArea;

const messageTypes = ["push notification", "sms message"];

const MessageAreaSender = Form.create()(props => {
    const {
      form,
      areaId,
      handleSendNotifications
    } = props;
    const okHandle = () => {
      if (form.isFieldsTouched())
        form.validateFields((err, fieldsValue) => {
          
          if (err) return;
          
          form.resetFields();
  
          handleSendNotifications(fieldsValue.message, fieldsValue.type);

        });
    };
  
    return (
        <div style={{marginBottom: "10em"}}>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{marginBottom: "2em"}}>
                    <Col md={8} sm={24}>
                        Message: 
                        {form.getFieldDecorator("message", {
                            rules: [
                                {
                                required: true,
                                message: "Message cant be null",
                                min: 1
                                }
                        ]
                        })(<TextArea autosize={{minRows: 20, maxRows: 23}} />)}
                    </Col>
            </Row>


            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>

                <Col md={4} sm={24}>
                {form.getFieldDecorator("type", {
                    rules: [
                        {
                        required: true,
                        message: "You have pick a type"
                        }
                    ]
                    })(
                    <Select placeholder="select" style={{ width: "100%" }}>
                        <Option value="0">Push Notification</Option>
                        {/* <Option value="1">SMS Message</Option> */}
                    </Select>
                    )}
                </Col>
                <Col md={4} sm={24}>
                    <Button 
                        type="primary"
                        onClick={okHandle}
                        disabled={!authority.includes("send.customer.notification") || !areaId}
                        style={{marginRight: "1em", marginTop: "0.5em"}}
                    >
                    Send
                    </Button>
                </Col>

            </Row>
        </div  >
    );
  });



/* eslint react/no-multi-comp:0 */
@connect(({ notifications , loading, areas }) => ({
  notifications: notifications.customer,
  selectedAreaId: areas.selectedAreaId,
  loading: loading.models.notifications
}))
@Form.create()
class Notifications extends PureComponent {
  state = {
    updateModalVisible: false,
    detailModalVisible: false,
    expandForm: false,
    selectedRows: [],
    filterCriteria: {},
    selectedRecord: {}
  };

  columns = [
    {
      title: "Sender",
      dataIndex: "adminEmail"
    },
    {
      title: "Content",
      dataIndex: "message",
    },
    {
      title: "Type",
      dataIndex: "type",
      render: val => <span>{messageTypes[val]}</span>
    },
    {
      title: "Date",
      dataIndex: "created",
      sorter: true,
      render: val => <span>{moment(val).format("YYYY-MM-DD HH:mm:ss")}</span>
    }
  ];

  componentDidMount() {
    this.handleGetSentNotifications();
  }

  handleGetSentNotifications = () => {
    const { dispatch, selectedAreaId } = this.props;
    const { filterCriteria } = this.state;

    dispatch({
      type: "notifications/getForCustomer",
      payload: selectedAreaId ? Object.assign({},filterCriteria, {areaId: selectedAreaId} ) : filterCriteria,
      onSuccess: () => this.setState({selectedRows: []})
    });
  };



  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { filterCriteria } = this.state;

    const params = {
      ...filterCriteria
    };

    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    this.setState({ filterCriteria: params }, () => this.handleGetSentNotifications());
  };

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();

    this.setState(
      {
        filterCriteria: {}
      },
      () => this.handleGetSentNotifications()
    );
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;
    const { filterCriteria } = this.state;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = Object.assign({}, filterCriteria, fieldsValue);


      this.setState(
        {
          filterCriteria: values
        },
        () => this.handleGetSentNotifications()
      );
    });
  };


  componentDidUpdate(prevProps, prevState, snapshot) {

    if (prevProps.selectedAreaId !== this.props.selectedAreaId) {
      this.handleGetSentNotifications();
    }
  }

  handleSendNotifications = (content, messageType) => {

    const { dispatch, selectedAreaId } = this.props;
    
    dispatch({
        type: "notifications/sendForCustomers",
        payload:  content,
        areaId: selectedAreaId,
        messageType: messageType,
        onSuccess: this.handleGetSentNotifications 
      });
  }


  renderSimpleForm() {
    const {
      form: { getFieldDecorator }
    } = this.props;

    const areas = this.props.areas;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="Keywords">
              {getFieldDecorator("email")(
                <Input placeholder="Email" />
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="Type"
            >
              {getFieldDecorator("type")(
                <Select placeholder="select" style={{ width: "100%" }}>
                  {messageTypes.map((type,index) => (
                    <Option key={index} value={index}>
                      {type}
                    </Option>
                  ))}
                  <Option value={null}>All</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                Search
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                Reset
              </Button>
            </span>
          </Col>
        </Row>

      </Form>
    );
  }

  render() {
    const { notifications, loading, selectedAreaId } = this.props;
    const {
      selectedRows,
      selectedRecord,
      errorImages,
      vehicleDetailModalVisible,
      selectedVehicleId,
      customerDetailModalVisible,
      selectedCustomerId
    } = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible
    };
    const updateMethods = {
      handleModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate
    };

    return (
      <PageHeaderWrapper title="Notification List">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              
            {
                authority.includes("send.customer.notification") &&

                <MessageAreaSender 
                    areaId={selectedAreaId}
                    handleSendNotifications={this.handleSendNotifications}
                />
            }
              
              {this.renderSimpleForm()}
             
            </div>
          
            <StandardTable
              loading={loading}
              data={{ list: notifications, pagination: {}}}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
              scroll={{x:1300}}
            />
          </div>
        </Card>

       
      </PageHeaderWrapper>
    );
  }
}

export default Notifications;
