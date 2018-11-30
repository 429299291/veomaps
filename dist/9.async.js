(window["webpackJsonp"] = window["webpackJsonp"] || []).push([
  [9],
  {
    "4b56": function(e, t, a) {
      e.exports = {
        tableList: "antd-pro-pages-vehicle-ride-tableList",
        tableListOperator: "antd-pro-pages-vehicle-ride-tableListOperator",
        tableListForm: "antd-pro-pages-vehicle-ride-tableListForm",
        submitButtons: "antd-pro-pages-vehicle-ride-submitButtons"
      };
    },
    BcOJ: function(e, t, a) {
      "use strict";
      var l = a("TqRt"),
        n = a("284h");
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.default = void 0);
      var r = l(a("pVnL"));
      a("IzEo");
      var d = l(a("bx4M"));
      a("+L6B");
      var i = l(a("2/Rp"));
      a("14J3");
      var u = l(a("BMrR"));
      a("jCWc");
      var s = l(a("kPKH")),
        o = l(a("MVZn"));
      a("/zsF");
      var c = l(a("PArb")),
        f = l(a("lwsE")),
        m = l(a("W8MJ")),
        p = l(a("a1gu")),
        h = l(a("Nsbk")),
        E = l(a("7W2i"));
      a("2qtc");
      var g = l(a("kLXV"));
      a("giR+");
      var b = l(a("fyUT"));
      a("7Kak");
      var v = l(a("9yH6"));
      a("OaEy");
      var R = l(a("2fM7"));
      a("5NDa");
      var y = l(a("5rEg"));
      a("FJo9");
      var M = l(a("L41K"));
      a("y8nQ");
      var k = l(a("Vl3Y"));
      a("iQDF");
      var S,
        V,
        C,
        D = l(a("+eQT")),
        P = n(a("q1tI")),
        w = a("MuoO"),
        Y = l(a("wd/R")),
        H = l(a("CkN6")),
        F = l(a("zHco")),
        I = l(a("4b56")),
        L = a("eHHv"),
        O = a("PQp+"),
        x = D.default.RangePicker,
        T = k.default.Item,
        z = (M.default.Step, y.default.TextArea, R.default.Option),
        N = (v.default.Group, ["USING", "FINISHED"]),
        G = ["GPRS", "BLUETOOTH"],
        U = k.default.create()(function(e) {
          var t = e.isEndRideVisible,
            a = e.form,
            l = e.handleEndRide,
            n = e.handleEndRideVisible,
            r = e.ride,
            d = function() {
              a.validateFields(function(e, t) {
                e || (a.resetFields(), l(r.id, t));
              });
            },
            i = Math.round((new Date() - new Date(r.start)) / 6e4);
          return P.default.createElement(
            g.default,
            {
              destroyOnClose: !0,
              title: "End Ride",
              visible: t,
              onOk: d,
              onCancel: function() {
                return n(!1);
              }
            },
            P.default.createElement(
              T,
              {
                labelCol: { span: 5 },
                wrapperCol: { span: 15 },
                label: "Minutes"
              },
              a.getFieldDecorator("minutes", { initialValue: i })(
                P.default.createElement(b.default, {
                  placeholder: "Please Input"
                })
              )
            )
          );
        }),
        W = (0, L.compose)(
          (0, L.withProps)({
            googleMapURL:
              "https://maps.googleapis.com/maps/api/js?key=AIzaSyDPnV_7djRAy8m_RuM5T0QIHU5R-07s3Ic&v=3.exp&libraries=geometry,drawing,places",
            loadingElement: P.default.createElement("div", {
              style: { height: "100%" }
            }),
            containerElement: P.default.createElement("div", {
              style: { height: "400px" }
            }),
            mapElement: P.default.createElement("div", {
              style: { height: "100%" }
            })
          }),
          O.withScriptjs,
          O.withGoogleMap
        )(function(e) {
          var t = e.path,
            a = t[Math.round(t.length / 2)];
          return P.default.createElement(
            O.GoogleMap,
            { defaultZoom: 11, center: a },
            P.default.createElement(O.Marker, { position: t[0] }),
            P.default.createElement(O.Marker, { position: t[t.length - 1] }),
            P.default.createElement(O.Polyline, {
              path: t,
              geodesic: !0,
              options: {
                strokeColor: "#ff0000",
                strokeOpacity: 0.75,
                strokeWeight: 2
              }
            })
          );
        }),
        B = ((S = (0, w.connect)(function(e) {
          var t = e.rides,
            a = e.areas,
            l = e.loading;
          return { rides: t, areas: a, loading: l.models.rides };
        })),
        (V = k.default.create()),
        S(
          (C =
            V(
              (C = (function(e) {
                function t() {
                  var e, a;
                  (0, f.default)(this, t);
                  for (
                    var l = arguments.length, n = new Array(l), r = 0;
                    r < l;
                    r++
                  )
                    n[r] = arguments[r];
                  return (
                    (a = (0, p.default)(
                      this,
                      (e = (0, h.default)(t)).call.apply(e, [this].concat(n))
                    )),
                    (a.state = {
                      isEndRideVisible: !1,
                      filterCriteria: { currentPage: 1, pageSize: 10 },
                      selectedRecord: null
                    }),
                    (a.columns = [
                      { title: "Phone", dataIndex: "phone" },
                      { title: "Vehicle Number", dataIndex: "vehicleNumber" },
                      {
                        title: "Lock Way",
                        dataIndex: "lockMethod",
                        render: function(e) {
                          return P.default.createElement("span", null, G[e]);
                        }
                      },
                      {
                        title: "Unlock Way",
                        dataIndex: "unlockMethod",
                        render: function(e) {
                          return P.default.createElement("span", null, G[e]);
                        }
                      },
                      {
                        title: "Start",
                        dataIndex: "start",
                        sorter: !0,
                        render: function(e) {
                          return P.default.createElement(
                            "span",
                            null,
                            (0, Y.default)(e).format("YYYY-MM-DD HH:mm:ss")
                          );
                        }
                      },
                      {
                        title: "End",
                        dataIndex: "end",
                        sorter: !0,
                        render: function(e) {
                          return P.default.createElement(
                            "span",
                            null,
                            (0, Y.default)(e).format("YYYY-MM-DD HH:mm:ss")
                          );
                        }
                      },
                      {
                        title: "operation",
                        render: function(e, t) {
                          return P.default.createElement(
                            P.Fragment,
                            null,
                            !t.end &&
                              P.default.createElement(
                                "a",
                                {
                                  onClick: function() {
                                    return a.handleEndRideVisible(!0, t);
                                  }
                                },
                                "End Ride"
                              ),
                            !t.end &&
                              P.default.createElement(c.default, {
                                type: "vertical"
                              }),
                            P.default.createElement(
                              "a",
                              {
                                onClick: function() {
                                  return a.handleDetailModalVisible(!0, t);
                                }
                              },
                              "Detail"
                            )
                          );
                        }
                      }
                    ]),
                    (a.handleGetRides = function() {
                      var e = a.props.dispatch,
                        t = a.state.filterCriteria;
                      e({ type: "rides/get", payload: t });
                    }),
                    (a.handleStandardTableChange = function(e, t, l) {
                      var n = a.props.dispatch,
                        r = a.state.filterCriteria,
                        d = (0, o.default)({}, r);
                      (d.currentPage = e.current),
                        (d.pageSize = e.pageSize),
                        l.field &&
                          (d.sorter = "".concat(l.field, "_").concat(l.order)),
                        a.setState({ filterCriteria: d }),
                        n({ type: "rides/get", payload: d });
                    }),
                    (a.handleFormReset = function() {
                      var e = a.props,
                        t = e.form,
                        l = (e.dispatch, a.state.filterCriteria);
                      t.resetFields();
                      var n = { currentPage: 1, pageSize: l.pageSize };
                      a.setState({ filterCriteria: n }, function() {
                        return a.handleGetRides();
                      });
                    }),
                    (a.handleSearch = function(e) {
                      e.preventDefault();
                      var t = a.props.form,
                        l = a.state.filterCriteria;
                      t.validateFields(function(e, t) {
                        if (!e) {
                          t.timeRange &&
                            ((t.rideStart = t.timeRange[0].format(
                              "MM-DD-YYYY HH:mm:ss"
                            )),
                            (t.rideEnd = t.timeRange[1].format(
                              "MM-DD-YYYY HH:mm:ss"
                            )),
                            (t.timeRange = void 0));
                          var n = Object.assign({}, l, t, {
                            currentPage: 1,
                            pageSize: 10
                          });
                          a.setState({ filterCriteria: n }, function() {
                            return a.handleGetRides();
                          });
                        }
                      });
                    }),
                    (a.handleUpdateModalVisible = function(e, t) {
                      a.setState({
                        updateModalVisible: !!e,
                        selectedRecord: t || {}
                      });
                    }),
                    (a.handleDetailModalVisible = function(e, t) {
                      var l = a.props.dispatch;
                      a.state.filterCriteria;
                      e
                        ? l({
                            type: "rides/getRoute",
                            rideId: t.id,
                            onSuccess: function(e) {
                              return a.setState({
                                selectedRidePath: e,
                                detailModalVisible: !0,
                                selectedRecord: t
                              });
                            }
                          })
                        : a.setState({
                            detailModalVisible: !1,
                            selectedRecord: null,
                            selectedRidePath: null
                          });
                    }),
                    (a.handleEndRide = function(e, t) {
                      var l = a.props.dispatch;
                      l({
                        type: "rides/endRide",
                        rideId: e,
                        minutes: t,
                        onSuccess: function() {
                          return a.handleGetRides();
                        }
                      }),
                        a.handleEndRideVisible();
                    }),
                    (a.handleUpdate = function(e, t) {
                      var l = a.props.dispatch;
                      l({
                        type: "rides/update",
                        payload: t,
                        id: e,
                        onSuccess: a.handleGetRides
                      }),
                        a.handleUpdateModalVisible();
                    }),
                    (a.handleEndRideVisible = function(e, t) {
                      a.setState({ isEndRideVisible: !!e, selectedRecord: t });
                    }),
                    a
                  );
                }
                return (
                  (0, E.default)(t, e),
                  (0, m.default)(t, [
                    {
                      key: "componentDidMount",
                      value: function() {
                        this.handleGetRides();
                      }
                    },
                    {
                      key: "renderSimpleForm",
                      value: function() {
                        var e = this.props.form.getFieldDecorator;
                        return P.default.createElement(
                          k.default,
                          { onSubmit: this.handleSearch, layout: "inline" },
                          P.default.createElement(
                            u.default,
                            { gutter: { md: 8, lg: 24, xl: 48 } },
                            P.default.createElement(
                              s.default,
                              { md: 6, sm: 24 },
                              P.default.createElement(
                                T,
                                { label: "Keywords" },
                                e("numberOrPhone")(
                                  P.default.createElement(y.default, {
                                    placeholder: "NUMBER PHONE"
                                  })
                                )
                              )
                            ),
                            P.default.createElement(
                              s.default,
                              { md: 6, sm: 24 },
                              P.default.createElement(
                                T,
                                { label: "Type" },
                                e("type")(
                                  P.default.createElement(
                                    R.default,
                                    {
                                      placeholder: "select",
                                      style: { width: "100%" }
                                    },
                                    N.map(function(e, t) {
                                      return P.default.createElement(
                                        z,
                                        { key: t, value: t },
                                        N[t]
                                      );
                                    })
                                  )
                                )
                              )
                            ),
                            P.default.createElement(
                              s.default,
                              { md: 6, sm: 24 },
                              P.default.createElement(
                                T,
                                { label: "Lock Way" },
                                e("lockWay")(
                                  P.default.createElement(
                                    R.default,
                                    {
                                      placeholder: "select",
                                      style: { width: "100%" }
                                    },
                                    G.map(function(e, t) {
                                      return P.default.createElement(
                                        z,
                                        { key: t, value: t },
                                        G[t]
                                      );
                                    })
                                  )
                                )
                              )
                            ),
                            P.default.createElement(
                              s.default,
                              { md: 6, sm: 24 },
                              P.default.createElement(
                                T,
                                { label: "Unlock Way" },
                                e("unlockWay")(
                                  P.default.createElement(
                                    R.default,
                                    {
                                      placeholder: "select",
                                      style: { width: "100%" }
                                    },
                                    G.map(function(e, t) {
                                      return P.default.createElement(
                                        z,
                                        { key: t, value: t },
                                        G[t]
                                      );
                                    })
                                  )
                                )
                              )
                            )
                          ),
                          P.default.createElement(
                            u.default,
                            { gutter: { md: 8, lg: 24, xl: 48 } },
                            P.default.createElement(
                              s.default,
                              { md: 24, sm: 24 },
                              P.default.createElement(
                                T,
                                { label: "Time" },
                                e("timeRange")(
                                  P.default.createElement(x, {
                                    format: "YYYY-MM-DD HH:mm:ss",
                                    showTime: !0
                                  })
                                )
                              )
                            )
                          ),
                          P.default.createElement(
                            u.default,
                            { gutter: { md: 8, lg: 24, xl: 48 } },
                            P.default.createElement(
                              s.default,
                              { md: { span: 8, offset: 16 }, sm: 24 },
                              P.default.createElement(
                                "span",
                                {
                                  className: I.default.submitButtons,
                                  style: { float: "right" }
                                },
                                P.default.createElement(
                                  i.default,
                                  { type: "primary", htmlType: "submit" },
                                  "Search"
                                ),
                                P.default.createElement(
                                  i.default,
                                  {
                                    style: { marginLeft: 8 },
                                    onClick: this.handleFormReset
                                  },
                                  "Reset"
                                )
                              )
                            )
                          )
                        );
                      }
                    },
                    {
                      key: "render",
                      value: function() {
                        var e = this,
                          t = this.props,
                          a = t.rides,
                          l = (t.areas, t.loading),
                          n = this.state,
                          i = n.isEndRideVisible,
                          u = n.detailModalVisible,
                          s = n.selectedRecord,
                          o = n.filterCriteria,
                          c = n.selectedRidePath,
                          f = {
                            handleEndRide: this.handleEndRide,
                            handleEndRideVisible: this.handleEndRideVisible
                          },
                          m = {
                            defaultCurrent: 1,
                            current: o.currentPage,
                            pageSize: o.pageSize,
                            total: a.total
                          };
                        return P.default.createElement(
                          F.default,
                          { title: "Ride List" },
                          P.default.createElement(
                            d.default,
                            { bordered: !1 },
                            P.default.createElement(
                              "div",
                              { className: I.default.tableList },
                              P.default.createElement(
                                "div",
                                { className: I.default.tableListForm },
                                this.renderSimpleForm()
                              ),
                              P.default.createElement(H.default, {
                                loading: l,
                                data: { list: a.data, pagination: m },
                                columns: this.columns,
                                onChange: this.handleStandardTableChange,
                                scroll: { x: 1300 }
                              })
                            )
                          ),
                          i &&
                            P.default.createElement(
                              U,
                              (0, r.default)({}, f, {
                                isEndRideVisible: i,
                                ride: s
                              })
                            ),
                          s &&
                            u &&
                            P.default.createElement(
                              g.default,
                              {
                                destroyOnClose: !0,
                                title: "Detail",
                                visible: u,
                                onCancel: function() {
                                  return e.handleDetailModalVisible();
                                },
                                onOk: function() {
                                  return e.handleDetailModalVisible();
                                }
                              },
                              Object.keys(s).map(function(e) {
                                return P.default.createElement(
                                  "p",
                                  { key: e },
                                  "".concat(e, " : ").concat(s[e])
                                );
                              }),
                              c &&
                                c.length >= 2 &&
                                P.default.createElement(W, { path: c })
                            )
                        );
                      }
                    }
                  ]),
                  t
                );
              })(P.PureComponent))
            ) || C)
        ) || C),
        j = B;
      t.default = j;
    }
  }
]);
