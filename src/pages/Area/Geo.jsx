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
import PageHeaderWrapper from "@/components/PageHeaderWrapper";

const FormItem = Form.Item;

const fenceType = [
  "geofence",
  "force parking area",
  "recommend parking",
  "lucky zone",
  "restricted parking",
  "sub-geofence"
];
const fenceTypeColor = [
  "#b72126",
  "#1300ff",
  "#65b30a",
  "#00b8aa",
  "#ff0000",
  "#b72126"
];

import { compose, withProps } from "recompose";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  Polyline,
  Polygon
} from "react-google-maps";

import { getAuthority } from "@/utils/authority";

import styles from "./Geo.less";

const authority = getAuthority();

const defaultCenter = { lat: 41.879658, lng: -87.629769 };

const MyMapComponent = compose(
  withProps({
    googleMapURL:
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyDPnV_7djRAy8m_RuM5T0QIHU5R-07s3Ic&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />
  }),
  withScriptjs,
  withGoogleMap
)(props => {
  const {
    center,
    fences,
    onMapClick,
    isEditingCenter,
    editingCenter,
    isEditingFence,
    editingFence,
    isEditingFenceClosed,
    handleExistedFenceClick
  } = props;

  const centerToRender =
    isEditingCenter && editingCenter ? editingCenter : center;

  const path = !!(isEditingFence && editingFence)
    ? editingFence.fenceCoordinates
    : [];


  const dashLineDot = {
    path: window.google.maps.SymbolPath.CIRCLE,
    fillOpacity: 1,
    scale: 2
  };

  return (
    <GoogleMap
      defaultZoom={11}
      center={center ? center : defaultCenter}
      onClick={onMapClick}
    >
      {centerToRender && <Marker position={centerToRender} />}
      {isEditingFence &&
        editingFence &&
        !isEditingFenceClosed && (
          <Polyline
            path={path}
            geodesic={true}
            options={{
              strokeColor: fenceTypeColor[editingFence.fenceType],
              strokeOpacity: 0.75,
              strokeWeight: 2
            }}
          />
        )}
      {isEditingFenceClosed && (
        <Polygon
          path={path}
          geodesic={true}
          options={{
            strokeColor: fenceTypeColor[editingFence.fenceType],
            strokeOpacity: 0.75,
            strokeWeight: 2,
            fillColor: fenceTypeColor[editingFence.fenceType],
            fillOpacity: editingFence.fenceType == 0 ? 0 : 0.35
          }}
        />
      )}

      {fences.map(fence => (
        <Polygon
          path={fence.fenceCoordinates}
          geodesic={true}
          key={fence.id}
          onClick={e => handleExistedFenceClick(e, fence)}
          options={{
            strokeColor: fenceTypeColor[fence.fenceType],
            strokeOpacity: fence.fenceType === 5 ? 0 : 0.75,
            strokeWeight: fence.fenceType === 5 ? 0 : 2,
            fillColor: fenceTypeColor[fence.fenceType],
            fillOpacity:
              fence.fenceType === 0 || fence.fenceType === 5 ? 0 : 0.35
          }}
        />
      ))}

      {fences.filter(fence => fence.fenceType === 5).map(fence => (
        <Polyline
          path={fence.fenceCoordinates}
          geodesic={true}
          key={fence.id}
          options={{
            strokeColor: fenceTypeColor[fence.fenceType],
            strokeOpacity: 0.75,
            strokeWeight: 2,
            icons: [
              {
                icon: dashLineDot,
                offset: "0",
                repeat: "10px"
              }
            ],
            fillColor: fenceTypeColor[5],
            fillOpacity: 0
          }}
        />
      ))}
    </GoogleMap>
  );
});

