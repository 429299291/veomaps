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
  Radio,
  Divider,
  Popconfirm,
  InputNumber
} from "antd";
import StandardTable from "@/components/StandardTable";
import PageHeaderWrapper from "@/components/PageHeaderWrapper";

import styles from "./Price.less";

const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(",");

const vehicleType = ["Bicycle", "Scooter", "E-Vehicle", "Car"];

const CreateForm = Form.create()(props => {
  const {
    modalVisible,
    form,
    handleAdd,
    handleModalVisible,
    areas,
    areaPrice
  } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();

      handleAdd(fieldsValue);
    });
  };
  return (
    <Modal
      destroyOnClose
      title="Add"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      {areas && (
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Area">
          {form.getFieldDecorator("areaId", {
            rules: [
              {
                required: true
              }
            ]
          })(
            <Select placeholder="select" style={{ width: "100%" }}>
              {areas.map(area => (
                <Option key={area.id} value={area.id}>
                  {area.name}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
      )}
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Price">
        {form.getFieldDecorator("chargeAmount", {
          rules: [
            {
              required: true,
              message: "price is required"
            }
          ],
          initialValue: 0
        })(<InputNumber placeholder="Please Input" />)}
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="Charge Unit"
      >
        {form.getFieldDecorator("chargeUnit", {
          rules: [
            {
              required: true,
              message: "unit is required"
            }
          ],
          initialValue: 0
        })(<InputNumber placeholder="Please Input" />)}
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="Initial Charge"
      >
        {form.getFieldDecorator("chargeInitial", {
          rules: [
            {
              required: true,
              message: "Initial Charge is required"
            }
          ],
          initialValue: 0
        })(<InputNumber placeholder="Please Input" />)}
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="Vehicle Type"
      >
        {form.getFieldDecorator("vehicleType", {})(
          <Select placeholder="select" style={{ width: "100%" }}>
            {vehicleType.map((type, index) => (
              <Option key={index} value={index}>
                {type}
              </Option>
            ))}
            <Option key={-1} value={null}>
              General
            </Option>
          </Select>
        )}
      </FormItem>
    </Modal>
  );
});

const UpdateForm = Form.create()(props => {
  const {
    areas,
    areaPrice,
    form,
    modalVisible,
    handleUpdate,
    handleModalVisible,
    record
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
      title="Update"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      {areas && (
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Area">
          {form.getFieldDecorator("areaId", {
            rules: [
              {
                required: true
              }
            ],
            initialValue: record.areaId
          })(
            <Select placeholder="select" style={{ width: "100%" }}>
              {areas.map(area => (
                <Option key={area.id} value={area.id}>
                  {area.name}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
      )}
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Price">
        {form.getFieldDecorator("chargeAmount", {
          rules: [
            {
              required: true,
              message: "price is required"
            }
          ],
          initialValue: record.chargeAmount
        })(<InputNumber placeholder="Please Input" />)}
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="Charge Unit"
      >
        {form.getFieldDecorator("chargeUnit", {
          rules: [
            {
              required: true,
              message: "unit is required"
            }
          ],
          initialValue: record.chargeUnit
        })(<InputNumber placeholder="Please Input" />)}
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="Initial Charge"
      >
        {form.getFieldDecorator("chargeInitial", {
          rules: [
            {
              required: true,
              message: "Initial Charge is required"
            }
          ],
          initialValue: record.chargeInitial
        })(<InputNumber placeholder="Please Input" />)}
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="Vehicle Type"
      >
        {form.getFieldDecorator("vehicleType", {
          initialValue: record.vehicleType
        })(
          <Select placeholder="select" style={{ width: "100%" }}>
            {vehicleType.map((type, index) => (
              <Option key={index} value={index}>
                {type}
              </Option>
            ))}
            <Option key={-1} value={null}>
              General
            </Option>
          </Select>
        )}
      </FormItem>
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
@connect(({ areas, price, loading }) => ({
  areas,
  price,
  loading: loading.models.price
}))
@Form.create()
class Price extends PureComponent {
  state = {
    modalVisible: false,
    createModalVisible: false,
    updateModalVisible: false,
    detailModalVisible: false,
    expandForm: false,
    selectedRows: [],
    filterCriteria: {},
    selectedRecord: {}
  };

  columns = [
    {
      title: "Area",
      dataIndex: "areaId",
      render: areaId => <span>{this.props.areas.areaNames[areaId]}</span>
    },
    {
      title: "Charge Amount",
      dataIndex: "chargeAmount"
    },
    {
      title: "Charge Unit",
      dataIndex: "chargeUnit"
    },
    {
      title: "Vehicle Type",
      dataIndex: "vehicleType",
      render: data => <span>{vehicleType[data]}</span>
    },
    {
      title: "Initial Charge",
      dataIndex: "chargeInitial"
    },
    {
      title: "Operation",
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleUpdateModalVisible(true, record)}>
            Update
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
    this.handleGetAreas();
  }

  handleGetAreas = () => {
    const { dispatch } = this.props;
    const { filterCriteria } = this.state;

    dispatch({
      type: "price/get",
      payload: filterCriteria
    });
  };

  handleGetUpdatedAreas = () => {
    const { dispatch } = this.props;
    const { filterCriteria } = this.state;

    dispatch({
      type: "price/getUpdated",
      payload: filterCriteria
    });
  };

  handleStandardTableChange = (filtersArg, sorter) => {
    const { filterCriteria } = this.state;
    const params = {
      ...filterCriteria
    };

    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    this.setState({ filterCriteria: params }, () => this.handleGetAreas());
  };

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();

    this.setState(
      {
        filterCriteria: {}
      },
      () => this.handleGetAreas()
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
        () => this.handleGetAreas()
      );
    });
  };

  handleCreateModalVisible = flag => {
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

  handleDeleteModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      selectedRecord: record || {}
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: "price/add",
      payload: fields,
      onSuccess: this.handleGetAreas
    });

    this.handleCreateModalVisible();
  };

  handleUpdate = (id, fields) => {
    const { dispatch } = this.props;
    dispatch({
      type: "price/update",
      payload: fields,
      id: id,
      onSuccess: this.handleGetAreas
    });

    this.handleUpdateModalVisible();
  };

  handleDelete = id => {
    const { dispatch } = this.props;

    dispatch({
      type: "price/remove",
      id: id,
      onSuccess: this.handleGetAreas
    });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator }
    } = this.props;

    const areas = this.props.areas.data;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          {areas && (
            <Col md={8} sm={24}>
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
    const { areas, areaPrice, loading, price } = this.props;
    const {
      modalVisible,
      createModalVisible,
      updateModalVisible,
      detailModalVisible,
      selectedRecord
    } = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleCreateModalVisible
    };
    const updateMethods = {
      handleModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate
    };

    return (
      <PageHeaderWrapper title="Area List">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderSimpleForm()}
            </div>
            <div className={styles.tableListOperator}>
              <Button
                icon="plus"
                type="primary"
                onClick={() => this.handleCreateModalVisible(true)}
              >
                Add
              </Button>
            </div>
            <StandardTable
              loading={loading}
              data={{ list: price.areaPrice, pagination: {} }}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm
          {...parentMethods}
          modalVisible={createModalVisible}
          price={price.areaPrice}
          areas={areas.data}
        />

        <UpdateForm
          {...updateMethods}
          modalVisible={updateModalVisible}
          record={selectedRecord}
          price={price.areaPrice}
          areas={areas.data}
        />
      </PageHeaderWrapper>
    );
  }
}

export default Price;
