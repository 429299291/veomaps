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
import 'moment-timezone';
import VehicleMap from "@/components/Map/VehicleMap";

const authority = getAuthority();

const { TabPane } = Tabs;

@connect(({ areas, dashboard, geo, loading, chart }) => ({
  dashboard,
  selectedAreaId: areas.selectedAreaId,
  areaNames: areas.areaNames,
  barChartloading: loading.models.areas || loading.effects["dashboard/fetchRideCount"] || loading.effects["dashboard/fetchCustomerCount"] ,
  activeRideCountLoading:  loading.models.areas || loading.effects["dashboard/fetchDailyRideCounts"],
  weeklyBatteryStateLoading:  loading.models.areas || loading.effects["dashboard/fetchWeeklyBatteryState"],
  currentActiveRideLoading: loading.models.areas || loading.effects["dashboard/fetchDailyRideCounts"],
  weeklyBatterySwapLoading: loading.models.areas || loading.effects["dashboard/fetchWeeklyBatteryState"],
  stripeRevenueLoading: loading.models.areas || loading.effects["dashboard/fetchStripeDailyRevenue"],
  dailyRideRevenueLoading: loading.models.areas || loading.effects["dashboard/fetchDailyRideRevenue"],
  totalAreaMinutesLoading: loading.models.areas || loading.effects["dashboard/areaTotalMinutes"],
  totalAreaDistanceLoading: loading.models.areas || loading.effects["dashboard/areaTotalDistance"],
}))
class Dashboard extends Component {


  constructor(props) {
    super(props);
  }

  state = {
    rangePickerValue: getTimeDistance("month"),
    offset: ((new Date().getTimezoneOffset()) / -60) + 1,
    countParams:  {period: 'month'}
  };

  componentDidMount() {
    const { selectedAreaId } = this.props;
    

    const { dispatch } = this.props;

    this.reqRef = requestAnimationFrame(() => {
     
      this.loadBarCharData();

      this.loadDailyRideCount();

      this.loadWeeklyBatteryStatus();

      this.loadStripeRevenue();

      this.loadDailyRideRevenue();
      

      this.timeoutId = setTimeout(() => {
        this.setState({
          loading: false
        });
      },2000);

      this.pollingId = setInterval(()=> {
        this.loadDailyRideCount();
        this.loadWeeklyBatteryStatus();
        this.loadDailyRideRevenue();
        this.loadStripeRevenue();
        this.setState({areaIsChanged: false});
      },30000);

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
    this.getStripeRevenueByPeriod();
    this.fetchRidePerVehicleRank();
    this.getConnectivityByPeriod();
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
        midnight: moment().tz("America/Chicago").startOf("day").unix()
      }
    });

  }

  loadRideDailyRevenue() {
        const { dispatch, selectedAreaId } = this.props;

        if (!authority.includes("get.daily.ride.revenue")) {
          return;
        }

      dispatch({
        type: "dashboard/fetchDailyRideRevenue",
        params: {
          areaId: selectedAreaId,
          midnight: moment().tz("America/Chicago").startOf("day").unix()
        }
      });
  }


  loadStripeRevenue() {

    const { dispatch, selectedAreaId } = this.props;

    if (!authority.includes("get.stripe.revenue")) {
      return;
    }

      dispatch({
        type: "dashboard/fetchStripeDailyRevenue",
        params: {
          areaId: selectedAreaId,
          midnight: moment().tz("America/Chicago").startOf("day").unix()
        }
      });

  }

  loadDailyRideRevenue() {

    const { dispatch, selectedAreaId } = this.props;

    if (!authority.includes("get.daily.ride.revenue")) {
      return;
    }

      dispatch({
        type: "dashboard/fetchDailyRideRevenue",
        params: {
          areaId: selectedAreaId,
          midnight: moment().tz("America/Chicago").startOf("day").unix()
        }
      });

  }

  loadWeeklyBatteryStatus() {
    const { dispatch, selectedAreaId } = this.props;

    const { offset } = this.state;

    if (!authority.includes("get.weekly.battery.state")) {
      return;
    }

  dispatch({
    type: "dashboard/fetchWeeklyBatteryState",
    params: {
      areaId: selectedAreaId,
      midnight: moment().subtract(7,'d').unix(),
      offset: offset
    }
  });

}

