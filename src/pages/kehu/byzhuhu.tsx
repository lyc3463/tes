import {useEffect, useRef, useState} from "react";
import * as ZuhuServer from "@/services/zuhu";
import dayjs from "dayjs";
import {connect,history} from "umi";
import {Button, DatePicker, Form, Input, InputNumber, Select, Radio, message, Spin, Space, Modal, Tabs} from "antd";
import {filterAndUpdateList, phonePattern} from "@/utils/OpenTool";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import * as ByStagesService from '@/services/byStages';
import * as CableService from '@/services/cable';
import Byele from "@/pages/kehu/byele";
import Bymoney from "@/pages/kehu/bymoney";
import Byappuser from "@/pages/kehu/byappuser";
import Bywater from "@/pages/kehu/bywater";
import Byitem from "@/pages/kehu/byitem";
const tailLayout = {
    wrapperCol: { offset: 4 },
};
import {StaticInfo} from '@/StaticInfo'
const filteredArray =(e,cableList)=>{
    return  e.length === 0 ? [] : cableList.filter(item => e.includes(item.id));
};
const filteredWaterArray =(e,watertList)=>{
    return  e.length === 0 ? [] : watertList.filter(item => e.includes(item.id));
};
const Byzhuhu=(props:any)=>{
    // 路由参数
    const [uid,setUid]=useState('0');
    const formRef=useRef();
    // 转圈
    const [isSpinning,setIsSpinning]=useState(false);
    const [uqx,setUqx]=useState([]);
    useEffect(()=>{
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        setUid(id);
    },[]);
    useEffect(() => {
        let uq=StaticInfo.uqx.split('');
        setUqx(uq);
    }, []);
    return(
        <Spin spinning={isSpinning}>
            <Tabs>
                {uqx[254]=='1'?<Tabs.TabPane tab='修改最低充值' key='1'>
                    <Bymoney id={uid}/>
                </Tabs.TabPane>:''
                }
                {uqx[351]=='1'?<Tabs.TabPane tab='绑定小程序' key='2'>
                    <Byappuser id={uid}/>
                </Tabs.TabPane>:''
                }
                {uqx[352]=='1'? <Tabs.TabPane tab='绑定电表' key='3'>
                    <Byele id={uid}/>
                </Tabs.TabPane>:''
                }
                {uqx[353]=='1'?   <Tabs.TabPane tab='绑定水表' key='4'>
                    <Bywater id={uid}/>
                </Tabs.TabPane>:''
                }
                {uqx[354]=='1'?  <Tabs.TabPane tab='绑定公共缴费' key='5'>
                    <Byitem id={uid}/>
                </Tabs.TabPane>:''
                }

            </Tabs>
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        AppUserList: state.AppUser.list,
        UnitList: state.Unit.list,
        GongsiList: state.Gongsi.list,
        WatertList: state.Watert.list,
        CableList: state.Cable.list
    }
};
export default connect(mapStateToProps) (Byzhuhu)