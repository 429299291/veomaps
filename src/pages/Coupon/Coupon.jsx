import React, { PureComponent, Fragment } from "react";
import { connect } from "dva";
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
  InputNumber,
  Popconfirm, DatePicker
} from "antd";
import StandardTable from "@/components/StandardTable";
import PageHeaderWrapper from "@/components/PageHeaderWrapper";

import styles from "./Coupon.less";

import { getAuthority } from "@/utils/authority";

const authority = getAuthority();

const FormItem = Form.Item;
const { Step } = Steps;
const { TextCoupon } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(",");

const vehicleType = ["Bicycle", "Scooter", "E-Vehicle", "COSMO"];

const CreateForm = Form.create()(props => {
  const {
    modalVisible,
    form,
    handleAdd,
    handleModalVisible,
    coupons,
    areas
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
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="NAME">
        {form.getFieldDecorator("name", {
          rules: [
            {
              required: true,
              message: "name is required",
              min: 1
            }
          ]
        })(<Input placeholder="Please Input" />)}
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="Valid Days"
      >
        {form.getFieldDecorator("days", {
          rules: [
            {
              required: true
            }
          ]
        })(<InputNumber placeholder="Please Input" />)}
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="Free Minutes"
      >
        {form.getFieldDecorator("freeMinutes", {
          rules: [
            {
              required: true
            }
          ]
        })(<InputNumber placeholder="Please Input" />)}
      </FormItem>
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
    form,
    modalVisible,
    handleUpdate,
    handleModalVisible,
    record,
    areas
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
      title="Add"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="NAME">
        {form.getFieldDecorator("name", {
          rules: [
            {
              required: true,
              message: "name is required",
              min: 1
            }
          ],
          initialValue: record.name
        })(<Input placeholder="Please Input" />)}
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="Valid Days"
      >
        {form.getFieldDecorator("days", {
          rules: [
            {
              required: true
            }
          ],
          initialValue: record.days
        })(<InputNumber placeholder="Please Input" />)}
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="Free Minutes"
      >
        {form.getFieldDecorator("freeMinutes", {
          rules: [
            {
              required: true
            }
          ],
          initialValue: record.freeMinutes
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
    </Modal>
  );
});


const GenerateCouponWithCodeForm = Form.create()(props => {
  const {
    form,
    modalVisible,
    handleGenerateCouponWithCode,
    handleModalVisible,
    record
  } = props;
  const okHandle = () => {
    if (form.isFieldsTouched())
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        form.resetFields();

        fieldsValue.vehicleType = record.vehicleType;

        handleGenerateCouponWithCode(record.id, fieldsValue);
      });
    else handleModalVisible();
  };

  const checkAmount = (rule, value, callback) => {
    if (value > 0) {
      callback();
      return;
    }

    callback("Amount must be larger than zero.");
  };

  return (
    <Modal
      destroyOnClose
      title="Generate Coupon with Code"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="Start Time"
      >
        {form.getFieldDecorator("start", {
          rules: [
            {
              required: true,
              message: "You have to pick a time to start!"
            }
          ]
        })(
          <DatePicker
            showTime
            format="YYYY-MM-DD HH:mm:ss"
            placeholder="Select Start Time"
          />
        )}
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="Amount"
      >
        {form.getFieldDecorator("amount", {
          rules: [
            {
              required: true
            },
            {
              validator: checkAmount
            }
          ]
        })(<InputNumber placeholder="Please Input" />)}
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="Code"
      >
        {form.getFieldDecorator("code", {
          rules: [
            {
              required: true
            }
          ]
        })(<Input placeholder="Please Input" />)}
      </FormItem>
    </Modal>
  );
});



/* eslint react/no-multi-comp:0 */
@connect(({ coupons, areas, loading }) => ({
  coupons,
  areas,
  selectedAreaId: areas.selectedAreaId,
  loading: loading.models.coupons
}))
@Form.create()
class Coupon extends PureComponent {
  state = {
    createModalVisible: false,
    updateModalVisible: false,
    generateCodeCouponVisible: false,
    expandForm: false,
    selectedRows: [],
    filterCriteria: {},
    selectedRecord: {}
  };

  columns = [
    {
      title: "Name",
      dataIndex: "name"
    },
    {
      title: "Valid Days",
      dataIndex: "days"
    },
    {
      title: "Free Minutes",
      dataIndex: "freeMinutes"
    },
    {
      title: "Area",
      dataIndex: "areaId",
      render: areaId => <span>{this.props.areas.areaNames[areaId]}</span>
    },
    {
      title: "Vehicle Type",
      dataIndex: "vehicleType",
      render: data => <span>{data ? vehicleType[data] : "general"}</span>
    },
    {
      title: "Operation",
      render: (text, record) => (
        <Fragment>
          {/* {authority.includes("update.coupon.detail") && */
            <a onClick={() => this.handleUpdateModalVisible(true, record)}>
              Update
            </a>
          }


          <Divider type="vertical" />

          {/* {authority.includes("generate.code.coupon") && */}
          <a onClick={() => this.handleGenerateCodeCouponModalVisible(true, record)}>
            Generate Coupon with Code
          </a>
          }
          <Divider type="vertical" />

          {/* {authority.includes("delete.coupon.detail") && */}
            <Popconfirm
              title="Are you sure？"
              icon={<Icon type="question-circle-o" style={{ color: "red" }} />}
              onConfirm={() => this.handleDelete(record.id)}
            >
              <a href="#" style={{ color: "red" }}>
                Delete
              </a>
            </Popconfirm>
          }

        </Fragment>
      )
    }
  ];

  componentDidMount() {
    this.handleGetCoupons();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {

    if (prevProps.selectedAreaId !== this.props.selectedAreaId) {
      this.handleGetCoupons();
    }

  }

  handleGetCoupons = () => {
    const { dispatch, selectedAreaId } = this.props;
    const { filterCriteria } = this.state;

    dispatch({
      type: "coupons/get",
      payload: selectedAreaId ? Object.assign({}, filterCriteria, {areaId: selectedAreaId}) :  filterCriteria
    });
  };

  handleStandardTableChange = (filtersArg, sorter) => {
    const {   } = this.state;

    const params = {
      ...filterCriteria
    };

    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    this.setState({ filterCriteria: params }, () => this.handleGetCoupons());
  };

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();

    this.setState(
      {
        filterCriteria: {}
      },
      () => this.handleGetCoupons()
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
        () => this.handleGetCoupons()
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


  handleGenerateCodeCouponModalVisible = (flag, record) => {
    this.setState({
      generateCodeCouponVisible: !!flag,
      selectedRecord: record || {}
    });
  }


  handleGenerateCouponWithCode = (id, payload) => {
    const { dispatch } = this.props;

    dispatch({
      type: "coupons/generateCodeCoupon",
      payload: payload,
      id: id
    });

    this.handleGenerateCodeCouponModalVisible();
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
      type: "coupons/add",
      payload: fields,
      onSuccess: this.handleGetCoupons
    });

    this.handleCreateModalVisible();
  };

  handleDelete = couponId => {
    const { dispatch } = this.props;

    dispatch({
      type: "coupons/remove",
      id: couponId,
      onSuccess: this.handleGetCoupons
    });
  };

  handleUpdate = (id, fields) => {
    const { dispatch } = this.props;

    dispatch({
      type: "coupons/update",
      payload: fields,
      id: id,
      onSuccess: this.handleGetCoupons
    });

    this.handleUpdateModalVisible();
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator }
    } = this.props;

    const areas = this.props.areas.data;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="Keywords">
              {getFieldDecorator("name")(<Input placeholder="name" />)}
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
    const { coupons, loading, areas } = this.props;
    const {
      createModalVisible,
      updateModalVisible,
      selectedRecord,
      generateCodeCouponVisible
    } = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleCreateModalVisible
    };
    const updateMethods = {
      handleModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate
    };

    const codeCouponMethods = {
      handleModalVisible: this.handleGenerateCodeCouponModalVisible,
      handleGenerateCouponWithCode: this.handleGenerateCouponWithCode
    };

    return (
      <PageHeaderWrapper title="Coupon List">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderSimpleForm()}
            </div>
            <div className={styles.tableListOperator}>
              {/* {authority.includes("create.coupon") && */}
                <Button
                  icon="plus"
                  type="primary"
                  onClick={() => this.handleCreateModalVisible(true)}
                >
                  Add
                </Button>
              }

            </div>
            <StandardTable
              loading={loading}
              data={{ list: coupons.data, pagination: {} }}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm
          {...parentMethods}
          modalVisible={createModalVisible}
          coupons={coupons.data}
          areas={areas.data}
        />

        <UpdateForm
          {...updateMethods}
          modalVisible={updateModalVisible}
          record={selectedRecord}
          coupons={coupons.data}
          areas={areas.data}
        />

        <GenerateCouponWithCodeForm
          {...codeCouponMethods}
          modalVisible={generateCodeCouponVisible}
          record={selectedRecord}
        />
      </PageHeaderWrapper>
    );
  }
}

export default Coupon;
