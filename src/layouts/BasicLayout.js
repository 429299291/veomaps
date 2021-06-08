import React from "react";
import { Layout,Modal } from "antd";
import DocumentTitle from "react-document-title";
import isEqual from "lodash/isEqual";
import memoizeOne from "memoize-one";
import { connect } from "dva";
import { ContainerQuery } from "react-container-query";
import classNames from "classnames";
import pathToRegexp from "path-to-regexp";
import { enquireScreen, unenquireScreen } from "enquire-js";
import { formatMessage } from "umi/locale";
import SiderMenu from "@/components/SiderMenu";
import Authorized from "@/utils/Authorized";
import SettingDrawer from "@/components/SettingDrawer";
import logo from "../assets/veo_circle.png";
import Footer from "./Footer";
import Header from "./Header";
import Context from "./MenuContext";
import Exception403 from "../pages/Exception/403";
import TabController from './TabController';
import router from 'umi/router';



const { Content } = Layout;
// Conversion router to menu.
function formatter(data, parentAuthority, parentName) {
  return data
    .map(item => {
      if (!item.name || !item.path) {
        return null;
      }

      //filter account setting on sidebar
      if (item.name === "account") {
        return null;
      }



      let locale = "menu";
      if (parentName) {
        locale = `${parentName}.${item.name}`;
      } else {
        locale = `menu.${item.name}`;
      }

      const result = {
        ...item,
        name: formatMessage({ id: locale, defaultMessage: item.name }),
        locale,
        authority: item.authority || parentAuthority
      };
      if (item.routes) {
        const children = formatter(item.routes, item.authority, locale);
        // Reduce memory usage
        result.children = children;
      }
      delete result.routes;
      return result;
    })
    .filter(item => item);
}

const memoizeOneFormatter = memoizeOne(formatter, isEqual);

const query = {
  "screen-xs": {
    maxWidth: 575
  },
  "screen-sm": {
    minWidth: 576,
    maxWidth: 767
  },
  "screen-md": {
    minWidth: 768,
    maxWidth: 991
  },
  "screen-lg": {
    minWidth: 992,
    maxWidth: 1199
  },
  "screen-xl": {
    minWidth: 1200,
    maxWidth: 1599
  },
  "screen-xxl": {
    minWidth: 1600
  }
};

class BasicLayout extends React.PureComponent {
  constructor(props) {
    super(props);
    this.getPageTitle = memoizeOne(this.getPageTitle);
    this.getBreadcrumbNameMap = memoizeOne(this.getBreadcrumbNameMap, isEqual);
    this.breadcrumbNameMap = this.getBreadcrumbNameMap();
    this.matchParamsPath = memoizeOne(this.matchParamsPath, isEqual);
  }

  state = {
    rendering: true,
    isMobile: false,
    menuData: this.getMenuData(),
    selectedAreaName: "all",
    isMobile: window.innerWidth <= 600,
    isUpdatePhoneVisible: true
  };

  resize() {
    const {dispatch} = this.props;

    const isMobile = window.innerWidth <= 600;

    this.setState({isMobile: isMobile});

    dispatch({
      type: "global/isMobile",
      value: isMobile
    });
}

