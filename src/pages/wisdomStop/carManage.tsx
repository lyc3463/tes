import {connect, history} from 'umi';
import {useEffect, useState} from "react";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import dayjs from "dayjs";
import {Button, DatePicker, Input, List, message, Modal, Pagination, Select, Space, Spin, Table, Tag} from "antd";
import {checkSessionStorage, updateSessionStorage} from "@/utils/OpenTool";
const CarManage=(props)=>{
    const [page,setPage]=useState(1);// 页码
    const [pageSize,setPageSize]=useState(50);// 页数
    const [carNo,setCarNo]=useState(checkSessionStorage('/wisdomStop/carManage/','carNo')||'');//车牌号
    const [appId,setAppid]=useState(0);
    const [stutes,setStutes]=useState(checkSessionStorage('/wisdomStop/carManage/','stutes')||0);
    const [uid,setUid]=useState(0);
    const [spinning,setspinning]=useState(false);
    const [isCheckOpen,setIsChengckOpen]=useState(false);
    // 获取列表
    const getCarList=()=>{
        props.dispatch({
            type:'CarManage/fetch',
            payload:{page,carNo,appId,stutes,pageSize}
        })
    };
    // 获取分页信息
    const getCarListfenye=()=>{
        props.dispatch({
            type:'CarManage/fenye',
            payload:{carNo,appId,stutes,pageSize}
        })
    };
    const columns =[
        {
            title: '房号',
            dataIndex: 'unitList',
            key: 'unitList',
            align:'center',
            sorter: {
                compare: (a, b) => {
                    // 获取 a 和 b 的 unitList 中第一个 unit_name
                    const aUnitName = a.unitList[0]?.unit_name || '';
                    const bUnitName = b.unitList[0]?.unit_name || '';

                    // 比较 unit_name
                    if (aUnitName < bUnitName) return -1;
                    if (aUnitName > bUnitName) return 1;
                    return 0;
                },
                multiple: 1,
            },
            width:200,
            render: (text:any, record:any) => {
                const limitedUnitList = record.unitList.slice(0, 2);
                return(
                    <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>
                        {limitedUnitList.map((item, index) => (
                            <span key={index}>{item.unit_name}{index < limitedUnitList.length - 1 ? ',' : ''}</span>
                        ))}
                        {record.unitList.length > 2 && <span>...</span>}
                    </div>
                )
            }
        },
        {
            title: '租户姓名',
            dataIndex: 'tenant_name',
            key: 'tenant_name',
            align:'center',
        },
        {
            title: '手机号',
            dataIndex: 'tenant_phone',
            key: 'tenant_phone',
            align:'center',
        },
        {
            title: '车牌',
            dataIndex: 'carNo',
            key: 'carNo',
            align:'center',
        },
        {
            title: '车辆类型',
            dataIndex: 'carType',
            key: 'carType',
            align:'center',
            render: (text:any, record:any) => {
                let carType;
                switch (record.carType) {
                    case 'CAR':
                        carType=<Tag color='blue'>小车</Tag>
                        break;
                    case 'LARGE':
                        carType=<Tag color='green'>大车</Tag>
                        break;
                    case 'EXTRA_LARGE':
                        carType=<Tag color='red'>超大车</Tag>
                        break;
                    default:
                        carType=<Tag color='red'>其他类型</Tag>
                }
                return(
                    <Space>
                        {carType}
                    </Space>
                )
            },
        },
        {
            title: '车辆颜色',
            dataIndex: 'carNoColor',
            key: 'carNoColor',
            align:'center',
            render: (text:any, record:any) => {
                let carColor;
                switch (record.carNoColor) {
                    case 'BLUE':
                        carColor=<Tag style={{color:"blue"}}>蓝色</Tag>
                        break;
                    case 'GREEN':
                        carColor=<Tag style={{color:"green"}}>绿色</Tag>
                        break;
                    case 'WHITE':
                        carColor=<Tag>白色</Tag>
                        break;
                    case 'YELLOW':
                        carColor=<Tag style={{color:"yellow"}}>黄色</Tag>
                        break;
                    case 'BLACK':
                        carColor=<Tag>黑色</Tag>
                        break;
                    default:
                        carColor=<Tag>其余颜色</Tag>
                }
                return(
                    <Space>
                        {carColor}
                    </Space>
                )
            },
        },
        {
            title: '状态',
            dataIndex: 'carStatus',
            key: 'carStatus',
            align:'center',
            render: (text:any, record:any) => {
                let carStatus;
                switch (record.carStatus) {
                    case 1:
                        carStatus=<Tag color='blue'>未审核</Tag>
                        break;
                    case 2:
                        carStatus=<Tag color='green'>已审核</Tag>
                        break;
                    default:
                        carStatus=<Tag color='red'>未知类型</Tag>
                }
                return(
                    <Space>
                        {carStatus}
                    </Space>
                )
            },
        },
        {
            title: '操作',
            dataIndex: 'czz',
            key: 'czz',
            align:'center',
            render: (text:any, record:any) => {
                return(
                    <Space>
                        {record.carStatus==2?'':<Button type='primary' onClick={()=>isCheck(record.id)}>审核</Button>}
                        {/*<Button type='primary' danger>删除</Button>*/}
                        <Button type='primary' onClick={()=>toInfo(record.id)}>详情</Button>
                    </Space>
                )
            },
        }
    ];
    useEffect(() => {
        getCarList();
    }, [page,pageSize]);
    useEffect(() => {
        getCarListfenye();
    }, []);
    const sousuo=()=>{
        setPage(1);
        getCarList();
        getCarListfenye();
    };
    const onChange=(e,pageSize)=>{
      setPage(e);
      setPageSize(pageSize);
    };
    const isCheck=(e)=>{
        setUid(e);
        setIsChengckOpen(true);
    };
    const onOk=()=>{
      setspinning(true);
      props.dispatch({
          type:'CarManage/check',
          payload:uid
      }).then((res:TypeErrorCode)=>{
          if (res.ErrorCode==0){
              message.success('审核成功');
              setspinning(false);
              setIsChengckOpen(false);
          }else {
              message.error(res.Data);
              setIsChengckOpen(false);
              setspinning(false);
          }
      })
    };
    const toInfo=(e:number)=>{
        history.push(`/wisdomStop/carInfo?id=${e}`)
    };
    const changeCarNo=(e)=>{
      setCarNo(e.target.value);
      updateSessionStorage('/wisdomStop/carManage/','carNo',e.target.value);
    };
    const changeStutes=(e)=>{
        setStutes(e);
        updateSessionStorage('/wisdomStop/carManage/','stutes',e);
    };
    return(
        <Spin spinning={spinning}>
            <List>
                <List.Item>
                    <Space>
                        <Input
                            onChange={changeCarNo}
                            addonBefore="车牌号:"
                            value={carNo}
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
                                状态:
                            </div>
                            <Select
                                onChange={changeStutes}
                                value={stutes}
                                style={{ width: 120 }}
                                options={[
                                    { value: 0, label: '全部' },
                                    { value: 1, label: '未审核' },
                                    { value: 2, label: '已审核' },
                                ]}
                            />
                        </Space.Compact>
                        <Button type="primary" onClick={sousuo}>
                            搜索
                        </Button>
                    </Space>
                </List.Item>
            </List>
            <Table
                columns={columns}
                style={{border:'1px solid #ddd',borderRadius:'4px'}}
                pagination={false}
                dataSource={props.list}
                scroll={{y:'70vh'}}
                rowKey={(columns) => columns.id}
                size='small'
            />
            {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
            <Modal open={isCheckOpen} onCancel={()=>setIsChengckOpen(false)} onOk={onOk} loading={spinning}>
                <div>是否要审核车辆</div>
            </Modal>
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        list: state.CarManage.list,
        count: state.CarManage.count,
    }
};
export default connect(mapStateToProps) (CarManage)