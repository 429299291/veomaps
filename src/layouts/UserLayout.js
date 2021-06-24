import React, { Fragment } from "react";
import { formatMessage } from "umi/locale";
import Link from "umi/link";
import { Icon } from "antd";
import GlobalFooter from "@/components/GlobalFooter";
import SelectLang from "@/components/SelectLang";
import styles from "./UserLayout.less";
import logo from "../assets/veo_black.png";

const links = [
  {
    key: "help",
    title: formatMessage({ id: "layout.user.link.help" }),
    href: ""
  },
  {
    key: "privacy",
    title: formatMessage({ id: "layout.user.link.privacy" }),
    href: ""
  },
  {
    key: "terms",
    title: formatMessage({ id: "layout.user.link.terms" }),
    href: ""
  }
];

const copyright = (
  <Fragment>
    Copyright <Icon type="copyright" /> brought to you by VeoRide 2018
  </Fragment>
);

class UserLayout extends React.PureComponent {
  render() {
    const { children } = this.props;
    console.log(children);
    return (
      // @TODO <DocumentTitle title={this.getPageTitle()}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <img alt="logo" className={styles.logo} src={logo} />
               
              </Link>
            </div>
            <div className={styles.desc}>Management System</div>
          </div>
          {children}
        </div>
        <GlobalFooter links={links} copyright={copyright} />
      </div>
    );
  }
}

export default UserLayout;
