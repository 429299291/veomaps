import React, { Component } from "react";
import { connect } from "dva";
import { formatMessage, FormattedMessage } from "umi/locale";
import { getAuthority } from "@/utils/authority";
import numeral from "numeral";
import Button from 'antd/lib/button';
import DataSet from "@antv/data-set";
import styles from "./Performance.less";
// import '../node_modules/react-vis/dist/style.css';
// import {XYPlot, LineSeries} from 'react-vis';
import {
  BarChart, 
  Bar, 
  Cell, 
  XAxis, 
  YAxis,
   CartesianGrid,
    Tooltip,
     Legend,
      ComposedChart,
      Line, 
      ReferenceLine,
      ResponsiveContainer
} from 'recharts';

const authority = getAuthority();

const BAR_GAP = 4;
const BAR_SIZE = 20;

import {
  Row,
  Col,
  Icon,
  Card,
  Tabs,
  Table,
  Radio,
  DatePicker,
  Menu,
  Dropdown,
  Checkbox,
  Select,
} from "antd";
import GridContent from "@/components/PageHeaderWrapper/GridContent";

const {RangePicker} = DatePicker;


const defaultPageSize = 1000;

import { getTimeDistance } from "@/utils/utils";

const scoreMetaByKey = {
  longRidesScore: { name: "Long Ride Score", intro: "", color:"#ff0400" },
  pendingReportScore: {name: "Pending Report Score", intro: "", color:"#e68e5c" },
  onlineVehicleScore: {name: "Online Vehicle Score", intro: "", color:"#16fac5" },
  lowBatteryVehicleScore: {name: "Low Battery Score", intro: "", color:"#82ca9d" },
  idleVehicleScore: {name: "Idle Vehicle Score", intro: "", color:"#ffa930" },
  primeLocationScore: {name: "Prime Location Score", intro: "", color:"#30ff3a" },
  badLocationScore: {name: "Bad Location Score", intro: "", color:"#30d6db" },
  operationMarginScore: {name: "Opertation Margin Score", intro: "", color:"#c3c912" },
  finalScore: {name: "Final Score", intro: "", color:"#3055db" }
} 

