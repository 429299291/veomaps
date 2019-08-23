import React, { PureComponent, Fragment } from "react";
import { Table, Alert, Pagination, Card } from "antd";
import vehicle from "@/models/vehicle";
import styles from "./ResponsiveList.less";



class ResponsiveList extends PureComponent {
  constructor(props) {
    super(props);
    const { vehicles } = props;

    this.state = {
      expandItem:null
    };
  }




  render() {
    const { selectedRowKeys, needTotalList } = this.state;
    
    const {
      vehicles,
      getResponsiveVehicleInfo,
      selectedVehicleId,
      totalCount,
      onPageChange,
      selectedVehicleRefresh
    } = this.props;


    return (
      <div>
        {
          vehicles.map(vehicle => <Card key={vehicle.id} className={styles.card}>
              {getResponsiveVehicleInfo(vehicle, selectedVehicleId)}
             </Card>)
        }
        <Pagination style={{marginTop: "1em", }} defaultCurrent={1} total={totalCount} onChange={onPageChange} />
      </div>
    );
  }
}

export default ResponsiveList;
