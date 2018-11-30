(window["webpackJsonp"] = window["webpackJsonp"] || []).push([
  [10],
  {
    "2FDm": function(e, t, a) {
      "use strict";
      var l = a("TqRt"),
        r = a("284h");
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.default = void 0);
      var d = l(a("pVnL"));
      a("IzEo");
      var n = l(a("bx4M"));
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
        b = l(a("7W2i"));
      a("2qtc");
      var E = l(a("kLXV"));
      a("7Kak");
      var v = l(a("9yH6"));
      a("OaEy");
      var g = l(a("2fM7"));
      a("5NDa");
      var C = l(a("5rEg"));
      a("FJo9");
      var M = l(a("L41K"));
      a("y8nQ");
      var y = l(a("Vl3Y"));
      a("iQDF");
      var V,
        F,
        S,
        k = l(a("+eQT")),
        O = r(a("q1tI")),
        D = a("MuoO"),
        R = (l(a("wd/R")), l(a("CkN6"))),
        L = l(a("zHco")),
        w = l(a("sOv7")),
        N = (a("0bUC"), k.default.RangePicker),
        P = y.default.Item,
        I = (M.default.Step, C.default.TextArea, g.default.Option),
        z = (v.default.Group, /^-?\d*\.?\d{1,2}$/),
        A = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        U = ["NORMAL", "FROZEN", "ERROR"],
        Y = ["FROZEN"],
        x = y.default.create()(function(e) {
          var t = e.form,
            a = e.modalVisible,
            l = e.handleUpdate,
            r = e.handleModalVisible,
            d = e.areas,
            n = e.record,
            i = function() {
              t.isFieldsTouched()
                ? t.validateFields(function(e, a) {
                    e || (t.resetFields(), l(n.id, a));
                  })
                : r();
            },
            u = function(e, t, a) {
              z.test(t) ? a() : a("Credit Must be Number!");
            },
            s = function(e, t, a) {
              A.test(t) ? a() : a("Please input correct email format");
            };
          return O.default.createElement(
            E.default,
            {
              destroyOnClose: !0,
              title: "Update Customer",
              visible: a,
              onOk: i,
              onCancel: function() {
                return r();
              }
            },
            O.default.createElement(
              P,
              {
                labelCol: { span: 5 },
                wrapperCol: { span: 15 },
                label: "CREDIT AMOUNT"
              },
              t.getFieldDecorator("credit", {
                rules: [{ validator: u }],
                initialValue: n.credit
              })(
                O.default.createElement(C.default, {
                  placeholder: "Please Input"
                })
              )
            ),
            O.default.createElement(
              P,
              {
                labelCol: { span: 5 },
                wrapperCol: { span: 15 },
                label: "FULL NAME"
              },
              t.getFieldDecorator("fullName", { initialValue: n.fullName })(
                O.default.createElement(C.default, {
                  placeholder: "Please Input"
                })
              )
            ),
            O.default.createElement(
              P,
              {
                labelCol: { span: 5 },
                wrapperCol: { span: 15 },
                label: "EMAIL"
              },
              t.getFieldDecorator("email", {
                rules: [{ validator: s }],
                initialValue: n.email
              })(
                O.default.createElement(C.default, {
                  placeholder: "Please Input"
                })
              )
            ),
            U &&
              O.default.createElement(
                P,
                {
                  labelCol: { span: 5 },
                  wrapperCol: { span: 15 },
                  label: "Status"
                },
                t.getFieldDecorator("status", {
                  rules: [{ required: !0, message: "You have pick a status" }],
                  initialValue: n.status
                })(
                  O.default.createElement(
                    g.default,
                    { placeholder: "select", style: { width: "100%" } },
                    U.map(function(e, t) {
                      return O.default.createElement(
                        I,
                        { key: t, value: t },
                        U[t]
                      );
                    })
                  )
                )
              ),
            d &&
              O.default.createElement(
                P,
                {
                  labelCol: { span: 5 },
                  wrapperCol: { span: 15 },
                  label: "Area"
                },
                t.getFieldDecorator("areaId", {
                  rules: [{ required: !0, message: "You have pick a area" }],
                  initialValue: n.areaId
                })(
                  O.default.createElement(
                    g.default,
                    { placeholder: "select", style: { width: "100%" } },
                    d.map(function(e) {
                      return O.default.createElement(
                        I,
                        { key: e.id, value: e.id },
                        e.name
                      );
                    })
                  )
                )
              )
          );
        }),
        T = ((V = (0, D.connect)(function(e) {
          var t = e.customers,
            a = e.areas,
            l = e.loading;
          return { customers: t, areas: a, loading: l.models.customers };
        })),
        (F = y.default.create()),
        V(
          (S =
            F(
              (S = (function(e) {
                function t() {
                  var e, a;
                  (0, f.default)(this, t);
                  for (
                    var l = arguments.length, r = new Array(l), d = 0;
                    d < l;
                    d++
                  )
                    r[d] = arguments[d];
                  return (
                    (a = (0, p.default)(
                      this,
                      (e = (0, h.default)(t)).call.apply(e, [this].concat(r))
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
                      { title: "phone", dataIndex: "phone" },
                      { title: "Full Name", dataIndex: "fullName", sorter: !0 },
                      { title: "email", dataIndex: "email" },
                      { title: "Balance", dataIndex: "credit" },
                      {
                        title: "operation",
                        render: function(e, t) {
                          return O.default.createElement(
                            O.Fragment,
                            null,
                            O.default.createElement(
                              "a",
                              {
                                onClick: function() {
                                  return a.handleUpdateModalVisible(!0, t);
                                }
                              },
                              "Update"
                            ),
                            O.default.createElement(c.default, {
                              type: "vertical"
                            }),
                            O.default.createElement(
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
                    (a.handleGetCustomers = function() {
                      var e = a.props.dispatch,
                        t = a.state.filterCriteria;
                      e({ type: "customers/get", payload: t });
                    }),
                    (a.handleStandardTableChange = function(e, t, l) {
                      var r = a.props.dispatch,
                        d = a.state.filterCriteria,
                        n = (0, o.default)({}, d);
                      (n.currentPage = e.current),
                        (n.pageSize = e.pageSize),
                        l.field &&
                          (n.sorter = "".concat(l.field, "_").concat(l.order)),
                        a.setState({ filterCriteria: n }),
                        r({ type: "customers/get", payload: n });
                    }),
                    (a.handleFormReset = function() {
                      var e = a.props,
                        t = e.form,
                        l = (e.dispatch, a.state.filterCriteria);
                      t.resetFields();
                      var r = { currentPage: 1, pageSize: l.pageSize };
                      a.setState({ filterCriteria: r }, function() {
                        return a.handleGetCustomers();
                      });
                    }),
                    (a.handleSearch = function(e) {
                      e.preventDefault();
                      var t = a.props.form,
                        l = a.state.filterCriteria;
                      t.validateFields(function(e, t) {
                        if (!e) {
                          t.created &&
                            ((t.registerStart = t.created[0].format(
                              "MM-DD-YYYY"
                            )),
                            (t.registerEnd = t.created[1].format("MM-DD-YYYY")),
                            (t.created = void 0));
                          var r = Object.assign({}, l, t, {
                            currentPage: 1,
                            pageSize: 10
                          });
                          a.setState({ filterCriteria: r }, function() {
                            return a.handleGetCustomers();
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
                    (a.handleUpdate = function(e, t) {
                      var l = a.props.dispatch;
                      l({
                        type: "customers/update",
                        payload: t,
                        id: e,
                        onSuccess: a.handleGetCustomers
                      }),
                        a.handleUpdateModalVisible();
                    }),
                    a
                  );
                }
                return (
                  (0, b.default)(t, e),
                  (0, m.default)(t, [
                    {
                      key: "componentDidMount",
                      value: function() {
                        this.handleGetCustomers();
                      }
                    },
                    {
                      key: "renderSimpleForm",
                      value: function() {
                        var e = this.props.form.getFieldDecorator;
                        return O.default.createElement(
                          y.default,
                          { onSubmit: this.handleSearch, layout: "inline" },
                          O.default.createElement(
                            u.default,
                            { gutter: { md: 8, lg: 24, xl: 48 } },
                            O.default.createElement(
                              s.default,
                              { md: 8, sm: 24 },
                              O.default.createElement(
                                P,
                                { label: "Keywords" },
                                e("nameOrPhoneOrEmail")(
                                  O.default.createElement(C.default, {
                                    placeholder: "PHONE NAME EMAIL"
                                  })
                                )
                              )
                            ),
                            O.default.createElement(
                              s.default,
                              { md: 8, sm: 24 },
                              O.default.createElement(
                                P,
                                { label: "Status" },
                                e("queryStatus")(
                                  O.default.createElement(
                                    g.default,
                                    {
                                      placeholder: "select",
                                      style: { width: "100%" }
                                    },
                                    Y.map(function(e, t) {
                                      return O.default.createElement(
                                        I,
                                        { key: t, value: t },
                                        Y[t]
                                      );
                                    })
                                  )
                                )
                              )
                            ),
                            O.default.createElement(
                              s.default,
                              { md: 8, sm: 24 },
                              O.default.createElement(
                                P,
                                { label: "Registered" },
                                e("created")(O.default.createElement(N, null))
                              )
                            )
                          ),
                          O.default.createElement(
                            u.default,
                            { gutter: { md: 8, lg: 24, xl: 48 } },
                            O.default.createElement(
                              s.default,
                              { md: { span: 8, offset: 16 }, sm: 24 },
                              O.default.createElement(
                                "span",
                                {
                                  className: w.default.submitButtons,
                                  style: { float: "right" }
                                },
                                O.default.createElement(
                                  i.default,
                                  { type: "primary", htmlType: "submit" },
                                  "Search"
                                ),
                                O.default.createElement(
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
                          a = t.customers,
                          l = t.areas,
                          r = t.loading,
                          u = this.state,
                          s = (u.modalVisible, u.updateModalVisible),
                          o = u.detailModalVisible,
                          c = u.selectedRecord,
                          f = u.filterCriteria,
                          m = (this.handleAdd,
                          this.handleModalVisible,
                          {
                            handleModalVisible: this.handleUpdateModalVisible,
                            handleUpdate: this.handleUpdate
                          }),
                          p = {
                            defaultCurrent: 1,
                            current: f.currentPage,
                            pageSize: f.pageSize,
                            total: a.total
                          };
                        return O.default.createElement(
                          L.default,
                          { title: "Customer List" },
                          O.default.createElement(
                            n.default,
                            { bordered: !1 },
                            O.default.createElement(
                              "div",
                              { className: w.default.tableList },
                              O.default.createElement(
                                "div",
                                { className: w.default.tableListForm },
                                this.renderSimpleForm()
                              ),
                              O.default.createElement(
                                "div",
                                { className: w.default.tableListOperator },
                                O.default.createElement(
                                  i.default,
                                  {
                                    icon: "plus",
                                    type: "primary",
                                    onClick: function() {
                                      return e.handleModalVisible(!0);
                                    }
                                  },
                                  "Haha"
                                )
                              ),
                              O.default.createElement(R.default, {
                                loading: r,
                                data: { list: a.data, pagination: p },
                                columns: this.columns,
                                onChange: this.handleStandardTableChange
                              })
                            )
                          ),
                          O.default.createElement(
                            x,
                            (0, d.default)({}, m, {
                              modalVisible: s,
                              record: c,
                              areas: l.data
                            })
                          ),
                          c &&
                            o &&
                            O.default.createElement(
                              E.default,
                              {
                                destroyOnClose: !0,
                                title: "Detail",
                                visible: o,
                                onCancel: function() {
                                  return e.handleDetailModalVisible();
                                },
                                onOk: function() {
                                  return e.handleDetailModalVisible();
                                }
                              },
                              Object.keys(c).map(function(e) {
                                return O.default.createElement(
                                  "p",
                                  { key: e },
                                  "".concat(e, " : ").concat(c[e])
                                );
                              })
                            )
                        );
                      }
                    }
                  ]),
                  t
                );
              })(O.PureComponent))
            ) || S)
        ) || S),
        q = T;
      t.default = q;
    },
    sOv7: function(e, t, a) {
      e.exports = {
        tableList: "antd-pro-pages-customer-customer-tableList",
        tableListOperator: "antd-pro-pages-customer-customer-tableListOperator",
        tableListForm: "antd-pro-pages-customer-customer-tableListForm",
        submitButtons: "antd-pro-pages-customer-customer-submitButtons"
      };
    }
  }
]);
