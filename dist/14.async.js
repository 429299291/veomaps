(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[14],{C3UP:function(e,t,a){"use strict";var l=a("TqRt"),r=a("284h");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var d=l(a("pVnL")),n=l(a("MVZn")),u=l(a("lwsE")),i=l(a("W8MJ")),s=l(a("a1gu")),o=l(a("Nsbk")),c=l(a("7W2i"));a("2qtc");var f=l(a("kLXV"));a("+L6B");var m=l(a("2/Rp"));a("IzEo");var p=l(a("bx4M"));a("14J3");var E=l(a("BMrR"));a("g9YV");var b=l(a("wCAj"));a("jCWc");var h=l(a("kPKH"));a("OaEy");var C=l(a("2fM7"));a("5NDa");var g=l(a("5rEg"));a("y8nQ");var v=l(a("Vl3Y"));a("iQDF");var N,I,S,y=l(a("+eQT")),D=r(a("q1tI")),x=a("MuoO"),O=l(a("wd/R")),w=l(a("CkN6")),P=l(a("zHco")),M=l(a("Dkzg")),V=(y.default.RangePicker,v.default.Item),Y=g.default.TextArea,F=C.default.Option,R={PENDING:["APPROVED","DENIED","CANCEL","PENDING"],APPROVED:["SHIPPING","CANCEL","APPROVED"],SHIPPING:["SHIPPED","SHIPPING"],RETURNED:null,CANCEL:null,DENIED:null},U=[{title:"Description",dataIndex:"description"},{title:"Name",dataIndex:"name"},{title:"Unit Price",dataIndex:"price"},{title:"Type",dataIndex:"type"},{title:"Quantity",dataIndex:"quantity"}],k=[{title:"From",dataIndex:"oldValue"},{title:"To",dataIndex:"newValue"},{title:"Note",dataIndex:"note"},{title:"By",dataIndex:"operator"},{title:"Created",dataIndex:"created",render:function(e){return D.default.createElement("span",null,(0,O.default)(e).format("YYYY-MM-DD HH:mm:ss"))}}],L=v.default.create()(function(e){var t=e.form,a=e.modalVisible,l=e.handleUpdate,r=e.handleModalVisible,d=e.currentUser,n=e.record,u=function(){t.isFieldsTouched()?t.validateFields(function(e,a){e||(a.operator=d.basic.email,t.resetFields(),l(n.id,a))}):r()},i=!t.getFieldValue("status")||t.getFieldValue("status")===n.orderStatus;return D.default.createElement(f.default,{destroyOnClose:!0,title:"Detail",visible:a,onOk:function(){return r()},width:"95%",onCancel:function(){return r()}},D.default.createElement(p.default,{title:"Order",style:{marginTop:"2em"}},D.default.createElement(E.default,null,D.default.createElement(h.default,{span:8},D.default.createElement(V,{labelCol:{span:8},wrapperCol:{span:16},label:"Order Number"},D.default.createElement("div",null," ",n.orderNumber," ")),D.default.createElement(V,{labelCol:{span:8},wrapperCol:{span:16},label:"Name"},D.default.createElement("div",null," ",n.firstName+" "+n.lastName," ")),D.default.createElement(V,{labelCol:{span:8},wrapperCol:{span:16},label:"Address"},D.default.createElement("div",null," ",n.streetAddress+" "+n.unit+","+n.city+","+n.state+","+n.zipCode," ")),D.default.createElement(V,{labelCol:{span:8},wrapperCol:{span:16},label:"Email"},D.default.createElement("div",null," ",n.email," ")),D.default.createElement(V,{labelCol:{span:8},wrapperCol:{span:16},label:"Phone"},D.default.createElement("div",null," ",n.phoneNumber," ")),D.default.createElement(V,{labelCol:{span:8},wrapperCol:{span:16},label:"Tax Rate"},D.default.createElement("div",null," ",n.taxRate," ")),D.default.createElement(V,{labelCol:{span:8},wrapperCol:{span:16},label:"estimated Tax"},D.default.createElement("div",null," ",n.estimatedTax," ")),D.default.createElement(V,{labelCol:{span:8},wrapperCol:{span:16},label:"Total Price"},D.default.createElement("div",null," ",n.totalPrice," "))),D.default.createElement(h.default,{span:16},D.default.createElement("div",{style:{marginBottom:"2em"}}," Order Items: "),D.default.createElement(b.default,{dataSource:n.orderItems,columns:U,size:"small",scroll:{x:500},pagination:!1}),D.default.createElement("div",{style:{marginBottom:"2em"}}," Update Events: "),D.default.createElement(b.default,{dataSource:n.orderUpdateEvents,columns:k,size:"small",scroll:{x:500},pagination:!1})))),D.default.createElement(p.default,{title:"Review",style:{marginTop:"2em"}},D.default.createElement(V,{labelCol:{span:3},wrapperCol:{span:7},label:"Status"},R[n.orderStatus]?t.getFieldDecorator("status",{initialValue:n.orderStatus})(D.default.createElement(C.default,{placeholder:"select",style:{width:"100%"}},R[n.orderStatus].map(function(e,t){return D.default.createElement(F,{key:t,value:e},e)}))):D.default.createElement("div",null," ",n.orderStatus," ")),D.default.createElement(V,{labelCol:{span:3},wrapperCol:{span:7},label:"Note"},t.getFieldDecorator("note",{initialValue:n.message})(D.default.createElement(Y,{placeholder:"Please Input"}))),d&&d.basic&&D.default.createElement(V,{labelCol:{span:3},wrapperCol:{span:7},label:"Reviewer"},d.basic.email),D.default.createElement(V,{labelCol:{span:3},wrapperCol:{span:7}},D.default.createElement(E.default,null,D.default.createElement(h.default,{span:4},D.default.createElement(m.default,{onClick:u,type:"primary",disabled:i},"Update")),D.default.createElement(h.default,{span:4})))))}),T=(N=(0,x.connect)(function(e){var t=e.order,a=e.loading,l=e.user;return{order:t,currentUser:l.currentUser,loading:a.models.order}}),I=v.default.create(),N(S=I(S=function(e){function t(){var e,a;(0,u.default)(this,t);for(var l=arguments.length,r=new Array(l),d=0;d<l;d++)r[d]=arguments[d];return a=(0,s.default)(this,(e=(0,o.default)(t)).call.apply(e,[this].concat(r))),a.state={updateModalVisible:!1,filterCriteria:{},selectedRecord:{}},a.columns=[{title:"Order Number",dataIndex:"orderNumber"},{title:"First Name",dataIndex:"firstName"},{title:"Last Name",dataIndex:"lastName"},{title:"City",dataIndex:"city"},{title:"State",dataIndex:"state"},{title:"Status",dataIndex:"orderStatus"},{title:"Created",dataIndex:"created",render:function(e){return D.default.createElement("span",null,(0,O.default)(e).format("YYYY-MM-DD HH:mm:ss"))}},{title:"Operation",render:function(e,t){return D.default.createElement("div",null,D.default.createElement("a",{onClick:function(){return a.handleUpdateModalVisible(!0,t)}},"Detail"))}}],a.getOrders=function(){var e=a.props.dispatch,t=a.state.filterCriteria;e({type:"order/get",query:t})},a.handleUpdateModalVisible=function(e,t){a.setState({updateModalVisible:!!e,selectedRecord:t||{}})},a.handleUpdate=function(e,t){var l=a.props.dispatch;l({type:"order/update",payload:t,id:e,onSuccess:a.getOrders}),a.handleUpdateModalVisible()},a.handleSearch=function(e){e&&e.preventDefault();var t=a.props.form,l=a.state.filterCriteria;t.validateFields(function(e,t){if(!e){if(t.created&&(t.start=(0,O.default)(t.created[0]).utcOffset(0).format("YYYY-MM-DD HH:mm:ss"),t.end=(0,O.default)(t.created[1]).utcOffset(0).format("YYYY-MM-DD-YYYY HH:mm:ss"),t.created=void 0),t.name){var r=t.name.split(" ");2==r.length?(t.firstName=r[0],t.lastName=r[1]):t.firstName=t.name}var d=Object.assign({},l,t,{pageNumber:1,pageSize:10});a.setState({filterCriteria:d},function(){return a.getOrders()})}})},a.handleFormReset=function(){var e=a.props,t=e.form,l=(e.dispatch,a.state.filterCriteria);t.resetFields();var r={currentPage:1,pageSize:l.pageSize};a.setState({filterCriteria:r},function(){return a.handleSearch()})},a.handleStandardTableChange=function(e,t,l){a.props.dispatch;var r=a.state.filterCriteria,d=(0,n.default)({},r);d.pageNumber=e.current,d.pageSize=e.pageSize,l.field&&(d.sorter="".concat(l.field,"_").concat(l.order)),a.setState({filterCriteria:d},function(){return a.getOrders()})},a}return(0,c.default)(t,e),(0,i.default)(t,[{key:"componentDidMount",value:function(){this.getOrders()}},{key:"componentDidUpdate",value:function(e,t,a){e.selectedAreaId!==this.props.selectedAreaId&&this.getOrders()}},{key:"renderSimpleForm",value:function(){var e=this.props,t=e.form.getFieldDecorator,a=e.order;return D.default.createElement(v.default,{onSubmit:this.handleSearch,layout:"inline"},D.default.createElement(E.default,{gutter:{md:8,lg:24,xl:48}},D.default.createElement(h.default,{md:8,sm:24},D.default.createElement(V,{label:"Order Number",labelCol:{span:9},wrapperCol:{span:15}},t("orderNumber")(D.default.createElement(g.default,{placeholder:"Order Number"})))),D.default.createElement(h.default,{md:8,sm:12},D.default.createElement(V,{label:"Name"},t("name")(D.default.createElement(g.default,{placeholder:"Name"}))))),D.default.createElement(E.default,{gutter:{md:8,lg:24,xl:48}},D.default.createElement(h.default,{md:8,sm:24},D.default.createElement("span",{className:M.default.submitButtons},D.default.createElement(m.default,{type:"primary",htmlType:"submit"},"Search"),D.default.createElement(m.default,{style:{marginLeft:8},onClick:this.handleFormReset},"Reset")))),D.default.createElement(E.default,{gutter:{md:8,lg:24,xl:48}},D.default.createElement(h.default,{md:8,sm:24},D.default.createElement("span",null,"Total: ",a.total))))}},{key:"render",value:function(){var e=this.props,t=e.order,a=e.loading,l=e.currentUser,r=this.state,n=r.updateModalVisible,u=r.selectedRecord,i=r.filterCriteria,s={defaultCurrent:1,current:i.pageNumber,pageSize:i.pageSize,total:t.total},o={handleModalVisible:this.handleUpdateModalVisible,handleUpdate:this.handleUpdate};return D.default.createElement(P.default,{title:"Order List"},D.default.createElement(p.default,{bordered:!1},D.default.createElement("div",{className:M.default.tableList},D.default.createElement("div",{className:M.default.tableListForm},this.renderSimpleForm()),D.default.createElement("div",{className:M.default.tableListOperator}),D.default.createElement(w.default,{loading:a,data:{list:t.data,pagination:s},columns:this.columns,onChange:this.handleStandardTableChange}))),D.default.createElement(L,(0,d.default)({},o,{modalVisible:n,currentUser:l,record:u})))}}]),t}(D.PureComponent))||S)||S),z=T;t.default=z},Dkzg:function(e,t,a){e.exports={tableList:"antd-pro\\pages\\-shop\\-order-tableList",tableListOperator:"antd-pro\\pages\\-shop\\-order-tableListOperator",tableListForm:"antd-pro\\pages\\-shop\\-order-tableListForm",submitButtons:"antd-pro\\pages\\-shop\\-order-submitButtons"}}}]);