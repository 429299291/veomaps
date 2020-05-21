import React, { Component, useState } from 'react';
import { connect } from 'dva';
import { FormattedMessage } from 'umi/locale';
import { getAuthority } from '@/utils/authority';

import StandardTable from '@/components/StandardTable';

import {
  Card,
  Tabs,
  DatePicker,
  Select,
} from 'antd';

import GridContent from '@/components/PageHeaderWrapper/GridContent';
import { getTimeDistance } from '@/utils/utils';


import { compose, withProps } from 'recompose';
import {
  GoogleMap, Marker, withGoogleMap, withScriptjs, InfoWindow,
} from 'react-google-maps';

import { technicianActionTypes } from '@/constant';

import moment from 'moment';
import styles from './Dashboard.less';

const { Fragment } = React;

const defaultCenter = { lat: 41.879658, lng: -87.629769 };

const { RangePicker } = DatePicker;

const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 6,
  style: { marginBottom: 24 },
};

const authority = getAuthority();

const { TabPane } = Tabs;

const CustomMarker = ({
  actionType, date, name, ...props
}) => {
  const [showInfoWindow, setShowInfoWindow] = useState(false);

  const toggleShowInfoWindow = () => {
    setShowInfoWindow(!showInfoWindow);
  };

  return (
    <Marker
      {...props}
      onMouseOut={toggleShowInfoWindow}
      onMouseOver={toggleShowInfoWindow}
    >
      {
                showInfoWindow
                && (
                <InfoWindow>
                  <Fragment>
                    <h4>{name}</h4>
                    <h5>{date}</h5>
                    <h5>{actionType}</h5>
                  </Fragment>
                </InfoWindow>
                )
            }

    </Marker>
  );
};

