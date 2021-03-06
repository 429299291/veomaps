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
  Divider,
  Steps,
  Radio,
  InputNumber,
  Table,
  DatePicker,
  Popconfirm
} from "antd";
import StandardTable from "@/components/StandardTable";
import PageHeaderWrapper from "@/components/PageHeaderWrapper";

import CustomerDetail from "./CustomerDetail";

const { RangePicker } = DatePicker;

import styles from "./Customer.less";
import { roundTo2Decimal } from "../../utils/mathUtil";

import { getAuthority } from "@/utils/authority";
import { formatPhoneNumber } from "@/utils/utils";
import { exportCSVFile } from "../../utils/utils";
import ride from "@/models/ride";

const customerCsvHeader = {
  id: "uid",
  email: "email",
  deposit: "Deposit",
  rideCredit: "Ride Credit",
  phoneModel: "Phone Model",
  created: "Register",
  updated: "updated",
  areaId: "areaId",
  emailStatus: "emailStatus",
  inviteCode: "inviteCode",
  migrated: "migrated",
  status: "status",
  rideCount: "Ride Count"
};

const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(",");
const statusMap = ["default", "processing", "success", "error"];
const operationStatus = ["NORMAL", "MANTAINANCE"];
const connectStatus = ["Offline", "Online"];
const lockStatus = ["Unlock", "lock"];
const customerType = ["Bicycle", "Scooter", "E-Customer", "Car"];

const isNumberRegex = /^-?\d*\.?\d{1,2}$/;
const isEmailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const customerStatus = ["NORMAL", "FROZEN", "ERROR"];

// const queryStatus = ["FROZEN"];
const queryStatus = ["NORMAL","FROZEN",'ALL'];

const authority = getAuthority();
const RenderSimpleForm=(props)=> {
  const [form] = Form.useForm()
  // props.filterCriteria.timeRange ? form.setFieldsValue({
  //   created: [moment(props.filterCriteria.timeRange.start, 'YYYY-MM-DD HH:mm:ss'), moment(props.filterCriteria.timeRange.end, 'YYYY-MM-DD HH:mm:ss')]
  // }) : null
  //error
  if(props.filterCriteria.timeRange){
    const start = props.filterCriteria.timeRange.start
    const end = props.filterCriteria.timeRange.end
    form.setFieldsValue({
      created: [moment(start, 'YYYY-MM-DD HH:mm:ss'), moment(end, 'YYYY-MM-DD HH:mm:ss')]
    })
  }
  const handleFormReset = ()=>{
    props.handleFormReset()
    form.resetFields()
  }
  return (
    <Form layout="inline" form={form} initialValues={{
      status:2
    }}>
      {/* <Row gutter={{ md: 8, lg: 24, xl: 48 }}> */}
        <Col span={5} style={{padding: '0 18px 0 0'}}>
          <FormItem label="phone" name='phone'> 
              <Input placeholder="PHONE or EMAIL" onPressEnter={()=>{props.handleSearch(form.getFieldsValue(true))}}/>
          </FormItem>
        </Col>
        <Col span={4} style={{padding: '0 18px'}}>
          <FormItem label="Status" name='status'>
              <Select placeholder="select" style={{ width: "100%" }}>
                {queryStatus.map((status, index) => (
                  <Option key={index} value={index}>
                    {queryStatus[index]}
                  </Option>
                ))}
              </Select>
          </FormItem>
        </Col>
        <Col span={10}>
          <FormItem label="Registered" name='created'>
            <RangePicker />
          </FormItem>
        </Col>
        <Col span={5} style = {{paddingLeft:'2rem'}}>
          {`count: ${props.customerTotal}`}
        </Col>
        <Col span={8}>
          <span className={styles.submitButtons}>
          {<Button type="primary" onClick={() => props.handleGenTempCodeModalVisible(true)}>
                Generate Verification Code
            </Button> }

            <Button  style={{ marginLeft: 8 }} onClick={()=>{props.handleSearch(form.getFieldsValue(true))}}>
              Search
            </Button>

            <Button style={{ marginLeft: 8 }} onClick={handleFormReset}>
              Reset
            </Button>
          </span>
        </Col>
      {/* </Row> */}
    </Form>
  );
}
const GenTempCodeForm = (props => {
  const {
    modalVisible,
    handleGetTempCode,
    handleModalVisible,
    tempCode
  } = props;
  const [form] = Form.useForm()
  const okHandle = () => {
    if (form.isFieldsTouched()){
      handleGetTempCode(form.getFieldsValue(true).phoneNumber);
    }
    else handleModalVisible();
  };

  return (
    <Modal
      destroyOnClose
      title="Update Customer"
      visible={modalVisible}
      onOk={okHandle}
      forceRender
      onCancel={() => handleModalVisible()}
    >
      <Form form={form}>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="Phone Number:"
        name='phoneNumber'
      >
        <Input style={{marginLeft: "2em"}} placeholder="Please Input" />
      </FormItem>
      { tempCode && <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="Temp Code"
          name='tempCode'
        >
          <span> {tempCode}</span>
        </FormItem>
      }
      </Form>
    </Modal>
  );
});

