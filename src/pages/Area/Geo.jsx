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

import {fenceType, fenceTypeColor} from "@/constant";

const FormItem = Form.Item;



import { compose, withProps } from "recompose";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  Polyline,
  Polygon,
  Circle
} from "react-google-maps";

import { getAuthority } from "@/utils/authority";

const authority = getAuthority();

import styles from "./Geo.less";

const defaultCenter = { lat: 41.879658, lng: -87.629769 };

const MyMapComponent = compose(
  withProps({
    googleMapURL:
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyDdCuc9RtkM-9wV9e3OrULPj67g2CHIdZI&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `600px` }} />,
    mapElement: <div style={{ height: `100%` }} />
  }),
  withScriptjs,
  withGoogleMap
)(props => {
  const {
    center,
    fences,
    primeLocations,
    onMapClick,
    isEditingCenter,
    editingCenter,
    isEditingFence,
    editingFence,
    isEditingFenceClosed,
    handleExistedFenceClick,
    isEditingPrimeLocation,
    editingPrimeLocation,
    setCircleRef,
    handleExistedPrimeLocationClick
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
        {isEditingPrimeLocation &&
        editingPrimeLocation && (
          <Circle
            center={editingPrimeLocation.center}
            //default 5 meters radius of prime location
            radius={editingPrimeLocation.radius}
            editable={true}
            ref={setCircleRef}
            options={{
              fillColor: "#e8eb34",
              strokeColor: '#e8eb78',
              strokeOpacity: 0.8,
              strokeWeight: 2,
            }}
          />
        )}
        {
          primeLocations.map(
            circle =>  <Circle
              center={circle.center}
              radius={circle.radius}
              
              onClick={e => handleExistedPrimeLocationClick(e, circle)}
              options={{
                fillColor: "#55eb34",
                strokeColor: '#55eb78',
                strokeOpacity: 0.8,
                strokeWeight: 2,
              }}
            />)
        }
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

      

      if (Array.isArray(fieldsValue.vehicleTypes) && fieldsValue.vehicleTypes.length === 0 ) {
        fieldsValue.vehicleTypes = undefined;
      }

      if (Array.isArray(fieldsValue.forceVehicleTypes) && fieldsValue.forceVehicleTypes.length === 0) {
        fieldsValue.forceVehicleTypes = undefined;
      }



      handleNext(fieldsValue);
    });
  };

  const fence = selectedExistedFence ? selectedExistedFence : editingFence;

  const currFenceType = form.getFieldValue("fenceType");

  const isGeoFence = currFenceType === 0 || currFenceType === 5;

  const nullToUndefined = value => value ? value : undefined;

  return (
    <Modal
      destroyOnClose
      title={`${fence ? "Edit" : "Add"} Fence`}
      visible={modalVisible}
      onOk={okHandle}
      width={500}
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
          labelCol={{ span: 10 }}
          wrapperCol={{ span: 10 }}
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
      {
        <FormItem
          labelCol={{ span: 10 }}
          wrapperCol={{ span: 10 }}
          label={(isGeoFence? "Force " : "") + "Vehicle Type"}
        >
          {form.getFieldDecorator(isGeoFence ? "forceVehicleTypes" : "vehicleTypes", {
            initialValue: fence ? (isGeoFence ? nullToUndefined(fence.forceVehicleTypes) : nullToUndefined(fence.vehicleTypes)) : undefined,
          })(
            <Select placeholder="select" style={{ width: "100%" }} mode="multiple">
              <Option value={0}>Bike</Option>
              <Option value={1}>Scooter</Option>
              <Option value={2}>E-Bike</Option>
            </Select>
          )}
        </FormItem>
      }
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
    isDeleteModalVisible: false,
    isParkingCheckStart: false
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

    dispatch({
      type: "geo/getPrimeLocations",
      areaId: areaId
    });
  };


  checkParking = newPoint => {
    const {
      isParkingCheckStart
    } = this.state;

    const { dispatch } = this.props;

    const areaId = this.props.selectedAreaId;

    if (isParkingCheckStart) {
      
      dispatch({
        type: "geo/examineParkingTest",
        areaId: areaId,
        imei: 14682004256896,
        location: newPoint 
      });

    }
    
  }

  handleMapClick = e => {
    const {
      isEditingCenter,
      isEditingFence,
      editingFence,
      selectedExistedFence,
      isEditingPrimeLocation
    } = this.state;

    const areaId = this.props.selectedAreaId;

    const newPoint = { lat: e.latLng.lat(), lng: e.latLng.lng() };

    this.checkParking(newPoint);

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

    if (isEditingPrimeLocation) {
      this.setState({
        editingPrimeLocation: {
          center: newPoint,
          radius: 5
        }
      })
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

  handleCreatePrimeLocation = isEditing => {
    this.setState({
      isEditingPrimeLocation: isEditing,
      isEditingFenceModalVisible: false,
    });
  }

  cancelEditing = () => {
    this.setState({
      isEditingFence: false,
      isEditingPrimeLocation: false,
      isEditingCenter: false,
      editingFence: null,
      editingCenter: null,
      isEditingFenceClosed: false,
      selectedExistedFence: null,
      selectedExistedPrimeLocation: null,
      isEditingFenceModalVisible: false,
      isDeleteModalVisible: false,
      isEditingPrimeLocation: false,
      editingPrimeLocation: null
    });
  };

  setCircleRef = ref => this.cricelRef = ref;

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


  handleGetPrimeLocations = () => {
    
  };


  handleSave = () => {
    const {
      isEditingFence,
      isEditingCenter,
      isEditingPrimeLocation,
      editingFence,
      editingCenter,
      editingPrimeLocation,
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

    if (isEditingPrimeLocation) {

      const circle = this.cricelRef.state.__SECRET_CIRCLE_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;

      dispatch({
        type: "geo/addPrimeLocation",
        payload: Object.assign({}, {center: {lat: circle.center.lat(), lng: circle.center.lng()}, radius:  Math.round(circle.radius), areaId : selectedAreaId}) ,
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
    const { isEditingCenter, isEditingFence, isEditingPrimeLocation } = this.state;

    if (!isEditingCenter && !isEditingFence && !isEditingPrimeLocation ) {
      this.setState({ selectedExistedFence: fence, selectedExistedPrimeLocation: null });
      //console.log(event);
      const newPoint = { lat: event.latLng.lat(), lng: event.latLng.lng() };
      this.checkParking(newPoint);
    } else if (fence.fenceType === 0 || fence.fenceType === 5 || isEditingPrimeLocation) {
      this.handleMapClick(event);
    }
  };

  handleExistedPrimeLocationClick = (event, primeLocation) => {
    const { isEditingCenter, isEditingFence, isEditingPrimeLocation} = this.state;

    if (!isEditingCenter && !isEditingFence && !isEditingPrimeLocation) {
      this.setState({ selectedExistedPrimeLocation: primeLocation, selectedExistedFence: null });
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
      editingCenter,
      isEditingPrimeLocation,
      editingPrimeLocation
    } = this.state;

    const isAbleToEncloseEditingFence =
      isEditingFence &&
      editingFence != null &&
      editingFence.fenceCoordinates.length > 2;

    const isAbleToSave =
      (isEditingFence && isEditingFenceClosed) ||
      (isEditingCenter && editingCenter) || 
      (isEditingPrimeLocation && editingPrimeLocation);

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

              {/* </Col>{authority.includes("create.primeLocation") && ( */}
                {true && (
                <Button
                  type="primary"
                  onClick={() => this.handleCreatePrimeLocation(true)}
                  disabled={isEditing}
                  className={styles.editButton}
                >
                  Add Prime Location
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

  handleDelete= () => {

    const { selectedExistedFence , selectedExistedPrimeLocation} = this.state;

    if (selectedExistedFence) {
      this.handleDeleteFence();
    }

    if (selectedExistedPrimeLocation) {
      this.handleDeletePrimeLocation();
    }

  }

  handleDeletePrimeLocation = () => {
    const { selectedExistedPrimeLocation } = this.state;

    if (!selectedExistedPrimeLocation) return;

    const { dispatch } = this.props;

    dispatch({
      type: "geo/removePrimeLocation",
      id: selectedExistedPrimeLocation.id,
      onSuccess: this.getAreaGeoInfo,
      onError: this.cancelEditing
    });
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
      isEditingPrimeLocation,
      isEditingCenter,
      editingCenter,
      editingFence,
      isEditingFenceModalVisible,
      selectedExistedFence,
      selectedExistedPrimeLocation,
      isDeleteModalVisible
    } = this.state;

    const isEditing = isEditingCenter || isEditingFence || isEditingPrimeLocation;



    return (
      <PageHeaderWrapper title="Geo Management">
        {selectedAreaId && <Card bordered={false}>
          <div>
            {!isEditing && (selectedExistedFence || selectedExistedPrimeLocation) ? (
              <Row
                gutter={{ md: 8, lg: 24, xl: 48 }}
                className={styles.editRow}
              >
                <Col md={24} sm={24}>
                  {authority.includes("update.fence") && selectedExistedFence && (
                    <Button
                      type="primary"
                      onClick={() => this.handleEditFence()}
                      disabled={isEditing}
                      className={styles.editButton}
                    >
                      Edit Fence
                    </Button>
                  )}
                  {(authority.includes("delete.fence") || authority.includes("delete.primeLocation") ) && (
                    <Button
                      type="danger"
                      onClick={() =>
                        this.setState({ isDeleteModalVisible: true })
                      }
                      disabled={isEditing}
                      className={styles.editButton}
                    >
                      DELETE
                    </Button>
                  )}
                   <Button
                      type="default"
                      onClick={() =>
                        this.setState({
                          isEditing: false,
                          selectedExistedFence: null,
                          selectedExistedPrimeLocation: null
                        })
                      }
                      disabled={isEditing}
                      className={styles.editButton}
                    >
                      Cancel
                    </Button>
                  {selectedExistedFence && <span>
                    Name: {selectedExistedFence.name} Type:{" "}
                    {fenceType[selectedExistedFence.fenceType]}
                  </span>}
                  {selectedExistedPrimeLocation && <span>
                    {`lat:${selectedExistedPrimeLocation.center.lat } lng:${selectedExistedPrimeLocation.center.lng} radius:${selectedExistedPrimeLocation.radius * 3.28} ft` }
                  </span>}
                </Col>
              </Row>
            ) : (
              <div>{this.renderHeader(areas.data, isEditing)}</div>
            )}
            <div style={{ marginBottom: "1em"}} />
            <MyMapComponent
              onMapClick={this.handleMapClick}
              handleExistedFenceClick={this.handleExistedFenceClick}
              handleExistedPrimeLocationClick={this.handleExistedPrimeLocationClick}
              {...this.state}
              center={geo.area && geo.area.center}
              fences={geo.fences}
              primeLocations={geo.primeLocations}
              setCircleRef={this.setCircleRef}
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
          title="Delete"
          visible={isDeleteModalVisible}
          onOk={this.handleDelete}
          onCancel={() => this.setState({ isDeleteModalVisible: false })}
        >
          <p>
            {`Area you sure you want to delete ${selectedExistedFence ? "fence: " + selectedExistedFence.name : "this circle"} ?`}
          </p>
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default Geo;