@connect(({
  areas, performance, geo,
}) => ({
  geo,
  performance,
  selectedAreaId: areas.selectedAreaId,
  areaNames: areas.areaNames,
}))
class TechMetrics extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    rangePickerValue: getTimeDistance('month'),
  };

  columns = [
    {
      title: 'First Name',
      dataIndex: 'firstName',
    },
    {
      title: 'Last Name',
      dataIndex: 'lastName',
    },
    {
      title: 'Battery Swap Pickups',
      dataIndex: 'actionData.batterySwapPickUpCount',
      sorter: true,
    },
    {
      title: 'Battery Swap Dropoffs',
      dataIndex: 'actionData.batterySwapDropOffCount',
      sorter: true,
    },
    {
      title: 'Maintenance Pickups',
      dataIndex: 'actionData.maintenancePickUpCount',
      sorter: true,
    },
    {
      title: 'Maintenance Dropoffs',
      dataIndex: 'actionData.maintenanceDropOffCount',
      sorter: true,
    },
    {
      title: 'Rebalance Pickups',
      dataIndex: 'actionData.rebalancePickUpCount',
      sorter: true,
    },
    {
      title: 'Rebalance Dropoffs',
      dataIndex: 'actionData.rebalanceDropOffCount',
      sorter: true,
    },
  ];

  componentDidMount() {
    this.getTechnicianData();
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dashboard/clear',
    });
    cancelAnimationFrame(this.reqRef);
    clearTimeout(this.timeoutId);
    clearInterval(this.pollingId);
  }

  getRangeEnd(end) {
    const curr = moment();

    return end.diff(curr, 'seconds') > 0 ? curr : end;
  }

  getTechnicianData() {
    const { dispatch, selectedAreaId } = this.props;

    const { rangePickerValue } = this.state;

    if (!authority.includes('get.technician.metrics')) {
      return;
    }

    console.log(rangePickerValue[0].toISOString());

    console.log(rangePickerValue[1].toISOString());


    dispatch({
      type: 'performance/getTechnicianMetricsData',
      params: Object.assign(
        {},
        {
          areaId: selectedAreaId || -1,
          startDate: rangePickerValue[0].toISOString(),
          end: rangePickerValue[1].toISOString(),
        },
      ),
    });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevState.rangePickerValue !== this.state.rangePickerValue) {
      this.getTechnicianData();
    }

    if ((prevProps.selectedAreaId !== this.props.selectedAreaId)) {
      this.getTechnicianData();
      this.getAreaGeoInfo();
    }
  }


  setClickedMarker = (vehicleNumber) => {
    this.setState({ selectedMarker: vehicleNumber });
  }

  selectDate = (type) => {
    this.setState({
      rangePickerValue: getTimeDistance(type),

    });
  };


  handleRangePickerChange = (rangePickerValue) => {
    const { dispatch } = this.props;
    this.setState({
      rangePickerValue,
    }, this.loadBarCharData);
  };

  countTechPickups = (type) => {
    const { technicianMetricsData } = this.props.performance;
    if (technicianMetricsData === undefined || technicianMetricsData === null) {
      return 'N/A';
    }

    const value = technicianMetricsData.reduce((total, item) => parseInt(item[type]) + total, 0);
  }

  isActive(type) {
    const { rangePickerValue } = this.state;
    const value = getTimeDistance(type);
    if (!rangePickerValue[0] || !rangePickerValue[1]) {
      return '';
    }
    if (
      rangePickerValue[0].isSame(value[0], 'day')
      && rangePickerValue[1].isSame(value[1], 'day')
    ) {
      return styles.currentDate;
    }
    return '';
  }

  getAreaGeoInfo = () => {
    const { selectedAreaId } = this.props;

    const { dispatch } = this.props;

    dispatch({
      type: 'geo/getCenter',
      areaId: selectedAreaId,
    });
  }

  render() {
    const {
      performance,
    } = this.props;

    const {
      technicianMetricsData,
    } = performance;

    const SalesExtra = (
      <div className={styles.salesExtraWrap}>
        <div className={styles.salesExtra}>
          <a
            className={this.isActive('day')}
            onClick={() => this.selectDate('day')}
          >
            <FormattedMessage
              id="app.analysis.all-day"
              defaultMessage="All Day"
            />
          </a>
          <a
            className={this.isActive('week')}
            onClick={() => this.selectDate('week')}
          >
            <FormattedMessage
              id="app.analysis.all-week"
              defaultMessage="All Week"
            />
          </a>
          <a
            className={this.isActive('month')}
            onClick={() => this.selectDate('month')}
          >
            <FormattedMessage
              id="app.analysis.all-month"
              defaultMessage="All Month"
            />
          </a>
          <a
            className={this.isActive('year')}
            onClick={() => this.selectDate('year')}
          >
            <FormattedMessage
              id="app.analysis.all-year"
              defaultMessage="All Year"
            />
          </a>
        </div>
        <RangePicker
          value={this.state.rangePickerValue}
          onChange={this.handleRangePickerChange}
          style={{ width: 256 }}
        />
      </div>
    );

    const getMarkers = () => {
      if (technicianMetricsData) {
        const totalItems = technicianMetricsData.map((technician) => {
          const { actions } = technician.actionData;
          const { technicianId } = technician;
          const markerItems = actions.map(action => ({
            name: `${technician.firstName} ${technician.lastName}`,
            technicianId,
            action,
          }));
          return markerItems;
        });
        const flattened = totalItems.flat();
        return flattened;
      }
      return [];
    };


    const renderMarkers = markerData => markerData.map((marker) => {
      const date = moment(marker.date).format('h:mm A MM/DD/YYYY');
      const actionType = technicianActionTypes[marker.action.actionType];
      return (
        <CustomMarker
          date={date}
          actionType={actionType}
          name={marker.name}
          value={marker}
          onClick={this.handlePopupOpen}
          position={marker.action.location}
        />
      );
    });

    const ActionMap = compose(
      withProps({
        googleMapURL:
            'https://maps.googleapis.com/maps/api/js?key=AIzaSyDdCuc9RtkM-9wV9e3OrULPj67g2CHIdZI&v=3.exp&libraries=geometry,drawing,places,visualization',
        loadingElement: <div style={{ height: '100%' }} />,
        containerElement: <div style={{ height: '400px' }} />,
        mapElement: <div style={{ height: '100%', width: '100%' }} />,
      }),
      withScriptjs,
      withGoogleMap,
    )((props) => {
      const {
        center,
        markers,
      } = props;

      return (
        <GoogleMap
          defaultZoom={13}
          center={center || defaultCenter}
        >
          {markers}
        </GoogleMap>
      );
    });

    const { geo } = this.props;

    const mapCenter = geo.area && geo.area.center;

    const markerData = getMarkers();

    const Markers = renderMarkers(markerData);
    return (
      <GridContent>
        <Card>
          <Tabs
            tabBarExtraContent={SalesExtra}
            size="large"
            tabBarStyle={{ marginBottom: 24 }}
          >
            <TabPane
              tab="Technicians"
              key="Technicians"
            >
              <StandardTable
                data={{ list: this.props.performance.technicianMetricsData }}
                columns={this.columns}
                scroll={{ x: 1300 }}
              />
            </TabPane>
            <TabPane
              tab="Action Map"
              key="Map"
            >
              <ActionMap
                center={mapCenter}
                markers={Markers}
              />
            </TabPane>
          </Tabs>
        </Card>
      </GridContent>);
  }
}


export default TechMetrics;
