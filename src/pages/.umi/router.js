import React from 'react';
import { Router as DefaultRouter, Route, Switch } from 'react-router-dom';
import dynamic from 'umi/dynamic';
import renderRoutes from 'umi/_renderRoutes';
import RendererWrapper0 from 'C:/Users/42929/Desktop/veo-admin-website/src/pages/.umi/LocaleWrapper.jsx'

let Router = require('dva/router').routerRedux.ConnectedRouter;

let routes = [
  {
    "path": "/user",
    "component": dynamic({ loader: () => import('../../layouts/UserLayout'), loading: require('C:/Users/42929/Desktop/veo-admin-website/src/components/PageLoading/index').default }),
    "routes": [
      {
        "path": "/user",
        "redirect": "/user/login",
        "exact": true
      },
      {
        "path": "/user/login",
        "component": dynamic({ loader: () => import('../User/Login'), loading: require('C:/Users/42929/Desktop/veo-admin-website/src/components/PageLoading/index').default }),
        "exact": true
      },
      {
        "path": "/user/register",
        "component": dynamic({ loader: () => import('../User/Register'), loading: require('C:/Users/42929/Desktop/veo-admin-website/src/components/PageLoading/index').default }),
        "exact": true
      },
      {
        "path": "/user/register-result",
        "component": dynamic({ loader: () => import('../User/RegisterResult'), loading: require('C:/Users/42929/Desktop/veo-admin-website/src/components/PageLoading/index').default }),
        "exact": true
      },
      {
        "component": () => React.createElement(require('C:/Users/42929/Desktop/veo-admin-website/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
      }
    ]
  },
  {
    "path": "/",
    "component": dynamic({ loader: () => import('../../layouts/BasicLayout'), loading: require('C:/Users/42929/Desktop/veo-admin-website/src/components/PageLoading/index').default }),
    "Routes": [require('../Authorized').default],
    "authority": [
      "area",
      "admin"
    ],
    "routes": [
      {
        "path": "/dashboard",
        "name": "dashboard",
        "icon": "dashboard",
        "authority": "dashboard",
        "routes": [
          {
            "path": "/dashboard/main",
            "name": "dashboard",
            "component": dynamic({ loader: () => import('../Dashboard/Dashboard'), loading: require('C:/Users/42929/Desktop/veo-admin-website/src/components/PageLoading/index').default }),
            "exact": true
          },
          {
            "component": () => React.createElement(require('C:/Users/42929/Desktop/veo-admin-website/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ]
      },
      {
        "path": "/shop-management",
        "icon": "shop",
        "name": "Shop Management",
        "authority": [
          "shop"
        ],
        "routes": [
          {
            "path": "/shop-management/order",
            "name": "Order",
            "component": dynamic({ loader: () => import('../Shop/Order'), loading: require('C:/Users/42929/Desktop/veo-admin-website/src/components/PageLoading/index').default }),
            "exact": true
          },
          {
            "path": "/shop-management/listing",
            "name": "Listing",
            "component": dynamic({ loader: () => import('../Shop/Listing'), loading: require('C:/Users/42929/Desktop/veo-admin-website/src/components/PageLoading/index').default }),
            "exact": true
          },
          {
            "component": () => React.createElement(require('C:/Users/42929/Desktop/veo-admin-website/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ]
      },
      {
        "path": "/ride/",
        "name": "Riding Management",
        "component": dynamic({ loader: () => import('../Ride/Ride'), loading: require('C:/Users/42929/Desktop/veo-admin-website/src/components/PageLoading/index').default }),
        "icon": "car",
        "authority": [
          "ride"
        ],
        "exact": true
      },
      {
        "path": "/vehicle-management",
        "icon": "car",
        "name": "Vehicle Management",
        "authority": [
          "vehicle"
        ],
        "routes": [
          {
            "path": "/vehicle-management/vehicle",
            "name": "Vehicle List",
            "component": dynamic({ loader: () => import('../Vehicle/Vehicle'), loading: require('C:/Users/42929/Desktop/veo-admin-website/src/components/PageLoading/index').default }),
            "exact": true
          },
          {
            "path": "/vehicle-management/error",
            "name": "Report",
            "component": dynamic({ loader: () => import('../Vehicle/Error'), loading: require('C:/Users/42929/Desktop/veo-admin-website/src/components/PageLoading/index').default }),
            "exact": true
          },
          {
            "component": () => React.createElement(require('C:/Users/42929/Desktop/veo-admin-website/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ]
      },
      {
        "path": "/customer-management",
        "icon": "user",
        "name": "Customer Management",
        "authority": [
          "customer"
        ],
        "routes": [
          {
            "path": "/customer-management/customer",
            "name": "Customer List",
            "component": dynamic({ loader: () => import('../Customer/Customer'), loading: require('C:/Users/42929/Desktop/veo-admin-website/src/components/PageLoading/index').default }),
            "exact": true
          },
          {
            "path": "/customer-management/notifications",
            "name": "Notifications",
            "component": dynamic({ loader: () => import('../CustomerNotification/Notifications'), loading: require('C:/Users/42929/Desktop/veo-admin-website/src/components/PageLoading/index').default }),
            "exact": true
          },
          {
            "path": "/customer-management/violations",
            "name": "Violation",
            "authority": [
              "customer.violation"
            ],
            "component": dynamic({ loader: () => import('../Customer/VehicleViolation'), loading: require('C:/Users/42929/Desktop/veo-admin-website/src/components/PageLoading/index').default }),
            "exact": true
          },
          {
            "component": () => React.createElement(require('C:/Users/42929/Desktop/veo-admin-website/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ]
      },
      {
        "path": "/area",
        "icon": "global",
        "name": "Area Management",
        "authority": [
          "area"
        ],
        "routes": [
          {
            "path": "/area/area-management/",
            "name": "Area Management",
            "component": dynamic({ loader: () => import('../Area/Areas'), loading: require('C:/Users/42929/Desktop/veo-admin-website/src/components/PageLoading/index').default }),
            "exact": true
          },
          {
            "path": "/area/promo-management/",
            "name": "Promo Management",
            "component": dynamic({ loader: () => import('../Area/Promo/Promo'), loading: require('C:/Users/42929/Desktop/veo-admin-website/src/components/PageLoading/index').default }),
            "authority": "area.promo",
            "exact": true
          },
          {
            "path": "/area/deposit-management/",
            "name": "Deposit Management",
            "component": dynamic({ loader: () => import('../Area/Deposit/Deposit'), loading: require('C:/Users/42929/Desktop/veo-admin-website/src/components/PageLoading/index').default }),
            "authority": "area.deposit",
            "exact": true
          },
          {
            "path": "/area/membership-management",
            "name": "Membership Management",
            "authority": "area.membership",
            "component": dynamic({ loader: () => import('../Area/Membership/Membership'), loading: require('C:/Users/42929/Desktop/veo-admin-website/src/components/PageLoading/index').default }),
            "exact": true
          },
          {
            "path": "/area/price-management/",
            "name": "Price Management",
            "authority": "area.price",
            "component": dynamic({ loader: () => import('../Area/Price/Price'), loading: require('C:/Users/42929/Desktop/veo-admin-website/src/components/PageLoading/index').default }),
            "exact": true
          },
          {
            "component": () => React.createElement(require('C:/Users/42929/Desktop/veo-admin-website/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ]
      },
      {
        "path": "/employee-management/",
        "name": "Admin Management",
        "icon": "user",
        "authority": [
          "admin"
        ],
        "routes": [
          {
            "path": "/employee-management/role",
            "name": "Role Management",
            "component": dynamic({ loader: () => import('../Employee/Role'), loading: require('C:/Users/42929/Desktop/veo-admin-website/src/components/PageLoading/index').default }),
            "exact": true
          },
          {
            "path": "/employee-management/privilege",
            "name": "Privilege Management",
            "component": dynamic({ loader: () => import('../Employee/Privilege'), loading: require('C:/Users/42929/Desktop/veo-admin-website/src/components/PageLoading/index').default }),
            "exact": true
          },
          {
            "path": "/employee-management/admin",
            "name": "Admin Management",
            "component": dynamic({ loader: () => import('../Employee/Admin'), loading: require('C:/Users/42929/Desktop/veo-admin-website/src/components/PageLoading/index').default }),
            "exact": true
          },
          {
            "component": () => React.createElement(require('C:/Users/42929/Desktop/veo-admin-website/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ]
      },
      {
        "path": "/technician-management/",
        "name": "technician Management",
        "icon": "user",
        "authority": [
          "technician"
        ],
        "routes": [
          {
            "path": "/technician-management/main",
            "name": "Technician Management",
            "component": dynamic({ loader: () => import('../Technician/Technician'), loading: require('C:/Users/42929/Desktop/veo-admin-website/src/components/PageLoading/index').default }),
            "exact": true
          },
          {
            "path": "/technician-management/violation-management",
            "name": "Violation Management",
            "component": dynamic({ loader: () => import('../Technician/Violation'), loading: require('C:/Users/42929/Desktop/veo-admin-website/src/components/PageLoading/index').default }),
            "authority": [
              "technician.violation"
            ],
            "exact": true
          },
          {
            "path": "/technician-management/techmetrics",
            "name": "Tech Metrics",
            "component": dynamic({ loader: () => import('../Technician/TechMetrics'), loading: require('C:/Users/42929/Desktop/veo-admin-website/src/components/PageLoading/index').default }),
            "authority": [
              "technician.metric"
            ],
            "exact": true
          },
          {
            "component": () => React.createElement(require('C:/Users/42929/Desktop/veo-admin-website/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ]
      },
      {
        "name": "account",
        "icon": "user",
        "path": "/account",
        "authority": [
          "me"
        ],
        "routes": [
          {
            "path": "/account/settings",
            "name": "settings",
            "component": dynamic({ loader: () => import('../Account/Settings/Info'), loading: require('C:/Users/42929/Desktop/veo-admin-website/src/components/PageLoading/index').default }),
            "routes": [
              {
                "path": "/account/settings",
                "redirect": "/account/settings/base",
                "exact": true
              },
              {
                "path": "/account/settings/base",
                "component": dynamic({ loader: () => import('../Account/Settings/BaseView'), loading: require('C:/Users/42929/Desktop/veo-admin-website/src/components/PageLoading/index').default }),
                "exact": true
              },
              {
                "path": "/account/settings/security",
                "component": dynamic({ loader: () => import('../Account/Settings/SecurityView'), loading: require('C:/Users/42929/Desktop/veo-admin-website/src/components/PageLoading/index').default }),
                "exact": true
              },
              {
                "path": "/account/settings/binding",
                "component": dynamic({ loader: () => import('../Account/Settings/BindingView'), loading: require('C:/Users/42929/Desktop/veo-admin-website/src/components/PageLoading/index').default }),
                "exact": true
              },
              {
                "path": "/account/settings/notification",
                "component": dynamic({ loader: () => import('../Account/Settings/NotificationView'), loading: require('C:/Users/42929/Desktop/veo-admin-website/src/components/PageLoading/index').default }),
                "exact": true
              },
              {
                "component": () => React.createElement(require('C:/Users/42929/Desktop/veo-admin-website/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
              }
            ]
          },
          {
            "component": () => React.createElement(require('C:/Users/42929/Desktop/veo-admin-website/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ]
      },
      {
        "component": dynamic({ loader: () => import('../404'), loading: require('C:/Users/42929/Desktop/veo-admin-website/src/components/PageLoading/index').default }),
        "exact": true
      },
      {
        "component": () => React.createElement(require('C:/Users/42929/Desktop/veo-admin-website/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
      }
    ]
  },
  {
    "component": () => React.createElement(require('C:/Users/42929/Desktop/veo-admin-website/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
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
