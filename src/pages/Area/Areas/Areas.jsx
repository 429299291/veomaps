import React, { useState, useEffect } from "react";
import {connect} from 'dva'
import { Form, Input, Button, Checkbox,Drawer,Switch,Rate,Row,Col,Select,Card,InputNumber,TimePicker,Divider,Collapse,Space,Tag  }  from "antd";
import { RadiusUprightOutlined,BorderInnerOutlined,BorderOuterOutlined,ExpandOutlined } from '@ant-design/icons';
import styles from "./Areas.less";
import FormItem from "antd/lib/form/FormItem";
//components
import ViolationFine from './components/violationFine'

const Areas = (props) => {
    const { dispatch,selectedAreaId,areas } = props;
    const [formStatus, setFormStatus] = useState();
    const [formDatas, setFormDatas] = useState(false);
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const [ageEnabled, setAgeEnabled] = useState(false);
    const [areaAvailabilityIsOpenEnabled, setAreaAvailabilityIsOpenEnabled] = useState(false);
    const [freeRideEnabled, setFreeRideEnabled] = useState(false);

    const [violationFineDatas, setViolationFineDatas] = useState(['0']);
    // const [violationFineIndex, setViolationFineIndex] = useState(0);
    const [form] = Form.useForm();
    const { Panel } = Collapse;
    useEffect(() => {
      if(areas.selectedAreaId){
        setFormStatus('Edit Area')
        dispatch({
          type: "areas/getAreasAll",
          payload: {areaId:areas.selectedAreaId},
        });
        
      }else{
        setFormDatas({})
        setFormStatus('Add Area')
      }

   }, [areas.selectedAreaId])
   useEffect(() => {
    setFormDatas(areas.newArea)
 }, [areas.newArea])
//////  Modal  update feature
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset:1, span: 14},
};
  const showDrawer =  () => {
    console.log(formDatas);
    if(formDatas.name){
      form.setFieldsValue(formDatas)
    }else{
      form.resetFields()
    }
    setIsDrawerVisible(true);
};
  const InputNumberOnChange=(value)=>{
    console.log(value);
  }
  const PanelCallback = (key)=> {
    console.log(key);
  }
  const onClose = () => {
    setIsDrawerVisible(false);
  };
  const onFinish = (values) => {
    let formDatas = {      
      name:values.name,
      description:values.description,
      feature:{
        center:{
          lat:22,
          lng:66,
        },
        regulation: {
          displayDuringOnBoarding: true,
          regulations: [
            {
              title: "string",
              content: "string",
              position: 0,//排序
            }
          ]
        },
      },
      prompts: [
        "string"
      ],
      activated:values.feature.activated,
      ageVerification:{
        enabled:values.ageVerification,
        age: values.ageVerificationAge
      },
      areaAvailability:{
        isOpen:values.areaAvailability.isOpen == 'null'? null:values.areaAvailability.isOpen,
        timeZone:values.areaAvailability.isOpen == 'null'?values.areaAvailability.timeZone:null,
        weekDay:{
          start:values.areaAvailability.isOpen == 'null'?`${values.areaAvailability.weekDay[0]._d.getHours()}:${values.areaAvailability.weekDay[0]._d.getMinutes()}`:null,
          end:values.areaAvailability.isOpen == 'null'?   `${values.areaAvailability.weekDay[1]._d.getHours()}:${values.areaAvailability.weekDay[1]._d.getMinutes()}` :null,
        },
        weekend:{
          start:values.areaAvailability.isOpen == 'null'?  `${values.areaAvailability.weekend[0]._d.getHours()}:${values.areaAvailability.weekend[0]._d.getMinutes()}`  :null,
          end:values.areaAvailability.isOpen == 'null'?  `${values.areaAvailability.weekend[1]._d.getHours()}:${values.areaAvailability.weekend[1]._d.getMinutes()}`  :null,
        },
        description:values.areaAvailability.description,
      },
      billingAddressEnabled:values.billingAddressEnabled,
      freeRide:{
        enabled:values.freeRide.enabled,
        freeMinutes:values.freeRide.freeMinutes
      },
      membershipEnabled:values.membershipEnabled,
      ridePauseEnabled:values.ridePauseEnabled,
      ridePhotoEnabled:values.ridePhotoEnabled,
      ridePreAuthFee:values.ridePreAuthFee,
      surveyUrl:values.surveyUrl,
      taxRate:values.taxRate,
      violationFees:violationFineDatas
    }
    console.log(formDatas);
    dispatch({
      type: "areas/addArea",
      payload: {...formDatas},
    });
  };
  //form action
  const ageOnchange = (value) =>{
    setAgeEnabled(value)
  }
  const areaAvailabilityIsOpenCallback=(value)=>{
    setAreaAvailabilityIsOpenEnabled(false)
    typeof(value) =='string'?setAreaAvailabilityIsOpenEnabled(true):setAreaAvailabilityIsOpenEnabled(false)
    console.log(areaAvailabilityIsOpenEnabled);
  }
  const freeRideOnchange=(value)=>{
    setFreeRideEnabled(value)
  }

  const format = 'HH:mm';

  //components functions
  const getViolationFineDatas=(msg)=>{
    setViolationFineDatas(msg)
  }
    return (
      <>
        <Card bordered={false} size="small">
        <Row>
        <Space size='middle'>
        <Button
          type="primary"
          onClick={showDrawer}
        >
        <BorderInnerOutlined style={areas.selectedAreaId?{display:'none'}:{display:'inline-block'}}/><RadiusUprightOutlined style={areas.selectedAreaId?{display:'inline-block'}:{display:'none'}}/> {formStatus}
        </Button>
        <Button
          type="primary"
          style={areas.selectedAreaId?{display:'inline-block'}:{display:'none'}}
        >
        <BorderOuterOutlined />Add Vehicle Hub
        </Button>
        <Button
          type="primary"
          style={areas.selectedAreaId?{display:'inline-block'}:{display:'none'}}
        >
        <ExpandOutlined /> Add Fence
        </Button>
        </Space>
        </Row>
        </Card>
        <Drawer
          title="Update Area Feature"
          width={'30vw'}
          onClose={onClose}
          visible={isDrawerVisible}
          bodyStyle={{ paddingBottom: 80 }}
        >
          <Form  hideRequiredMark onFinish={onFinish} form={form} 
          initialValues={{
            name:'',
            description:'',
          }}
          >
            <Row>
            <Col span={12} >
                <Form.Item 
               {...tailLayout}
                    label="area name"
                    name="name"
                    rules={[{ required: true, message: 'Please input your name!' }]}
                  >
                  <Input/>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item 
                {...tailLayout}
                    label="description"
                    name="description"
                    rules={[{ required: false, message: 'Please input your description!' }]}
                  >
                  <Input/>
                </Form.Item>
              </Col>
              {/* <Divider plain>area  control</Divider> */}
            <Col span={24}>
            <Card title="area  control" type="inner" size="small">
            <Row>
            <Col span={12}>
                <Form.Item  label="Market" {...tailLayout} name={['feature', 'activated']} valuePropName="checked">
                  <Switch checked={formDatas.feature?formDatas.feature.activated :false} size="small"/>
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item  label="member Check" {...tailLayout} name={['feature', 'membershipEnabled']} valuePropName="checked">
                  <Switch checked={formDatas.feature?formDatas.feature.activated :false} size="small"/>
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item  label="Hold Ride" {...tailLayout} name={['feature', 'ridePauseEnabled']} valuePropName="checked">
                  <Switch checked={formDatas.feature?formDatas.feature.activated :false} size="small"/>
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item  label="ride photo Check" {...tailLayout} name={['feature', 'ridePhotoEnabled']} valuePropName="checked">
                  <Switch checked={formDatas.feature?formDatas.feature.activated :false} size="small"/>
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item  label="billing Address" {...tailLayout} name={['feature', 'billingAddressEnabled']} valuePropName="checked">
                  <Switch checked={formDatas.feature?formDatas.feature.activated :false} size="small"/>
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item  label="ridePre Auth Fee" {...tailLayout} name={['feature', 'ridePreAuthFee']}>
                  <InputNumber min={1} max={245}/>
                </Form.Item>
            </Col>
            </Row>
            </Card>
            </Col>
            <Col span={24}>
            <Card title="age control" type="inner" size="small">
            <Row>
            <Col span={12}>
                <Form.Item  label="age verification" {...tailLayout} name={['feature', 'ageVerification']} valuePropName="checked">
                  <Switch checked={formDatas.feature?formDatas.feature.activated :false} size="small" onChange={ageOnchange}/>
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item  label="age" {...tailLayout} name={['feature', 'ageVerificationAge']}>
                  <InputNumber min={15} max={45}  disabled={formDatas.feature?!formDatas.feature.activated :true} disabled={!ageEnabled}/>
                </Form.Item>
            </Col>
            </Row>
            </Card>
            </Col>
            <Col span={24}>
            <Card title="Ride Time control" type="inner" size="small">
            <Row justify="space-between">
            <Col span={12}>
                <Form.Item  label="Ride Time" {...tailLayout} name={['feature','freeRide','enabled']} valuePropName="checked">
                  <Switch checked={formDatas.feature?formDatas.feature.activated :false} size="small" onChange={freeRideOnchange}/>
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item  label="Free Ride" {...tailLayout} name={['feature','freeRide','freeMinutes']}>
                  <InputNumber min={1} max={245}  disabled={!freeRideEnabled} />
                </Form.Item>
            </Col>
            </Row>
            </Card>
            </Col>
            </Row>

            <Form.Item>
              {({ getFieldValue }) =>
                getFieldValue('feature')  (
                  <Form.Item name="activated" label="Customize Gender" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                ) 
              }
            </Form.Item>

            <Col span={24}>
              <Card title="Violation Fine Configuration" type="inner" size="small">
                <Row>
                  <ViolationFine tags={violationFineDatas} getViolationFineDatas={getViolationFineDatas.bind(this)}></ViolationFine>
                </Row>
              </Card>
            </Col>
            <Col span={24}>
            <Card title="Bussiness Hour" type="inner" size="small">
            <Row justify="space-between">
            <Col span={11}>
                <Form.Item
                  name={['feature','areaAvailability','isOpen']}
                  label="is Open Now"
                  rules={[{ required: true, message: 'Please choose the approver' }]}
                >
                  <Select placeholder="choose"  onChange={areaAvailabilityIsOpenCallback}>
                    <Select.Option value={true}>true</Select.Option>
                    <Select.Option value={false}>false</Select.Option>
                    <Select.Option value='null'>curfew</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name={['feature','areaAvailability','timeZone']}
                  label="Time Zone"
                  rules={[{ required: false, message: 'Please choose the approver' }]}
                >
                  <Select placeholder="choose" disabled={!areaAvailabilityIsOpenEnabled}>
                    <Select.Option value="US/Eastern">Eastern Time Zone</Select.Option>
                    <Select.Option value="US/Central">Central Time Zone</Select.Option>
                    <Select.Option value="US/Mountain">Mountain Time Zone</Select.Option>
                    <Select.Option value="US/Pacific">Pacific Time Zone</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              </Row>
              <Row>
              <Col span={11}>
                <Form.Item
                  name={['feature','areaAvailability','weekDay']}
                  label="Weekday"
                  rules={[{ required: false, message: 'Please choose the dateTime' }]}
                >
                  <TimePicker.RangePicker disabled={!areaAvailabilityIsOpenEnabled} format={format}/>
                </Form.Item>
              </Col>
              <Col span={12} offset={1}>
                <Form.Item
                  name={['feature','areaAvailability','weekend']}
                  label="Weekend"
                  rules={[{ required: false, message: 'Please choose the dateTime' }]}
                >
                  <TimePicker.RangePicker disabled={!areaAvailabilityIsOpenEnabled} format={format}/>
                </Form.Item>
              </Col>
              <Col span={24}>
                <FormItem name={['feature','areaAvailability','description']}>
                  <Input placeholder="Hour Description" allowClear/>
                </FormItem>
              </Col>
              </Row>
            </Card>
            </Col>
              <Col span={24} className={styles.submit}>
                <Collapse defaultActiveKey={['0']} onChange={PanelCallback}>
                  <Panel header="show more control" key="1">
                  <Row>
                    <Col span={12} >
                        <Form.Item 
                      {...tailLayout}
                            label="Survey Url"
                            name={['feature','surveyUrl']}
                            rules={[{ required: false, message: 'Please input your name!' }]}
                          >
                          <Input/>
                        </Form.Item>
                      </Col>
                      <Col span={12} >
                        <Form.Item 
                      {...tailLayout}
                            label="Tax Rate %"
                            name={['feature','taxRate']}
                            rules={[{ required: false, message: 'Please input your name!' }]}
                          >
                          <Input/>
                        </Form.Item>
                      </Col>
                    </Row>
                  </Panel>
                </Collapse>
              </Col>

              <Row className={styles.submit}> 
              <Button onClick={onClose} style={{ marginRight: 8 }}>
                 Cancel
              </Button>
              <Form.Item {...tailLayout}>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
              </Row>
          </Form>
        </Drawer>
      </>
    )
}
const mapStateToProps = ({areas}) => {
  return {
      areas,
  }
}
export default connect(mapStateToProps)(Areas) 