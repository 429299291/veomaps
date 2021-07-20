import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
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
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './Violation.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

const CreateForm = ((props) => {
  const {
    modalVisible,
    handleAdd,
    handleModalVisible,
    areas,
  } = props;
  const [form] = Form.useForm()
  const okHandle = () => {
    handleAdd(form.getFieldsValue(true));
    form.resetFields();
  };
  const areaIdChange = (value) => {
    console.log(value);
  }
  return (
    <Modal
      destroyOnClose
      title="Add"
      visible={modalVisible}
      forceRender
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <Form form={form}>
      {areas && (
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Area"
          name='areaId'
          rules={
            [
              {
                required: true,
              },
            ]
          }
        >
            <Select placeholder="select" style={{ width: '100%' }} onChange = {areaIdChange} >
              {areas.map(area => (
                <Option key={area.id} value={area.id}>
                  {area.name}
                </Option>
              ))}
            </Select>
        </FormItem>
      )}
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Violation Type" name='type'>
        <Input placeholder="Please Input" />
      </FormItem>

      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Message" name='message'>
        <TextArea placeholder="Please Input" />
      </FormItem>
      </Form>
    </Modal>
  );
});

const UpdateForm = ((props) => {
  const {
    modalVisible,
    handleUpdate,
    handleModalVisible,
    record,
  } = props;
  const [form] = Form.useForm()
  form.setFieldsValue(record)
  const okHandle = () => {
    const fieldsValue = form.getFieldsValue(true)
    if(fieldsValue){
      form.resetFields();
      handleUpdate(record.id, fieldsValue);
    }else{
      handleModalVisible();
    }
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
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} label="Message Type" 
        rules={
          [
            {
              required: true,
              message: 'message type is required',
            },
          ]
        }
      name='type'>
        <Input placeholder="Please Input" />
      </FormItem>
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} label="Message"
        name='message'
        rules={
          [
            {
              required: true,
              message: 'message is required',
            },
          ]
        }
      >
        <TextArea placeholder="Please Input" />
      </FormItem>
      </Form>
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
class Violation extends PureComponent {
  state = {
    modalVisible: false,
    createModalVisible: false,
    updateModalVisible: false,
    detailModalVisible: false,
    filterCriteria: {},
    selectedRecord: {},
  };

  columns = [
    {
      title: 'Area',
      dataIndex: 'areaId',
      render: areaId => <span>{this.props.areas.areaNames[areaId]}</span>,
    },
    {
      title: 'Message Type',
      dataIndex: 'type',
    },
    {
      title: 'Message',
      dataIndex: 'message',
    },
    {
      title: 'Operation',
      render: (text, record) => (
        <div>
          <Popconfirm
            title="Are You Sure?"
            icon={(
              <Icon
                type="question-circle-o"
                style={{ color: record.active ? 'red' : 'green' }}
              />
)}
            onConfirm={() => this.handleUpdate(record.id, { active: !record.active })
              }
          >
            {record.active ? (
              <a href="#" style={{ color: 'red' }}>
                  Deactivate
              </a>
            ) : (
              <a href="#" style={{ color: 'green' }}>
                  Activate
              </a>
            )}
          </Popconfirm>
          <Divider type="vertical" />
          <a onClick={() => this.handleUpdateModalVisible(true, record)}>
                Update
          </a>
        </div>
      ),
    },
  ];


  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.selectedAreaId !== this.props.selectedAreaId) {
      this.getMessages();
    }
  }

    getMessages = () => {
      const { dispatch, selectedAreaId } = this.props;
      const { filterCriteria } = this.state;
      dispatch({
        type: 'violation/get',
        payload: Object.assign({}, filterCriteria, { areaId: selectedAreaId }),
      });
    }

    componentDidMount() {
      this.getMessages();
    }

  handleCreateModalVisible = (flag) => {
    this.setState({
      createModalVisible: !!flag,
    });
  };

  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      selectedRecord: record || {},
    });
  };

  handleDetailModalVisible = (flag, record) => {
    this.setState({
      detailModalVisible: !!flag,
      selectedRecord: record || {},
    });
  };

  handleAdd = (fields) => {
    const { dispatch } = this.props;
    fields.active = true
    dispatch({
      type: 'violation/add',
      payload: fields,
      onSuccess: this.getMessages,
    });

    this.handleCreateModalVisible();
  };

  handleUpdate = (id, fields) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'violation/update',
      payload: fields,
      id,
      onSuccess: this.getMessages,
    });

    this.handleUpdateModalVisible();
  };

  filterAreaPrice(prices, areas) {
    if (Array.isArray(prices) && Array.isArray(areas)) {
      const areaIds = {};
      areas.map(area => areaIds[area.id] = true);

      return prices.filter(price => areaIds[price.areaId]);
    }

    return prices;
  }

  render() {
    const {
      areas, areaPrice, loading, price,
    } = this.props;
    const {
      modalVisible,
      createModalVisible,
      updateModalVisible,
      detailModalVisible,
      selectedRecord,
    } = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleCreateModalVisible,
    };
    const updateMethods = {
      handleModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };

    const { messages } = this.props;

    return (
      <PageHeaderWrapper title="Price List">
        <Card bordered={false}>
          <div className={styles.tableList}>
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
              data={{ list: messages }}
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
const mapStateToProps = ({ areas, price, loading, violation }) => {
  return {
    areas,
    price,
    selectedAreaId: areas.selectedAreaId,
    loading: loading.models.price,
    messages: violation.data,
      }
}
export default connect(mapStateToProps)(Violation) 