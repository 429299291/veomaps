import React from 'react';
import { Router as DefaultRouter, Route, Switch } from 'react-router-dom';
import dynamic from 'umi/dynamic';
import renderRoutes from 'umi/_renderRoutes';
import RendererWrapper0 from '/Users/zhuangenze/Desktop/manhattan-admin-web/src/pages/.umi/LocaleWrapper.jsx'

let Router = require('dva/router').routerRedux.ConnectedRouter;

let routes = [
  {
    "path": "/user",
    "component": dynamic({ loader: () => import('../../layouts/UserLayout'), loading: require('/Users/zhuangenze/Desktop/manhattan-admin-web/src/components/PageLoading/index').default }),
    "routes": [
      {
        "path": "/user",
        "redirect": "/user/login",
        "exact": true
      },
      {
        "path": "/user/login",
        "component": dynamic({ loader: () => import('../User/Login'), loading: require('/Users/zhuangenze/Desktop/manhattan-admin-web/src/components/PageLoading/index').default }),
        "exact": true
      },
      {
        "path": "/user/register",
        "component": dynamic({ loader: () => import('../User/Register'), loading: require('/Users/zhuangenze/Desktop/manhattan-admin-web/src/components/PageLoading/index').default }),
        "exact": true
      },
      {
        "path": "/user/register-result",
        "component": dynamic({ loader: () => import('../User/RegisterResult'), loading: require('/Users/zhuangenze/Desktop/manhattan-admin-web/src/components/PageLoading/index').default }),
        "exact": true
      },
      {
        "component": () => React.createElement(require('/Users/zhuangenze/Desktop/manhattan-admin-web/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
      }
    ]
  },
  {
    "path": "/",
    "component": dynamic({ loader: () => import('../../layouts/BasicLayout'), loading: require('/Users/zhuangenze/Desktop/manhattan-admin-web/src/components/PageLoading/index').default }),
    "Routes": [require('../Authorized').default],
    "authority": [
      "admin"
    ],
    "routes": [
      {
        "path": "/bike-management",
        "icon": "car",
        "name": "Bike Management",
        "routes": [
          {
            "path": "/bike-management/",
            "name": "Bike List",
            "component": dynamic({ loader: () => import('../Bike/BikeList'), loading: require('/Users/zhuangenze/Desktop/manhattan-admin-web/src/components/PageLoading/index').default }),
            "exact": true
          },
          {
            "component": () => React.createElement(require('/Users/zhuangenze/Desktop/manhattan-admin-web/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ]
      },
      {
        "path": "/profile",
        "name": "profile",
        "icon": "profile",
        "routes": [
          {
            "path": "/profile/basic",
            "name": "basic",
            "component": dynamic({ loader: () => import('../Profile/BasicProfile'), loading: require('/Users/zhuangenze/Desktop/manhattan-admin-web/src/components/PageLoading/index').default }),
            "exact": true
          },
          {
            "path": "/profile/advanced",
            "name": "advanced",
            "authority": [
              "admin"
            ],
            "component": dynamic({ loader: () => import('../Profile/AdvancedProfile'), loading: require('/Users/zhuangenze/Desktop/manhattan-admin-web/src/components/PageLoading/index').default }),
            "exact": true
          },
          {
            "component": () => React.createElement(require('/Users/zhuangenze/Desktop/manhattan-admin-web/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ]
      },
      {
        "name": "result",
        "icon": "check-circle-o",
        "path": "/result",
        "routes": [
          {
            "path": "/result/success",
            "name": "success",
            "component": dynamic({ loader: () => import('../Result/Success'), loading: require('/Users/zhuangenze/Desktop/manhattan-admin-web/src/components/PageLoading/index').default }),
            "exact": true
          },
          {
            "path": "/result/fail",
            "name": "fail",
            "component": dynamic({ loader: () => import('../Result/Error'), loading: require('/Users/zhuangenze/Desktop/manhattan-admin-web/src/components/PageLoading/index').default }),
            "exact": true
          },
          {
            "component": () => React.createElement(require('/Users/zhuangenze/Desktop/manhattan-admin-web/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ]
      },
      {
        "name": "exception",
        "icon": "warning",
        "path": "/exception",
        "routes": [
          {
            "path": "/exception/403",
            "name": "not-permission",
            "component": dynamic({ loader: () => import('../Exception/403'), loading: require('/Users/zhuangenze/Desktop/manhattan-admin-web/src/components/PageLoading/index').default }),
            "exact": true
          },
          {
            "path": "/exception/404",
            "name": "not-find",
            "component": dynamic({ loader: () => import('../Exception/404'), loading: require('/Users/zhuangenze/Desktop/manhattan-admin-web/src/components/PageLoading/index').default }),
            "exact": true
          },
          {
            "path": "/exception/500",
            "name": "server-error",
            "component": dynamic({ loader: () => import('../Exception/500'), loading: require('/Users/zhuangenze/Desktop/manhattan-admin-web/src/components/PageLoading/index').default }),
            "exact": true
          },
          {
            "path": "/exception/trigger",
            "name": "trigger",
            "hideInMenu": true,
            "component": dynamic({ loader: () => import('../Exception/TriggerException'), loading: require('/Users/zhuangenze/Desktop/manhattan-admin-web/src/components/PageLoading/index').default }),
            "exact": true
          },
          {
            "component": () => React.createElement(require('/Users/zhuangenze/Desktop/manhattan-admin-web/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ]
      },
      {
        "name": "account",
        "icon": "user",
        "path": "/account",
        "routes": [
          {
            "path": "/account/center",
            "name": "center",
            "component": dynamic({ loader: () => import('../Account/Center/Center'), loading: require('/Users/zhuangenze/Desktop/manhattan-admin-web/src/components/PageLoading/index').default }),
            "routes": [
              {
                "path": "/account/center",
                "redirect": "/account/center/articles",
                "exact": true
              },
              {
                "path": "/account/center/articles",
                "component": dynamic({ loader: () => import('../Account/Center/Articles'), loading: require('/Users/zhuangenze/Desktop/manhattan-admin-web/src/components/PageLoading/index').default }),
                "exact": true
              },
              {
                "path": "/account/center/applications",
                "component": dynamic({ loader: () => import('../Account/Center/Applications'), loading: require('/Users/zhuangenze/Desktop/manhattan-admin-web/src/components/PageLoading/index').default }),
                "exact": true
              },
              {
                "path": "/account/center/projects",
                "component": dynamic({ loader: () => import('../Account/Center/Projects'), loading: require('/Users/zhuangenze/Desktop/manhattan-admin-web/src/components/PageLoading/index').default }),
                "exact": true
              },
              {
                "component": () => React.createElement(require('/Users/zhuangenze/Desktop/manhattan-admin-web/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
              }
            ]
          },
          {
            "path": "/account/settings",
            "name": "settings",
            "component": dynamic({ loader: () => import('../Account/Settings/Info'), loading: require('/Users/zhuangenze/Desktop/manhattan-admin-web/src/components/PageLoading/index').default }),
            "routes": [
              {
                "path": "/account/settings",
                "redirect": "/account/settings/base",
                "exact": true
              },
              {
                "path": "/account/settings/base",
                "component": dynamic({ loader: () => import('../Account/Settings/BaseView'), loading: require('/Users/zhuangenze/Desktop/manhattan-admin-web/src/components/PageLoading/index').default }),
                "exact": true
              },
              {
                "path": "/account/settings/security",
                "component": dynamic({ loader: () => import('../Account/Settings/SecurityView'), loading: require('/Users/zhuangenze/Desktop/manhattan-admin-web/src/components/PageLoading/index').default }),
                "exact": true
              },
              {
                "path": "/account/settings/binding",
                "component": dynamic({ loader: () => import('../Account/Settings/BindingView'), loading: require('/Users/zhuangenze/Desktop/manhattan-admin-web/src/components/PageLoading/index').default }),
                "exact": true
              },
              {
                "path": "/account/settings/notification",
                "component": dynamic({ loader: () => import('../Account/Settings/NotificationView'), loading: require('/Users/zhuangenze/Desktop/manhattan-admin-web/src/components/PageLoading/index').default }),
                "exact": true
              },
              {
                "component": () => React.createElement(require('/Users/zhuangenze/Desktop/manhattan-admin-web/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
              }
            ]
          },
          {
            "component": () => React.createElement(require('/Users/zhuangenze/Desktop/manhattan-admin-web/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ]
      },
      {
        "component": dynamic({ loader: () => import('../404'), loading: require('/Users/zhuangenze/Desktop/manhattan-admin-web/src/components/PageLoading/index').default }),
        "exact": true
      },
      {
        "component": () => React.createElement(require('/Users/zhuangenze/Desktop/manhattan-admin-web/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
      }
    ]
  },
  {
    "component": () => React.createElement(require('/Users/zhuangenze/Desktop/manhattan-admin-web/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
  }
];
window.g_plugins.applyForEach('patchRoutes', { initialValue: routes });

export default function() {
  return (
<RendererWrapper0>
          <Router history={window.g_history}>
      { renderRoutes(routes, {}) }
    </Router>
        </RendererWrapper0>
  );
}
