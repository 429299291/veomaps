import dva from 'dva';
import createLoading from 'dva-loading';

const runtimeDva = window.g_plugins.mergeConfig('dva');
let app = dva({
  history: window.g_history,
  
  ...(runtimeDva.config || {}),
});

window.g_app = app;
app.use(createLoading());
(runtimeDva.plugins || []).forEach(plugin => {
  app.use(plugin);
});

app.model({ namespace: 'admin', ...(require('/Users/zhuangenze/Desktop/manhattan-admin-web/src/models/admin.js').default) });
app.model({ namespace: 'area', ...(require('/Users/zhuangenze/Desktop/manhattan-admin-web/src/models/area.js').default) });
app.model({ namespace: 'coupon', ...(require('/Users/zhuangenze/Desktop/manhattan-admin-web/src/models/coupon.js').default) });
app.model({ namespace: 'customer', ...(require('/Users/zhuangenze/Desktop/manhattan-admin-web/src/models/customer.js').default) });
app.model({ namespace: 'dashboard', ...(require('/Users/zhuangenze/Desktop/manhattan-admin-web/src/models/dashboard.js').default) });
app.model({ namespace: 'deposit', ...(require('/Users/zhuangenze/Desktop/manhattan-admin-web/src/models/deposit.js').default) });
app.model({ namespace: 'error', ...(require('/Users/zhuangenze/Desktop/manhattan-admin-web/src/models/error.js').default) });
app.model({ namespace: 'geo', ...(require('/Users/zhuangenze/Desktop/manhattan-admin-web/src/models/geo.js').default) });
app.model({ namespace: 'global', ...(require('/Users/zhuangenze/Desktop/manhattan-admin-web/src/models/global.js').default) });
app.model({ namespace: 'list', ...(require('/Users/zhuangenze/Desktop/manhattan-admin-web/src/models/list.js').default) });
app.model({ namespace: 'login', ...(require('/Users/zhuangenze/Desktop/manhattan-admin-web/src/models/login.js').default) });
app.model({ namespace: 'membership', ...(require('/Users/zhuangenze/Desktop/manhattan-admin-web/src/models/membership.js').default) });
app.model({ namespace: 'notification', ...(require('/Users/zhuangenze/Desktop/manhattan-admin-web/src/models/notification.js').default) });
app.model({ namespace: 'performance', ...(require('/Users/zhuangenze/Desktop/manhattan-admin-web/src/models/performance.js').default) });
app.model({ namespace: 'price', ...(require('/Users/zhuangenze/Desktop/manhattan-admin-web/src/models/price.js').default) });
app.model({ namespace: 'privilege', ...(require('/Users/zhuangenze/Desktop/manhattan-admin-web/src/models/privilege.js').default) });
app.model({ namespace: 'project', ...(require('/Users/zhuangenze/Desktop/manhattan-admin-web/src/models/project.js').default) });
app.model({ namespace: 'promo', ...(require('/Users/zhuangenze/Desktop/manhattan-admin-web/src/models/promo.js').default) });
app.model({ namespace: 'ride', ...(require('/Users/zhuangenze/Desktop/manhattan-admin-web/src/models/ride.js').default) });
app.model({ namespace: 'role', ...(require('/Users/zhuangenze/Desktop/manhattan-admin-web/src/models/role.js').default) });
app.model({ namespace: 'setting', ...(require('/Users/zhuangenze/Desktop/manhattan-admin-web/src/models/setting.js').default) });
app.model({ namespace: 'technician', ...(require('/Users/zhuangenze/Desktop/manhattan-admin-web/src/models/technician.js').default) });
app.model({ namespace: 'user', ...(require('/Users/zhuangenze/Desktop/manhattan-admin-web/src/models/user.js').default) });
app.model({ namespace: 'vehicle-violation', ...(require('/Users/zhuangenze/Desktop/manhattan-admin-web/src/models/vehicle-violation.js').default) });
app.model({ namespace: 'vehicle', ...(require('/Users/zhuangenze/Desktop/manhattan-admin-web/src/models/vehicle.js').default) });
app.model({ namespace: 'violation', ...(require('/Users/zhuangenze/Desktop/manhattan-admin-web/src/models/violation.js').default) });
app.model({ namespace: 'register', ...(require('/Users/zhuangenze/Desktop/manhattan-admin-web/src/pages/User/models/register.js').default) });
app.model({ namespace: 'activities', ...(require('/Users/zhuangenze/Desktop/manhattan-admin-web/src/pages/Dashboard/models/activities.js').default) });
app.model({ namespace: 'chart', ...(require('/Users/zhuangenze/Desktop/manhattan-admin-web/src/pages/Dashboard/models/chart.js').default) });
app.model({ namespace: 'monitor', ...(require('/Users/zhuangenze/Desktop/manhattan-admin-web/src/pages/Dashboard/models/monitor.js').default) });
app.model({ namespace: 'geographic', ...(require('/Users/zhuangenze/Desktop/manhattan-admin-web/src/pages/Account/Settings/models/geographic.js').default) });
