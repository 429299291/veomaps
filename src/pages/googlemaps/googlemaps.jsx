import React, { useState, useRef, useCallback,PureComponent } from "react";
import { LoadScript, GoogleMap, Polygon,InfoWindow } from "@react-google-maps/api";
import { connect } from "dva";
import {
  Row,
  Col,
  Card,
  message,Form, Input, Button, Checkbox
} from "antd";
import styles from "./googlemaps.less";
let allPolygonBuffs = []
function googlemaps (props){
  const options = {
    strokeColor: "#FF0000",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: "#FF0000",
    fillOpacity: 0.35,
    clickable: true,
    draggable: false,
    visible: true,
    // zIndex: 1
  };
  const [paths, setPaths] = useState([
  {  
    name:'fence1',
    path:[
      { lat: 52.52549082781086, lng: 13.398118538856465 },
      { lat: 52.48578552055679, lng: 13.36653284549709 },
      { lat: 52.48871242221608, lng: 13.44618372440334 }
    ]
  },
  {
    name:'fence2',
    path:[
      {lat:52.425,lng:13.380},
      {lat:52.485,lng:13.3551},
      {lat:52.4887,lng:13.4461},
      {lat:52.4387,lng:13.4161},
    ]
  },
]);
const [editableHandler,setEditableHandler] = useState(false)
const [editIndex,setEditIndex] = useState(null)
const [clickPolygonReset,setClickPolygonReset] = useState(null)
const [form] = Form.useForm()
  const polygonRef = useRef(null);
  const listenersRef = useRef([]);

  // Call setPath with new edited path
  const onEdit = useCallback((index,editIndex,editableHandler) => {
    polygonRef.current = allPolygonBuffs[index]
    if(index !== editIndex && editableHandler) return
    if (index === null){
      message.error('Edit not saved')
      setEditableHandler(false)
      return
    }
    setEditableHandler(true)
    if (polygonRef.current) {
      const nextPath = polygonRef.current
        .getPath()
        .getArray()
        .map(latLng => {
          return { lat: latLng.lat(), lng: latLng.lng() };
        });
        let newpaths = [...paths]
        newpaths[index].path = nextPath
      setPaths(newpaths);
    }
  }, [setPaths]);
  const endEdit = ()=>{
    setEditableHandler(false)
    setEditIndex(null)
    console.log('endEdit');
  }

  // Bind refs to current Polygon and listeners
  const onLoad = useCallback(
    (polygon) => {
      allPolygonBuffs.push(polygon)
      setClickPolygonReset(polygon)
    },
    [onEdit]
  );
  const setActivePolygon =(index)=>{
    form.setFieldsValue(paths[index])
    const path = allPolygonBuffs[index].getPath();
    listenersRef.current.push(
      path.addListener("set_at", onEdit),
      path.addListener("insert_at", onEdit),
      path.addListener("remove_at", onEdit)
    );
  }
  // Clean up refs
  const onUnmount = useCallback(() => {
    console.log('unmount');
    listenersRef.current.forEach(lis => lis.remove());
    polygonRef.current = null;
  }, []);

  console.log("The path state is", editIndex ,paths);
  // infowindow
  const infowindowOnClose =()=>{
    if (editableHandler) {
      setEditableHandler(false);
    }
  }
  //form
  const onFinish = (values) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

    return (
        <div className={styles.App}>
          <LoadScript
            id="script-loader"
            googleMapsApiKey="AIzaSyDdCuc9RtkM-9wV9e3OrULPj67g2CHIdZI"
            language="en"
            region="us"
          >
            <GoogleMap
              mapContainerClassName={styles.Appmap}
              center={{ lat: 52.47047739093263, lng: 13.36653284549709 }}
              zoom={12}
              version="weekly"
              on
            >
              {
                paths.map((path,index)=>(
                  <>
                  <Polygon
                  // Make the Polygon editable / draggable
                  editable = {index == editIndex ? editableHandler :false}
                  draggable={false}
                  key={index}
                  path={path.path}
                  options={options}
                  onClick={() => setActivePolygon(index)}
                  onDblClick={endEdit}
                  // onMouseOver={}
                  // Event used when manipulating and adding points
                  onMouseUp={()=>{onEdit((index==editIndex || editIndex == null)?index:null);setEditIndex(index)}}
                  // onMouseUp={onEdit}
                  // Event used when dragging the whole Polygon
                  onDragEnd={()=>{onEdit((index==editIndex || editIndex == null)?index:null)}}
                  onLoad={onLoad}
                  onUnmount={onUnmount}
                />
                </>
                ))
              }
              {editableHandler && editIndex !== null && 
                <InfoWindow position={paths[editIndex].path[0]} onClose={infowindowOnClose}>
                    <Form
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    initialValues={{}}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    form={form}
                  >
                    <Form.Item
                      label="Username"
                      name="name"
                      rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                      <Button type="primary" htmlType="submit">
                        Submit
                      </Button>
                    </Form.Item>
                  </Form>
                </InfoWindow>}
            </GoogleMap>
          </LoadScript>
        </div>
      );
  }
// }
const mapStateToProps = ({loading, areas }) => {
    return {
      selectedAreaId: areas.selectedAreaId,
      loading: loading.models.notifications
      }
  }
  export default connect(mapStateToProps)(googlemaps) 