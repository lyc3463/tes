import {connect, history} from 'umi'
import {useEffect, useState} from "react";
import {Button, Input, List, message, Modal, Select, Space, Spin, Table, Tag} from "antd";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {StaticInfo} from "@/StaticInfo";
import {checkSessionStorage, updateSessionStorage} from "@/utils/OpenTool";
const WarehouseList=(props:any)=>{
    const [loading, setLoading] = useState(false);
    // 删除的弹窗
    const [isOpen,setIsOpen]=useState(false);
    const [uid,setUid]=useState(0);
    // 参数名称
    const [cname,setCname]=useState('');
    // 收费类型
    const [priceType,setPriceType]=useState(0);
    // 1水价 2电价 0全部
    const [we_type,setwe_type]=useState(0);
    // 用户权限
    const [uqx,setUqx]=useState([]);
    const columns = [
        {
            title: '仓库名称',
            dataIndex: 'price_name',
        },
        {
            title: '仓库类型',
            dataIndex: 'price_type',
            render: (type) => {
                const typeMap = {1: '普通仓库', 2: '冷藏仓库', 3: '危险品仓库'};
                return typeMap[type] || '未知类型';
            }
        },
        {
            title: '所在位置',
            dataIndex: 'address',
        },
        {
            title: '负责人',
            dataIndex: 'manager',
        },
        {
            title: '联系电话',
            dataIndex: 'phone',
        },
        {
            title: '操作',
            dataIndex: 'operation',
        },
    ];
    const toadd=()=>{
        history.push('/warehouse/addWarehouse');
    };
    // 去编辑页面
    const toedit=(we_type:number,id:number)=>{

    };
    // 监听参数名称
    const changeName=(e)=>{
        setCname(e.target.value);

    };
    // 监听价钱类型
    const changeType=(e)=>{
        setPriceType(e);
    };
    // 搜索



    useEffect(() => {
    }, []);
    const changeWeType=(e)=>{
        setwe_type(e);
    };

    return(
        <div>
            <Spin spinning={loading}>
                <List>
                    <List.Item>
                        <div>
                            <Button type="primary" onClick={toadd}>新增仓库</Button>
                        </div>
                        <Space>
                            <Input
                                addonBefore="仓库名称:"
                                onChange={changeName}
                            />
                            <Space.Compact>
                                <div
                                    style={{
                                        borderRadius: '6px',
                                        borderStartEndRadius: 0,
                                        borderEndEndRadius: 0,
                                        padding: '0 11px',
                                        border: '1px solid #d9d9d9',
                                        display: 'flex',
                                        alignItems: 'center',
                                        borderInlineEnd: 0,
                                    }}
                                >
                                    仓库类型:
                                </div>
                                <Select
                                    style={{ width: 120 }}
                                    onChange={changeType}
                                    value={priceType}
                                    options={[
                                        { value: 0, label: '全部' },
                                        { value: 1, label: '普通仓库' },
                                        { value: 2, label: '冷藏仓库' },
                                        { value: 3, label: '危险品仓库' },
                                    ]}
                                />
                            </Space.Compact>
                            <Button type="primary">
                                搜索
                            </Button>
                        </Space>
                    </List.Item>
                </List>
                <Table
                    columns={columns}
                    rowKey={(columns) => columns.id}
                    dataSource={props.CableParameterList}
                    pagination={false}
                    size='small'
                    rowClassName={(record, index) =>
                        index % 2 === 1 ? 'tbodd' : 'tbeven'
                    }
                />
                <Modal open={isOpen} onCancel={()=>setIsOpen(false)}>
                    <div>确定要删除吗?</div>
                </Modal>
            </Spin>
        </div>
    )
}
// const mapStateToProps = (state: any) => {
//     return {
//         CableParameterList: state.CableParameter.list
//     }
// };

export default connect() (WarehouseList)