getRangeEnd(end) {

  const curr = moment();

  return end.diff(curr, 'seconds') > 0 ? curr : end;
  
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
          end: rangePickerValue[1].unix()
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

  getStripeRevenueByPeriod() {

    const { dispatch, selectedAreaId } = this.props;

    const {countParams, offset, rangePickerValue} = this.state;

    if (!authority.includes("get.stripe.revenue.by.period")) {
      return;
    }

    dispatch({
      type: "dashboard/fetchStripRevenueByPeriod",
      params: Object.assign(
        {}, 
        countParams, 
        { 
          offset: offset, 
          areaId: selectedAreaId  ? selectedAreaId : -1,
          start: rangePickerValue[0].unix(),
          end: rangePickerValue[1].unix(), 
        })
    });

  }


  getConnectivityByPeriod() {

    const { dispatch, selectedAreaId } = this.props;

    const {countParams, offset, rangePickerValue} = this.state;

    if (!authority.includes("get.connectivity.by.period")) {
      return;
    }

    dispatch({
      type: "dashboard/fetchConnectivityByPeriod",
      params: Object.assign(
        {}, 
        countParams, 
        { 
          offset: offset, 
          areaId: selectedAreaId  ? selectedAreaId : -1,
          start: rangePickerValue[0].unix(),
          end: rangePickerValue[1].unix(), 
        })
    });



  }

  fetchAreaMinutes() {
    const { dispatch, selectedAreaId } = this.props;
    const { rangePickerValue } = this.state;

    if (!authority.includes("get.area.minutes")) {
      return;
    }

    dispatch({
      type: "dashboard/fetchAreaMinutes",
      params: Object.assign(
        {}, 
        {
          areaId: selectedAreaId,
          start: rangePickerValue[0].unix() * 1000,
          end: rangePickerValue[1].unix() * 1000, 
        })
    });

  }

  fetchAreaDistance() {
    const { dispatch, selectedAreaId } = this.props;
    const { rangePickerValue } = this.state;

    if (!authority.includes("get.area.distance")) {
      return;
    }


    dispatch({
      type: "dashboard/fetchAreaDistance",
      params: Object.assign(
        {}, 
        {
          areaId: selectedAreaId,
          start: rangePickerValue[0].unix() * 1000,
          end: rangePickerValue[1].unix() * 1000, 
        })
    });
  }

  fetchRidePerVehicleRank() {
    const { dispatch, selectedAreaId } = this.props;

    const {rangePickerValue, offset} = this.state;

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
          offset: offset
        })
    });
  }
  

  componentDidUpdate(prevProps, prevState, snapshot) {
    if ((prevProps.selectedAreaId !== this.props.selectedAreaId)) {
      this.loadBarCharData();
      this.loadDailyRideCount();
      this.loadWeeklyBatteryStatus();
      this.loadDailyRideRevenue();
      this.loadStripeRevenue();
      this.fetchAreaDistance();
      this.fetchAreaMinutes();
      this.setState({areaIsChanged: true});
    }
    if (prevState.rangePickerValue !== this.state.rangePickerValue) {
      this.fetchAreaDistance();
      this.fetchAreaMinutes();
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


  getRankingBoard = () => {

    const { dashboard, areaNames } = this.props;

  return authority.includes("get.ride.vehicle.rank") &&
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
                            {numeral(item.avgRides).format("0,0.00")}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Col>
  }



  render() {
    const {
      selectedAreaId,
      geo,
      areaNames,
      barChartloading,
      activeRideCountLoading,
      dashboard,
      stripeRevenueLoading,
      currentActiveRideLoading,
      weeklyBatterySwapLoading,
      dailyRideRevenueLoading
    } = this.props;


    const {
      rangePickerValue,
      areaIsChanged
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


    const formatDistance = (distance) => {
      if (distance === null || distance === undefined) {
        return null;
      } else { 
        return distance.toFixed(2);
      }
    } 
                              
                 
    
      let dayDiff = this.getRangeEnd(rangePickerValue[1]).diff(rangePickerValue[0], 'days');

      if (dayDiff === 0) dayDiff = 1;


      const dailyRideCount = dashboard.dailyRideCount;

      const batteryState = dashboard.batteryState;

      const stripeRevenue = dashboard.stripeRevenue;

      const dailyRideRevenue = dashboard.dailyRideRevenue;

      const totalRideMinutes = dashboard.totalRideMinutes;

      const totalRideDistance = dashboard.totalRideDistance;
      
      const weeklyBatterySwap = batteryState.weeklyBatterySwap
      &&  batteryState.weeklyBatterySwap
      .map( group => {
        return {x: moment().dayOfYear(group.dayOfYear).format("MM/DD"), y: group.total};
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
                total={activeRideCountLoading ? "loading" :  dailyRideCount.currentActiveRideCount}
                footer={
                  <Field
                    label="Total Ride Today"
                    value={activeRideCountLoading ? "loading" : `${dailyRideCount.todayRideCount}`}
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
          {authority.includes("get.weekly.battery.state") && weeklyBatterySwap &&
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
                  total={weeklyBatterySwapLoading ? "loading" : (weeklyBatterySwap[weeklyBatterySwap.length - 1] && numeral(weeklyBatterySwap[weeklyBatterySwap.length - 1].y).format("0,0"))}
                  footer={
                    <Field
                      label="Low Battery Vehicles"
                      value={weeklyBatterySwapLoading ? "loading" : numeral(batteryState.lowBatteryCount).format("0,0")}
                    />
                  }
                  contentHeight={60}
                >
                  <MiniBar color="#975FE4" data={weeklyBatterySwap} />
                </ChartCard>
              </Col>

            }

          {authority.includes("get.stripe.revenue") && stripeRevenue &&
            <Col {...topColResponsiveProps}>
              <ChartCard
                bordered={false}
                title="Today's Stripe Revenue"
                action={
                  <Tooltip
                    title="introduce" 
                  >
                    <Icon type="info-circle-o" />
                  </Tooltip>
                }
                loading={stripeRevenueLoading}
                total={ stripeRevenueLoading ? "loading" : (stripeRevenue.dailyRevenue / 100)}
                footer={
                  <Field
                    label="Total Revenue"
                    value={stripeRevenueLoading ? "loading" : `${stripeRevenue.totalRevenue  / 100}`}
                  />
                }
                contentHeight={60}
              >
                <Trend flag={stripeRevenue.dailyRevenue - stripeRevenue.lastWeekRevenue > 0 ? "up" : "down"} style={{ marginRight: 16 }}>
                  <FormattedMessage
                    id="app.analysis.week"
                    defaultMessage="Weekly Changes"
                  />
                  <span className={styles.trendText}> {stripeRevenueLoading ? "loading" : Math.round(((stripeRevenue.dailyRevenue - stripeRevenue.lastWeekRevenue) /stripeRevenue.lastWeekRevenue) * 100)}%</span>
                </Trend>
                <Trend flag={stripeRevenue.dailyRevenue - stripeRevenue.yesterdayRevenue > 0 ? "up" : "down"}>
                  <FormattedMessage
                    id="app.analysis.day"
                    defaultMessage="Daily Changes"
                  />
                  <span className={styles.trendText}>{stripeRevenueLoading ? "loading"  : Math.round(((stripeRevenue.dailyRevenue - stripeRevenue.yesterdayRevenue) /stripeRevenue.yesterdayRevenue) * 100)}%</span>
                </Trend>
              </ChartCard>
            </Col>
          }

        {authority.includes("get.daily.ride.revenue") && dailyRideRevenue &&
            <Col {...topColResponsiveProps}>
              <ChartCard
                bordered={false}
                title="Today's Ride Revenue"
                action={
                  <Tooltip
                    title="introduce" 
                  >
                    <Icon type="info-circle-o" />
                  </Tooltip>
                }
                loading={dailyRideRevenueLoading}
                total={ dailyRideRevenueLoading ? "loading" : (dailyRideRevenue.dailyRevenue)}
                footer={
                  <Field
                    label="Total Revenue"
                    value={`${dailyRideRevenue.totalRevenue }`}
                  />
                }
                contentHeight={60}
              >
                <Trend flag={dailyRideRevenue.dailyRevenue - dailyRideRevenue.lastWeekRevenue > 0 ? "up" : "down"} style={{ marginRight: 16 }}>
                  <FormattedMessage
                    id="app.analysis.week"
                    defaultMessage="Weekly Changes"
                  />
                  <span className={styles.trendText}> {Math.round(((dailyRideRevenue.dailyRevenue - dailyRideRevenue.lastWeekRevenue) /dailyRideRevenue.lastWeekRevenue) * 100)}%</span>
                </Trend>
                <Trend flag={dailyRideRevenue.dailyRevenue - dailyRideRevenue.yesterdayRevenue > 0 ? "up" : "down"}>
                  <FormattedMessage
                    id="app.analysis.day"
                    defaultMessage="Daily Changes"
                  />
                  <span className={styles.trendText}>{Math.round(((dailyRideRevenue.dailyRevenue - dailyRideRevenue.yesterdayRevenue) /dailyRideRevenue.yesterdayRevenue) * 100)}%</span>
                </Trend>
              </ChartCard>
            </Col>
          }
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
                 {this.getRankingBoard()}
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
                    {this.getRankingBoard()}
                  </Row>
                  </TabPane> 
              }

              { 
                authority.includes("get.stripe.revenue.by.period") &&  <TabPane
                  tab="Stripe Revenue"
                  key="revenue"
                >
                  <Row>
                    <Col xl={16} lg={12} md={12} sm={24} xs={24}>
                      <div className={styles.salesBar}>
                        <Bar
                          height={292}
                          title="Revenue Trend"
                          data={dashboard.stripeRevenueData}
                        />
                      </div>
                    </Col>
                   {this.getRankingBoard()}
                  </Row>
                  </TabPane> 
              }
              { 
                authority.includes("get.connectivity.by.period") &&  <TabPane
                  tab="Vehicle Connectivity"
                  key="connectivity"
                >
                  <Row>
                    <Col xl={16} lg={12} md={12} sm={24} xs={24}>
                      <div className={styles.salesBar}>
                        <Bar
                          height={292}
                          title="Connectivity Trend"
                          data={dashboard.connectivity}
                        />
                      </div>
                    </Col>
                    {this.getRankingBoard()}
                  </Row>
                  </TabPane> 
              }
              { 
              authority.includes("get.area.minutes") &&  <TabPane
                tab="Ride Metrics"
                key="metrics"
              >
                <Row>
                  <Col xl={16} lg={12} md={12} sm={24} xs={24}>
                    <div className={styles.salesBar}>
                    <span>
                      <h2>Total Ride Distance (miles)</h2>
                      <h3>{formatDistance(totalRideDistance.totalDistance)}</h3>
                    </span>
                    <span>
                      <h2>Total Ride Time (minutes)</h2>
                      <h3>{totalRideMinutes.totalMinutes}</h3>
                    </span>
                    </div>
                  </Col>
                  {this.getRankingBoard()}
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