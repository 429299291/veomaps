import React, { PureComponent, Fragment,useEffect,useState } from "react";
import { connect } from "dva";
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
} from "antd";
import StandardTable from "@/components/StandardTable";
import styles from "./Policy.less";
import moment from 'moment';
import { getAuthority } from "@/utils/authority";
const authority = getAuthority();
const Policy = (props) => {
  const columns = [
    {
      title: "Name",
      dataIndex: "name"
    },
    {
      title: "Description",
      dataIndex: "description"
    },
    {
      title:"Start Time",
      dataIndex:"start_date",
      render: time =>(
        <span>{moment(parseInt(time)).format("YYYY-MM-DD HH:mm:ss")}</span>
      )
    },
    {
      title:"End Time",
      dataIndex:"end_date",
      render: time =>(
        <span>{moment(parseInt(time)).format("YYYY-MM-DD HH:mm:ss")}</span>
      )
    },
    {
      title:"Rules",
      dataIndex:"rules",
      render: rules => (
        <span>
          {
            rules.map(data=>{
              return (
                <span>{JSON.stringify(data)}</span>
              )
            })
          }
        </span>
      )
    }
  ]
  useEffect(() => {
    getPolicyData()
 }, [props.areas.selectedAreaId == 95])
 const [policyData, setPolicyData] = useState([]);
  const getPolicyData = () => {
    const {dispatch,areas} = props
    if(areas.selectedAreaId){
      dispatch({
        type:'areas/getPolicies',
        areaId:areas.selectedAreaId,
        onSuccess:(data)=>{
          setPolicyData(data)
        }
      })
    }else{
      setPolicyData([])
    }
  }
    return(
      <>
            <StandardTable
              loading={props.loading}
              data={{ list:policyData, pagination: {} }}
              columns={columns}
              // onChange={this.handleStandardTableChange}
            />
      </>
    )
}
const mapStateToProps = ({ areas, loading,policyData }) => {
  return {
    areas,
    selectedAreaId: areas.selectedAreaId,
    loading: loading.models.promos
  }
}
export default connect(mapStateToProps)(Policy) 