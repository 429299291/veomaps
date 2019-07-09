import React, { Component } from "react";
import { connect } from "dva";
import { formatMessage, FormattedMessage } from "umi/locale";
import { getAuthority } from "@/utils/authority";
import numeral from "numeral";
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

import Trend from "@/components/Trend";

import styles from "./Dashboard.less";
import { compose, withProps } from "recompose";
import { GoogleMap, Marker, Polygon, Polyline, withGoogleMap, withScriptjs, InfoWindow } from "react-google-maps";

const Option = Select.Option;

const {RangePicker} = DatePicker;

const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 6,
  style: { marginBottom: 24 }
};

import {fenceType, fenceTypeColor} from "@/constant";

import { exportCSVFile } from "../../utils/utils";
import moment from "moment";
import VehicleMap from "@/components/Map/VehicleMap";

const authority = getAuthority();

const { TabPane } = Tabs;

@connect(({ areas, dashboard, geo, loading, chart }) => ({
  dashboard,
  selectedAreaId: areas.selectedAreaId,
  areaNames: areas.areaNames,
  barChartloading: loading.models.areas || loading.effects["dashboard/fetchRideCount"] || loading.effects["dashboard/fetchCustomerCount"] ,
  activeRideCountLoading:  loading.models.areas || loading.effects["dashboard/fetchDailyRideCounts"],
  dailyBatteryStateLoading:  loading.models.areas || loading.effects["dashboard/fetchDailyBatteryState"],
  revenueLoading:  loading.models.areas || loading.effects["dashboard/fetchRevenue"]
}))
class Dashboard extends Component {


  constructor(props) {
    super(props);
  }

  state = {
    rangePickerValue: getTimeDistance("month"),
    offset: (new Date().getTimezoneOffset()) / -60,
    countParams:  {period: 'month'}
  };

  componentDidMount() {
    const { selectedAreaId } = this.props;
    

    const { dispatch } = this.props;

    this.reqRef = requestAnimationFrame(() => {
     
      this.loadBarCharData();

      this.loadDailyRideCount();

      this.loadDailyBatteryStatus();

      this.loadDailyRevenue();

      this.timeoutId = setTimeout(() => {
        this.setState({
          loading: false
        });
      }, 600);

      this.pollingId = setInterval(()=> {
        this.loadDailyRideCount();
        this.loadDailyBatteryStatus();
      },5000);

    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: "dashboard/clear"
    });
    cancelAnimationFrame(this.reqRef);
    clearTimeout(this.timeoutId);
    clearInterval(this.pollingId);
  }

  loadBarCharData() {
    this.fetchRideCount();
    this.fetchCustomerCount();
    this.fetchRidePerVehicleRank();
  }

  loadDailyRideCount() {
      const { dispatch, selectedAreaId } = this.props;

      if (!authority.includes("get.daily.ride.count")) {
        return;
      }

    dispatch({
      type: "dashboard/fetchDailyRideCounts",
      params: {
        areaId: selectedAreaId,
        midnight: moment().startOf("day").unix()
      }
    });

  }

  loadDailyRevenue() {
    const { dispatch, selectedAreaId } = this.props;

    if (!authority.includes("get.stripe.revenue")) {
      return;
    }

  dispatch({
    type: "dashboard/fetchRevenue",
    params: {
      areaId: selectedAreaId,
      midnight: moment().startOf("day").unix()
    }
  });

}

  loadDailyBatteryStatus() {
    const { dispatch, selectedAreaId } = this.props;

    const { offset } = this.state;

    if (!authority.includes("get.daily.battery.state")) {
      return;
    }

  dispatch({
    type: "dashboard/fetchDailyBatteryState",
    params: {
      areaId: selectedAreaId,
      midnight: moment().startOf("day").unix(),
      offset: offset
    }
  });

}


  fetchRideCount() {
    const { dispatch, selectedAreaId } = this.props;

    const {countParams, offset, rangePickerValue} = this.state;


     if (!authority.includes("get.ride.count")) {
       return;
     }

    dispatch({
      type: "dashboard/fetchRideCount",
      params: Object.assign(
        {}, 
        countParams, 
        { 
          offset: offset, 
          areaId: selectedAreaId,
          start: rangePickerValue[0].unix(),
          end: rangePickerValue[1].unix(), 
        })
    });
  }

  fetchCustomerCount() {
    const { dispatch, selectedAreaId } = this.props;

    const {countParams, offset, rangePickerValue} = this.state;

    if (!authority.includes("get.customer.count")) {
      return;
    }

    dispatch({
      type: "dashboard/fetchCustomerCount",
      params: Object.assign(
        {}, 
        countParams, 
        { 
          offset: offset, 
          areaId: selectedAreaId,
          start: rangePickerValue[0].unix(),
          end: rangePickerValue[1].unix(), 
        })
    });
  }

