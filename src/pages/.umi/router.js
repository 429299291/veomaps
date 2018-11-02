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
      "admin",
      "user"
    ],
    "routes": [
      {
        "path": "/list",
        "icon": "table",
        "name": "list",
        "routes": [
          {
            "path": "/list/table-list",
            "name": "searchtable",
            "component": dynamic({ loader: () => import('../List/TableList'), loading: require('/Users/zhuangenze/Desktop/manhattan-admin-web/src/components/PageLoading/index').default }),
            "exact": true
          },
          {
            "path": "/list/basic-list",
            "name": "basiclist",
            "component": dynamic({ loader: () => import('../List/BasicList'), loading: require('/Users/zhuangenze/Desktop/manhattan-admin-web/src/components/PageLoading/index').default }),
            "exact": true
          },
          {
            "path": "/list/card-list",
            "name": "cardlist",
            "component": dynamic({ loader: () => import('../List/CardList'), loading: require('/Users/zhuangenze/Desktop/manhattan-admin-web/src/components/PageLoading/index').default }),
            "exact": true
          },
          {
            "path": "/list/search",
            "name": "searchlist",
            "component": dynamic({ loader: () => import('../List/List'), loading: require('/Users/zhuangenze/Desktop/manhattan-admin-web/src/components/PageLoading/index').default }),
            "routes": [
              {
                "path": "/list/search",
                "redirect": "/list/search/articles",
                "exact": true
              },
              {
                "path": "/list/search/articles",
                "name": "articles",
                "component": dynamic({ loader: () => import('../List/Articles'), loading: require('/Users/zhuangenze/Desktop/manhattan-admin-web/src/components/PageLoading/index').default }),
                "exact": true
              },
              {
                "path": "/list/search/projects",
                "name": "projects",
                "component": dynamic({ loader: () => import('../List/Projects'), loading: require('/Users/zhuangenze/Desktop/manhattan-admin-web/src/components/PageLoading/index').default }),
                "exact": true
              },
              {
                "path": "/list/search/applications",
                "name": "applications",
                "component": dynamic({ loader: () => import('../List/Applications'), loading: require('/Users/zhuangenze/Desktop/manhattan-admin-web/src/components/PageLoading/index').default }),
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
