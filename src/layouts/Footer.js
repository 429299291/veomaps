import React, { Fragment } from "react";
import { Layout, Icon } from "antd";
import GlobalFooter from "@/components/GlobalFooter";
import {CopyrightOutlined} from '@ant-design/icons';

const { Footer } = Layout;
const FooterView = () => (
  <Footer style={{ padding: 0 }}>
    <GlobalFooter
      links={[
        {
          key: "VeoRide MainPage",
          title: "VeoRide MainPage",
          href: "https://www.veoride.com/",
          blankTarget: true
        }
      ]}
      copyright={
        <Fragment>
          Copyright <CopyrightOutlined />
          brought to you by VeoRide 
        </Fragment>
      }
    />
  </Footer>
);
export default FooterView;
