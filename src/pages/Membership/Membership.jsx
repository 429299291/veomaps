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
  Popconfirm
} from "antd";
import StandardTable from "@/components/StandardTable";
import PageHeaderWrapper from "@/components/PageHeaderWrapper";

import styles from "./Membership.less";

const FormItem = Form.Item;
const { Step } = Steps;
const { TextMembership } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(",");

const intervals = ["Day", "Week", "Month", "Year"];

import { getAuthority } from "@/utils/authority";

const authority = getAuthority();

const CreateForm = Form.create()(props => {
  const {
    modalVisible,
    form,
    handleAdd,
    handleModalVisible,
    memberships,
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
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Title">
        {form.getFieldDecorator("title", {
          rules: [
            {
              required: true,
              message: "title is required",
              min: 1
            }
          ]
        })(<Input placeholder="Please Input" />)}
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="Description"
      >
        {form.getFieldDecorator("description", {
          rules: [
            {
              required: true
            }
          ]
        })(<Input placeholder="Please Input" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Price">
        {form.getFieldDecorator("price", {
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
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="Interval"
      >
        {form.getFieldDecorator("interval", {
          rules: [
            {
              required: true
            }
          ]
        })(
          <Select placeholder="select" style={{ width: "100%" }}>
            {intervals.map((interval, index) => (
              <Option key={index} value={index}>
                {intervals[index]}
              </Option>
            ))}
          </Select>
        )}
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="Priority"
      >
        {form.getFieldDecorator("priority", {
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
        label="Renewable"
      >
        {form.getFieldDecorator("renewable", {
          rules: [
            {
              required: true
            }
          ]
        })(
          <Select placeholder="select" style={{ width: "100%" }}>
            <Option key={1} value={1}>
              true
            </Option>
            <Option key={2} value={0}>
              false
            </Option>
          </Select>
        )}
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="Educational"
      >
        {form.getFieldDecorator("educational", {
          rules: [
            {
              required: true
            }
          ]
        })(
          <Select placeholder="select" style={{ width: "100%" }}>
            <Option key={1} value={1}>
              true
            </Option>
            <Option key={2} value={0}>
              false
            </Option>
          </Select>
        )}
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="Activated"
      >
        {form.getFieldDecorator("activated", {
          rules: [
            {
              required: true
            }
          ]
        })(
          <Select placeholder="select" style={{ width: "100%" }}>
            <Option key={1} value={1}>
              true
            </Option>
            <Option key={2} value={0}>
              false
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
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Title">
        {form.getFieldDecorator("title", {
          rules: [
            {
              required: true,
              message: "title is required",
              min: 1
            }
          ],
          initialValue: record.title
        })(<Input placeholder="Please Input" />)}
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="Description"
      >
        {form.getFieldDecorator("description", {
          rules: [
            {
              required: true
            }
          ],
          initialValue: record.description
        })(<Input placeholder="Please Input" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Price">
        {form.getFieldDecorator("price", {
          rules: [
            {
              required: true
            }
          ],
          initialValue: record.price
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
        label="Interval"
      >
        {form.getFieldDecorator("interval", {
          rules: [
            {
              required: true
            }
          ],
          initialValue: record.interval
        })(
          <Select placeholder="select" style={{ width: "100%" }}>
            {intervals.map((interval, index) => (
              <Option key={index} value={index}>
                {intervals[index]}
              </Option>
            ))}
          </Select>
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Priority">
        {form.getFieldDecorator("priority", {
          rules: [
            {
              required: true
            }
          ],
          initialValue: record.priority
        })(<InputNumber placeholder="Please Input" />)}
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="Renewable"
      >
        {form.getFieldDecorator("renewable", {
          rules: [
            {
              required: true
            }
          ],
          initialValue: record.renewable ? 1 : 0
        })(
          <Select placeholder="select" style={{ width: "100%" }}>
            <Option key={1} value={1}>
              true
            </Option>
            <Option key={2} value={0}>
              false
            </Option>
          </Select>
        )}
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="Educational"
      >
        {form.getFieldDecorator("educational", {
          rules: [
            {
              required: true
            }
          ],
          initialValue: record.educational ? 1 : 0
        })(
          <Select placeholder="select" style={{ width: "100%" }}>
            <Option key={1} value={1}>
              true
            </Option>
            <Option key={2} value={0}>
              false
            </Option>
          </Select>
        )}
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="Activated"
      >
        {form.getFieldDecorator("activated", {
          rules: [
            {
              required: true
            }
          ],
          initialValue: record.activated ? 1 : 0
        })(
          <Select placeholder="select" style={{ width: "100%" }}>
            <Option key={1} value={1}>
              true
            </Option>
            <Option key={2} value={0}>
              false
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

/* eslint react/no-multi-comp:0 */
@connect(({ memberships, areas, loading }) => ({
  memberships,
  areas,
  loading: loading.models.memberships
}))
@Form.create()
class Membership extends PureComponent {
  state = {
    createModalVisible: false,
    updateModalVisible: false,
    selectedRows: [],
    filterCriteria: {},
    selectedRecord: {}
  };

  columns = [
    {
      title: "Title",
      dataIndex: "title"
    },
    {
      title: "Interval",
      dataIndex: "interval",
      render: interval => <span>{intervals[interval]}</span>
    },
    {
      title: "Price",
      dataIndex: "price"
    },
    {
      title: "Free Minutes",
      dataIndex: "freeMinutes"
    },
    {
      title: "Priority",
      dataIndex: "priority"
    },
    {
      title: "Renewable",
      dataIndex: "renewable",
      render: renewable => <span>{renewable ? "Yes" : "No"}</span>
    },
    {
      title: "Educational",
      dataIndex: "educational",
      render: educational => <span>{educational ? "Yes" : "No"}</span>
    },
    {
      title: "Activated",
      dataIndex: "activated",
      render: activated => <span>{activated ? "Yes" : "No"}</span>
    },
    {
      title: "Operation",
      render: (text, record) => (
        <Fragment>
          {authority.includes("update.membership.detail") &&
            <a onClick={() => this.handleUpdateModalVisible(true, record)}>
              Update
            </a>
          }
          <Divider type="vertical" />
          {authority.includes("delete.membership") &&
            <Popconfirm
              title="Are you Sure？"
              icon={<Icon type="question-circle-o" style={{ color: "red" }}/>}
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
    this.handleGetMemberships();
  }

  handleGetMemberships = () => {
    const { dispatch } = this.props;
    const { filterCriteria } = this.state;

    dispatch({
      type: "memberships/get",
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

    this.setState({ filterCriteria: params }, () =>
      this.handleGetMemberships()
    );
  };

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();

    this.setState(
      {
        filterCriteria: {}
      },
      () => this.handleGetMemberships()
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
        () => this.handleGetMemberships()
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

  handleAdd = fields => {
    const { dispatch } = this.props;

    dispatch({
      type: "memberships/add",
      payload: fields,
      onSuccess: this.handleGetMemberships
    });

    this.handleCreateModalVisible();
  };

  handleDelete = membershipId => {
    const { dispatch } = this.props;

    dispatch({
      type: "memberships/remove",
      id: membershipId,
      onSuccess: this.handleGetMemberships
    });
  };

  handleUpdate = (id, fields) => {
    const { dispatch } = this.props;

    dispatch({
      type: "memberships/update",
      payload: fields,
      id: id,
      onSuccess: this.handleGetMemberships
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
              {getFieldDecorator("titleOrDescription")(
                <Input placeholder="Title or Description" />
              )}
            </FormItem>
          </Col>
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
    const { memberships, loading, areas } = this.props;
    const {
      createModalVisible,
      updateModalVisible,
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
      <PageHeaderWrapper title="Membership List">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderSimpleForm()}
            </div>
            <div className={styles.tableListOperator}>
              {authority.includes("create.membership") &&
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
              data={{ list: memberships.data, pagination: {} }}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
              scroll={{ x: 1300 }}
            />
          </div>
        </Card>
        <CreateForm
          {...parentMethods}
          modalVisible={createModalVisible}
          memberships={memberships.data}
          areas={areas.data}
        />

        <UpdateForm
          {...updateMethods}
          modalVisible={updateModalVisible}
          record={selectedRecord}
          memberships={memberships.data}
          areas={areas.data}
        />
      </PageHeaderWrapper>
    );
  }
}

export default Membership;
