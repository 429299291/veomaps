import React, { PureComponent, Fragment,useState,useEffect } from "react";
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
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
  Steps,
  Radio,
  Upload,
  TimePicker,
  Checkbox,
  Spin
} from "antd";

import reqwest from "reqwest";

import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';


import PageHeaderWrapper from "@/components/PageHeaderWrapper";

import {fenceType, fenceTypeColor} from "@/constant";

import NumberInput from "@/components/share/NumberInput";

const FormItem = Form.Item;



import { compose, withProps } from "recompose";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  Polyline,
  Polygon,
  Circle
} from "react-google-maps";

import { getAuthority } from "@/utils/authority";

const authority = getAuthority();
import styles from "./Geo.less";



const defaultCenter = { lat: 41.879658, lng: -87.629769 };


class DynamicFenceConfigForm extends PureComponent {



   onRangePickerChange = timeRange => {
    triggerChange({timeRange});
   }


  onCheckboxChange = index => {

  }

  onTimezoneChange = timeRange => { 
    this.triggerChange({timeRange});
  }

  triggerChange = changedValue => {
    const { onChange, value } = this.props;
    if (onChange) {
      onChange({
        ...value,
        ...changedValue,
      });
    }
  };

  getTimePicker = (field, subField) => {
      const {value} = this.props;


      return <TimePicker  
                placeholder={subField}
                onChange={
                 
                  val =>  {

                    const newFeildVal = {};
                    
                    newFeildVal[field] = value[field];
                        console.log('---'+value[field]);
                    newFeildVal[field][subField] = val ? val.format("HH:mm") : null;
                        console.log('newFeildVal'+newFeildVal);
                    this.triggerChange(newFeildVal);
                  }
                }
                format="HH:mm" 
              />
  }


  render = () => {
    const {value, onChange} = this.props;
    return <div>

              <Row> 
                    <Col span={4}> 
                        Weekday: 
                    </Col> 
                    <Col span={8}> 
                      {this.getTimePicker("weekDayDTO", "start")}
                    </Col>  
                    <Col span={1}> ~ </Col> 
                    <Col span={8}> 
                      {this.getTimePicker("weekDayDTO", "end")}
                    </Col>  
                    
              </Row>

              <Row>
                    <Col span={4}> 
                        Weekend: 
                    </Col> 
                    <Col span={8}> 
                      {this.getTimePicker("weekendDTO", "start")}
                    </Col>  
                    <Col span={1}> ~ </Col> 
                    <Col span={8}> 
                    {this.getTimePicker("weekendDTO", "end")}
                    </Col> 
                
              </Row>

  

              <Row> 
              <Col span={6}> Time Zone: </Col>
              <Col span={12}> 
                  <Select 
                  // defaultValue={value.timeZone ? value.timeZone : undefined} 
                  onChange={val => this.triggerChange({timeZone: val})} style={{width: "100%"}}>
                    <Select.Option key={1} value="US/Pacific"> Pacific Standard Time </Select.Option>
                    <Select.Option key={2}  value="US/Mountain"> Mountain Standard Time </Select.Option>
                    <Select.Option key={3} value="US/Central"> Central Standard Time </Select.Option>
                    <Select.Option key={4} value="US/Eastern"> Eastern Standard Time </Select.Option>
                  </Select>

              </Col>  


              </Row>
            </div>

  
  
    ;
  }




} 

