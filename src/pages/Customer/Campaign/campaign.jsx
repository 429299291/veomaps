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
  message,
  Divider,
  Modal,
  InputNumber,
  DatePicker
} from "antd";
const { RangePicker } = DatePicker;
import StandardTable from "@/components/StandardTable";
import PageHeaderWrapper from "@/components/PageHeaderWrapper";
import { getAuthority } from "@/utils/authority";
import {formatPhoneNumber} from "@/utils/utils"
const authority = getAuthority();
import styles from "./campaign.less";
const Option = Select.Option;
const UpdateDetail = (props) => {
    const [form] = Form.useForm()
    const {handleupdateVisible,recordData,dispatch,addOrUpdate,recordId,selectedAreaId} = props
    if(addOrUpdate){
      form.resetFields()
    }else{
      console.log(recordData);
      const newUpdataData = {
        amount:recordData.amount,
        category:recordData.category,
        segment:recordData.segment,
        begin:moment(recordData.begin,"YYYY-MM-DD HH:mm" ),
        expiration:moment(recordData.expiration,"YYYY-MM-DD HH:mm" )
      }
      console.log(newUpdataData);
      form.setFieldsValue(newUpdataData)
    }
    // props.addOrUpdate ? form.resetFields() : form.setFieldsValue(recordData)
    const handleCancel = () => {
        handleupdateVisible(false);
    };
    const onFinish = (values) => {
        values.segment.areaId = selectedAreaId
        handleupdateVisible(false);
        if(props.addOrUpdate){
          dispatch({
            type: "campaign/add",
            payload:{
             ... values
            },
            onSuccess: props.handleGetCampaigns
          });
        }else{
          values.id = recordId
          dispatch({
            type: "campaign/update",
            payload:{
             ... values
            },
            onSuccess: props.handleGetCampaigns
          });
        }
      };
    
    const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
    };
    const timeOnOk=(value)=> {
      console.log('onOk: ', value);
    }
    return (
        <Modal title={props.addOrUpdate?'Add Campaign':'Update Campaign'} getContainer={false} visible={props.updateVisible} getContainer={false} footer={null} onCancel={handleCancel}>
              <Form
                name="basic"
                // labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                initialValues={{ }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                form={form}
                >
                <Form.Item
                    label="Category"
                    name="category"
                    rules={[{ required: true, message: 'Please input your category!' }]}
                >
                        <Select style={{ width: 120 }}>
                          <Option value="DISCOUNT">DISCOUNT</Option>
                          <Option value="FREE_RIDE">FREE RIDE</Option>
                          <Option value="FREE_UNLOCK">FREE UNLOCK</Option>
                        </Select>
                </Form.Item>
                <Form.Item
                    label="Amount"
                    name="amount"
                    rules={[{ required: true, message: 'Please input your amount!' }]}
                >
                    <InputNumber min={0}/>
                </Form.Item>
                <Form.Item  label="Inactive Days" name={['segment','inactiveDays']} rules={[{ required: true, message: 'Please input your Inactive Days!' }]}>
                  <InputNumber min={1} />
                </Form.Item>
                <Form.Item  label="Percentage" name={['segment','percentage']} rules={[{ required: true, message: 'Please input your Percentage!' }]}>
                  <InputNumber min={1} max={100}/>
                </Form.Item>
                <Form.Item  label="Min RideCount" name={['segment','minRideCount']} rules={[{ required: true, message: 'Please input your Min RideCount!' }]}>
                  <InputNumber min={1}/>
                </Form.Item>
                <Form.Item  label="Max RideCount" name={['segment','maxRideCount']} rules={[{ required: true, message: 'Please input your Max RideCount!' }]}>
                  <InputNumber min={1}/>
                </Form.Item>
                <Form.Item label="begin" name="begin" rules={[{ required: true, message: 'Please input your begin time!' }]}>
                  <DatePicker showTime format="YYYY-MM-DD HH:mm"/>
                </Form.Item>
                <Form.Item label="expiration" name="expiration" rules={[{ required: true, message: 'Please input your expiration time!' }]}>
                  <DatePicker showTime format="YYYY-MM-DD HH:mm"/>
                </Form.Item>
                <Row className={styles.submit}> 
                  <Button onClick={handleCancel} style={{ marginRight: 8 }}>
                    Cancel
                  </Button>
                    <Button type="primary" htmlType="submit" 
                    >
                      Submit
                    </Button>
                </Row>
                </Form>
        </Modal>
    );
  };
  
