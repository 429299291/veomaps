import React, { Component } from "react";
import { connect } from "dva";
import { formatMessage, FormattedMessage } from "umi/locale";
import { getAuthority } from "@/utils/authority";
import {
  Row,
  Col,
  Icon,
  Card,
  Tabs,
  Table,
  Radio,
  DatePicker,
  Tooltip,
  Menu,
  Dropdown,
  Checkbox,
  Select
} from "antd";
import {
  ChartCard,
  MiniArea,
  MiniBar,
  MiniProgress,
  Field,
  Bar,
  Pie,
  TimelineChart
} from "@/components/Charts";
import GridContent from "@/components/PageHeaderWrapper/GridContent";
import { getTimeDistance } from "@/utils/utils";

import styles from "./Dashboard.less";
import { compose, withProps } from "recompose";
import { GoogleMap, Marker, Polygon, Polyline, withGoogleMap, withScriptjs, InfoWindow } from "react-google-maps";

const Option = Select.Option;

const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 6,
  style: { marginBottom: 24 }
};

const fenceType = [
  "geofence",
  "force parking area",
  "recommend parking",
  "lucky zone",
  "restricted parking",
  "sub-geofence"
];

const fenceTypeColor = [
  "#b72126",
  "#1300ff",
  "#65b30a",
  "#00b8aa",
  "#ff0000",
  "#b72126"
];

import vehicleUnlock from "../../assets/bike_mark.png";
import lowBattery from "../../assets/bike_mark_low_lock.png";
import  errorVehicleUnlock from "../../assets/bike_report.png";
import  errorVehicle from "../../assets/bike_report_lock.png";
import ebike from "../../assets/ebike_mark.png";
import bike from "../../assets/bike_mark_lock.png";

const authority = getAuthority();

const getVehicleIcon = (vehicleDetail, vehicleTypeFilter) => {
  if (vehicleDetail.errorStatus === 1) {
    if (vehicleDetail.lockStatus === 1 && vehicleTypeFilter.error) {
      return errorVehicle;
    } else if (vehicleTypeFilter.errorUnlock){
      return errorVehicleUnlock;
    }
  }

  if (vehicleDetail.power <=350 && vehicleTypeFilter.lowBattery) {
    return lowBattery;
  }

  if (vehicleDetail.lockStatus === 0 && vehicleTypeFilter.unlock) {
    return vehicleUnlock;
  }

  if (vehicleDetail.vehicleType === 2 && vehicleTypeFilter.ebike) {
    return ebike;
  }

  if (vehicleTypeFilter.lock) {
    return bike;
  }

  return null;
}


