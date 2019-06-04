import { compose, withProps, lifecycle } from "recompose";
import { GoogleMap, Marker, Polygon, Polyline, withGoogleMap, withScriptjs, InfoWindow } from "react-google-maps";
import HeatmapLayer from "react-google-maps/lib/components/visualization/HeatmapLayer"


import vehicleUnlock from "../../assets/bike_mark.png";
import lowBattery from "../../assets/bike_mark_low_lock.png";
import  errorVehicleUnlock from "../../assets/bike_report.png";
import  errorVehicle from "../../assets/bike_report_lock.png";
import ebike from "../../assets/ebike_mark.png";
import bike from "../../assets/bike_mark_lock.png";


import ebikeError from "../../assets/ebike-pin-errorbackend.png";
import ebikeLowBattery from "../../assets/ebike-pin-lo-batterybackend.png";
import ebikeLocked from "../../assets/ebike-pin-lockedbackend.png";
import ebikeUnLocked from "../../assets/ebike-pin-unlockedbackend.png";
import ebikeReported from "../../assets/ebike-pin-reportedbackend.png";
import pedalError from "../../assets/pedal-bike-errorbackend.png";
import pedalLowBattery from "../../assets/bike_mark_low_lock.png";
import pedalLocked from "../../assets/pedal-bike-unlockedbackend.png";
import pedalUnLocked from "../../assets/pedal-bike-pinbackend.png";
import pedalReported from "../../assets/pedal-bike-pin-reportedbackend.png";
import scooterError from "../../assets/scooter-pin-errorbackend.png";
import scooterLowBattery from "../../assets/scooter-pin-lo-batterybackend.png";
import scooterLocked from "../../assets/scooter-pin-lockedbackend.png";
import scooterUnLocked from "../../assets/scooter-pin-unlockedbackend.png";
import scooterReported from "../../assets/scooter-pin-reportedbackend.png";

import styles from "./VehicleMap.less";

const vehicleType = ["Bicycle", "Scooter", "E-Vehicle", "Car"];

import {
  Slider,
  Checkbox
} from "antd";

import {fenceType, fenceTypeColor} from "@/constant";



const icons = {
    ebikeError,
    ebikeLowBattery,
    ebikeLocked,
    ebikeUnLocked,
    ebikeReported,
    pedalError,
    pedalLowBattery,
    pedalLocked,
    pedalUnLocked,
    pedalReported,
    scooterError,
    scooterLowBattery,
    scooterLocked,
    scooterUnLocked,
    scooterReported
}

const getVehicleIcon = (vehicleDetail) => {
    switch (vehicleDetail.vehicleType) {
        case 0:
            if (vehicleDetail.power <= 350) {
                return pedalLowBattery;
            } else {
                return constructIcon(vehicleDetail, "pedal");
            }
            break;
        case 1:
            if (vehicleDetail.vehiclePower <= 20) {
                return scooterLowBattery;
            } else {
                return constructIcon(vehicleDetail, "scooter");
            }
            break;
        case 2:
            if (vehicleDetail.vehiclePower <= 20 || vehicleDetail.power < 350) {
                return ebikeLowBattery;
            } else {
                return constructIcon(vehicleDetail, "ebike");
            }
            break;
        default:
            return null;
    }
}


const constructIcon = (vehicleDetail, vehicleType) => {
    if (vehicleDetail.reported) {
        return icons[vehicleType+"Reported"];
    }

    if (vehicleDetail.errorStatus != 0) {
        return icons[vehicleType+"Error"];
    }

    if (vehicleDetail.lockStatus !== 1) {
        return icons[vehicleType+"UnLocked"];
    } 

    return icons[vehicleType+"Locked"];
}




const mapLifeCycle = lifecycle({
  componentDidUpdate(prevProps, prevState, snapshot) {

    if (prevProps.shouldShowHeatMap !== this.props.shouldShowHeatMap) {
      this.forceUpdate();
    }
  }
});



