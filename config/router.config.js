// import Icon from '@ant-design/icons';
import { SmileOutlined } from '@ant-design/icons';

export default [
  // user
  {
    path: "/user",
    component: "../layouts/UserLayout",
    icon:'user',
    routes: [
      { path: "/user", redirect: "/user/login" },
      { path: "/user/login", component: "./User/Login" },
      { path: "/user/register", component: "./User/Register" },
      { path: "/user/register-result", component: "./User/RegisterResult" }
    ]
  },
  // { path: "/", redirect: "/vehicle-management/ride"},

  // app
  {
    path: "/",
    component: "../layouts/BasicLayout",
    Routes: ["src/pages/Authorized"],
    // authority: ["area", "admin","me"],
    authority: ["admin","me"],
    routes: [
      {
        path: "/dashboard",
        name: "dashboard",
        authority: "dashboard",
        icon:'dashboard',
        routes: [
          {
            path: "/dashboard/main",
            name: "dashboard",
            component: "./Dashboard/Dashboard"
          },
        ]
      },
      // {
      //   path: "/shop-management",
      //   icon: "shop",
      //   name: "Shop Management",
      //   authority: ["shop"],
      //   routes: [
      //     {
      //       path: "/shop-management/order",
      //       name: "Order",
      //       component: "./Shop/Order",
      //     },
      //     {
      //       path: "/shop-management/listing",
      //       name: "Listing",
      //       component: "./Shop/Listing",
      //     }
      //   ]
      // },
      {
        path: "/ride/",
        name: "Riding Management",
        component: "./Ride/Ride",
        icon: "ride",
        authority: ["ride"],
      },
      {
        path: "/vehicle-management",
        icon: "car",
        name: "Vehicle Management",
        authority:[ "vehicle"],
        routes: [
          {
            path: "/vehicle-management/vehicle",
            name: "Vehicle List",
            component: "./Vehicle/Vehicle",
          },
        ]
      },
      {
        path: "/customer-management",
        icon: "customer",
        name: "Customer Management",
        authority: ["customer"],
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
          },
          {
            path: "/customer-management/violations",
            name: "Violation",
            authority: ["customer.violation"],
            component: "./Customer/VehicleViolation",
          },
          {
            path: "/customer-management/campaign",
            name: "Campaign",
            component: "./Customer/Campaign/campaign",
          },
          {
            path: "/customer-management/notification",
            name: "Notification",
            component: "./Customer/Notification/Notification",
          },
        ]
      },
      {
        path: "/area",
        icon: "global",
        name: "Area Management",
        authority:['area'],
        routes: [
          // {
          //   path: "/area/geo-management/",
          //   name: "Geo Management",
          //   component: "./Area/Geo",
          // },
          // {
          //   path: "/area/area-management/",
          //   name: "Area Management",
          //   component: "./Area/Area",
          // },
          {
            path: "/area/area-management/",
            name: "Area Management",
            component: "./Area/Areas/Areas",
          },
          {
            path: "/area/promo-management/",
            name: "Promo Management",
            // icon: "barcode",
            component: "./Area/Promo/Promo",
            authority: "area.promo"
          },
          {
            path: "/area/deposit-management/",
            name: "Deposit Management",
            // icon: "dollar",
            component: "./Area/Deposit/Deposit",
            authority: "area.deposit"
          },
          {
            path: "/area/membership-management",
            name: "Membership Management",
            // icon: "wallet",
            authority: "area.membership",
            component: "./Area/Membership/Membership",
          },
          {
            path: "/area/price-management/",
            name: "Price Management",
            authority: "area.price",
            component: "./Area/Price/Price"
          },
          {
            path: "/area/policy-management/",
            name: "Policy Management",
            // authority: "area.price",
            component: "./Area/Policy/Policy"
          },
        ]
      },
      {
        path: "/employee-management/",
        name: "Admin Management",
        icon: "user",
        authority: ["admin"],
        routes: [
          {
            path: "/employee-management/role",
            name: "Role Management",
            component: "./Employee/Role",
          },
          // {
          //   path: "/employee-management/privilege",
          //   name: "Privilege Management",
          //   component: "./Employee/Privilege",
          // },
          {
            path: "/employee-management/admin",
            name: "Admin Management",
            component: "./Employee/Admin",
          }
        ]
      },
      {
        path: "/technician-management/",
        name: "Technician Management",
        icon: "technician",
        authority: ["technician"],
        routes: [
          {
            path: "/technician-management/main",
            name: "Technician Management",
            // icon: "user",
            component: "./Technician/Technician",
          },
          {
            path: "/technician-management/violation-management",
            name: "Violation Management",
            // icon: "warning",
            component: "./Technician/Violation",
            authority: ["technician.violation"],
          },
          // {
          //   path: "/technician-management/techmetrics",
          //   name: "Tech Metrics",
          //   // icon: "user",
          //   component: "./Technician/TechMetrics",
          //   authority: ["technician.metric"],
          // }
        ]
      },
        {
        name: "account",
        icon: "user",
        path: "/account",
        authority: ["me"],
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
        component: "404"
      }
    ]
  }
];
