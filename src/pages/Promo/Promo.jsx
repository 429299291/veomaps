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

import styles from "./Promo.less";

import { getAuthority } from "@/utils/authority";

const authority = getAuthority();

const FormItem = Form.Item;
const { Step } = Steps;
const { TextPromo } = Input;
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
    promos,
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
        label="Ride Credits"
      >
        {form.getFieldDecorator("amount", {
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
      title="Update"
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
        label="Ride Credits"
      >
        {form.getFieldDecorator("amount", {
          rules: [
            {
              required: true
            }
          ],
          initialValue: record.amount
        })(<InputNumber placeholder="Please Input" />)}
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


const GeneratePromoWithCodeForm = Form.create()(props => {
  const {
    form,
    modalVisible,
    handleGeneratePromoWithCode,
    handleModalVisible,
    record
  } = props;
  const okHandle = () => {
    if (form.isFieldsTouched())
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        form.resetFields();

        handleGeneratePromoWithCode(record.id, fieldsValue);
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
      title="Generate Promo with Code"
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
@connect(({ promos, areas, loading }) => ({
  promos,
  areas,
  selectedAreaId: areas.selectedAreaId,
  loading: loading.models.promos
}))
@Form.create()
class Promo extends PureComponent {
  state = {
    createModalVisible: false,
    updateModalVisible: false,
    generateCodePromoVisible: false,
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
      title: "Ride Credit",
      dataIndex: "amount"
    },
    {
      title: "Redeem Count",
      dataIndex: "redeemCount"
    },
    {
      title: "Area",
      dataIndex: "areaId",
      render: areaId => <span>{this.props.areas.areaNames[areaId]}</span>
    },
    {
      title: "Operation",
      render: (text, record) => (
        <Fragment>
          {authority.includes("area.promo") &&
            <a onClick={() => this.handleUpdateModalVisible(true, record)}>
              Update
            </a>
          }


          <Divider type="vertical" />

          {authority.includes("area.promo") &&
          <a onClick={() => this.handleGenerateCodePromoModalVisible(true, record)}>
            Generate Promo with Code
          </a>
          }

        </Fragment>
      )
    }
  ];

  componentDidMount() {
    this.handleGetPromos();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {

    if (prevProps.selectedAreaId !== this.props.selectedAreaId) {
      this.handleGetPromos();
    }

  }

  handleGetPromos = () => {
    const { dispatch, selectedAreaId } = this.props;
    const { filterCriteria } = this.state;

    dispatch({
      type: "promos/get",
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

    this.setState({ filterCriteria: params }, () => this.handleGetPromos());
  };

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();

    this.setState(
      {
        filterCriteria: {}
      },
      () => this.handleGetPromos()
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
        () => this.handleGetPromos()
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


  handleGenerateCodePromoModalVisible = (flag, record) => {
    this.setState({
      generateCodePromoVisible: !!flag,
      selectedRecord: record || {}
    });
  }


  handleGeneratePromoWithCode = (id, payload) => {
    const { dispatch } = this.props;

    dispatch({
      type: "promos/generateCodePromo",
      payload: payload,
      id: id
    });

    this.handleGenerateCodePromoModalVisible();
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
      type: "promos/add",
      payload: fields,
      onSuccess: this.handleGetPromos
    });

    this.handleCreateModalVisible();
  };

  handleUpdate = (id, fields) => {
    const { dispatch } = this.props;

    dispatch({
      type: "promos/update",
      payload: fields,
      id: id,
      onSuccess: this.handleGetPromos
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
    const { promos, loading, areas } = this.props;
    const {
      createModalVisible,
      updateModalVisible,
      selectedRecord,
      generateCodePromoVisible
    } = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleCreateModalVisible
    };
    const updateMethods = {
      handleModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate
    };

    const codePromoMethods = {
      handleModalVisible: this.handleGenerateCodePromoModalVisible,
      handleGeneratePromoWithCode: this.handleGeneratePromoWithCode
    };

    return (
      <PageHeaderWrapper title="Promo List">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderSimpleForm()}
            </div>
            <div className={styles.tableListOperator}>
              {authority.includes("create.promo") &&
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
              data={{ list: promos.data, pagination: {} }}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm
          {...parentMethods}
          modalVisible={createModalVisible}
          promos={promos.data}
          areas={areas.data}
        />

        <UpdateForm
          {...updateMethods}
          modalVisible={updateModalVisible}
          record={selectedRecord}
          promos={promos.data}
          areas={areas.data}
        />

        <GeneratePromoWithCodeForm
          {...codePromoMethods}
          modalVisible={generateCodePromoVisible}
          record={selectedRecord}
        />
      </PageHeaderWrapper>
    );
  }
}

export default Promo;