const MyMapComponent = compose(
  withProps({
    googleMapURL:
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyDdCuc9RtkM-9wV9e3OrULPj67g2CHIdZI&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `600px` }} />,
    mapElement: <div style={{ height: `100%` }} />
  }),
  withScriptjs,
  withGoogleMap
)(props => {
  const {
    center,
    fences,
    primeLocations,
    onMapClick,
    isEditingCenter,
    editingCenter,
    isEditingFence,
    editingFence,
    isEditingFenceClosed,
    handleExistedFenceClick,
    isEditingPrimeLocation,
    editingPrimeLocation,
    setCircleRef,
    handleExistedPrimeLocationClick,
    selectedExistedPrimeLocation,
    selectedGeoObject
  } = props;

  const centerToRender =
    isEditingCenter && editingCenter ? editingCenter : center;

  const path = !!(isEditingFence && editingFence)
    ? editingFence.fenceCoordinates
    : [];


  const dashLineDot = {
    path: window.google.maps.SymbolPath.CIRCLE,
    fillOpacity: 1,
    scale: 2
  };

  return (
    <GoogleMap
      defaultZoom={11}
      center={center ? center : defaultCenter}
      onClick={onMapClick}
    >
      {centerToRender && <Marker position={centerToRender} />}
      {isEditingFence &&
        editingFence &&
        !isEditingFenceClosed && (
          <Polyline
            path={path}
            geodesic={true}
            options={{
              strokeColor: fenceTypeColor[editingFence.fenceType],
              strokeOpacity: 0.75,
              strokeWeight: 2
            }}
          />
        )}
        {isEditingPrimeLocation &&
        editingPrimeLocation && (
          <Circle
            center={editingPrimeLocation.center}
            //default 5 meters radius of prime location
            radius={editingPrimeLocation.radius}
            editable={true}
            ref={setCircleRef}
            options={{
              fillColor: "#ff9d00",
              strokeColor: '#ff9d00',
              strokeOpacity: 2,
              strokeWeight: 2,
              zIndex: 1
            }}
          />
        )}
        {
          primeLocations.map(
            circle => selectedExistedPrimeLocation && selectedExistedPrimeLocation.id === circle.id ? undefined : <Circle
              center={circle.center}
              radius={circle.radius}
              key={circle.id}
              
              onClick={onMapClick}
              options={{
                fillColor: circle.turnedOn ? "#169902" : '#e81e1e',
                strokeColor: circle.turnedOn ?  '#169902' : '#e81e1e',
                strokeOpacity: 0.9,
                strokeWeight: 2
              }}
            />)
        }
        
      {isEditingFenceClosed && (
        <Polygon
          path={path}
          geodesic={true}
          options={{
            strokeColor: fenceTypeColor[editingFence.fenceType],
            strokeOpacity: 0.75,
            strokeWeight: 2,
            fillColor: fenceTypeColor[editingFence.fenceType],
            fillOpacity: editingFence.fenceType == 0 ? 0 : 0.35,
            zIndex: 0
          }}
        />
      )}

      {fences.map(fence => (
        <Polygon
          path={fence.fenceCoordinates}
          geodesic={true}
          key={fence.id}
          onClick={onMapClick}
          options={{
            strokeColor: fenceTypeColor[fence.fenceType],
            strokeOpacity: fence.fenceType === 5 ? 0 : (fence.turnedOn ? 0.75 : 0.2),
            strokeWeight: fence.fenceType === 5 ? 0 : 2,
            fillColor: fenceTypeColor[fence.fenceType],
            fillOpacity:
              fence.fenceType === 0 || fence.fenceType === 5 ? 0 : (fence.turnedOn ? 0.35 : 0.1) 
          }}
        />
      ))}

      {fences.filter(fence => fence.fenceType === 5).map(fence => (
        <Polyline
          path={fence.fenceCoordinates}
          geodesic={true}
          key={fence.id}
          options={{
            strokeColor: fenceTypeColor[fence.fenceType],
            strokeOpacity: 0.75,
            strokeWeight: 2,
            icons: [
              {
                icon: dashLineDot,
                offset: "0",
                repeat: "10px"
              }
            ],
            fillColor: fenceTypeColor[5],
            fillOpacity: 0
          }}
        />
      ))}

    
    </GoogleMap>
  );
});

