import {Tabs} from "antd";
import InventoryRequest from "@/pages/warehouse/inventoryRequest";
import InventoryEntry from "@/pages/warehouse/InventoryEntry";
import InventoryAudit from "@/pages/warehouse/inventoryAudit";
import LossRecord from "@/pages/warehouse/lossRecord";
import {useState} from "react";

const Inventory=()=>{
    const [activeKey, setActiveKey] = useState(sessionStorage.getItem('inventoryActiveKey') || '1');
    const onChange = (key) => {
        setActiveKey(key);
        sessionStorage.setItem('inventoryActiveKey', key);
    };
    return(
       <Tabs activeKey={activeKey} onChange={onChange}>
           <Tabs.TabPane tab='申请盘点' key='1'>
               <InventoryRequest/>
           </Tabs.TabPane>
           <Tabs.TabPane tab='盘点录入' key='2'>
               <InventoryEntry/>
           </Tabs.TabPane>
           <Tabs.TabPane tab='盘点审核' key='3'>
               <InventoryAudit/>
           </Tabs.TabPane>
           <Tabs.TabPane tab='盘点差异记录' key='4'>
               <LossRecord/>
           </Tabs.TabPane>
       </Tabs>
    )
}
export default Inventory;
