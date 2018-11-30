(window["webpackJsonp"] = window["webpackJsonp"] || []).push([
  [11],
  {
    YqBc: function(e, t, n) {
      "use strict";
      var a = n("TqRt"),
        i = n("284h");
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.default = void 0),
        n("IzEo");
      var l = a(n("bx4M")),
        d = a(n("pVnL"));
      n("+L6B");
      var c = a(n("2/Rp"));
      n("14J3");
      var r = a(n("BMrR"));
      n("jCWc");
      var o = a(n("kPKH")),
        s = a(n("MVZn")),
        u = a(n("lwsE")),
        f = a(n("W8MJ")),
        g = a(n("a1gu")),
        p = a(n("Nsbk")),
        E = a(n("7W2i"));
      n("2qtc");
      var m = a(n("kLXV"));
      n("OaEy");
      var F = a(n("2fM7"));
      n("5NDa");
      var h = a(n("5rEg"));
      n("y8nQ");
      var C,
        y,
        v = a(n("Vl3Y")),
        b = i(n("q1tI")),
        k = n("MuoO"),
        M = (a(n("wd/R")), a(n("zHco"))),
        V = n("eHHv"),
        S = n("PQp+"),
        x = v.default.Item,
        I = [
          "geofence",
          "force parking area",
          "recommend parking",
          "lucky zone",
          "restricted parking"
        ],
        A = ["#ff0000", "#66ff66", "#6699ff", "#ff3399", "#ff0000"],
        w = { lat: 41.879658, lng: -87.629769 },
        T = (0, V.compose)(
          (0, V.withProps)({
            googleMapURL:
              "https://maps.googleapis.com/maps/api/js?key=AIzaSyDPnV_7djRAy8m_RuM5T0QIHU5R-07s3Ic&v=3.exp&libraries=geometry,drawing,places",
            loadingElement: b.default.createElement("div", {
              style: { height: "100%" }
            }),
            containerElement: b.default.createElement("div", {
              style: { height: "400px" }
            }),
            mapElement: b.default.createElement("div", {
              style: { height: "100%" }
            })
          }),
          S.withScriptjs,
          S.withGoogleMap
        )(function(e) {
          var t = e.center,
            n = e.fences,
            a = e.onMapClick,
            i = e.isEditingCenter,
            l = e.editingCenter,
            d = e.isEditingFence,
            c = e.editingFence,
            r = e.isEditingFenceClosed,
            o = e.handleExistedFenceClick,
            s = i && l ? l : t,
            u = d && c ? c.fenceCoordinates : [];
          return b.default.createElement(
            S.GoogleMap,
            { defaultZoom: 11, center: t || w, onClick: a },
            s && b.default.createElement(S.Marker, { position: s }),
            d &&
              c &&
              !r &&
              b.default.createElement(S.Polyline, {
                path: u,
                geodesic: !0,
                options: {
                  strokeColor: A[c.fenceType],
                  strokeOpacity: 0.75,
                  strokeWeight: 2
                }
              }),
            r &&
              b.default.createElement(S.Polygon, {
                path: u,
                geodesic: !0,
                options: {
                  strokeColor: A[c.fenceType],
                  strokeOpacity: 0.75,
                  strokeWeight: 2,
                  fillColor: A[c.fenceType],
                  fillOpacity: 0 == c.fenceType ? 0 : 0.35
                }
              }),
            n.map(function(e) {
              return b.default.createElement(S.Polygon, {
                path: e.fenceCoordinates,
                geodesic: !0,
                key: e.id,
                onClick: function(t) {
                  return o(t, e);
                },
                options: {
                  strokeColor: A[e.fenceType],
                  strokeOpacity: 0.75,
                  strokeWeight: 2,
                  fillColor: A[e.fenceType],
                  fillOpacity: 0 == e.fenceType ? 0 : 0.35
                }
              });
            })
          );
        }),
        D = v.default.create()(function(e) {
          var t = e.modalVisible,
            n = e.form,
            a = e.handleNext,
            i = e.handleModalVisible,
            l = e.editingFence,
            d = e.selectedExistedFence,
            c = function() {
              n.validateFields(function(e, t) {
                e || (n.resetFields(), a(t));
              });
            },
            r = d || l;
          return b.default.createElement(
            m.default,
            {
              destroyOnClose: !0,
              title: "Edit Fence",
              visible: t,
              onOk: c,
              onCancel: function() {
                return i(!1);
              }
            },
            b.default.createElement(
              x,
              {
                labelCol: { span: 5 },
                wrapperCol: { span: 15 },
                label: "Name"
              },
              n.getFieldDecorator("name", {
                initialValue: r ? r.name : void 0,
                rules: [
                  { required: !0, message: "At least 1 character!", min: 1 }
                ]
              })(
                b.default.createElement(h.default, {
                  placeholder: "Please Input"
                })
              )
            ),
            b.default.createElement(
              x,
              {
                labelCol: { span: 5 },
                wrapperCol: { span: 15 },
                label: "Note"
              },
              n.getFieldDecorator("note", {
                initialValue: r ? r.note : void 0
              })(
                b.default.createElement(h.default, {
                  placeholder: "Please Input"
                })
              )
            ),
            I &&
              b.default.createElement(
                x,
                {
                  labelCol: { span: 5 },
                  wrapperCol: { span: 15 },
                  label: "Fence Type"
                },
                n.getFieldDecorator("fenceType", {
                  initialValue: r ? r.fenceType : void 0,
                  rules: [
                    { required: !0, message: "You have pick a fence type" }
                  ]
                })(
                  b.default.createElement(
                    F.default,
                    { placeholder: "select", style: { width: "100%" } },
                    I.map(function(e, t) {
                      return b.default.createElement(
                        F.default.Option,
                        { key: t, value: t },
                        e
                      );
                    })
                  )
                )
              )
          );
        }),
        O = ((C = (0, k.connect)(function(e) {
          var t = e.geo,
            n = e.areas,
            a = e.loading;
          return { geo: t, areas: n, loading: a.models.geo };
        })),
        C(
          (y = (function(e) {
            function t() {
              var e, n;
              (0, u.default)(this, t);
              for (
                var a = arguments.length, i = new Array(a), l = 0;
                l < a;
                l++
              )
                i[l] = arguments[l];
              return (
                (n = (0, g.default)(
                  this,
                  (e = (0, p.default)(t)).call.apply(e, [this].concat(i))
                )),
                (n.state = {
                  currentAreaId: -1,
                  addFenceModalVisible: !1,
                  updateFenceModalVisible: !1,
                  deleteFenceModalVisible: !1,
                  isEditingFence: !1,
                  isEditingCenter: !1,
                  editingCenter: null,
                  editingFence: null,
                  isEditingFenceClosed: !1,
                  isEditingFenceModalVisible: !1,
                  selectedExistedFence: null,
                  isDeleteFenceModalVisible: !1
                }),
                (n.getAreaGeoInfo = function() {
                  var e = n.state.currentAreaId,
                    t = n.props.dispatch;
                  n.cancelEditing(),
                    t({ type: "geo/getFences", areaId: e }),
                    t({ type: "geo/getCenter", areaId: e });
                }),
                (n.handleMapClick = function(e) {
                  var t = n.state,
                    a = t.isEditingCenter,
                    i = t.isEditingFence,
                    l = t.editingFence,
                    d = t.selectedExistedFence,
                    c = { lat: e.latLng.lat(), lng: e.latLng.lng() };
                  a && n.setState({ editingCenter: c }),
                    i &&
                      n.setState({
                        editingFence: (0, s.default)({}, n.state.editingFence, {
                          fenceCoordinates: l.fenceCoordinates.concat([c])
                        })
                      }),
                    d && n.setState({ selectedExistedFence: null });
                }),
                (n.handleEditCenter = function(e) {
                  n.setState({ isEditingCenter: e });
                }),
                (n.handleCreateFence = function(e) {
                  n.setState({
                    isEditingFence: e,
                    isEditingFenceModalVisible: e
                  });
                }),
                (n.cancelEditing = function() {
                  n.setState({
                    isEditingFence: !1,
                    isEditingCenter: !1,
                    editingFence: null,
                    editingCenter: null,
                    isEditingFenceClosed: !1,
                    selectedExistedFence: null,
                    isEditingFenceModalVisible: !1,
                    isDeleteFenceModalVisible: !1
                  });
                }),
                (n.handleCreateFenceNextStep = function(e) {
                  var t = n.state.currentAreaId;
                  (e.fenceCoordinates = []),
                    (e.areaId = t),
                    n.setState({
                      isEditingFenceModalVisible: !1,
                      editingFence: e
                    });
                }),
                (n.handleCreateFenceModalVisible = function() {
                  n.setState({ isEditingFenceModalVisible: !1 }),
                    n.cancelEditing();
                }),
                (n.handleEncloseEditingFence = function() {
                  n.setState({ isEditingFenceClosed: !0 });
                }),
                (n.handleSave = function() {
                  var e = n.state,
                    t = e.isEditingFence,
                    a = e.isEditingCenter,
                    i = e.editingFence,
                    l = e.editingCenter,
                    d = e.currentAreaId,
                    c = n.props,
                    r = c.dispatch,
                    o = c.geo;
                  if (a)
                    if (o.area) {
                      var s = Object.assign({}, o.area);
                      (s.center = l),
                        r({
                          type: "geo/updateCenter",
                          payload: s,
                          id: o.area.id,
                          onSuccess: n.getAreaGeoInfo,
                          onError: n.cancelEditing
                        });
                    } else
                      r({
                        type: "geo/addCenter",
                        payload: { areaId: d, center: l },
                        onSuccess: n.getAreaGeoInfo,
                        onError: n.cancelEditing
                      });
                  t &&
                    (i.fenceCoordinates.push(i.fenceCoordinates[0]),
                    r({
                      type: "geo/addFence",
                      payload: i,
                      onSuccess: n.getAreaGeoInfo
                    }));
                }),
                (n.handleUpdateFence = function(e) {
                  var t = n.props.dispatch;
                  t({
                    type: "geo/updateFence",
                    id: e.id,
                    payload: e,
                    onSuccess: n.getAreaGeoInfo,
                    onError: n.cancelEditing
                  });
                }),
                (n.handleExistedFenceClick = function(e, t) {
                  var a = n.state,
                    i = a.isEditingCenter,
                    l = a.isEditingFence;
                  i || l
                    ? 0 === t.fenceType && n.handleMapClick(e)
                    : n.setState({ selectedExistedFence: t });
                }),
                (n.handleUndoFenceEditing = function() {
                  var e = n.state,
                    t = e.isEditingFence,
                    a = e.editingFence,
                    i = e.isEditingFenceClosed;
                  if (i) n.setState({ isEditingFenceClosed: !1 });
                  else if (a && a.fenceCoordinates.length > 2) {
                    var l = Array.from(a.fenceCoordinates);
                    l.pop(),
                      n.setState({
                        editingFence: (0, s.default)({}, a, {
                          fenceCoordinates: l
                        })
                      });
                  } else
                    t &&
                      n.setState({
                        isEditingFenceModalVisible: !0,
                        editingFence: (0, s.default)({}, a, {
                          fenceCoordinates: []
                        })
                      });
                }),
                (n.renderHeader = function(e, t) {
                  var a = n.state,
                    i = a.isEditingFence,
                    l = a.editingFence,
                    d = a.isEditingFenceClosed,
                    s = a.isEditingCenter,
                    u = a.editingCenter,
                    f = i && null != l && l.fenceCoordinates.length > 2,
                    g = (i && d) || (s && u);
                  return b.default.createElement(
                    "div",
                    null,
                    b.default.createElement(
                      r.default,
                      { gutter: { md: 8, lg: 24, xl: 48 } },
                      b.default.createElement(
                        o.default,
                        { md: 6, sm: 24 },
                        e &&
                          e.length > 0 &&
                          b.default.createElement(
                            F.default,
                            {
                              defaultValue: e[0].id,
                              placeholder: "select",
                              style: { width: "100%" },
                              disabled: t,
                              onChange: function(e) {
                                return n.setState(
                                  { currentAreaId: e },
                                  function() {
                                    return n.getAreaGeoInfo();
                                  }
                                );
                              }
                            },
                            e.map(function(e) {
                              return b.default.createElement(
                                F.default.Option,
                                { key: e.id, value: e.id },
                                e.name
                              );
                            })
                          )
                      )
                    ),
                    b.default.createElement(
                      r.default,
                      { gutter: { md: 8, lg: 24, xl: 48 } },
                      b.default.createElement(
                        o.default,
                        { md: 6, sm: 24 },
                        b.default.createElement(
                          c.default,
                          {
                            type: "primary",
                            onClick: function() {
                              return n.handleCreateFence(!0);
                            },
                            disabled: t
                          },
                          "Add Fence"
                        )
                      )
                    ),
                    b.default.createElement(
                      r.default,
                      { gutter: { md: 8, lg: 24, xl: 48 } },
                      b.default.createElement(
                        o.default,
                        { md: 6, sm: 24 },
                        b.default.createElement(
                          c.default,
                          {
                            type: "primary",
                            onClick: function() {
                              return n.handleEditCenter(!0);
                            },
                            disabled: t
                          },
                          "Edit Center"
                        )
                      )
                    ),
                    t &&
                      b.default.createElement(
                        r.default,
                        { gutter: { md: 8, lg: 24, xl: 48 } },
                        b.default.createElement(
                          o.default,
                          { md: 6, sm: 24 },
                          b.default.createElement(
                            c.default,
                            {
                              icon: "plus",
                              type: "primary",
                              onClick: function() {
                                return n.cancelEditing(!0);
                              }
                            },
                            "Cancel Editing"
                          )
                        ),
                        b.default.createElement(
                          o.default,
                          { md: 6, sm: 24 },
                          b.default.createElement(
                            c.default,
                            {
                              icon: "plus",
                              type: "primary",
                              onClick: function() {
                                return n.handleSave();
                              },
                              disabled: !g
                            },
                            "Save"
                          )
                        ),
                        f &&
                          b.default.createElement(
                            o.default,
                            { md: 6, sm: 24 },
                            b.default.createElement(
                              c.default,
                              {
                                icon: "plus",
                                type: "primary",
                                onClick: function() {
                                  return n.handleEncloseEditingFence();
                                },
                                disabled: d
                              },
                              "Close Fence"
                            )
                          ),
                        i &&
                          b.default.createElement(
                            o.default,
                            { md: 6, sm: 24 },
                            b.default.createElement(
                              c.default,
                              {
                                icon: "plus",
                                type: "primary",
                                onClick: function() {
                                  return n.handleUndoFenceEditing();
                                }
                              },
                              "Undo"
                            )
                          )
                      )
                  );
                }),
                (n.handleEditFence = function() {
                  var e = n.state.selectedExistedFence;
                  e && n.setState({ isEditingFenceModalVisible: !0 });
                }),
                (n.handleEditFenceSubmit = function(e) {
                  var t = n.state.selectedExistedFence;
                  n.handleUpdateFence(Object.assign({}, t, e));
                }),
                (n.handleDeleteFence = function() {
                  var e = n.state.selectedExistedFence;
                  if (e) {
                    var t = n.props.dispatch;
                    t({
                      type: "geo/removeFence",
                      id: e.id,
                      onSuccess: n.getAreaGeoInfo,
                      onError: n.cancelEditing
                    });
                  }
                }),
                n
              );
            }
            return (
              (0, E.default)(t, e),
              (0, f.default)(t, [
                {
                  key: "componentDidMount",
                  value: function() {
                    var e = this,
                      t = this.props.areas.data;
                    if (t && t.length > 0) {
                      var n = t[0].id;
                      this.setState({ currentAreaId: n }, function() {
                        return e.getAreaGeoInfo();
                      });
                    }
                  }
                },
                {
                  key: "render",
                  value: function() {
                    var e = this,
                      t = this.props,
                      n = t.geo,
                      a = t.areas,
                      i = (t.loading, this.state),
                      s = (i.currentAreaId,
                      i.addFenceModalVisible,
                      i.updateFenceModalVisible,
                      i.deleteFenceModalVisible,
                      i.isEditingFence),
                      u = i.isEditingCenter,
                      f = (i.editingCenter, i.editingFence),
                      g = i.isEditingFenceModalVisible,
                      p = i.selectedExistedFence,
                      E = i.isDeleteFenceModalVisible,
                      F = u || s;
                    return b.default.createElement(
                      M.default,
                      { title: "Geo Management" },
                      b.default.createElement(
                        l.default,
                        { bordered: !1 },
                        b.default.createElement(
                          "div",
                          null,
                          b.default.createElement(
                            "div",
                            null,
                            this.renderHeader(a.data, F)
                          ),
                          !F &&
                            p &&
                            b.default.createElement(
                              r.default,
                              { gutter: { md: 8, lg: 24, xl: 48 } },
                              b.default.createElement(
                                o.default,
                                { md: 8, sm: 24 },
                                "Name: ",
                                p.name,
                                " Type: ",
                                I[p.fenceType]
                              ),
                              b.default.createElement(
                                o.default,
                                { md: 8, sm: 24 },
                                b.default.createElement(
                                  c.default,
                                  {
                                    type: "primary",
                                    onClick: function() {
                                      return e.handleEditFence();
                                    },
                                    disabled: F
                                  },
                                  "Edit"
                                )
                              ),
                              b.default.createElement(
                                o.default,
                                { md: 8, sm: 24 },
                                b.default.createElement(
                                  c.default,
                                  {
                                    type: "danger",
                                    onClick: function() {
                                      return e.setState({
                                        isDeleteFenceModalVisible: !0
                                      });
                                    },
                                    disabled: F
                                  },
                                  "DELETE"
                                )
                              )
                            ),
                          b.default.createElement(
                            T,
                            (0, d.default)(
                              {
                                onMapClick: this.handleMapClick,
                                handleExistedFenceClick: this
                                  .handleExistedFenceClick
                              },
                              this.state,
                              {
                                center: n.area && n.area.center,
                                fences: n.fences
                              }
                            )
                          )
                        )
                      ),
                      b.default.createElement(D, {
                        handleNext: p
                          ? this.handleEditFenceSubmit
                          : this.handleCreateFenceNextStep,
                        handleModalVisible: this.handleCreateFenceModalVisible,
                        modalVisible: g,
                        editingFence: f,
                        selectedExistedFence: p
                      }),
                      b.default.createElement(
                        m.default,
                        {
                          title: "Delete Fence",
                          visible: E,
                          onOk: this.handleDeleteFence,
                          onCancel: function() {
                            return e.setState({
                              isDeleteFenceModalVisible: !1
                            });
                          }
                        },
                        b.default.createElement(
                          "p",
                          null,
                          "Area you sure you want to delete fence: ",
                          p && p.name,
                          " ?"
                        )
                      )
                    );
                  }
                }
              ]),
              t
            );
          })(b.PureComponent))
        ) || y),
        G = O;
      t.default = G;
    }
  }
]);
