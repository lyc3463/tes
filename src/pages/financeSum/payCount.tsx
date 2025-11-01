import {connect} from "umi";
import {
    Button,
    DatePicker,
    Image,
    Input,
    List,
    message,
    Pagination,
    Select,
    Space,
    Spin,
    Table, Tabs,
    Tag,
    Tooltip
} from "antd";
import dayjs from "dayjs";
import {useEffect, useState} from "react";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {checkSessionStorage, exportDataToExcel, updateSessionStorage} from "@/utils/OpenTool";
import * as RechargeRateService from "@/services/rechargeRate";
import {StaticInfo} from "@/StaticInfo";
import HourCableRate from "@/pages/financeSum/hourCableRate";
import DayCableRate from "@/pages/financeSum/dayCableRate";
import NewPayCount from "@/pages/financeSum/newPayCount";
import OldPayCount from "@/pages/financeSum/oldPayCount";

const PayCount=(props)=>{
    const [activeKey, setActiveKey] = useState(sessionStorage.getItem('payCountActive') || '1');
    const onChange = (key) => {
        setActiveKey(key);
        sessionStorage.setItem('payCountActive', key);
    };
    return(
        <Tabs  activeKey={activeKey} onChange={onChange}>
            <Tabs.TabPane tab='近两个月' key='1'>
                <NewPayCount/>
            </Tabs.TabPane>
            <Tabs.TabPane tab='历史数据' key='2'>
                <OldPayCount/>
            </Tabs.TabPane>
        </Tabs>
    )
}
const mapStateToProps = (state: any) => {
    return {
        RechargeRateList: state.RechargeRate.list,
        count: state.RechargeRate.count,
    }
};
export default connect(mapStateToProps) (PayCount)