const DashboardMap = compose(
  withProps({
    googleMapURL:
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyDPnV_7djRAy8m_RuM5T0QIHU5R-07s3Ic&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px`}} />,
    mapElement: <div style={{ height: `100%`, width: `100%`}} />
  }),
  withScriptjs,
  withGoogleMap
)(props => {
  const {
    vehicles,
    center,
    fences,
    vehicleTypeFilter,
    selectedMarker,
    setClickedMarker
  } = props;


  const dashLineDot = {
    path: window.google.maps.SymbolPath.CIRCLE,
    fillOpacity: 1,
    scale: 2
  };

  return (
    <GoogleMap
      defaultZoom={11}
      center={center ? center : defaultCenter}
      onClick={() => setClickedMarker(null)}
    >
      {center && <Marker key="center" position={center} />}


      {vehicles && vehicles.map(vehicle => {

        const icon = getVehicleIcon(vehicle, vehicleTypeFilter);

        if (icon === null) {
          return;
        }

        return <Marker
                key={vehicle.vehicleNumber}
                position={{lat: vehicle.lat, lng: vehicle.lng}}
                icon={icon}
                onClick={() => setClickedMarker(vehicle.vehicleNumber)}
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
              fence.fenceType === 0 || fence.fenceType === 5 ? 0 : 0.35
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

@connect(({ areas, dashboard, geo, loading }) => ({
  geo,
  dashboard,
  selectedAreaId: areas.selectedAreaId,
  loading: loading.models.areas,
}))
class Dashboard extends Component {


  state = {
    vehicleTypeFilter: {
      unlock: true,
      lock: true,
      lowBattery: true,
      error: true,
      errorUnlock: true,
      ebike: true
    },
    selectedMarker: null
  };

  componentDidMount() {
    const { selectedAreaId } = this.props;
    if (selectedAreaId) {
      this.loadData();
    }
  }


  loadData() {
    this.getVehicleLocations();
    this.getAreaGeoInfo();
  }

  getAreaGeoInfo = () => {

    const { dispatch, selectedAreaId } = this.props;

    dispatch({
      type: "geo/getFences",
      areaId: selectedAreaId
    });

    dispatch({
      type: "geo/getCenter",
      areaId: selectedAreaId
    });
  };

  getVehicleLocations() {
    const { dispatch, selectedAreaId } = this.props;

    dispatch({
      type: "dashboard/getVehicleDetail",
      areaId: selectedAreaId
    });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.selectedAreaId && (prevProps.selectedAreaId !== this.props.selectedAreaId)) {
      this.loadData();
    }
  }


  setClickedMarker = vehicleNumber => {
    this.setState({selectedMarker: vehicleNumber})
  }


  render() {
    const {
      selectedAreaId,
      dashboard: {vehicleLocations: vehicles},
      geo
    } = this.props;

    const {
      vehicleTypeFilter,
      selectedMarker
    } = this.state;

    const center = geo.area && geo.area.center;

    const fences = geo.fences;

    const shouldShowMap = selectedAreaId && authority.includes("update.error.detail") && center && fences && vehicles;


    const vehicleType = ["unlock ", "lock", "lowBattery", "error", "errorUnlock", "ebike"];

    return (
      <GridContent>
        {
          shouldShowMap &&
          <Card>
            <Row gutter={24}>
              <Col>
                <Checkbox defaultChecked={true} onChange={e => this.setState({
                  vehicleTypeFilter: {
                    ...vehicleTypeFilter,
                    lock: e.target.checked
                  }
                })}>Lock Vehicle</Checkbox>
                <Checkbox defaultChecked={true} onChange={e => this.setState({
                  vehicleTypeFilter: {
                    ...vehicleTypeFilter,
                    lowBattery: e.target.checked
                  }
                })}>Low Battery</Checkbox>
                <Checkbox defaultChecked={true} onChange={e => this.setState({
                  vehicleTypeFilter: {
                    ...vehicleTypeFilter,
                    error: e.target.checked
                  }
                })}>Error Lock Vehicle</Checkbox>
                <Checkbox defaultChecked={true} onChange={e => this.setState({
                  vehicleTypeFilter: {
                    ...vehicleTypeFilter,
                    errorUnlock: e.target.checked
                  }
                })}>Error Unlock Vehicle </Checkbox>
                <Checkbox defaultChecked={true} onChange={e => this.setState({
                  vehicleTypeFilter: {
                    ...vehicleTypeFilter,
                    ebike: e.target.checked
                  }
                })}>E-Bike</Checkbox>
                <Checkbox defaultChecked={true} onChange={e => this.setState({
                  vehicleTypeFilter: {
                    ...vehicleTypeFilter,
                    unlock: e.target.checked
                  }
                })}>Unlock Vehicle</Checkbox>

                <DashboardMap
                  center={center}
                  vehicles={vehicles}
                  fences={fences}
                  vehicleTypeFilter={vehicleTypeFilter}
                  setClickedMarker={this.setClickedMarker}
                  selectedMarker={selectedMarker}
                />
              </Col>
              }
            </Row>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }} className={styles.editRow}>
              <Col md={24} sm={24} style={{ float: "right" }}>
                <span className={styles.bikeIcon}> <img src={vehicleUnlock}/> unlock bike</span>
                <span className={styles.bikeIcon}> <img src={lowBattery}/> Low Battery</span>
                <span className={styles.bikeIcon}> <img src={errorVehicleUnlock}/> Error Unlock Bike</span>
                <span className={styles.bikeIcon}> <img src={errorVehicle}/> Error Bike</span>
                <span className={styles.bikeIcon}> <img src={ebike}/> E - Bike</span>
                <span className={styles.bikeIcon}> <img src={bike}/> Bike</span>
              </Col>
            </Row>
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
          </Card>
        }
      </GridContent>);
  }

}


export default Dashboard;