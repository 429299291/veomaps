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

app.model({ namespace: 'admin', ...(require('/Users/abaiyat/veoride/manhattan-admin-web/src/models/admin.js').default) });
app.model({ namespace: 'area', ...(require('/Users/abaiyat/veoride/manhattan-admin-web/src/models/area.js').default) });
app.model({ namespace: 'coupon', ...(require('/Users/abaiyat/veoride/manhattan-admin-web/src/models/coupon.js').default) });
app.model({ namespace: 'customer', ...(require('/Users/abaiyat/veoride/manhattan-admin-web/src/models/customer.js').default) });
app.model({ namespace: 'dashboard', ...(require('/Users/abaiyat/veoride/manhattan-admin-web/src/models/dashboard.js').default) });
app.model({ namespace: 'deposit', ...(require('/Users/abaiyat/veoride/manhattan-admin-web/src/models/deposit.js').default) });
app.model({ namespace: 'error', ...(require('/Users/abaiyat/veoride/manhattan-admin-web/src/models/error.js').default) });
app.model({ namespace: 'geo', ...(require('/Users/abaiyat/veoride/manhattan-admin-web/src/models/geo.js').default) });
app.model({ namespace: 'global', ...(require('/Users/abaiyat/veoride/manhattan-admin-web/src/models/global.js').default) });
app.model({ namespace: 'list', ...(require('/Users/abaiyat/veoride/manhattan-admin-web/src/models/list.js').default) });
app.model({ namespace: 'login', ...(require('/Users/abaiyat/veoride/manhattan-admin-web/src/models/login.js').default) });
app.model({ namespace: 'membership', ...(require('/Users/abaiyat/veoride/manhattan-admin-web/src/models/membership.js').default) });
app.model({ namespace: 'notification', ...(require('/Users/abaiyat/veoride/manhattan-admin-web/src/models/notification.js').default) });
app.model({ namespace: 'performance', ...(require('/Users/abaiyat/veoride/manhattan-admin-web/src/models/performance.js').default) });
app.model({ namespace: 'price', ...(require('/Users/abaiyat/veoride/manhattan-admin-web/src/models/price.js').default) });
app.model({ namespace: 'privilege', ...(require('/Users/abaiyat/veoride/manhattan-admin-web/src/models/privilege.js').default) });
app.model({ namespace: 'project', ...(require('/Users/abaiyat/veoride/manhattan-admin-web/src/models/project.js').default) });
app.model({ namespace: 'promo', ...(require('/Users/abaiyat/veoride/manhattan-admin-web/src/models/promo.js').default) });
app.model({ namespace: 'ride', ...(require('/Users/abaiyat/veoride/manhattan-admin-web/src/models/ride.js').default) });
app.model({ namespace: 'role', ...(require('/Users/abaiyat/veoride/manhattan-admin-web/src/models/role.js').default) });
app.model({ namespace: 'setting', ...(require('/Users/abaiyat/veoride/manhattan-admin-web/src/models/setting.js').default) });
app.model({ namespace: 'technician', ...(require('/Users/abaiyat/veoride/manhattan-admin-web/src/models/technician.js').default) });
app.model({ namespace: 'user', ...(require('/Users/abaiyat/veoride/manhattan-admin-web/src/models/user.js').default) });
app.model({ namespace: 'vehicle', ...(require('/Users/abaiyat/veoride/manhattan-admin-web/src/models/vehicle.js').default) });
app.model({ namespace: 'register', ...(require('/Users/abaiyat/veoride/manhattan-admin-web/src/pages/User/models/register.js').default) });
app.model({ namespace: 'activities', ...(require('/Users/abaiyat/veoride/manhattan-admin-web/src/pages/Dashboard/models/activities.js').default) });
app.model({ namespace: 'chart', ...(require('/Users/abaiyat/veoride/manhattan-admin-web/src/pages/Dashboard/models/chart.js').default) });
app.model({ namespace: 'monitor', ...(require('/Users/abaiyat/veoride/manhattan-admin-web/src/pages/Dashboard/models/monitor.js').default) });
app.model({ namespace: 'geographic', ...(require('/Users/abaiyat/veoride/manhattan-admin-web/src/pages/Account/Settings/models/geographic.js').default) });
