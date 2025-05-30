import {Tabs} from "antd";
import ZuList from "@/pages/billLog/zuList";
import {useState} from "react";
import WorkOrderList from "@/pages/workOrderManage/workOrderList";
import GoodsList from "@/pages/workOrderManage/GoodsList";

const WorlOrder=()=>{
    const [activeKey, setActiveKey] = useState(sessionStorage.getItem('orderActive') || '1');
    const onChange = (key) => {
        setActiveKey(key);
        sessionStorage.setItem('orderActive', key);
    };
    return(
        <div>
            <Tabs activeKey={activeKey} onChange={onChange}>
                <Tabs.TabPane tab='工单列表' key='1'>
                    <WorkOrderList/>
                </Tabs.TabPane>
                <Tabs.TabPane tab='物品列表' key='2'>
                    <GoodsList/>
                </Tabs.TabPane>
            </Tabs>
        </div>
    )
}
export default WorlOrder