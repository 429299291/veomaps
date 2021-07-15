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

/* eslint react/no-multi-comp:0 */
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
              <a onClick={() => this.handleUpdateModalVisible(true, record)} disabled={!authority.includes("shop") }>
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
    const UpdateForm = ((props) => {
      const {
        modalVisible,
        // handleUpdate,
        handleModalVisible,
        currentUser,
        record,
      } = props;
      const [form] = Form.useForm()
      form.setFieldsValue(record)
      const okHandle = () => {
        form.submit()
      };
      const handleUpdate = (id, fields) => {
        const { dispatch } = this.props;
        fields={
          availability:fields.availability,
          leadTimeDays:fields.leadTimeDays,
          listingItemStatus:fields.status,
        }
        dispatch({
          type: 'listing/update',
          payload: fields,
          id,
          onSuccess: this.getListings,
        });
    
        this.handleUpdateModalVisible();
      };
    
    
      return (
        <Modal
          destroyOnClose
          title="Detail"
          visible={modalVisible}
          onOk={okHandle}
          forceRender
          width={"30%"}
          onCancel={() => handleModalVisible()}
        >
          <Form form={form} onFinish={()=>{handleUpdate(record.id, form.getFieldsValue(true))}}>
                    <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="Description">
                        <div> {record.description} </div>
                    </FormItem>
    
                    <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="Type">
                        <div> {record.type} </div>
                    </FormItem>
    
                    <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="Price">
                        <div> {record.price} </div>
                    </FormItem>
    
    
                    <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="Availability" name='availability' rules={[{ validator: checkNumberFormat }]}>
                    <Input placeholder="Please Input" />
                    </FormItem>
    
                    <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="Lead Time in Days" name='leadTimeDays' rules={[{ validator: checkNumberFormat }]}>
                    <Input placeholder="Please Input" />
                    </FormItem>
    
                    <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="Status" name='status'>
                    <Select
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
                        {/* <Option key={2} value="SOLD_OUT">
                          SOLD_OUT
                        </Option> */}
                        <Option key={3} value="SOLD_OUT">
                          SOLD_OUT
                        </Option>
                      </Select>
                    </FormItem>
                    </Form>
        </Modal>
      );
    });
    

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
const mapStateToProps = ({ listing, loading }) => {
  return {
    listing,
    loading: loading.models.listing
  }
}
export default connect(mapStateToProps)(Listing) 