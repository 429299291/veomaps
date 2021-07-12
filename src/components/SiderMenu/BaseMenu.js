import React, { PureComponent } from 'react';
import { Menu } from 'antd';
import Link from 'umi/link';
import isEqual from 'lodash/isEqual';
import memoizeOne from 'memoize-one';
import pathToRegexp from 'path-to-regexp';
import { urlToList } from '../_utils/pathTools';
import Icon from '@ant-design/icons';
import styles from './index.less';
import { routerRedux } from "dva/router";
import { stringify } from "qs";
import { DashboardOutlined,ShopOutlined,CarOutlined,UserOutlined,GlobalOutlined,UserSwitchOutlined,UsergroupAddOutlined } from '@ant-design/icons';

const { SubMenu } = Menu;

const HeartSvg = () => (
  <svg t="1626083383520" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2105" width="16" height="16"><path d="M887.466667 802.133333c-37.546667 0-68.266667-30.72-68.266667-68.266666s30.72-68.266667 68.266667-68.266667 68.266667 30.72 68.266666 68.266667-30.72 68.266667-68.266666 68.266666z m0-102.4c-20.48 0-34.133333 13.653333-34.133334 34.133334s13.653333 34.133333 34.133334 34.133333 34.133333-13.653333 34.133333-34.133333-13.653333-34.133333-34.133333-34.133334zM460.8 494.933333h-341.333333c-27.306667 0-51.2-23.893333-51.2-51.2s23.893333-51.2 51.2-51.2h341.333333c27.306667 0 51.2 23.893333 51.2 51.2s-23.893333 51.2-51.2 51.2z m-341.333333-68.266666c-10.24 0-17.066667 6.826667-17.066667 17.066666s6.826667 17.066667 17.066667 17.066667h341.333333c10.24 0 17.066667-6.826667 17.066667-17.066667s-6.826667-17.066667-17.066667-17.066666h-341.333333z" fill="" p-id="2106"></path><path d="M392.533333 699.733333c-10.24 0-17.066667-10.24-17.066666-20.48 6.826667-44.373333 27.306667-187.733333 54.613333-215.04 6.826667-6.826667 17.066667-6.826667 23.893333 0 6.826667 6.826667 6.826667 17.066667 0 23.893334-13.653333 13.653333-34.133333 112.64-47.786666 194.56 3.413333 10.24-6.826667 17.066667-13.653334 17.066666zM563.2 699.733333h-6.826667c-10.24-3.413333-13.653333-13.653333-10.24-23.893333l95.573334-242.346667-68.266667-197.973333c-6.826667-17.066667-3.413333-34.133333 3.413333-47.786667 6.826667-13.653333 23.893333-27.306667 40.96-30.72 30.72-6.826667 61.44 6.826667 71.68 34.133334l112.64 259.413333c0 3.413333 20.48 51.2 71.68 51.2 64.853333 0 146.773333 37.546667 146.773334 78.506667 0 27.306667-40.96 44.373333-119.466667 51.2-10.24 0-17.066667-6.826667-17.066667-17.066667s6.826667-17.066667 17.066667-17.066667c37.546667-3.413333 75.093333-10.24 85.333333-17.066666-6.826667-13.653333-58.026667-44.373333-112.64-44.373334-75.093333 0-102.4-71.68-102.4-75.093333L662.186667 204.8c-6.826667-13.653333-20.48-20.48-34.133334-17.066667-6.826667 3.413333-13.653333 6.826667-17.066666 13.653334-3.413333 6.826667-3.413333 13.653333-3.413334 20.48l71.68 204.8v10.24L580.266667 689.493333c-3.413333 6.826667-10.24 10.24-17.066667 10.24z" fill="" p-id="2107"></path><path d="M768 699.733333H716.8c-23.893333 0-44.373333-13.653333-58.026667-30.72-10.24-17.066667-13.653333-34.133333-3.413333-51.2 6.826667-17.066667 17.066667-30.72 27.306667-47.786666 20.48-27.306667 23.893333-54.613333 6.826666-78.506667L648.533333 447.146667c-6.826667-6.826667-3.413333-17.066667 3.413334-23.893334s17.066667-3.413333 23.893333 3.413334l37.546667 47.786666c27.306667 34.133333 27.306667 81.92-6.826667 119.466667-10.24 13.653333-17.066667 27.306667-23.893333 37.546667-3.413333 6.826667 0 13.653333 3.413333 20.48 6.826667 10.24 17.066667 17.066667 30.72 17.066666h51.2c10.24 0 17.066667 6.826667 17.066667 17.066667s-6.826667 13.653333-17.066667 13.653333zM778.24 290.133333h-40.96c-23.893333 0-44.373333-17.066667-54.613333-40.96-6.826667-17.066667-3.413333-37.546667 6.826666-51.2 6.826667-13.653333 20.48-23.893333 37.546667-27.306666l71.68-17.066667c6.826667 0 10.24 0 17.066667 3.413333 3.413333 6.826667 3.413333 10.24 3.413333 17.066667l-23.893333 102.4c0 6.826667-6.826667 13.653333-17.066667 13.653333z m0-95.573333l-44.373333 10.24c-6.826667 0-10.24 3.413333-13.653334 10.24-3.413333 6.826667-3.413333 13.653333-3.413333 23.893333 3.413333 10.24 10.24 17.066667 20.48 17.066667h27.306667l13.653333-61.44zM529.066667 324.266667c-6.826667 0-10.24-3.413333-13.653334-6.826667-6.826667-10.24-3.413333-20.48 3.413334-23.893333l102.4-68.266667c6.826667-6.826667 17.066667-3.413333 23.893333 3.413333 6.826667 10.24 3.413333 20.48-3.413333 23.893334l-102.4 68.266666c-3.413333 3.413333-6.826667 3.413333-10.24 3.413334z" fill="" p-id="2108"></path><path d="M887.466667 870.4c-75.093333 0-136.533333-61.44-136.533334-136.533333s61.44-136.533333 136.533334-136.533334 136.533333 61.44 136.533333 136.533334-61.44 136.533333-136.533333 136.533333z m0-238.933333c-58.026667 0-102.4 44.373333-102.4 102.4s44.373333 102.4 102.4 102.4 102.4-44.373333 102.4-102.4-44.373333-102.4-102.4-102.4zM238.933333 802.133333c-37.546667 0-68.266667-30.72-68.266666-68.266666s30.72-68.266667 68.266666-68.266667 68.266667 30.72 68.266667 68.266667-30.72 68.266667-68.266667 68.266666z m0-102.4c-20.48 0-34.133333 13.653333-34.133333 34.133334s13.653333 34.133333 34.133333 34.133333 34.133333-13.653333 34.133334-34.133333-13.653333-34.133333-34.133334-34.133334z" fill="" p-id="2109"></path><path d="M238.933333 870.4c-75.093333 0-136.533333-61.44-136.533333-136.533333 0-20.48 3.413333-40.96 13.653333-58.026667 3.413333-6.826667 10.24-10.24 17.066667-10.24h215.04c6.826667 0 13.653333 3.413333 17.066667 10.24 10.24 20.48 13.653333 37.546667 13.653333 58.026667-3.413333 75.093333-64.853333 136.533333-139.946667 136.533333z m-95.573333-170.666667c-3.413333 10.24-6.826667 23.893333-6.826667 34.133334 0 58.026667 44.373333 102.4 102.4 102.4s102.4-44.373333 102.4-102.4c0-10.24-3.413333-23.893333-6.826666-34.133334H143.36z" fill="" p-id="2110"></path><path d="M563.2 699.733333H68.266667c-34.133333 0-68.266667-23.893333-68.266667-54.613333 0-40.96 13.653333-81.92 40.96-112.64 37.546667-47.786667 88.746667-71.68 146.773333-71.68 10.24 0 17.066667 6.826667 17.066667 17.066667s-6.826667 17.066667-17.066667 17.066666c-47.786667 0-88.746667 20.48-122.88 58.026667-20.48 23.893333-30.72 58.026667-30.72 92.16 0 10.24 17.066667 20.48 34.133334 20.48h494.933333c10.24 0 17.066667 6.826667 17.066667 17.066667s-6.826667 17.066667-17.066667 17.066666z" fill="" p-id="2111"></path></svg>
);
const HeartIcon = props => <Icon component={HeartSvg} {...props} />
// Allow menu.js config icon as string or ReactNode
//   icon: 'setting',
//   icon: 'http://demo.com/icon.png',
//   icon: <Icon type="setting" />,
const getIcon = icon => {
  if (typeof icon === 'string' && icon.indexOf('http') === 0) {
    console.log(icon);
    return <img src={icon} alt="icon" className={styles.icon} />;
  }
  if (typeof icon === 'string') {
    // return <Icon type={icon} />;
    if(icon == 'dashboard'){
      return <DashboardOutlined />
    }else if(icon == 'shop'){
      return <ShopOutlined />
    }else if(icon == 'car'){
      return <CarOutlined />
    }else if(icon == 'user'){
      return <UserOutlined />
    }else if(icon == 'global'){
      return <GlobalOutlined />
    }else if(icon == 'technician'){
      return <UserSwitchOutlined />
    }else if(icon == 'customer'){
      return <UsergroupAddOutlined />
    }else if(icon == 'ride'){
      return <HeartIcon />
    }
    // return _react.default.createElement(icon)
  }
  return icon;
};

