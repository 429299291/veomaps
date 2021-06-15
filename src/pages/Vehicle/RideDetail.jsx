import React, { PureComponent } from "react";
import { connect } from "dva";
import moment from "moment";
import { Row, Col, Modal, Table } from "antd";

import styles from "./Ride.less";

import {
  fenceType,
  lockOperationWay,
  vehicleType,
  violateType,
  limitType
} from "@/constant";

import RouteMap from "./RouteMap";

@connect(({ geo, loading, areas }) => ({
  geo,
  loading: loading.models.geo,
  areas
}))
class RideDetail extends PureComponent {
  state = {};

  formatTime(val) {
    return (
      moment(val).format("YYYY-MM-DD HH:mm:ss ") +
      Intl.DateTimeFormat().resolvedOptions().timeZone
    );
  }

  formatValue = key => {
    const { ride } = this.props;
    const value = ride[key];

    switch (key) {
      case "vehicleType":
        return vehicleType[value];
      case "lockMethod":
      case "unlockMethod":
        return lockOperationWay[value];
      case "violateType":
        return violateType[value];
      case "limitType":
        return limitType[value];
      case "start":
        return this.formatTime(value);
      case "areaId":
        return this.props.areas.areaNames[value];
      case "end":
        const endTime = value ? this.formatTime(value) : "not finished";

        const metaData = JSON.parse(ride.metaData);

        const endBy = metaData && metaData.adminEmail;

        return endTime + (endBy ? "|" + endBy : "");
      case "end":
        return ride.end
          ? ride.minutes
          : moment().diff(moment(ride.start), "minutes");
      default:
        return value;
    }
  };

  render() {
    const {
      isVisible,
      ride,
      ridePath,
      rideImageUrl,
      geo,
      handleDetailModalVisible,
      billingInfo
    } = this.props;


    return (
      <Modal
        destroyOnClose
        title="Ride Detail"
        visible={isVisible}
        width={"50%"}
        onCancel={() => handleDetailModalVisible()}
        onOk={() => handleDetailModalVisible()}
      >
        <Row width={800}>
          <Col xs={24} sm={12} style={{ fontSize: "0.7em" }}>
            {billingInfo &&
              billingInfo.billingInfo && (
                <div>
                  {" "}
                  Bill Detail ：{JSON.stringify(billingInfo.billingInfo)}{" "}
                </div>
              )}

            {Object.keys(ride).map(key => (
              <p key={key}>{`${key} : ${this.formatValue(key)}`}</p>
            ))}
          </Col>

          <Col xs={24} sm={12}>
            {ridePath && (
                <RouteMap path={ridePath} fences={geo.fences} distance={ride.distance}/>
              )}

            {rideImageUrl && (
              <div style={{ width: "90%", height: "480px" }}>
                <img
                  src={rideImageUrl}
                  style={{
                    maxWidth: "130%",
                    maxHeight: "435px",
                    marginTop: "70px",
                    marginLeft: "-40px"
                  }}
                  className={styles.rotate90}
                />
              </div>
            )}
          </Col>
        </Row>
      </Modal>
    );
  }
}

export default RideDetail;
