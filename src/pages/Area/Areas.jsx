import React, { useState, useEffect } from "react";
import {connect} from 'dva'
import { Form, Input, Button, Checkbox,Drawer,Switch,Rate,Row,Col,Select,DatePicker,Card,InputNumber}  from "antd";
import { RadiusUprightOutlined,BorderInnerOutlined } from '@ant-design/icons';
import styles from "./Areas.less";
const Areas = (props) => {
    const { dispatch,selectedAreaId,areas } = props;
    const [formStatus, setFormStatus] = useState();
    const [formDatas, setFormDatas] = useState(false);
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    useEffect(() => {
      if(areas.selectedAreaId>0){
        console.log(areas.newArea);
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
////  ADD button
//////  Modal  update feature

  const showDrawer = () => {
    setFormDatas(areas.newArea)
    setIsDrawerVisible(true);
};
  const InputNumberOnChange=(value)=>{
    console.log(value);
  }

  const onClose = () => {
    setIsDrawerVisible(false);
};
    return (
      <>
        <Card bordered={false}>
          <Button
                  type="primary"
                  onClick={showDrawer}
                >
                <BorderInnerOutlined style={areas.selectedAreaId?{display:'none'}:{display:'inline-block'}}/><RadiusUprightOutlined style={areas.selectedAreaId?{display:'inline-block'}:{display:'none'}}/> {formStatus}
                </Button>
        </Card>
        <Drawer
          title="Update Area Feature"
          width={720}
          onClose={onClose}
          visible={isDrawerVisible}
          bodyStyle={{ paddingBottom: 80 }}
          footer={
            <div
              style={{
                textAlign: 'right',
              }}
            >
              <Button onClick={onClose} style={{ marginRight: 8 }}>
                Cancel
              </Button>
              <Button onClick={onClose} type="primary">
                Submit
              </Button>
            </div>
          }
        >
          <Form layout="vertical" hideRequiredMark>
            <Row gutter={0}>
              <Col span={12}>
                <Form.Item name="switch" label="Market Activated" labelCol={{ span: 12 }} wrapperCol={{ span: 12 }}>
                  <Switch checked={formDatas.feature?formDatas.feature.activated :false} size="small"/>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="switch" label="License Check Activated" valuePropName="checked" labelCol={{ span: 12 }} wrapperCol={{ span: 12 }}>
                  <Switch checked={formDatas.feature?formDatas.feature.activated :false} size="small"/>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="switch" label="Violation Activated" valuePropName="checked" labelCol={{ span: 12 }} wrapperCol={{ span: 12 }}>
                  <Switch checked={formDatas.feature?formDatas.feature.activated :false} size="small"/>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="switch" label="Edu Ride Activated" valuePropName="checked" labelCol={{ span: 12 }} wrapperCol={{ span: 12 }}>
                  <Switch checked={formDatas.feature?formDatas.feature.activated :false} size="small"/>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="switch" label="End Ride Photo Activated" valuePropName="checked" labelCol={{ span: 12 }} wrapperCol={{ span: 12 }}>
                  <Switch checked={formDatas.feature?formDatas.feature.activated :false} size="small"/>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="switch" label="Membership Activated" valuePropName="checked" labelCol={{ span: 12 }} wrapperCol={{ span: 12 }}>
                  <Switch checked={formDatas.feature?formDatas.feature.activated :false} size="small"/>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="switch" label="Free Time Activated" valuePropName="checked" labelCol={{ span: 12 }} wrapperCol={{ span: 12 }}>
                  <Switch checked={formDatas.feature?formDatas.feature.activated :false} size="small"/>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="switch" label="Free Time Activated" valuePropName="checked" labelCol={{ span: 12 }} wrapperCol={{ span: 12 }}>
                <InputNumber min={1} max={10} defaultValue={3} onChange={InputNumberOnChange} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="approver"
                  label="Approver"
                  rules={[{ required: true, message: 'Please choose the approver' }]}
                >
                  <Select placeholder="Please choose the approver">
                    <Option value="jack">Jack Ma</Option>
                    <Option value="tom">Tom Liu</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="dateTime"
                  label="DateTime"
                  rules={[{ required: true, message: 'Please choose the dateTime' }]}
                >
                  <DatePicker.RangePicker
                    style={{ width: '100%' }}
                    getPopupContainer={trigger => trigger.parentElement}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="description"
                  label="Description"
                  rules={[
                    {
                      required: true,
                      message: 'please enter url description',
                    },
                  ]}
                >
                  <Input.TextArea rows={4} placeholder="please enter url description" />
                </Form.Item>
              </Col>
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