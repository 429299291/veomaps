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
  Table
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './Listing.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

import { getAuthority } from "@/utils/authority";

const authority = getAuthority();


const checkNumberFormat = (rule, value, callback) => {



    if (isNaN(value)) {
      callback("Please input a correct number.");
      return;
    }


    if (value < 0) {
      callback("Amount must be larger than 0.");
      return;
    }
;
    if (value > 10000 || value < 0) {
      callback("Amount exceeds limit.");
      return;
    }

    callback();

    return;
  };

const UpdateForm = Form.create()((props) => {
  const {
    form,
    modalVisible,
    handleUpdate,
    handleModalVisible,
    currentUser,
    record,
  } = props;
  const okHandle = () => {
    if (form.isFieldsTouched()) {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        form.resetFields();
        handleUpdate(record.id, fieldsValue);
      });
    } else handleModalVisible();
  };



  return (
    <Modal
      destroyOnClose
      title="Detail"
      visible={modalVisible}
      onOk={okHandle}
      width={"30%"}
      onCancel={() => handleModalVisible()}
    >

                <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="Description">
                    <div> {record.description} </div>
                </FormItem>

                <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="Type">
                    <div> {record.type} </div>
                </FormItem>

                <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="Price">
                    <div> {record.price} </div>
                </FormItem>


                <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="Availability">
                {form.getFieldDecorator("availability", {
                    rules: [{ validator: checkNumberFormat }],
                    initialValue: record.availability
                })(<Input placeholder="Please Input" />)}
                </FormItem>

                <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="Lead Time in Days">
                {form.getFieldDecorator("leadTimeDays", {
                    rules: [{ validator: checkNumberFormat }],
                    initialValue: record.leadTimeDays
                })(<Input placeholder="Please Input" />)}
                </FormItem>

                <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="Status">
                {form.getFieldDecorator("listingItemStatus", {
                    initialValue: record.status
                })(<Select
                    placeholder="select"
                    style={{ width: "100%" }}
                   >
                    <Option key={0} value="NORMAL">
                      NORMAL
                    </Option>
                    <Option key={1} value="PRE_ORDER">
                      PRE_ORDER
                    </Option>
                    <Option key={2} value="BACK_ORDER">
                      BACK_ORDER
                    </Option>
                    <Option key={2} value="SOLD_OUT">
                      SOLD_OUT
                    </Option>
                  </Select>)
                }
                </FormItem>
     
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
@connect(({
  listing,
  loading,
}) => ({
    listing,
    loading: loading.models.listing
}))
@Form.create()
class Listing extends PureComponent {
  state = {
    updateModalVisible: false,
    filterCriteria: {},
    selectedRecord: {},
  };

  columns = [
    {
        title: 'Title',
        dataIndex: 'title',
    },
    {
      title: 'Status',
      dataIndex: 'status',
    
    },
    {
        title: 'Created',
        dataIndex: 'lastName',
        render: val => <span>{moment(val).format("YYYY-MM-DD HH:mm:ss")}</span>
      
      },
    {
      title: 'Updated',
      dataIndex: 'city',
      render: val => <span>{moment(val).format("YYYY-MM-DD HH:mm:ss")}</span>
    }
  ];

  ListingItemColumn =  [
    {
        title: 'Description',
        dataIndex: 'description',
    },
    {
      title: 'Name',
      dataIndex: 'name',
    
    },
    {
        title: 'Unit Price',
        dataIndex: 'price',
      
      },
    {
      title: 'Type',
      dataIndex: 'type',
    },
    {
        title: 'Status',
        dataIndex: 'status',
    },
    {
        title: 'Availability',
        dataIndex: 'availability',
    },
    {
        title: 'Lead Time Days',
        dataIndex: 'leadTimeDays',
    },
    {
        title: 'operation',
        dataIndex: 'operation',
        render: (text, record) => (
            <div>
              <a onClick={() => this.handleUpdateModalVisible(true, record)} disabled={!authority.includes("update.shop.listing.item") }>
                    Update
              </a>
            </div>
          )   
    }
  ];

  componentDidMount() {
        this.getListings();
    }



    getListings = () => {
      const { dispatch } = this.props;
      const { filterCriteria } = this.state;
      dispatch({
        type: 'listing/get',
        query: filterCriteria,
      });
    }



  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      selectedRecord: record || {},
    });
  };


  expandedRowRender = record => {
    return <Table columns={this.ListingItemColumn} dataSource={record.items} pagination={false} />;
  }


  handleUpdate = (id, fields) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'listing/update',
      payload: fields,
      id,
      onSuccess: this.getListings,
    });

    this.handleUpdateModalVisible();
  };


  render() {

    const {
      listing,
      loading,
    } = this.props;

    const {
      updateModalVisible,
      selectedRecord,
    } = this.state;


    const updateMethods = {
      handleModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };


    return (
      <PageHeaderWrapper title="Listing">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
            </div>
            <StandardTable
              loading={loading}
              data={{ list: listing.data  }}
              columns={this.columns}
              expandedRowRender={this.expandedRowRender}
            />
          </div>
        </Card>

        <UpdateForm
          {...updateMethods}
          modalVisible={updateModalVisible}
          record={selectedRecord}
        />
      </PageHeaderWrapper>
    );
  }
}

export default Listing;
