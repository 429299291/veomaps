import { Tag, Input, Tooltip,Col, Row,Switch } from 'antd';
import { LogoutOutlined, PlusOutlined } from '@ant-design/icons';
import styles from "./regulation.less";
class regulation extends React.Component {
  state = {
    tags:this.props.data.regulations,
    displayDuringOnBoarding:this.props.data.displayDuringOnBoarding,
    inputVisible: false,
    // inputValue: '',
    inputValue: {
    },
    // content:'11',
    editInputIndex: -1,
    editInputValue: {},
    // editContentValue: '',
    
  };
  // componentDidUpdate(){
  //   this.state.tags = this.props.tags
  // }
  handleClose = async removedTag  => {
    const tags = this.state.tags.filter(tag => tag !== removedTag);
    await this.setState({ tags });
    await this.props.getRegulationDatas({
      regulations:this.state.tags,
      displayDuringOnBoarding:this.state.displayDuringOnBoarding
    })
  };

  showInput = () => {
    this.setState({ inputVisible: true }
      // , () => this.input.focus()
      );
  };
  componentWillReceiveProps(nextProps) {

    // const newTags = nextProps.data.regulations
    this.setState({
     tags: nextProps.data.regulations,
     displayDuringOnBoarding:nextProps.data.displayDuringOnBoarding
    });
   }
  handleInputChange = e => {
    this.setState({ inputValue: {...this.state.inputValue,title:e.target.value }});
  };

  handleContentChange = e => {
    this.setState({ inputValue: {...this.state.inputValue,content:e.target.value } });
  };
  handlePositionChange = e => {
    this.setState({ inputValue: {...this.state.inputValue,position:e.target.value?parseInt(e.target.value):'' } });

  };
  handleInputConfirm = async() => {
    const { inputValue } = this.state;
    let { tags } = this.state;
    // if(inputValue.title== '' ||inputValue.content == ''){
    //   return false
    // }
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
    }
    await this.setState({
      tags,
      inputVisible: false,
      inputValue: {
        title:'',
        content:'',
        position:null
      },
    });
    await this.props.getRegulationDatas({
      regulations:this.state.tags,
      displayDuringOnBoarding:this.state.displayDuringOnBoarding
    })
  };

  handleEditInputChange = e => {
    this.setState({ editInputValue:{...this.state.editInputValue,title:e.target.value }});
  };
  handleEditContentChange = e => {
    this.setState({ editInputValue: {...this.state.editInputValue,content:e.target.value } });
  };
  handleEditPositionChange = e => {
    this.setState({ editInputValue: {...this.state.editInputValue,position:e.target.value } });
  };

  handleEditInputConfirm = async() => {
    await this.setState(({ tags, editInputIndex, editInputValue,editContentValue }) => {
      const newTags = [...tags];
      newTags[editInputIndex] = editInputValue;

      return {
        tags: newTags,
        editInputIndex: -1,
        editInputValue: {
          title:'',
          content:'',
          position:''
        },
        editContentValue:''
      };
    });
    // this.props.getRegulationDatas(this.state.tags)
    await this.props.getRegulationDatas({
      regulations:this.state.tags,
      displayDuringOnBoarding:this.state.displayDuringOnBoarding
    })
  };

  saveInputRef = input => {
    this.input = input;
  };
  saveContentRef = input => {
    this.input = input;
  };
  savePositionRef = input => {
    this.input = input;
  };
  saveEditInputRef = input => {
    this.editInput = input;
  };
  onChangeSwitch = (value)=>{
    this.setState({
      displayDuringOnBoarding:value
    })
  }
  render() {
    const {tags, inputVisible, inputValue, editInputIndex, editInputValue ,content,editContentValue} = this.state;
    // this.props.getRegulationDatas({
    //   regulations:this.state.tags,
    //   displayDuringOnBoarding:this.state.displayDuringOnBoarding
    // })
    return (
      <>
        {tags.map((tag, index) => {
          if (editInputIndex === index) {
            return (
              <>
                <Input
                  ref={this.saveEditInputRef}
                  key={index}
                  size="small"
                  className="tag-input"
                  style={{ width: 40 }}
                  value={inputValue.title}
                  // onChange={this.handleEditInputChange}
                  // onBlur={this.handleEditInputConfirm}
                  // onPressEnter={this.handleEditInputConfirm}
                />
                <Input  placeholder="content" type="text"
                size="small" value={inputValue.content}
                key={tag.content}
                style={{ width: 60 }}
                // onChange={this.handleEditContentChange}  
                // onBlur={this.handleEditInputConfirm} 
                // onPressEnter={this.handleEditInputConfirm}
                ></Input>
              </>
            );
          }
          const isLongTag = tag.length > 20;
          const tagElem = (
            
            <Col span={24} key={tag.content}>
            {tag.position}st:
            <Tag
              className="edit-tag"
              key={tag.title}
              style={{width:'100%'}}
              closable={index !== -1}
              color="processing"
              onClose={() => this.handleClose(tag)}
            >
              <span
              className={styles.regulationSpan}
                // onDoubleClick={e => {
                //   if (index !== 0) {
                //     this.setState({ editInputIndex: index, editInputValue: tag.title }, () => {
                //       this.editInput.focus();
                //     });
                //     e.preventDefault();
                //   }
                // }}
              >
                {isLongTag ? `${tag.slice(0, 20)}...` :'title:' + tag.title}<br></br>
                {isLongTag ? `${tag.slice(0, 20)}...` :'content:' + tag.content}
              </span>
            </Tag>
            </Col>
          
          );
          return isLongTag ? (
            <Tooltip title={tag} key={tag.title}>
              {tagElem}
            </Tooltip>
          ) : (
            tagElem
          );
        })}
        {inputVisible && (
          <>
          <Col span={2}>
            <Input  placeholder="index" type="text"
            ref={this.savePositionRef}
              size="small" value={inputValue.position}
              onChange={this.handlePositionChange}
              // onBlur={this.handleInputConfirm} 
              // onPressEnter={this.handleInputConfirm}
              ></Input>
          </Col>
          <Col span={10}>
          <Input
            ref={this.saveInputRef}
            type="text"
            size="small"
            className="tag-input"
            placeholder="title"
            value={inputValue.title}
            onChange={this.handleInputChange}
            // onBlur={this.handleInputConfirm}
            // onPressEnter={this.handleInputConfirm}
          />
          </Col>
          <Col span={12}>
          <Input  placeholder="content" type="text"
          ref={this.saveContentRef}
            size="small" value={inputValue.content}
            onChange={this.handleContentChange}  
            onBlur={this.handleInputConfirm} 
            onPressEnter={this.handleInputConfirm}></Input>
            </Col>
          </>
        )}
        {!inputVisible && (
          // <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} span={24}>
          <>
            <Col span={12}>
              <Tag className="site-tag-plus" onClick={this.showInput}>
                {/* New Tag */}
                <PlusOutlined />
              </Tag>
            </Col>
            <Col span={12}>
            regulation switch:
              <Switch size="small" defaultChecked={this.state.displayDuringOnBoarding} onChange={this.onChangeSwitch}/>
            </Col>
            </>
          // </Row>
        )}
      </>
    );
  }
}
export default regulation;
