import {useEffect,useState} from 'react';
import {connect} from "umi";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import dayjs from "dayjs";
import {Button, Input, List, message, Space, Table, Tag} from "antd";
import {StaticInfo} from "@/StaticInfo";
import {getWarningDescById, getWarningNameById} from "@/utils/consumption";

const WaterCablePoliceSetup=(props:any)=>{
    const [btnDisabled, setBtnDisabled] = useState(false);

    const getWaterCablePoliceSetupList = () => {
        // 1. 读取本地存储的上次点击时间戳
        const lastClickTimeStr = localStorage.getItem('waterCablePolice_lastSearchTime');
        const now = Date.now();
        const coolDownMs = 5 * 60 * 1000; // 5分钟 = 300000毫秒

        if (lastClickTimeStr) {
            const lastClickTime = Number(lastClickTimeStr);
            // 冷却时间未到，直接拦截
            if (now - lastClickTime < coolDownMs) {
                const remainSec = Math.ceil((coolDownMs - (now - lastClickTime)) / 1000);
                message.warning(`冷却中，还需等待 ${remainSec} 秒才能再次搜索`);
                return;
            }
        }

        // 2. 冷却完成，执行查询
        setBtnDisabled(true);
        props.dispatch({
            type: 'WaterCablePoliceSetup/fetch'
        }).finally(() => {
            // 3. 记录本次点击时间到本地存储（刷新页面永久生效）
            localStorage.setItem('waterCablePolice_lastSearchTime', now.toString());
            // 5分钟后解锁按钮
            setTimeout(() => {
                setBtnDisabled(false);
                // 冷却结束清除存储，下次可直接点击
                localStorage.removeItem('waterCablePolice_lastSearchTime');
            }, coolDownMs);
        });
    };
    // 页面初始化时校验冷却，页面刷新自动锁定按钮
    useEffect(() => {
        const lastClickTimeStr = localStorage.getItem('waterCablePolice_lastSearchTime');
        if (!lastClickTimeStr) return;
        const now = Date.now();
        const lastClickTime = Number(lastClickTimeStr);
        const coolDownMs = 5 * 60 * 1000;
        const diff = now - lastClickTime;

        if (diff < coolDownMs) {
            // 还在冷却内，禁用按钮
            setBtnDisabled(true);
            // 剩余时间到自动解锁
            setTimeout(() => {
                setBtnDisabled(false);
                localStorage.removeItem('waterCablePolice_lastSearchTime');
            }, coolDownMs - diff);
        }
    }, []);
    const columns =[
        {
            title: '日期',
            dataIndex: 'start_time',
            key: 'start_time',
            render:(text)=>{
                return dayjs(text).format('YYYY-MM-DD HH:mm:ss');
            }
        },
        {
            title: '租户姓名',
            dataIndex: 'tenant_name',
            key: 'tenant_name',
        },
        {
            title: '租户手机号',
            dataIndex: 'tenant_phone',
            key: 'tenant_phone',
        },
        {
            title: '设备编号',
            dataIndex: 'device_address',
            key: 'device_address',
        },
        {
            title: '描述',
            dataIndex: 'msg',
            key: 'msg',
        },
        {
            title: '报警类型',
            dataIndex: 'warning_def_id',
            key: 'warning_def_id',
            render: (val: string) => getWarningNameById(val)
        },
        {
            title: '报警说明',
            dataIndex: 'warning_def_id',
            render: (val: string) => getWarningDescById(val)
        }
    ];
    return(
        <>
            <List>
                <List.Item>
                    <Space>
                        <Button
                            type="primary"
                            onClick={getWaterCablePoliceSetupList}
                            disabled={btnDisabled}
                        >
                            搜索
                        </Button>
                    </Space>
                </List.Item>
            </List>
            <Table
                style={{border:'1px solid #ddd',borderRadius:'4px'}}
                columns={columns}
                size='small'
                rowKey={(_record:any, index:number) => index}
                dataSource={props.PoliceSetupList}
                pagination={false}
            />
        </>
    )
}
const mapStateToProps = (state: any) => {
    return {
        PoliceSetupList: state.WaterCablePoliceSetup.list
    }
};
export default connect(mapStateToProps) (WaterCablePoliceSetup)