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

app.model({ namespace: 'area', ...(require('/Users/zhuangenze/Desktop/manhattan-admin-web/src/models/area.js').default) });
app.model({ namespace: 'coupon', ...(require('/Users/zhuangenze/Desktop/manhattan-admin-web/src/models/coupon.js').default) });
app.model({ namespace: 'customer', ...(require('/Users/zhuangenze/Desktop/manhattan-admin-web/src/models/customer.js').default) });
app.model({ namespace: 'geo', ...(require('/Users/zhuangenze/Desktop/manhattan-admin-web/src/models/geo.js').default) });
app.model({ namespace: 'global', ...(require('/Users/zhuangenze/Desktop/manhattan-admin-web/src/models/global.js').default) });
app.model({ namespace: 'list', ...(require('/Users/zhuangenze/Desktop/manhattan-admin-web/src/models/list.js').default) });
app.model({ namespace: 'login', ...(require('/Users/zhuangenze/Desktop/manhattan-admin-web/src/models/login.js').default) });
app.model({ namespace: 'membership', ...(require('/Users/zhuangenze/Desktop/manhattan-admin-web/src/models/membership.js').default) });
app.model({ namespace: 'price', ...(require('/Users/zhuangenze/Desktop/manhattan-admin-web/src/models/price.js').default) });
app.model({ namespace: 'project', ...(require('/Users/zhuangenze/Desktop/manhattan-admin-web/src/models/project.js').default) });
app.model({ namespace: 'ride', ...(require('/Users/zhuangenze/Desktop/manhattan-admin-web/src/models/ride.js').default) });
app.model({ namespace: 'setting', ...(require('/Users/zhuangenze/Desktop/manhattan-admin-web/src/models/setting.js').default) });
app.model({ namespace: 'user', ...(require('/Users/zhuangenze/Desktop/manhattan-admin-web/src/models/user.js').default) });
app.model({ namespace: 'vehicle', ...(require('/Users/zhuangenze/Desktop/manhattan-admin-web/src/models/vehicle.js').default) });
app.model({ namespace: 'register', ...(require('/Users/zhuangenze/Desktop/manhattan-admin-web/src/pages/User/models/register.js').default) });
