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

import { exportCSVFile } from "../../utils/utils";

import {formatPhoneNumber} from "@/utils/utils"

const authority = getAuthority();

const { RangePicker } = DatePicker;

import styles from "./Error.less";

const Option = Select.Option;

const FormItem = Form.Item;

const TextArea = Input.TextArea;

const ErrorReviewStatus = ["waiting for review","under review","pass","reject"];
const ErrorType = [undefined, "malfunction","inappropriate parking", "theft", "abandoned", "vandalism"];
const ErrorPart = [undefined, "Seat","Brake", "Basket", "Light", "Wheel", "Tire", "Pedal", "Chain", "Lock", "Motor", "Kickstand", "Throttle"];

const vehicleErrorCSVHeader = {
  id: "id",
  phone: "Customer Phone",
  vehicleNumber: "Vehicle Number",
  rideId: "Ride Id",
  reviewStatus: "Review Status",
  errorType: "Error Type",
  errorPart: "Error Part",
  reviewNote: "Review Note",
  content: "Content",
  area: "Market",
  created: "Created",
  updated: "Updated",
};

const UpdateForm = (props => {
  const {
    updateModalVisible,
    handleUpdate,
    handleModalVisible,
    record,
    errorImages
  } = props;
  const [form] = Form.useForm()
  form.setFieldsValue(record)
  const okHandle = () => {
    const fieldsValue= form.getFieldsValue(true)
    if (form.isFieldsTouched()){
      handleUpdate(record.id, fieldsValue);
    }
    else handleModalVisible();
  };

  return (
    <Modal
      destroyOnClose
      title="Process"
      visible={updateModalVisible}
      onOk={okHandle}
      forceRender
      width={"50%"}
      onCancel={() => handleModalVisible()}
    >
      <Form form={form}>
      {record.content &&
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Note:">
        <p>
          {record.content}
        </p>
      </FormItem>}

      {errorImages &&
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Image:">
        {errorImages.map(path =>
          <img key={path}  src={path} style={{width: "80%"}} />
        )}
      </FormItem>}


      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Result" name='reviewStatus'>
          <Select placeholder="select" style={{ width: "100%" }}>
            {ErrorReviewStatus.map((errorStatus, index) => (
              <Option key={index} value={index}>
                {errorStatus}
              </Option>
            ))}
          </Select>
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Review Note" name='reviewNote'>
        <TextArea placeholder="Please Input" rows={10}  />
      </FormItem>
      {/* <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Is Solved">
        {form.getFieldDecorator("status",  {initialValue: record.status})(<Select placeholder="select" style={{ width: "100%" }}>
          <Option key={1} value={1}>
            Yes
          </Option>
          <Option key={0} value={0}>
            No
          </Option>
        </Select>)}
      </FormItem> */}
</Form>
    </Modal>
  );
});
 const RenderSimpleForm=(props)=> {
  const[form] = Form.useForm()
  const handleFormReset =()=>{
    props.handleFormReset()
    form.resetFields()
  }
  // const areas = props.areas;
  return (
    <Form onSubmit={()=>{props.handleSearch('00')}} layout="inline" form={form}>
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <Col span={10}>
          <FormItem label="Keywords" name='numberOrPhone'>
              <Input placeholder="NUMBER Or PHONE" onPressEnter={()=>{props.handleSearch(form.getFieldsValue(true))}}/>
          </FormItem>
        </Col>
        <Col span={10}>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="Type"
            name='type'
          >
              <Select placeholder="select" style={{ width: "100%" }}>
                {ErrorType.map((type,index) => (
                  <Option key={index} value={index}>
                    {type}
                  </Option>
                ))}
                <Option value={null}>All</Option>
              </Select>
          </FormItem>
        </Col>
        <Col span={10}>
          <FormItem
            // labelCol={{ span: 5 }}
            // wrapperCol={{ span: 15 }}
            label="Review Status"
            name='reviewStatus'
          >
              <Select placeholder="select" style={{ width: "100%" }}>
                {ErrorReviewStatus.map((errorStatus, index) => (
                  <Option key={index} value={index}>
                    {errorStatus}
                  </Option>
                ))}
                <Option value={null}>All</Option>
              </Select>
          </FormItem>
        </Col>
      </Row>
      <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
         {/* <Col lg={6} md={8} sm={24}>
         <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Is Solved">
            {getFieldDecorator("status")(<Select placeholder="select" style={{ width: "100%" }}>
              <Option key={1} value={1}>
                Yes
              </Option>
              <Option key={0} value={0}>
                No
              </Option>
              <Option value={null}>All</Option>
            </Select>)}
        </FormItem>
          </Col> */}
        <Col span={20}>
          <FormItem label="time" name='time'>
              <RangePicker format="YYYY-MM-DD HH:mm:ss" />
          </FormItem>
        </Col>
      </Row>

        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={{ span: 8, offset: 16 }} sm={24}>
          <span className={styles.submitButtons} style={{ float: "right" }}>
            <Button onClick={()=>{props.handleSearch(form.getFieldsValue(true))}}>
              Search
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={handleFormReset}>
              Reset
            </Button>
          </span>
          </Col>
        </Row>

    </Form>
  );
}
/* eslint react/no-multi-comp:0 */
class Error extends PureComponent {
  state = {
    updateModalVisible: false,
    detailModalVisible: false,
    expandForm: false,
    selectedRows: [],
    filterCriteria: {},
    selectedRecord: {},
    errorImages: []
  };

