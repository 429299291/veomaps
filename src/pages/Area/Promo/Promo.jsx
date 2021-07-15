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

/* eslint react/no-multi-comp:0 */
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
            <a onClick={() => this.handleUpdateModalVisible(true, record)}>
              Update
            </a>


          <Divider type="vertical" />

          <a onClick={() => this.handleGenerateCodePromoModalVisible(true, record)}>
            Generate Promo with Code
          </a>

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
    const RenderSimpleForm=()=> {
      // const {
      //   form: { getFieldDecorator }
      // } = this.props;
      const [form] = Form.useForm();

      const handleSearch = e => {
        e.preventDefault();
        form.submit()
    
      };
      const handleFormReset = () => {
        form.resetFields();
    
        this.setState(
          {
            filterCriteria: {}
          },
          () => this.handleGetPromos()
        );
      };
      const onFinish=(value)=>{
        const { filterCriteria } = this.state;
        const values = Object.assign({}, filterCriteria, value);
        this.setState(
          {
            filterCriteria: values
          },
          () => this.handleGetPromos()
        );

      }
      const areas = this.props.areas.data;
      return (
        <Form onSubmit={handleSearch} layout="inline" form={form} onFinish={onFinish} >
          <Row gutter={{ md: 8, lg: 24, xl: 18 }}>
            <Col md={16} sm={24}>
              <FormItem label="Keywords" name='name'>
                <Input placeholder="name"/>
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
        // form,
        handleAdd,
        handleModalVisible,
        promos,
        areas
      } = props;
      const [form] = Form.useForm();
      const okHandle = () => {
        form.submit()
      };
      return (
        <Modal
          destroyOnClose
          forceRender
          title="Add"
          visible={modalVisible}
          onOk={okHandle}
          onCancel={() => handleModalVisible()}
        >
          <Form onFinish={()=>handleAdd(form.getFieldsValue(true))} form={form}>
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
            wrapperCol={{ span: 15 }} label="NAME">
            <Input placeholder="Please Input" />
          </FormItem>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            name='days'
            rules={
              [
                {
                  required: true
                }
              ]
            }
            label="Valid Days"
          >
            <InputNumber placeholder="Please Input" />
          </FormItem>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            name='amount'
            rules={
              [
                {
                  required: true
                }
              ]
            }
            label="Ride Credits"
          >
           <InputNumber placeholder="Please Input" />
          </FormItem>
          {areas && (
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
          )}
          </Form>
        </Modal>
      );
    });
    const UpdateForm = (props => {
      const {
        modalVisible,
        handleUpdate,
        handleModalVisible,
        record,
        areas
      } = props;
      const [form] = Form.useForm();
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
          forceRender
          title="Update"
          visible={modalVisible}
          onOk={okHandle}
          onCancel={() => handleModalVisible()}
        >
          <Form form={form} onFinish={()=>{handleUpdate(record.id, form.getFieldsValue(true))}}>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="NAME"
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
            >
           <Input placeholder="Please Input" />
          </FormItem>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            name='days'
            rules={
              [
                {
                  required: true
                }
              ]
            }
            label="Valid Days"
          >
            <InputNumber placeholder="Please Input" />
          </FormItem>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            name='amount'
            rules={
              [
                {
                  required: true
                }
              ]
            }
            label="Ride Credits"
          >
            <InputNumber placeholder="Please Input" />
          </FormItem>
          {areas && (
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Area"
              name='areaId'
              rules={
                [
                  {
                    required: true
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
    const GeneratePromoWithCodeForm = (props => {
      const {
        modalVisible,
        handleGeneratePromoWithCode,
        handleModalVisible,
        record
      } = props;
      const [form] = Form.useForm()
      form.setFieldsValue(record)
      const okHandle = () => {
        form.submit()
        // if (form.isFieldsTouched())
        //   form.validateFields((err, fieldsValue) => {
        //     if (err) return;
        //     form.resetFields();
    
        //     handleGeneratePromoWithCode(record.id, fieldsValue);
        //   });
        // else handleModalVisible();
      };
    
      // const checkAmount = (rule, value, callback) => {
      //   if (value > 0) {
      //     callback();
      //     return;
      //   }
    
      //   callback("Amount must be larger than zero.");
      // };
    
      return (
        <Modal
          destroyOnClose
          title="Generate Promo with Code"
          visible={modalVisible}
          forceRender
          onOk={okHandle}
          onCancel={() => handleModalVisible()}
        >
          <Form form={form} onFinish={()=>{handleGeneratePromoWithCode(record.id, form.getFieldsValue(true));}}>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            name='start'
            rules={
              [
                {
                  required: true,
                  message: "You have to pick a time to start!"
                }
              ]
            }
            label="Start Time"
          >
              <DatePicker
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                placeholder="Select Start Time"
              />
          </FormItem>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="Amount"
            name='amount'
            rules={
              [
                {
                  required: true
                },
                // {
                //   validator: checkAmount
                // }
              ]
            }
          >
            <InputNumber placeholder="Please Input" />
          </FormItem>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="Code"
            name='code'
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
          </Form>
        </Modal>
      );
    });
    return (
      <PageHeaderWrapper title="Promo List">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <RenderSimpleForm
              
              />
            </div>
            <div className={styles.tableListOperator}>
              {/* {authority.includes("create.promo") && */
                <Button
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
const mapStateToProps = ({ promos, areas, loading }) => {
  return {
    promos,
    areas,
    selectedAreaId: areas.selectedAreaId,
    loading: loading.models.promos
  }
}
export default connect(mapStateToProps)(Promo) 