/* eslint react/no-multi-comp:0 */
class Campaign extends PureComponent {
  state = {
    updateVisible:false,
    addOrUpdate:true,
    recordId:null,
    recordData:null,
    campaignData:null,
    totalSize:null,
    filterCriteria: { 
      pagination:{
        page: 0, 
        pageSize: 10,
        sort:{
          sortBy:'created',
          direction:'desc'
        }
    } 
  },
  };
  columns = [
    {
      title: "Category",
      dataIndex: "category",
    },
    {
      title: "Description",
      dataIndex: "description",
    },
    {
      title: "Amount",
      dataIndex: "amount",
    },
    {
      title: "Created",
      dataIndex: "created",
      render: val => <span>{moment(val).format("YYYY-MM-DD HH:mm:ss")}</span>
    },
    {
      title: "Begin",
      dataIndex: "begin",
      render: val => <span>{moment(val).format("YYYY-MM-DD HH:mm:ss")}</span>
    },
    {
      title: "Expiration",
      dataIndex: "expiration",
      render: val => <span>{moment(val).format("YYYY-MM-DD HH:mm:ss")}</span>
    },
    {
        title: 'Action',
        dataIndex: '',
        key: 'x',
        render: (text, record) => (
        <span><a onClick={
            ()=>{
                this.handleupdateVisible(true)
                this.setState({addOrUpdate:false})
                this.setState({recordId:record.id})
                this.setState({recordData:record})
            }
        }>Update</a>
        {/* <Divider  type="vertical" />
        <a onClick={()=>{
            this.props.dispatch({
                type: "rides/violationRideDetail",
                id: record.id,
                onSuccess: result => this.handleVisible(true, result)
                });
        }}>Delete</a> */}
        </span>
        ),
      },
  ];

  componentDidMount() {
    this.handleGetCampaigns();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {

    if (prevProps.selectedAreaId !== this.props.selectedAreaId) {
      this.handleGetCampaigns();
    }
  }
  handleGetCampaigns = ()=>{
    const { dispatch } = this.props;
    dispatch({
      type: "campaign/get",
      payload:{
        areaId:this.props.selectedAreaId,
        ...this.state.filterCriteria
      },
      onSuccess: this.getDatas
    });
  }
  handleStandardTableChange = (pageData, sorter) => {
    const { filterCriteria } = this.state;
    this.setState({ filterCriteria: {
      ...filterCriteria,
      pagination:{
        ...filterCriteria.pagination,
        page:pageData.current-1,
        pageSize:pageData.pageSize,      }
    } }, () => this.handleGetCampaigns());
  };
  getDatas = (data,page,pageSize,totalSize)=>{
    this.setState({
      campaignData :data,
      filterCriteria:{
        pagination:{
          page:page,
          pageSize:pageSize,
        }
      },
      totalSize:totalSize
    })
  }
  handleupdateVisible=(data)=>{
    this.setState({updateVisible:data})
  }
  render() {
    const {loading} = this.props;
    const {campaignData,filterCriteria,totalSize} = this.state;
    return (
      <PageHeaderWrapper title="Notification List">
        <Card bordered={false}>
        <Button type="primary" onClick={()=>{this.setState({updateVisible:true,addOrUpdate:true})}}>Add Campaign</Button>
          <div className={styles.tableList}>
            <StandardTable
              loading={loading}
              data={{ list:campaignData, pagination: {
                current:filterCriteria.pagination.page +1,
                total:totalSize,
                showTotal: ((totalSize) => {
                  return `count: ${totalSize}`;
                })
              }}}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <UpdateDetail Refresh Failed addOrUpdate={this.state.addOrUpdate} dispatch={this.props.dispatch} updateVisible= {this.state.updateVisible} handleupdateVisible={this.handleupdateVisible} recordId={this.state.recordId} recordData={this.state.recordData} handleGetCampaigns={this.handleGetCampaigns} selectedAreaId={this.props.selectedAreaId}></UpdateDetail>
      </PageHeaderWrapper>
    );
  }
}
const mapStateToProps = ({loading, areas }) => {
  return {
    selectedAreaId: areas.selectedAreaId,
    loading: loading.models.notifications
    }
}
export default connect(mapStateToProps)(Campaign) 