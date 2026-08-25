import {Button, Tabs} from 'antd';
import Rename from "@/pages/enter/rename";
import Transference from "@/pages/enter/transference";
import Renew from "@/pages/enter/renew";
import OutRent from "@/pages/enter/outRent";
import Preferential from "@/pages/enter/preferential";
import ByStages from "@/pages/enter/byStages";
import {useEffect, useState} from "react";
import {StaticInfo} from "@/StaticInfo";
import Damages from "@/pages/enter/damages";
import ChangeWeChat from "@/pages/enter/changeWeChat";
import RequestARefund from "@/pages/enter/requestARefund";
const AfterSales=()=>{
    const [activeKey, setActiveKey] = useState(sessionStorage.getItem('activeTabKey1') || '1');
    // 用户权限
    const [uqx,setUqx]=useState<string[]>([]);
    const onChange = (key:string) => {
        setActiveKey(key);
        sessionStorage.setItem('activeTabKey1', key);
    };
    useEffect(() => {
        let uq=StaticInfo.uqx.split('');
        setUqx(uq);
    }, []);
    return(
        <Tabs activeKey={activeKey} onChange={onChange}>
            <Tabs.TabPane tab='更名录入' key='1'>
                <Rename/>
            </Tabs.TabPane>

            <Tabs.TabPane tab='续租录入' key='3'>
                <Renew/>
            </Tabs.TabPane>

            <Tabs.TabPane tab='退租录入' key='4'>
                <OutRent/>
            </Tabs.TabPane>

            <Tabs.TabPane tab='优惠录入' key='5'>
                <Preferential/>
            </Tabs.TabPane>

            <Tabs.TabPane tab='分期录入' key='6'>
                <ByStages/>
            </Tabs.TabPane>

            <Tabs.TabPane tab='违约金免除' key='7'>
                <Damages/>
            </Tabs.TabPane>

            <Tabs.TabPane tab='更改微信号' key='8'>
                <ChangeWeChat/>
            </Tabs.TabPane>
        </Tabs>
    )
}
export default AfterSales