import React, { useState, useEffect } from "react";
import {connect} from 'dva'
import { Form, Input, Button, Checkbox,Card,Modal,Switch,Rate  }  from "antd";
import PageHeaderWrapper from "@/components/PageHeaderWrapper";
const Areas = (props) => {
    const { dispatch,selectedAreaId,areas } = props;
    const [AreaId, setAreaId] = useState();
    const [formDatas, setFormDatas] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    useEffect(() => {
      dispatch({
        type: "areas/getAreasAll",
        payload: {areaId:areas.selectedAreaId || 1},
      });
   }, [areas.selectedAreaId])  
////  ADD button
   const showModal=()=>{
    setFormDatas(areas.newArea)
    setIsModalVisible(true);
   }
   const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
//////  Modal  update feature
const layout = {
  labelcol: { span: 8 },
  wrappercol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

  const onFinish = (values) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
    return (
      <PageHeaderWrapper title="Area List">
        <Card bordered={false}>
          <Button
                  icon="plus"
                  type="primary"
                  onClick={showModal}
                >
                  ADD
                </Button>
        </Card>
        <Modal title="Basic Modal" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
          <Form
        {...layout}
        name="basic"
        initialValues={{
          'input-number': 3,
          'checkbox-group': ['A', 'B'],
          'rate': 3.5,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input value={formDatas.name} />
        </Form.Item>
        <Form.Item name="switch" label="Switch" valuePropName="checked">
          <Switch checked={true}/>
        </Form.Item>
        <Form.Item name="rate" label="Rate">
        <Rate />
      </Form.Item>


        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
      </Modal>
      </PageHeaderWrapper>
    )

}

const mapStateToProps = ({areas}) => {
  return {
      areas,
  }
}
export default connect(mapStateToProps)(Areas) 