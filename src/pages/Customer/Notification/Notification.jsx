import React, { PureComponent, Fragment,useState } from "react";
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
  DatePicker,
  Switch,
  Slider
} from "antd";
const { RangePicker } = DatePicker;
import StandardTable from "@/components/StandardTable";
import PageHeaderWrapper from "@/components/PageHeaderWrapper";
import { getAuthority } from "@/utils/authority";
import {formatPhoneNumber} from "@/utils/utils"
const authority = getAuthority();
const types = ["NOTICE","REMINDER","ANNOUNCEMENT"]
import styles from "./Notification.less";
const Option = Select.Option;
const UpdateDetail = (props) => {
    const [form] = Form.useForm()
    const [phoneOnChangeVisible, setPhoneOnChangeVisible] = useState(false); 
    const {handleupdateVisible,recordData,dispatch,addOrUpdate,recordId,selectedAreaId} = props
    if(addOrUpdate){
      phoneOnChangeVisible ? null : form.resetFields()
      // form.resetFields()
    }else{
      const newUpdataData = {
        title:recordData.title,
        text:recordData.text,
        begin:moment(recordData.begin,"YYYY-MM-DD HH:mm" ),
        expire:moment(recordData.expire,"YYYY-MM-DD HH:mm" )
      }
      form.setFieldsValue(newUpdataData)
    }
    // props.addOrUpdate ? form.resetFields() : form.setFieldsValue(recordData)
    const handleCancel = () => {
        handleupdateVisible(false);
    };
    const onFinish = (values) => {
      if(values.segment){
        values.segment.phone ? values.segment.areaId = null : values.segment.areaId = selectedAreaId
      }
        let requestData
        handleupdateVisible(false);
        if(props.addOrUpdate){
          if(values.segment.rideCount){
            values.segment.minRideCount = values.segment.rideCount[0]
            values.segment.maxRideCount = values.segment.rideCount[1]
            delete values.segment.rideCount
          }
          dispatch({
            type: "notification/add",
            payload:{
             ... values
            },
            onSuccess: props.handleGetNotifications
          }).then(()=>{setPhoneOnChangeVisible(false)});
        }else{
          values.id = recordId
          dispatch({
            type: "notification/update",
            payload:{
             ...values
            },
            onSuccess: props.handleGetNotifications
          }).then(()=>{setPhoneOnChangeVisible(false)});
        }
      };
    
    const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
    };
    const phoneOnChange = (val)=>{
      val ? setPhoneOnChangeVisible(true) :setPhoneOnChangeVisible(false)
    }
    const timeOnOk=(value)=> {
      console.log('onOk: ', value);
    }
    return (
        <Modal title={props.addOrUpdate?'Add Campaign':'Update Campaign'} getContainer={false} visible={props.updateVisible} getContainer={false} footer={null} onCancel={handleCancel}>
              <Form
                name="basic"
                // labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                initialValues={{pushNotification:false,}}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                form={form}
                >
                {/* <Form.Item
                    label="Category"
                    name="category"
                    rules={[{ required: true, message: 'Please input your category!' }]}
                >
                    {addOrUpdate ? 
                    <Select style={{ width: 120 }}>
                    {types.map((interval, index) => (
                    <Option key={index} value={index}>
                        {interval}
                    </Option>
                    ))}
                </Select>
                :null   
                }
                </Form.Item> */}
                {addOrUpdate &&
                        <Form.Item
                        label="Category"
                        name="category"
                        rules={[{ required: true, message: 'Please input your category!' }]}
                    >
                    <Select style={{ width: 120 }}>
                    {types.map((interval, index) => (
                    <Option key={index} value={interval}>
                        {interval}
                    </Option>
                    ))}
                </Select>
                </Form.Item>
                }
                {addOrUpdate && 
                  <Form.Item
                      label="Push Notification"
                      name="pushNotification"
                  >
                      <Switch/>
                  </Form.Item>
                }
                <Form.Item
                    label="Title"
                    name="title"
                    rules={[{ required: true, message: 'Please input your title!' }]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    label="Text"
                    name="text"
                    rules={[{ required: true, message: 'Please input your text!' }]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item label="begin" name="begin" rules={[{ required: true, message: 'Please input your begin time!' }]}>
                  <DatePicker showTime format="YYYY-MM-DD HH:mm"/>
                </Form.Item>
                <Form.Item label="expire" name="expire" rules={[{ required: true, message: 'Please input your expire time!' }]}>
                  <DatePicker showTime format="YYYY-MM-DD HH:mm"/>
                </Form.Item>
                {addOrUpdate && 
                <Form.Item
                    label="phone"
                    name={["segment","phone"]}
                >
                    <InputNumber min={1000000000} max={9999999999} style={{ width: 150 }} onChange={phoneOnChange}/>
                </Form.Item>                
                }
                {addOrUpdate && 
                <Form.Item
                    label="Inactive Days"
                    name={["segment","inactiveDays"]}
                >
                    <InputNumber min={0} max={999} style={{ width: 150 }} disabled={phoneOnChangeVisible}/>
                </Form.Item>                
                }
                {addOrUpdate && 
                <Form.Item
                    label="Percentage"
                    name={["segment","percentage"]}
                >
                    <InputNumber min={0} max={100} style={{ width: 150 }} disabled={phoneOnChangeVisible}/>
                </Form.Item>                
                }
                {addOrUpdate && 
                <Form.Item
                    label="Ride Count"
                    name={["segment","rideCount"]}
                >
                    <Slider range max={50} disabled={phoneOnChangeVisible}/>
                </Form.Item>                
                }
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
      title: "Title",
      dataIndex: "title",
    },
    {
      title: "Text",
      dataIndex: "text",
    },
    {
      title: "Push Notification",
      dataIndex: "pushNotification",
      render:val => <span>{val ? "true" : "false"}</span>
    },
    {
      title: "Begin",
      dataIndex: "begin",
      render: val => <span>{moment(val).format("YYYY-MM-DD HH:mm:ss")}</span>
    },
    {
      title: "Expire",
      dataIndex: "expire",
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
    this.handleGetNotifications();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {

    if (prevProps.selectedAreaId !== this.props.selectedAreaId) {
      this.handleGetNotifications();
    }
  }
  handleGetNotifications = ()=>{
    const { dispatch } = this.props;
    dispatch({
      type: "notification/get",
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
    } }, () => this.handleGetNotifications());
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
        <UpdateDetail Refresh Failed addOrUpdate={this.state.addOrUpdate} dispatch={this.props.dispatch} updateVisible= {this.state.updateVisible} handleupdateVisible={this.handleupdateVisible} recordId={this.state.recordId} recordData={this.state.recordData} handleGetNotifications={this.handleGetNotifications} selectedAreaId={this.props.selectedAreaId}></UpdateDetail>
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