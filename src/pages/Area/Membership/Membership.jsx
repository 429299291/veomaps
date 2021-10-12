import React, { PureComponent, Fragment } from "react";
import { connect } from "dva";
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
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
import {
  InfoCircleOutlined,
} from '@ant-design/icons';
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

    const intervals = ["DAY", "WEEK", "MONTH", "YEAR"];
    const vehicleType = ["BIKE", "SCOOTER", "E_BIKE", "COSMO"];

import { getAuthority } from "@/utils/authority";
const RenderSimpleForm=(props) =>{
  const [form] = Form.useForm()
  const areas = props.areas.data;
  const handleFormReset = () => {
    form.resetFields();
    props.handleSearch('reset')
    // this.setState(
    //   {
    //     filterCriteria: {}
    //   },
    //   () => this.handleGetMemberships()
    // );
  };
  return (
    <Form onFinish={props.handleSearch} layout="inline" form={form}>
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <Col md={16} sm={24}>
          <FormItem label="Keywords" name='name'>
              <Input placeholder="Title or Description" />
          </FormItem>
        </Col>
        <Col md={8} sm={24}>
          <span className={styles.submitButtons}>
            <Button type="primary" htmlType="submit">
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
const CreateForm = (props => {
  const {
    modalVisible,
    handleAdd,
    handleModalVisible,
    memberships,
    areas
  } = props;
  const [form] = Form.useForm()
  const okHandle = () => {
    form.submit()
    // form.validateFields((err, fieldsValue) => {
    //   if (err) return;
    //   form.resetFields();
    //   handleAdd(fieldsValue);
    // });
  };
  return (
    <Modal
      destroyOnClose
      title="Add"
      forceRender
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <Form form={form} onFinish={()=>{handleAdd(form.getFieldsValue(true))}}>
      <FormItem labelCol={{ span: 5 }} 
        name='name'
        rules={
          [
            {
              required: true,
              message: "title is required",
              min: 1
            }
          ]
        }
        wrapperCol={{ span: 15 }} label="Title">
        <Input placeholder="Please Input" />
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        name='description'
        rules={
          [
            {
              required: true
            }
          ]
        }
        label="Description"
      >
       <Input placeholder="Please Input" />
      </FormItem>
      <FormItem labelCol={{ span: 5 }} 
        name='type'
        rules={
          [
            {required:true}
          ]
        }
        wrapperCol={{ span: 15 }} label="Type">
          <Select placeholder="select" style={{ width: "100%" }}>
            <Option key={1} value='LOCAL_PASS'>
            LOCAL_PASS
            </Option>
            <Option key={2} value='BIKE_MEMBERSHIP'>
            BIKE_MEMBERSHIP
            </Option>
          </Select>
      </FormItem>
      <FormItem
        label='Vehicle Type'
        name='vehicleType'
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        rules={
          [
            {
              required: true
            }
          ]
        }
      >
         <Select placeholder="select" style={{ width: "100%" }}>
            {vehicleType.map((interval, index) => (
              <Option key={index} value={interval}>
                {vehicleType[index]}
              </Option>
            ))}
          </Select>
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="Interval"
        name='unit'
        rules={
          [
            {
              required: true
            }
          ]
        }
      >
          <Select placeholder="select" style={{ width: "100%" }}>
            {intervals.map((interval, index) => (
              <Option key={index} value={interval}>
                {intervals[index]}
              </Option>
            ))}
          </Select>
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        name='unitCount'
        rules={
          [
            {
              required: true
            }
          ]
        }
        label="Free Minutes"
      >
       <InputNumber placeholder="Please Input" min={0}/>
      </FormItem>
      <FormItem labelCol={{ span: 5 }} 
        name='price'
        rules={
          [
            {required:true}
          ]
        }
        wrapperCol={{ span: 15 }} label="Price">
        <InputNumber placeholder="Please Input" min={0}/>
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="Priority"
        name='priority'
        rules={
          [
            {
              required: true
            }
          ]
        }
      >
        <InputNumber placeholder="Please Input" min={0}/>
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        name='isRenewable'
        rules={
          [
            {
              required: true
            }
          ]
        }
        label="Renewable"
      >
        
          <Select placeholder="select" style={{ width: "100%" }}>
            <Option key={1} value={true}>
              true
            </Option>
            <Option key={2} value={false}>
              false
            </Option>
          </Select>
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="Educational"
        name='isEducational'
        rules={
          [
            {
              required: true
            }
          ]
        }
      >
        
          <Select placeholder="select" style={{ width: "100%" }}>
            <Option key={1} value={true}>
              true
            </Option>
            <Option key={2} value={false}>
              false
            </Option>
          </Select>
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="Prime"
        name='isPrime'
        rules={
          [
            {
              required: true
            }
          ]
        }
      >
        
          <Select placeholder="select" style={{ width: "100%" }}>
            <Option key={1} value={true}>
              true
            </Option>
            <Option key={2} value={false}>
              false
            </Option>
          </Select>
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="Once PerDay"
        name='oncePerDay'
        rules={
          [
            {
              required: true
            }
          ]
        }
      >
        
          <Select placeholder="select" style={{ width: "100%" }}>
            <Option key={1} value={true}>
              true
            </Option>
            <Option key={2} value={false}>
              false
            </Option>
          </Select>
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="Activated"
        name='activated'
        rules={
          [
            {
              required: true
            }
          ]
        }
      >
        
          <Select placeholder="select" style={{ width: "100%" }}>
            <Option key={1} value={true}>
              true
            </Option>
            <Option key={2} value={false}>
              false
            </Option>
          </Select>
      </FormItem>
      <p>Policies:</p>
      <Row span={24}>
        <Form.Item label="Split" name={['policies','split']}>
          <InputNumber addonbefore="+" addonafter="$" min={0}/>
        </Form.Item>
        <Form.Item label="Unlock Fee" name={['policies','unlockFee']}>
          <InputNumber addonbefore="+" addonafter="$" min={0}/>
        </Form.Item>
        <Form.Item label="Fee" name={['policies','fee']}>
          <InputNumber addonbefore="+" addonafter="$" min={0}/>
        </Form.Item>
      </Row>
      {/* {areas && (
        <FormItem labelCol={{ span: 5 }} 
          name='areaId'
          rules={
            [
              {
                required: true
              }
            ]
          }
          wrapperCol={{ span: 15 }} label="Area">
            <Select placeholder="select" style={{ width: "100%" }}>
              {areas.map(area => (
                <Option key={area.id} value={area.id}>
                  {area.name}
                </Option>
              ))}
            </Select>
        </FormItem>
      )} */}
      </Form>
    </Modal>
  );
});
const authority = getAuthority();
const UpdateForm = (props => {
  const {
    modalVisible,
    handleUpdate,
    handleModalVisible,
    record,
    areas
  } = props;
  const [form] = Form.useForm()
  form.setFieldsValue(record)
  const okHandle = () => {
    form.submit()
    // if (form.isFieldsTouched())
    //   form.validateFields((err, fieldsValue) => {
    //     if (err) return;
    //     form.resetFields();

    //     handleUpdate(record.id, fieldsValue);
    //   });
    // else handleModalVisible();
  };

  return (
    <Modal
      destroyOnClose
      title="Update"
      forceRender
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <Form form={form} onFinish={()=>{handleUpdate(record.id,form.getFieldsValue(true))}}>
      <FormItem labelCol={{ span: 5 }} 
        name='name'
        rules={
          [
            {
              required: true,
              message: "name is required",
              min: 1
            }
          ]
        }
        wrapperCol={{ span: 15 }} label="Title">
        <Input placeholder="Please Input" />
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="Description"
        name='description'
        rules={
          [
            {
              required: true
            }
          ]
        }
      >
        <Input placeholder="Please Input" />
      </FormItem>
      <FormItem labelCol={{ span: 5 }} 
        name='type'
        rules={
          [
            {required:true}
          ]
        }
        wrapperCol={{ span: 15 }} label="Type">
          <Select placeholder="select" style={{ width: "100%" }}>
            <Option key={1} value='LOCAL_PASS'>
            LOCAL_PASS
            </Option>
            <Option key={2} value='BIKE_MEMBERSHIP'>
            BIKE_MEMBERSHIP
            </Option>
          </Select>
      </FormItem>
      <FormItem
        name='vehicleType'
        label='Vehicle Type'
        wrapperCol={{ span: 15 }}
      >
        <Select placeholder="select" style={{ width: "100%" }}>
      {vehicleType.map((interval, index) => (
              <Option key={index} value={interval}>
                {vehicleType[index]}
              </Option>
            ))}
            </Select>
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        name='unit'
        rules={
          [
            {required:true}
          ]
        }
        label="Interval"
      >
        
          <Select placeholder="select" style={{ width: "100%" }}>
            {intervals.map((interval, index) => (
              <Option key={index} value={index}>
                {intervals[index]}
              </Option>
            ))}
          </Select>
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        name='unitCount'
        rules={
          [
            {required:true}
          ]
        }
        label="Free Minutes"
      >
        <InputNumber placeholder="Please Input" min={0}/>
      </FormItem>
      <FormItem labelCol={{ span: 5 }} 
        name='price'
        rules={
          [
            {required:true}
          ]
        }
        wrapperCol={{ span: 15 }} label="Price">
        <InputNumber placeholder="Please Input" min={0}/>
      </FormItem>
      <FormItem labelCol={{ span: 5 }} 
        name='priority'
        rules={
          [
            {required:true}
          ]
        }
        wrapperCol={{ span: 15 }} label="Priority">
        <InputNumber placeholder="Please Input" min={0}/>
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        name='isRenewable'
        rules={
          [
            {required:true}
          ]
        }
        label="Renewable"
      >
          <Select placeholder="select" style={{ width: "100%" }}>
            <Option key={1} value={true}>
              true
            </Option>
            <Option key={2} value={false}>
              false
            </Option>
          </Select>
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="Educational"
        name='isEducational'
        rules={
          [
            {required:true}
          ]
        }
      >
          <Select placeholder="select" style={{ width: "100%" }}>
            <Option key={1} value={true}>
              true
            </Option>
            <Option key={2} value={false}>
              false
            </Option>
          </Select>
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="Prime"
        name='isPrime'
        rules={
          [
            {
              required: true
            }
          ]
        }
      >
        
          <Select placeholder="select" style={{ width: "100%" }}>
            <Option key={1} value={true}>
              true
            </Option>
            <Option key={2} value={false}>
              false
            </Option>
          </Select>
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="Once PerDay"
        name='oncePerDay'
        rules={
          [
            {
              required: true
            }
          ]
        }
      >
        
          <Select placeholder="select" style={{ width: "100%" }}>
            <Option key={1} value={true}>
              true
            </Option>
            <Option key={2} value={false}>
              false
            </Option>
          </Select>
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="Activated"
        name='activated'
        rules={
          [
            {required:true}
          ]
        }
      >

          <Select placeholder="select" style={{ width: "100%" }}>
            <Option key={1} value={true}>
              true
            </Option>
            <Option key={2} value={false}>
              false
            </Option>
          </Select>
      </FormItem>
      {/* {areas && (
        <FormItem labelCol={{ span: 5 }} 
          name='areaId'
          rules={
            [
              {required:true}
            ]
          }
          wrapperCol={{ span: 15 }} label="Area">
            <Select placeholder="select" style={{ width: "100%" }}>
              {areas.map(area => (
                <Option key={area.id} value={area.id}>
                  {area.name}
                </Option>
              ))}
            </Select>
        </FormItem>
      )} */}
      </Form>
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
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
      title: "Name",
      dataIndex: "name"
    },
    {
      title: "Interval",
      dataIndex: "unit",
      // render: unitCount => <span>{intervals[unitCount]}</span>
    },
    {
      title: "Price",
      dataIndex: "price"
    },
    {
      title: "Free Minutes",
      dataIndex: "unitCount"
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
            <a onClick={() => this.handleUpdateModalVisible(true, record)}>
              Update
            </a>
          {/* <Divider type="vertical" />

              <a onClick={() =>  this.handleDetailModalVisible(true, record)}>
                Detail
              </a> */}
          <Divider type="vertical" />
            <Popconfirm
              title="Are you Sure？"
              icon={<InfoCircleOutlined />}
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

  handleDetailModalVisible = (flag, record) => {
    const { dispatch } = this.props;
    if (!!flag) {
      dispatch({
        type: "memberships/getDetail",
        membershipId: record.id,
        onSuccess: detail =>
          this.setState({
            membershipDetail: detail,
            detailModalVisible: true,
          })
      });

    } else {
      this.setState({
        membershipDetail: null,
        detailModalVisible: false
      });
    }
  };

  componentDidMount() {
    this.handleGetMemberships();
  }


  componentDidUpdate(prevProps, prevState, snapshot) {

    if (prevProps.selectedAreaId !== this.props.selectedAreaId ) {
      this.handleGetMemberships();
    }

  }

  handleGetMemberships = () => {
    const { dispatch, selectedAreaId } = this.props;
    const { filterCriteria } = this.state;
    if(selectedAreaId){
      dispatch({
        type: "memberships/get",
        payload: selectedAreaId ? Object.assign({}, filterCriteria, {areaId: selectedAreaId}) : filterCriteria
      });
    }
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
    const { dispatch, selectedAreaId } = this.props;
    fields.policies=[fields.policies]
    dispatch({
      type: "memberships/add",
      areaId:selectedAreaId,
      payload: fields,
      onSuccess: this.handleGetMemberships
    });

    this.handleCreateModalVisible();
  };

  handleDelete = membershipId => {
    const { dispatch,selectedAreaId } = this.props;
    dispatch({
      type: "memberships/remove",
      areaId:selectedAreaId,
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

  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      selectedRecord: record || {}
    });
  };

  render() {
    const { memberships, loading, areas,selectedAreaId } = this.props;
    const {
      createModalVisible,
      updateModalVisible,
      selectedRecord,
      detailModalVisible,
      membershipDetail
    } = this.state;
      const handleSearch = value => {
    const { dispatch, form } = this.props;
    const { filterCriteria } = this.state;
    if(value == 'reset'){
      this.setState({
        filterCriteria:{
          name:null
        }
      },()=>this.handleGetMemberships())
    }else{
      const values = Object.assign({}, filterCriteria, value);
      this.setState(
        {
          filterCriteria: values
        },
        () => this.handleGetMemberships()
      );
    }
  };

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleCreateModalVisible
    };
    const updateMethods = {
      handleModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate
    }
    
    return (
      <PageHeaderWrapper title="Membership List">
        <Card bordered={false} style={{display:selectedAreaId ? 'block': 'none'}}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <RenderSimpleForm areas={this.props.areas} handleSearch={handleSearch} handleFormReset={this.handleFormReset}/>
            </div>
            {
              selectedAreaId &&
              <div className={styles.tableListOperator}>
              <Button
                type="primary"
                onClick={() => this.handleCreateModalVisible(true)}
              >
                Add
              </Button>
          </div>
            }
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
{/* 
        {detailModalVisible && membershipDetail && (
            <Modal
              destroyOnClose
              title="Detail"
              visible={detailModalVisible}
              onCancel={() => this.handleDetailModalVisible()}
              onOk={() => this.handleDetailModalVisible()}
            >
              Number of Customer: {membershipDetail.count}
            </Modal>
          )} */}

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
const mapStateToProps = ({ memberships, areas, loading }) => {
  return {
    memberships,
    areas,
    selectedAreaId: areas.selectedAreaId,
    loading: loading.models.memberships
  }
}
export default connect(mapStateToProps)(Membership) 