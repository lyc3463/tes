import {Tabs} from "antd";
import { useState} from "react";
import NewPayCount from "@/pages/financeSum/newPayCount";
import OldPayCount from "@/pages/financeSum/oldPayCount";

const PayCount=()=>{
    const [activeKey, setActiveKey] = useState(sessionStorage.getItem('payCountActive') || '1');
    const onChange = (key:string) => {
        setActiveKey(key);
        sessionStorage.setItem('payCountActive', key);
    };
    return(
        <Tabs  activeKey={activeKey} onChange={onChange}>
            <Tabs.TabPane tab='近两个月' key='1'>
                <NewPayCount/>
            </Tabs.TabPane>
            <Tabs.TabPane tab='历史数据' key='2'>
                <OldPayCount/>
            </Tabs.TabPane>
        </Tabs>
    )
}

export default PayCount