export const getMenuMatches = (flatMenuKeys, path) =>
  flatMenuKeys.filter(item => {
    if (item) {
      return pathToRegexp(item).test(path);
    }
    return false;
  });

export default class BaseMenu extends PureComponent {
  constructor(props) {
    super(props);
    this.getSelectedMenuKeys = memoizeOne(this.getSelectedMenuKeys, isEqual);
    this.flatMenuKeys = this.getFlatMenuKeys(props.menuData);
  }

  /**
   * Recursively flatten the data
   * [{path:string},{path:string}] => {path,path2}
   * @param  menus
   */
  getFlatMenuKeys(menus) {
    let keys = [];
    menus.forEach(item => {
      if (item.children) {
        keys = keys.concat(this.getFlatMenuKeys(item.children));
      }
      keys.push(item.path);
    });
    return keys;
  }

  /**
   * 获得菜单子节点
   * @memberof SiderMenu
   */
  getNavMenuItems = (menusData, parent) => {
    if (!menusData) {
      return [];
    }
    return menusData
      .filter(item => item.name && !item.hideInMenu)
      .map(item => {
        // make dom
        const ItemDom = this.getSubMenuOrItem(item, parent);
        return this.checkPermissionItem(item.authority, ItemDom);
      })
      .filter(item => item);
  };

