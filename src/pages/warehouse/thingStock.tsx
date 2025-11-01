import {Tabs} from "antd";
import TransferForm from "@/pages/warehouse/transferForm";
import ThingStockInfo from "@/pages/warehouse/thingStockInfo";
import {useState} from "react";
import ReviewTransferForm from "@/pages/warehouse/ReviewTransferForm";

const ThingStock=()=>{
    const [activeKey, setActiveKey] = useState(sessionStorage.getItem('thingStockActiveKey') || '1');
    const onChange = (key) => {
        setActiveKey(key);
        sessionStorage.setItem('thingStockActiveKey', key);
    };
    return(
        <Tabs activeKey={activeKey} onChange={onChange}>
            <Tabs.TabPane tab='库存明细' key='1'>
                <ThingStockInfo/>
            </Tabs.TabPane>
            <Tabs.TabPane tab='申请调拨' key='2'>
                <TransferForm/>
            </Tabs.TabPane>
            <Tabs.TabPane tab='审核调拨' key='3'>
                <ReviewTransferForm/>
            </Tabs.TabPane>
            <Tabs.TabPane tab='调拨明细' key='4'>
            </Tabs.TabPane>
        </Tabs>
    )
}
export default ThingStock;