
import moment from "moment";
import { compose, withProps } from "recompose";
import { GoogleMap, Marker, withGoogleMap, withScriptjs, Polygon, Polyline } from "react-google-maps";
import styles from "./Ride.less";

import { getAuthority } from "@/utils/authority";

import { fenceType, fenceTypeColor, lockOperationWay, vehicleType, violateType, limitType} from "@/constant";


const authority = getAuthority();

const RouteMap = compose(
    withProps({
      googleMapURL:
        "https://maps.googleapis.com/maps/api/js?key=AIzaSyDdCuc9RtkM-9wV9e3OrULPj67g2CHIdZI&v=3.exp&libraries=geometry,drawing,places",
      loadingElement: <div style={{ height: `100%` }} />,
      containerElement: <div style={{ height: `250px` }} />,
      mapElement: <div style={{ height: `100%` }} />
    }),
    withScriptjs,
    withGoogleMap
  )(props => {
    const { path, fences, distance} = props;
  
  
    const center = path[Math.round(path.length / 2)];
  
    const dashLineDot = {
      path: window.google.maps.SymbolPath.CIRCLE,
      fillOpacity: 1,
      scale: 2
    };
  
    return (
  
      <div style={{ position: "relative" }}>
        <div>distance: {Math.round(distance * 100) / 100} miles </div>
        <GoogleMap defaultZoom={15} center={center} style={{ height: "90%" }}>
          <Marker position={path[0]} label={"start"} />
          <Marker position={path[path.length - 1]} label={"end"} />
          <Polyline
            path={path}
            geodesic={true}
            options={{
              strokeColor: "#ff0000",
              strokeOpacity: 0.75,
              strokeWeight: 2
            }}
          />
  
          {fences && fences.map(fence => (
            <Polygon
              path={fence.fenceCoordinates}
              geodesic={true}
              key={fence.id}
              options={{
                strokeColor: fenceTypeColor[fence.fenceType],
                strokeOpacity: fence.fenceType === 5 ? 0 : 0.75,
                strokeWeight: fence.fenceType === 5 ? 0 : 2,
                fillColor: fenceTypeColor[fence.fenceType],
                fillOpacity:
                  fence.fenceType === 0 || fence.fenceType === 5 ? 0 : 0.35
              }}
            />
          ))}
  
          {fences && fences.filter(fence => fence.fenceType === 5).map(fence => (
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
      </div>
    );
  });

  export default RouteMap;