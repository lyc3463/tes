import {connect, history} from "umi";
import {Button, Input, List, Modal, Pagination, Space, Spin, Table, Tag} from "antd";
import {useEffect, useState} from "react";

const MonthlyCard=(props)=>{
    const [spinning,setspinning]=useState(false);
    // const [page,setPage]=useState(1);
    // const [carNo,setCarNo]=useState('');
    // const [appId,setAppId]=useState(0);
    // const columns =[
    //     {
    //         title: '房号',
    //         dataIndex: '',
    //         key: '',
    //         align:'center',
    //     },
    //     {
    //         title: '租户姓名',
    //         dataIndex: 'userName',
    //         key: 'userName',
    //         align:'center',
    //     },
    //     {
    //         title: '手机号',
    //         dataIndex: 'mobile',
    //         key: 'mobile',
    //         align:'center',
    //     },
    //     {
    //         title: '车牌',
    //         dataIndex: 'carNo',
    //         key: 'carNo',
    //         align:'center',
    //     },
    //     {
    //         title: '开始时间',
    //         dataIndex: 'beginTime',
    //         key: 'beginTime',
    //         align:'center',
    //     },
    //     {
    //         title: '到期时间',
    //         dataIndex: 'endTime',
    //         key: 'endTime',
    //         align:'center',
    //
    //     }
    // ];
    // const onChange=(e)=>{
    //   setPage(e);
    // };
    const toViewInfo=()=>{
        history.push('/wisdomStop/monthlyInsuranceInfo');
    };
    // // 获取月卡信息
    // const getMonthlyList=()=>{
    //   props.dispatch({
    //       type:"MonthlyCard/fetch",
    //       payload:{page,carNo,appId}
    //   })
    // };
    // useEffect(() => {
    //     getMonthlyList();
    // }, []);
    return(
        <Spin spinning={spinning}>
            <Button onClick={toViewInfo} type="primary">查询月保信息</Button>
            {/*<List>*/}
            {/*    <List.Item>*/}
            {/*        <Space>*/}
            {/*            <Input*/}
            {/*                addonBefore="车牌号:"*/}
            {/*            />*/}
            {/*            <Button type="primary">*/}
            {/*                搜索*/}
            {/*            </Button>*/}
            {/*            <Button onClick={toViewInfo} type="primary">查询月保信息</Button>*/}
            {/*        </Space>*/}
            {/*    </List.Item>*/}
            {/*</List>*/}
            {/*<Table*/}
            {/*    columns={columns}*/}
            {/*    style={{border:'1px solid #ddd',borderRadius:'4px'}}*/}
            {/*    pagination={false}*/}
            {/*    // dataSource={props.list}*/}
            {/*    scroll={{y:'70vh'}}*/}
            {/*    rowKey={(columns) => columns.id}*/}
            {/*    size='small'*/}
            {/*/>*/}
            {/*{props.count?<Pagination total={props.count.count} pageSize={50} current={page}  onChange={onChange} pageSizeOptions={[50]}/>:''}*/}
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        list: state.MonthlyCard.list,
        count: state.MonthlyCard.count,
    }
};
export default connect(mapStateToProps) (MonthlyCard)