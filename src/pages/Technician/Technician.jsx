import React, { PureComponent, Fragment } from "react";
import { connect } from "dva";
import moment from "moment";
import PageHeaderWrapper from "@/components/PageHeaderWrapper";
import {
  Row,
  Col,
  Button,
  Form,
  Modal,
  Card,
  Input,
  Icon,
  Select,
  Divider,
  Popconfirm,
  DatePicker

} from "antd";
import StandardTable from "@/components/StandardTable";

import { getAuthority } from "@/utils/authority";
import form from "../Forms/models/form";

const { RangePicker } = DatePicker;

const authority = getAuthority();

const { Option } = Select;

const FormItem = Form.Item;
const RenderSimpleForm=(props)=> {
  const [form] = Form.useForm()
  return (
    <Form onSubmit={()=>{props.handleSearch(form.getFieldsValue(true))}} layout="inline" form={form}>
    <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
      <Col span={14}>
        <FormItem label="Name" name='name'>
          <Input placeholder="Name" onPressEnter={()=>{props.handleSearch(form.getFieldsValue(true))}}/>
        </FormItem>
      </Col>
      <Col md={6} sm={24}>
        <Button
          type="primary"
          onClick={() => props.handlePhoneRegisterModalVisible(true)}
          style={{ marginLeft: "0.5em" }}
        >
          Add Technician
        </Button>
      </Col>
    </Row>
  </Form>
  );
}
const PhoneRegisterForm = (props => {
  const { modalVisible, handleSubmit, handleModalVisible, areas } = props;
  const [form] = Form.useForm()
  const okHandle = () => {
      
      handleSubmit(form.getFieldsValue(true));
      form.resetFields()
  };

  return (
    <Modal
      destroyOnClose
      title="Register Technician By Phone"
      visible={modalVisible}
      onOk={okHandle}
      forceRender
      onCancel={() => handleModalVisible()}
      width="600px"
    >
      <Form form={form}>
      <FormItem
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 15 }}
        label="First Name"
        name='firstName'
        rules={
          [
            {
              required: true,
              message: "First Name can't be empty",
              min: 1
            }
          ]
        }
      >
        <Input placeholder="First Name" />
      </FormItem>
      <FormItem
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 15 }}
        label="Last Name"
        name='lastName'
        rules={
          [
            {
              required: true,
              message: "Last Name can't be empty",
              min: 1
            }
          ]
        }
      >
        <Input placeholder="Last Name" />
      </FormItem>
      <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 15 }} label="Email"
        name='email'
        rules={
          [
            {
              required: true,
              message: "Email can't be empty",
              min: 1
            }
          ]
        }
      >
        <Input placeholder="Email" />
      </FormItem>
      <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 15 }} label="Phone"
        name='phone' 
        rules={
          [
            {
              required: true,
              message: "Phone can't be empty",
              min: 1
            }
          ]
        }
      >
        <Input placeholder="Phone Number" />
      </FormItem>
      <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 15 }} label="Area"
        name='areaId'
        rules={
          [
            {
              required: true
            }
          ]
        }
      >
          <Select placeholder="Please Select an Area" style={{ width: "100%" }}>
            {areas.map(area => (
              <Option key={area.id} value={area.id}>
                {area.name}
              </Option>
            ))}
          </Select>
      </FormItem>
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
    const fieldsValue = form.getFieldsValue(true)
    if(fieldsValue){
      handleUpdate(record.id, fieldsValue);
    }else{
       handleModalVisible();
    }
    form.resetFields()
  };

  return (
    <Modal
      destroyOnClose
      title="Update"
      visible={modalVisible}
      onOk={okHandle}
      forceRender
      onCancel={() => handleModalVisible()}
    >
      <Form form={form}>
      <FormItem
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 15 }}
        label="Password"
        name='password'
      >
          <Input placeholder="Please Input" />
      </FormItem>

      {areas && (
        <FormItem
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 15 }}
          label="Areas"
          name='areaId'
        >
            <Select placeholder="select" style={{ width: "100%" }}>
              {areas.data.map(area => (
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

class Technician extends PureComponent {
  state = {
    registerPhoneModalVisible: false,
    filterCriteria: {},
    areas: [],
    selectedRecord: {},
    updateModalVisible: false,
    filterTechnician: []
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
        <div>
          <Popconfirm
            title="Are You Sure?"
            icon={
              <Icon
                type="question-circle-o"
                style={{ color: record.status === 1 ? "red" : "green" }}
              />
            }
            onConfirm={() =>
              this.handleUpdate(record.id, { status: !record.status * 1 })
            }
          >
            {record.status === 0 ? (
              <a href="#" style={{ color: "red" }}>
                Deactivate
              </a>
            ) : (
              <a href="#" style={{ color: "green" }}>
                Activate
              </a>
            )}
          </Popconfirm>

          <Divider type="vertical" />

          <a onClick={() => this.handleUpdateModalVisible(true, record)}>
              Update
            </a>
        </div>
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
        : filterCriteria,
      onSuccess: this.handleSearch
    });
  };

  getNameByAreaId = areaId => {
    const  areas = this.props.areas.allAreas;
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

  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      selectedRecord: record || {}
    });
  };

  handleUpdate = (id, fields) => {
    const { dispatch } = this.props;

    dispatch({
      type: "technicians/update",
      payload: fields,
      id: id,
      onSuccess: this.handleGetTechnicians
    });

    this.handleUpdateModalVisible();
  };

  handleSearch = fieldsValue => {
    const { dispatch, technicians } = this.props;
    const { filterCriteria } = this.state;

    let result = technicians;
    if(fieldsValue){
      if (fieldsValue.name) {
        result = technicians.filter(technician =>
          (technician.firstName + " " + technician.lastName).includes(
            fieldsValue.name
          )
        );
      }
    }

      this.setState({ filterTechnician: result });
  };

  render() {
    const {
      registerPhoneModalVisible,
      updateModalVisible,
      selectedRecord,
      filterTechnician
    } = this.state;
    // const [form] = Form.useForm()
    const {
      areas,
      technicians,
      loading,
    } = this.props;

    const phoneRegisterMethods = {
      handleModalVisible: this.handlePhoneRegisterModalVisible,
      handleSubmit: this.handlePhoneRegister
    };

    const updateMethods = {
      handleModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate
    };

    return (
      <PageHeaderWrapper title="Technician List">
        <Card bordered={false}>
            <RenderSimpleForm handleSearch={this.handleSearch} handlePhoneRegisterModalVisible={this.handlePhoneRegisterModalVisible} />
          <PhoneRegisterForm
            {...phoneRegisterMethods}
            modalVisible={registerPhoneModalVisible}
            areas={areas.data}
          />
          <StandardTable
            scroll={{ x: 1300 }}
            loading={loading}
            data={{ list: filterTechnician, pagination: {} }}
            columns={this.columns}
          />
        </Card>
        <UpdateForm
          {...updateMethods}
          modalVisible={updateModalVisible}
          record={selectedRecord}
          areas={areas}
        />
      </PageHeaderWrapper>
    );
  }
}

const mapStateToProps = ({ areas, technicians, loading }) => {
  return {
    areas,
    technicians: technicians.data,
    loading: loading.models.technicians,
    selectedAreaId: areas.selectedAreaId
    }
}
export default connect(mapStateToProps)(Technician) 