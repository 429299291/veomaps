import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
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
  Radio,
  Divider,
  Popconfirm,
  Table,
  DatePicker
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

const { RangePicker } = DatePicker;

import styles from './Order.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

const OrderStatus = {
    "PENDING": ["APPROVED", "DENIED", "CANCEL", "PENDING"],
    "APPROVED": ["SHIPPING", "CANCEL", "APPROVED"],
    "SHIPPING": ["SHIPPED", "SHIPPING"],
    "RETURNED": null,
    "CANCEL": null,
    "DENIED": null,
}

const orderItemColumn =  [
    {
        title: 'Description',
        dataIndex: 'description',
    },
    {
      title: 'Name',
      dataIndex: 'name',
    
    },
    {
        title: 'Unit Price',
        dataIndex: 'price',
      
      },
    {
      title: 'Type',
      dataIndex: 'type',
    },
    {
        title: 'Quantity',
        dataIndex: 'quantity',
    }
  ];

  const orderUpdateEventColumn = [
    {
        title: 'From',
        dataIndex: 'oldValue',
    },
    {
        title: 'To',
        dataIndex: 'newValue',
    },
    {
        title: 'Note',
        dataIndex: 'note',
    },
    {
        title: 'By',
        dataIndex: 'operator',
    },
    {
        title: 'Created',
        dataIndex: 'created',
        render: val => <span>{moment(val).format("YYYY-MM-DD HH:mm:ss")}</span>
    },
  ]

