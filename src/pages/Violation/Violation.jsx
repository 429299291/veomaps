// import React, { PureComponent, Fragment } from "react";
// import { connect } from "dva";

// import StandardTable from "@/components/StandardTable";
// import PageHeaderWrapper from "@/components/PageHeaderWrapper";

// /* eslint react/no-multi-comp:0 */
// @connect(({ violation, areas, }) => ({
//     areas,
//     messages: violation.messages,
// }))
// class Violation extends Component {

//     columns = [
//         {
//             title: "Message",
//             dataIndex: 'message'
//         }
//     ]
    
//     getMessages = () => {
//         const { dispatch, selectedAreaId } = this.props;
        
//         dispatch({
//             type: "violation/getMessages",
//         })
//     }

//     componentDidMount() {
//         this.getMessages();
//     }

//     componentDidUpdate() {
//         this.getMessages();
//     }

//     render() {
//         return (
//             <PageHeaderWrapper title="Violation Messages">
//                 <Card>
//                     <StandardTable
//                         data={this.props.violation.messages}
//                         columns={this.columns}
//                     />
//                 </Card>

//             </PageHeaderWrapper>
//         );
//     }
// }

// export default Violation;

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

import { violationTypes } from '@/constant';


import styles from "./Violation.less";

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
      console.log({fieldsValue});
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
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Violation Type">
            {form.getFieldDecorator("messageType", {
            })(<Select placeholder="Violation Type" style={{ width: "100%" }}> 
                <Option value={0}>Parking Violation</Option>
                <Option value={1}>Low Speed Violation</Option>
            </Select>)}
        </FormItem>      
    
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Message">
        {form.getFieldDecorator("message", {
          initialValue: ""
        })(<TextArea placeholder="Please Input" />)}
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
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Price">
        {form.getFieldDecorator("message", {
          rules: [
            {
              required: true,
              message: "price is required"
            }
          ],
          initialValue: record.message
        })(<TextArea placeholder="Please Input" />)}
      </FormItem>
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
@connect(({ areas, price, loading, violation }) => ({
  areas,
  price,
  selectedAreaId: areas.selectedAreaId,
  loading: loading.models.price,
  messages: violation.data,
}))
@Form.create()
class Violation extends PureComponent {
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
        title: "Message Type",
        dataIndex: "messageType",
        render: messageType => <span>{violationTypes[messageType]}</span>
    },
    {
        title: "Message",
        dataIndex: "message"
    },
    {
        title: "Operation",
        render: (text, record) => (
            <a onClick={() => this.handleUpdateModalVisible(true, record)}>
                Update
            </a>
        )
    }
  ];


    componentDidUpdate(prevProps, prevState, snapshot) {

        if (prevProps.selectedAreaId !== this.props.selectedAreaId) {
            this.getMessages();
        }

    }

    getMessages = () => {
        const { dispatch, selectedAreaId } = this.props;
        dispatch({
            type: "violation/get",
        })
    }

    componentDidMount() {
        this.getMessages();
    }

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

  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: "violation/add",
      payload: fields,
      onSuccess: this.getMessages
    });

    this.handleCreateModalVisible();
  };

  handleUpdate = (id, fields) => {
    const { dispatch } = this.props;
    dispatch({
      type: "violation/update",
      payload: fields,
      id: id,
      onSuccess: this.getMessages
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

    const { messages } = this.props;
    console.log({messages});

    return (
      <PageHeaderWrapper title="Price List">
        <Card bordered={false}>
          <div className={styles.tableList}>
            {/*<div className={styles.tableListForm}>*/}
              {/*{this.renderSimpleForm()}*/}
            {/*</div>*/}
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
              data={{list: messages}}
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

export default Violation;
