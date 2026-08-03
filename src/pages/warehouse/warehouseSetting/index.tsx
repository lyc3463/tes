import {Tabs} from "antd";
import InventoryReviewSettings from "@/pages/warehouse/warehouseSetting/inventoryReviewSettings";
import ProcurementReviewSettings from "@/pages/warehouse/warehouseSetting/procurementReviewSettings";
import DrawReviewSettings from "@/pages/warehouse/warehouseSetting/drawReviewSettings";
import {useState} from "react";
import ReturnReviewSettings from "@/pages/warehouse/warehouseSetting/returnReviewSettings";
import LossReportedReviewSettings from "@/pages/warehouse/warehouseSetting/LossReportedReviewSettings";
import TransferReviewSettings from "@/pages/warehouse/warehouseSetting/TransferReviewSettings";
import SalesReviewSettings from "@/pages/warehouse/warehouseSetting/SalesReviewSettings";
import {userQx} from "@/utils/OpenTool";
import ThenBuckleSettings from "@/pages/warehouse/warehouseSetting/thenBuckleSettings";

const WarehouseSetting=()=>{
    const [activeKey, setActiveKey] = useState(sessionStorage.getItem('warehouseSettingActiveKey') || '1');
    const onChange = (key) => {
        setActiveKey(key);
        sessionStorage.setItem('warehouseSettingActiveKey', key);
    };
    return(
        <Tabs activeKey={activeKey} onChange={onChange}>
            {userQx()[554]=='1'?<Tabs.TabPane tab='盘点审核设置' key='1'>
                <InventoryReviewSettings/>
            </Tabs.TabPane>:null}
            {userQx()[555]=='1'?<Tabs.TabPane tab='采购审核设置' key='2'>
                <ProcurementReviewSettings/>
            </Tabs.TabPane>:null}
            {userQx()[556]=='1'?<Tabs.TabPane tab='领用审核设置' key='3'>
                <DrawReviewSettings/>
            </Tabs.TabPane>:null}
            {userQx()[557]=='1'?<Tabs.TabPane tab='退货审核设置' key='4'>
                <ReturnReviewSettings/>
            </Tabs.TabPane>:null}
            {userQx()[558]=='1'?<Tabs.TabPane tab='报损审核设置' key='5'>
                <LossReportedReviewSettings/>
            </Tabs.TabPane>:null}
            {userQx()[562]=='1'?<Tabs.TabPane tab='调拨审核设置' key='6'>
                <TransferReviewSettings/>
            </Tabs.TabPane>:null}
            {userQx()[559]=='1'?<Tabs.TabPane tab='销售审核设置' key='7'>
                <SalesReviewSettings/>
            </Tabs.TabPane>:null}
            <Tabs.TabPane tab='销售折扣率设置' key='8'>
                <ThenBuckleSettings/>
            </Tabs.TabPane>
        </Tabs>
    )
}
export default WarehouseSetting;
