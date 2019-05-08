import React, { PureComponent, Fragment } from "react";
import { connect } from "dva";
import moment from "moment";
import PageHeaderWrapper from "@/components/PageHeaderWrapper";
import {
  Button,
  Form,
  Modal,
  Card,
  Input,
  Icon,
  Select,
  Divider,
  Popconfirm,
  Row,
  Col
} from "antd";
import StandardTable from "@/components/StandardTable";

import { getAuthority } from "@/utils/authority";

const authority = getAuthority();

const { Option } = Select;

const FormItem = Form.Item;

const PhoneRegisterForm = Form.create()(props => {
  const { modalVisible, form, handleSubmit, handleModalVisible, areas } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      form.resetFields();

      handleSubmit(fieldsValue);
    });
  };

  return (
    <Modal
      destroyOnClose
      title="Register Technician By Phone"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
      width="600px"
    >
      <FormItem
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 15 }}
        label="First Name"
      >
        {form.getFieldDecorator("firstName", {
          rules: [
            {
              required: true,
              message: "First Name can't be empty",
              min: 1
            }
          ]
        })(<Input placeholder="First Name" />)}
      </FormItem>
      <FormItem
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 15 }}
        label="Last Name"
      >
        {form.getFieldDecorator("lastName", {
          rules: [
            {
              required: true,
              message: "Last Name can't be empty",
              min: 1
            }
          ]
        })(<Input placeholder="Last Name" />)}
      </FormItem>
      <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 15 }} label="Email">
        {form.getFieldDecorator("email", {
          rules: [
            {
              required: true,
              message: "Email can't be empty",
              min: 1
            }
          ]
        })(<Input placeholder="Email" />)}
      </FormItem>
      <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 15 }} label="Phone">
        {form.getFieldDecorator("phone", {
          rules: [
            {
              required: true,
              message: "Phone can't be empty",
              min: 1
            }
          ]
        })(<Input placeholder="Phone Number" />)}
      </FormItem>
      <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 15 }} label="Area">
        {form.getFieldDecorator("areaId", {
          rules: [
            {
              required: true
            }
          ]
        })(
          <Select placeholder="Please Select an Area" style={{ width: "100%" }}>
            {areas.map(area => (
              <Option key={area.id} value={area.id}>
                {area.name}
              </Option>
            ))}
          </Select>
        )}
      </FormItem>
    </Modal>
  );
});

@connect(({ areas, technicians, loading }) => ({
  areas,
  technicians: technicians.data,
  loading: loading.models.technicians,
  selectedAreaId: areas.selectedAreaId
}))
@Form.create()
class Technician extends PureComponent {
  state = {
    registerPhoneModalVisible: false,
    filterCriteria: {},
    areas: []
  };

  columns = [
    {
      title: "Name",
      dataIndex: "lastName",
      render: (text, record) => (
        <span>
          {`${record.firstName ? record.firstName : ""}
          ${record.lastName ? record.lastName : ""}`}
        </span>
      )
    },
    {
      title: "Email",
      dataIndex: "email"
    },
    {
      title: "Phone Number",
      dataIndex: "phone"
    },
    {
      title: "Area",
      render: (text, record) => (
        <Fragment>{this.getNameByAreaId(record.areaId)}</Fragment>
      )
    },
    {
      title: "Operation",
      render: (text, record) => (
        <Popconfirm
          title="Are You Sure?"
          icon={<Icon type="question-circle-o" style={{ color: "red " }} />}
          onConfirm={() => this.handleDelete(record.id)}
        >
          <a href="#" style={{ color: "red" }}>
            Delete
          </a>
        </Popconfirm>
      )
    }
  ];

  handlePhoneRegisterModalVisible = flag => {
    this.setState({
      registerPhoneModalVisible: !!flag
    });
  };

  handlePhoneRegister = fields => {
    const { dispatch } = this.props;

    dispatch({
      type: "technicians/add",
      payload: fields,
      onSuccess: this.handleGetTechnicians
    });

    this.handlePhoneRegisterModalVisible();
  };

  handleDelete = technicianId => {
    const { dispatch } = this.props;

    dispatch({
      type: "technicians/remove",
      id: technicianId,
      onSuccess: this.handleGetTechnicians
    });
  };

  handleGetAreas = () => {
    const { dispatch } = this.props;
    const { filterCriteria } = this.state;

    dispatch({
      type: "areas/getAll",
      payload: filterCriteria,
      onSuccess: areas => this.setState({ areas: areas })
    });
  };

  handleGetTechnicians = () => {
    const { dispatch, selectedAreaId } = this.props;
    const { filterCriteria } = this.state;

    dispatch({
      type: "technicians/get",
      payload: selectedAreaId
        ? Object.assign({}, filterCriteria, { areaId: selectedAreaId })
        : filterCriteria
    });
  };

  getNameByAreaId = areaId => {
    const { areas } = this.state;

    if (areas.length === 0) return "";
    else return areas.find(area => area.id === areaId).name;
  };

  componentDidMount() {
    this.handleGetTechnicians();
    this.handleGetAreas();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.selectedAreaId !== this.props.selectedAreaId) {
      this.handleGetTechnicians();
    }
  }

  renderSimpleForm() {
    const {
      form: { getFieldDecorator }
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="Keywords">
              {getFieldDecorator("nameOrPhoneOrEmail")(
                <Input placeholder="PHONE NAME EMAIL" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="Status">
              {getFieldDecorator("queryStatus")(
                <Select placeholder="select" style={{ width: "100%" }}>
                  {queryStatus.map((status, index) => (
                    <Option key={index} value={index}>
                      {queryStatus[index]}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="Registered">
              {getFieldDecorator("created")(<RangePicker />)}
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
    const { registerPhoneModalVisible } = this.state;
    const { areas, technicians, loading } = this.props;

    const phoneRegisterMethods = {
      handleModalVisible: this.handlePhoneRegisterModalVisible,
      handleSubmit: this.handlePhoneRegister
    };

    return (
      <PageHeaderWrapper title="Technician List">
        <Card bordered={false}>
          {/* this.renderSimpleForm() */}
          <Button
            icon="plus"
            type="primary"
            onClick={() => this.handlePhoneRegisterModalVisible(true)}
            style={{ marginLeft: "0.5em" }}
          >
            Add Technician
          </Button>
          <PhoneRegisterForm
            {...phoneRegisterMethods}
            modalVisible={registerPhoneModalVisible}
            areas={areas.data}
          />
          <StandardTable
            scroll={{ x: 1300 }}
            loading={loading}
            data={{ list: technicians, pagination: {} }}
            columns={this.columns}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Technician;