  componentDidMount() {
    const { dispatch,admins,user } = this.props;
    setTimeout(() => {

      dispatch({
        type: "areas/get",
        payload:{
          areaIds:this.props.user.areaIds
        }
      });
    }, 300);
    

    dispatch({
      type: "user/fetchCurrent"
    });

    dispatch({
      type: "login/updateToken"
    });

    window.addEventListener("resize", this.resize.bind(this));

    this.renderRef = requestAnimationFrame(() => {
      this.setState({
        rendering: false
      });
    });
    this.enquireHandler = enquireScreen(mobile => {
      const { isMobile } = this.state;
      if (isMobile !== mobile) {
        this.setState({
          isMobile: mobile
        });
      }
    });
  }
  componentDidUpdate(preProps) {
    // After changing to phone mode,
    // if collapsed is true, you need to click twice to display
    this.breadcrumbNameMap = this.getBreadcrumbNameMap();
    const { isMobile } = this.state;
    const { collapsed } = this.props;
    if (isMobile && !preProps.isMobile && !collapsed) {
      this.handleMenuCollapse(false);
    }
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.renderRef);
    unenquireScreen(this.enquireHandler);
  }

  getContext() {
    const { location } = this.props;
    return {
      location,
      breadcrumbNameMap: this.breadcrumbNameMap
    };
  }

  getMenuData() {
    const {
      route: { routes }
    } = this.props;
    return memoizeOneFormatter(routes);
  }

  getBreadcrumbNameMap() {
    const routerMap = {};
    const mergeMenuAndRouter = data => {
      data.forEach(menuItem => {
        if (menuItem.children) {
          mergeMenuAndRouter(menuItem.children);
        }
        // Reduce memory usage
        routerMap[menuItem.path] = menuItem;
      });
    };
    mergeMenuAndRouter(this.getMenuData());
    return routerMap;
  }

  matchParamsPath = pathname => {
    const pathKey = Object.keys(this.breadcrumbNameMap).find(key =>
      pathToRegexp(key).test(pathname)
    );
    return this.breadcrumbNameMap[pathKey];
  };

  getPageTitle = pathname => {
    const currRouterData = this.matchParamsPath(pathname);

    if (!currRouterData) {
      return "Manhattan";
    }
    const message = formatMessage({
      id: currRouterData.locale || currRouterData.name,
      defaultMessage: currRouterData.name
    });
    return `${message}`;
  };

  getLayoutStyle = () => {
    const { isMobile } = this.state;
    const { fixSiderbar, collapsed, layout } = this.props;
    if (fixSiderbar && layout !== "topmenu" && !isMobile) {
      return {
        paddingLeft: collapsed ? "80px" : "256px"
      };
    }
    return null;
  };

  getContentStyle = () => {
    const { fixedHeader } = this.props;
    return {
      margin: "24px 24px 0",
      paddingTop: fixedHeader ? 64 : 0
    };
  };

  handleMenuCollapse = collapsed => {
    const { dispatch } = this.props;
    dispatch({
      type: "global/changeLayoutCollapsed",
      payload: collapsed
    });
  };

  getAuthorizedChildComponent = (children, routerConfig) => {

    return  <Authorized
            authority={routerConfig && routerConfig.authority}
            noMatch={<Exception403 />}
            >
              {children}
            </Authorized>
  }

  renderSettingDrawer() {
    // Do not render SettingDrawer in production
    // unless it is deployed in preview.pro.ant.design as demo
    const { rendering } = this.state;
    if (
      (rendering || process.env.NODE_ENV === "production") &&
      APP_TYPE !== "site"
    ) {
      return null;
    }
    return <SettingDrawer />;
  }

  handleStartSelectArea = () => {
    this.setState({shouldShowAreaSelector: !this.state.shouldShowAreaSelector});
  }

  handlePhoneModalOK = () => {
    this.setState({isUpdatePhoneVisible: false});
    router.push('/account/settings/base');
  }

  handlePhoneModalCancel = () => {
    this.setState({isUpdatePhoneVisible: false});
    router.push('/account/settings/base');
  }

  handleSelectArea = (areaId, areaName) => {
    const { dispatch } = this.props;

    dispatch({
      type: 'areas/selectArea',
      areaId: areaId === "all" ? null : areaId,
    });

    this.setState({selectedAreaName: areaName});
  }

  render() {
    const {
      navTheme,
      layout: PropsLayout,
      areas,
      children,
      user,
      location: { pathname },
      match,
      selectedAreaId,
      dispatch,
      currentUser
    } = this.props;
    const pageTitle = this.getPageTitle(pathname);
    const tasParams = {
      keys: location.pathname,
      location,
      dispatch:this.props.dispatch,
      match,
      name: pageTitle,
      component: this.getAuthorizedChildComponent(children, routerConfig)
    }

    const { isMobile, menuData, shouldShowAreaSelector, selectedAreaName, isUpdatePhoneVisible} = this.state;
    const isTop = PropsLayout === "topmenu";
    const routerConfig = this.matchParamsPath(pathname);
    

    if (this.props.isUserFetched && !currentUser.phone && isUpdatePhoneVisible) 
     Modal.warning({
       title: "Phone Update",
       onOk: this.handlePhoneModalOK,       
       onCancel: this.handlePhoneModalCancel,
       content: ( <div><p>Veo managemnt system will start using 2-factor authentication on <b>24th March. </b> </p>
        <p> please update your phone number ASAP so you can keep using our service.</p></div>)
     });
      
    
    const layout = (
      <Layout>
        {isTop && !isMobile  ? null : (
          <SiderMenu
            logo={logo}
            Authorized={Authorized}
            theme={navTheme}
            onCollapse={this.handleMenuCollapse}
            isUserFetched={this.props.isUserFetched}
            menuData={menuData}
            isMobile={isMobile}
            {...this.props}
          />
        )}
        
        <Layout
          style={{
            ...this.getLayoutStyle(),
            minHeight: "100vh"
          }}
        >
          { this.props.isUserFetched &&
              <Header
              menuData={menuData}
              handleMenuCollapse={this.handleMenuCollapse}
              logo={logo}
              isMobile={isMobile}
              {...this.props}
              />
          }
          
          { isMobile &&
            <div style={{width: "100%", minHeight: "4em",  marginTop:"0.1em", backgroundColor:"white", position: "relative"}}>
              <div 
                style={{width: "50%", height: "2em", marginTop:"1em",  marginBottom:"1em", border: "2px #51B5AA solid", borderRadius: "8px", textAlign: "center", position: "absolute", margin: "1em 0 0 25%"}}
                onClick={this.handleStartSelectArea}
              >
                {(shouldShowAreaSelector ? "- " : "+ ") + selectedAreaName}
              </div>

              {
                shouldShowAreaSelector && 

                <div style={{marginTop: "4em"}}>

                  <div style= {{ margin: "0.5em 1em", textAlign: "center", border: "2px " + (selectedAreaId === null ? "#51B5AA" : "black") + " solid"}} onClick={()=> this.handleSelectArea(null, "all")} > All </div>

                  {areas.map(area =>
                    {
                      const border = "2px " + (selectedAreaId === area.id ? "#51B5AA" : "black") + " solid";

                      const style = {
                        textAlign: "center",
                        border: border,
                        margin: "0.5em 1em",
                      }

                      return <div  key={area.id} onClick={()=> this.handleSelectArea(area.id, area.name)} style={style}>
                        {area.name}
                      </div>
                    })
                  }

                </div>
              }


            </div>

        
          }

          <Content style={this.getContentStyle()}>
            
            {this.state.isMobile ? 
            
            
             this.props.isUserFetched &&
              <Authorized
                authority={routerConfig && routerConfig.authority}
                noMatch={<Exception403 />}
                isMobile={this.state.isMobile}
              >
                {children}
              </Authorized>
            : 
            
            <TabController {...tasParams } className={"tabController"} />
            
            }
          </Content>
          <Footer />
        </Layout>
      </Layout>
    );
    return (
      <React.Fragment>
        <DocumentTitle title={pageTitle}>
          <ContainerQuery query={query}>
            {params => (
              <Context.Provider value={this.getContext()}>
                <div className={classNames(params)}>{layout}</div>
              </Context.Provider>
            )}
          </ContainerQuery>
        </DocumentTitle>
        {this.renderSettingDrawer()}
      </React.Fragment>
    );
  }
}

export default connect(({ global, setting, user, areas }) => ({
  collapsed: global.collapsed,
  layout: setting.layout,
  isUserFetched: user.isUserFetched,
  currentUser: user.currentUser,
  areas: areas.data,
  user: user.currentUser,
  selectedAreaId: areas.selectedAreaId,
  ...setting
}))(BasicLayout);
