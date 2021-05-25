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

app.model({ namespace: 'admin', ...(require('C:/Users/42929/Desktop/veo-admin-website/src/models/admin.js').default) });
app.model({ namespace: 'area', ...(require('C:/Users/42929/Desktop/veo-admin-website/src/models/area.js').default) });
app.model({ namespace: 'coupon', ...(require('C:/Users/42929/Desktop/veo-admin-website/src/models/coupon.js').default) });
app.model({ namespace: 'customer', ...(require('C:/Users/42929/Desktop/veo-admin-website/src/models/customer.js').default) });
app.model({ namespace: 'dashboard', ...(require('C:/Users/42929/Desktop/veo-admin-website/src/models/dashboard.js').default) });
app.model({ namespace: 'deposit', ...(require('C:/Users/42929/Desktop/veo-admin-website/src/models/deposit.js').default) });
app.model({ namespace: 'error', ...(require('C:/Users/42929/Desktop/veo-admin-website/src/models/error.js').default) });
app.model({ namespace: 'geo', ...(require('C:/Users/42929/Desktop/veo-admin-website/src/models/geo.js').default) });
app.model({ namespace: 'global', ...(require('C:/Users/42929/Desktop/veo-admin-website/src/models/global.js').default) });
app.model({ namespace: 'list', ...(require('C:/Users/42929/Desktop/veo-admin-website/src/models/list.js').default) });
app.model({ namespace: 'listing', ...(require('C:/Users/42929/Desktop/veo-admin-website/src/models/listing.js').default) });
app.model({ namespace: 'login', ...(require('C:/Users/42929/Desktop/veo-admin-website/src/models/login.js').default) });
app.model({ namespace: 'membership', ...(require('C:/Users/42929/Desktop/veo-admin-website/src/models/membership.js').default) });
app.model({ namespace: 'notification', ...(require('C:/Users/42929/Desktop/veo-admin-website/src/models/notification.js').default) });
app.model({ namespace: 'order', ...(require('C:/Users/42929/Desktop/veo-admin-website/src/models/order.js').default) });
app.model({ namespace: 'performance', ...(require('C:/Users/42929/Desktop/veo-admin-website/src/models/performance.js').default) });
app.model({ namespace: 'price', ...(require('C:/Users/42929/Desktop/veo-admin-website/src/models/price.js').default) });
app.model({ namespace: 'privilege', ...(require('C:/Users/42929/Desktop/veo-admin-website/src/models/privilege.js').default) });
app.model({ namespace: 'project', ...(require('C:/Users/42929/Desktop/veo-admin-website/src/models/project.js').default) });
app.model({ namespace: 'promo', ...(require('C:/Users/42929/Desktop/veo-admin-website/src/models/promo.js').default) });
app.model({ namespace: 'ride', ...(require('C:/Users/42929/Desktop/veo-admin-website/src/models/ride.js').default) });
app.model({ namespace: 'role', ...(require('C:/Users/42929/Desktop/veo-admin-website/src/models/role.js').default) });
app.model({ namespace: 'setting', ...(require('C:/Users/42929/Desktop/veo-admin-website/src/models/setting.js').default) });
app.model({ namespace: 'technician', ...(require('C:/Users/42929/Desktop/veo-admin-website/src/models/technician.js').default) });
app.model({ namespace: 'user', ...(require('C:/Users/42929/Desktop/veo-admin-website/src/models/user.js').default) });
app.model({ namespace: 'vehicle-violation', ...(require('C:/Users/42929/Desktop/veo-admin-website/src/models/vehicle-violation.js').default) });
app.model({ namespace: 'vehicle', ...(require('C:/Users/42929/Desktop/veo-admin-website/src/models/vehicle.js').default) });
app.model({ namespace: 'violation', ...(require('C:/Users/42929/Desktop/veo-admin-website/src/models/violation.js').default) });
app.model({ namespace: 'register', ...(require('C:/Users/42929/Desktop/veo-admin-website/src/pages/User/models/register.js').default) });
app.model({ namespace: 'activities', ...(require('C:/Users/42929/Desktop/veo-admin-website/src/pages/Dashboard/models/activities.js').default) });
app.model({ namespace: 'chart', ...(require('C:/Users/42929/Desktop/veo-admin-website/src/pages/Dashboard/models/chart.js').default) });
app.model({ namespace: 'monitor', ...(require('C:/Users/42929/Desktop/veo-admin-website/src/pages/Dashboard/models/monitor.js').default) });
app.model({ namespace: 'geographic', ...(require('C:/Users/42929/Desktop/veo-admin-website/src/pages/Account/Settings/models/geographic.js').default) });
