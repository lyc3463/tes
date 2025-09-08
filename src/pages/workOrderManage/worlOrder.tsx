import {Tabs} from "antd";
import {useState} from "react";
import WorkOrderList from "@/pages/workOrderManage/workOrderList";
import ImportantNotice from "@/pages/workOrderManage/importantNotice";

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
                <Tabs.TabPane tab='重要通知' key='2'>
                    <ImportantNotice/>
                </Tabs.TabPane>
            </Tabs>
        </div>
    )
}
export default WorlOrder