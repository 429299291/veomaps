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
const { RangePicker } = DatePicker;

import styles from "./Error.less";

const Option = Select.Option;

const FormItem = Form.Item;

const TextArea = Input.TextArea;

const ErrorReviewStatus = ["waiting for review","under review","pass","reject"];
const ErrorType = ["Can't Lock","Damage", "Fuck", "Yet"];

const UpdateForm = Form.create()(props => {
  const {
    form,
    updateModalVisible,
    handleUpdate,
    handleModalVisible,
    record,
    errorImages
  } = props;
  const okHandle = () => {
    if (form.isFieldsTouched())
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        form.resetFields();

        handleUpdate(record.id, fieldsValue);
      });
    else handleModalVisible();
  };

  return (
    <Modal
      destroyOnClose
      title="Process"
      visible={updateModalVisible}
      onOk={okHandle}
      width={"50%"}
      onCancel={() => handleModalVisible()}
    >

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


      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Result">
        {form.getFieldDecorator("reviewStatus", {initialValue: record.reviewStatus})(
          <Select placeholder="select" style={{ width: "100%" }}>
            {ErrorReviewStatus.map((errorStatus, index) => (
              <Option key={index} value={index}>
                {errorStatus}
              </Option>
            ))}
          </Select>
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Review Note">
        {form.getFieldDecorator("reviewNote", {initialValue: record.reviewNote})(<TextArea placeholder="Please Input" rows={10}  />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Is Solved">
        {form.getFieldDecorator("status",  {initialValue: record.status})(<Select placeholder="select" style={{ width: "100%" }}>
          <Option key={1} value={1}>
            Yes
          </Option>
          <Option key={0} value={0}>
            No
          </Option>
        </Select>)}
      </FormItem>

    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
@connect(({ errors, loading, areas }) => ({
  errors: errors.data,
  areas: areas.data,
  loading: loading.models.errors
}))
@Form.create()
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
      dataIndex: "vehicleNumber"
    },
    {
      title: "Phone",
      dataIndex: "phone"
    },
    {
      title: "Type",
      dataIndex: "errorType",
      render: val => <span>{val.split(",").reduce((result, val) => result + ErrorType[parseInt(val)] + " | " , "")}</span>
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
      render: val => <span>{ErrorReviewStatus[parseInt(val)]}</span>
    },
    {
      title: "Operation",
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleUpdateModalVisible(true, record)}>
            Process
          </a>
          <Divider type="vertical" />
          <Popconfirm
            title="Are you sure？"
            icon={<Icon type="question-circle-o" style={{ color: "red" }} />}
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
    const { dispatch } = this.props;
    const { filterCriteria } = this.state;

    dispatch({
      type: "errors/get",
      payload: filterCriteria,
      onSuccess: () => this.setState({selectedRows: []})
    });
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

    this.setState({ filterCriteria: params }, () => this.handleGetErrors());
  };

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();

    this.setState(
      {
        filterCriteria: {}
      },
      () => this.handleGetErrors()
    );
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;
    const { filterCriteria } = this.state;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      if (fieldsValue.time) {
        fieldsValue.start = fieldsValue.time[0].format("MM-DD-YYYY");
        fieldsValue.end = fieldsValue.time[1].format("MM-DD-YYYY");
        fieldsValue.time = undefined;
      }

      const values = Object.assign({}, filterCriteria, fieldsValue);


      this.setState(
        {
          filterCriteria: values
        },
        () => this.handleGetErrors()
      );
    });
  };


  handleUpdateModalVisible = (flag, record) => {
    if (flag) {
      this.handleGetErrorImages(record, errorImages => {
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


  handleSelectRows = rows => {

    const selectedIds = rows.map(row => row.id)

    this.setState({
      selectedRows: selectedIds
    });
  };


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
              {getFieldDecorator("numberOrPhone")(
                <Input placeholder="NUMBER Or PHONE" />
              )}
            </FormItem>
          </Col>
          {areas && (
            <Col md={6} sm={24}>
              <FormItem
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 15 }}
                label="Area"
              >
                {getFieldDecorator("areaId")(
                  <Select placeholder="select" style={{ width: "100%" }}>
                    {areas.map(area => (
                      <Option key={area.id} value={area.id}>
                        {area.name}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
          )}
          <Col md={6} sm={24}>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="Type"
            >
              {getFieldDecorator("type")(
                <Select placeholder="select" style={{ width: "100%" }}>
                  {ErrorType.map((type,index) => (
                    <Option key={index} value={index}>
                      {type}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="Status"
            >
              {getFieldDecorator("reviewStatus")(
                <Select placeholder="select" style={{ width: "100%" }}>
                  {ErrorReviewStatus.map((errorStatus, index) => (
                    <Option key={index} value={index}>
                      {errorStatus}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
          <Col md={24} sm={24}>
            <FormItem label="time">
              {getFieldDecorator("time")(
                <RangePicker format="YYYY-MM-DD HH:mm:ss" />
              )}
            </FormItem>
          </Col>
        </Row>

          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={{ span: 8, offset: 16 }} sm={24}>
            <span className={styles.submitButtons} style={{ float: "right" }}>
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
    const { errors, loading } = this.props;
    const {
      updateModalVisible,
      detailModalVisible,
      selectedRows,
      selectedRecord,
      errorImages
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
              {this.renderSimpleForm()}
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
        </Card>

        <UpdateForm
          {...updateMethods}
          updateModalVisible={updateModalVisible}
          record={selectedRecord}
          errors={errors.data}
          errorImages={errorImages}
        />


      </PageHeaderWrapper>
    );
  }
}

export default Error;
