// import React, { useState, useEffect,Component } from "react";
// import {connect} from 'dva'
// import {
//   Table,
// } from "antd";
// @connect(({areas}) => ({
//   selectedAreaId: areas.selectedAreaId,
// }))
// class areas extends Component {
//     // // const { dispatch } = this.props;
//   componentDidMount() {
  
//   }
//   componentDidUpdate(){
//     console.log('111');
//   }
//   getAreas = () => {
//     const { dispatch,selectedAreaId } = this.props;
//     dispatch({
//       type: "areas/getAreasAll",
//       payload: {areaId:this.state.selectedAreaId || 1},
//     });

//   }
//   render(){    
//     console.log(this.props);
//     const { dispatch,selectedAreaId } = this.props;
//     this.state = {
//       selectedAreaId:selectedAreaId
//     }
    
//     console.log(this.state);
//     const columns = [
//       {
//         title: '姓名',
//         dataIndex: 'name',
//         key: 'name',
//       },
//       {
//         title: '年龄',
//         dataIndex: 'age',
//         key: 'age',
//       },
//       {
//         title: '住址',
//         dataIndex: 'address',
//         key: 'address',
//       },
//     ];
//     const dataSource = [
//       {
//         key: '1',
//         name: '胡彦斌',
//         age: 32,
//         address: '西湖区湖底公园1号',
//       },
//       {
//         key: '2',
//         name: '胡彦祖',
//         age: 42,
//         address: '西湖区湖底公园1号',
//       },
//     ];
//     return (
//       <div>
//         <Table dataSource={dataSource} columns={columns} rowKey =''/>
//       </div>
//     )
//   }
// }
// export default areas