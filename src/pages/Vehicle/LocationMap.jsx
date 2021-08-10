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
  Popconfirm,
  Spin,
  Checkbox
} from "antd";
import PageHeaderWrapper from "@/components/PageHeaderWrapper";
import { getAuthority } from "@/utils/authority";
import errorVehicle from "../../assets/bike_report_lock.png";
import errorVehicleUnlock from "../../assets/bike_report.png";
import lowBattery from "../../assets/bike_mark_low_lock.png";
import vehicleUnlock from "../../assets/bike_mark.png";
import ebike from "../../assets/ebike_mark.png";
import bike from "../../assets/bike_mark_lock.png";
import dot from "../../assets/dot-and-circle.png";

import { compose, withProps } from "recompose";
import { GoogleMap, Marker, withGoogleMap, withScriptjs, Polygon, Polyline, MarkerWithLabel } from "react-google-maps";

const FormItem = Form.Item;

const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;

import {fenceType, fenceTypeColor} from "@/constant";

const authority = getAuthority();

const errorStatus = ["NORMAL", "FROZEN", "ERROR"];

const vehicleType = ["Bicycle", "Scooter", "E-Bike", "COSMO"];
const lockOperationWay = ["GPRS", "BLUETOOTH"];

const isNumberRegex = /^-?\d*\.?\d{1,2}$/;
const isEmailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const vehicleOrders = ["","sign in", "heart", "unlock", "lock", "location", "info", "find", "version", "ip", "error", "alert", "heart period", "iccid", "shut down","ok","mac info", "connect", "disconnect", "version update", "report"];


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
            if (vehicleDetail.power <= 20) {
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
              if (vehicleDetail.vehiclePower <= 20 || vehicleDetail.power < 20) {
                  return ebikeLowBattery;
              } else {
                  return constructIcon(vehicleDetail, "ebike");
              }
              break;
        case 3:
          if (vehicleDetail.vehiclePower <= 20) {
            return scooterLowBattery;
          } else {
              return constructIcon(vehicleDetail, "scooter");
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




const MapComponent = compose(
    withProps({
      googleMapURL:
        "https://maps.googleapis.com/maps/api/js?key=AIzaSyDdCuc9RtkM-9wV9e3OrULPj67g2CHIdZI&v=3.exp&libraries=geometry,drawing,places",
      loadingElement: <div style={{ height: `100%` }} />,
      containerElement: <div style={{ height: `400px` }} />,
      mapElement: <div style={{ height: `100%` }} />
    }),
    withScriptjs,
    withGoogleMap
  )(props => {
    const { record, fences,  vehicleDetail , currPosition, vehicleRef, shouldShowLastScan } = props;
    const location =  vehicleDetail.location.lat ?vehicleDetail.location : (({ x, y }) => ({ lat: y, lng:x }))(vehicleDetail.location);
    let lastScan = false;
    let lastScanLabel = null;

    if (vehicleRef && vehicleRef.length > 0) {
      lastScan =  vehicleRef.sort((a, b) =>  new Date(b.created) - new Date(a.created))[0];


      const duration = moment.duration(moment().diff(moment(lastScan.created)));

      let diff = Math.round(duration.asDays());
      let unit = "days";

      if (diff === 0) {
          diff = Math.round(duration.asHours());
          unit = "hours";
      }

      if (diff ===  0) {
        diff = Math.round(duration.asMinutes());
        unit = "minutes";
      }


      lastScanLabel = diff + " " + unit + " ago";

    }
  
    const dashLineDot = {
      path: window.google.maps.SymbolPath.CIRCLE,
      fillOpacity: 1,
      scale: 2
    };
  
    return (
      <GoogleMap defaultZoom={13} center={location}>
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
                fence.fenceType === 0 || fence.fenceType === 5 ? 0 : 0.35
            }}
          />
        ))}
  
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
  
        <Marker
          position={location}
          icon={getVehicleIcon(record)}
        />

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


        {
          lastScan && shouldShowLastScan &&  <Marker
            position={(({ lat, lng }) => ({ lat: lat, lng:lng }))(lastScan)}
            icon ={{url: dot, labelOrigin: new google.maps.Point(0, -10)}}
            label= {{
                text: lastScanLabel,
                color: 'black',
                fontSize: '12px',
                x: '100',
                y: '100'
              }}     
            opacity={0.7}
        />
        }
      </GoogleMap>
    );
  });

  class LocationMap extends PureComponent {

    state = {
        vehicleDetail: null,
        isLoading: true
      };

      handleGetVehicleDetail = vehicleId => {
        const { dispatch } = this.props;
        if (authority.includes("")) {

            this.setState({isLoading: true});

            dispatch({
                type: "vehicles/getVehicleDetail",
                vehicleId: vehicleId,
                onSuccess: response =>  {
                  console.log(response);
                    this.setState({ vehicleDetail: response, isLoading: false });
                    this.getAreaGeoInfo(response.areaId)
                    }
            });
        } else {
            this.setState({ vehicleDetail: null, isLoading: false });
        }
        this.setState({isLoading: true});

            dispatch({
                type: "vehicles/getVehicleDetail",
                vehicleId: vehicleId,
                onSuccess: response =>  {
                  console.log(response);
                    this.setState({ vehicleDetail: response, isLoading: false });
                    this.getAreaGeoInfo(response.areaId)
                    }
            });
      };
    
      componentDidMount = () => {

        const { record } = this.props;

        const { showCurrentPosition} = this.state;

        this.handleGetVehicleDetail(record.id);
        this.getAreaGeoInfo(record.areaId);
        this.getRef(record.id);

      };



    
    
      getAreaGeoInfo = vehicleAreaId => {
        const { dispatch, geo } = this.props;
    
        if (geo.fences.length == 0 || geo.fences[0].areaId !== vehicleAreaId) {
             dispatch({
                type: "geo/getFences",
                areaId: vehicleAreaId
              });
        }

      };

      getRef = vehicleId => {
        const { dispatch, geo } = this.props;
    
        dispatch({
            type: "vehicles/getRef",
            id: vehicleId,
            onSuccess: response => this.setState({vehicleRef: response})
         });
        

      };

      shouldComponentUpdate(nextProps, nextState) {

        const { record, selectedVehicleRefresh, handleSetSelectedVehicleRefresh } = this.props;

          if (nextProps.selectedVehicleRefresh &&  !selectedVehicleRefresh) {
            this.handleGetVehicleDetail(record.id);
            handleSetSelectedVehicleRefresh(false);
          }

          return true;

      }


      handleGetMyLocation = val => {
          if (val.target.checked) {
            


          if (navigator.geolocation) {

              navigator.geolocation.getCurrentPosition(position => this.setState({currPosition: position}));

              const watchId = navigator.geolocation.watchPosition(
                  position => this.setState({currPosition: position}),
                  err => console.log(err),
                  {
                      enableHighAccuracy: true,
                      timeout: 10000
                  }
              );

              this.setState({watchId: watchId});
          }

          } else {
            
            if (navigator.geolocation) { 
              navigator.geolocation.clearWatch(this.state.watchId);
            }

            this.setState({currPosition: null, watchId: null});
          }
      }


      handleShowLastScan = () => {
        const {shouldShowLastScan} = this.state;

        this.setState({shouldShowLastScan: !shouldShowLastScan});
      }

      goMapAndNavigate =  (lat, lng) => {
        if /* if we're on iOS, open in Apple Maps */
          ((navigator.platform.indexOf("iPhone") != -1) || 
           (navigator.platform.indexOf("iPod") != -1) || 
           (navigator.platform.indexOf("iPad") != -1))
          window.open(`maps://maps.google.com/maps?daddr=${lat},${lng}&amp;ll=`);
      
        else /* else use Google */
          window.open(`https://maps.google.com/maps?daddr=${lat},${lng}&amp;ll=`);
      }


      render() {

        const { geo, record, fenceLoading, selectedVehicleRefresh, handleSetSelectedVehicleRefresh } = this.props;

        const { vehicleDetail, isLoading, currPosition, vehicleRef, shouldShowLastScan} = this.state;
        if (vehicleDetail &&vehicleDetail.location) {

          vehicleDetail.location =  vehicleDetail.location.lat ? vehicleDetail.location : (({ x, y }) => ({ lat: y, lng:x }))(vehicleDetail.location);
        }

       

        return ( isLoading || fenceLoading ) ?
            <div style={{height: "100%"}}>
                <Spin />
            </div>
            :
                (vehicleDetail 
                && vehicleDetail.location ?

                <div style={{position: "relative"}}>

                    <MapComponent 
                        vehicleDetail={vehicleDetail}
                        fences={geo.fences}
                        record={record}
                        currPosition={currPosition}
                        vehicleRef={vehicleRef}
                        shouldShowLastScan={shouldShowLastScan}
                    />

                    <div style={{position: "absolute", left: "1vw", bottom: "2em", color: "#51B5AA"}}>
                        <Button onClick={() => this.goMapAndNavigate(vehicleDetail.location.lat, vehicleDetail.location.lng)} > Go! </Button>
                    </div> 
{/* 
                    <div style={{position: "absolute", left: "1vw", bottom: "5em", color: "#51B5AA"}}>
                        <Checkbox onChange={this.handleGetMyLocation}>Show My Position</Checkbox>
                    </div> 

                    <div style={{position: "absolute", left: "1vw", bottom: "7em", color: "#51B5AA"}}>
                        <Checkbox onChange={this.handleShowLastScan}>Show Last Scan Position</Checkbox>
                    </div>  */}


                </div>
                
                :

                <div >
                Vehicle Location Not Availible
                </div>

                )

      }

  }
  const mapStateToProps = ({ coupons, areas, geo, loading }) => {
    return {
      geo,
      fenceLoading: loading.models.geo
        }
  }
  export default connect(mapStateToProps)(LocationMap) 