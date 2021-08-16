import React, { useState, useEffect } from "react";
import {connect} from 'dva'
import { Form, Input, Button, Checkbox,Drawer,Switch,Rate,Row,Col,Select,Card,InputNumber,TimePicker,Divider,Collapse,Space,Tag,message  }  from "antd";
import { RadiusUprightOutlined,BorderInnerOutlined,BorderOuterOutlined,ExpandOutlined } from '@ant-design/icons';
import styles from "./Areas.less";
import FormItem from "antd/lib/form/FormItem";
import moment from 'moment';

//components
import ViolationFine from './components/violationFine'
import Regulation from './components/regulation'
import Geo from './components/geo'

const Areas = (props) => {
    const { dispatch,selectedAreaId,areas } = props;
    const [formStatus, setFormStatus] = useState();
    const [formDatas, setFormDatas] = useState();
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const [ageEnabled, setAgeEnabled] = useState(false);
    const [bikeLaneEnabled, setBikeLaneEnabled] = useState(false);
    const [areaAvailabilityIsOpenEnabled, setAreaAvailabilityIsOpenEnabled] = useState(false);
    const [freeRideEnabled, setFreeRideEnabled] = useState(false);
    //geo
    const [handleEditCenterData, setHandleEditCenterData] = useState(false);


    const [violationFineDatas, setViolationFineDatas] = useState([]);
    const [regulationDatas, setRegulationDatas] = useState({
      regulations:[],
      displayDuringOnBoarding:false
    });
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
        setFormDatas(null)
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
    if(formDatas){
      if(formDatas.feature &&( formDatas.feature.areaAvailability.weekDay || formDatas.feature.areaAvailability.weekDay)&& (formDatas.feature.areaAvailability.weekDay.start || formDatas.feature.areaAvailability.weekend.start)){
        formDatas.feature.areaAvailability.weekDay = [moment(formDatas.feature.areaAvailability.weekDay.start, format), moment(formDatas.feature.areaAvailability.weekDay.end, format)]
        formDatas.feature.areaAvailability.weekend = [moment(formDatas.feature.areaAvailability.weekend.start, format), moment(formDatas.feature.areaAvailability.weekend.end, format)]
      }
      if(formDatas.feature){
        formDatas.feature.areaAvailability.isOpen == null ? formDatas.feature.areaAvailability.isOpen = 'null': null   //reset isopen null 
        if(formDatas){
          setViolationFineDatas(formDatas.feature.violationFees)
          setRegulationDatas({
            regulations:formDatas.feature.regulation.regulations,
            displayDuringOnBoarding:formDatas.feature.regulation.displayDuringOnBoarding
          })
          setAgeEnabled(formDatas.feature.ageVerification.enabled)
          setFreeRideEnabled(formDatas.feature.freeRide.enabled)
          setAreaAvailabilityIsOpenEnabled((formDatas.feature.areaAvailability.isOpen == true || formDatas.feature.areaAvailability.isOpen == false) ? false:true)
          formDatas.feature.bikeLane?setBikeLaneEnabled(formDatas.feature.bikeLane.enabled):null
        }
        form.setFieldsValue(formDatas)
      }else{
        setRegulationDatas({
          regulations:[],
          displayDuringOnBoarding:false
        })
        setViolationFineDatas([])
        form.resetFields()
      }
    }else{
      setRegulationDatas({
        regulations:[],
        displayDuringOnBoarding:false
      })
      setViolationFineDatas([])
      form.resetFields()
    }
    setIsDrawerVisible(true);
};
  const InputNumberOnChange=(value)=>{
    console.log(value);
  }
  const PanelCallback = (key)=> {
    // console.log(key);
  }
  const onClose = () => {
    setIsDrawerVisible(false);
  };
  const onFinish = (values) => {
    console.log(values);
    let newFormDatas = {
      name:values.name,
      description:values.description,
      feature:{
        center:values.feature.center?{
          lat:values.feature.center.lat,
          lng:values.feature.center.lng,
        }:{
          lat:formDatas?formDatas.feature?formDatas.feature.center.lat:'0':'0',
          lng:formDatas?formDatas.feature?formDatas.feature.center.lng:'0':'0'
        },
        activated:values.feature.activated,
        membershipEnabled:values.feature.membershipEnabled,
        ridePauseEnabled:values.feature.ridePauseEnabled,
        ridePhotoEnabled:values.feature.ridePhotoEnabled,
        billingAddressEnabled:values.feature.billingAddressEnabled,
        taxRate:values.feature.taxRate,
        areaAvailability:{
          isOpen:values.feature.areaAvailability.isOpen == 'null'? null:values.feature.areaAvailability.isOpen,
          timeZone:values.feature.areaAvailability.isOpen == 'null'?values.feature.areaAvailability.timeZone:null,
          weekDay:{
            start:values.feature.areaAvailability.isOpen == 'null' ? values.feature.areaAvailability.weekDay ? `${values.feature.areaAvailability.weekDay[0]._i}`:'0:0':'0:0',
            // end:values.feature.areaAvailability.isOpen == 'null' ? values.feature.areaAvailability.weekDay ?   `${values.feature.areaAvailability.weekDay[1]._d.getHours()}:${values.feature.areaAvailability.weekDay[1]._d.getMinutes()}` :'0:0' :'0:0',
            end:values.feature.areaAvailability.isOpen == 'null' ? values.feature.areaAvailability.weekDay ?   `${values.feature.areaAvailability.weekDay[1]._i}` :'0:0' :'0:0',
          },
          weekend:{
            // start:values.feature.areaAvailability.isOpen == 'null' ? values.feature.areaAvailability.weekend ?  `${values.feature.areaAvailability.weekend[0]._d.getHours()}:${values.feature.areaAvailability.weekend[0]._d.getMinutes()}` :'0:0' :'0:0',
            // end:values.feature.areaAvailability.isOpen == 'null'? values.feature.areaAvailability.weekend ?  `${values.feature.areaAvailability.weekend[1]._d.getHours()}:${values.feature.areaAvailability.weekend[1]._d.getMinutes()}` :'0:0' :'0:0',
            start:values.feature.areaAvailability.isOpen == 'null' ? values.feature.areaAvailability.weekend ?  `${values.feature.areaAvailability.weekend[0]._i}` :'0:0' :'0:0',
            end:values.feature.areaAvailability.isOpen == 'null'? values.feature.areaAvailability.weekend ?  `${values.feature.areaAvailability.weekend[1]._i}` :'0:0' :'0:0',
          },
          description:values.feature.areaAvailability.description,
        },
        ageVerification:{
          enabled:values.feature.ageVerification.enabled,
          age: values.feature.ageVerification.age
        },
        freeRide:{
          enabled:values.feature.freeRide.enabled,
          freeMinutes:values.feature.freeRide.freeMinutes
        },
        regulation:  regulationDatas,
        bikeLane:(!values.feature.bikeLane.enabled && !values.feature.bikeLane.geoJsonPath)?null:{
          enabled:values.feature.bikeLane.enabled,
          geoJsonPath:values.feature.bikeLane.geoJsonPath
        },
        prompts: [
          "string"
        ],
        ridePreAuthFee:values.feature.ridePreAuthFee,
        surveyUrl:values.feature.surveyUrl,
        violationFees:violationFineDatas
      },
    }
    console.log(newFormDatas.feature.areaAvailability.weekDay.start);
    if(!areas.selectedAreaId){
      dispatch({
        type: "areas/addArea",
        payload: {...newFormDatas},
      });
    }else{
      dispatch({
        type: "areas/updateAreaNew",
        areaId:areas.selectedAreaId,
        payload: {...newFormDatas},
      });
    }
    setIsDrawerVisible(false);
  };
  //form action
  const ageOnchange = (value) =>{
    setAgeEnabled(value)
  }
  const bikeLaneOnchange = (value) =>{
    setBikeLaneEnabled(value)
  }
  const areaAvailabilityIsOpenCallback=(value)=>{
    setAreaAvailabilityIsOpenEnabled(false)
    typeof(value) =='string'?setAreaAvailabilityIsOpenEnabled(true):setAreaAvailabilityIsOpenEnabled(false)
  }
  const freeRideOnchange=(value)=>{
    setFreeRideEnabled(value)
  }

  const format = 'HH:mm';
  const setTimePickerDialogZero = (time,timeString)=>{
    console.log(time);
    console.log(timeString);
    time[0]._i = timeString[0]
    time[1]._i = timeString[1]
    console.log(time);
  }
  //components functions
  const getViolationFineDatas=(msg)=>{
    setViolationFineDatas(msg)
  }
  const getRegulationDatas=(msg)=>{
    setRegulationDatas(msg)
  }
  ///geo
  const handleEditCenter=(data)=>{
    setHandleEditCenterData(data)
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
              {/* <Button
                type="primary"
                style={areas.selectedAreaId?{display:'inline-block'}:{display:'none'}}
              >
              <BorderOuterOutlined/>Edit Center
              </Button>
              <Button
                type="primary"
                onClick={()=>{handleEditCenter(true)}}
                style={areas.selectedAreaId?{display:'inline-block'}:{display:'none'}}
              >
              <BorderOuterOutlined/>Add Fence
              </Button>
              <Button
                type="primary"
                style={areas.selectedAreaId?{display:'inline-block'}:{display:'none'}}
              >
              <ExpandOutlined /> Add Vehicle Hub
              </Button> */}
            </Space>
          </Row>
          <Card style={areas.selectedAreaId?{display:'none'}:{display:'inline-block'}}>
            <img src="https://www.veoride.com/wp-content/uploads/2020/03/veo-world-website.png" alt="" style={{width:'100%',opacity:'0.4'}}/>
          </Card>
        </Card>
        <Geo handleEditCenterData ={handleEditCenterData}></Geo>
        <Drawer
          title={formStatus+" Feature"}
          width={'40vw'}
          onClose={onClose}
          visible={isDrawerVisible}
          bodyStyle={{ paddingBottom: 80 }}
        >
          <Form  hideRequiredMark onFinish={onFinish} form={form} 
          initialValues={{
            name:'',
            description:null,
            feature:{
              "membershipEnabled": false,
              billingAddressEnabled:false,
              "ridePhotoEnabled": false,
              "ageVerification": {
                age:null,
                enabled:null
              },
              "freeRide": {

              },
              areaAvailability: {
                  "isOpen": true,
                  "timeZone": null,
                  weekDay: null,
                  weekend:null,
              },
              "center": {
                lat:'0',
                lng:'0'
              },
              "surveyUrl":'',
              "taxRate": ""
          }
          }}
          >
            <Row>
            <Col span={12} >
                <Form.Item 
               {...tailLayout}
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: 'Please input your name!' }]}
                  >
                  <Input/>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item 
                {...tailLayout}
                    label="Description"
                    name="description"
                    rules={[{ required: true, message: 'Please input your description!' }]}
                  >
                  <Input/>
                </Form.Item>
              </Col>
            <Col span={24}>
            <Card title="Area  Basic" type="inner" size="small">
            <Row>
            <Col span={12}>
                <Form.Item  label="Is Activated" {...tailLayout} name={['feature', 'activated']} valuePropName="checked">
                  <Switch size="small"/>
                </Form.Item>
            </Col>
            <Col span={12} >
                <Form.Item
                    {...tailLayout}
                    label="Tax Rate %"
                    name={['feature','taxRate']}
                    rules={[{ required: false, message: 'Please input your tax Rate!' }]}
                  >
                  <InputNumber min={0}/>
                </Form.Item>
            </Col>
            <Col span={12}>
                      <Form.Item  label="Pause Ride" {...tailLayout} name={['feature', 'ridePauseEnabled']} valuePropName="checked">
                        <Switch size="small"/>
                      </Form.Item>
            </Col>  
            <Col span={12}>
                <Form.Item  label="Need Ride Photo" {...tailLayout} name={['feature', 'ridePhotoEnabled']} valuePropName="checked">
                  <Switch size="small"/>
                </Form.Item>
            </Col>
            </Row>
            </Card>
            </Col>
            <Col span={24}>
            <Card title="Age" type="inner" size="small">
            <Row>
            <Col span={12}>
                <Form.Item  label="Need Age Verification" {...tailLayout} name={['feature', 'ageVerification','enabled']} valuePropName="checked">
                  <Switch size="small" onChange={ageOnchange}/>
                </Form.Item>
            </Col>
              {
                formDatas&&
                <Col span={12}>
                <Form.Item  label="Legal Age" {...tailLayout} name={['feature', 'ageVerification','age']}>
                  <InputNumber min={5} disabled={!ageEnabled}/>
                </Form.Item>
            </Col>
              }
            </Row>
            </Card>
            </Col>
            <Col span={24}>
            <Card title="Free Ride Time" type="inner" size="small">
            <Row justify="space-between">
            <Col span={12}>
                <Form.Item  label="Enable Free Ride Time" {...tailLayout} name={['feature','freeRide','enabled']} valuePropName="checked">
                  <Switch size="small" onChange={freeRideOnchange}/>
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item  label="Free Ride Time" {...tailLayout} name={['feature','freeRide','freeMinutes']}>
                  <InputNumber min={1}  disabled={!freeRideEnabled} />
                </Form.Item>
            </Col>
            </Row>
            </Card>
            <Card title="Bike Lane" type="inner" size="small">
              <Row>
              <Col span={12}>
                  <Form.Item  label="Enable Bike Lane" {...tailLayout} name={['feature', 'bikeLane','enabled']} valuePropName="checked">
                    <Switch size="small" onChange={bikeLaneOnchange}/>
                  </Form.Item>
              </Col>
              <Col span={12}>
                  <Form.Item
                      // {...tailLayout}
                      label="S3 File Path"
                      name={['feature','bikeLane','geoJsonPath']}
                      rules={[{ required: false, message: 'Please input your bike lane path' }]}
                    >
                    <Input disabled={!bikeLaneEnabled}/>
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
                  rules={[{ required: false, message: 'please choose the status' }]}
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
                  rules={[{ required: false, message: 'please choose the status' }]}
                >
                  <Select placeholder="choose" disabled={!areaAvailabilityIsOpenEnabled} style={{width:'100%'}}>
                    <Select.Option value="US/Eastern">Eastern</Select.Option>
                    <Select.Option value="US/Central">Central</Select.Option>
                    <Select.Option value="US/Mountain">Mountain</Select.Option>
                    <Select.Option value="US/Pacific">Pacific</Select.Option>
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
                  <TimePicker.RangePicker  bordered={false} size="small"  disabled={!areaAvailabilityIsOpenEnabled} format={format} onChange = {setTimePickerDialogZero}/>
                </Form.Item>
              </Col>
              <Col span={12} offset={1}>
                <Form.Item
                  name={['feature','areaAvailability','weekend']}
                  label="Weekend"
                  rules={[{ required: false, message: 'Please choose the dateTime' }]}
                >
                  <TimePicker.RangePicker size="small" bordered={false} disabled={!areaAvailabilityIsOpenEnabled} format={format} onChange = {setTimePickerDialogZero}/>
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
                  <Divider>GoogleMap Configuration</Divider>
                  <Col span={12} >
                        <Form.Item 
                      {...tailLayout}
                            label="position lat"
                            name={['feature','center','lat']}
                            rules={[{ required: false, message: 'Please input your lat!' }]}
                          >
                          <Input/>
                        </Form.Item>
                      </Col>
                      <Col span={12} >
                        <Form.Item 
                      {...tailLayout}
                            label="position lng"
                            name={['feature','center','lng']}
                            rules={[{ required: false, message: 'Please input your lng!' }]}
                          >
                          <Input/>
                        </Form.Item>
                      </Col>
                      <Divider>other Configuration</Divider>
                      <Col span={12}>
                        <Form.Item  label="Enable Membership" {...tailLayout} name={['feature', 'membershipEnabled']} valuePropName="checked">
                          <Switch size="small"/>
                        </Form.Item>
                      </Col>              
                      <Col span={12}>
                          <Form.Item  label="Enable Billing Address" {...tailLayout} name={['feature', 'billingAddressEnabled']} valuePropName="checked">
                            <Switch size="small"/>
                          </Form.Item>
                      </Col>
                      <Col span={12}>
                          <Form.Item  label="Enable Ride Pre-Auth Fee" {...tailLayout} name={['feature', 'ridePreAuthFee']}>
                            <InputNumber min={1} max={245}/>
                          </Form.Item>
                      </Col>   
                      <Col span={12} >
                        <Form.Item 
                      {...tailLayout}
                            label="Survey Url"
                            name={['feature','surveyUrl']}
                            rules={[{ required: false, message: 'Please input your Survey Url!' }]}
                          >
                          <Input/>
                        </Form.Item>
                      </Col>
                    </Row>
                    <Col span={24}>
                    <Divider>Regulation Configuration</Divider>
                      <Row>
                      <Regulation data={regulationDatas} getRegulationDatas={getRegulationDatas.bind(this)}></Regulation>
                      </Row>
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