const CreateFenceForm = (props => {
  const {
    modalVisible,
    handleNext,
    handleModalVisible,
    editingFence,
    selectedExistedFence
  } = props;
  const [form] = Form.useForm()
  const [currFenceType, setCurrFenceType] = useState();
  if(!props.editingFence||props.editingFence == false){
    form.resetFields()
  }
  useEffect(() => {
    selectedExistedFence?setCurrFenceType(selectedExistedFence.fenceType):null
 }, [selectedExistedFence])
  selectedExistedFence ?  form.setFieldsValue(selectedExistedFence):null
  const okHandle = () => {
      const fieldsValue = form.getFieldsValue(true)
      if (Array.isArray(fieldsValue.vehicleTypes) && fieldsValue.vehicleTypes.length === 0 ) {
        fieldsValue.vehicleTypes = undefined;
      }

      if (Array.isArray(fieldsValue.forceVehicleTypes) && fieldsValue.forceVehicleTypes.length === 0) {
        fieldsValue.forceVehicleTypes = undefined;
      }

      handleNext(fieldsValue);
  };
  // let isGeoFence = currFenceType === 0 || currFenceType === 5;
  const fenceHandleChange = (value) =>{
    // setCurrFenceType(value)

  }

  const fence = selectedExistedFence ? selectedExistedFence : editingFence;

  // const currFenceType = form.getFieldValue("fenceType");

  const nullToUndefined = value => value ? value : undefined;

  return (
    <Modal
      destroyOnClose
      title={`${fence ? "Edit" : "Add"} Fence`}
      visible={modalVisible}
      forceRender
      onOk={okHandle}
      width={700}
      onCancel={() => handleModalVisible(false)}
    >
      <Form form={form}>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Name"
        name='name'
        rules={
          [
            {
              required: true,
              message: "At least 1 character!",
              min: 1
            }
          ]
        }
      >
        <Input placeholder="Please Input" />
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Activated"
        name='turnedOn'
      >
        <Select placeholder="select" style={{ width: "100%" }}>
           <Select.Option key={true} value={true}>
              True
            </Select.Option>
            <Select.Option key={false} value={false}>
              False
            </Select.Option>
      </Select>
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Active Time" name='activeTimeRange'
      initialValue= {(fence && fence.activeTimeRange) ? fence.activeTimeRange : {weekDayDTO: {start: null, end: null}, weekendDTO: {start: null, end: null}, timeZone: null}}
      >
        <DynamicFenceConfigForm />
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Note" name='note'>
        <Input placeholder="Please Input" />
      </FormItem>
      {fenceType && (
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="Fence Type"
          name='fenceType'
          rules={
            [
              {
                required: true,
                message: "You have pick a fence type"
              }
            ]
          }
        >
            <Select placeholder="select" style={{ width: "100%" }} onChange={fenceHandleChange}>
              {fenceType.map((fence, index) => (
                <Select.Option key={index} value={index}>
                  {fence}
                </Select.Option>
              ))}
            </Select>
        </FormItem>
      )}

        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) => prevValues.fenceType !== currentValues.fenceType}
        >
          {({ getFieldValue }) =>
            (getFieldValue('fenceType') == 0 || getFieldValue('fenceType') == 5) ? (
              <FormItem
              labelCol={{ span: 10 }}
              wrapperCol={{ span: 10 }}
              label="Has Forced Parking"
              name='hasForce'
              rules={
                [
                  {
                    required: true,
                    message: "You have to define if have forced parking area"
                  }
                ]
              }
            >
                <Select placeholder="select" style={{ width: "100%" }}>
                  <Select.Option key={1} value={true}>
                    Yes
                  </Select.Option>
                  <Select.Option key={0} value={false}>
                    No
                  </Select.Option>
                </Select>
            </FormItem>
            ) : null
          }
        </Form.Item>
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) => prevValues.fenceType !== currentValues.fenceType}
        >
          {({ getFieldValue }) =>
                <FormItem
                labelCol={{ span: 10 }}
                wrapperCol={{ span: 10 }}
                name={(getFieldValue('fenceType') == 0 || getFieldValue('fenceType') == 5) ? "forceVehicleTypes" : "vehicleTypes"}
                label={((getFieldValue('fenceType') == 0 || getFieldValue('fenceType') == 5)? "Force " : "") + "Vehicle Type"}
              >
                  <Select placeholder="select" style={{ width: "100%" }} mode="multiple">
                    <Option value={0}>Bike</Option>
                    <Option value={1}>Scooter</Option>
                    <Option value={2}>E-Bike</Option>
                    <Option value={3}>COSMO</Option>
                    {/* <Option value={0}>Bike</Option>
                    <Option value={1}>Scooter</Option>
                    <Option value={2}>E-Bike</Option>
                    <Option value={3}>COSMO</Option> */}
                  </Select>
              </FormItem>
            }
          </Form.Item>
      </Form>
    </Modal>
  );
});
class geo extends PureComponent {
  state = {
    addFenceModalVisible: false,
    updateFenceModalVisible: false,
    deleteFenceModalVisible: false,
    isEditingFence: false,
    isEditingCenter: false,
    editingCenter: null,
    editingFence: null,
    isEditingFenceClosed: false,
    isEditingFenceModalVisible: false,
    selectedExistedFence: null,
    isDeleteModalVisible: false,
    isParkingCheckStart: false
  };

  componentDidMount() {
    if (this.props.selectedAreaId){
      this.getAreaGeoInfoFirst();
    }
  }

  getAreaGeoInfo = () => {
    const areaId = this.props.selectedAreaId;
    const { dispatch,areas } = this.props;
    this.cancelEditing();
    dispatch({
      type: "areas/getAreasAll",
      // areaId: areaId
      payload: {areaId},
    });
    dispatch({
      type: "geo/getFences",
      areaId: areaId
    });

    // dispatch({
    //   type: "geo/getPrimeLocations",
    //   areaId: areaId
    // });
  };
  getAreaGeoInfoFirst = () => {
    const areaId = this.props.selectedAreaId;
    const { dispatch,areas } = this.props;
    this.cancelEditing();
    dispatch({
      type: "geo/getFences",
      areaId: areaId
    });
  };
  checkParking = newPoint => {
    const {
      isParkingCheckStart
    } = this.state;

    const { dispatch } = this.props;

    const areaId = this.props.selectedAreaId;

    if (isParkingCheckStart) {
      
      dispatch({
        type: "geo/examineParkingTest",
        areaId: areaId,
        imei: 14682004256896,
        location: newPoint 
      });

    }
    
  }

