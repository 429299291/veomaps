import React, { Component } from "react";
import { connect } from "dva";
import { formatMessage, FormattedMessage } from "umi/locale";
import { getAuthority } from "@/utils/authority";
import Button from 'antd/lib/button';
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

import {fenceType, fenceTypeColor} from "@/constant";

import vehicleUnlock from "../../assets/bike_mark.png";
import lowBattery from "../../assets/bike_mark_low_lock.png";
import  errorVehicleUnlock from "../../assets/bike_report.png";
import  errorVehicle from "../../assets/bike_report_lock.png";
import ebike from "../../assets/ebike_mark.png";
import bike from "../../assets/bike_mark_lock.png";
import { exportCSVFile } from "../../utils/utils";
import moment from "moment";
import VehicleMap from "@/components/Map/VehicleMap";

const authority = getAuthority();

const getVehicleIcon = (vehicleDetail, vehicleTypeFilter) => {
  if (vehicleDetail.errorStatus === 1) {
    if (vehicleDetail.lockStatus === 1 && vehicleTypeFilter.error) {
      return errorVehicle;
    } else if (vehicleTypeFilter.errorUnlock){
      return errorVehicleUnlock;
    }
  }

  if ((vehicleDetail.power <=350 && vehicleTypeFilter.lowBattery) || (vehicleDetail.vehicleType === 2 && vehicleDetail.vehiclePower !== null &&  vehicleDetail.vehiclePower < 20)) {
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

@connect(({ areas, dashboard, geo, loading }) => ({
  geo,
  dashboard,
  selectedAreaId: areas.selectedAreaId,
  areaNames: areas.areaNames,
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


  formatCsvData = vehicles => {
    return vehicles.map(vehicle => {
      vehicle.heartTime = moment(vehicle.heartTime).format("YYYY-MM-DD HH:mm:ss");
      return vehicle;
    })

  }


  render() {
    const {
      selectedAreaId,
      dashboard: {vehicleLocations: vehicles},
      geo,
      areaNames,
    } = this.props;

    const {
      vehicleTypeFilter,
      selectedMarker
    } = this.state;

    const center = geo.area && geo.area.center;

    const fences = geo.fences;

    const shouldShowMap = selectedAreaId && authority.includes("update.error.detail") && center && fences && vehicles;


    const vehicleType = ["unlock ", "lock", "lowBattery", "error", "errorUnlock", "ebike"];

    const vehicleCsvHeader = {
      vehicleId: "vehicleId",
      vehicleNumber: "vehicleNumber",
      vehicleType: "vehicleType",
      lockStatus: "lockStatus",
      isReported: "isReported",
      areaId: "areaId",
      imei: "imei",
      errorStatus: "errorStatus",
      connectStatus: "connectStatus",
      power: "power",
      vehiclePower: "vehiclePower",
      isTurnedOn: "isTurnedOn",
      heartTime: "heartTime",
      wirelessTech: "wirelessTech",
      mac: "mac",
      iccid: "iccid",
      firmware: "firmware",
      lat: "lat",
      lng: "lng",
      key: "vehicleId"
    };

    return (
      <GridContent>
      </GridContent>);
  }

}


export default Dashboard;