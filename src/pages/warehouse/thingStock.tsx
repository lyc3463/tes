import {Tabs} from "antd";
import TransferForm from "@/pages/warehouse/transferForm";
import ThingStockInfo from "@/pages/warehouse/thingStockInfo";
import {useState} from "react";
import ReviewTransferForm from "@/pages/warehouse/ReviewTransferForm";
import TransferDetails from "@/pages/warehouse/transferDetails";
import {userQx} from "@/utils/OpenTool";
import CrossStoreTransferForm from "@/pages/warehouse/crossStoreTransferForm";
import CrossStoreReviewTransferForm from "@/pages/warehouse/crossStoreReviewTransferForm";

const ThingStock=()=>{
    const [activeKey, setActiveKey] = useState(sessionStorage.getItem('thingStockActiveKey') || '1');
    const onChange = (key) => {
        setActiveKey(key);
        sessionStorage.setItem('thingStockActiveKey', key);
    };
    return(
        <Tabs activeKey={activeKey} onChange={onChange}>
            {userQx()[488]=='1'?<Tabs.TabPane tab='库存明细' key='1'>
                <ThingStockInfo/>
            </Tabs.TabPane>:''}
            {userQx()[533]=='1'?<Tabs.TabPane tab='申请调拨' key='2'>
                <TransferForm/>
            </Tabs.TabPane>:''}
            {userQx()[537]=='1'?<Tabs.TabPane tab='审核调拨' key='3'>
                <ReviewTransferForm/>
            </Tabs.TabPane>:''}
            {userQx()[563]=='1'?<Tabs.TabPane tab='跨店调拨' key='5'>
                <CrossStoreTransferForm/>
            </Tabs.TabPane>:''}
            <Tabs.TabPane tab='跨店调拨审核' key='6'>
                <CrossStoreReviewTransferForm/>
            </Tabs.TabPane>
            {userQx()[539]=='1'?<Tabs.TabPane tab='调拨明细' key='4'>
                <TransferDetails/>
            </Tabs.TabPane>:''}
        </Tabs>
    )
}
export default ThingStock;