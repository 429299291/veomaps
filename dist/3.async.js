(window["webpackJsonp"] = window["webpackJsonp"] || []).push([
  [3],
  {
    BOD2: function(e, t, a) {
      e.exports = {
        container: "antd-pro-layouts-user-layout-container",
        lang: "antd-pro-layouts-user-layout-lang",
        content: "antd-pro-layouts-user-layout-content",
        top: "antd-pro-layouts-user-layout-top",
        header: "antd-pro-layouts-user-layout-header",
        logo: "antd-pro-layouts-user-layout-logo",
        title: "antd-pro-layouts-user-layout-title",
        desc: "antd-pro-layouts-user-layout-desc"
      };
    },
    jH8a: function(e, t, a) {
      "use strict";
      var l = a("284h"),
        u = a("TqRt");
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.default = void 0);
      var o = u(a("lwsE")),
        r = u(a("W8MJ")),
        n = u(a("a1gu")),
        s = u(a("Nsbk")),
        d = u(a("7W2i"));
      a("Pwec");
      var i = u(a("CtXQ")),
        c = l(a("q1tI")),
        f = a("LLXN"),
        y = u(a("mOP9")),
        p = u(a("ggcP")),
        m = (u(a("bfXr")), u(a("BOD2"))),
        g = u(a("mxmt")),
        h = [
          {
            key: "help",
            title: (0, f.formatMessage)({ id: "layout.user.link.help" }),
            href: ""
          },
          {
            key: "privacy",
            title: (0, f.formatMessage)({ id: "layout.user.link.privacy" }),
            href: ""
          },
          {
            key: "terms",
            title: (0, f.formatMessage)({ id: "layout.user.link.terms" }),
            href: ""
          }
        ],
        v = c.default.createElement(
          c.Fragment,
          null,
          "Copyright ",
          c.default.createElement(i.default, { type: "copyright" }),
          " brought to you by VeoRide 2018"
        ),
        E = (function(e) {
          function t() {
            return (
              (0, o.default)(this, t),
              (0, n.default)(this, (0, s.default)(t).apply(this, arguments))
            );
          }
          return (
            (0, d.default)(t, e),
            (0, r.default)(t, [
              {
                key: "render",
                value: function() {
                  var e = this.props.children;
                  return c.default.createElement(
                    "div",
                    { className: m.default.container },
                    c.default.createElement(
                      "div",
                      { className: m.default.content },
                      c.default.createElement(
                        "div",
                        { className: m.default.top },
                        c.default.createElement(
                          "div",
                          { className: m.default.header },
                          c.default.createElement(
                            y.default,
                            { to: "/" },
                            c.default.createElement("img", {
                              alt: "logo",
                              className: m.default.logo,
                              src: g.default
                            }),
                            c.default.createElement(
                              "span",
                              { className: m.default.title },
                              "VeoRide"
                            )
                          )
                        ),
                        c.default.createElement(
                          "div",
                          { className: m.default.desc },
                          "Management System"
                        )
                      ),
                      e
                    ),
                    c.default.createElement(p.default, {
                      links: h,
                      copyright: v
                    })
                  );
                }
              }
            ]),
            t
          );
        })(c.default.PureComponent),
        k = E;
      t.default = k;
    }
  }
]);
