import React, { useState, useRef, useCallback,PureComponent } from "react";
import { LoadScript } from "react-google-maps";
import { connect } from "dva";

import "./googlemaps.less";
function googlemaps (props){
  const [path, setPath] = useState([
    { lat: 52.52549080781086, lng: 13.398118538856465 },
    { lat: 52.48578559055679, lng: 13.36653284549709 },
    { lat: 52.48871246221608, lng: 13.44618372440334 }
  ]);

  // Define refs for Polygon instance and listeners
  const polygonRef = useRef(null);
  const listenersRef = useRef([]);

  // Call setPath with new edited path
  const onEdit = useCallback(() => {
    if (polygonRef.current) {
      const nextPath = polygonRef.current
        .getPath()
        .getArray()
        .map(latLng => {
          return { lat: latLng.lat(), lng: latLng.lng() };
        });
      setPath(nextPath);
    }
  }, [setPath]);

  // Bind refs to current Polygon and listeners
  const onLoad = useCallback(
    polygon => {
      this.polygonRef.current = polygon;
      const path = polygon.getPath();
      this.listenersRef.current.push(
        path.addListener("set_at", onEdit),
        path.addListener("insert_at", onEdit),
        path.addListener("remove_at", onEdit)
      );
    },
    [onEdit]
  );

  // Clean up refs
  const onUnmount = useCallback(() => {
    this.listenersRef.current.forEach(lis => lis.remove());
    this.polygonRef.current = null;
  }, []);
  // render(){
    return (
        <div>
          <LoadScript
            id="script-loader"
            googleMapsApiKey="AIzaSyDdCuc9RtkM-9wV9e3OrULPj67g2CHIdZI"
            language="en"
            region="us"
          >
            <GoogleMap
              mapContainerClassName="App-map"
              center={{ lat: 52.52047739093263, lng: 13.36653284549709 }}
              zoom={12}
              version="weekly"
              on
            >
              <Polygon
                // Make the Polygon editable / draggable
                editable
                draggable
                path={path}
                // Event used when manipulating and adding points
                onMouseUp={onEdit}
                // Event used when dragging the whole Polygon
                onDragEnd={onEdit}
                onLoad={onLoad}
                onUnmount={onUnmount}
              />
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