import React, { Component } from 'react';
import { Chart, Axis, Tooltip, Geom } from 'bizcharts';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import autoHeight from '../autoHeight';
import styles from '../index.less';
import DataSet from "@antv/data-set";

@autoHeight()
class Bar extends Component {
  state = {
    autoHideXLabels: false,
  };

  componentDidMount() {
    window.addEventListener('resize', this.resize, { passive: true });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  handleRoot = n => {
    this.root = n;
  };

  handleRef = n => {
    this.node = n;
  };


  isStackChartData = data => (data.length > 0) && (typeof data[0].y === 'object');

  handleData = data => {

    if (!data) {
      return null;
    }

    let result = data;

    if (this.isStackChartData(data)) {

      result = {}

      const fields = []

      const finalResult = [];

      data.map(item => {
        if (item.y && Object.keys(item.y).length > 1) {
          delete item.y['all'];
        }
        fields.push(item.x);

      });

      data.map(item => {
        Object.keys(item.y).map(key => {

          if (!result[key]) {
            result[key] = {};
            result[key].name = key;
          } 

          result[key][item.x] = Math.round(item.y[key] * 100) / 100 ;

        }) 
       
      });

      const ds = new DataSet();
      const dv = ds.createView().source(Object.values(result));
      dv.transform({
        type: "fold",
        fields: fields,
        key: "x",
        value: "y" 
      });
      
      return dv;

    } 

    return result;
  }

  @Bind()
  @Debounce(400)
  resize() {
    if (!this.node) {
      return;
    }
    const canvasWidth = this.node.parentNode.clientWidth;
    const { data = [], autoLabel = true } = this.props;
    if (!autoLabel) {
      return;
    }
    const minWidth = data.length * 30;
    const { autoHideXLabels } = this.state;

    if (canvasWidth <= minWidth) {
      if (!autoHideXLabels) {
        this.setState({
          autoHideXLabels: true,
        });
      }
    } else if (autoHideXLabels) {
      this.setState({
        autoHideXLabels: false,
      });
    }
  }

  render() {
    const {
      height,
      title,
      forceFit = true,
      data,
      color = 'rgba(24, 144, 255, 0.85)',
      padding,
    } = this.props;

    const { autoHideXLabels } = this.state;

    const scale = {
      x: {
        type: 'cat',
      },
      y: {
        min: 0,
      },
    };

    const isStackData = this.isStackChartData(data);

    const tooltip = [
      'x*y',
      (x, y) => ({
        name: x,
        value: y,
      }),
    ];

    return (
      <div className={styles.chart} style={{ height }} ref={this.handleRoot}>
        <div ref={this.handleRef}>
          {title && <h4 style={{ marginBottom: 20 }}>{title}</h4>}
          <Chart
            scale={scale}
            height={title ? height - 41 : height}
            forceFit={forceFit}
            data={this.handleData(data)}
            padding={padding || 'auto'}
          >
            <Axis
              name="x"
              title={false}
              label={autoHideXLabels ? false : {}}
              tickLine={autoHideXLabels ? false : {}}
            />
            <Axis name="y" min={0} /> 
            <Tooltip showTitle={isStackData} crosshairs={false} />
            <Geom type={isStackData ? "intervalStack" : "interval"} position="x*y" color={isStackData ? 'name' : color} tooltip={isStackData ? undefined : tooltip} />
          </Chart>
        </div>
      </div>
    );
  }
}

export default Bar;
