(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[14],{"4b56":function(e,t,a){e.exports={tableList:"antd-pro-pages-vehicle-ride-tableList",tableListOperator:"antd-pro-pages-vehicle-ride-tableListOperator",tableListForm:"antd-pro-pages-vehicle-ride-tableListForm",submitButtons:"antd-pro-pages-vehicle-ride-submitButtons"}},BcOJ:function(e,t,a){"use strict";var l=a("TqRt"),n=a("284h");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=l(a("pVnL"));a("IzEo");var i=l(a("bx4M"));a("+L6B");var d=l(a("2/Rp"));a("14J3");var o=l(a("BMrR"));a("jCWc");var s=l(a("kPKH")),c=l(a("MVZn"));a("/zsF");var u=l(a("PArb")),f=l(a("lwsE")),m=l(a("W8MJ")),p=l(a("a1gu")),h=l(a("Nsbk")),E=l(a("7W2i"));a("2qtc");var g=l(a("kLXV"));a("giR+");var y=l(a("fyUT"));a("7Kak");var v=l(a("9yH6"));a("OaEy");var b=l(a("2fM7"));a("5NDa");var M=l(a("5rEg"));a("FJo9");var k=l(a("L41K"));a("y8nQ");var R=l(a("Vl3Y"));a("iQDF");var C,D,I,V=l(a("+eQT")),S=n(a("q1tI")),Y=a("MuoO"),T=l(a("wd/R")),w=l(a("CkN6")),O=l(a("zHco")),H=l(a("itZA")),N=l(a("j+jj")),P=a("+n12"),x=a("+n12"),A=l(a("4b56")),F=a("eHHv"),L=a("PQp+"),z=a("34ay"),U=a("1pet"),W={id:"id",vehicleType:"vehicleType",imei:"imei",vehicleNumber:"vehicleNumber",minutes:"minutes",charge:"charge",lockMethod:"lockMethod",unlockMethod:"unlockMethod",start:"start",end:"end",area:"area",state:"state",areaId:"areaId",created:"created",vehicleId:"vehicleId",customerId:"customerId"},j=V.default.RangePicker,G=(0,z.getAuthority)(),B=function(e,t){var a=e>=0?$[e]:"black",l=t.limitType>=0?$[t.limitType]:"black",n=S.default.createElement("span",{style:{color:a}},"  ",e>=0?q[e]:"unknown"),r=S.default.createElement("span",{style:{color:l}}," ",1===t.vehicleType?" | "+X[t.limitType]:"");return S.default.createElement("span",null,n,r)},J=R.default.Item,K=(k.default.Step,M.default.TextArea,b.default.Option),Q=(v.default.Group,["USING","FINISHED"]),_=["Bicycle","Scooter","E-Bike","Car"],Z=["GPRS","BLUETOOTH","ADMIN","UNKNOWN"],q=["Normal","In restricted fence","out of geo fence","out of force parking zone","unknown"],X=["Normal","No Ride Zone","limit speed zone","unknown"],$=["black","#ff0000","#b72126","#1300ff","#f1fc64"],ee=R.default.create()(function(e){var t=e.isEndRideVisible,a=e.form,l=e.handleEndRide,n=e.handleEndRideVisible,r=e.ride,i=function(){a.validateFields(function(e,t){e||(a.resetFields(),l(r.id,t))})},d=Math.round((new Date-new Date(r.start))/6e4);return S.default.createElement(g.default,{destroyOnClose:!0,title:"End Ride",visible:t,onOk:i,onCancel:function(){return n(!1)}},S.default.createElement(J,{labelCol:{span:5},wrapperCol:{span:15},label:"Minutes"},a.getFieldDecorator("minutes",{initialValue:d})(S.default.createElement(y.default,{placeholder:"Please Input"}))))}),te=(0,F.compose)((0,F.withProps)({googleMapURL:"https://maps.googleapis.com/maps/api/js?key=AIzaSyDPnV_7djRAy8m_RuM5T0QIHU5R-07s3Ic&v=3.exp&libraries=geometry,drawing,places",loadingElement:S.default.createElement("div",{style:{height:"100%"}}),containerElement:S.default.createElement("div",{style:{height:"400px"}}),mapElement:S.default.createElement("div",{style:{height:"100%"}})}),L.withScriptjs,L.withGoogleMap)(function(e){var t=e.path,a=e.fences,l=t[Math.round(t.length/2)],n={path:window.google.maps.SymbolPath.CIRCLE,fillOpacity:1,scale:2};return S.default.createElement(L.GoogleMap,{defaultZoom:15,center:l},S.default.createElement(L.Marker,{position:t[0],label:"start"}),S.default.createElement(L.Marker,{position:t[t.length-1],label:"end"}),S.default.createElement(L.Polyline,{path:t,geodesic:!0,options:{strokeColor:"#ff0000",strokeOpacity:.75,strokeWeight:2}}),G.includes("get.fences")&&a&&a.map(function(e){return S.default.createElement(L.Polygon,{path:e.fenceCoordinates,geodesic:!0,key:e.id,options:{strokeColor:U.fenceTypeColor[e.fenceType],strokeOpacity:5===e.fenceType?0:.75,strokeWeight:5===e.fenceType?0:2,fillColor:U.fenceTypeColor[e.fenceType],fillOpacity:0===e.fenceType||5===e.fenceType?0:.35}})}),G.includes("get.fences")&&a&&a.filter(function(e){return 5===e.fenceType}).map(function(e){return S.default.createElement(L.Polyline,{path:e.fenceCoordinates,geodesic:!0,key:e.id,options:{strokeColor:U.fenceTypeColor[e.fenceType],strokeOpacity:.75,strokeWeight:2,icons:[{icon:n,offset:"0",repeat:"10px"}],fillColor:U.fenceTypeColor[5],fillOpacity:0}})}))}),ae=(C=(0,Y.connect)(function(e){var t=e.rides,a=e.areas,l=e.geo,n=e.loading;return{rides:t,areas:a.data,geo:l,selectedAreaId:a.selectedAreaId,areaNames:a.areaNames,loading:n.models.rides}}),D=R.default.create(),C(I=D(I=function(e){function t(){var e,a;(0,f.default)(this,t);for(var l=arguments.length,n=new Array(l),r=0;r<l;r++)n[r]=arguments[r];return a=(0,p.default)(this,(e=(0,h.default)(t)).call.apply(e,[this].concat(n))),a.state={isEndRideVisible:!1,filterCriteria:{currentPage:1,pageSize:10},selectedRecord:null},a.columns=[{title:"Phone",render:function(e,t){return S.default.createElement("a",{onClick:function(){return a.setState({selectedCustomerId:t.customerId},function(){return a.handleCustomerDetailModalVisible(!0)})}},(0,P.formatPhoneNumber)(t.phone+""))}},{title:"Vehicle Number",render:function(e,t){return S.default.createElement("a",{onClick:function(){return a.setState({selectedVehicleId:t.vehicleId},function(){return a.handleVehicleDetailModalVisible(!0)})}},t.vehicleNumber)}},{title:"Vehicle Type",dataIndex:"vehicleType",render:function(e){return S.default.createElement("span",null,_[e])}},{title:"Lock Way",dataIndex:"lockMethod",render:function(e){return S.default.createElement("span",null,Z[e])}},{title:"Charge",dataIndex:"charge"},{title:"Violate Type",dataIndex:"violateType",render:B},{title:"Unlock Way",dataIndex:"unlockMethod",render:function(e){return S.default.createElement("span",null,Z[e])}},{title:"Start",dataIndex:"start",sorter:!0,render:function(e){return S.default.createElement("span",null,(0,T.default)(e).format("YYYY-MM-DD HH:mm:ss"))}},{title:"End",dataIndex:"end",sorter:!0,render:function(e,t){var a=e?(0,T.default)(e).format("YYYY-MM-DD HH:mm:ss"):"not finished",l=t.metaData&&JSON.parse(t.metaData).adminEmail;return S.default.createElement("span",null,a+(l?"|"+l:""))}},{title:"Minutes",render:function(e,t){var a=(t.end?(0,T.default)(t.end):(0,T.default)()).diff((0,T.default)(t.start),"minutes");return S.default.createElement("span",null,a)}},{title:"operation",render:function(e,t){return S.default.createElement(S.Fragment,null,!t.end&&S.default.createElement("a",{onClick:function(){return a.handleEndRideVisible(!0,t)}},"End Ride"),!t.end&&S.default.createElement(u.default,{type:"vertical"}),S.default.createElement("a",{onClick:function(){return a.handleDetailModalVisible(!0,t)}},"Detail"))}}],a.handleGetRides=function(){var e=a.props.dispatch,t=a.state.filterCriteria;e({type:"rides/get",payload:t})},a.handleStandardTableChange=function(e,t,l){var n=a.props.dispatch,r=a.state.filterCriteria,i=(0,c.default)({},r);i.currentPage=e.current,i.pageSize=e.pageSize,l.field&&(i.sorter="".concat(l.field,"_").concat(l.order)),a.setState({filterCriteria:i}),n({type:"rides/get",payload:i})},a.handleFormReset=function(){var e=a.props,t=e.form,l=(e.dispatch,a.state.filterCriteria);t.resetFields();var n={currentPage:1,pageSize:l.pageSize};a.setState({filterCriteria:n},function(){return a.handleGetRides()})},a.handleSearch=function(e){"object"===typeof e&&e.preventDefault();var t=a.props,l=t.form,n=t.selectedAreaId,r=a.state.filterCriteria;l.validateFields(function(e,t){if(!e){t.timeRange&&(t.rideStart=(0,T.default)(t.timeRange[0]).utcOffset(0).format("MM-DD-YYYY HH:mm:ss"),t.rideEnd=(0,T.default)(t.timeRange[1]).utcOffset(0).format("MM-DD-YYYY HH:mm:ss"),t.timeRange=void 0);var l=Object.assign({},r,t,{currentPage:1,pageSize:10,areaId:n});a.setState({filterCriteria:l},function(){return a.handleGetRides()})}})},a.handleUpdateModalVisible=function(e,t){a.setState({updateModalVisible:!!e,selectedRecord:t||{}})},a.handleVehicleDetailModalVisible=function(e){return a.setState({vehicleDetailModalVisible:e})},a.handleCustomerDetailModalVisible=function(e){return a.setState({customerDetailModalVisible:e})},a.handleDetailModalVisible=function(e,t){var l=a.props.dispatch;a.state.filterCriteria;e?G.includes("get.ride.route")?(l({type:"rides/getRoute",rideId:t.id,onSuccess:function(e){return a.setState({selectedRidePath:e,detailModalVisible:!0,selectedRecord:t})}}),G.includes("get.fences")&&l({type:"geo/getFences",areaId:t.areaId})):a.setState({detailModalVisible:!0,selectedRecord:t}):a.setState({detailModalVisible:!1,selectedRecord:null,selectedRidePath:null})},a.handleEndRide=function(e,t){var l=a.props.dispatch;l({type:"rides/endRide",rideId:e,minutes:t,onSuccess:function(){return a.handleGetRides()}}),a.handleEndRideVisible()},a.handleUpdate=function(e,t){var l=a.props.dispatch;l({type:"rides/update",payload:t,id:e,onSuccess:a.handleGetRides}),a.handleUpdateModalVisible()},a.handleEndRideVisible=function(e,t){a.setState({isEndRideVisible:!!e,selectedRecord:t})},a.formatCsvData=function(e){var t=a.props,l=t.areaNames;t.selectedAreaId;return e.map(function(e){return{id:e.id,vehicleType:_[e.vehicleType],imei:e.imei,vehicleNumber:e.vehicleNumber,minutes:e.minutes,charge:e.charge,lockMethod:Z[e.lockMethod],unlockMethod:Z[e.unlockMethod],start:(0,T.default)(e.start).format("MM-DD-YYYY HH:mm:ss"),end:(0,T.default)(e.end).format("MM-DD-YYYY HH:mm:ss"),area:l[e.areaId],state:e.state,areaId:e.areaId,created:(0,T.default)(e.created).format("MM-DD-YYYY HH:mm:ss"),vehicleId:e.vehicleId,customerId:e.customerId}})},a.handleExportData=function(){var e=a.props,t=e.form,l=e.selectedAreaId,n=a.state.filterCriteria;t.validateFields(function(e,t){if(!e){t.timeRange&&(t.rideStart=(0,T.default)(t.timeRange[0]).utcOffset(0).format("MM-DD-YYYY HH:mm:ss"),t.rideEnd=(0,T.default)(t.timeRange[1]).utcOffset(0).format("MM-DD-YYYY HH:mm:ss"),t.timeRange=void 0);var r=Object.assign({},n,{areaId:l},t,{currentPage:null,pageSize:null,areaId:l});a.setState({filterCriteria:r},a.finishExportData)}})},a}return(0,E.default)(t,e),(0,m.default)(t,[{key:"componentDidMount",value:function(){this.handleSearch()}},{key:"componentDidUpdate",value:function(e,t,a){e.selectedAreaId!==this.props.selectedAreaId&&this.handleSearch()}},{key:"renderSimpleForm",value:function(){var e=this.props.form.getFieldDecorator;return S.default.createElement(R.default,{onSubmit:this.handleSearch,layout:"inline"},S.default.createElement(o.default,{gutter:{md:8,lg:24,xl:48}},S.default.createElement(s.default,{md:6,sm:24},S.default.createElement(J,{label:"Keywords"},e("numberOrPhone")(S.default.createElement(M.default,{placeholder:"NUMBER PHONE"})))),S.default.createElement(s.default,{md:6,sm:24},S.default.createElement(J,{label:"Type"},e("type")(S.default.createElement(b.default,{placeholder:"select",style:{width:"100%"}},Q.map(function(e,t){return S.default.createElement(K,{key:t,value:t},Q[t])}),S.default.createElement(K,{value:null},"All"))))),S.default.createElement(s.default,{md:6,sm:24},S.default.createElement(J,{label:"Lock Way"},e("lockWay")(S.default.createElement(b.default,{placeholder:"select",style:{width:"100%"}},Z.map(function(e,t){return S.default.createElement(K,{key:t,value:t},Z[t])}),S.default.createElement(K,{value:null},"All"))))),S.default.createElement(s.default,{md:6,sm:24},S.default.createElement(J,{label:"Unlock Way"},e("unlockWay")(S.default.createElement(b.default,{placeholder:"select",style:{width:"100%"}},Z.map(function(e,t){return S.default.createElement(K,{key:t,value:t},Z[t])}),S.default.createElement(K,{value:null},"All")))))),S.default.createElement(o.default,{gutter:{md:8,lg:24,xl:48}},S.default.createElement(s.default,{lg:7,md:12,sm:24},S.default.createElement(J,{label:"Time",labelCol:{span:5},wrapperCol:{span:15}},e("timeRange")(S.default.createElement(j,{style:{width:"90%"},format:"YYYY-MM-DD HH:mm:ss",showTime:!0})))),S.default.createElement(s.default,{lg:7,md:12,sm:24},S.default.createElement(J,{label:"Vehicle Type",labelCol:{span:5},wrapperCol:{span:15}},e("vehicleType")(S.default.createElement(b.default,{placeholder:"select",style:{width:"100%"}},_.map(function(e,t){return S.default.createElement(K,{key:t,value:t},_[t])}),S.default.createElement(K,{value:null},"All")))))),S.default.createElement(o.default,{gutter:{md:8,lg:24,xl:48}},S.default.createElement(s.default,{md:4,sm:24},"count: ".concat(this.props.rides.total)),S.default.createElement(s.default,{md:{span:8,offset:12},sm:24},S.default.createElement("span",{className:A.default.submitButtons,style:{float:"right"}},S.default.createElement(d.default,{type:"primary",htmlType:"submit"},"Search"),S.default.createElement(d.default,{style:{marginLeft:8},onClick:this.handleFormReset},"Reset")))))}},{key:"finishExportData",value:function(){var e=this,t=this.state.filterCriteria,a=this.props,l=a.areaNames,n=a.selectedAreaId,r=a.dispatch;r({type:"rides/getAll",payload:t,onSuccess:function(t){(0,x.exportCSVFile)(W,e.formatCsvData(t),l[n])}})}},{key:"render",value:function(){var e=this,t=this.props,a=t.rides,l=(t.areas,t.geo),n=t.loading,o=t.selectedAreaId,s=this.state,c=s.isEndRideVisible,u=s.detailModalVisible,f=s.selectedRecord,m=s.filterCriteria,p=s.selectedRidePath,h=s.vehicleDetailModalVisible,E=s.selectedVehicleId,y=s.customerDetailModalVisible,v=s.selectedCustomerId,b={handleEndRide:this.handleEndRide,handleEndRideVisible:this.handleEndRideVisible},M={defaultCurrent:1,current:m.currentPage,pageSize:m.pageSize,total:a.total};return S.default.createElement(O.default,{title:"Ride List"},S.default.createElement(i.default,{bordered:!1},S.default.createElement("div",{className:A.default.tableList},S.default.createElement("div",{className:A.default.tableListForm},this.renderSimpleForm()),S.default.createElement(w.default,{loading:n,data:{list:a.data,pagination:M},columns:this.columns,onChange:this.handleStandardTableChange,scroll:{x:1400}}),o>=1&&S.default.createElement("div",null,S.default.createElement(d.default,{style:{marginTop:"1em"},onClick:this.handleExportData},"Export")))),c&&S.default.createElement(ee,(0,r.default)({},b,{isEndRideVisible:c,ride:f})),f&&u&&S.default.createElement(g.default,{destroyOnClose:!0,title:"Detail",visible:u,width:"50%",onCancel:function(){return e.handleDetailModalVisible()},onOk:function(){return e.handleDetailModalVisible()}},Object.keys(f).map(function(e){return S.default.createElement("p",{key:e},"".concat(e," : ").concat(f[e]))}),p&&p.length>=2&&S.default.createElement(te,{path:p,fences:l.fences})),h&&E&&G.includes("get.vehicle")&&S.default.createElement(H.default,{isVisible:h,handleDetailVisible:this.handleVehicleDetailModalVisible,vehicleId:E}),y&&S.default.createElement(N.default,{isVisible:y,handleDetailVisible:this.handleCustomerDetailModalVisible,customerId:v,handleGetRides:this.handleGetRides}))}}]),t}(S.PureComponent))||I)||I),le=ae;t.default=le}}]);