const CreateFenceForm = Form.create()(props => {
  const {
    modalVisible,
    form,
    handleNext,
    handleModalVisible,
    editingFence,
    selectedExistedFence
  } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();

      console.log(fieldsValue);

      handleNext(fieldsValue);
    });
  };

  const fence = selectedExistedFence ? selectedExistedFence : editingFence;

  const currFenceType = form.getFieldValue("fenceType");

  return (
    <Modal
      destroyOnClose
      title={`${fence ? "Edit" : "Add"} Fence`}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible(false)}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Name">
        {form.getFieldDecorator("name", {
          initialValue: fence ? fence.name : undefined,
          rules: [
            {
              required: true,
              message: "At least 1 character!",
              min: 1
            }
          ]
        })(<Input placeholder="Please Input" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Note">
        {form.getFieldDecorator("note", {
          initialValue: fence ? fence.note : undefined
        })(<Input placeholder="Please Input" />)}
      </FormItem>
      {fenceType && (
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="Fence Type"
        >
          {form.getFieldDecorator("fenceType", {
            initialValue: fence ? fence.fenceType : undefined,
            rules: [
              {
                required: true,
                message: "You have pick a fence type"
              }
            ]
          })(
            <Select placeholder="select" style={{ width: "100%" }}>
              {fenceType.map((fence, index) => (
                <Select.Option key={index} value={index}>
                  {fence}
                </Select.Option>
              ))}
            </Select>
          )}
        </FormItem>
      )}
      {(currFenceType === 0 || currFenceType === 5) && (
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="Has Forced Parking"
        >
          {form.getFieldDecorator("hasForce", {
            initialValue: fence ? (fence.hasForce ? 1 : 0) : undefined,
            rules: [
              {
                required: true,
                message: "You have to define if have forced parking area"
              }
            ]
          })(
            <Select placeholder="select" style={{ width: "100%" }}>
              <Select.Option key={1} value={1}>
                Yes
              </Select.Option>
              <Select.Option key={0} value={0}>
                No
              </Select.Option>
            </Select>
          )}
        </FormItem>
      )}
    </Modal>
  );
});

@connect(({ geo, areas, loading }) => ({
  geo,
  areas,
  selectedAreaId: areas.selectedAreaId,
  loading: loading.models.geo
}))
class Geo extends PureComponent {
  state = {
    addFenceModalVisible: false,
    updateFenceModalVisible: false,
    deleteFenceModalVisible: false,
    isEditingFence: false,
    isEditingCenter: false,
    editingCenter: null,
    editingFence: null,
    isEditingFenceClosed: false,
    isEditingFenceModalVisible: false,
    selectedExistedFence: null,
    isDeleteFenceModalVisible: false
  };

  componentDidMount() {
    if (this.props.selectedAreaId)
      this.getAreaGeoInfo();
  }

  getAreaGeoInfo = () => {
    const areaId = this.props.selectedAreaId;

    const { dispatch } = this.props;

    this.cancelEditing();

    dispatch({
      type: "geo/getFences",
      areaId: areaId
    });

    dispatch({
      type: "geo/getCenter",
      areaId: areaId
    });
  };

  handleMapClick = e => {
    const {
      isEditingCenter,
      isEditingFence,
      editingFence,
      selectedExistedFence
    } = this.state;

    const newPoint = { lat: e.latLng.lat(), lng: e.latLng.lng() };
    if (isEditingCenter) {
      this.setState({ editingCenter: newPoint });
    }

    if (isEditingFence) {
      this.setState({
        editingFence: {
          ...this.state.editingFence,
          fenceCoordinates: editingFence.fenceCoordinates.concat([newPoint])
        }
      });
    }

    if (selectedExistedFence) {
      this.setState({ selectedExistedFence: null });
    }
  };

  handleEditCenter = isEditing => {
    this.setState({ isEditingCenter: isEditing });
  };

  handleCreateFence = isEditing => {
    this.setState({
      isEditingFence: isEditing,
      isEditingFenceModalVisible: isEditing
    });
  };

  cancelEditing = () => {
    this.setState({
      isEditingFence: false,
      isEditingCenter: false,
      editingFence: null,
      editingCenter: null,
      isEditingFenceClosed: false,
      selectedExistedFence: null,
      isEditingFenceModalVisible: false,
      isDeleteFenceModalVisible: false
    });
  };

  handleCreateFenceNextStep = values => {
    const { selectedAreaId } = this.props;
    values.fenceCoordinates = [];
    values.areaId = selectedAreaId;
    this.setState({ isEditingFenceModalVisible: false, editingFence: values });
  };

  handleCreateFenceModalVisible = () => {
    this.setState({ isEditingFenceModalVisible: false });
    this.cancelEditing();
  };

  handleEncloseEditingFence = () => {
    this.setState({ isEditingFenceClosed: true });
  };

