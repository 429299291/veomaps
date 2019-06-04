export default [
  // user
  {
    path: "/user",
    component: "../layouts/UserLayout",
    routes: [
      { path: "/user", redirect: "/user/login" },
      { path: "/user/login", component: "./User/Login" },
      { path: "/user/register", component: "./User/Register" },
      { path: "/user/register-result", component: "./User/RegisterResult" }
    ]
  },
  // app
  {
    path: "/",
    component: "../layouts/BasicLayout",
    Routes: ["src/pages/Authorized"],
    authority: "basic.admin",
    routes: [
      // dashboard

      { path: "/", redirect: "/vehicle-management/vehicle" },
      {
        path: "/dashboard",
        name: "dashboard",
        icon: "dashboard",
        //authority: "get.dashboard",
        routes: [
          {
            path: "/dashboard",
            name: "dashboard",
            component: "./Dashboard/Dashboard"
          }
          // {
          //   path: "/dashboard/analysis",
          //   name: "analysis",
          //   component: "./Dashboard/Analysis"
          // },
          // {
          //   path: "/dashboard/monitor",
          //   name: "monitor",
          //   component: "./Dashboard/Monitor"
          // },
          // {
          //   path: "/dashboard/workplace",
          //   name: "workplace",
          //   component: "./Dashboard/Workplace"
          // }
        ]
      },
      {
        path: "/vehicle-management",
        icon: "car",
        name: "Vehicle Management",
        routes: [
          {
            path: "/vehicle-management/vehicle",
            name: "Vehicle List",
            component: "./Vehicle/Vehicle",
            authority: "get.vehicles"
          },
          {
            path: "/vehicle-management/ride",
            name: "Riding History",
            component: "./Vehicle/Ride",
            authority: "get.rides"
          },
          {
            path: "/vehicle-management/error",
            name: "Report",
            component: "./Vehicle/Error",
            authority: "get.errors"
          }
        ]
      },
      {
        path: "/customer-management",
        icon: "user",
        name: "Customer Management",
        authority: "get.customers",
        routes: [
          {
            path: "/customer-management/customer",
            name: "Customer List",
            component: "./Customer/Customer"
          },
          {
            path: "/customer-management/notifications",
            name: "Notifications",
            component: "./CustomerNotification/Notifications",
            authority: "get.customers.notifications"
          }
        ]
      },
      {
        path: "/area",
        icon: "global",
        name: "Area Management",
        routes: [
          {
            path: "/area/geo-management/",
            name: "Geo Management",
            component: "./Area/Geo",
            authority: "get.fences"
          },
          {
            path: "/area/area-management/",
            name: "Area Management",
            component: "./Area/Area",
            authority: "get.areas"
          }
        ]
      },
      {
        path: "/membership-management",
        name: "Membership Management",
        icon: "wallet",
        component: "./Membership/Membership",
        authority: "get.memberships"
      },
      {
        path: "/promo-management/",
        name: "Promo Management",
        icon: "barcode",
        component: "./Promo/Promo",
        authority: "get.promos"
      },
      {
        path: "/deposit-management/",
        name: "Deposit Management",
        icon: "dollar",
        component: "./Deposit/Deposit",
        authority: "get.deposits"
      },
      {
        path: "/price-management/",
        name: "Price Management",
        icon: "wallet",
        authority: "get.prices",
        component: "./Price/Price"
      },
      {
        path: "/employee-management/",
        name: "Employee Management",
        icon: "user",
        authority: "get.admins",
        routes: [
          {
            path: "/employee-management/role",
            name: "Role Management",
            component: "./Employee/Role",
            authority: "get.roles.details"
          },
          {
            path: "/employee-management/privilege",
            name: "Privilege Management",
            component: "./Employee/Privilege",
            authority: "get.privileges"
          },
          {
            path: "/employee-management/admin",
            name: "Admin Management",
            component: "./Employee/Admin",
            authority: "get.admins"
          }
        ]
      },
      {
        name: "account",
        icon: "user",
        path: "/account",
        routes: [
          {
            path: "/account/settings",
            name: "settings",
            component: "./Account/Settings/Info",
            routes: [
              {
                path: "/account/settings",
                redirect: "/account/settings/base"
              },
              {
                path: "/account/settings/base",
                component: "./Account/Settings/BaseView"
              },
              {
                path: "/account/settings/security",
                component: "./Account/Settings/SecurityView"
              },
              {
                path: "/account/settings/binding",
                component: "./Account/Settings/BindingView"
              },
              {
                path: "/account/settings/notification",
                component: "./Account/Settings/NotificationView"
              }
            ]
          }
        ]
      },
      {
        path: "/technician-management/",
        name: "Technician Management",
        icon: "user",
        component: "./Technician/Technician"
      },
      {
        component: "404"
      }
    ]
  }
];
