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
  Modal,
  Steps,
  Radio,
  TimePicker,
  Switch,
  InputNumber,
  Tooltip
} from "antd";

import NumericInput from "@/common/NumericInput";

import BusinessHourForm from "@/common/BusinessHourForm"; 

import StandardTable from "@/components/StandardTable";
import PageHeaderWrapper from "@/components/PageHeaderWrapper";

import { Divider } from 'antd';

import styles from "./Area.less";

import { getAuthority } from "@/utils/authority";
import { array } from "prop-types";

const authority = getAuthority();

const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(",");






const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible, areas } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();

      handleAdd(fieldsValue);
    });
  };
  return (
    <Modal
      destroyOnClose
      title="Add"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 15 }} label="NAME">
        {form.getFieldDecorator("name", {
          rules: [
            {
              required: true,
              message: "name is required",
              min: 1
            }
          ]
        })(<Input placeholder="Please Input" />)}
      </FormItem>
      <FormItem
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 15 }}
        label="DESCRIPTION"
      >
        {form.getFieldDecorator("description", {
          rules: [
            {
              required: true,
              message: "At least 1 char!",
              min: 1
            }
          ]
        })(<Input placeholder="Please Input" />)}
      </FormItem>
      <FormItem
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 15 }}
        label="When I Work ID"
      >
        {form.getFieldDecorator("wiwLocationId", {})(
          <Input placeholder="Please Input" />
        )}
      </FormItem>
    </Modal>
  );
});

const checkTimeOffset = (rule, value, callback) => {

  if (value === "NotDefined") {
    callback("Please Choose Time Zone! ")
  } else {
    callback();
    return;
  }

};


class ViolatoinFineConfigurationForm extends PureComponent {

  state = {
    deleteMouseOver: undefined,
  };

   onInputChange = (number, index) => {


    const {value, onChange} = this.props;
  

    const isNumberWith2DigitPrecisionAndlessThan100 = /^\d{0,2}(\.+\d{0,2})?$/;

    if (!isNumberWith2DigitPrecisionAndlessThan100.test(number)) {
      return;
    }


    const newValue = [...value];

    newValue[index] = number === "" ? "0" : ( number.charAt(0) === "0" ? number.substring(1) : number) ;

    onChange(newValue);
 
   }


   indexFormat = (index) => {

        if (index == 1) {
            return "1st"
        } else if (index == 2) {
            return "2nd"
        } else if (index == 3) {
            return "3rd"
        } else {
          return index + "th";
        }

    }


  render = () => {

    const {value, onChange} = this.props;

    const {deleteMouseOver} = this.state;

  
    return <div> 

          

            {
                value.map((item, index) => 
                    <Row  key={index}>
                      <Col span={12}> 
                        {`${this.indexFormat(index + 1)} time violation:`} 
                      </Col> 

                      <Col span={2}> 
                          $
                      </Col>
                
                      <Col span={8}> 
                        <Input 
                          value={item} 
                          onChange={e => this.onInputChange(e.target.value, index)}

                          style= {{display: "inline"}}
                        />

                      </Col> 

                      <Col span={2} > 
                       {index === value.length - 1  &&  index > 0  &&
                          <Icon 
                            type="delete" 
                            
                            style={{marginLeft: "0.5em", color: deleteMouseOver === index ? "red" : undefined }} 
                            
                            onMouseEnter={()=>this.setState({"deleteMouseOver": index})} 

                            onMouseLeave={()=>this.setState({"deleteMouseOver": undefined})} 

                            onClick={()=> {

                              value.pop();

                              onChange(value);

                            }}
                            
                        /> }
                      </Col>

                  </Row>
                )
            }


            <Button type="primary" disabled={value[value.length - 1] === "0"} onClick={()=>onChange(value.concat(["0"]))}> Add </Button>

          </div>
  
    ;
  }




} 

