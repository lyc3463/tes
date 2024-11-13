import {Tabs} from 'antd';
import Rename from "@/pages/enter/rename";
import Transference from "@/pages/enter/transference";
import Renew from "@/pages/enter/renew";
import OutRent from "@/pages/enter/outRent";
import Preferential from "@/pages/enter/preferential";
import ByStages from "@/pages/enter/byStages";
import {useState} from "react";
const AfterSales=()=>{
    const [activeKey, setActiveKey] = useState(sessionStorage.getItem('activeTabKey1') || '1');
    const onChange = (key) => {
        setActiveKey(key);
        sessionStorage.setItem('activeTabKey1', key);
    };
    return(
        <div>
            <Tabs  activeKey={activeKey} onChange={onChange}>
                <Tabs.TabPane tab='更名录入' key='1'>
                    <Rename/>
                </Tabs.TabPane>
                <Tabs.TabPane tab='转让录入' key='2'>
                    <Transference/>
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
            </Tabs>
        </div>
    )
}
export default AfterSales