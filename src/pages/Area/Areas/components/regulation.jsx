import { Tag, Input, Tooltip,Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

class regulation extends React.Component {
  state = {
    tags:this.props.tags,
    inputVisible: false,
    // inputValue: '',
    inputValue: {
    },
    // content:'11',
    editInputIndex: -1,
    editInputValue: '',
    // editContentValue: '',
    
  };
  handleClose = removedTag => {
    const tags = this.state.tags.filter(tag => tag !== removedTag);
    this.setState({ tags });
  };

  showInput = () => {
    this.setState({ inputVisible: true }
      // , () => this.input.focus()
      );
  };

  handleInputChange = e => {
    this.setState({ inputValue: {...this.state.inputValue,title:e.target.value }});
  };

  handleContentChange = e => {
    this.setState({ inputValue: {...this.state.inputValue,content:e.target.value } });
  };
  handlePositionChange = e => {
    this.setState({ inputValue: {...this.state.inputValue,position:parseInt(e.target.value) } });
  };
  handleInputConfirm = () => {
    const { inputValue } = this.state;
    let { tags } = this.state;
    // if(inputValue.title== '' ||inputValue.content == ''){
    //   return false
    // }
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
    }
    this.setState({
      tags,
      inputVisible: false,
      inputValue: {
        title:'',
        content:'',
        position:null
      },
    });
  };

  handleEditInputChange = e => {
    this.setState({ editInputValue: e.target.value });
  };
  handleEditContentChange = e => {
    this.setState({ editContentValue: e.target.value });
  };

  handleEditInputConfirm = () => {
    this.setState(({ tags, editInputIndex, editInputValue,editContentValue }) => {
      const newTags = [...tags];
      newTags[editInputIndex] = editInputValue;

      return {
        tags: newTags,
        editInputIndex: -1,
        editInputValue: {
          title:'',
          content:''
        },
        editContentValue:''
      };
    });
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

  render() {
    const {tags, inputVisible, inputValue, editInputIndex, editInputValue ,content,editContentValue} = this.state;
    this.props.getRegulationDatas(tags)
    console.log(tags);
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
              closable={index !== 0}
              color="processing"
              onClose={() => this.handleClose(tag)}
            >
              <span
              style={{padding:'0 2px'}}
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
          <Tag className="site-tag-plus" onClick={this.showInput}>
            {/* New Tag */}
            <PlusOutlined />
          </Tag>
        )}
      </>
    );
  }
}
export default regulation;