  // Get the currently selected menu
  getSelectedMenuKeys = pathname =>
    urlToList(pathname).map(itemPath => getMenuMatches(this.flatMenuKeys, itemPath).pop());

  /**
   * get SubMenu or Item
   */
  getSubMenuOrItem = item => {
    // doc: add hideChildrenInMenu
    if (item.children && !item.hideChildrenInMenu && item.children.some(child => child.name)) {
      const { name } = item;
      return (
        <SubMenu
          title={
            item.icon ? (
              <span>
                {getIcon(item.icon)}
                <span>{name}</span>
              </span>
            ) : (
              name
            )
          }
          key={item.path}
        >
          {this.getNavMenuItems(item.children)}
        </SubMenu>
      );
    }
    return <Menu.Item key={item.path}>{this.getMenuItemPath(item)}</Menu.Item>;
  };

  /**
   * 判断是否是http链接.返回 Link 或 a
   * Judge whether it is http link.return a or Link
   * @memberof SiderMenu
   */
  getMenuItemPath = item => {
    const { name } = item;
    const itemPath = this.conversionPath(item.path);
    const icon = getIcon(item.icon);
    const { target } = item;
    // Is it a http link
    if (/^https?:\/\//.test(itemPath)) {
      return (
        <a href={itemPath} target={target}>
          {icon}
          <span>{name}</span>
        </a>
      );
    }
    const { location, isMobile, onCollapse } = this.props;
    return (
      <Link
        to={itemPath}
        target={target}
        replace={itemPath === location.pathname}
        onClick={
          isMobile
            ? () => {
                onCollapse(true);
              }
            : undefined
        }
      >
        {icon}
        <span>{name}</span>
      </Link>
    );
  };

  // permission to check
  checkPermissionItem = (authority, ItemDom) => {
    const { Authorized } = this.props;
    if (Authorized && Authorized.check) {
      const { check } = Authorized;
      return check(authority, ItemDom);
    }
    return ItemDom;
  };

  conversionPath = path => {
    if (path && path.indexOf('http') === 0) {
      return path;
    }
    return `/${path || ''}`.replace(/\/+/g, '/');
  };

  handleMenuClick = (e, l) => {
    //this.props.dispatch({type: "user/updateRoute", url: e.key});
  }

  render() {
    const {
      openKeys,
      theme,
      mode,
      location: { pathname },
      isUserFetched
    } = this.props;
    // if pathname can't match, use the nearest parent's key
    let selectedKeys = this.getSelectedMenuKeys(pathname);
    if (!selectedKeys.length && openKeys) {
      selectedKeys = [openKeys[openKeys.length - 1]];
    }
    let props = {};
    if (openKeys) {
      props = {
        openKeys,
      };
    }
    const { handleOpenChange, style, menuData } = this.props;
    return (
      isUserFetched &&
      <Menu
        key="Menu"
        mode={mode}
        theme={theme}
        onOpenChange={handleOpenChange}
        selectedKeys={selectedKeys}
        style={style}
        onClick={this.handleMenuClick}
        className={mode === 'horizontal' ? 'top-nav-menu' : ''}
        {...props}
      >
        {this.getNavMenuItems(menuData)}
      </Menu>
    );
  }
}
