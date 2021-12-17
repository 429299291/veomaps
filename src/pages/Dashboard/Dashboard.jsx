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

import {fenceType, fenceTypeColor, vehicleType} from "@/constant";

import { exportCSVFile } from "../../utils/utils";
import moment from "moment";
import 'moment-timezone';

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
    offset: ((new Date().getTimezoneOffset()) / -60),
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
      },10000);

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

  fetchTotalRideRevenue() {

    const { dispatch, selectedAreaId } = this.props;

    const { rangePickerValue} = this.state;


    //  if (!authority.includes("get.total.ride.revenue")) {
    //    return;
    //  }



    dispatch({
      type: "dashboard/fetchTotalRideRevenue",
      params: { 
        areaId: selectedAreaId,
        start: rangePickerValue[0].unix(),
        end: rangePickerValue[1].unix()
      }
    });

  }

  fetchCoupounSummary() {
    const { dispatch, selectedAreaId } = this.props;

    const { rangePickerValue} = this.state;


    // if (!authority.includes("get.promo.summary")) {
    //   return;
    // }

    dispatch({
      type: "dashboard/fetchPromoSummary",
      params: { 
        areaId: selectedAreaId,
        start: rangePickerValue[0].unix(),
        end: rangePickerValue[1].unix()
      }
    });

  }

  fetchStripeNetResult() {

    const { dispatch, selectedAreaId } = this.props;

    const { rangePickerValue} = this.state;


    // if (authority.includes("get.stripe.net.deposit") ) {

    // }

      dispatch({
        type: "dashboard/fetchStripeNetDeposit",
        params: { 
          areaId: selectedAreaId,
          start: rangePickerValue[0].unix(),
          end: rangePickerValue[1].unix()
        }
      });

 

    // if (authority.includes("get.stripe.net.charge") ) {

    // }
      dispatch({
        type: "dashboard/fetchStripeNetCharge",
        params: { 
          areaId: selectedAreaId,
          start: rangePickerValue[0].unix(),
          end: rangePickerValue[1].unix()
        }
      });



    // if (authority.includes("get.stripe.net.refund") ) {

    // }

      dispatch({
        type: "dashboard/fetchStripeNetRefund",
        params: { 
          areaId: selectedAreaId,
          start: rangePickerValue[0].unix(),
          end: rangePickerValue[1].unix()
        }
      });

   

    // if (authority.includes("get.stripe.net.dispute") ) {

    // }

      dispatch({
        type: "dashboard/fetchStripeNetDispute",
        params: { 
          areaId: selectedAreaId,
          start: rangePickerValue[0].unix(),
          end: rangePickerValue[1].unix()
        }
      });

   

  }

  fetchTotalRefund() {

    const { dispatch, selectedAreaId } = this.props;

    const { rangePickerValue} = this.state;

    dispatch({
      type: "dashboard/fetchTotalRefund",
      params: { 
        areaId: selectedAreaId,
        start: rangePickerValue[0].unix(),
        end: rangePickerValue[1].unix()
      }
    });
    
  }

  loadBarCharData() {
    this.fetchRideCount();
    this.fetchCustomerCount();
    this.getStripeRevenueByPeriod();
    this.fetchRidePerVehicleRank();
    this.getConnectivityByPeriod();
    this.fetchTotalRefund();
    this.fetchTotalRideRevenue();
    this.fetchCoupounSummary();

    if (this.props.selectedAreaId !== null) {
      // this.fetchAreaDistance();
      this.fetchAreaMinutes();
      this.fetchStripeNetResult();
    }
  
    
  }

  clearMinutesAndDistance() {
    const { dispatch } = this.props;
    dispatch({
      type: "dashboard/clearMinutesAndDistance"
    })
  }

  loadDailyRideCount() {
      const { dispatch, selectedAreaId } = this.props;
      // if (!authority.includes("get.daily.ride.count")) {
      //   return;
      // }
      let payload = selectedAreaId ? { areaIds : [selectedAreaId] }: {}
      payload = Object.assign(payload,{
        notEnded:true,
          "pagination": {
              "page": 0,
              "pageSize": 10,
              "sort": {
                  "sortBy": "start",
                  "direction": "desc"
              }
          }
      })
    dispatch({
      type: "dashboard/fetchDailyRideCounts",
      params: {
        ...payload
        // midnight: moment().tz("America/Chicago").startOf("day").unix()
      }
    });

  }

  loadRideDailyRevenue() {
        const { dispatch, selectedAreaId } = this.props;

        // if (!authority.includes("get.daily.ride.revenue")) {
        //   return;
        // }

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

    // if (!authority.includes("get.stripe.revenue")) {
    //   return;
    // }

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

    // if (!authority.includes("get.daily.ride.revenue")) {
    //   return;
    // }

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

    // if (!authority.includes("get.weekly.battery.state")) {
    //   return;
    // }

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


    //  if (!authority.includes("get.ride.count")) {
    //    return;
    //  }



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

  clear() {
    const { dispatch } = this.props;

    dispatch({
      type: "dashboard/clear"
    });
  }

  fetchCustomerCount() {
    const { dispatch, selectedAreaId } = this.props;

    const {countParams, offset, rangePickerValue} = this.state;

    // if (!authority.includes("get.customer.count")) {
    //   return;
    // }

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
    // if (!authority.includes("get.stripe.revenue.by.period")) {
    //   return;
    // }
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

    // if (!authority.includes("get.connectivity.by.period")) {
    //   return;
    // }

    // dispatch({
    //   type: "dashboard/fetchConnectivityByPeriod",
    //   params: Object.assign(
    //     {}, 
    //     countParams, 
    //     { 
    //       offset: offset, 
    //       areaId: selectedAreaId  ? selectedAreaId : -1,
    //       start: rangePickerValue[0].unix(),
    //       end: rangePickerValue[1].unix(), 
    //     })
    // });



  }



  fetchAreaMinutes() {
    const { dispatch, selectedAreaId } = this.props;
    const { rangePickerValue } = this.state;

    // if (!authority.includes("get.area.minutes")) {
    //   return;
    // }

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

    // if (!authority.includes("get.area.distance")) {
    //   return;
    // }


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

    // if (!authority.includes("get.ride.vehicle.rank")) {
    //   return;
    // }

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
      this.clear();
      this.loadBarCharData();
      this.loadDailyRideCount();
      this.loadWeeklyBatteryStatus();
      this.loadDailyRideRevenue();
      this.loadStripeRevenue();

      this.setState({areaIsChanged: true});
      if (this.props.selectedAreaId === null) {
        this.clearMinutesAndDistance();
      }
    
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
  return <Col xl={8} lg={12} md={12} sm={24} xs={24}>
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
      dailyRideRevenueLoading,
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


    const round2Decimal = raw => {

      if (!isNaN(raw)) {

       return Math.round(raw * 100) / 100;

      } else {

        return "loading";

      }

      

    }

    const formatDistance = (distance) => {
      if (distance === null || distance === undefined) {
        return null;
      } else { 
        return distance.toFixed(2);
      }
    } 

    const formatAllDayData = data => {
      const {countParams} = this.state;
      if (data === undefined || data.length === 0 ||  countParams.period !== "day" || isNaN(data[0].x)) {
        if (Array.isArray(data)) {
          const sortedData = [...data].sort((x, y) => {
            const xSplit = x.x.split("-");
            const ySplit = y.x.split("-");
            const xInt = (parseInt(xSplit[0]) * 10000) + (parseInt(xSplit[1]) * 100) + (parseInt(xSplit[2]));
            const yInt = (parseInt(ySplit[0]) * 10000) + (parseInt(ySplit[1]) * 100) + (parseInt(ySplit[2]));
            return xInt - yInt;
          });
          return sortedData;
        } else {
          return data;
        }
      } else {
          const result = 
            data.sort((x, y) => {
            const xInt = parseInt(x.x, 10); 
            const yInt = parseInt(y.x, 10); 
            return xInt - yInt
            })
            .map(item => {
              const intX = parseInt(item.x);
              const formatTime = (( intX - 1) % 12) + ((intX < 12) ? "AM" : "PM");
              item.temp = formatTime;
              item.x = formatTime;
              return item;
            })
            return result;
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
      console.log(dashboard.stripeRevenueData);
      console.log(weeklyBatterySwap);
      console.log(formatAllDayData(dashboard.stripeRevenueData));
      // weeklyBatterySwapLoading && console.log((weeklyBatterySwap[weeklyBatterySwap.length - 1] && numeral(weeklyBatterySwap[weeklyBatterySwap.length - 1].y).format("0,0")));
    return (
      <GridContent >
        <Row gutter={24} style={{marginTop: "2em"}}>
          {/*authority.includes("admin")&& */ 
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
                total={activeRideCountLoading ? "loading" :  dailyRideCount.totalSize}
                // footer={
                //   <Field
                //     label="Total Ride Today"
                //     value={activeRideCountLoading ? "loading" : `${dailyRideCount.todayRideCount}`}
                //   />
                // }
                // contentHeight={60}
              >
                {/* <Trend flag={dailyRideCount.todayRideCount - dailyRideCount.lastWeekRideCount > 0 ? "up" : "down"} style={{ marginRight: 16 }}>
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
                </Trend> */}
              </ChartCard>
            </Col>
          }
          {/*authority.includes("admin")&& */  weeklyBatterySwap &&
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
          {/*authority.includes("admin")&& */  stripeRevenue &&
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
                total={ stripeRevenueLoading ? "loading" : (stripeRevenue.todayRevenue / 100)}
                footer={
                  <Field
                    label="Total Revenue"
                    value={stripeRevenueLoading ? "loading" : `${stripeRevenue.totalRevenue  / 100}`}
                  />
                }
                contentHeight={60}
              >
                <Trend flag={stripeRevenue.todayRevenue - stripeRevenue.lastWeekTodayRevenue > 0 ? "up" : "down"} style={{ marginRight: 16 }}>
                  <FormattedMessage
                    id="app.analysis.week"
                    defaultMessage="Weekly Changes"
                  />
                  <span className={styles.trendText}> {stripeRevenueLoading ? "loading" : Math.round(((stripeRevenue.todayRevenue - stripeRevenue.lastWeekTodayRevenue) /stripeRevenue.lastWeekTodayRevenue) * 100)}%</span>
                </Trend>
                <Trend flag={stripeRevenue.todayRevenue - stripeRevenue.yesterdayRevenue > 0 ? "up" : "down"}>
                  <FormattedMessage
                    id="app.analysis.day"
                    defaultMessage="Daily Changes"
                  />
                  <span className={styles.trendText}>{stripeRevenueLoading ? "loading"  : Math.round(((stripeRevenue.todayRevenue - stripeRevenue.yesterdayRevenue) /stripeRevenue.yesterdayRevenue) * 100)}%</span>
                </Trend>
              </ChartCard>
            </Col>
          }

        {/*authority.includes("admin")&& */  dailyRideRevenue &&
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
                total={ dailyRideRevenueLoading ? "loading" : (dailyRideRevenue.todayRevenue)}
                footer={
                  <Field
                    label="Total Revenue"
                    value={`${round2Decimal(dailyRideRevenue.totalRevenue)}`}
                  />
                }
                contentHeight={60}
              >
                <Trend flag={dailyRideRevenue.todayRevenue - dailyRideRevenue.lastWeekTodayRevenue > 0 ? "up" : "down"} style={{ marginRight: 16 }}>
                  <FormattedMessage
                    id="app.analysis.week"
                    defaultMessage="Weekly Changes"
                  />
                  <span className={styles.trendText}> {Math.round(((dailyRideRevenue.todayRevenue - dailyRideRevenue.lastWeekTodayRevenue) /dailyRideRevenue.lastWeekTodayRevenue) * 100)}%</span>
                </Trend>
                <Trend flag={dailyRideRevenue.todayRevenue - dailyRideRevenue.yesterdayRevenue > 0 ? "up" : "down"}>
                  <FormattedMessage
                    id="app.analysis.day"
                    defaultMessage="Daily Changes"
                  />
                  <span className={styles.trendText}>{Math.round(((dailyRideRevenue.todayRevenue - dailyRideRevenue.yesterdayRevenue) /dailyRideRevenue.yesterdayRevenue) * 100)}%</span>
                </Trend>
              </ChartCard>
            </Col>
          }
        </Row>


        { 
          
          <Card loading={barChartloading} bordered={false} bodyStyle={{ padding: 0 }}>
          <div className={styles.salesCard}>
            <Tabs
              tabBarExtraContent={salesExtra}
              size="large"
              tabBarStyle={{ marginBottom: 24,marginLeft:30 }}
            >
             { /*authority.includes("admin")&& */  
             <TabPane
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
                        data={formatAllDayData(dashboard.rideCountData)}
                      />
                    </div>
                  </Col>
                 {areaNames && dashboard.ridePerVehicleRank && this.getRankingBoard()}
                </Row>
              </TabPane> }
              { 
                /*authority.includes("admin")&& */   <TabPane
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
                          data={formatAllDayData(dashboard.customerCountData)}
                        />
                      </div>
                    </Col>
                    {areaNames && dashboard.ridePerVehicleRank && this.getRankingBoard()}
                  </Row>
                  </TabPane> 
              }

              { 
                /*authority.includes("admin")&& */   <TabPane
                  tab="Stripe Revenue"
                  key="revenue"
                >
                  <Row>
                    <Col xl={16} lg={12} md={12} sm={24} xs={24}>
                      <div className={styles.salesBar}>
                        <Bar
                          height={292}
                          title="Revenue Trend"
                          data={formatAllDayData(dashboard.stripeRevenueData)}
                        />
                      </div>
                    </Col>
                   {areaNames && dashboard.ridePerVehicleRank && this.getRankingBoard()}
                  </Row>
                  </TabPane> 
              }
              {/* { 
                <TabPane
                  tab="Vehicle Connectivity"
                  key="connectivity"
                >
                  <Row>
                    <Col xl={16} lg={12} md={12} sm={24} xs={24}>
                      <div className={styles.salesBar}>
                        <Bar
                          height={292}
                          title="Connectivity Trend"
                          data={formatAllDayData(dashboard.connectivity)}
                        />
                      </div>
                    </Col>
                    {this.getRankingBoard()}
                  </Row>
                  </TabPane> 
              } */}
              { 
               /*authority.includes("admin")&& */ 
                <TabPane
                  tab="Finace Report"
                  key="financeStats"
                >
                  <Row>
                    <Col xl={16} lg={12} md={12} sm={24} xs={24}>
                      <div style={{marginLeft: "1em"}}>  Total Ride Revenue: { 
                        (dashboard.totalRideRevenue && Array.isArray(dashboard.totalRideRevenue))  ? 
                        dashboard.totalRideRevenue.map(result => `${vehicleType[result.vehicleType]} : ${round2Decimal(result.rideRevenue)}, ` )  :
                        
                        "loading"
                        } </div>
                        
                      <div style={{marginLeft: "1em"}}> Total Refund to Card: {round2Decimal(dashboard.totalRefund.refundToCard)} </div>

                      <div style={{marginLeft: "1em"}}> Total Refund to Deposit: {round2Decimal(dashboard.totalRefund.refundToDeposit)} </div>

                      {selectedAreaId &&
                          <div>

                            <div style={{marginLeft: "1em"}}> Stripe Gross Volumne: {round2Decimal(dashboard.stripeNetDeposit / 100)} </div>

                            <div style={{marginLeft: "1em"}}> Stripe Net Deposit: {round2Decimal(dashboard.stripeNetCharge / 100)} </div>

                            <div style={{marginLeft: "1em"}}> Stripe Net Refund: {round2Decimal(dashboard.stripeNetRefund / 100)} </div>

                            <div style={{marginLeft: "1em"}}> Stripe Net Dispute: {round2Decimal(dashboard.stripeNetDispute / 100)} </div>

                            <div style={{marginLeft: "1em"}}> Stripe Net Volume: {round2Decimal((dashboard.stripeNetCharge + dashboard.stripeNetRefund  + dashboard.stripeNetDispute) / 100 )} </div>

                            <div style={{marginLeft: "1em"}}> Net Application Fee: {round2Decimal((dashboard.stripeNetDeposit - dashboard.stripeNetCharge) / 100)} </div>

                            <div style={{marginLeft: "1em"}}> Coupon Usage: {dashboard.promoSummary  ? (round2Decimal((dashboard.promoSummary.totalValue)) + "$") : 'Unknown'}  </div>

                          </div>


                      }
                               
                    </Col>
                    {areaNames && dashboard.ridePerVehicleRank && this.getRankingBoard()}
                  </Row>
                  </TabPane> 
              }
              { 


              }
              { 
              (/*authority.includes("admin")&& */  this.props.selectedAreaId !== null) && 
              <TabPane
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