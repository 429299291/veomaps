import { Input, Tooltip } from 'antd';



export default class NumericInput extends React.Component {
  onChange = e => {
    const { value } = e.target;
    const reg = /[0-9]*/;
    if (value === null || (!isNaN(value) && reg.test(value))) {
      this.props.onChange(value);
    }
  };



  render() {
    const { value } = this.props;
    const title = value ? (
      <span className="numeric-input-title">{value}</span>
    ) : (
      'Input a number'
    );
    return (
      <Tooltip
        trigger={['focus']}
        title={title}
        placement="topLeft"
        overlayClassName="numeric-input"
      >
        <Input
          {...this.props}
          onChange={this.onChange}
          placeholder="Input a number"
          maxLength={25}
        />
      </Tooltip>
    );
  }
}