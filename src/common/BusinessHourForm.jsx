import React, { PureComponent } from "react";
import moment from "moment";
import {
    Row,
    Col,
    TimePicker,
    Select,
    Switch,
    Tooltip
} from "antd";
import TextArea from "antd/lib/input/TextArea";

class BusinessHourForm extends PureComponent {

 
   onTimezoneChange = timeRange => { 
     this.triggerChange({timeRange});
   }
 
   triggerChange = changedValue => {
     const { onChange, value } = this.props;
     if (onChange) {

       onChange({
         ...value,
         ...changedValue,
       });
     }
   };
 
   getTimePicker = (field) => {
       const {value} = this.props;
 
       return <TimePicker  
                 defaultValue={value[field] ?  moment(value[field], "HH:mm") : undefined}
                 placeholder={field}
                 disabled={value.isOpen !== null}
                 key={field}
                 onChange={
                  
                   val =>  {
 
                     const newFeildVal = {};                     
 
                     newFeildVal[field] = val ? val.format("HH:mm") : null;
 
                     this.triggerChange(newFeildVal);
                   }
                 }
                 format="HH:mm" 
               />
   }
 
 
   render = () => {
 
     const {value, onChange} = this.props;
     
     return <div>
                <Row> 
                  
                      <Col span={6}> 
                         is Open Now: 
                     </Col> 

                     <Col span={18}> 

                       <Select defaultValue={value.isOpen} onChange={val => this.triggerChange({isOpen: val})} style={{width: "100%"}}>
                          <Select.Option key={1} value={true}> True </Select.Option>
                          <Select.Option key={2} value={false}> False </Select.Option>
                          <Select.Option key={3} value={null}> Curfew </Select.Option>
                        </Select>

                     </Col>

                </Row>
               
               <Row> 
                     <Col span={6}> 
                         Weekday: 
                     </Col> 
                     <Col span={18}> 
                     {this.getTimePicker("weekdayStart")}
                     <span style={{margin: "0 1em 0 1em"}}> ~ </span>
                     {this.getTimePicker("weekdayEnd")}
                     </Col>  
                   
                                          
               </Row>
 
               <Row>
                     <Col span={6}> 
                         Weekend: 
                     </Col> 
                     <Col span={18}> 
                     {this.getTimePicker("weekendStart")}
                     <span style={{margin: "0 1em 0 1em"}}> ~ </span>
                     {this.getTimePicker("weekendEnd")}
                     </Col>  
                 
               </Row>
 
   
 
               <Row> 
               <Col span={6}> Time Zone: </Col>
               <Col span={12}> 
                   <Select disabled={value.isOpen !== null} defaultValue={value.timeZone ? value.timeZone : undefined} onChange={val => this.triggerChange({timeZone: val})} style={{width: "100%"}}>
                     <Select.Option key={1} value="US/Pacific"> Pacific Standard Time </Select.Option>
                     <Select.Option key={2}  value="US/Mountain"> Mountain Standard Time </Select.Option>
                     <Select.Option key={3} value="US/Central"> Central Standard Time </Select.Option>
                     <Select.Option key={4} value="US/Eastern"> Eastern Standard Time </Select.Option>
                   </Select>
 
               </Col>  

               
 
 
               </Row>

                <Row>
                <Col span={6}> 
                  <Tooltip title="This will be displayed on customer app.">Description* : </Tooltip>
                </Col> 
                <Col span={18}> 
                    <TextArea  
                    defaultValue={value.description}
                    placeholder={"bussiness hour description"}
                    onChange={                      
                      event =>  {
                        this.triggerChange( {description: event.target.value});
                      }
                    }
                  
                  />
                </Col> 

              </Row>
             </div>
   }
} 


 export default BusinessHourForm;