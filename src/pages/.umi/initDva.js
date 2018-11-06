import dva from "dva";
import createLoading from "dva-loading";

const runtimeDva = window.g_plugins.mergeConfig("dva");
let app = dva({
  history: window.g_history,

  ...(runtimeDva.config || {})
});

window.g_app = app;
app.use(createLoading());
(runtimeDva.plugins || []).forEach(plugin => {
  app.use(plugin);
});

app.model({
  namespace: "global",
  ...require("/Users/zhuangenze/Desktop/manhattan-admin-web/src/models/global.js")
    .default
});
app.model({
  namespace: "list",
  ...require("/Users/zhuangenze/Desktop/manhattan-admin-web/src/models/list.js")
    .default
});
app.model({
  namespace: "login",
  ...require("/Users/zhuangenze/Desktop/manhattan-admin-web/src/models/login.js")
    .default
});
app.model({
  namespace: "project",
  ...require("/Users/zhuangenze/Desktop/manhattan-admin-web/src/models/project.js")
    .default
});
app.model({
  namespace: "setting",
  ...require("/Users/zhuangenze/Desktop/manhattan-admin-web/src/models/setting.js")
    .default
});
app.model({
  namespace: "user",
  ...require("/Users/zhuangenze/Desktop/manhattan-admin-web/src/models/user.js")
    .default
});
app.model({
  namespace: "register",
  ...require("/Users/zhuangenze/Desktop/manhattan-admin-web/src/pages/User/models/register.js")
    .default
});
app.model({
  namespace: "rule",
  ...require("/Users/zhuangenze/Desktop/manhattan-admin-web/src/pages/List/models/rule.js")
    .default
});
app.model({
  namespace: "profile",
  ...require("/Users/zhuangenze/Desktop/manhattan-admin-web/src/pages/Profile/models/profile.js")
    .default
});
app.model({
  namespace: "error",
  ...require("/Users/zhuangenze/Desktop/manhattan-admin-web/src/pages/Exception/models/error.js")
    .default
});
app.model({
  namespace: "geographic",
  ...require("/Users/zhuangenze/Desktop/manhattan-admin-web/src/pages/Account/Settings/models/geographic.js")
    .default
});
