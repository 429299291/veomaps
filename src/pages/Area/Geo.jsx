import React, { PureComponent, Fragment } from "react";
import { connect } from "dva";
import moment from "moment";
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
  Steps,
  Radio
} from "antd";
import StandardTable from "@/components/StandardTable";
import PageHeaderWrapper from "@/components/PageHeaderWrapper";

import { compose, withProps } from "recompose";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from "react-google-maps";

const MyMapComponent = compose(
  withProps({
    googleMapURL:
      "https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />
  }),
  withScriptjs,
  withGoogleMap
)(props => (
  <GoogleMap defaultZoom={8} defaultCenter={{ lat: -34.397, lng: 150.644 }}>
    {props.isMarkerShown && (
      <Marker
        position={{ lat: -34.397, lng: 150.644 }}
        onClick={props.onMarkerClick}
      />
    )}
  </GoogleMap>
));

@connect(({ geo, areas, loading }) => ({
  geo,
  areas,
  loading: loading.models.geo
}))
class Geo extends PureComponent {
  state = {
    currentAreaId: -1,
    addFenceModalVisible: false,
    updateFenceModalVisible: false,
    deleteFenceModalVisible: false
  };

  componentDidMount() {}

  renderHeader(areas) {
    return (
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <Col md={6} sm={24}>
          {areas && (
            <Select placeholder="select" style={{ width: "100%" }}>
              {areas.map(area => (
                <Option key={area.id} value={area.id}>
                  {area.name}
                </Option>
              ))}
            </Select>
          )}
        </Col>
        <Col md={6} sm={24}>
          <Button
            icon="plus"
            type="primary"
            onClick={() => this.handleModalVisible(true)}
          >
            Add
          </Button>
        </Col>
      </Row>
    );
  }

  render() {
    const { geo, areas, loading } = this.props;
    const {
      currentAreaId,
      addFenceModalVisible,
      updateFenceModalVisible,
      deleteFenceModalVisible
    } = this.state;

    return (
      <PageHeaderWrapper title="Geo Management">
        <Card bordered={false}>
          <div>
            <div>{this.renderHeader()}</div>
            <div>
              <Button
                icon="plus"
                type="primary"
                onClick={() => this.handleModalVisible(true)}
              >
                Add
              </Button>
            </div>
            <MyMapComponent isMarkerShown={false} />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Geo;
