import {Tabs} from "antd";
import OldBillSum from "@/pages/financeManage/oldBillSum";
import NewBillSum from "@/pages/financeManage/newBillSum";
import {useState} from "react";

const BillSum=(props:any)=>{
    const [activeKey, setActiveKey] = useState(sessionStorage.getItem('billSumActiveKey') || '1');
    const onChange = (key) => {
        setActiveKey(key);
        sessionStorage.setItem('billSumActiveKey', key);
    };
    return(
        <Tabs activeKey={activeKey} onChange={onChange}>
            <Tabs.TabPane tab="旧数据" key="1">
                <OldBillSum/>
            </Tabs.TabPane>
            <Tabs.TabPane tab="新数据" key="2">
                <NewBillSum/>
            </Tabs.TabPane>
        </Tabs>
    )
}

export default  BillSum