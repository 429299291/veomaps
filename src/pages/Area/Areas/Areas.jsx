import React, { useState, useEffect } from "react";
import {connect} from 'dva'
import { Form, Input, Button, Checkbox,Drawer,Switch,Rate,Row,Col,Select,Card,InputNumber,TimePicker,Divider,Collapse,Space,Tag  }  from "antd";
import { RadiusUprightOutlined,BorderInnerOutlined,BorderOuterOutlined,ExpandOutlined } from '@ant-design/icons';
import styles from "./Areas.less";
import FormItem from "antd/lib/form/FormItem";
//components
import ViolationFine from './components/violationFine'
import Regulation from './components/regulation'

const Areas = (props) => {
    const { dispatch,selectedAreaId,areas } = props;
    const [formStatus, setFormStatus] = useState();
    const [formDatas, setFormDatas] = useState(false);
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const [ageEnabled, setAgeEnabled] = useState(false);
    const [areaAvailabilityIsOpenEnabled, setAreaAvailabilityIsOpenEnabled] = useState(false);
    const [freeRideEnabled, setFreeRideEnabled] = useState(false);

    const [violationFineDatas, setViolationFineDatas] = useState(['0']);
    const [regulationDatas, setRegulationDatas] = useState([{title:'test1',content:'test for regulations',position:1}]);
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
    console.log(values);
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
          regulations: regulationDatas
        },
      },
      prompts: [
        "string"
      ],
      activated:values.feature.activated,
      ageVerification:{
        enabled:values.feature.ageVerification,
        age: values.feature.ageVerificationAge
      },
      areaAvailability:{
        isOpen:values.feature.areaAvailability.isOpen == 'null'? null:values.feature.areaAvailability.isOpen,
        timeZone:values.feature.areaAvailability.isOpen == 'null'?values.feature.areaAvailability.timeZone:null,
        weekDay:{
          start:values.feature.areaAvailability.isOpen == 'null'?`${values.feature.areaAvailability.weekDay[0]._d.getHours()}:${values.feature.areaAvailability.weekDay[0]._d.getMinutes()}`:null,
          end:values.feature.areaAvailability.isOpen == 'null'?   `${values.feature.areaAvailability.weekDay[1]._d.getHours()}:${values.feature.areaAvailability.weekDay[1]._d.getMinutes()}` :null,
        },
        weekend:{
          start:values.feature.areaAvailability.isOpen == 'null'?  `${values.feature.areaAvailability.weekend[0]._d.getHours()}:${values.feature.areaAvailability.weekend[0]._d.getMinutes()}`  :null,
          end:values.feature.areaAvailability.isOpen == 'null'?  `${values.feature.areaAvailability.weekend[1]._d.getHours()}:${values.feature.areaAvailability.weekend[1]._d.getMinutes()}`  :null,
        },
        description:values.feature.areaAvailability.description,
      },
      billingAddressEnabled:values.feature.billingAddressEnabled,
      freeRide:{
        enabled:values.feature.freeRide.enabled,
        freeMinutes:values.feature.freeRide.freeMinutes
      },
      membershipEnabled:values.feature.membershipEnabled,
      ridePauseEnabled:values.feature.ridePauseEnabled,
      ridePhotoEnabled:values.feature.ridePhotoEnabled,
      ridePreAuthFee:values.feature.ridePreAuthFee,
      surveyUrl:values.feature.surveyUrl,
      taxRate:values.feature.taxRate,
      violationFees:violationFineDatas
    }
    if(!areas.selectedAreaId){
      dispatch({
        type: "areas/addArea",
        payload: {...formDatas},
      });
    }else{
      dispatch({
        type: "areas/updateAreaNew",
        areaId:areas.selectedAreaId,
        payload: {...formDatas},
      });
    }
    setIsDrawerVisible(false);
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
  const getRegulationDatas=(msg)=>{
    setRegulationDatas(msg)
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
            <Col span={24}>
            <Card title="area  control" type="inner" size="small">
            <Row>
            <Col span={12}>
                <Form.Item  label="Market" {...tailLayout} name={['feature', 'activated']} valuePropName="checked">
                  <Switch size="small"/>
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item  label="member Check" {...tailLayout} name={['feature', 'membershipEnabled']} valuePropName="checked">
                  <Switch size="small"/>
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item  label="Hold Ride" {...tailLayout} name={['feature', 'ridePauseEnabled']} valuePropName="checked">
                  <Switch size="small"/>
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item  label="ride photo Check" {...tailLayout} name={['feature', 'ridePhotoEnabled']} valuePropName="checked">
                  <Switch size="small"/>
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item  label="billing Address" {...tailLayout} name={['feature', 'billingAddressEnabled']} valuePropName="checked">
                  <Switch size="small"/>
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
                  <Switch size="small" onChange={ageOnchange}/>
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
                  <Switch size="small" onChange={freeRideOnchange}/>
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
                    <Col span={24}>
                    <Card title="Violation Fine Configuration" type="inner" size="small">
                      <Row>
                        <Regulation tags={regulationDatas} getRegulationDatas={getRegulationDatas.bind(this)}></Regulation>
                      </Row>
                    </Card>
                  </Col>

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