  handleSave = () => {
    const {
      isEditingFence,
      isEditingCenter,
      editingFence,
      editingCenter
    } = this.state;
    const { dispatch, geo, selectedAreaId } = this.props;

    if (isEditingCenter) {
      if (geo.area) {
        const newArea = Object.assign({}, geo.area);
        newArea.center = editingCenter;

        dispatch({
          type: "geo/updateCenter",
          payload: newArea,
          id: geo.area.id,
          onSuccess: this.getAreaGeoInfo,
          onError: this.cancelEditing
        });
      } else {
        dispatch({
          type: "geo/addCenter",
          payload: { areaId: selectedAreaId, center: editingCenter },
          onSuccess: this.getAreaGeoInfo,
          onError: this.cancelEditing
        });
      }
    }

    if (isEditingFence) {
      editingFence.fenceCoordinates.push(editingFence.fenceCoordinates[0]);

      dispatch({
        type: "geo/addFence",
        payload: Object.assign({}, editingFence, {areaId: selectedAreaId}) ,
        onSuccess: this.getAreaGeoInfo
      });
    }
  };


  componentDidUpdate(prevProps, prevState, snapshot) {

    if (prevProps.selectedAreaId !== this.props.selectedAreaId && this.props.selectedAreaId) {
        this.getAreaGeoInfo();
    }
  }



  handleUpdateFence = updatedFence => {
    const { dispatch } = this.props;

    dispatch({
      type: "geo/updateFence",
      id: updatedFence.id,
      payload: updatedFence,
      onSuccess: this.getAreaGeoInfo,
      onError: this.cancelEditing
    });
  };

  handleExistedFenceClick = (event, fence) => {
    const { isEditingCenter, isEditingFence } = this.state;

    if (!isEditingCenter && !isEditingFence) {
      this.setState({ selectedExistedFence: fence });
    } else if (fence.fenceType === 0 || fence.fenceType === 5) {
      this.handleMapClick(event);
    }
  };

  handleUndoFenceEditing = () => {
    const { isEditingFence, editingFence, isEditingFenceClosed } = this.state;

    if (isEditingFenceClosed) {
      this.setState({ isEditingFenceClosed: false });
    } else if (editingFence && editingFence.fenceCoordinates.length > 2) {
      const newPolygon = Array.from(editingFence.fenceCoordinates);
      newPolygon.pop();
      this.setState({
        editingFence: { ...editingFence, fenceCoordinates: newPolygon }
      });
    } else if (isEditingFence) {
      this.setState({
        isEditingFenceModalVisible: true,
        editingFence: { ...editingFence, fenceCoordinates: [] }
      });
    }
  };