  fetchRidePerVehicleRank() {
    const { dispatch, selectedAreaId } = this.props;

    const {rangePickerValue} = this.state;

    if (!authority.includes("get.ride.vehicle.rank")) {
      return;
    }

    dispatch({
      type: "dashboard/getRidePerVehicleRank",
      params: Object.assign(
        {}, 
        { 
          start: rangePickerValue[0].unix(),
          end: rangePickerValue[1].unix(), 
        })
    });
  }

  


  componentDidUpdate(prevProps, prevState, snapshot) {
    if ((prevProps.selectedAreaId !== this.props.selectedAreaId)) {
      this.loadBarCharData();
      this.loadDailyRideCount();
      this.loadDailyRevenue();
      this.loadDailyBatteryStatus();
    }
  }


  setClickedMarker = vehicleNumber => {
    this.setState({selectedMarker: vehicleNumber})
  }

  selectDate = type => {
    const { dispatch } = this.props;
    this.setState({
      countParams: {...this.state.rideCountParams, period: type},
      rangePickerValue: getTimeDistance(type)

    }, this.loadBarCharData);
  };


  isActive(type) {
    const { rangePickerValue } = this.state;
    const value = getTimeDistance(type);
    if (!rangePickerValue[0] || !rangePickerValue[1]) {
      return "";
    }
    if (
      rangePickerValue[0].isSame(value[0], "day") &&
      rangePickerValue[1].isSame(value[1], "day")
    ) {
      return styles.currentDate;
    }
    return "";
  }

  handleRangePickerChange = rangePickerValue => {
    const { dispatch } = this.props;
    this.setState({
      rangePickerValue
    }, this.loadBarCharData);

  
  };


