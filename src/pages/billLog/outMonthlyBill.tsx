import {Button, DatePicker, Input, List, Pagination, Space, Table, Tabs, Tag} from "antd";
import {connect} from "umi";
import {useEffect, useState} from "react";
import dayjs from "dayjs";
import OutCableKoufeiList from "@/components/OutCableKoufeiList";
import OutWaterKoufeiList from "@/components/OutWaterKoufeiList";
import OutZuList from "@/components/OutZuList";
import OutAllList from "@/components/OutAllList";
import OutServerList from "@/components/OutServerList";
import OutLiquidatedDamagesList from "@/components/OutLiquidatedDamagesList";
const OutMonthlyBill=(props:any)=>{
    const [activeKey, setActiveKey] = useState(sessionStorage.getItem('outzdActive') || '1');
    const onChange = (key) => {
        setActiveKey(key);
        sessionStorage.setItem('outzdActive', key);
    };
    return(
        <div>
            <Tabs activeKey={activeKey} onChange={onChange}>
                <Tabs.TabPane tab='退租租金/管理费' key='1'>
                    <OutZuList/>
                </Tabs.TabPane>
                <Tabs.TabPane tab='退租公共缴费' key='2'>
                    <OutAllList/>
                </Tabs.TabPane>
                <Tabs.TabPane tab='退租服务费' key='3'>
                    <OutServerList/>
                </Tabs.TabPane>
                <Tabs.TabPane tab='退租电费账单' key='4'>
                    <OutCableKoufeiList/>
                </Tabs.TabPane>
                <Tabs.TabPane tab='退租水费账单' key='5'>
                    <OutWaterKoufeiList/>
                </Tabs.TabPane>
                {/*<Tabs.TabPane tab='退租违约金账单' key='6'>*/}
                {/*    <OutLiquidatedDamagesList/>*/}
                {/*</Tabs.TabPane>*/}
            </Tabs>
        </div>
    )
}

export default connect() (OutMonthlyBill)