  renderHeader = (areas, isEditing) => {
    const {
      isEditingFence,
      editingFence,
      isEditingFenceClosed,
      isEditingCenter,
      editingCenter
    } = this.state;

    const isAbleToEncloseEditingFence =
      isEditingFence &&
      editingFence != null &&
      editingFence.fenceCoordinates.length > 2;

    const isAbleToSave =
      (isEditingFence && isEditingFenceClosed) ||
      (isEditingCenter && editingCenter);

    return (
      <div>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }} className={styles.editRow}>
          {isEditing ? (
            <Col md={24} sm={24}>
              <Button
                icon="plus"
                type="primary"
                onClick={() => this.cancelEditing(true)}
                className={styles.editButton}
              >
                Cancel Editing
              </Button>
              <Button
                icon="plus"
                type="primary"
                onClick={() => this.handleSave()}
                disabled={!isAbleToSave}
                className={styles.editButton}
              >
                Save
              </Button>
              {isAbleToEncloseEditingFence && (
                <Button
                  icon="plus"
                  type="primary"
                  onClick={() => this.handleEncloseEditingFence()}
                  disabled={isEditingFenceClosed}
                  className={styles.editButton}
                >
                  Close Fence
                </Button>
              )}
              {isEditingFence && (
                <Button
                  icon="plus"
                  type="primary"
                  onClick={() => this.handleUndoFenceEditing()}
                  className={styles.editButton}
                >
                  Undo
                </Button>
              )}
            </Col>
          ) : (
            <Col md={24} sm={24}>
              {authority.includes("update.fence") && (
                <Button
                  type="primary"
                  onClick={() => this.handleEditCenter(true)}
                  disabled={isEditing}
                  className={styles.editButton}
                >
                  Edit Center
                </Button>
              )}
              {authority.includes("create.fence") && (
                <Button
                  type="primary"
                  onClick={() => this.handleCreateFence(true)}
                  disabled={isEditing}
                  className={styles.editButton}
                >
                  Add Fence
                </Button>
              )}
            </Col>
          )}
        </Row>
      </div>
    );
  };

  handleEditFence = () => {
    const { selectedExistedFence } = this.state;

    if (!selectedExistedFence) return;

    this.setState({ isEditingFenceModalVisible: true });
  };

  handleEditFenceSubmit = values => {
    const { selectedExistedFence } = this.state;

    this.handleUpdateFence(Object.assign({}, selectedExistedFence, values));
  };

  handleDeleteFence = () => {
    const { selectedExistedFence } = this.state;

    if (!selectedExistedFence) return;

    const { dispatch } = this.props;

    dispatch({
      type: "geo/removeFence",
      id: selectedExistedFence.id,
      onSuccess: this.getAreaGeoInfo,
      onError: this.cancelEditing
    });
  };

  render() {
    const {
      geo,
      areas: { data: areas },
      loading,
      selectedAreaId,
    } = this.props;
    const {
      addFenceModalVisible,
      updateFenceModalVisible,
      deleteFenceModalVisible,
      isEditingFence,
      isEditingCenter,
      editingCenter,
      editingFence,
      isEditingFenceModalVisible,
      selectedExistedFence,
      isDeleteFenceModalVisible
    } = this.state;

    const isEditing = isEditingCenter || isEditingFence;

    return (
      <PageHeaderWrapper title="Geo Management">
        {selectedAreaId && <Card bordered={false}>
          <div>
            {!isEditing && selectedExistedFence ? (
              <Row
                gutter={{ md: 8, lg: 24, xl: 48 }}
                className={styles.editRow}
              >
                <Col md={24} sm={24}>
                  {authority.includes("update.fence") && (
                    <Button
                      type="primary"
                      onClick={() => this.handleEditFence()}
                      disabled={isEditing}
                      className={styles.editButton}
                    >
                      Edit Fence
                    </Button>
                  )}
                  {authority.includes("delete.fence") && (
                    <Button
                      type="danger"
                      onClick={() =>
                        this.setState({ isDeleteFenceModalVisible: true })
                      }
                      disabled={isEditing}
                      className={styles.editButton}
                    >
                      DELETE
                    </Button>
                  )}
                  {authority.includes("delete.fence") && (
                    <Button
                      type="default"
                      onClick={() =>
                        this.setState({
                          isEditing: false,
                          selectedExistedFence: null
                        })
                      }
                      disabled={isEditing}
                      className={styles.editButton}
                    >
                      Cancel
                    </Button>
                  )}
                  <span>
                    Name: {selectedExistedFence.name} Type:{" "}
                    {fenceType[selectedExistedFence.fenceType]}
                  </span>
                </Col>
              </Row>
            ) : (
              <div>{this.renderHeader(areas.data, isEditing)}</div>
            )}
            <div style={{ marginBottom: "1em" }} />
            <MyMapComponent
              onMapClick={this.handleMapClick}
              handleExistedFenceClick={this.handleExistedFenceClick}
              {...this.state}
              center={geo.area && geo.area.center}
              fences={geo.fences}
            />
          </div>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }} className={styles.editRow}>
            <Col md={24} sm={24} style={{ float: "right" }}>
              {fenceTypeColor.map((color, index) => (
                <div
                  className={styles.fenceColorIndex}
                  key={index}
                  style={{ backgroundColor: fenceTypeColor[index] }}
                >{`${fenceType[index]}`}</div>
              ))}
            </Col>
          </Row>
        </Card> }
        <CreateFenceForm
          handleNext={
            selectedExistedFence
              ? this.handleEditFenceSubmit
              : this.handleCreateFenceNextStep
          }
          handleModalVisible={this.handleCreateFenceModalVisible}
          modalVisible={isEditingFenceModalVisible}
          editingFence={editingFence}
          selectedExistedFence={selectedExistedFence}
        />
        <Modal
          title="Delete Fence"
          visible={isDeleteFenceModalVisible}
          onOk={this.handleDeleteFence}
          onCancel={() => this.setState({ isDeleteFenceModalVisible: false })}
        >
          <p>
            Area you sure you want to delete fence:{" "}
            {selectedExistedFence && selectedExistedFence.name} ?
          </p>
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default Geo;
