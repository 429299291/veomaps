import React, { useState, useRef, useCallback,PureComponent } from "react";
import { LoadScript, GoogleMap, Polygon,InfoWindow } from "@react-google-maps/api";
import { connect } from "dva";

import styles from "./googlemaps.less";
function googlemaps (props){
  const [paths, setPaths] = useState([
    // [
    //   {lat:52.52549080781081,lng:13.398178538856462},
    //   {lat:52.48578559055672,lng:13.36653284549701},
    //   {lat:52.48871246221605,lng:13.44618372440339},
    // ],
  [
    { lat: 52.52549082781086, lng: 13.398118538856465 },
    { lat: 52.48578552055679, lng: 13.36653284549709 },
    { lat: 52.48871242221608, lng: 13.44618372440334 }
  ],
  [
    {lat:52.525,lng:13.380},
    {lat:52.485,lng:13.36551},
    {lat:52.4887,lng:13.4461},
  ]
]);
const [editableHandler,setEditableHandler] = useState(false)
const [editIndex,setEditIndex] = useState(null)
// Define refs for Polygon instance and listeners
  const polygonRef = useRef(null);
  const listenersRef = useRef([]);

  // Call setPath with new edited path
  const onEdit = useCallback((index,editableHandler) => {
    if (index === null){
      console.error('000');
      // setEditableHandler(false)
      console.log(polygonRef.current);
      return
    }
    setEditableHandler(true)
    if (polygonRef.current) {
      console.log(polygonRef.current);
      const nextPath = polygonRef.current
        .getPath()
        .getArray()
        .map(latLng => {
          return { lat: latLng.lat(), lng: latLng.lng() };
        });
        console.log(nextPath);
        let newpaths = [...paths]
        newpaths[index] = nextPath
        console.log(newpaths);
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
    polygon => {
      console.log(polygon);
      polygonRef.current = polygon;
      const path = polygon.getPath();
      console.log(path);
      listenersRef.current.push(
        path.addListener("set_at", onEdit),
        path.addListener("insert_at", onEdit),
        path.addListener("remove_at", onEdit)
      );
    },
    [onEdit]
  );
  const onLoadInfoWindow =(infoWindow)=>{
    console.log(infoWindow);
  }
  const options = {
    fillColor: "lightblue",
    fillOpacity: 0.6,
    strokeColor: "red",
    strokeOpacity: 1,
    strokeWeight: 2,
    clickable: true,
    draggable: true,
    editable: true,
    geodesic: false,
    zIndex: 7
  }
  const divStyle = {
    background: `white`,
    border: `1px solid #ccc`,
    padding: 15
  }
  // Clean up refs
  const onUnmount = useCallback(() => {
    listenersRef.current.forEach(lis => lis.remove());
    polygonRef.current = null;
  }, []);

  console.log("The path state is",editIndex, paths);
  // render(){
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
              center={{ lat: 52.52047739093263, lng: 13.36653284549709 }}
              zoom={12}
              version="weekly"
              on
            >
              {
                paths.map((path,index)=>(
                  <Polygon
                  // Make the Polygon editable / draggable
                  editable = {index == editIndex ? editableHandler :false}
                  draggable={false}
                  key={index}
                  path={path}
                  // options={options}
                  onDblClick={()=>{onEdit((index==editIndex || editIndex == null)?index:null)}}
                  // onMouseOver={}
                  // Event used when manipulating and adding points
                  onMouseUp={()=>{onEdit((index==editIndex || editIndex == null)?index:null);setEditIndex(index)}}
                  // Event used when dragging the whole Polygon
                  onDragEnd={()=>{onEdit((index==editIndex || editIndex == null)?index:null)}}
                  onLoad={onLoad}
                  onUnmount={onUnmount}
                />
                ))
              }
                 {/* {editableHandler && <InfoWindow
                  onLoad={onLoadInfoWindow}
                  position={path[0]}
                >
                  <div style={divStyle}>
                    <h1>InfoWindow1</h1>
                  </div>
                </InfoWindow>} */}
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