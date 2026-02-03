import {Tabs} from "antd";
import RequisitionForm from "@/pages/warehouse/requisitionForm";
import CheckRequisitionForm from "@/pages/warehouse/checkRequisitionForm";
import ReturnForm from "@/pages/warehouse/returnForm";
import DamageForm from "@/pages/warehouse/damageForm";
import {useState} from "react";
import ReturnReview from "@/pages/warehouse/returnReview";
import DamageFormReview from "@/pages/warehouse/damageFormReview";
import OutboundDetail from "@/pages/warehouse/outboundDetail";
import {userQx} from "@/utils/OpenTool";

const Outbound=()=>{
    const [activeKey, setActiveKey] = useState(sessionStorage.getItem('outboundActiveKey') || '1');
    const onChange = (key) => {
        setActiveKey(key);
        sessionStorage.setItem('outboundActiveKey', key);
    };
    return(
        <Tabs activeKey={activeKey} onChange={onChange}>
            {userQx()[491]=='1'?<Tabs.TabPane tab='领用申请' key='1'>
                <RequisitionForm/>
            </Tabs.TabPane>:''}
            {userQx()[500]=='1'?<Tabs.TabPane tab='领用审核' key='2'>
                <CheckRequisitionForm/>
            </Tabs.TabPane>:''}
            {userQx()[503]=='1'?<Tabs.TabPane tab='退货申请' key='3'>
                <ReturnForm/>
            </Tabs.TabPane>:''}
            {userQx()[507]=='1'?<Tabs.TabPane tab='退货审核' key='4'>
                <ReturnReview/>
            </Tabs.TabPane>:''}
            {userQx()[509]=='1'?<Tabs.TabPane tab='报损申请' key='5'>
                <DamageForm/>
            </Tabs.TabPane>:''}
            {userQx()[513]=='1'?<Tabs.TabPane tab='报损审核' key='6'>
                <DamageFormReview/>
            </Tabs.TabPane>:''}
            <Tabs.TabPane tab='出库明细' key='7'>
                <OutboundDetail/>
            </Tabs.TabPane>
        </Tabs>
    )
}
export default Outbound;