  checkPrimeLocation = point => {
    const {
        selectedAreaId,
        dispatch
    } = this.props;


      dispatch({
        type: "geo/checkPrimeLocation",
        areaId: selectedAreaId,
        payload: point
      })
  }

  onNewGeoObject = (e, result)  => {

    if (!result) return;

    if (result.geoObjectType === 'FENCE') {
      this.handleExistedFenceClick(e,  result.data)
    } else if (result.geoObjectType === 'HUB') {
      this.handleExistedPrimeLocationClick(e,  result.data)
    }

  }

  handleMapClick = e => {
    const {
      isEditingCenter,
      isEditingFence,
      editingFence,
      selectedExistedFence,
      isEditingPrimeLocation
    } = this.state;

    const {
      selectedAreaId,
      dispatch
  } = this.props;

    const areaId = this.props.selectedAreaId;

    const newPoint = { lat: e.latLng.lat(), lng: e.latLng.lng() };

    //this.checkParking(newPoint);

    //this.checkPrimeLocation(newPoint);

    if (isEditingCenter) {
      this.setState({ editingCenter: newPoint });
    } else if (isEditingFence) {
      this.setState({
        editingFence: {
          ...this.state.editingFence,
          fenceCoordinates: editingFence.fenceCoordinates.concat([newPoint])
        }
      });
    }else if (isEditingPrimeLocation) {
      this.setState({
        editingPrimeLocation: {
          center: newPoint,
          radius: 5
        }
      })
    } else if (selectedExistedFence) {
      this.setState({ selectedExistedFence: null });
    } else {

      dispatch({
        type: "geo/fetchGeoObject",
        areaId: selectedAreaId,
        lat: newPoint.lat,
        lng: newPoint.lng,
        onNewGeoObject: (geoObject) => this.onNewGeoObject(e, geoObject)
      })

    }
  };

  handleEditCenter = isEditing => {
    this.setState({ isEditingCenter: isEditing });
  };

  handleCreateFence = isEditing => {
    this.setState({
      isEditingFence: isEditing,
      isEditingFenceModalVisible: isEditing
    });
  };

  handleCreatePrimeLocation = isEditing => {
    this.setState({
      isEditingPrimeLocation: isEditing,
      isEditingFenceModalVisible: false,
    });
  }

  cancelEditing = () => {
    this.setState({
      isEditingFence: false,
      isEditingPrimeLocation: false,
      isEditingCenter: false,
      editingFence: null,
      editingCenter: null,
      isEditingFenceClosed: false,
      selectedExistedFence: null,
      selectedExistedPrimeLocation: null,
      isEditingFenceModalVisible: false,
      isDeleteModalVisible: false,
      isEditingPrimeLocation: false,
      editingPrimeLocation: null
    });
  };

  setCircleRef = ref => this.cricelRef = ref;

  handleCreateFenceNextStep = values => {
    const { selectedAreaId } = this.props;
    values.fenceCoordinates = [];
    values.areaId = selectedAreaId;
    this.setState({ isEditingFenceModalVisible: false, editingFence: values });
  };

  handleCreateFenceModalVisible = () => {
    this.setState({ isEditingFenceModalVisible: false });
    this.cancelEditing();
  };

  handleEncloseEditingFence = () => {
    this.setState({ isEditingFenceClosed: true });
  };


  handleGetPrimeLocations = () => {
    
  };