  columns = [
    {
      title: "Vehicle Number",
      render: (text,record) => <a onClick={() => this.setState({selectedVehicleId: record.vehicleId},() =>  this.handleVehicleDetailModalVisible(true))}>{record.vehicleNumber}</a>
    },
    {
      title: "Phone",
      render: (text,record) => <a onClick={() => this.setState({selectedCustomerId: record.customerId},() =>  this.handleCustomerDetailModalVisible(true))}>{formatPhoneNumber(record.phone+"")}</a>
    },
    {
      title: "Content",
      dataIndex: "content",
    },
    {
      title: "Type",
      dataIndex: "errorType",
      render: val => <span>{(val && (val.split(",").reduce((result, val) => result + ErrorType[parseInt(val)] + " | " , "")).slice(0,-3))}</span>
    },
    {
      title: "Part",
      dataIndex: "errorPart",
      render: val => <span>{(val && (val.split(",").reduce((result, val) => result + ErrorPart[parseInt(val)] + " | " , "")).slice(0,-3))}</span>
    },
    {
      title: "Date",
      dataIndex: "created",
      sorter: true,
      render: val => <span>{moment(val).format("YYYY-MM-DD HH:mm:ss")}</span>
    },
    {
      title: "Review Status",
      dataIndex: "reviewStatus",
      render: (val, record) => {
    
        const status = ErrorReviewStatus[val];
    
        const date = moment(record.reviewDate !== null ? record.reviewDate : record.updated).format("YYYY-MM-DD HH:mm:ss");
    
        return <span> {status + (val <= 1 ? "" : " (" + date + ")")} </span>;
    
      }
    },
    {
      title: "Operation",
      render: (text, record) => (
        <Fragment>
          {authority.includes("vehicle") &&
          <a onClick={() => this.handleUpdateModalVisible(true, record)}>
            Process
          </a>}

          <Divider type="vertical" />

          <Popconfirm
            title="Are you sure？"
            icon={<Icon type="question-circle-o" style={{ color: "red" }}/>}
            onConfirm={() => this.handleDelete(record.id)}
          >
            <a href="#" style={{ color: "red" }}>
              Delete
            </a>
          </Popconfirm>

        </Fragment>
      )
    }
  ];


  componentDidMount() {
    this.handleGetErrors();
  }

  handleGetErrors = () => {
    const { dispatch, selectedAreaId } = this.props;
    const { filterCriteria } = this.state;

    if(selectedAreaId){
      dispatch({
        type: "errors/get",
        payload: selectedAreaId ? Object.assign({},filterCriteria, {areaIds: [selectedAreaId]} ) : filterCriteria,
        onSuccess: () => this.setState({selectedRows: []})
      });
    }
  };