const AreaFeatureForm = Form.create()(props => {
  const { modalVisible, form, handleUpdateAreaFeature, handleModalVisible, areas, record } = props;

  const areaFeatureId = record.areaFeature && record.areaFeature.id;

  const isEditable = authority.includes("update.area.feature" ) && authority.includes("create.area.feature");

  const okHandle = () => {
    if (form.isFieldsTouched())
      form.validateFields((err, fieldsValue) => {
        if (err) return;
          

          const metaData = {}

          if (fieldsValue.timeLimitActivated) {
            metaData.serviceTimeConfig = {};
            metaData.serviceTimeConfig.serviceTime= {};
            metaData.serviceTimeConfig.serviceTime.start = fieldsValue.serviceTimeConfigStart;
            metaData.serviceTimeConfig.serviceTime.end = fieldsValue.serviceTimeConfigEnd;
            metaData.serviceTimeConfig.offset = fieldsValue.serviceTimeOffset;
            metaData.serviceTimeConfig.forceEndRide = fieldsValue.serviceTimeForceEndRide;
          }

          if (fieldsValue.driverLicenseActivated) {
            metaData.licenseConfig = {};
            metaData.licenseConfig.licenseTypes=fieldsValue.licenseConfigTypes;
            metaData.licenseConfig.age=fieldsValue.licenseConfigAge;
          }

          if (fieldsValue.promptActivated) {
            const splitPromts = fieldsValue.promptConfig.split('\n')
            metaData.promptConfig = splitPromts;
          }

          if (fieldsValue.freeTimeActivated) {
            metaData.freeRideConfig = fieldsValue.freeRideConfig;
          }

          if (fieldsValue.violationActivated && form.isFieldTouched("violationConfig")) {
            
            metaData.violationConfig = fieldsValue.violationConfig.map(parseFloat);

          }

          if (fieldsValue.surveyUrl && fieldsValue.surveyUrl !== '') {
            metaData.surveyUrl = fieldsValue.surveyUrl;
          } else {
            metaData.surveyUrl = null;
          }

          if (fieldsValue.taxRate && fieldsValue.taxRate !== '') {
            metaData.taxRate = fieldsValue.taxRate;
          } else {
            metaData.taxRate = null;
          }

          if (fieldsValue.outOfBalancePreAuthorizationFee && fieldsValue.outOfBalancePreAuthorizationFee !== '') {
            metaData.outOfBalancePreAuthorizationFee = fieldsValue.outOfBalancePreAuthorizationFee;
          } else {
            metaData.outOfBalancePreAuthorizationFee = null;
          }

        
          const finalResult = {};
          
          finalResult.areaAvailability = fieldsValue.areaAvailability;
          finalResult.violationActivated = fieldsValue.violationActivated;
          finalResult.isActivated = fieldsValue.isActivated;        
          finalResult.driverLicenseActivated = fieldsValue.driverLicenseActivated;
          finalResult.eduRideActivated = fieldsValue.eduRideActivated;
          finalResult.freeTimeActivated = fieldsValue.freeTimeActivated;
          finalResult.holdRideActivated = fieldsValue.holdRideActivated;
          finalResult.membershipActivated = fieldsValue.membershipActivated;
          finalResult.promptActivated = fieldsValue.promptActivated;
          finalResult.timeLimitActivated = fieldsValue.timeLimitActivated;
          finalResult.endRidePhotoActivated = fieldsValue.endRidePhotoActivated;
          finalResult.maxSpeed = Math.min(fieldsValue.maxSpeed, 15);
          finalResult.billingAddressActivated = fieldsValue.billingAddressActivated;
          finalResult.areaId = record.id;
          finalResult.metaData = Object.keys(metaData).length > 0 ? JSON.stringify(metaData) : null;

          form.resetFields();

          handleUpdateAreaFeature(areaFeatureId, finalResult);
      });
   else 
    handleModalVisible(false);
  };



  const licenseActivated = record.areaFeature && record.areaFeature.driverLicenseActivated;

  const billingAddressActivated = record.areaFeature && record.areaFeature.billingAddressActivated;

  const violationActivated = record.areaFeature && record.areaFeature.violationActivated;

  const eduRideActivated = record.areaFeature && record.areaFeature.eduRideActivated;

  const endRidePhotoActivated = record.areaFeature && record.areaFeature.endRidePhotoActivated;

  const freeTimeActivated = record.areaFeature && record.areaFeature.freeTimeActivated;

  const holdRideActivated = record.areaFeature && record.areaFeature.holdRideActivated;

  const membershipActivated = record.areaFeature && record.areaFeature.membershipActivated;

  const promptActivated = record.areaFeature && record.areaFeature.promptActivated;

  const timeLimitActivated = record.areaFeature && record.areaFeature.timeLimitActivated;

  const maxSpeed = record.areaFeature && record.areaFeature.maxSpeed;

  const areaFeature =  record.areaFeature && record.areaFeature.metaData ? JSON.parse(record.areaFeature.metaData) : undefined;

  const licenseConfigTypes = areaFeature && areaFeature.licenseConfig && areaFeature.licenseConfig.licenseTypes;

  const licenseConfigAge= areaFeature && areaFeature.licenseConfig && areaFeature.licenseConfig.age;

  const serviceStartTime = areaFeature && areaFeature.serviceTimeConfig && areaFeature.serviceTimeConfig.serviceTime.start;

  const serviceEndTime = areaFeature && areaFeature.serviceTimeConfig && areaFeature.serviceTimeConfig.serviceTime.end;

  const serviceTimeOffset = areaFeature && areaFeature.serviceTimeConfig && areaFeature.serviceTimeConfig.offset;

  const serviceTimeForceEndRide = areaFeature && areaFeature.serviceTimeConfig && areaFeature.serviceTimeConfig.forceEndRide;

  const freeRideConfig = areaFeature && areaFeature.freeRideConfig;

  const promptConfig = areaFeature && areaFeature.promptConfig;

  const violationConfig = areaFeature && areaFeature.violationConfig;

  const surveyUrl = areaFeature && areaFeature.surveyUrl;

  const taxRate = areaFeature && areaFeature.taxRate;

  const outOfBalancePreAuthorizationFee = areaFeature && areaFeature.outOfBalancePreAuthorizationFee;

  const areaAvailability = (record.areaFeature  && record.areaFeature.areaAvailability) ? record.areaFeature.areaAvailability : {};


  const isActivated = record.areaFeature && record.areaFeature.isActivated;

  return (
    <Modal
      destroyOnClose
      title="Update Area Feature"
      visible={modalVisible}
      onOk={okHandle}
      okText="Save"
      width="800px"
      onCancel={() => handleModalVisible()}
    >

    <FormItem labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} label="Market Activated">
        {form.getFieldDecorator("isActivated", {
          valuePropName: 'checked',
          initialValue: isActivated ? true : false,
        })(<Switch  disabled={!isEditable} />)}
    </FormItem>

    <FormItem labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} label="Violation Activated">
        {form.getFieldDecorator("violationActivated", {
          valuePropName: 'checked',
          initialValue: violationActivated ? true : false,
        })(<Switch  disabled={!isEditable} />)}
    </FormItem>
    
      {form.getFieldValue("violationActivated") &&

        <FormItem labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} label={<span> Violation Fine Configuration <Tooltip title="Set to 0 to warn customer only. Last violation will automatically freeze customer account."> <Icon type="info-circle" /> </Tooltip> </span>}>
                {
                  form.getFieldDecorator("violationConfig", {
                    initialValue: violationConfig ? violationConfig : ["0.00","25.00","50.00", "75.00"],
                    rules: [{validator: (rule, value, callback) => {


                      for (let index in value) {

                          if (isNaN(value[index])) {
                              callback("Fine must be number!");
                          }

                          const floatValue = parseFloat(value[index]);

                          if (floatValue < 0 || floatValue > 100 ) {

                              callback("the maximun of fine is 100 dollar!");

                          }
                      }

                      return callback();

                      }}
                    ]
                  
                  })(<ViolatoinFineConfigurationForm />)
                }

        </FormItem>
        
      }
   
    <FormItem labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} label="License Check Activated">
        {form.getFieldDecorator("driverLicenseActivated", {
          valuePropName: 'checked',
          initialValue: licenseActivated ? true : false,
        })(<Switch  disabled={!isEditable} />)}
      </FormItem>
      {form.getFieldValue("driverLicenseActivated") && 
          <div>
            <FormItem labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} label="Drive License Types">
              {form.getFieldDecorator("licenseConfigTypes", {
                initialValue: licenseConfigTypes ? licenseConfigTypes : undefined,
                rules: [
                  {
                    required: true,
                    message: "license type is required",
                  }
                ]
              })(
                <Select
                  mode="multiple"
                  style={{width: "70%"}}
                >
                <Option value={0}>
                  Driver License
                </Option>
                <Option value={1}>
                  Id Card
                </Option>
              </Select>

              )}              
            </FormItem>
            <FormItem labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} label="Age">
                {form.getFieldDecorator("licenseConfigAge", {
                    initialValue: licenseConfigAge,
                    rules: [
                      {
                        required: true,
                        message: "age is required",
                      }
                    ]
                })(
                <InputNumber min={1} max={120} />
                )}
            </FormItem>
          </div>
      }
      <FormItem labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} label="Edu Ride Activated">
        {form.getFieldDecorator("eduRideActivated", {
          valuePropName: 'checked',
          initialValue: eduRideActivated ? true : false
        })(<Switch  disabled={!isEditable} />)}
      </FormItem>
      <FormItem labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} label="End Ride Photo Activated">
        {form.getFieldDecorator("endRidePhotoActivated", {
          valuePropName: 'checked',
          initialValue: endRidePhotoActivated ? true : false
        })(<Switch  disabled={!isEditable} />)}
      </FormItem>

      <FormItem labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} label="Membership Activated">
        {form.getFieldDecorator("membershipActivated", {
          valuePropName: 'checked',
          initialValue: (membershipActivated === undefined || membershipActivated) ? true : false
        })(<Switch  disabled={!isEditable}   />)}
      </FormItem>
      
      <FormItem labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} label="Free Time Activated">
        {form.getFieldDecorator("freeTimeActivated", {
          valuePropName: 'checked',
          initialValue: freeTimeActivated ? true : false
        })(<Switch  disabled={!isEditable}  />)}
       
      </FormItem>
      {form.getFieldValue("freeTimeActivated") &&
          <FormItem labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} label="Free Ride Config">
          {form.getFieldDecorator("freeRideConfig", {
            initialValue: freeRideConfig
          })( <InputNumber placeholder="Number of Free Rides" disabled={!isEditable}  /> )}
        </FormItem>
        }
      <FormItem labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} label="Hold Ride Activated">
        {form.getFieldDecorator("holdRideActivated", {
          initialValue: holdRideActivated ? true : false,
          valuePropName: 'checked',
        })(<Switch  disabled={!isEditable}  />)}
      </FormItem>
      <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 15 }} label="Max Speed">
        {form.getFieldDecorator("maxSpeed", {
          initialValue: maxSpeed,
          valuePropName: 'checked'
        })(<InputNumber min={1} max={15} defaultValue={maxSpeed} />)}
      </FormItem>
      <FormItem labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} label="Time Limit Activated">
        {form.getFieldDecorator("timeLimitActivated", {
          initialValue: timeLimitActivated ? true : false,
          valuePropName: 'checked'
        })(<Switch  disabled={true}  />)}
      </FormItem>
     
        {form.getFieldValue("timeLimitActivated") && 
      
          <div>
            <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 15 }} label="SERVICE START">
              {form.getFieldDecorator("serviceTimeConfigStart", {
                initialValue: serviceStartTime ? serviceStartTime : undefined,
                rules: [
                  {
                    required: true,
                    message: "start time is required",
                  }
                ]
              })(<Input placeholder="1230" disabled={true}   />)}
            </FormItem>
            <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 15 }} label="SERVICE END">
              {form.getFieldDecorator("serviceTimeConfigEnd", {
                initialValue: serviceEndTime ? serviceEndTime : undefined,
                rules: [
                  {
                    required: true,
                    message: "end time is required",
                  }
                ]
              })(<Input placeholder="1230" disabled={true}  />)}
            </FormItem>
            <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 15 }} label="TIME ZONE">
              {form.getFieldDecorator("serviceTimeOffset", {
                initialValue: serviceTimeOffset ? serviceTimeOffset : "NotDefined",
                rules: [{
                  validator: checkTimeOffset
                }]
              })(<Select placeholder="-500 for chicago time" disabled={true}  > 
                  <Option value={-400}> Eastern Time Zone</Option>
                  <Option value={-500}> Central Time Zone </Option>
                  <Option value={-600}> Mountain Time Zone</Option>
                  <Option value={-700}> Pacific Time Zone</Option>
                  <Option value="NotDefined"> Not Defined</Option>
              </Select>)}
            </FormItem>
            <FormItem labelCol={{ span: 18 }} wrapperCol={{ span: 6 }} label="Should Force End Ride After Service End">
              {form.getFieldDecorator("serviceTimeForceEndRide", {
                initialValue: serviceTimeForceEndRide ? true : false,
                valuePropName: 'checked',
              })(<Switch  disabled={true}  />)}
            </FormItem>
          </div>
      }


      {/* <FormItem labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} label="Market Operating">
        {form.getFieldDecorator("areaAvailabilityActivated", {
          initialValue: areaAvailability.isOpen  ? true : false,
          valuePropName: 'checked'
        })(<Switch  disabled={!isEditable}  />)}
      </FormItem> */}
     
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Bussiness Hour">
        {form.getFieldDecorator("areaAvailability", {
          initialValue: areaAvailability? areaAvailability : {},
          
          rules: [{validator: (rule, value, callback) => {

             let isValueChanged = false; 
              
            for (let property in value) {
              if (value[property] !== areaAvailability[property]) {

                isValueChanged = true;

                break;
              }              
            }

            


            if (isValueChanged && value.isOpen === null) {

              for (let property in value) {

                if ( property !== "isOpen" && 
                    property !== "description"  && 
                    (!value[property] || value[property] == "")
                )

                  callback(property +  " can't be empty!");

              }

            }

           

            return callback();

            }}
          ] 
        })(<BusinessHourForm />)}
      </FormItem>

      <FormItem labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} label="Billing Address Activated">
        {form.getFieldDecorator("billingAddressActivated", {
          initialValue: !!billingAddressActivated,
          valuePropName: 'checked',
        })(<Switch  disabled={!isEditable}  />)}
      </FormItem>



      <FormItem labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} label="Prompt Activated">
        {form.getFieldDecorator("promptActivated", {
          initialValue: !!promptActivated,
          valuePropName: 'checked',
        })(<Switch  disabled={!isEditable}  />)}
      </FormItem>

      {(form.getFieldValue("promptActivated")) && 
        <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 15 }} label="Prompt Config">
          {form.getFieldDecorator("promptConfig", {
            initialValue: promptConfig && promptConfig.join("\n")
          })( <TextArea autosize={{ minRows: 3, maxRows: 10 }} disabled={!isEditable} />  )}
        </FormItem> 
      }

      <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 15 }} label="Survey Url">
        {form.getFieldDecorator("surveyUrl", {
          initialValue: surveyUrl
        })(<Input   />)}
      </FormItem>

      <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 15 }} label="Tax Rate %">
        {form.getFieldDecorator("taxRate", {
          initialValue: taxRate
        })(<InputNumber min={1} max={99}  />)}
      </FormItem>

      <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 15 }} label="Ride Hold">
        {form.getFieldDecorator("outOfBalancePreAuthorizationFee", {
          initialValue: outOfBalancePreAuthorizationFee
        })(<InputNumber min={1} max={100}  />)}
      </FormItem>
      
      
    </Modal>
  );
});