const UpdateForm = (props => {
  const {
    modalVisible,
    handleUpdate,
    handleModalVisible,
    areas,
    record
  } = props;
  const [form] = Form.useForm()
  form.setFieldsValue(record)
  const okHandle = () => {
    if (form.isFieldsTouched())
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        form.resetFields();

        handleUpdate(record.id, fieldsValue);
      });
    else handleModalVisible();
  };

  const checkMoneyFormat = (rule, value, callback) => {
    if (isNumberRegex.test(value)) {
      callback();
      return;
    }
    callback("Credit Must be Number!");
  };

  const checkEmailFormat = (rule, value, callback) => {
    if (isEmailRegex.test(value)) {
      callback();
      return;
    }
    callback("Please input correct email format");
  };

  return (
    <Modal
      destroyOnClose
      title="Update Customer"
      visible={modalVisible}
      onOk={okHandle}
      forceRender
      onCancel={() => handleModalVisible()}
    >
      <Form form={form}>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        name='credit'
        rules={
          [{ validator: checkMoneyFormat }]
        }
        label="CREDIT AMOUNT"
      >
       <Input placeholder="Please Input" />
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="FULL NAME"
        name='fullName'
      >
        <Input placeholder="Please Input" />
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="EMAIL" name='email' rules={[{ validator: checkEmailFormat }]}>
        <Input placeholder="Please Input" />
      </FormItem>

      {customerStatus && (
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="Status"
          name='status'
          rules={
            [
              {
                required: true,
                message: "You have pick a status"
              }
            ]
          }
        >
         
            <Select placeholder="select" style={{ width: "100%" }}>
              {customerStatus.map((status, index) => (
                <Option key={index} value={index}>
                  {customerStatus[index]}
                </Option>
              ))}
            </Select>
        </FormItem>
      )}

      {areas && (
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Area"
          name='areaId'
          rules={
            [
              {
                required: true,
                message: "You have pick a area"
              }
            ]
          }
          >
            <Select placeholder="select" style={{ width: "100%" }}>
              {areas.map(area => (
                <Option key={area.id} value={area.id}>
                  {area.name}
                </Option>
              ))}
            </Select>
        </FormItem>
      )}
      </Form>
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
class Customer extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    detailModalVisible: false,
    couponModalVisible: false,
    expandForm: false,
    selectedRows: [],
    customerCoupons: null,
    filterCriteria: { 
        pagination:{
          page: 1, 
          pageSize: 10,
          sort:{
            sortBy:'created',
            direction:'desc'
          }
      } 
    },
    selectedRecord: {},
    genTempCodeModalVisible: false,
    tempCode: null
  };

  columns = [
    {
      title: "phone",
      dataIndex: "phone",
      render: val => formatPhoneNumber(val + "")
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
    },
    {
      title: "Area",
      render: (text, record) =>
        this.props.areaNames && this.props.areaNames[record.areaId]
    },
    {
      title: "email",
      dataIndex: "email"
    },
    {
      title: "Balance",
      render: (text, record) => <p> {(record.rideCredit+ record.deposit).toFixed(2)}</p>
    },
    {
      title: "operation",
      render: (text, record) => (
        <Fragment>
          {/* {authority.includes("customer") && (
           
          )} */}

            <a onClick={() => this.handleDetailModalVisible(true, record)}>
              Detail
            </a>
        </Fragment>
      )
    }
  ];

  componentDidMount() {
    this.handleGetCustomers();
    this.handleGetCoupons();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.selectedAreaId !== this.props.selectedAreaId) {
      this.handleGetCustomers();
      this.handleGetCoupons();
    }
  }

  handleGetCoupons = () => {
    const { dispatch, selectedAreaId } = this.props;
    // dispatch({
    //   type: "coupons/get",
    //   payload: { areaId: selectedAreaId }
    // });
  };

  handleGetCustomers = () => {
    const { dispatch, selectedAreaId } = this.props;
    const { filterCriteria } = this.state;
    const data = {pagination:filterCriteria.pagination}
    filterCriteria.pagination.page-1<0 ?filterCriteria.pagination.page = 0 : filterCriteria.pagination.page = filterCriteria.pagination.page-1
    dispatch({
      type: "customers/get",
      payload: Object.assign(selectedAreaId?{areaIds:[selectedAreaId]}:{},filterCriteria)
      // selectedAreaId ? Object.assign({}, filterCriteria, { areaId: selectedAreaId }) : filterCriteria
    });
  };

  handleGetCustomerCoupons = customerId => {
    const { dispatch } = this.props;
    // dispatch({
    //   type: "coupons/getCustomerCoupons",
    //   payload: customerId,
    //   onSuccess: response => this.setState({ customerCoupons: response })
    // });
  };

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { filterCriteria } = this.state;

    const params = {
      ...filterCriteria
    };

    params.pagination.page = pagination.current;
    params.pagination.pageSize = pagination.pageSize;

    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    this.setState({ filterCriteria: params }, () => this.handleGetCustomers());
  };

  handleFormReset = () => {
    const { dispatch } = this.props;
    const { filterCriteria } = this.state;

    const params = {
      pagination:{
        page: 1,
        pageSize: filterCriteria.pagination.pageSize
      }
    };

    this.setState(
      {
        filterCriteria: params
      },
      () => this.handleGetCustomers()
    );
  };

  handleSearch = fieldsValue => {
    const { filterCriteria } = this.state;
      if (fieldsValue.created) {
        // fieldsValue.registerStart = moment(fieldsValue.created[0])
        //   .utcOffset(0)
        //   .format("YYYY-MM-DDTHH:mm:ssZ");
        // fieldsValue.registerEnd = moment(fieldsValue.created[1])
        //   .utcOffset(0)
        //   .format("YYYY-MM-DDTHH:mm:ssZ");
        fieldsValue.timeRange = {
          start:moment(fieldsValue.created[0])
          .format("YYYY-MM-DDTHH:mm:ss"),
          end:moment(fieldsValue.created[1])
          .format("YYYY-MM-DDTHH:mm:ss")
        }
        fieldsValue.created = undefined;
      }
      const values = Object.assign({}, filterCriteria, fieldsValue, {
        // status:2,
        pagination:{
          page: 0,
          pageSize: 10
        }
      });
      if(values.phone){
        if(
          /[0-9]()/.test(values.phone) &&
        !values.phone.includes("@")
        ) {
          values.phone = values.phone.replace(/-/g,"").replace(/\(/g,'').replace(/\)/g,'').replace(/^\+1/,'').trim().replace(/\s*/g,"")
          delete(values.name)
          delete(values.email)
        }else if(values.phone.includes("@")){
          values.email = values.phone.trim()
          delete(values.phone)
          delete(values.name)
        }else{
          values.name = values.phone.trim()
          delete(values.email)
          delete(values.phone)
        }
      }
      values.status == 2 ? delete values.status : null
      this.setState(
        {
          filterCriteria: values
        },
        () => this.handleGetCustomers()
      );
    // });
  };

  handleModalVisible = flag => {
    this.setState({
      createModalVisible: !!flag
    });
  };

  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      selectedRecord: record || {}
    });
  };

  handleDetailModalVisible = (flag, record) => {
    this.setState({
      detailModalVisible: !!flag,
      selectedRecord: record || {}
    });
  };

  handleCouponModalVisible = (flag, record) => {
    if (flag) this.handleGetCustomerCoupons(record.id);
    else this.setState({ customerCoupons: null });

    this.setState({
      couponModalVisible: !!flag,
      selectedRecord: record || {}
    });
  };

  handleUpdate = (id, fields) => {
    const { dispatch } = this.props;
    dispatch({
      type: "customers/update",
      payload: fields,
      id: id,
      onSuccess: this.handleGetCustomers
    });

    this.handleUpdateModalVisible();
  };


  filterCouponsByAreaId = (coupons, areaId) => {
    return coupons.filter(coupon => coupon.areaId === areaId);
  };

  handleDeleteCoupon = customerCouponId => {
    const { dispatch } = this.props;
    // dispatch({
    //   type: "coupons/removeCustomerCoupon",
    //   id: customerCouponId,
    //   onSuccess: () =>
    //     this.handleGetCustomerCoupons(this.state.selectedRecord.id)
    // });
  };

  formatCsvData = customers => {
    const { areaNames, selectedAreaId } = this.props;

    return customers.map(customer => {
      customer.created = moment(customer.created).format("YYYY-MM-DD HH:mm:ss");
      customer.area = areaNames[customer.areaId];

      return {
        id: customer.id,
        email: customer.email
          ? customer.email.replace(/(\r\n|\n|\r)/gm, "")
          : "unknown",
        deposit: customer.deposit,
        rideCredit: customer.rideCredit,
        phoneModel: customer.phoneModel,
        created: customer.created,
        updated: customer.updated,
        areaId: customer.areaId,
        emailStatus: customer.emailStatus,
        inviteCode: customer.inviteCode,
        migrated: customer.migrated,
        status: customer.status,
        rideCount: customer.rideCount
      };
    });
  };

  handleGetTempCode= phoneNumber => {

    const { dispatch } = this.props;

    dispatch({
      type: "customers/getTempCode",
      phoneNumber: phoneNumber,
      onSuccess: tempCode => this.setState({tempCode: tempCode, genTempCodeModalVisible: true})
    });

  }

  handleGenTempCodeModalVisible = flag => {
    this.setState({
      genTempCodeModalVisible: !!flag,
    });
  }

  handleExportData = () => {
    const { form, selectedAreaId } = this.props;
    const { filterCriteria } = this.state;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      if (fieldsValue.created) {
        fieldsValue.registerStart = moment(fieldsValue.created[0])
          .utcOffset(0)
          .format("MM-DD-YYYY HH:mm:ss");
        fieldsValue.registerEnd = moment(fieldsValue.created[1])
          .utcOffset(0)
          .format("MM-DD-YYYY HH:mm:ss");
        fieldsValue.created = undefined;
      }

      const values = Object.assign(
        {},
        filterCriteria,
        fieldsValue,
        { areaId: selectedAreaId },
        {
          page: null,
          pageSize: null
        }
      );

      this.setState(
        {
          filterCriteria: values
        },
        this.finishExportData
      );
    });
  };

  finishExportData() {
    const { filterCriteria } = this.state;
    const { areaNames, selectedAreaId, dispatch } = this.props;
    const dateTime = moment().format("LL hh-mm A");
    const exportedFileName = `${
      areaNames[selectedAreaId]
    }-Customers`;
    dispatch({
      type: "customers/getAll",
      payload: filterCriteria,
      onSuccess: data => {
        exportCSVFile(
          customerCsvHeader,
          this.formatCsvData(data),
          exportedFileName
        );
      }
    });
  }

  render() {
    const {
      customers,
      areas,
      loading,
      coupons,
      dispatch,
      selectedAreaId
    } = this.props;
    const {
      modalVisible,
      updateModalVisible,
      detailModalVisible,
      couponModalVisible,
      selectedRecord,
      filterCriteria,
      customerCoupons,
      genTempCodeModalVisible,
      tempCode
    } = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible
    };
    const updateMethods = {
      handleModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate
    };

    const pagination = {
      defaultCurrent: 1,
      current: filterCriteria.pagination.page+1,
      pageSize: filterCriteria.pagination.pageSize,
      total: customers.total,
      // showTotal: ((total) => {
      //   return `count: ${total} `;
      // }),

    };
    return (
      <PageHeaderWrapper title="Customer List">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <RenderSimpleForm handleGenTempCodeModalVisible={this.handleGenTempCodeModalVisible} customerTotal={this.props.customers.total} handleSearch={this.handleSearch} handleFormReset={this.handleFormReset} filterCriteria={this.state.filterCriteria}/>
            </div>
            <StandardTable
              loading={loading}
              data={{ list: customers.data, pagination: pagination }}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
              scroll={{ x: 1300 }}
            />
          </div>

          {selectedAreaId >= 1 && (
            <div>
              <Button
                style={{ marginTop: "1em" }}
                onClick={this.handleExportData}
              >
                Export
              </Button>
            </div>
          )}
        </Card>

        <UpdateForm
          {...updateMethods}
          modalVisible={updateModalVisible}
          record={selectedRecord}
          areas={areas.data}
        />

      <GenTempCodeForm
          modalVisible={genTempCodeModalVisible}
          handleModalVisible={this.handleGenTempCodeModalVisible}
          handleGetTempCode={this.handleGetTempCode}
          tempCode={tempCode}
        />
{/* 
        {
          <CouponForm
            couponModalVisible={couponModalVisible}
            handleGetCustomerCoupons={this.handleGetCustomerCoupons}
            handleCouponModalVisible={this.handleCouponModalVisible}
            handleDeleteCoupon={this.handleDeleteCoupon}
            coupons={
              coupons &&
              coupons.data &&
              this.filterCouponsByAreaId(coupons.data, selectedRecord.areaId)
            }
            customerCoupons={customerCoupons}
            customer={selectedRecord}
            dispatch={dispatch}
          />
        } */}

        {detailModalVisible && (
          <CustomerDetail
            isVisible={detailModalVisible}
            handleDetailVisible={this.handleDetailModalVisible}
            customerId={selectedRecord.id}
            handleGetCustomers={this.handleGetCustomers}
          />
        )}
        
      </PageHeaderWrapper>
    );
  }
}
const mapStateToProps = ({ customers, areas, loading }) => {
  return {
    customers,
    areas,
    selectedAreaId: areas.selectedAreaId,
    areaNames: areas.areaNames,
    loading: loading.models.customers
        }
}
export default connect(mapStateToProps)(Customer) 

