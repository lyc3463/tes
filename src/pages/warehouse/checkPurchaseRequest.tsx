import {Tabs} from "antd";
import PurchaseRequest from "@/pages/warehouse/purchaseRequest";
import PurchaseRequestCheck from "@/pages/warehouse/purchaseRequestCheck";
import Purchase from "@/pages/warehouse/purchase";
import DirectPurchase from "@/pages/warehouse/directPurchase";
import Application from "@/pages/warehouse/application";
import {useState} from "react";
import PurchaseInDetail from "@/pages/warehouse/purchaseInDetail";

const CheckPurchaseRequest=()=>{
    const [activeKey, setActiveKey] = useState(sessionStorage.getItem('checkPurchaseRequestActiveKey') || '1');
    const onChange = (key) => {
        setActiveKey(key);
        sessionStorage.setItem('checkPurchaseRequestActiveKey', key);
    };
    return(
        <div>
            <Tabs activeKey={activeKey} onChange={onChange}>
                <Tabs.TabPane tab='申请采购' key='1'>
                    <Application/>
                </Tabs.TabPane>
                <Tabs.TabPane tab='采购审核' key='2'>
                    <PurchaseRequestCheck/>
                </Tabs.TabPane>
                <Tabs.TabPane tab='采购入库' key='3'>
                    <Purchase/>
                </Tabs.TabPane>
                <Tabs.TabPane tab='直接入库单' key='4'>
                    <DirectPurchase/>
                </Tabs.TabPane>
                <Tabs.TabPane tab='入库明细' key='5'>
                    <PurchaseInDetail/>
                </Tabs.TabPane>
            </Tabs>
        </div>
    )
}
export default CheckPurchaseRequest