  handleDelete = id => {
    const { dispatch } = this.props;
    const { filterCriteria } = this.state;

    dispatch({
      type: "errors/remove",
      id: id,
      onSuccess: () => this.handleGetErrors()
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

    this.setState({ filterCriteria: params });
  };

  handleFormReset = () => {

    this.setState(
      {
        filterCriteria: {}
      },
      () => this.handleGetErrors()
    );
  };

  formatCsvData = errors => {
    const { areaNames, selectedAreaId } = this.props;

    return errors.map(error => {

      return {
        id: error.id,
        phone: error.phone,
        vehicleNumber: error.vehicleNumber,
        rideId: error.rideId ? error.rideId : "",
        reviewStatus: error.reviewStatus ? ErrorReviewStatus[error.reviewStatus] : "",
        errorType: error.errorType ?  (error.errorType.split(",").reduce((result, val) => result + ErrorType[parseInt(val)] + " | " , "")).slice(0,-3) : "",
        errorPart: error.errorPart ? (error.errorPart.split(",").reduce((result, val) => result + ErrorPart[parseInt(val)] + " | " , "")).slice(0,-3) : "",
        reviewNote: error.reviewNote ? `"${error.reviewNote.replace(/"/g, "")}"` : "", 
        content: error.content ? `"${error.content.replace(/"/g, "")}"` : "",
        area: error.areaId ?  areaNames[error.areaId] : "",
        created: moment(error.created).format("YYYY-MM-DD HH:mm:ss"),
        updated: moment(error.updated).format("YYYY-MM-DD HH:mm:ss"),
      };


      
    });
  };

  exportErrorData = () => {

    const {errors, areaNames, selectedAreaId} = this.props;

    exportCSVFile(
      vehicleErrorCSVHeader,
      this.formatCsvData(errors),
      `${ selectedAreaId ? areaNames[selectedAreaId] : "All_Markets"}_Customer_Report`
    );

  }

  handleSearch = fieldsValue => {
    const { dispatch } = this.props;
    const { filterCriteria } = this.state;

      if (fieldsValue.time) {
        fieldsValue.start = moment(fieldsValue.time[0]).utcOffset(0).format("MM-DD-YYYY HH:mm:ss");
        fieldsValue.end = moment(fieldsValue.time[1]).utcOffset(0).format("MM-DD-YYYY HH:mm:ss");
        fieldsValue.time = undefined;
      }
      const values = Object.assign({}, filterCriteria, fieldsValue);


      this.setState(
        {
          filterCriteria: values
        },
        () => this.handleGetErrors()
      );
  };


  handleUpdateModalVisible = (flag, record) => {
    if (flag) {
      this.handleGetErrorImages(record, errorImages => {

        // errorImages.map(errorImage => {

        //   const options ={
        //     headers: {
        //       'referer' : "https://manhattan.veoride.com/"
        //     }
        //   };

        //   fetch(errorImage, options)
        //   .then(res => res.blob())
        //   .then(blob => {
        //     this.setState({errorImages: this.state.errorImages.concat(URL.createObjectURL(blob))}); 
        //     //imgElement.src = URL.createObjectURL(blob);
        //   });
        // });
        
        this.setState({
          updateModalVisible: true,
          selectedRecord: record,
          errorImages: errorImages
        });
      });
    } else {
      this.setState({
        updateModalVisible: false,
        selectedRecord: {},
        errorImages: []
      });
    }
  };


  handleGetErrorImages = (error, onSuccess) => {
    const { dispatch } = this.props;

    dispatch({
      type: "errors/getImagePath",
      errorId: error.id,
      onSuccess: onSuccess
    });
  }



  handleUpdate = (id, fields) => {
    const { dispatch } = this.props;
    

    dispatch({
      type: "errors/update",
      payload: fields,
      id: id,
      onSuccess: this.handleGetErrors
    });

    this.handleUpdateModalVisible();
  };

  handleBatchPass = () => {
    const { dispatch } = this.props;
    const { selectedRows} = this.state;

    dispatch({
      type: "errors/batchPass",
      payload: selectedRows,
      onSuccess: this.handleGetErrors
    });
  };

  componentDidUpdate(prevProps, prevState, snapshot) {

    if (prevProps.selectedAreaId !== this.props.selectedAreaId) {
      this.handleGetErrors();
    }
  }

  handleSelectRows = rows => {

    const selectedIds = rows.map(row => row.id)

    this.setState({
      selectedRows: selectedIds
    });
  };



  handleVehicleDetailModalVisible = flag => this.setState({vehicleDetailModalVisible: flag})


  handleCustomerDetailModalVisible = flag => this.setState({customerDetailModalVisible: flag})



  render() {
    const { errors, loading } = this.props;
    const {
      updateModalVisible,
      detailModalVisible,
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
      <PageHeaderWrapper title="Error List">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <RenderSimpleForm handleSearch={this.handleSearch} handleFormReset={this.handleFormReset} />
            </div>
            <div className={styles.tableListOperator}>
              {selectedRows.length > 0 && (
                <span>
                   <Popconfirm
                     title="Are you sure？"
                     icon={<Icon type="question-circle-o" style={{ color: "yellow" }} />}
                     onConfirm={() => this.handleBatchPass()}
                   >
                      <Button>Batch Pass</Button>
                   </Popconfirm>
                </span>
              )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              onSelectRow={this.handleSelectRows}
              loading={loading}
              data={{ list: errors, pagination: {}}}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
              scroll={{x:1300}}
            />
          </div>
          <div>
              <Button
                style={{ marginTop: "1em" }}
                onClick={this.exportErrorData}
              >
                Export
              </Button>
            </div>
        </Card>

        <UpdateForm
          {...updateMethods}
          updateModalVisible={updateModalVisible}
          record={selectedRecord}
          errors={errors.data}
          errorImages={errorImages}
        />

      {vehicleDetailModalVisible && selectedVehicleId && authority.includes("vehicle") && (
          <VehicleDetail
            isVisible={vehicleDetailModalVisible}
            handleDetailVisible={this.handleVehicleDetailModalVisible}
            vehicleId={selectedVehicleId}
          />
        )}

        {customerDetailModalVisible && (
          <CustomerDetail
            isVisible={customerDetailModalVisible}
            handleDetailVisible={this.handleCustomerDetailModalVisible}
            customerId={selectedCustomerId}
          />
        )}


      </PageHeaderWrapper>
    );
  }
}
const mapStateToProps = ({ errors, loading, areas }) => {
  return {
    errors: errors.data,
    areas: areas.data,
    selectedAreaId: areas.selectedAreaId,
    areaNames: areas.areaNames,
    loading: loading.models.errors
    }
}
export default connect(mapStateToProps)(Error) 