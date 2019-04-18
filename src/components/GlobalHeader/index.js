import React, { PureComponent } from 'react';
import { Icon, Select } from 'antd';
import Link from 'umi/link';
import Debounce from 'lodash-decorators/debounce';
import styles from './index.less';
import RightContent from './RightContent';

const Option = Select.Option;

export default class GlobalHeader extends PureComponent {
  componentWillUnmount() {
    this.triggerResizeEvent.cancel();
  }
  /* eslint-disable*/
  @Debounce(600)
  triggerResizeEvent() {
    // eslint-disable-line
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }
  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);
    this.triggerResizeEvent();
  };

  handleAreaSelect = value => {
    const { dispatch } = this.props;


    dispatch({
      type: 'areas/selectArea',
      areaId: value === "all" ? null : value,
    });
  }

  render() {
    const { collapsed, isMobile, logo, areas } = this.props;


    return (
      <div className={styles.header}>
        {isMobile && (
          <Link to="/" className={styles.logo} key="logo">
            <img src={logo} alt="logo" width="32" />
          </Link>
        )}
        <Icon
          className={styles.trigger}
          type={collapsed ? 'menu-unfold' : 'menu-fold'}
          onClick={this.toggle}
        />
        {areas && areas.length > 0 &&
          <span style={{padding: "12px 24px", fontSize: "15px"}}>
            <span>Area: </span>
            <Select
              onChange={this.handleAreaSelect}
              className="area-select"
              style={{ width: 150, marginLeft: "1em" }}
              defaultValue={"all"}
            >
              <Option value="all">All</Option>
              {areas.map(area =>
                <Option  value={area.id} key={area.id}>
                  {area.name}
                </Option>)}
            </Select>
          </span>}

        <RightContent {...this.props} />
      </div>
    );
  }
}
