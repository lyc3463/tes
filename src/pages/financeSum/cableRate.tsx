import {connect} from "umi";
import {Button, DatePicker, Image, Input, List, message, Pagination, Select, Space, Spin, Table, Tabs, Tag} from "antd";
import dayjs from "dayjs";
import {useEffect, useState} from "react";
import {exportDataToExcel} from "@/utils/OpenTool";
import * as CableRateService from "@/services/cableRate";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import Bymoney from "@/pages/kehu/bymoney";
import HourCableRate from "@/pages/financeSum/hourCableRate";
import DayCableRate from "@/pages/financeSum/dayCableRate";
import {StaticInfo} from "@/StaticInfo";
import OldCableRate from "@/pages/financeSum/oldCableRate";

const CableRate=(props)=>{
    const [uqx,setUqx]=useState([]);
    useEffect(() => {
        let uq=StaticInfo.uqx.split('');
        setUqx(uq);
    }, []);
    const [activeKey, setActiveKey] = useState(sessionStorage.getItem('cableRateActive') || '1');
    const onChange = (key) => {
        setActiveKey(key);
        sessionStorage.setItem('cableRateActive', key);
    };
    return(
        <>
            <Tabs  activeKey={activeKey} onChange={onChange}>
                <Tabs.TabPane tab='近两个月扣电费' key='1'>
                    <HourCableRate/>
                </Tabs.TabPane>
                {uqx[392]=='1'?
                    <Tabs.TabPane tab='天扣电费' key='2'>
                        <DayCableRate/>
                    </Tabs.TabPane>:''}
                <Tabs.TabPane tab='历史扣费数据' key='3'>
                    <OldCableRate/>
                </Tabs.TabPane>
            </Tabs>
        </>
        // <Spin spinning={spinning}>
        //     <List>
        //         <List.Item>
        //             <Space>
        //                 <Input
        //                     // onChange={(e)=>setName(e.target.value)}
        //                     addonBefore="租户姓名:"
        //                     onChange={changeName}
        //                     value={name}
        //                 />
        //                 <Input
        //                     // onChange={(e)=>setCId(e.target.value)}
        //                     addonBefore="电表地址:"
        //                     onChange={changeCId}
        //                     value={cid}
        //                 />
        //                 <Input
        //                     // onChange={(e)=>setremark(e.target.value)}
        //                     addonBefore="电表备注:"
        //                     onChange={changeremark}
        //                     value={remark}
        //                 />
        //                 <Space.Compact>
        //                     <div
        //                         style={{
        //                             borderRadius: '6px',
        //                             borderStartEndRadius: 0,
        //                             borderEndEndRadius: 0,
        //                             padding: '0 11px',
        //                             border: '1px solid #d9d9d9',
        //                             display: 'flex',
        //                             alignItems: 'center',
        //                             borderInlineEnd: 0,
        //                         }}
        //                     >
        //                         日期:
        //                     </div>
        //                     <DatePicker.RangePicker onChange={changeDate} defaultValue={[dayjs(startDate),dayjs(endDate)]}/>
        //                 </Space.Compact>
        //                 <Button type="primary" onClick={sousuo}>
        //                     搜索
        //                 </Button>
        //                 <Button type="primary" onClick={exportToExcel}>
        //                     导出
        //                 </Button>
        //             </Space>
        //         </List.Item>
        //     </List>
        //     <Table
        //         columns={columns}
        //         style={{border:'1px solid #ddd',borderRadius:'4px'}}
        //         pagination={false}
        //         dataSource={props.CableRateList}
        //         scroll={{y:'70vh'}}
        //         rowKey={(columns) => columns.id}
        //         size='small'
        //         summary={(columns) => (
        //             <Table.Summary fixed>
        //                 <Table.Summary.Row>
        //                     <Table.Summary.Cell
        //                         index={1}
        //                     >
        //                         统计
        //                     </Table.Summary.Cell>
        //                     <Table.Summary.Cell index={0}>
        //                     </Table.Summary.Cell>
        //                     <Table.Summary.Cell index={0}>
        //                     </Table.Summary.Cell>
        //                     <Table.Summary.Cell index={0}>
        //                     </Table.Summary.Cell>
        //                     <Table.Summary.Cell index={0}>
        //                     </Table.Summary.Cell>
        //                     <Table.Summary.Cell index={0}>
        //                     </Table.Summary.Cell>
        //                     <Table.Summary.Cell index={5}>
        //                         {props.count?props.count.energyUsage:''}kwh
        //                     </Table.Summary.Cell>
        //                     <Table.Summary.Cell index={0}>
        //                     </Table.Summary.Cell>
        //                     <Table.Summary.Cell
        //                         index={7}
        //                     >
        //                         {props.count?props.count.moneySum:''}元
        //                     </Table.Summary.Cell>
        //                 </Table.Summary.Row>
        //             </Table.Summary>
        //         )}
        //     />
        //     {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
        // </Spin>
    )
}
// const mapStateToProps = (state: any) => {
//     return {
//         CableRateList: state.CableRate.list,
//         count: state.CableRate.count,
//     }
// };
export default connect() (CableRate)