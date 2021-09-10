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

const vehicleType = ["Bicycle", "Scooter", "E-Vehicle", "COSMO"];

/* eslint react/no-multi-comp:0 */
class Price extends PureComponent {
  state = {
    modalVisible: false,
    createModalVisible: false,
    updateModalVisible: false,
    detailModalVisible: false,
    expandForm: false,
    selectedRows: [],
    filterCriteria: {
      pagination:{
        page:0,
        pageSize:10,
        sort:{
          direction:'desc',
          sortBy:'created'
        }
      }
    },
    total:0,
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


  componentDidUpdate(prevProps, prevState, snapshot) {

    if (prevProps.selectedAreaId !== this.props.selectedAreaId) {
      this.handleGetPrices();
    }

  }

  componentDidMount() {
    this.handleGetPrices();
  }

  handleGetPrices = () => {
    const { dispatch, selectedAreaId } = this.props;
    const { filterCriteria } = this.state;

    dispatch({
      type: "price/get",
      payload: Object.assign({}, filterCriteria,selectedAreaId ? {areaId: selectedAreaId} : null),
      onSuccess: (data,total,page) => {
        this.setState({selectedRows:data})
        this.setState({total:total})
        this.setState({
          filterCriteria:{
            pagination:{
              page:page,
              ...filterCriteria.pagination
            }
          }
        })
    }
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

  handleStandardTableChange = (pagination, sorter) => {
    const { filterCriteria } = this.state;
    const params = {
      ...filterCriteria,
      pagination:{
        ...filterCriteria.pagination,
        page:pagination.current-1,
        pageSize:pagination.pageSize,
      }
    };

    // if (sorter.field) {
    //   params.sorter = `${sorter.field}_${sorter.order}`;
    // }

    this.setState({ filterCriteria: params }, () => this.handleGetPrices());
  };

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();

    this.setState(
      {
        filterCriteria: {}
      },
      () => this.handleGetPrices()
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
        () => this.handleGetPrices()
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
      onSuccess: this.handleGetPrices
    });

    this.handleCreateModalVisible();
  };

  handleUpdate = (id, fields) => {
    const { dispatch } = this.props;
    dispatch({
      type: "price/update",
      payload: fields,
      id: id,
      onSuccess: this.handleGetPrices
    });

    this.handleUpdateModalVisible();
  };

  handleDelete = id => {
    const { dispatch } = this.props;

    dispatch({
      type: "price/remove",
      id: id,
      onSuccess: this.handleGetPrices
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

  filterAreaPrice(prices, areas) {



    if (Array.isArray(prices) && Array.isArray(areas)) {
      const areaIds = {}
      areas.map(area => areaIds[area.id] = true);

      return prices.filter(price => areaIds[price.areaId])
    }

    return prices
  }

  render() {
    const { areas, areaPrice, loading, price } = this.props;
    const {
      modalVisible,
      createModalVisible,
      updateModalVisible,
      detailModalVisible,
      selectedRecord,
      total,
      filterCriteria
    } = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleCreateModalVisible
    };
    const updateMethods = {
      handleModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate
    };
    const CreateForm = (props => {
      const {
        modalVisible,
        handleAdd,
        handleModalVisible,
        areas,
        areaPrice
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
          forceRender
          title="Add"
          visible={modalVisible}
          onOk={okHandle}
          onCancel={() => handleModalVisible()}
        >
          <Form form={form} onFinish={()=>{handleAdd(form.getFieldsValue(true))}}>
          {areas && (
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
          )}
          <FormItem labelCol={{ span: 5 }} 
            // name='chargeAmount'
            name='price'
            rules={
              [
                {required:true,message:'price is required'}
              ]
            }
            wrapperCol={{ span: 15 }} label="Price">
            <InputNumber placeholder="Please Input" />
          </FormItem>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="Frequency"
            name='frequency'
            rules={
              [
                {required:true,message:'frequency is required'}
              ]
            }
          >
           <InputNumber placeholder="Please Input" />
          </FormItem>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            name='unlockFee'
            rules={
              [
                {required:true,message:'unlockFee is required'}
              ]
            }
            label="UnlockFee"
          >
            <InputNumber placeholder="Please Input" />
          </FormItem>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="Vehicle Type"
            name='vehicleType'
          >
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
          </FormItem>
          </Form>
        </Modal>
      );
    });
    
    const UpdateForm = (props => {
      const {
        areas,
        areaPrice,
        modalVisible,
        handleUpdate,
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
        //     handleUpdate(record.id, fieldsValue);
        //   });
        // else handleModalVisible();
      };
    
      return (
        <Modal
          destroyOnClose
          title="Update"
          visible={modalVisible}
          forceRender
          onOk={okHandle}
          onCancel={() => handleModalVisible()}
        >
          <Form form={form} onFinish={()=>{handleUpdate(record.id, form.getFieldsValue(true))}}>
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
          <FormItem labelCol={{ span: 5 }} 
            // name='chargeAmount'
            name='price'
            rules={
              [
                {required:true,message:'price is required'}
              ]
            }
            wrapperCol={{ span: 15 }} label="Price">
            <InputNumber placeholder="Please Input" />
          </FormItem>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="Frequency"
            name='frequency'
            rules={
              [
                {required:true,message:'frequency is required'}
              ]
            }
          >
            <InputNumber placeholder="Please Input" />
          </FormItem>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="UnlockFee"
            name='unlockFee'
            rules={
              [
                {required:true,message:'unlockFee is required'}
              ]
            }
          >
            <InputNumber placeholder="Please Input" />
          </FormItem>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="Vehicle Type"
            name='vehicleType'
          >
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
          </FormItem>
          </Form>
        </Modal>
      );
    });
    return (
      <PageHeaderWrapper title="Price List">
        <Card bordered={false}>
          <div className={styles.tableList}>
            {/*<div className={styles.tableListForm}>*/}
              {/*{this.renderSimpleForm()}*/}
            {/*</div>*/}
            <div className={styles.tableListOperator}>
              <Button
                type="primary"
                onClick={() => this.handleCreateModalVisible(true)}
              >
                Add
              </Button>
            </div>
            <StandardTable
              loading={loading}
              data={{ list: price.areaPrice,pagination: {
                current:filterCriteria.pagination.page +1,
                total:total,
                showTotal: ((total) => {
                  return `count: ${total}`;
                })
              }}}
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
const mapStateToProps = ({ areas, price, loading }) => {
  return {
    areas,
    price,
    selectedAreaId: areas.selectedAreaId,
    loading: loading.models.price
    }
}
export default connect(mapStateToProps)(Price) 