import {Tabs} from "antd";
import PurchaseRequestCheck from "@/pages/warehouse/purchaseRequestCheck";
import Purchase from "@/pages/warehouse/purchase";
import DirectPurchase from "@/pages/warehouse/directPurchase";
import Application from "@/pages/warehouse/application";
import {useState} from "react";
import PurchaseInDetail from "@/pages/warehouse/purchaseInDetail";
import {userQx} from "@/utils/OpenTool";

const CheckPurchaseRequest=()=>{
    const [activeKey, setActiveKey] = useState(sessionStorage.getItem('checkPurchaseRequestActiveKey') || '1');
    const onChange = (key) => {
        setActiveKey(key);
        sessionStorage.setItem('checkPurchaseRequestActiveKey', key);
    };
    return(
        <div>
            <Tabs activeKey={activeKey} onChange={onChange}>
                {userQx()[479]=='1'?<Tabs.TabPane tab='申请采购' key='1'>
                    <Application/>
                </Tabs.TabPane>:''}
                {userQx()[485]=='1'?<Tabs.TabPane tab='采购审核' key='2'>
                    <PurchaseRequestCheck/>
                </Tabs.TabPane>:''}
                    {userQx()[486]=='1'?<Tabs.TabPane tab='采购入库' key='3'><Purchase/>
                </Tabs.TabPane>:''}
                {userQx()[486]=='1'?<Tabs.TabPane tab='入库审核' key='6'>
                    <Purchase/>
                </Tabs.TabPane>:''}
                {userQx()[489]=='1'?<Tabs.TabPane tab='直接入库单' key='4'>
                    <DirectPurchase/>
                </Tabs.TabPane>:''}
                <Tabs.TabPane tab='入库明细' key='5'>
                    <PurchaseInDetail/>
                </Tabs.TabPane>
            </Tabs>
        </div>
    )
}
export default CheckPurchaseRequest
