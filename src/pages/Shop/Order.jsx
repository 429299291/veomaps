import React, { PureComponent, Fragment,useState } from 'react';
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
// const [isNotAbleToUpdate, setIsNotAbleToUpdate] = useState();


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
/* eslint react/no-multi-comp:0 */
class Order extends PureComponent {
  state = {
    updateModalVisible: false,
    filterCriteria: {},
    isNotAbleToUpdate:false,
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

   orderStatusHandleChange =(value)=>{
      // value == 'PENDING' ? this.setState({isNotAbleToUpdate:true}):this.setState({isNotAbleToUpdate:false})
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
    fields = {
      status:fields.orderStatus,
      operator:this.props.currentUser.email,
      note:fields.note
    }
    dispatch({
      type: 'order/update',
      payload: fields,
      id,
      onSuccess: this.getOrders,
    });

    this.handleUpdateModalVisible();
  };

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

    const RenderSimpleForm=()=> {
      const [form] = Form.useForm()
      const handleSearch = (value) => {
        form.submit()
      }
      const onFinish = (fieldsValue)=>{
        console.log(fieldsValue);
        if (fieldsValue.name) {
          const splited = fieldsValue.name.split(" ");
  
          if (splited.length == 2) {
  
            fieldsValue.firstName = splited[0];
            fieldsValue.lastName = splited[1];
  
          } else {
            fieldsValue.firstName = fieldsValue.name;
          }
        }
        const { filterCriteria } = this.state;

        const values = Object.assign({}, filterCriteria, fieldsValue, {
          pageNumber: 1,
          pageSize: 10
        });
        console.log(values);
        this.setState(
          {
            filterCriteria: values
          },
          () => this.getOrders()
        );
      }
      const handleFormReset = () => {
        const { form, dispatch } = this.props;
        const { filterCriteria } = this.state;
    
        const params = {
          currentPage: 1,
          pageSize: filterCriteria.pageSize
        };
    
        this.setState(
          {
            filterCriteria: params
          },
          () => handleSearch()
        );
      };
      return (
        <Form onFinish={onFinish} layout="inline" form={form} >
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            
              <Col md={8} sm={24}>
               
                  <FormItem 
                    label="Order Number"
                    labelCol={{ span:9 }}
                    name='orderNumber'
                    wrapperCol={{ span: 15 }}
                  >
                      <Input placeholder="Order Number" />
                  </FormItem>
                
              </Col>
  
              
            <Col md={8} sm={12}>
              <FormItem label="Name" name='name'>
                <Input placeholder="Name" />
              </FormItem>
            </Col>  
  
                <Col md={8} sm={24}>
                  <span className={styles.submitButtons}>
                    <Button type="primary" htmlType="submit" onClick={handleSearch}>
                      Search
                    </Button>
                    <Button style={{ marginLeft: 8 }} onClick={handleFormReset}>
                      Reset
                    </Button>
                  </span>
                </Col>
            
  
  
                <Col md={8} sm={24}>
                  <span>
                    Total: {order.total}
                  </span>
                </Col>
                </Row>
        </Form>
      );
    }
    const UpdateForm = ((props) => {
      const {
        modalVisible,
        handleUpdate,
        handleModalVisible,
        currentUser,
        record,
      } = props;
      const [form] = Form.useForm()
      form.setFieldsValue(record)
      const okHandle = () => {
        form.submit()
        // if (form.isFieldsTouched()) {
        //   form.validateFields((err, fieldsValue) => {
        //     if (err) return;
        //     fieldsValue.operator = currentUser.email;
        //     form.resetFields();
        //     handleUpdate(record.id, fieldsValue);
        //   });
        // } else handleModalVisible();
      };  
      return (
        <Modal
          destroyOnClose
          title="Detail"
          visible={modalVisible}
          onOk={() => handleModalVisible()}
          forceRender
          width={"95%"}
          onCancel={() => handleModalVisible()}
        >
    
        <Card title="Order" style={{ marginTop: "2em" }}>
          <Form>
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
            </Form>
        </Card> 
    
    
    
    
        <Card title="Review" style={{ marginTop: "2em" }}>
        <Form form={form} onFinish={()=>{handleUpdate(record.id, form.getFieldsValue(true))}}>
            <FormItem labelCol={{ span: 3 }} 
              name='orderStatus'
              wrapperCol={{ span: 7 }} label="Status">

              <Select placeholder="select" style={{ width: "100%" }} onChange={this.orderStatusHandleChange}>
                <Option value="APPROVED">APPROVED</Option>
                <Option value="PENDING">PENDING</Option>
                <Option value='SHIPPING'>SHIPPING</Option>
                <Option value='DENIED'>DENIED</Option>
                <Option value='CANCEL'>CANCEL</Option>
    
              </Select>
            </FormItem>
            <FormItem labelCol={{ span: 3 }} 
              name='note'
              wrapperCol={{ span: 7 }} label="Note">
                <TextArea placeholder="Please Input" />
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
                        disabled={this.state.isNotAbleToUpdate}
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
            </Form>
        </Card> 
    
         
        </Modal>
      );
    });
    

    return (
      <PageHeaderWrapper title="Order List">
        <Card bordered={false}>
          <div className={styles.tableList}>
          <div className={styles.tableListForm}>

            <RenderSimpleForm/>
          </div>
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
const mapStateToProps = ({ order, user, loading }) => {
  return {
    order,
    currentUser: user.currentUser,
    loading: loading.models.order
  }
}
export default connect(mapStateToProps)(Order) 