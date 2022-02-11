import React, { PureComponent, Fragment,useState,useEffect, useRef, useCallback } from "react";
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
  Spin,
  Drawer,
  Space
} from "antd";
const Option = Select.Option;
import reqwest from "reqwest";
import { LoadingOutlined, PlusOutlined,WarningOutlined,PlusSquareOutlined,FileProtectOutlined } from '@ant-design/icons';
import { LoadScript,Marker, GoogleMap,Polyline,Circle, Polygon,InfoWindow } from "@react-google-maps/api";
import PageHeaderWrapper from "@/components/PageHeaderWrapper";
import {fenceType, fenceTypeColor} from "@/constant";
import NumberInput from "@/components/share/NumberInput";
const FormItem = Form.Item;
import { compose, withProps } from "recompose";
import {
  withScriptjs,
  withGoogleMap,
  // GoogleMap,
  // Marker,
  // Polyline,
  // Polygon,
  // Circle,
  // InfoWindow
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
                    <Col span={6} style={{marginBottom:'15px'}}> 
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
                    <Col span={6} style={{marginBottom:'15px'}}> 
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
              <Col span={18}> 
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
const MyMapComponentNew = (props)=>{
  const {
    center,
    fences,
    updateAllPolygonBuffs,
    allPolygonBuffs,
    addPolygonBuffs,
    updateAddPolygonBuffs,
    primeLocations,
    onMapClick,
    isEditingCenter,
    editingCenter,
    isEditingFence,
    isEditingFenceClosed,
    isEditingFenceClose,//close change isEditingFence
    selectedAreaId,
    // handleExistedFenceClick,
    isEditingPrimeLocation,
    editingPrimeLocation,
    setCircleRef,
    // handleExistedPrimeLocationClick,
    selectedExistedPrimeLocation,
    // selectedGeoObject
    getAreaGeoInfo,
    updateIsDeleteModalVisible,
    dispatch,
    cancelEditing,
    addFenceNewpoint,
    fenceEditActiveVisible
  } = props;
  const centerToRender = isEditingCenter && editingCenter ? editingCenter : center;
  // const path = !!(isEditingFence && editingFence) ? editingFence.fenceCoordinates : [];
  // new polygon    /////////////////////////////////////////////
  let allPolygonBuffsFirst = []
  const [polygonPaths, setPolygonPaths] = useState([])
  const [oldFences, setOldFences] = useState([])
  const [oldFencesOn, setOldFencesOn] = useState(true)
  const [hasForceDatas, setHasForceDatas] = useState(true)  
  const [addPolygonPaths, setAddPolygonPaths] = useState()
  const [addPolygonOfClose, setAddPolygonOfClose] = useState(false)
  useEffect(()=>{
    if (!addFenceNewpoint.hasOwnProperty("lat")) return
    setAddPolygonPaths([{lat:addFenceNewpoint.lat-0.001,lng:addFenceNewpoint.lng-0.001},{lat:addFenceNewpoint.lat+0.001,lng:addFenceNewpoint.lng-0.001},{lat:addFenceNewpoint.lat,lng:addFenceNewpoint.lng+0.001}])
    setEditableHandler(isEditingFence)
  },[addFenceNewpoint])
  useEffect(()=>{
    setPolygonPaths([...fences])
  },[fences])
  const [editableHandler,setEditableHandler] = useState(false)
  const [isDeleteModalVisible,setIsDeleteModalVisible] = useState(false)
  const [declineFenceData,setDeclineFenceData] = useState(false)
  const options = (fenceTypeIndex,declineFenceData)=>{
    const zIndexA = (fenceTypeIndex)=>{
      return fenceTypeIndex
    }
    const zIndexB = (fenceTypeIndex)=>{
      return 10-fenceTypeIndex
    }
    return{
      strokeColor: fenceTypeColor[fenceTypeIndex],
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: fenceTypeColor[fenceTypeIndex],
      fillOpacity:(fenceTypeIndex==0 || fenceTypeIndex==5)? 0 : 0.35,
      clickable: true,
      visible: true,
      zIndex:declineFenceData ? (fenceTypeIndex==0 || fenceTypeIndex==5)? 5:null :null
      // zIndex:!declineFenceData ? zIndexA(fenceTypeIndex) : zIndexB(fenceTypeIndex)
    }
  }
  const [editIndex,setEditIndex] = useState(null)
  const [activeIndex,setActiveIndex] = useState(null)
  const [addIndex,setAddIndex] = useState(null)
  const [currentZoom,setCurrentZoom] = useState(12)
  const [geofenceOnDeleteToConfirmData,setGeofenceOnDeleteToConfirmData] = useState(false)
  const [clickPolygonReset,setClickPolygonReset] = useState(null)
  const [form] = Form.useForm()
  const polygonRef = useRef(null);
  const listenersRef = useRef([]);
  if(!activeIndex){
    fenceEditActiveVisible(true)
  }else{
    fenceEditActiveVisible(false)
  }
  const polygonOnEdit = (index) => {
    // polygonRef.current = allPolygonBuffs[index]
    polygonRef.current = isEditingFence ? addPolygonBuffs : allPolygonBuffs[index]
      setEditableHandler(true)
      if (polygonRef.current) {
        const nextPath = polygonRef.current
          .getPath()
          .getArray()
          .map(latLng => {
            return { lat: latLng.lat(), lng: latLng.lng() };
          });
          console.log(nextPath);
          
          if(oldFencesOn){
            setOldFencesOn(false)
            console.log(nextPath);
            setOldFences(nextPath)
          }
          if(isEditingFence){
            // editingFence.fenceCoordinates = nextPath
            console.log('add');
            setAddPolygonPaths(nextPath)
          }else{
            let newpaths = [...polygonPaths]
            newpaths[index].fenceCoordinates = nextPath
            setPolygonPaths(newpaths);
            console.log(newpaths);
          }
      }
  }
  const polygonEndEdit = ()=>{
    setEditableHandler(false)
    setOldFencesOn(true)
    setEditIndex(null)
    console.log('endEdit');
  }
  const polygonOnLoad = useCallback(
    (polygon) => {
      allPolygonBuffsFirst.push(polygon)
      if(addPolygonOfClose){
        console.log(allPolygonBuffs);
        setAddPolygonOfClose(false)
      }else{
        allPolygonBuffsFirst.length ? updateAllPolygonBuffs(allPolygonBuffsFirst) : null

      }
      // updateAddPolygonBuffs(polygon)
      // setClickPolygonReset(polygon)
    },
    [polygonOnEdit]
  );
  const addPolygonOnLoad = useCallback(
    (polygon) => {
      // await updateAllPolygonBuffs(polygon)
      updateAddPolygonBuffs(polygon)
      console.log(polygon);
      // setClickPolygonReset(polygon)
    },
    [polygonOnEdit]
  );
  const setActivePolygon =(index)=>{
    console.log('active'+index);
    setActiveIndex(index)
    if(index==editIndex){
      form.setFieldsValue(polygonPaths[index])
    }
    if(polygonPaths[index].fenceType == 0 || polygonPaths[index].fenceType == 5){
      setHasForceDatas(true)
    }else{
      setHasForceDatas(false)
    }
    if(allPolygonBuffs[index]){
      const path = allPolygonBuffs[index].getPath();
      listenersRef.current.push(
        path.addListener("set_at", polygonOnEdit),
        path.addListener("insert_at", polygonOnEdit),
        path.addListener("remove_at", polygonOnEdit)
      );
    }
  }
  const polygonOnUnmount = useCallback(() => {
    console.log('unmount');
    listenersRef.current.forEach(lis => lis.remove());
    polygonRef.current = null;
  }, []);
  // infowindow
  const drawerOnClose =()=>{
    if(isEditingFence){
      isEditingFenceClose(false)
    }else{
      setEditIndex(null)
    }
    setActiveIndex(null)
    if (editableHandler) {
      setEditableHandler(false);
      setOldFencesOn(true)
    }
  }
  // form
  const onFinish = (values) => {
    setEditableHandler(false)
    setOldFencesOn(true)
    console.log(editIndex);
    console.log('Success:', {polygonPaths});
    setActiveIndex(null)
    if(isEditingFence){
      values.fenceCoordinates = addPolygonPaths
      dispatch({
        type: "geo/addFence",
        payload: Object.assign({}, values, {areaId: selectedAreaId}) ,
        onSuccess:getAreaGeoInfo
      });
      setAddPolygonOfClose(true)
      setAddPolygonPaths(null)
    }else{
      polygonPaths[editIndex] = {...polygonPaths[editIndex],...values}
      dispatch({
        type: "geo/updateFence",
        payload: Object.assign({}, polygonPaths[editIndex], {areaId: selectedAreaId}) ,
        onSuccess: getAreaGeoInfo
      });
    }
    isEditingFenceClose(false)
  };
  const onFenceDelete = ()=>{
    // polygonPaths[editIndex].fenceType == 0 ? setGeofenceOnDeleteToConfirmData(true) : null
    if(polygonPaths[editIndex].fenceType == 0){
      setGeofenceOnDeleteToConfirmData(true)
    }else{
      setGeofenceOnDeleteToConfirmData(false)
    }
    setIsDeleteModalVisible(true)
  }
  const handleDeleteFence = ()=>{
    setIsDeleteModalVisible(false)
    setEditableHandler(false)
    setOldFencesOn(true)
    setActiveIndex(null)
    dispatch({
      type: "geo/removeFence",
      id: polygonPaths[editIndex].id,
      onSuccess: getAreaGeoInfo,
    });
    setEditIndex(null)
    setDeclineFenceData(false)
  }
  const geofenceOnDeleteToConfirm = (e)=>{
    console.log(e.target.value);
    if(e.target.value == 'geofence'){
      setGeofenceOnDeleteToConfirmData(false)
    }else{
      setGeofenceOnDeleteToConfirmData(true)
    }
  }
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  const fenceTypeChange = (value)=>{
    setAddIndex(value)
    if(value == 0 || value == 5){
      setHasForceDatas(true)
    }else{
      setHasForceDatas(false)
    }
  }
  // console.log(polygonPaths);
  const fence = polygonPaths[editIndex]
    // Update the document title using the browser API
    if(isEditingFence && addIndex == null && !addPolygonPaths){form.resetFields()}
  // console.log(fence);
  const deleteVertexNode = (mev)=> {
    if (mev.vertex != null) {
      my_poly.getPath().removeAt(mev.vertex);
    }
  }
  const handleZoomChanged=(newZoom)=>{
    newZoom ? setCurrentZoom(newZoom): null
  }
  const polygonOnZindexChanged = (value)=>{
    console.log(value);
  }
  const DeclineFence =()=>{
    setDeclineFenceData(!declineFenceData)
  }
  // console.log(polygonPaths);
  return (
    <div className={styles.App}>
    <LoadScript
    id="script-loader"
    googleMapsApiKey="AIzaSyDdCuc9RtkM-9wV9e3OrULPj67g2CHIdZI"
    language="en"
    region="us"
  >
    <GoogleMap
      zoom={currentZoom}
      mapContainerClassName={styles.Appmap}
      center={center ? center : defaultCenter}
      onClick={onMapClick}
      onZoomChanged={handleZoomChanged.bind(this)}
    >
      {centerToRender && <Marker position={centerToRender} />}
        {
         isEditingFence && addPolygonPaths && addFenceNewpoint &&
          <Polygon
          editable = {true}
          draggable={true}
          options={options(addIndex)}
          onClick={() => {setActivePolygon(allPolygonBuffs.length+1)}}
          onDblClick={polygonEndEdit}
          // Event used when manipulating and adding points
          onMouseUp={()=>{polygonOnEdit(allPolygonBuffs.length+1,setPolygonPaths);setEditIndex(allPolygonBuffs.length+1)}}
          // onMouseUp={onEdit}
          // Event used when dragging the whole Polygon
          onDragEnd={()=>{polygonOnEdit(allPolygonBuffs.length+1,editIndex,editableHandler,allPolygonBuffs)}}
          onLoad={addPolygonOnLoad}
          onUnmount={polygonOnUnmount}
          path={addPolygonPaths}
        />
        }
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
              zIndex: 7
            }}
          />
        )}
        {
          primeLocations.map(
            circle => selectedExistedPrimeLocation && selectedExistedPrimeLocation.id === circle.id ? undefined : <Circle
              center={circle.center}
              radius={circle.radius}
              key={circle.id}
              onClick={editIndex ? null : onMapClick}
              options={{
                fillColor: circle.turnedOn ? "#169902" : '#e81e1e',
                strokeColor: circle.turnedOn ?  '#169902' : '#e81e1e',
                strokeOpacity: 0.9,
                strokeWeight: 2
              }}
            />)
        }
              {
                polygonPaths.map((path,index)=>(
                  <Polygon
                  editable = {(index == editIndex && !isEditingFence) ? editableHandler :false}
                  draggable={index == editIndex ? editableHandler :false}
                  key={index}
                  path={path.fenceCoordinates}
                  options={options(path.fenceType,( declineFenceData)? declineFenceData:0)}
                  onClick={isEditingCenter ? onMapClick :() => {setActivePolygon(index)}}
                  onDblClick={polygonEndEdit}
                  // onMouseUp={isEditingCenter?onMapClick : ()=>{polygonOnEdit(((index==editIndex || editIndex == null)?index:null),setPolygonPaths);if(!editIndex)setEditIndex(index)}}
                  onMouseUp={isEditingCenter?onMapClick : ()=>{polygonOnEdit((index),setPolygonPaths);if(!editIndex)setEditIndex(index)}}
                  onDragEnd={()=>{polygonOnEdit(((index==editIndex || editIndex == null)?index:null),setPolygonPaths)}}
                  onLoad={polygonOnLoad}
                  onUnmount={polygonOnUnmount}
                  onZindexChanged={polygonOnZindexChanged}
                  onRightClick={deleteVertexNode}
                />
                ))
              }
              {
                      <Drawer
                      title= {isEditingFence ? "Add Fence":"Fence Inforwindow"}
                      placement="right"
                      width={500}
                      onClose={drawerOnClose}
                      mask={false}
                      // visible={editableHandler}
                      visible={isEditingFence || activeIndex !== null}
                    >
                <Form
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    initialValues={{fenceType:1}}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    form={form}
                  >
                    <Form.Item
                      label="name"
                      name="name"
                      labelCol={{ span: 5 }} wrapperCol={{ span: 19 }}
                      rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                      <Input />
                    </Form.Item>
                    <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} label="Activated"
                            rules={
                              [
                                {
                                  required: true,
                                  message: "You have pick a Activa!",
                                }
                              ]
                            }
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
                    {
                      fence && !isEditingFence &&
                    <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} label="Active Time" name='activeTimeRange'
                    initialValue= {(fence && fence.activeTimeRange) ? fence.activeTimeRange : {weekDayDTO: {start: null, end: null}, weekendDTO: {start: null, end: null}, timeZone: null}}
                    >
                      <DynamicFenceConfigForm />
                    </FormItem>
                    }
                    <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} label="Note" name='note'>
                      <Input placeholder="Please Input" />
                    </FormItem>
                    <Form.Item
                      label="Fence Type"
                      name="fenceType"
                      labelCol={{ span: 5 }} wrapperCol={{ span: 19 }}
                    >
                      <Select placeholder="select" style={{ width: "100%" }} onChange={fenceTypeChange}>
                      {fenceType.map((fence, index) => (
                        <Select.Option key={index} value={index}>
                          {fence}
                        </Select.Option>
                      ))}
                      </Select>
                    </Form.Item>
                    {
                      hasForceDatas && 
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
                    }
                    {!isEditingFence &&<FormItem
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 19 }}
                name={hasForceDatas? "forceVehicleTypes" : "vehicleTypes"}
                label={(hasForceDatas? "Force " : "") + "Vehicle Type"}
              >
                  <Select placeholder="select" style={{ width: "100%" }} mode="multiple">
                    <Option value={0}>Bike</Option>
                    <Option value={1}>Scooter</Option>
                    <Option value={2}>E-Bike</Option>
                    <Option value={3}>COSMO</Option>
                  </Select>
              </FormItem>}
                    <Form.Item wrapperCol={{ offset: 0, span: 24 }}>
                      {!isEditingFence && activeIndex && oldFences !== polygonPaths[activeIndex].fenceCoordinates && editableHandler && <Button onClick={()=>{
                        // activeIndex
                        // console.log(polygonPaths[activeIndex]);
                        let newDatas = [...polygonPaths]
                        newDatas[editIndex] = {
                          ...newDatas[editIndex],
                          fenceCoordinates:[...oldFences]
                        }
                        setPolygonPaths(newDatas)
                      }} style={{marginRight:'10px'}}>Reset Path</Button>}
                      <Button htmlType="button" onClick={DeclineFence} style={{marginRight:'10px',color:declineFenceData?"#f00":null}}>
                      {!declineFenceData?"Decline Hierarchy": "Recovery Hierarchy"}
                      </Button>
                      <Button htmlType="button" onClick={isEditingFence?cancelEditing:onFenceDelete} danger style={{marginRight:'10px'}}>
                        {isEditingFence?"cancel":"Delete"}
                      </Button>
                      <Button type="primary" htmlType="submit" disabled={!(addPolygonPaths && addPolygonPaths[0]&& addPolygonPaths[0].lat) && isEditingFence}>
                        Submit
                      </Button>
                    </Form.Item>
                  </Form>
                    </Drawer>
              }

                <Modal
          title="Delete"
          visible={isDeleteModalVisible}
          onOk={handleDeleteFence}
          onCancel={() => setIsDeleteModalVisible(false)}
          okText="Delete"
          okButtonProps={{ disabled:geofenceOnDeleteToConfirmData}}
          okType="danger"
        >
          <p style={{fontSize: "2em"}}>
          <WarningOutlined style={{color:'#ffb74d'}}/>
          Area you sure you want to delete
          <p style={{color:'#f00'}}>
          {`${polygonPaths[editIndex] ? `fence:   ${polygonPaths[editIndex].name} \n
            with type: ${fenceType[polygonPaths[editIndex].fenceType]}` : "this circle"} ?`}
          </p>
          {polygonPaths[editIndex] && polygonPaths[editIndex].fenceType == 0 ? <span>Please type “geofence” to delete<Input onChange={geofenceOnDeleteToConfirm} style={{width:'200px'}} placeholder="Input Fence Type" /></span>:''}
          </p>
        </Modal>
    </GoogleMap>
    </LoadScript>
    </div>
  );
}

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
      form.validateFields()
      if (Array.isArray(fieldsValue.vehicleTypes) && fieldsValue.vehicleTypes.length === 0 ) {
        fieldsValue.vehicleTypes = undefined;
      }

      if (Array.isArray(fieldsValue.forceVehicleTypes) && fieldsValue.forceVehicleTypes.length === 0) {
        fieldsValue.forceVehicleTypes = undefined;
      }
      if(!fieldsValue.name || fieldsValue.fenceType == null || fieldsValue.turnedOn == null){
        return false
      }
      handleNext(fieldsValue);
  };
  const okModal = () =>{

  }
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
              rules={
                [
                  {
                    required: true,
                    message: "You have pick a Activa!",
                  }
                ]
              }
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
      {/* active time */}
      {
        fence &&
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Active Time" name='activeTimeRange'
      initialValue= {(fence && fence.activeTimeRange) ? fence.activeTimeRange : {weekDayDTO: {start: null, end: null}, weekendDTO: {start: null, end: null}, timeZone: null}}
      >
        <DynamicFenceConfigForm />
      </FormItem>
      }
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
          (getFieldValue('fenceType') ||  getFieldValue('fenceType') == 0 ) ? 
                (<FormItem
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
                  </Select>
              </FormItem>) :null
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
    isParkingCheckStart: false,
    uploadImgUrl:'',
    hubUploadLoading:false,
    getFencesNewData:false,
    fenceDelete:false,
    allPolygonBuffs:[],
    addPolygonBuffs:[],
    addFenceNewpoint:{},
    fenceEditActiveVisibleData:false
  };

  componentDidMount() {
    if (this.props.selectedAreaId){
      this.getAreaGeoInfoFirst();
    }
  }
  updateAllPolygonBuffs = (data)=>{
    this.setState({
      allPolygonBuffs:[...data]
    })
  }
  updateAddPolygonBuffs = (data)=>{
    this.setState({
      addPolygonBuffs:data
    })
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
      areaId: areaId,
      getFencesNew:()=>{this.setState({
        getFencesNewData:true
      })}
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
  isEditingFenceClose =(value)=>{
    this.setState({
      isEditingFence:value
    })
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
    this.setState({
      addFenceNewpoint:newPoint
    })
    //this.checkParking(newPoint);
    //this.checkPrimeLocation(newPoint);
    if (isEditingCenter) {
      this.setState({ editingCenter: newPoint });
    } else if (isEditingFence && editingFence) {
      console.log(editingFence);
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

  setCircleRef = ref => {
    console.log(ref);
    this.cricelRef = ref;
  }
  updateIsDeleteModalVisible = (value)=>{
    this.setState({
      isDeleteModalVisible:value
    })
  }
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
      // editingFence.fenceCoordinates.push(editingFence.fenceCoordinates[0]);
      // if(editingFence.activeTimeRange.weekDayDTO){
      //   editingFence.activeTimeRange.weekDayDTO.start ? null : delete editingFence.activeTimeRange.weekDayDTO
      // }
      // if(editingFence.activeTimeRange.weekendDTO){
      //   editingFence.activeTimeRange.weekendDTO.start ? null : delete editingFence.activeTimeRange.weekendDTO
      // }
      // !editingFence.activeTimeRange.weekDayDTO && !editingFence.activeTimeRange.weekendDTO ? delete editingFence.activeTimeRange : null
      dispatch({
        type: "geo/addFence",
        payload: Object.assign({}, editingFence, {areaId: selectedAreaId}) ,
        onSuccess: this.getAreaGeoInfo
      });
      console.log('save');
      // this.setState({
      //   isEditingFence:false
      // })
    }

    if (isEditingPrimeLocation) {
      // const circle = this.cricelRef.state.__SECRET_CIRCLE_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
      const circle = this.cricelRef.state.circle;
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
        // this.getAreaGeoInfo();
        this.getAreaGeoInfoFirst()
    }else{
    }
  }
  urlGetImg(){
    const { dispatch } = this.props;
    const {selectedExistedPrimeLocation} = this.state
    dispatch({
      type: "geo/uploadImg",
      hubsId: selectedExistedPrimeLocation.id,
      onSuccess:url => {
        this.setState({uploadImgUrl:url})
      }
    });
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
    // return (new Promise((resolve, reject) => {
    //   resolve(file)
    // }))
   return isJpgOrPng && isLt5M;
  }
  uploadHeadImg(info){
    const {dispatch, selectedAreaId, geo} = this.props;
    const {selectedExistedPrimeLocation} = this.state;
    reqwest({
      url: this.state.uploadImgUrl,
      method: 'put',
      processData: false,
      data: info.file,
      headers: {
        'Access-Control-Allow-Headers': '*',
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
                hubUploadLoading:false,
                hubUploadImageUrl: null,
                selectedExistedPrimeLocation: primeLocations.filter(hub => hub.id === selectedExistedPrimeLocation.id)[0]
              });
              // message.success('upload successfully.');
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

  // handleUploadHubImage = () => {
  //   console.log('---');
  //   const {dispatch, selectedAreaId, geo} = this.props;
  //   const {selectedExistedPrimeLocation} = this.state;
  //   this.setState({hubImageLoading: true});
  // }
  onPreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  };
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
      hubImageLoading,
      hubUploadLoading,
      allPolygonBuffs,
      fenceEditActiveVisibleData
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
          <Icon type={this.state.hubUploadLoading ? 'loading' : 'plus'} />
          {this.state.hubUploadLoading ? <LoadingOutlined /> : <PlusSquareOutlined /> }
          <div className="ant-upload-text">Upload</div>
        </div>
      );
      const confirm = () => {
        message.info('Clicked on Yes.');
      }
      const { hubUploadImageUrl } = this.state;
      const selectedExistedPrimeLocationId = selectedExistedPrimeLocation ? selectedExistedPrimeLocation.id : null
      let imgList = (this.props.geo.primeLocations && selectedExistedPrimeLocation) ? this.props.geo.primeLocations.filter(data=>{return data.id == selectedExistedPrimeLocationId}) : []
      imgList = imgList.length>0 ? imgList[0].stagingUrl : ''
      this.setState({hubUploadImageUrl : imgList})
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
                // disabled={!isAbleToSave}
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
              {/* {isEditingFence && (
                <Button
                  type="primary"
                  onClick={() => this.handleUndoFenceEditing()}
                  className={styles.editButton}
                >
                  Undo
                </Button>
              )} */}
            </Col>
          ) : (
            <Col md={24} sm={24}>
                {fenceEditActiveVisibleData &&<Button
                  type="primary"
                  onClick={() => this.handleEditCenter(true)}
                  disabled={isEditing}
                  className={styles.editButton}
                >
                  Edit Center
                </Button>}
                {fenceEditActiveVisibleData && <Button
                  type="primary"
                  onClick={() => this.handleCreateFence(true)}
                  disabled={isEditing}
                  className={styles.editButton}
                >
                  Add Fence
                </Button>}


              {/* </Col>{authority.includes("create.primeLocation") && ( */}
                {fenceEditActiveVisibleData && (
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
            <Row gutter={{ md: 8, lg: 24, xl: 48 }} className={styles.editRow} style={{position:'relative'}}>
            
              <Col sm={4} >
                <NumberInput addonBefore="Minimum" value={selectedExistedPrimeLocation.minimum} onChange={minimum =>  this.setState({selectedExistedPrimeLocation: {...selectedExistedPrimeLocation, minimum: minimum === "" ? null : minimum}})} /> 
              </Col>

              <Col sm={4} >
                  <NumberInput addonBefore="Target" value={selectedExistedPrimeLocation.target}   onChange={target => this.setState({selectedExistedPrimeLocation: {...selectedExistedPrimeLocation, target: target ===  "" ? null : target}})}  />
              </Col>
              <Col sm={6} >
                  <Input addonBefore="Description" value={selectedExistedPrimeLocation.description}   onChange={e => this.setState({selectedExistedPrimeLocation: {...selectedExistedPrimeLocation, description: e.target.value ===  "" ? null : e.target.value}})}  />
              </Col>
              <Col sm={5} style={{position:'absolute',right:'20rem',top:'-2rem'}}>
                <Upload
                  name="avatar"
                  listType="picture-card"
                  className="avatar-uploader"
                  onClick={this.urlGetImg.bind(this)}
                  action={this.state.uploadImgUrl}
                  customRequest={this.uploadHeadImg.bind(this)}
                  showUploadList={false}                          
                  beforeUpload={this.beforeUpload}
                  fileList={[{uid:'01',url:imgList,status: 'uploading'}]}
                  onPreview={this.onPreview}
                  onChange={this.handleChange}
                >
                {hubUploadImageUrl && !hubUploadLoading ? <img src={hubUploadImageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                </Upload>
                {/* {
                   hubUploadImageUrl && <div style={{marginTop:" 0.5em"}}>
                      <Button type="primary" onClick={this.handleUploadHubImage} disabled={hubImageLoading}> Upload </Button>
                      <Button  style={{marginLeft:" 0.5em"}}  onClick={() => this.setState({hubUploadImageUrl: null})} disabled={hubImageLoading}> Reset </Button>
                    </div> 
                } */}
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
                {/* show big picture */}
              {/* <Col sm={12} >
                <p>999</p>
                  { hubImageLoading ? 
                    <div style={{paddingLeft: "300px", paddingTop: "200px"}}>
                      99999
                      <Spin size="large"  />
                    </div>
                    :
                    selectedExistedPrimeLocation.stagingUrl && <img style={{ maxWidth: '100%', maxHeight: "400px" }} src={selectedExistedPrimeLocation.stagingUrl}></img> 
                  }
                </Col> */}


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
  fenceEditActiveVisible=(value)=>{
    this.setState({
      fenceEditActiveVisibleData:value
    })
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
  geofenceOnDelete = (e)=>{
    if(e.target.value == 'geofence'){
      this.setState({fenceDelete:false})
    }else{
      this.setState({fenceDelete:true})
    }
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
      isDeleteModalVisible,
      allPolygonBuffs,
      addPolygonBuffs,
      addFenceNewpoint
    } = this.state;
    const isEditing = isEditingCenter || isEditingFence || isEditingPrimeLocation;
    return (
      <PageHeaderWrapper title="Geo Management">
        {selectedAreaId && <Card bordered={true}>
          <div>
            {/* fence for cancel inforwindow */}
            {!isEditing && selectedExistedFence && false ? (
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
                      onClick={() =>{
                        selectedExistedFence.fenceType === 0 ? this.setState({fenceDelete:true}) : this.setState({fenceDelete:false});
                        this.setState({ isDeleteModalVisible: true })
                      }
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
            {
              this.state.getFencesNewData &&
              <MyMapComponentNew
              // <MyMapComponent
              onMapClick={this.handleMapClick}
              handleExistedFenceClick={this.handleExistedFenceClick}
              handleExistedPrimeLocationClick={this.handleExistedPrimeLocationClick}
              {...this.state}
              center={areaFeature && areaFeature.center}
              fences={geo.fences}
              updateAllPolygonBuffs={this.updateAllPolygonBuffs}
              updateAddPolygonBuffs={this.updateAddPolygonBuffs}
              allPolygonBuffs={allPolygonBuffs}
              addPolygonBuffs={addPolygonBuffs}
              primeLocations={geo.primeLocations}
              setCircleRef={this.setCircleRef}
              selectedAreaId={selectedAreaId}
              getAreaGeoInfo={this.getAreaGeoInfo}
              cancelEditing={this.cancelEditing}
              dispatch={this.props.dispatch}
              updateIsDeleteModalVisible={this.updateIsDeleteModalVisible}
              isEditingFenceClose={this.isEditingFenceClose}
              addFenceNewpoint={addFenceNewpoint}
              fenceEditActiveVisible={this.fenceEditActiveVisible}
            /> 
            }
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
        {/* <CreateFenceForm
          handleNext={
            selectedExistedFence
              ? this.handleEditFenceSubmit
              : this.handleCreateFenceNextStep
          }
          handleModalVisible={this.handleCreateFenceModalVisible}
          modalVisible={isEditingFenceModalVisible}
          editingFence={editingFence}
          selectedExistedFence={selectedExistedFence}
        /> */}
        <Modal
          title="Delete"
          visible={isDeleteModalVisible}
          onOk={this.handleDelete}
          onCancel={() => this.setState({ isDeleteModalVisible: false })}
          okText="Delete"
          okButtonProps={{ disabled: this.state.fenceDelete }}
          okType="danger"
        >
          <p style={{fontSize: "2em"}}>
          <WarningOutlined style={{color:'#ffb74d'}}/>
          Area you sure you want to delete
          <p style={{color:'#f00'}}>
          {`${selectedExistedFence ? `fence:   ${selectedExistedFence.name} \n
            with type: ${fenceType[selectedExistedFence.fenceType]}` : "this circle"} ?`}
          </p>
          {selectedExistedFence && selectedExistedFence.fenceType == 0 ? <span>Please type “geofence” to delete<Input onChange={this.geofenceOnDelete} style={{width:'200px'}} placeholder="Input Fence Type" /></span>:''}
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