(window["webpackJsonp"] = window["webpackJsonp"] || []).push([
  [8],
  {
    "m1+7": function(e, t, a) {
      e.exports = {
        tableList: "antd-pro-pages-vehicle-vehicle-tableList",
        tableListOperator: "antd-pro-pages-vehicle-vehicle-tableListOperator",
        tableListForm: "antd-pro-pages-vehicle-vehicle-tableListForm",
        submitButtons: "antd-pro-pages-vehicle-vehicle-submitButtons"
      };
    },
    nAvq: function(e, t, a) {
      "use strict";
      var l = a("TqRt"),
        r = a("284h");
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.default = void 0);
      var d = l(a("pVnL"));
      a("IzEo");
      var n = l(a("bx4M"));
      a("14J3");
      var i = l(a("BMrR"));
      a("Pwec");
      var u = l(a("CtXQ"));
      a("+L6B");
      var c = l(a("2/Rp"));
      a("jCWc");
      var o = l(a("kPKH")),
        s = l(a("MVZn"));
      a("/zsF");
      var f = l(a("PArb")),
        m = l(a("lwsE")),
        p = l(a("W8MJ")),
        h = l(a("a1gu")),
        E = l(a("Nsbk")),
        v = l(a("7W2i"));
      a("2qtc");
      var b = l(a("kLXV"));
      a("7Kak");
      var y = l(a("9yH6"));
      a("OaEy");
      var g = l(a("2fM7"));
      a("5NDa");
      var C = l(a("5rEg"));
      a("FJo9");
      var S = l(a("L41K"));
      a("y8nQ");
      var k,
        V,
        w,
        F = l(a("Vl3Y")),
        M = r(a("q1tI")),
        D = a("MuoO"),
        I = l(a("wd/R")),
        L = l(a("CkN6")),
        A = l(a("zHco")),
        T = l(a("m1+7")),
        x = a("0bUC"),
        B = F.default.Item,
        O = (S.default.Step, C.default.TextArea, g.default.Option),
        R = (y.default.Group, ["Offline", "Online"]),
        N = ["Unlock", "lock"],
        P = ["Bicycle", "Scooter", "E-Vehicle", "Car"],
        U = [
          "Normal",
          "Error",
          "Auto Error",
          "Scrapped",
          "Waiting for Activation"
        ],
        q = function(e) {
          return e >= 420
            ? 100
            : e < 420 && e >= 411
              ? 95 + (5 * (e - 411)) / 9
              : e < 411 && e >= 395
                ? 90 + (5 * (e - 395)) / 16
                : e < 395 && e >= 386
                  ? 80 + (10 * (e - 386)) / 9
                  : e < 386 && e >= 379
                    ? 70 + (10 * (e - 379)) / 7
                    : e < 379 && e >= 373
                      ? 60 + (10 * (e - 373)) / 6
                      : e < 373 && e >= 369
                        ? 50 + (10 * (e - 369)) / 4
                        : e < 369 && e >= 365
                          ? 40 + (10 * (e - 365)) / 4
                          : e < 365 && e >= 363
                            ? 30 + (10 * (e - 363)) / 2
                            : e < 363 && e >= 359
                              ? 20 + (10 * (e - 359)) / 4
                              : e < 359 && e >= 354
                                ? 10 + (10 * (e - 354)) / 5
                                : e < 354 && e > 340
                                  ? (10 * (e - 340)) / 14
                                  : 0;
        },
        z = F.default.create()(function(e) {
          var t = e.modalVisible,
            a = e.form,
            l = e.handleAdd,
            r = e.handleModalVisible,
            d = e.areas,
            n = function() {
              a.validateFields(function(e, t) {
                e ||
                  (a.resetFields(),
                  (t.vehicleNumber = parseInt(t.vehicleNumber, 10)),
                  l(t));
              });
            };
          return M.default.createElement(
            b.default,
            {
              destroyOnClose: !0,
              title: "Add",
              visible: t,
              onOk: n,
              onCancel: function() {
                return r();
              }
            },
            M.default.createElement(
              B,
              { labelCol: { span: 5 }, wrapperCol: { span: 15 }, label: "ID" },
              a.getFieldDecorator("vehicleNumber", {
                rules: [{ required: !0, message: "At least 8 Digits!", min: 1 }]
              })(
                M.default.createElement(C.default, {
                  placeholder: "Please Input"
                })
              )
            ),
            M.default.createElement(
              B,
              {
                labelCol: { span: 5 },
                wrapperCol: { span: 15 },
                label: "IMEI"
              },
              a.getFieldDecorator("imei", {
                rules: [
                  { required: !0, message: "At least 15 Digits!", min: 1 }
                ]
              })(
                M.default.createElement(C.default, {
                  placeholder: "Please Input"
                })
              )
            ),
            M.default.createElement(
              B,
              {
                labelCol: { span: 5 },
                wrapperCol: { span: 15 },
                label: "Type"
              },
              a.getFieldDecorator("vehicleType", {
                rules: [{ required: !0, message: "You have pick a type" }]
              })(
                M.default.createElement(
                  g.default,
                  { placeholder: "select", style: { width: "100%" } },
                  M.default.createElement(O, { value: "0" }, "Bike"),
                  M.default.createElement(O, { value: "1" }, "Scooter"),
                  M.default.createElement(O, { value: "2" }, "E-Bike")
                )
              )
            ),
            d &&
              M.default.createElement(
                B,
                {
                  labelCol: { span: 5 },
                  wrapperCol: { span: 15 },
                  label: "Area"
                },
                a.getFieldDecorator("areaId", {
                  rules: [{ required: !0, message: "You have pick a area" }]
                })(
                  M.default.createElement(
                    g.default,
                    { placeholder: "select", style: { width: "100%" } },
                    d.map(function(e) {
                      return M.default.createElement(
                        O,
                        { key: e.id, value: e.id },
                        e.name
                      );
                    })
                  )
                )
              )
          );
        }),
        Y = F.default.create()(function(e) {
          var t = e.form,
            a = e.modalVisible,
            l = e.handleUpdate,
            r = e.handleModalVisible,
            d = e.areas,
            n = e.record,
            i = function() {
              t.isFieldsTouched()
                ? t.validateFields(function(e, a) {
                    e ||
                      (t.resetFields(),
                      (a.vehicleNumber = parseInt(a.vehicleNumber, 10)),
                      l(n.id, a));
                  })
                : r();
            };
          return M.default.createElement(
            b.default,
            {
              destroyOnClose: !0,
              title: "Update",
              visible: a,
              onOk: i,
              onCancel: function() {
                return r();
              }
            },
            M.default.createElement(
              B,
              { labelCol: { span: 5 }, wrapperCol: { span: 15 }, label: "ID" },
              t.getFieldDecorator("vehicleNumber", {
                rules: [
                  { required: !0, message: "At least 8 Digits!", min: 1 }
                ],
                initialValue: n.vehicleNumber + ""
              })(
                M.default.createElement(C.default, {
                  placeholder: "Please Input"
                })
              )
            ),
            M.default.createElement(
              B,
              {
                labelCol: { span: 5 },
                wrapperCol: { span: 15 },
                label: "IMEI"
              },
              t.getFieldDecorator("imei", {
                rules: [
                  { required: !0, message: "At least 15 Digits!", min: 1 }
                ],
                initialValue: n.imei
              })(
                M.default.createElement(C.default, {
                  placeholder: "Please Input"
                })
              )
            ),
            M.default.createElement(
              B,
              {
                labelCol: { span: 5 },
                wrapperCol: { span: 15 },
                label: "Lock Status"
              },
              t.getFieldDecorator("lockStatus", { initialValue: n.lockStatus })(
                M.default.createElement(
                  g.default,
                  { placeholder: "select", style: { width: "100%" } },
                  M.default.createElement(O, { value: 0 }, "Unlock"),
                  M.default.createElement(O, { value: 1 }, "Lock")
                )
              )
            ),
            M.default.createElement(
              B,
              {
                labelCol: { span: 5 },
                wrapperCol: { span: 15 },
                label: "Error Status"
              },
              t.getFieldDecorator("errorStatus", {
                initialValue: n.errorStatus
              })(
                M.default.createElement(
                  g.default,
                  { placeholder: "select", style: { width: "100%" } },
                  U.map(function(e, t) {
                    return M.default.createElement(O, { key: t, value: t }, e);
                  })
                )
              )
            ),
            M.default.createElement(
              B,
              {
                labelCol: { span: 5 },
                wrapperCol: { span: 15 },
                label: "Type"
              },
              t.getFieldDecorator("vehicleType", {
                rules: [{ required: !0, message: "You have pick a type" }],
                initialValue: n.vehicleType
              })(
                M.default.createElement(
                  g.default,
                  { placeholder: "select", style: { width: "100%" } },
                  M.default.createElement(O, { value: 0 }, "Bike"),
                  M.default.createElement(O, { value: 1 }, "Scooter"),
                  M.default.createElement(O, { value: 2 }, "E-Bike")
                )
              )
            ),
            d &&
              M.default.createElement(
                B,
                {
                  labelCol: { span: 5 },
                  wrapperCol: { span: 15 },
                  label: "Area"
                },
                t.getFieldDecorator("areaId", {
                  rules: [{ required: !0, message: "You have pick a area" }],
                  initialValue: n.areaId
                })(
                  M.default.createElement(
                    g.default,
                    { placeholder: "select", style: { width: "100%" } },
                    d.map(function(e) {
                      return M.default.createElement(
                        O,
                        { key: e.id, value: e.id },
                        e.name
                      );
                    })
                  )
                )
              )
          );
        }),
        G = ((k = (0, D.connect)(function(e) {
          var t = e.vehicles,
            a = e.areas,
            l = e.loading;
          return { vehicles: t, areas: a, loading: l.models.vehicles };
        })),
        (V = F.default.create()),
        k(
          (w =
            V(
              (w = (function(e) {
                function t() {
                  var e, a;
                  (0, m.default)(this, t);
                  for (
                    var l = arguments.length, r = new Array(l), d = 0;
                    d < l;
                    d++
                  )
                    r[d] = arguments[d];
                  return (
                    (a = (0, h.default)(
                      this,
                      (e = (0, E.default)(t)).call.apply(e, [this].concat(r))
                    )),
                    (a.state = {
                      modalVisible: !1,
                      updateModalVisible: !1,
                      detailModalVisible: !1,
                      expandForm: !1,
                      selectedRows: [],
                      filterCriteria: { currentPage: 1, pageSize: 10 },
                      selectedRecord: {}
                    }),
                    (a.columns = [
                      { title: "ID", dataIndex: "vehicleNumber" },
                      {
                        title: "Power",
                        dataIndex: "power",
                        render: function(e) {
                          return M.default.createElement(
                            "p",
                            null,
                            (0, x.roundTo2Decimal)(q(e)) + "%"
                          );
                        }
                      },
                      {
                        title: "Status",
                        dataIndex: "connectStatus",
                        render: function(e, t) {
                          return M.default.createElement(
                            M.Fragment,
                            null,
                            M.default.createElement(
                              "span",
                              null,
                              N[t.lockStatus]
                            ),
                            M.default.createElement(f.default, {
                              type: "vertical"
                            }),
                            M.default.createElement(
                              "span",
                              null,
                              U[t.errorStatus]
                            ),
                            M.default.createElement(f.default, {
                              type: "vertical"
                            }),
                            M.default.createElement(
                              "span",
                              null,
                              R[t.connectStatus]
                            )
                          );
                        }
                      },
                      {
                        title: "Ride Count",
                        dataIndex: "rideCount",
                        sorter: !0,
                        render: function(e) {
                          return M.default.createElement("span", null, e);
                        }
                      },
                      {
                        title: "Last Ride Time",
                        dataIndex: "lastRideTime",
                        sorter: !0,
                        render: function(e) {
                          return M.default.createElement(
                            "span",
                            null,
                            (0, I.default)(e).format("YYYY-MM-DD HH:mm:ss")
                          );
                        }
                      },
                      {
                        title: "Type",
                        dataIndex: "vehicleType",
                        render: function(e) {
                          return M.default.createElement("p", null, P[e]);
                        }
                      },
                      {
                        title: "operation",
                        render: function(e, t) {
                          return M.default.createElement(
                            M.Fragment,
                            null,
                            M.default.createElement(
                              "a",
                              {
                                onClick: function() {
                                  return a.handleUpdateModalVisible(!0, t);
                                }
                              },
                              "Update"
                            ),
                            M.default.createElement(f.default, {
                              type: "vertical"
                            }),
                            M.default.createElement(
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
                    (a.handleGetVehicles = function() {
                      var e = a.props.dispatch,
                        t = a.state.filterCriteria;
                      e({ type: "vehicles/getCount", payload: t }),
                        e({ type: "vehicles/get", payload: t });
                    }),
                    (a.handleStandardTableChange = function(e, t, l) {
                      var r = a.props.dispatch,
                        d = a.state.filterCriteria,
                        n = (0, s.default)({}, d);
                      (n.currentPage = e.current),
                        (n.pageSize = e.pageSize),
                        l.field &&
                          (n.sorter = "".concat(l.field, "_").concat(l.order)),
                        a.setState({ filterCriteria: n }),
                        r({ type: "vehicles/get", payload: n });
                    }),
                    (a.handleFormReset = function() {
                      var e = a.props,
                        t = e.form,
                        l = (e.dispatch, a.state.filterCriteria);
                      t.resetFields();
                      var r = { currentPage: 1, pageSize: l.pageSize };
                      a.setState({ filterCriteria: r }, function() {
                        return a.handleGetVehicles();
                      });
                    }),
                    (a.toggleForm = function() {
                      var e = a.state.expandForm;
                      a.setState({ expandForm: !e });
                    }),
                    (a.handleSearch = function(e) {
                      e.preventDefault();
                      var t = a.props,
                        l = (t.dispatch, t.form),
                        r = a.state.filterCriteria;
                      l.validateFields(function(e, t) {
                        if (!e) {
                          var l = Object.assign({}, r, t, {
                            currentPage: 1,
                            pageSize: 10
                          });
                          a.setState({ filterCriteria: l }, function() {
                            return a.handleGetVehicles();
                          });
                        }
                      });
                    }),
                    (a.handleModalVisible = function(e) {
                      a.setState({ createModalVisible: !!e });
                    }),
                    (a.handleUpdateModalVisible = function(e, t) {
                      a.setState({
                        updateModalVisible: !!e,
                        selectedRecord: t || {}
                      });
                    }),
                    (a.handleDetailModalVisible = function(e, t) {
                      a.setState({
                        detailModalVisible: !!e,
                        selectedRecord: t || {}
                      });
                    }),
                    (a.handleDeleteModalVisible = function(e, t) {
                      a.setState({
                        updateModalVisible: !!e,
                        selectedRecord: t || {}
                      });
                    }),
                    (a.handleAdd = function(e) {
                      var t = a.props.dispatch;
                      t({ type: "vehicles/add", payload: e }),
                        a.handleModalVisible();
                    }),
                    (a.handleUpdate = function(e, t) {
                      var l = a.props.dispatch;
                      l({
                        type: "vehicles/update",
                        payload: t,
                        id: e,
                        onSuccess: a.handleGetVehicles
                      }),
                        a.handleUpdateModalVisible();
                    }),
                    a
                  );
                }
                return (
                  (0, v.default)(t, e),
                  (0, p.default)(t, [
                    {
                      key: "componentDidMount",
                      value: function() {
                        this.handleGetVehicles();
                      }
                    },
                    {
                      key: "renderSimpleForm",
                      value: function() {
                        var e = this.props.form.getFieldDecorator;
                        return M.default.createElement(
                          F.default,
                          { onSubmit: this.handleSearch, layout: "inline" },
                          M.default.createElement(
                            i.default,
                            { gutter: { md: 8, lg: 24, xl: 48 } },
                            M.default.createElement(
                              o.default,
                              { md: 8, sm: 24 },
                              M.default.createElement(
                                B,
                                { label: "Keywords" },
                                e("numberOrImei")(
                                  M.default.createElement(C.default, {
                                    placeholder: "number or imei"
                                  })
                                )
                              )
                            ),
                            M.default.createElement(
                              o.default,
                              { md: 8, sm: 24 },
                              M.default.createElement(
                                B,
                                { label: "Battery Status" },
                                e("powerStatus")(
                                  M.default.createElement(
                                    g.default,
                                    {
                                      placeholder: "select",
                                      style: { width: "100%" }
                                    },
                                    M.default.createElement(
                                      O,
                                      { value: "0" },
                                      "Low Battery"
                                    ),
                                    M.default.createElement(
                                      O,
                                      { value: "1" },
                                      "Full Battery"
                                    )
                                  )
                                )
                              )
                            ),
                            M.default.createElement(
                              o.default,
                              { md: 8, sm: 24 },
                              M.default.createElement(
                                "span",
                                { className: T.default.submitButtons },
                                M.default.createElement(
                                  c.default,
                                  { type: "primary", htmlType: "submit" },
                                  "Search"
                                ),
                                M.default.createElement(
                                  c.default,
                                  {
                                    style: { marginLeft: 8 },
                                    onClick: this.handleFormReset
                                  },
                                  "Reset"
                                ),
                                M.default.createElement(
                                  "a",
                                  {
                                    style: { marginLeft: 8 },
                                    onClick: this.toggleForm
                                  },
                                  "more ",
                                  M.default.createElement(u.default, {
                                    type: "down"
                                  })
                                )
                              )
                            )
                          )
                        );
                      }
                    },
                    {
                      key: "renderAdvancedForm",
                      value: function() {
                        var e = this.props.form.getFieldDecorator,
                          t = this.props.areas.data;
                        return M.default.createElement(
                          F.default,
                          { onSubmit: this.handleSearch, layout: "inline" },
                          M.default.createElement(
                            i.default,
                            { gutter: { md: 8, lg: 24, xl: 48 } },
                            M.default.createElement(
                              o.default,
                              { md: 8, sm: 24 },
                              M.default.createElement(
                                B,
                                { label: "Keywords" },
                                e("numberOrImei")(
                                  M.default.createElement(C.default, {
                                    placeholder: "number or imei"
                                  })
                                )
                              )
                            ),
                            M.default.createElement(
                              o.default,
                              { md: 8, sm: 24 },
                              M.default.createElement(
                                B,
                                { label: "Battery Status" },
                                e("powerStatus")(
                                  M.default.createElement(
                                    g.default,
                                    {
                                      placeholder: "select",
                                      style: { width: "100%" }
                                    },
                                    M.default.createElement(
                                      O,
                                      { value: "0" },
                                      "Low Battery"
                                    ),
                                    M.default.createElement(
                                      O,
                                      { value: "1" },
                                      "Full Battery"
                                    )
                                  )
                                )
                              )
                            ),
                            M.default.createElement(
                              o.default,
                              { md: 8, sm: 24 },
                              M.default.createElement(
                                B,
                                { label: "Lock Status" },
                                e("lockStatus")(
                                  M.default.createElement(
                                    g.default,
                                    {
                                      placeholder: "select",
                                      style: { width: "100%" }
                                    },
                                    M.default.createElement(
                                      O,
                                      { value: "0" },
                                      "Unlock"
                                    ),
                                    M.default.createElement(
                                      O,
                                      { value: "1" },
                                      "Lock"
                                    )
                                  )
                                )
                              )
                            )
                          ),
                          M.default.createElement(
                            i.default,
                            { gutter: { md: 8, lg: 24, xl: 48 } },
                            M.default.createElement(
                              o.default,
                              { md: 8, sm: 24 },
                              M.default.createElement(
                                B,
                                { label: "Error Status" },
                                e("errorStatus")(
                                  M.default.createElement(
                                    g.default,
                                    {
                                      mode: "multiple",
                                      placeholder: "select",
                                      style: { width: "100%" }
                                    },
                                    M.default.createElement(
                                      O,
                                      { value: "0" },
                                      "Normal"
                                    ),
                                    M.default.createElement(
                                      O,
                                      { value: "1" },
                                      "Error"
                                    ),
                                    M.default.createElement(
                                      O,
                                      { value: "2" },
                                      "Auto Error"
                                    ),
                                    M.default.createElement(
                                      O,
                                      { value: "3" },
                                      "Scrapped"
                                    ),
                                    M.default.createElement(
                                      O,
                                      { value: "4" },
                                      "Waiting for Activation"
                                    )
                                  )
                                )
                              )
                            ),
                            M.default.createElement(
                              o.default,
                              { md: 8, sm: 24 },
                              M.default.createElement(
                                B,
                                { label: "Vehicle Type" },
                                e("vehicleType")(
                                  M.default.createElement(
                                    g.default,
                                    {
                                      placeholder: "select",
                                      style: { width: "100%" }
                                    },
                                    M.default.createElement(
                                      O,
                                      { value: "0" },
                                      "Bike"
                                    ),
                                    M.default.createElement(
                                      O,
                                      { value: "1" },
                                      "Scooter"
                                    ),
                                    M.default.createElement(
                                      O,
                                      { value: "2" },
                                      "e-bike"
                                    )
                                  )
                                )
                              )
                            ),
                            M.default.createElement(
                              o.default,
                              { md: 8, sm: 24 },
                              M.default.createElement(
                                B,
                                { label: "Connection Status" },
                                e("connectStatus")(
                                  M.default.createElement(
                                    g.default,
                                    {
                                      placeholder: "select",
                                      style: { width: "100%" }
                                    },
                                    M.default.createElement(
                                      O,
                                      { value: "0" },
                                      "offline"
                                    ),
                                    M.default.createElement(
                                      O,
                                      { value: "1" },
                                      "online"
                                    )
                                  )
                                )
                              )
                            )
                          ),
                          M.default.createElement(
                            i.default,
                            { gutter: { md: 8, lg: 24, xl: 48 } },
                            M.default.createElement(
                              o.default,
                              { md: 6, sm: 24 },
                              t &&
                                M.default.createElement(
                                  B,
                                  {
                                    labelCol: { span: 5 },
                                    wrapperCol: { span: 15 },
                                    label: "Area"
                                  },
                                  e("areaId")(
                                    M.default.createElement(
                                      g.default,
                                      {
                                        placeholder: "select",
                                        style: { width: "100%" }
                                      },
                                      t.map(function(e) {
                                        return M.default.createElement(
                                          O,
                                          { key: e.id, value: e.id },
                                          e.name
                                        );
                                      })
                                    )
                                  )
                                )
                            )
                          ),
                          M.default.createElement(
                            "div",
                            { style: { overflow: "hidden" } },
                            M.default.createElement(
                              "div",
                              { style: { float: "right", marginBottom: 24 } },
                              M.default.createElement(
                                c.default,
                                { type: "primary", htmlType: "submit" },
                                "Search"
                              ),
                              M.default.createElement(
                                c.default,
                                {
                                  style: { marginLeft: 8 },
                                  onClick: this.handleFormReset
                                },
                                "Reset"
                              ),
                              M.default.createElement(
                                "a",
                                {
                                  style: { marginLeft: 8 },
                                  onClick: this.toggleForm
                                },
                                "close ",
                                M.default.createElement(u.default, {
                                  type: "up"
                                })
                              )
                            )
                          )
                        );
                      }
                    },
                    {
                      key: "renderForm",
                      value: function() {
                        var e = this.state.expandForm;
                        return e
                          ? this.renderAdvancedForm()
                          : this.renderSimpleForm();
                      }
                    },
                    {
                      key: "render",
                      value: function() {
                        var e = this,
                          t = this.props,
                          a = t.vehicles,
                          l = t.areas,
                          r = t.loading,
                          i = this.state,
                          u = i.modalVisible,
                          o = i.updateModalVisible,
                          s = i.detailModalVisible,
                          f = (i.deleteModalVisible, i.selectedRecord),
                          m = i.filterCriteria,
                          p = {
                            handleAdd: this.handleAdd,
                            handleModalVisible: this.handleModalVisible
                          },
                          h = {
                            handleModalVisible: this.handleUpdateModalVisible,
                            handleUpdate: this.handleUpdate
                          },
                          E = {
                            defaultCurrent: 1,
                            current: m.currentPage,
                            pageSize: m.pageSize,
                            total: a.total
                          };
                        return M.default.createElement(
                          A.default,
                          { title: "Vehicle List" },
                          M.default.createElement(
                            n.default,
                            { bordered: !1 },
                            M.default.createElement(
                              "div",
                              { className: T.default.tableList },
                              M.default.createElement(
                                "div",
                                { className: T.default.tableListForm },
                                this.renderForm()
                              ),
                              M.default.createElement(
                                "div",
                                { className: T.default.tableListOperator },
                                M.default.createElement(
                                  c.default,
                                  {
                                    icon: "plus",
                                    type: "primary",
                                    onClick: function() {
                                      return e.handleModalVisible(!0);
                                    }
                                  },
                                  "Add"
                                )
                              ),
                              M.default.createElement(L.default, {
                                loading: r,
                                data: { list: a.data, pagination: E },
                                columns: this.columns,
                                onChange: this.handleStandardTableChange,
                                scroll: { x: 1300 }
                              })
                            )
                          ),
                          M.default.createElement(
                            z,
                            (0, d.default)({}, p, {
                              modalVisible: u,
                              areas: l.data
                            })
                          ),
                          M.default.createElement(
                            Y,
                            (0, d.default)({}, h, {
                              modalVisible: o,
                              record: f,
                              areas: l.data
                            })
                          ),
                          f &&
                            s &&
                            M.default.createElement(
                              b.default,
                              {
                                destroyOnClose: !0,
                                title: "Detail",
                                visible: s,
                                onCancel: function() {
                                  return e.handleDetailModalVisible();
                                }
                              },
                              Object.keys(f).map(function(e) {
                                return M.default.createElement(
                                  "p",
                                  { key: e },
                                  "".concat(e, " : ").concat(f[e])
                                );
                              })
                            )
                        );
                      }
                    }
                  ]),
                  t
                );
              })(M.PureComponent))
            ) || w)
        ) || w),
        H = G;
      t.default = H;
    }
  }
]);