const UpdateForm = Form.create()((props) => {
  const {
    form,
    modalVisible,
    handleUpdate,
    handleModalVisible,
    currentUser,
    record,
  } = props;
  const okHandle = () => {
    if (form.isFieldsTouched()) {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        fieldsValue.operator = currentUser.email;
        form.resetFields();
        handleUpdate(record.id, fieldsValue);
      });
    } else handleModalVisible();
  };


  const isNotAbleToUpdate = !form.getFieldValue("status") || form.getFieldValue("status") === record.orderStatus;

  return (
    <Modal
      destroyOnClose
      title="Detail"
      visible={modalVisible}
      onOk={() => handleModalVisible()}
      width={"95%"}
      onCancel={() => handleModalVisible()}
    >

    <Card title="Order" style={{ marginTop: "2em" }}>
        <Row>
            <Col span={8}>
                    <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="Order Number">
                    <div> {record.orderNumber} </div>
                </FormItem>

                <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="Name">
                    <div> {record.firstName + " " + record.lastName} </div>
                </FormItem>
                <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="Address">
                    <div> {record.streetAddress + " " + record.unit + "," + record.city + "," + record.state + "," + record.zipCode} </div>
                </FormItem>
                <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="Email">
                    <div> {record.email} </div>
                </FormItem>
                <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="Phone">
                    <div> {record.phoneNumber} </div>
                </FormItem>
                <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="Tax Rate">
                    <div> {record.taxRate} </div>
                </FormItem>
                <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="estimated Tax">
                    <div> {record.estimatedTax} </div>
                </FormItem>
                <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="Total Price">
                    <div> {record.totalPrice} </div>
                </FormItem>
            </Col>
            <Col span={16}>
                <div style={{ marginBottom: "2em" }} > Order Items: </div>
                <Table
                dataSource={record.orderItems}
                columns={orderItemColumn}
                size="small"
                scroll={{ x: 500 }}
                pagination={false}
              />
              <div style={{ marginBottom: "2em",  }} > Update Events: </div>
                <Table
                dataSource={record.orderUpdateEvents}
                columns={orderUpdateEventColumn}
                size="small"
                scroll={{ x: 500 }}
                pagination={false}
              />
              
            </Col>
        </Row>

        

    </Card> 




    <Card title="Review" style={{ marginTop: "2em" }}>

        <FormItem labelCol={{ span: 3 }} wrapperCol={{ span: 7 }} label="Status">
            {!OrderStatus[record.orderStatus] ?
            <div> {record.orderStatus} </div>
            :
            form.getFieldDecorator('status', {
           
            initialValue: record.orderStatus,
            })(<Select placeholder="select" style={{ width: "100%" }}>
            {
               OrderStatus[record.orderStatus].map((option,key)=>
                <Option key={key} value={option}>
                    {option}
                </Option>
                )
            }

          </Select>)}
        </FormItem>
        <FormItem labelCol={{ span: 3 }} wrapperCol={{ span: 7 }} label="Note">
            {form.getFieldDecorator('note', {
            initialValue: record.message,
            })(<TextArea placeholder="Please Input" />)}
        </FormItem>
        {currentUser &&
            <FormItem labelCol={{ span: 3 }} wrapperCol={{ span: 7 }} label="Reviewer">
                {currentUser.email}
            </FormItem>
        } 

        <FormItem labelCol={{ span: 3 }} wrapperCol={{ span: 7 }}>

        <Row>
            <Col span={4}>
                <Button 
                    onClick={okHandle}
                    type="primary"
                    disabled={isNotAbleToUpdate}
                > 
                    Update 
                </Button>
            
            </Col>
            <Col span={4}>
            {/* <Button 
                    onClick={okHandle}
                    type="primary"
                    disabled={isNotAbleToUpdate}
                > 
                    Cancel 
                </Button> */}
            
            </Col>
        </Row>

        
        </FormItem>

    </Card> 

     
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
@connect(({
  order,
  loading,
  user
}) => ({
    order,
    currentUser: user.currentUser,
    loading: loading.models.order
}))
@Form.create()
class Order extends PureComponent {
  state = {
    updateModalVisible: false,
    filterCriteria: {},
    selectedRecord: {},
  };

  columns = [
    {
        title: 'Order Number',
        dataIndex: 'orderNumber',
    },
    {
      title: 'First Name',
      dataIndex: 'firstName',
    
    },
    {
        title: 'Last Name',
        dataIndex: 'lastName',
      
      },
    {
      title: 'City',
      dataIndex: 'city',
    },
    {
        title: 'State',
        dataIndex: 'state',
    },
    {
        title: 'Status',
        dataIndex: 'orderStatus',
    },
    {
      title: 'Created',
      dataIndex: 'created',
      render: val => <span>{moment(val).format("YYYY-MM-DD HH:mm:ss")}</span>
  },
    {
      title: 'Operation',
      render: (text, record) => (
        <div>
          <a onClick={() => this.handleUpdateModalVisible(true, record)}>
                Detail
          </a>
        </div>
      ),
    },
  ];

  componentDidMount() {
        this.getOrders();
    }


  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.selectedAreaId !== this.props.selectedAreaId) {
      this.getOrders();
    }
  }

  getOrders = () => {
      const { dispatch } = this.props;
      const { filterCriteria } = this.state;
      dispatch({
        type: 'order/get',
        query: filterCriteria,
      });
    }



  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      selectedRecord: record || {},
    });
  };


  handleUpdate = (id, fields) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'order/update',
      payload: fields,
      id,
      onSuccess: this.getOrders,
    });

    this.handleUpdateModalVisible();
  };

  handleSearch = e => {
    e && e.preventDefault();

    const { form } = this.props;
    const { filterCriteria } = this.state;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      if (fieldsValue.created) {
        fieldsValue.start = moment(fieldsValue.created[0])
          .utcOffset(0)
          .format("YYYY-MM-DD HH:mm:ss");
        fieldsValue.end = moment(fieldsValue.created[1])
          .utcOffset(0)
          .format("YYYY-MM-DD-YYYY HH:mm:ss");
        fieldsValue.created = undefined;
      }

      if (fieldsValue.name) {
        const splited = fieldsValue.name.split(" ");

        if (splited.length == 2) {

          fieldsValue.firstName = splited[0];
          fieldsValue.lastName = splited[1];

        } else {
          fieldsValue.firstName = fieldsValue.name;
        }
      }

      const values = Object.assign({}, filterCriteria, fieldsValue, {
        pageNumber: 1,
        pageSize: 10
      });

      this.setState(
        {
          filterCriteria: values
        },
        () => this.getOrders()
      );
    });
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    const { filterCriteria } = this.state;
    form.resetFields();

    const params = {
      currentPage: 1,
      pageSize: filterCriteria.pageSize
    };

    this.setState(
      {
        filterCriteria: params
      },
      () => this.handleSearch()
    );
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
      order
    } = this.props;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          
            <Col md={8} sm={24}>
             
                <FormItem 
                  label="Order Number"
                  labelCol={{ span:9 }}
                  wrapperCol={{ span: 15 }}
                >
                  {getFieldDecorator("orderNumber")(
                    <Input placeholder="Order Number" />
                  )}
                </FormItem>
              
            </Col>

            
          <Col md={8} sm={12}>
            <FormItem label="Name">
              {getFieldDecorator("name")(<Input placeholder="Name" />)}
            </FormItem>
          </Col>

          {/* <Col md={8} sm={24}>
            <FormItem label="Created">
              {getFieldDecorator("created")(<RangePicker />)}
            </FormItem>
          </Col> */}
          
          </Row>

          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>

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

          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>

              <Col md={8} sm={24}>
                <span>
                  Total: {order.total}
                </span>
              </Col>
          
          </Row>


      </Form>
    );
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { filterCriteria } = this.state;

    const params = {
      ...filterCriteria
    };

    params.pageNumber = pagination.current;
    params.pageSize = pagination.pageSize;

    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    this.setState({ filterCriteria: params }, () => this.getOrders());
  };


  render() {


    const {
      order,
      loading,
      currentUser
    } = this.props;
   
    const {
      updateModalVisible,
      selectedRecord,
      filterCriteria
    } = this.state;

    const pagination = {
      defaultCurrent: 1,
      current: filterCriteria.pageNumber,
      pageSize: filterCriteria.pageSize,
      total: order.total
    };


    const updateMethods = {
      handleModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };


    return (
      <PageHeaderWrapper title="Order List">
        <Card bordered={false}>
          <div className={styles.tableList}>
          <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <div className={styles.tableListOperator}>
            </div>
            <StandardTable
              loading={loading}
              data={{ list: order.data, pagination: pagination  }}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>

        <UpdateForm
          {...updateMethods}
          modalVisible={updateModalVisible}
          currentUser={currentUser}
          record={selectedRecord}
        />
      </PageHeaderWrapper>
    );
  }
}

export default Order;
