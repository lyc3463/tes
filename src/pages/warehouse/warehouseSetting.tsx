import {Tabs} from "antd";
import InventoryReviewSettings from "@/pages/warehouse/inventoryReviewSettings";
import ProcurementReviewSettings from "@/pages/warehouse/procurementReviewSettings";
import DrawReviewSettings from "@/pages/warehouse/drawReviewSettings";
import {useState} from "react";
import ReturnReviewSettings from "@/pages/warehouse/returnReviewSettings";
import LossReportedReviewSettings from "@/pages/warehouse/LossReportedReviewSettings";
import TransferReviewSettings from "@/pages/warehouse/TransferReviewSettings";
import SalesReviewSettings from "@/pages/warehouse/SalesReviewSettings";

const WarehouseSetting=()=>{
    const [activeKey, setActiveKey] = useState(sessionStorage.getItem('warehouseSettingActiveKey') || '1');
    const onChange = (key) => {
        setActiveKey(key);
        sessionStorage.setItem('warehouseSettingActiveKey', key);
    };
    return(
        <Tabs activeKey={activeKey} onChange={onChange}>
            <Tabs.TabPane tab='盘点审核设置' key='1'>
                <InventoryReviewSettings/>
            </Tabs.TabPane>
            <Tabs.TabPane tab='采购审核设置' key='2'>
                <ProcurementReviewSettings/>
            </Tabs.TabPane>
            <Tabs.TabPane tab='领用审核设置' key='3'>
                <DrawReviewSettings/>
            </Tabs.TabPane>
            <Tabs.TabPane tab='退货审核设置' key='4'>
                <ReturnReviewSettings/>
            </Tabs.TabPane>
            <Tabs.TabPane tab='报损审核设置' key='5'>
                <LossReportedReviewSettings/>
            </Tabs.TabPane>
            <Tabs.TabPane tab='调拨审核设置' key='6'>
                <TransferReviewSettings/>
            </Tabs.TabPane>
            <Tabs.TabPane tab='销售审核设置' key='7'>
                <SalesReviewSettings/>
            </Tabs.TabPane>
        </Tabs>
    )
}
export default WarehouseSetting;