  handleSave = () => {
    const {
      isEditingFence,
      isEditingCenter,
      isEditingPrimeLocation,
      editingFence,
      editingCenter,
      editingPrimeLocation,
      selectedExistedPrimeLocation,
    } = this.state;
    const { dispatch, areaFeature, selectedAreaId } = this.props;

    if (isEditingCenter) {
      if (areaFeature) {
        const newArea = Object.assign({}, areaFeature,{areaId:selectedAreaId});
        newArea.center = editingCenter;
        dispatch({
          type: "geo/updateCenter",
          payload: newArea,
          onSuccess: this.getAreaGeoInfo,
          onError: this.cancelEditing
        });
      } else {
        dispatch({
          type: "geo/addCenter",
          payload: { areaId: selectedAreaId, center: editingCenter },
          onSuccess: this.getAreaGeoInfo,
          onError: this.cancelEditing
        });
      }
    }

    if (isEditingFence) {
      editingFence.fenceCoordinates.push(editingFence.fenceCoordinates[0]);
      dispatch({
        type: "geo/addFence",
        payload: Object.assign({}, editingFence, {areaId: selectedAreaId}) ,
        onSuccess: this.getAreaGeoInfo
      });
    }

    if (isEditingPrimeLocation) {

      const circle = this.cricelRef.state.__SECRET_CIRCLE_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;

      if (selectedExistedPrimeLocation) {

        dispatch({
          type: "geo/updatePrimeLocation",
          payload: Object.assign({}, {
            id: selectedExistedPrimeLocation.id, 
            center: {lat: circle.center.lat(), lng: circle.center.lng()}, 
            radius:  Math.round(circle.radius), 
            minimum: selectedExistedPrimeLocation.minimum,
            target: selectedExistedPrimeLocation.target,
            description: selectedExistedPrimeLocation.description,      
            parkingBonus: selectedExistedPrimeLocation.parkingBonus,
            turnedOn: selectedExistedPrimeLocation.turnedOn,
            priority: selectedExistedPrimeLocation.priority,
            areaId : selectedAreaId
          }) ,
          onSuccess: this.getAreaGeoInfo
        });

      } else {

        dispatch({
          type: "geo/addPrimeLocation",
          payload: Object.assign({}, {center: {lat: circle.center.lat(), lng: circle.center.lng()}, radius:  Math.round(circle.radius), areaId : selectedAreaId}) ,
          onSuccess: this.getAreaGeoInfo
        });

      }

      



    }


  };


  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.selectedAreaId !== this.props.selectedAreaId && this.props.selectedAreaId) {
        this.getAreaGeoInfo();
    }
  }

  beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Image must smaller than 5MB!');
    }
    return isJpgOrPng && isLt5M;
  }

  getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ hubUploadLoading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      this.getBase64(info.file.originFileObj, hubUploadImageUrl =>{
        this.setState({
          hubUploadImageUrl,
          hubUploadLoading: false,
          uploadFileData: info.file.originFileObj
        })
      }
      );
    }
  };



  handleUpdateFence = updatedFence => {
    const { dispatch } = this.props;

    dispatch({
      type: "geo/updateFence",
      id: updatedFence.id,
      payload: updatedFence,
      onSuccess: this.getAreaGeoInfo,
      onError: this.cancelEditing
    });
  };

  handleExistedFenceClick = (event, fence) => {
    const { isEditingCenter, isEditingFence, isEditingPrimeLocation } = this.state;

    if (!isEditingCenter && !isEditingFence && !isEditingPrimeLocation ) {
      this.setState({ selectedExistedFence: fence, selectedExistedPrimeLocation: null});
      const newPoint = { lat: event.latLng.lat(), lng: event.latLng.lng() };
      this.checkParking(newPoint);
    } else if (fence.fenceType === 0 || fence.fenceType === 5 || isEditingPrimeLocation) {
      this.handleMapClick(event);
    }
  };

  handleExistedPrimeLocationClick = (event, primeLocation) => {
    const { isEditingCenter, isEditingFence, isEditingPrimeLocation} = this.state;
    const {dispatch } = this.props;


    if (!isEditingCenter && !isEditingFence && !isEditingPrimeLocation) {

      this.setState({ 
        selectedExistedPrimeLocation: primeLocation, 
        isEditingPrimeLocation: true,
        selectedExistedFence: null, 
        editingPrimeLocation: {center: primeLocation.center, radius: primeLocation.radius  }  
      });
      //this.handleMapClick(event);
    } 
  };

  handleUndoFenceEditing = () => {
    const { isEditingFence, editingFence, isEditingFenceClosed } = this.state;

    if (isEditingFenceClosed) {
      this.setState({ isEditingFenceClosed: false });
    } else if (editingFence && editingFence.fenceCoordinates.length > 2) {
      const newPolygon = Array.from(editingFence.fenceCoordinates);
      newPolygon.pop();
      this.setState({
        editingFence: { ...editingFence, fenceCoordinates: newPolygon }
      });
    } else if (isEditingFence) {
      this.setState({
        isEditingFenceModalVisible: true,
        editingFence: { ...editingFence, fenceCoordinates: [] }
      });
    }
  };

  handleUploadHubImage = () => {

    const {dispatch, selectedAreaId, geo} = this.props;
    const {selectedExistedPrimeLocation} = this.state;
    this.setState({hubImageLoading: true});
    dispatch({
      type: "areas/getHubUploadUrl",
      hubId: selectedExistedPrimeLocation.id,
      onSuccess: url => {
      

        reqwest({
          url: url,
          method: 'put',
          processData: false,
          data: this.state.uploadFileData,
          headers: {
            'Access-Control-Allow-Headers': '*'
          },
          success: () => {
            
            setTimeout(() => {
              dispatch({
                type: "geo/getFences",
                areaId: selectedAreaId,
                onSuccess: primeLocations => {                  

                  this.setState({
                    uploadFileData: null,
                    hubImageLoading: false,
                    hubUploadImageUrl: null,
                    selectedExistedPrimeLocation: primeLocations.filter(hub => hub.id === selectedExistedPrimeLocation.id)[0]
                  });
                  message.success('upload successfully.');

                }
              });
              
            }, 2000);
          },
          error: () => {
            this.setState({
              hubImageLoading: false,
            });
            message.error('upload failed.');
          },
        });

      }
  });


    

  }

  renderHeader = (areas, isEditing) => {
    const {
      isEditingFence,
      editingFence,
      isEditingFenceClosed,
      isEditingCenter,
      editingCenter,
      isEditingPrimeLocation,
      editingPrimeLocation,
      selectedExistedPrimeLocation,
      hubImageLoading
    } = this.state;

    const isAbleToEncloseEditingFence =
      isEditingFence &&
      editingFence != null &&
      editingFence.fenceCoordinates.length > 2;

    const isAbleToSave =
      (isEditingFence && isEditingFenceClosed) ||
      (isEditingCenter && editingCenter) || 
      (isEditingPrimeLocation && editingPrimeLocation);

      const uploadButton = (
        <div>
          <Icon type={this.state.loading ? 'loading' : 'plus'} />
          <div className="ant-upload-text">Upload</div>
        </div>
      );
     
      const { hubUploadImageUrl } = this.state;


    return (
      <div>
                <Row gutter={{ md: 8, lg: 24, xl: 48 }} className={styles.editRow}>
          {isEditing ? (
            <Col md={24} sm={24}>
              <Button
                type="primary"
                onClick={() => this.cancelEditing(true)}
                className={styles.editButton}
              >
                Cancel Editing
              </Button>
              <Button
                type="primary"
                onClick={() => this.handleSave()}
                disabled={!isAbleToSave}
                className={styles.editButton}
              >
                Save
              </Button>
              
                {selectedExistedPrimeLocation  && (
                  <Button
                    type="danger"
                    onClick={() =>
                      this.setState({ isDeleteModalVisible: true })
                    }
                    className={styles.editButton}
                  >
                    DELETE
                  </Button>
                )}

              {isAbleToEncloseEditingFence && (
                <Button
                  type="primary"
                  onClick={() => this.handleEncloseEditingFence()}
                  disabled={isEditingFenceClosed}
                  className={styles.editButton}
                >
                  Close Fence
                </Button>
              )}
              {isEditingFence && (
                <Button
                  type="primary"
                  onClick={() => this.handleUndoFenceEditing()}
                  className={styles.editButton}
                >
                  Undo
                </Button>
              )}
            </Col>
          ) : (
            <Col md={24} sm={24}>
                <Button
                  type="primary"
                  onClick={() => this.handleEditCenter(true)}
                  disabled={isEditing}
                  className={styles.editButton}
                >
                  Edit Center
                </Button>
                <Button
                  type="primary"
                  onClick={() => this.handleCreateFence(true)}
                  disabled={isEditing}
                  className={styles.editButton}
                >
                  Add Fence
                </Button>


              {/* </Col>{authority.includes("create.primeLocation") && ( */}
                {true && (
                <Button
                  type="primary"
                  onClick={() => this.handleCreatePrimeLocation(true)}
                  disabled={isEditing}
                  className={styles.editButton}
                >
                  Add Vehicle Hub
                </Button>
              )}
            </Col>
          )}
        </Row>
        {selectedExistedPrimeLocation && 
          <Row gutter={{ md: 8, lg: 24, xl: 48 }} className={styles.editRow}>
          
            <Col sm={24} >
              {`lat:${selectedExistedPrimeLocation.center.lat } lng:${selectedExistedPrimeLocation.center.lng} radius:${ (selectedExistedPrimeLocation.radius * 328) / 100} ft` }
            </Col>
          </Row>
          
        }

        {selectedExistedPrimeLocation && 
          <div>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }} className={styles.editRow}>
            
              <Col sm={4} >
                <NumberInput addonBefore="Minimum" value={selectedExistedPrimeLocation.minimum} onChange={minimum =>  this.setState({selectedExistedPrimeLocation: {...selectedExistedPrimeLocation, minimum: minimum === "" ? null : minimum}})} /> 
              </Col>

              <Col sm={4} >
                  <NumberInput addonBefore="Target" value={selectedExistedPrimeLocation.target}   onChange={target => this.setState({selectedExistedPrimeLocation: {...selectedExistedPrimeLocation, target: target ===  "" ? null : target}})}  />
              </Col>
              

              <Col sm={6} >
                  <Input addonBefore="Description" value={selectedExistedPrimeLocation.description}   onChange={e => this.setState({selectedExistedPrimeLocation: {...selectedExistedPrimeLocation, description: e.target.value ===  "" ? null : e.target.value}})}  />
              </Col>

              
            </Row>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }} className={styles.editRow}>

              <Col sm={5} >
                  <span> Parking Bonus $ </span>
                  <NumberInput style={{ width: 120 }}  value={selectedExistedPrimeLocation.parkingBonus} onChange={parkingBonus =>  this.setState({selectedExistedPrimeLocation: {...selectedExistedPrimeLocation, parkingBonus: parkingBonus === "" ? null : parkingBonus}})} /> 
              </Col>

              <Col sm={5} >
                  <span> Activated  </span>
                  <Select style={{ width: 120 }}  value={selectedExistedPrimeLocation.turnedOn} onChange={turnedOn =>  this.setState({selectedExistedPrimeLocation: {...selectedExistedPrimeLocation, turnedOn: turnedOn === false ? false : true}})}>
                      <Option value={true}> true </Option>
                      <Option value={false}> false </Option>
                  </Select> 
              </Col>
              <Col sm={5} >
                  <span> Priority  </span>
                  <Select style={{ width: 120 }}  value={selectedExistedPrimeLocation.priority} onChange={priority =>  this.setState({selectedExistedPrimeLocation: {...selectedExistedPrimeLocation, priority: priority}})}>
                      <Option value={0}> 0 </Option>
                      <Option value={1}> 1 </Option>
                      <Option value={2}> 2 </Option>
                      <Option value={3}> 3 </Option>
                  </Select> 
              </Col>
            </Row>
            
            <Row gutter={{ md: 8, lg: 24, xl: 48 }} className={styles.editRow}>
               <Col sm={4} >
                <Upload
                  name="avatar"
                  listType="picture-card"
                  className="avatar-uploader"
                  // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                  showUploadList={false}                          
                  beforeUpload={this.beforeUpload}
                  onChange={this.handleChange}
                >
                {hubUploadImageUrl ? <img src={hubUploadImageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                  
                </Upload>
                {
                   hubUploadImageUrl && <div style={{marginTop:" 0.5em"}}>
                      <Button type="primary" onClick={this.handleUploadHubImage} disabled={hubImageLoading}> Upload </Button>

                      <Button  style={{marginLeft:" 0.5em"}}  onClick={() => this.setState({hubUploadImageUrl: null})} disabled={hubImageLoading}> Reset </Button>
                    
                    </div> 
                }

              </Col> 
            
              <Col sm={12} >
                  { hubImageLoading ? 
                    <div style={{paddingLeft: "300px", paddingTop: "200px"}}>
                      <Spin size="large"  />
                    </div>
                    :
                    selectedExistedPrimeLocation.stagingUrl && <img style={{ maxWidth: '100%', maxHeight: "400px" }} src={selectedExistedPrimeLocation.stagingUrl}></img> 
                  }
                </Col>

            </Row>

          </div>
          
        }

       

       
      </div>
    );
  };

  handleEditFence = () => {
    const { selectedExistedFence } = this.state;

    if (!selectedExistedFence) return;

    this.setState({ isEditingFenceModalVisible: true });
  };

  handleEditFenceSubmit = values => {
    const { selectedExistedFence } = this.state;

    this.handleUpdateFence(Object.assign({}, selectedExistedFence, values));
  };

  handleDelete= () => {

    const { selectedExistedFence , selectedExistedPrimeLocation} = this.state;

    if (selectedExistedFence) {
      this.handleDeleteFence();
    }

    if (selectedExistedPrimeLocation) {
      this.handleDeletePrimeLocation();
    }

  }

  handleDeletePrimeLocation = () => {
    const { selectedExistedPrimeLocation } = this.state;

    if (!selectedExistedPrimeLocation) return;

    const { dispatch } = this.props;

    dispatch({
      type: "geo/removePrimeLocation",
      id: selectedExistedPrimeLocation.id,
      onSuccess: this.getAreaGeoInfo,
      onError: this.cancelEditing
    });
  };


  handleDeleteFence = () => {
    const { selectedExistedFence } = this.state;

    if (!selectedExistedFence) return;

    const { dispatch } = this.props;

    dispatch({
      type: "geo/removeFence",
      id: selectedExistedFence.id,
      onSuccess: this.getAreaGeoInfo,
      onError: this.cancelEditing
    });
  };

  shouldShowEditButton = () => {

    const {
      selectedExistedPrimeLocation,
      selectedExistedFence
    } = this.state;

   return (selectedExistedFence);

  }

  render() {
    const {
      geo,
      areas: { data: areas },
      loading,
      selectedAreaId,
      areaFeature,
      handleEditCenterData
    } = this.props;
    const {
      addFenceModalVisible,
      updateFenceModalVisible,
      deleteFenceModalVisible,
      isEditingFence,
      isEditingPrimeLocation,
      isEditingCenter,
      editingCenter,
      editingFence,
      isEditingFenceModalVisible,
      selectedExistedFence,
      selectedExistedPrimeLocation,
      isDeleteModalVisible
    } = this.state;

    const isEditing = isEditingCenter || isEditingFence || isEditingPrimeLocation;


    return (
      <PageHeaderWrapper title="Geo Management">
        {selectedAreaId && <Card bordered={true}>
          <div>
            {!isEditing && selectedExistedFence ? (
              <Row
                gutter={{ md: 8, lg: 24, xl: 48 }}
                className={styles.editRow}
              >
                <Col md={24} sm={24}>
                  { this.shouldShowEditButton() && (
                    <Button
                      type="primary"
                      onClick={ this.handleEditFence}
                      disabled={isEditing}
                      className={styles.editButton}
                    >
                       Edit Fence
                    </Button>
                  )}
                    <Button
                      type="danger"
                      onClick={() =>
                        this.setState({ isDeleteModalVisible: true })
                      }
                      disabled={isEditing}
                      className={styles.editButton}
                    >
                      DELETE
                    </Button>
                   <Button
                      type="default"
                      onClick={() =>
                        this.setState({
                          isEditing: false,
                          selectedExistedFence: null,
                          selectedExistedPrimeLocation: null
                        })
                      }
                      disabled={isEditing}
                      className={styles.editButton}
                    >
                      Cancel
                    </Button>
                  {selectedExistedFence &&<span>
                    Name: {selectedExistedFence.name} Type:{" "}
                    {fenceType[selectedExistedFence.fenceType]}
                  </span>}
                 
                </Col>
              </Row>
            ) : (
              <div>{this.renderHeader(areas.data, isEditing)}</div>
            )}
            <div style={{ marginBottom: "1em"}} />
            <MyMapComponent
              onMapClick={this.handleMapClick}
              handleExistedFenceClick={this.handleExistedFenceClick}
              handleExistedPrimeLocationClick={this.handleExistedPrimeLocationClick}
              {...this.state}
              center={areaFeature && areaFeature.center}
              fences={geo.fences}
              primeLocations={geo.primeLocations}
              setCircleRef={this.setCircleRef}
            />
          </div>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }} className={styles.editRow}>
            <Col md={24} sm={24} style={{ float: "right" }}>
              {fenceTypeColor.map((color, index) => (
                <div
                  className={styles.fenceColorIndex}
                  key={index}
                  style={{ backgroundColor: fenceTypeColor[index] }}
                >{`${fenceType[index]}`}</div>
              ))}
            </Col>
          </Row>
        </Card> }
        <CreateFenceForm
          handleNext={
            selectedExistedFence
              ? this.handleEditFenceSubmit
              : this.handleCreateFenceNextStep
          }
          handleModalVisible={this.handleCreateFenceModalVisible}
          modalVisible={isEditingFenceModalVisible}
          editingFence={editingFence}
          selectedExistedFence={selectedExistedFence}
        />
        <Modal
          title="Delete"
          visible={isDeleteModalVisible}
          onOk={this.handleDelete}
          onCancel={() => this.setState({ isDeleteModalVisible: false })}
          okText="Delete"
          okType="danger"
        >
          <p style={{fontSize: "2em"}}>
          <Icon type="warning"  />
            {`  Area you sure you want to delete ${selectedExistedFence ? "fence: " + selectedExistedFence.name : "this circle"} ?`}
          </p>
        </Modal>
      </PageHeaderWrapper>
    );
  }
}
const mapStateToProps = ({ geo, areas, loading }) => {
    return {
        geo,
        areaFeature:areas.newArea.feature,
        areas,
        selectedAreaId: areas.selectedAreaId,
        loading: loading.models.geo
        }
  }
  export default connect(mapStateToProps)(geo) 