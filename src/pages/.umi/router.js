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
    "routes": [
      {
        "path": "/",
        "redirect": "/dashboard/analysis",
        "exact": true
      },
      {
        "path": "/dashboard",
        "name": "dashboard",
        "icon": "dashboard",
        "authority": "get.dashboard",
        "routes": [
          {
            "path": "/dashboard/analysis",
            "name": "analysis",
            "component": dynamic({ loader: () => import('../Dashboard/Analysis'), loading: require('/Users/zhuangenze/Desktop/manhattan-admin-web/src/components/PageLoading/index').default }),
            "exact": true
          },
          {
            "path": "/dashboard/monitor",
            "name": "monitor",
            "component": dynamic({ loader: () => import('../Dashboard/Monitor'), loading: require('/Users/zhuangenze/Desktop/manhattan-admin-web/src/components/PageLoading/index').default }),
            "exact": true
          },
          {
            "path": "/dashboard/workplace",
            "name": "workplace",
            "component": dynamic({ loader: () => import('../Dashboard/Workplace'), loading: require('/Users/zhuangenze/Desktop/manhattan-admin-web/src/components/PageLoading/index').default }),
            "exact": true
          },
          {
            "component": () => React.createElement(require('/Users/zhuangenze/Desktop/manhattan-admin-web/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ]
      },
      {
        "path": "/vehicle-management",
        "icon": "car",
        "name": "Vehicle Management",
        "routes": [
          {
            "path": "/vehicle-management",
            "name": "Vehicle List",
            "component": dynamic({ loader: () => import('../Vehicle/Vehicle'), loading: require('/Users/zhuangenze/Desktop/manhattan-admin-web/src/components/PageLoading/index').default }),
            "exact": true
          },
          {
            "path": "/vehicle-management/ride",
            "name": "Riding History",
            "component": dynamic({ loader: () => import('../Vehicle/Ride'), loading: require('/Users/zhuangenze/Desktop/manhattan-admin-web/src/components/PageLoading/index').default }),
            "exact": true
          },
          {
            "path": "/vehicle-management/error",
            "name": "Error Report",
            "component": dynamic({ loader: () => import('../Vehicle/Error'), loading: require('/Users/zhuangenze/Desktop/manhattan-admin-web/src/components/PageLoading/index').default }),
            "exact": true
          },
          {
            "component": () => React.createElement(require('/Users/zhuangenze/Desktop/manhattan-admin-web/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ]
      },
      {
        "path": "/customer-management",
        "icon": "user",
        "name": "Customer Management",
        "authority": "get.customers",
        "routes": [
          {
            "path": "/customer-management",
            "name": "Customer List",
            "component": dynamic({ loader: () => import('../Customer/Customer'), loading: require('/Users/zhuangenze/Desktop/manhattan-admin-web/src/components/PageLoading/index').default }),
            "exact": true
          },
          {
            "component": () => React.createElement(require('/Users/zhuangenze/Desktop/manhattan-admin-web/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ]
      },
      {
        "path": "/area",
        "icon": "global",
        "name": "Area Management",
        "routes": [
          {
            "path": "/area/geo-management/",
            "name": "Geo Management",
            "component": dynamic({ loader: () => import('../Area/Geo'), loading: require('/Users/zhuangenze/Desktop/manhattan-admin-web/src/components/PageLoading/index').default }),
            "exact": true
          },
          {
            "path": "/area/area-management/",
            "name": "Area Management",
            "component": dynamic({ loader: () => import('../Area/Area'), loading: require('/Users/zhuangenze/Desktop/manhattan-admin-web/src/components/PageLoading/index').default }),
            "exact": true
          },
          {
            "component": () => React.createElement(require('/Users/zhuangenze/Desktop/manhattan-admin-web/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ]
      },
      {
        "path": "/membership-management/",
        "name": "Membership Management",
        "icon": "wallet",
        "component": dynamic({ loader: () => import('../Membership/Membership'), loading: require('/Users/zhuangenze/Desktop/manhattan-admin-web/src/components/PageLoading/index').default }),
        "exact": true
      },
      {
        "path": "/coupon-management/",
        "name": "Coupon Management",
        "icon": "barcode",
        "component": dynamic({ loader: () => import('../Coupon/Coupon'), loading: require('/Users/zhuangenze/Desktop/manhattan-admin-web/src/components/PageLoading/index').default }),
        "exact": true
      },
      {
        "path": "/price-management/",
        "name": "Price Management",
        "icon": "wallet",
        "authority": "get.price",
        "component": dynamic({ loader: () => import('../Price/Price'), loading: require('/Users/zhuangenze/Desktop/manhattan-admin-web/src/components/PageLoading/index').default }),
        "exact": true
      },
      {
        "path": "/employee-management/",
        "name": "Employee Management",
        "icon": "user",
        "routes": [
          {
            "path": "/employee-management/role",
            "name": "Role Management",
            "component": dynamic({ loader: () => import('../Employee/Role'), loading: require('/Users/zhuangenze/Desktop/manhattan-admin-web/src/components/PageLoading/index').default }),
            "exact": true
          },
          {
            "path": "/employee-management/privilege",
            "name": "Privilege Management",
            "component": dynamic({ loader: () => import('../Employee/Privilege'), loading: require('/Users/zhuangenze/Desktop/manhattan-admin-web/src/components/PageLoading/index').default }),
            "exact": true
          },
          {
            "path": "/employee-management/admin",
            "name": "Admin Management",
            "component": dynamic({ loader: () => import('../Employee/Admin'), loading: require('/Users/zhuangenze/Desktop/manhattan-admin-web/src/components/PageLoading/index').default }),
            "exact": true
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