const VehicleMap = compose(
  mapLifeCycle,
    withProps({
      googleMapURL:
        "https://maps.googleapis.com/maps/api/js?key=AIzaSyDPnV_7djRAy8m_RuM5T0QIHU5R-07s3Ic&v=3.exp&libraries=geometry,drawing,places,visualization",
      loadingElement: <div style={{ height: `100%` }} />,
      containerElement: <div style={{ height: `600px`}} />,
      mapElement: <div style={{ height: `100%`, width: `100%`}} />
    }),
    withScriptjs,
    withGoogleMap
  )(props => {
    const {
      vehicles,
      center,
      fences,
      selectedMarker,
      setClickedMarker,
      heatMapData,
      shouldShowHeatMap,
      heatMapMaxIntensity,
      heatMapRadius,
      handleSetHeatMapMaxIntensity,
      handleSetHeatMapRadius,
      currPosition,
      handleGetMyLocation
    } = props;
  
  
    console.log(heatMapMaxIntensity);

    const dashLineDot = {
      path: window.google.maps.SymbolPath.CIRCLE,
      fillOpacity: 1,
      scale: 2
    };


    //const intensity = heatMapData && 2 * (Math.floor(heatMapData.length / 1000) + 1);
  

    const intensity = heatMapMaxIntensity;

    const radius = heatMapRadius;

    return (
      <div style={{position: "relative"}}>
      <GoogleMap
        defaultZoom={11}
        center={center ? center : defaultCenter}
        onClick={() => setClickedMarker(null)}
      >
        {center && <Marker key="center" position={center} />}
  


        {shouldShowHeatMap && heatMapData && <HeatmapLayer 
          data={heatMapData.map(coord => {
            const result = new google.maps.LatLng(coord.lat, coord.lng);
            return result
          })}
          options={
            {
              radius: heatMapRadius,
              dissipating: true,
              maxIntensity: intensity,
              opacity: 1
            }
          }

       /> }
        
  
        { vehicles && vehicles.map(vehicle => {
  
          const icon = getVehicleIcon(vehicle);
  
          if (icon === null) {
            return;
          }

          if (vehicle.lat === null || vehicle.lng === null) {
            return;
          }
  
          return <Marker
                  key={vehicle.vehicleNumber}
                  position={{lat: vehicle.lat, lng: vehicle.lng}}
                  icon={icon}
                  onClick={() => setClickedMarker(vehicle.vehicleNumber)}
                  options={shouldShowHeatMap && heatMapData ? {opacity: 0.5} : {opacity: 1}}
                >
                  {
                    selectedMarker === vehicle.vehicleNumber &&
                    <InfoWindow onCloseClick={() => setClickedMarker(null)}>
                      <div>
                        {Object.keys(vehicle).map(key => <div>{`${key} : ${vehicle[key]}`}</div>)}
                      </div>
                    </InfoWindow>
                  }
  
                </Marker>
        }
  
        )}
        
        
  
        {fences.map(fence => (
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
                fence.fenceType === 0 || fence.fenceType === 5 ? 0 : (shouldShowHeatMap ? 0.1 : 0.35)
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

        {currPosition &&
            <Marker
              position={(({ latitude, longitude }) => ({ lat: latitude, lng:longitude }))(currPosition.coords)}

              icon ={{ labelOrigin: new google.maps.Point(0, -10)}}
              label= {{
                  text: "You",
                  color: 'black',
                  fontSize: '12px',
                  x: '100',
                  y: '100'
                }}  
          />
        }

      </GoogleMap>
       
      
      <div style={{position: "absolute", left: "3em", bottom: '2em', color: "red"}}>
        {shouldShowHeatMap && heatMapData &&
            <div>
              <div> Ride Count:  {heatMapData.length} </div>

              <div > Max Intensity:  {intensity} </div>

              <div className={styles.heatmapSlider}>  <Slider defaultValue={heatMapMaxIntensity} onChange={handleSetHeatMapMaxIntensity} /> </div>

              <div > Radius:  {heatMapRadius} </div>

              <div className={styles.heatmapSlider}>  <Slider defaultValue={heatMapRadius} onChange={handleSetHeatMapRadius} /> </div>
          </div>
        }

        { 
        
          <div>
              <Checkbox onChange={handleGetMyLocation}>Show My Position</Checkbox>
          </div>  
        }

       </div>} 
      </div>
    );
  });

  export default VehicleMap;