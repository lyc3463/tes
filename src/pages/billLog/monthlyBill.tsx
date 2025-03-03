import {Button, DatePicker, Input, List, Pagination, Space, Table, Tabs, Tag} from "antd";
import {connect} from "umi";
import {useEffect, useState} from "react";
import dayjs from "dayjs";
import ZuList from "@/pages/billLog/zuList";
import AllList from "@/pages/billLog/allList";
import ServerList from "@/pages/billLog/serverList";
import CableKoufeiList from "@/pages/billLog/cableKoufeiList";
import WaterKoufeiList from "@/pages/billLog/waterKoufeiList";
import LiquidatedDamagesList from "@/pages/billLog/liquidatedDamagesList";
import OutZu from "@/pages/billLog/outZu";
const MonthlyBill=(props:any)=>{
    const [activeKey, setActiveKey] = useState(sessionStorage.getItem('zdActive') || '1');
    const onChange = (key) => {
        setActiveKey(key);
        sessionStorage.setItem('zdActive', key);
    };
    return(
        <div>
            <Tabs activeKey={activeKey} onChange={onChange}>
                <Tabs.TabPane tab='租金/管理费' key='1'>
                    <ZuList/>
                </Tabs.TabPane>
                <Tabs.TabPane tab='公共缴费' key='2'>
                    <AllList/>
                </Tabs.TabPane>
                <Tabs.TabPane tab='服务费' key='3'>
                    <ServerList/>
                </Tabs.TabPane>
                <Tabs.TabPane tab='电费账单' key='4'>
                    <CableKoufeiList/>
                </Tabs.TabPane>
                <Tabs.TabPane tab='水费账单' key='5'>
                    <WaterKoufeiList/>
                </Tabs.TabPane>
                <Tabs.TabPane tab='违约金账单' key='6'>
                    <LiquidatedDamagesList/>
                </Tabs.TabPane>
                <Tabs.TabPane tab='退租账单' key='7'>
                    <OutZu/>
                </Tabs.TabPane>
            </Tabs>
        </div>
    )
}
// const mapStateToProps = (state: any) => {
//     return {
//         MonthlyBillList: state.MonthlyBill.list,
//         count: state.MonthlyBill.count,
//     }
// };
export default connect() (MonthlyBill)