  render() {
    const {
      selectedAreaId,
      geo,
      areaNames,
      barChartloading,
      activeRideCountLoading,
      dashboard,
      revenueLoading
    } = this.props;


    const {
      rangePickerValue,
    } = this.state;

    const salesExtra = (
      <div className={styles.salesExtraWrap}>
        <div className={styles.salesExtra}>
          <a
            className={this.isActive("day")}
            onClick={() => this.selectDate("day")}
          >
            <FormattedMessage
              id="app.analysis.all-day"
              defaultMessage="All Day"
            />
          </a>
          <a
            className={this.isActive("week")}
            onClick={() => this.selectDate("week")}
          >
            <FormattedMessage
              id="app.analysis.all-week"
              defaultMessage="All Week"
            />
          </a>
          <a
            className={this.isActive("month")}
            onClick={() => this.selectDate("month")}
          >
            <FormattedMessage
              id="app.analysis.all-month"
              defaultMessage="All Month"
            />
          </a>
          <a
            className={this.isActive("year")}
            onClick={() => this.selectDate("year")}
          >
            <FormattedMessage
              id="app.analysis.all-year"
              defaultMessage="All Year"
            />
          </a>
        </div>
        <RangePicker
          value={rangePickerValue}
          onChange={this.handleRangePickerChange}
          style={{ width: 256 }}
        />
      </div>
    );
    
      let dayDiff = rangePickerValue[1].diff(rangePickerValue[0], 'days');

      if (dayDiff === 0) dayDiff = 1;


      const dailyRideCount = dashboard.dailyRideCount;

      const dailyBatteryState = dashboard.dailyBatteryState;

      const stripeRevenue = dashboard.stripeRevenue;

      let totalBatterySwap = 0;

      const dailyBatterySwap = dailyBatteryState.dailyBatterySwap
      &&  dailyBatteryState.dailyBatterySwap
      .map( group => {
        totalBatterySwap += group.total;
        return {x: group.hour > 12 ? (group.hour % 12) + " PM" : group.hour + " AM", y: group.total}
      });

    return (
      <GridContent >
        <Row gutter={24} style={{marginTop: "2em"}}>
          {authority.includes("get.daily.ride.count") && 
            <Col {...topColResponsiveProps}>
              <ChartCard
                bordered={false}
                title="Current Active Rides"
                action={
                  <Tooltip
                    title="introduce" 
                  >
                    <Icon type="info-circle-o" />
                  </Tooltip>
                }
                loading={false}
                total={dailyRideCount.currentActiveRideCount}
                footer={
                  <Field
                    label="Total Ride Today"
                    value={`${dailyRideCount.todayRideCount}`}
                  />
                }
                contentHeight={60}
              >
                <Trend flag={dailyRideCount.todayRideCount - dailyRideCount.lastWeekRideCount > 0 ? "up" : "down"} style={{ marginRight: 16 }}>
                  <FormattedMessage
                    id="app.analysis.week"
                    defaultMessage="Weekly Changes"
                  />
                  <span className={styles.trendText}> {Math.round(((dailyRideCount.todayRideCount - dailyRideCount.lastWeekRideCount) /dailyRideCount.lastWeekRideCount) * 100)}%</span>
                </Trend>
                <Trend flag={dailyRideCount.todayRideCount - dailyRideCount.yesterdayRideCount > 0 ? "up" : "down"}>
                  <FormattedMessage
                    id="app.analysis.day"
                    defaultMessage="Daily Changes"
                  />
                  <span className={styles.trendText}>{Math.round(((dailyRideCount.todayRideCount - dailyRideCount.yesterdayRideCount) /dailyRideCount.yesterdayRideCount) * 100)}%</span>
                </Trend>
              </ChartCard>
            </Col>
          }
          {authority.includes("get.daily.battery.state") && 
              <Col {...topColResponsiveProps}>
                <ChartCard
                  bordered={false}
                  loading={false}
                  title={
                    "Total Battery Swap Today"
                  }
                  action={
                    <Tooltip
                      title={
                        <FormattedMessage
                          id="app.analysis.introduce"
                          defaultMessage="introduce"
                        />
                      }
                    >
                      <Icon type="info-circle-o" />
                    </Tooltip>
                  }
                  total={numeral(totalBatterySwap).format("0,0")}
                  footer={
                    <Field
                      label="Low Battery Vehicles"
                      value={numeral(dailyBatteryState.lowBatteryCount).format("0,0")}
                    />
                  }
                  contentHeight={60}
                >
                  <MiniArea color="#975FE4" data={dailyBatterySwap} />
                </ChartCard>
              </Col>

            }

          {authority.includes("get.stripe.revenue") && stripeRevenue &&
            <Col {...topColResponsiveProps}>
              <ChartCard
                bordered={false}
                title="Today's Revenue"
                action={
                  <Tooltip
                    title="introduce" 
                  >
                    <Icon type="info-circle-o" />
                  </Tooltip>
                }
                loading={false}
                total={ revenueLoading ? "loading" : (stripeRevenue.dailyRevenue / 100)}
                footer={
                  <Field
                    label="Total Revenue"
                    value={`${stripeRevenue.totalRevenue  / 100}`}
                  />
                }
                contentHeight={60}
              >
                <Trend flag={stripeRevenue.dailyRevenue - stripeRevenue.lastWeekRevenue > 0 ? "up" : "down"} style={{ marginRight: 16 }}>
                  <FormattedMessage
                    id="app.analysis.week"
                    defaultMessage="Weekly Changes"
                  />
                  <span className={styles.trendText}> {Math.round(((stripeRevenue.dailyRevenue - stripeRevenue.lastWeekRevenue) /stripeRevenue.lastWeekRevenue) * 100)}%</span>
                </Trend>
                <Trend flag={stripeRevenue.dailyRevenue - stripeRevenue.yesterdayRevenue > 0 ? "up" : "down"}>
                  <FormattedMessage
                    id="app.analysis.day"
                    defaultMessage="Daily Changes"
                  />
                  <span className={styles.trendText}>{Math.round(((stripeRevenue.dailyRevenue - stripeRevenue.yesterdayRevenue) /stripeRevenue.yesterdayRevenue) * 100)}%</span>
                </Trend>
              </ChartCard>
            </Col>
          }

          {/* <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              loading={loading}
              title={
                <FormattedMessage
                  id="app.analysis.payments"
                  defaultMessage="Payments"
                />
              }
              action={
                <Tooltip
                  title={
                    <FormattedMessage
                      id="app.analysis.introduce"
                      defaultMessage="Introduce"
                    />
                  }
                >
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              total={numeral(6560).format("0,0")}
              footer={
                <Field
                  label={
                    <FormattedMessage
                      id="app.analysis.conversion-rate"
                      defaultMessage="Conversion Rate"
                    />
                  }
                  value="60%"
                />
              }
              contentHeight={46}
            >
              <MiniBar data={visitData} />
            </ChartCard>
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              loading={loading}
              bordered={false}
              title={
                <FormattedMessage
                  id="app.analysis.operational-effect"
                  defaultMessage="Operational Effect"
                />
              }
              action={
                <Tooltip
                  title={
                    <FormattedMessage
                      id="app.analysis.introduce"
                      defaultMessage="introduce"
                    />
                  }
                >
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              total="78%"
              footer={
                <div style={{ whiteSpace: "nowrap", overflow: "hidden" }}>
                  <Trend flag="up" style={{ marginRight: 16 }}>
                    <FormattedMessage
                      id="app.analysis.week"
                      defaultMessage="Weekly changes"
                    />
                    <span className={styles.trendText}>12%</span>
                  </Trend>
                  <Trend flag="down">
                    <FormattedMessage
                      id="app.analysis.day"
                      defaultMessage="Weekly changes"
                    />
                    <span className={styles.trendText}>11%</span>
                  </Trend>
                </div>
              }
              contentHeight={46}
            >
              <MiniProgress
                percent={78}
                strokeWidth={8}
                target={80}
                color="#13C2C2"
              />
            </ChartCard>
          </Col> */}
        </Row>


        { 
          (authority.includes("get.ride.count") || authority.includes("get.ride.count")) && 
          
          <Card loading={barChartloading} bordered={false} bodyStyle={{ padding: 0 }}>
          <div className={styles.salesCard}>
            <Tabs
              tabBarExtraContent={salesExtra}
              size="large"
              tabBarStyle={{ marginBottom: 24 }}
            >
             { authority.includes("get.ride.count") &&  <TabPane
                tab={
                  <FormattedMessage
                    id="app.analysis.sales"
                    defaultMessage="Sales"
                  />
                }
                key="rides"
              >
                <Row>
                  <Col xl={16} lg={12} md={12} sm={24} xs={24}>
                    <div className={styles.salesBar}>
                      <Bar
                        height={295}
                        title={
                          <FormattedMessage
                            id="app.dashboard.rides-trend"
                            defaultMessage="Rides Trend"
                          />
                        }
                        data={dashboard.rideCountData}
                      />
                    </div>
                  </Col>
                 {authority.includes("get.ride.vehicle.rank") &&  
                  <Col xl={8} lg={12} md={12} sm={24} xs={24}>
                      <div className={styles.salesRank}>
                        <h4 className={styles.rankingTitle}>
                          <FormattedMessage
                            id="app.dashboard.rides-ranking"
                            defaultMessage="Rides Ranking"
                          />
                        </h4>
                        <ul className={styles.rankingList} style={{height:200, marginBottom: "20px", overflow: "scroll"}}>
                          {dashboard.ridePerVehicleRank.map((item, i) => (
                            <li key={item.areaId}>
                              <span
                                className={`${styles.rankingItemNumber} ${
                                  i < 3 ? styles.active : ""
                                }`}
                              >
                                {i + 1}
                              </span>
                              <span
                                className={styles.rankingItemTitle}
                                title={areaNames[item.areaId]}
                              >
                                {areaNames[item.areaId]}
                              </span>
                              <span className={styles.rankingItemValue}>
                                {numeral(item.avgRides / dayDiff).format("0,0.00")}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </Col>
                 }
                </Row>
              </TabPane> }
              { 
                authority.includes("get.ride.count") &&  <TabPane
                  tab={
                    <FormattedMessage
                      id="app.dashboard.customers"
                      defaultMessage="Customers"
                    />
                  }
                  key="customers"
                >
                  <Row>
                    <Col xl={16} lg={12} md={12} sm={24} xs={24}>
                      <div className={styles.salesBar}>
                        <Bar
                          height={292}
                          title={
                            <FormattedMessage
                              id="app.dashboard.customers-trend"
                              defaultMessage="Customer Trend"
                            />
                          }
                          data={dashboard.customerCountData}
                        />
                      </div>
                    </Col>
                    {authority.includes("get.ride.vehicle.rank") &&  
                      <Col xl={8} lg={12} md={12} sm={24} xs={24}>
                          <div className={styles.salesRank}>
                            <h4 className={styles.rankingTitle}>
                              <FormattedMessage
                                id="app.dashboard.rides-ranking"
                                defaultMessage="Rides Ranking"
                              />
                            </h4>
                            <ul className={styles.rankingList} style={{height:200, marginBottom: "20px", overflow: "scroll"}}>
                              {dashboard.ridePerVehicleRank.map((item, i) => (
                                <li key={item.areaId}>
                                  <span
                                    className={`${styles.rankingItemNumber} ${
                                      i < 3 ? styles.active : ""
                                    }`}
                                  >
                                    {i + 1}
                                  </span>
                                  <span
                                    className={styles.rankingItemTitle}
                                    title={areaNames[item.areaId]}
                                  >
                                    {areaNames[item.areaId]}
                                  </span>
                                  <span className={styles.rankingItemValue}>
                                    {numeral(item.avgRides / dayDiff).format("0,0.00")}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                    </Col>
                    }
                  </Row>
                  </TabPane> 
              }
            </Tabs>
          </div>
        </Card>
      }
      </GridContent>);
  }

}


export default Dashboard;