const UpdateForm = Form.create()(props => {
  const {
    form,
    modalVisible,
    handleUpdate,
    handleModalVisible,
    record
  } = props;
  const okHandle = () => {
    if (form.isFieldsTouched())
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        form.resetFields();

        handleUpdate(record.id, fieldsValue);
      });
    else handleModalVisible();
  };

  return (
    <Modal
      destroyOnClose
      title="Add"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 15 }} label="NAME">
        {form.getFieldDecorator("name", {
          rules: [
            {
              required: true,
              message: "name is required",
              min: 1
            }
          ],
          initialValue: record.name
        })(<Input placeholder="Please Input" />)}
      </FormItem>
      <FormItem
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 15 }}
        label="DESCRIPTION"
      >
        {form.getFieldDecorator("description", {
          rules: [
            {
              required: true,
              message: "At least 1 char!",
              min: 1
            }
          ],
          initialValue: record.description
        })(<Input placeholder="Please Input" />)}
      </FormItem>
      <FormItem
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 15 }}
        label="When I Work ID"
      >
        {form.getFieldDecorator("wiwLocationId", {
          initialValue: record.wiwLocationId
        })(<Input placeholder="Please Input" />)}
      </FormItem>
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
@connect(({ areas, loading }) => ({
  areas,
  loading: loading.models.areas
}))
@Form.create()
class Area extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    detailModalVisible: false,
    expandForm: false,
    selectedRows: [],
    filterCriteria: {},
    selectedRecord: {}
  };

  columns = [
    {
      title: "Name",
      dataIndex: "name"
    },
    {
      title: "Description",
      dataIndex: "description"
    },
    {
      title: "Operation",
      render: (text, record) => (
        <Fragment>
          {authority.includes("update.area.detail") && (
            <a onClick={() => this.handleUpdateModalVisible(true, record)}>
              Update
            </a>
          )}
          <Divider type="vertical" />
          {authority.includes("get.area.features") && <a onClick={() => this.handleDetailModalVisible(true, record)}>
              Detail
          </a>}
        </Fragment>
      )
    }
  ];

  componentDidMount() {
    this.handleGetAreas();
  }

  handleGetAreas = () => {
    const { dispatch } = this.props;
    const { filterCriteria } = this.state;

    dispatch({
      type: "areas/get",
      payload: filterCriteria,
      // onSuccess: this.handleGetAreaFeatures 
    });
  };

  handleGetAreaFeatures = () => {

    const { dispatch } = this.props;

    if (!authority.includes("get.area.features")) {
      return;
    }

    dispatch({
      type: "areas/getAreaFeaturesEffect",
    });

  }

  handleStandardTableChange = (filtersArg, sorter) => {
    const { filterCriteria } = this.state;

    const params = {
      ...filterCriteria
    };

    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    this.setState({ filterCriteria: params }, () => this.handleGetAreas());
  };

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();

    this.setState(
      {
        filterCriteria: {}
      },
      () => this.handleGetAreas()
    );
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;
    const { filterCriteria } = this.state;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = Object.assign({}, filterCriteria, fieldsValue);

      this.setState(
        {
          filterCriteria: values
        },
        () => this.handleGetAreas()
      );
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag
    });
  };

  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      selectedRecord: record || {}
    });
  };

  handleDetailModalVisible = (flag, record) => {

    const { dispatch } = this.props;

    if (flag) {

      dispatch({
        type: "areas/getAreaFeature",
        areaId: record.id,
        onSuccess: feature => {
          record.areaFeature = feature;
          this.setState({
            detailModalVisible: true,
            selectedRecord: record
          });
        }
      });

    } else {

        this.setState({
          detailModalVisible: false,
          selectedRecord: {}
        });
    }
   
  };

  handleDeleteModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      selectedRecord: record || {}
    });
  };

  handleUpdateAreaFeature = (areaFeatureId , areaFeature) => {
    const { dispatch } = this.props;

    const type = `areas/${areaFeatureId ? "updateAreaFeature" : "addAreaFeature"}`;

    dispatch({
      type: type,
      payload: areaFeature,
      id: areaFeatureId,
      onSuccess: this.handleGetAreas
    });

    this.handleDetailModalVisible();

  }

  handleAdd = fields => {
    const { dispatch } = this.props;

    dispatch({
      type: "areas/add",
      payload: fields,
      onSuccess: this.handleGetAreas
    });

    //message.success("Add Success!");
    this.handleModalVisible();
  };

  handleUpdate = (id, fields) => {
    const { dispatch } = this.props;

    dispatch({
      type: "areas/update",
      payload: fields,
      id: id,
      onSuccess: this.handleGetAreas
    });

    this.handleUpdateModalVisible();
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator }
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="Keywords">
              {getFieldDecorator("nameOrDescription")(
                <Input placeholder="name or description" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                Search
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                Reset
              </Button>
            </span>
          </Col>
          
        </Row>
      </Form>
    );
  }

  render() {
    const { areas, loading } = this.props;
    const {
      modalVisible,
      updateModalVisible,
      detailModalVisible,
      selectedRecord
    } = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible
    };
    const updateMethods = {
      handleModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate
    };

    return (
      <PageHeaderWrapper title="Area List">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderSimpleForm()}
            </div>
            <div className={styles.tableListOperator}>
              {authority.includes("create.area") && (
                <Button
                  icon="plus"
                  type="primary"
                  onClick={() => this.handleModalVisible(true)}
                >
                  Add
                </Button>
              )}
            </div>
            <StandardTable
              loading={loading}
              data={{ list: areas.data, pagination: {} }}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm
          {...parentMethods}
          modalVisible={modalVisible}
          areas={areas.data}
        />

        <UpdateForm
          {...updateMethods}
          modalVisible={updateModalVisible}
          record={selectedRecord}
          areas={areas.data}
        />

      <AreaFeatureForm
        modalVisible={detailModalVisible}  
        handleUpdateAreaFeature={this.handleUpdateAreaFeature}
        handleModalVisible={this.handleDetailModalVisible}
        areas={areas.data}
        record ={selectedRecord}
      />
      </PageHeaderWrapper>
    );
  }
}

export default Area;