@connect(({ areas, performance, geo, loading, chart }) => ({
    performance,
    selectedAreaId: areas.selectedAreaId,
    areaNames: areas.areaNames,
    historyDataLoading: loading.models.areas || loading.effects["performance/historyData"],
    rankingDataLoading: loading.models.areas || loading.effects["performance/rankingData"],
  }))
  class Performance extends Component {

    state = {
      rangePickerValue: getTimeDistance("month"),
      offset: 0,
      countParams:  {filter: 'day'}
    };

    componentDidMount() {
      this.loadData();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
      if ((prevProps.selectedAreaId !== this.props.selectedAreaId)) {
        this.loadHistoryData();
      }
    }


    loadData() {
      this.loadHistoryData();
      this.loadRankingData();
    }

    loadRankingData() {
      const { dispatch, selectedAreaId } = this.props;

      const {countParams, offset, rangePickerValue} = this.state;

      if (!authority.includes("get.area.performance.rank")) {
        return;
      }

      dispatch({
        type: "performance/getRankingData",
        params: Object.assign(
          {}, 
          countParams, 
          { 
            offset: offset, 
            areaId: selectedAreaId > 0 ? selectedAreaId : null,
            startDate: rangePickerValue[0].toISOString(),
            endDate: rangePickerValue[1].toISOString(), 
            pageSize:  defaultPageSize
          })
      });
    }

    loadHistoryData() {
      const { dispatch, selectedAreaId } = this.props;

      const {countParams, offset, rangePickerValue} = this.state;

      if (!authority.includes("get.area.performance.history")) {
        return;
      }

      dispatch({
        type: "performance/getHistoryData",
        params: Object.assign(
          {}, 
          countParams, 
          { 
            offset: offset, 
            areaIds: selectedAreaId > 0 ? [selectedAreaId] : [],
            startDate: rangePickerValue[0].toISOString(),
            endDate: rangePickerValue[1].toISOString(), 
            offset:  0,      
            limit: 1000   
           })
      });
    }
    
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
      }, this.loadData);
    
    };


    getFilterContent = () => {

      const {
        rangePickerValue,
        areaIsChanged
      } = this.state;

      return (
        <div className={styles.filterExtraWrap}>

          <RangePicker
            value={rangePickerValue}
            onChange={this.handleRangePickerChange}
            style={{ width: 256 }}
          />

          <div className={styles.filterExtra}>
            <a
              className={this.isActive("week")}
              onClick={() => this.selectDate("week")}
            >
             Week
            </a>
            <a
              className={this.isActive("month")}
              onClick={() => this.selectDate("month")}
            >
             Month
            </a>
            <a
              className={this.isActive("year")}
              onClick={() => this.selectDate("year")}
            >
              Year
            </a>
          </div>
          
        </div>
      );
    }


    selectDate = type => {
      const { dispatch } = this.props;
      this.setState({
        rangePickerValue: getTimeDistance(type)
      }, this.loadData);
    };

    render() {

      const {
        performanceHistoryDataLoading,
        performance,
        areaNames,
        selectedAreaId
      } = this.props;


      const {
        rangePickerValue,
        areaIsChanged
      } = this.state;

      return <GridContent >

              
                <Row gutter={24} style={{marginTop: "2em"}}>
                <Card loading={performanceHistoryDataLoading} bordered={false} bodyStyle={{ padding: "2em" }}>

                <Row style={{ paddingBottom: "0.5em" , borderBottom: "1px solid #e8e8e8"}}>
                  {this.getFilterContent()}
                </Row>

                <Row style={{marginTop: "0.5em" }}>
                  {authority.includes("get.area.performance.rank") && 
                  <Col xl={14} lg={12} md={12} sm={24} xs={24}>
                    <div className={styles.scoreBar}>

                    <Row>
                      <Col span={12}>
                        <p style={{ marginBottom: 20, marginLeft: "2em", font: "1.2em bold", color: "black" }}>{`${selectedAreaId > 0 ? areaNames[selectedAreaId] : "All Area"} Performance By Date`}  </p>
                      </Col>
                      {/* <Col span={12}>
                        <Select defaultValue="Final Score" >
                            {Object.keys(scoreMetaByKey).map(key =>
                              <Option key={key} value={key}>
                                  {scoreMetaByKey[key].name}
                              </Option>) 
                            }
                        </Select>
                      </Col> */}

                    </Row>

                    <ResponsiveContainer  width="95%" height={400} >

                          <ComposedChart
                            data={performance.historyData}
                            margin={{
                              top: 20, right: 30, left: 0, bottom: 5,
                            }}
                            stackOffset="sign"
                            
                          >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="period" />
                              <YAxis />
                              <Tooltip formatter={(value, key, props) =>  [ `${Math.round(value * 100) / 100}%` , scoreMetaByKey[key].name] } />
                              <ReferenceLine y={-100} stroke="#000" />

                              {
                                Object.keys(scoreMetaByKey).map(key =>{ 
                                  if (key !== "finalScore") {
                                    const scoreMeta = scoreMetaByKey[key];
                                    return <Bar dataKey={key} key={key} stackId="a" fill={scoreMeta.color}/> 
                                  }
                                })
                              }

                              <Line type="monotone" dataKey="finalScore" stroke={scoreMetaByKey.finalScore.color}/>
                          </ComposedChart>
                      </ResponsiveContainer>
                    </div>
                  </Col>}
                 {authority.includes("get.area.performance.rank") && 
                 <Col xl={10} lg={12} md={12} sm={24} xs={24}>
                  <div className={styles.scoreBar}>

                        <h4 style={{ marginBottom: 20 }}> Ranking </h4>


                        <div style={{height: 400, overflowY:"scroll"}}>

                        <ResponsiveContainer  width="95%" height={1800} >

                              <BarChart
                                data={performance.rankingData.map((item, index )=> Object.assign(item, {areaName: `${index + 1}. ${areaNames[item.areaId]}`}))}
                                margin={{
                                  top: 20, right: 30, left: 40, bottom: 5,
                                }}
                                stackOffset="sign"
                                layout="vertical"
                              >
                                  
                                  <XAxis type="number" hide/>
                                  <YAxis type="category"  dataKey="areaName" tick={{fontWeight: "bold", fontSize: "0.8em"}} />
                                  <Tooltip formatter={(value, key, props) =>  [Math.round(value * 100) / 100 , scoreMetaByKey[key].name] } />
                                  <ReferenceLine y={-100} stroke="#000" />
                                  {
                                    Object.keys(scoreMetaByKey).map(key =>{ 
                                      if (key !== "finalScore") {
                                        const scoreMeta = scoreMetaByKey[key];
                                        return <Bar dataKey={key} key={key} stackId="a" fill={scoreMeta.color}/> 
                                      }
                                    })
                                  }
                              </BarChart>
                          </ResponsiveContainer>

                          </div>
                        </div>
                  </Col>
                }
                </Row>
                <Row style={{ paddingBottom: "1em"}}>
                  <ResponsiveContainer  width="95%" height={100} >
                    <BarChart
                      data={performance.rankingData.map((item, index )=> Object.assign(item, {areaName: `${index + 1}. ${areaNames[item.areaId]}`}))}
                    
                    >
                    <XAxis type="number" hide/>
                                  <YAxis type="category"  dataKey="areaName" tick={{fontWeight: "bold"}} hide />
                        <Legend formatter={(value, entry, index) =>  <span> {scoreMetaByKey[value].name} </span> } />
                        {
                                    Object.keys(scoreMetaByKey).map(key =>{ 
                                      if (key !== "finalScore") {
                                        const scoreMeta = scoreMetaByKey[key];
                                        return <Bar dataKey={key} key={key} stackId="a" fill={scoreMeta.color}/> 
                                      }
                                    })
                                  }

                    </BarChart>
                  </ResponsiveContainer>
                </Row>
                 
                  </Card>
                </Row>
            
          </GridContent>
    }


  }


  export default Performance;