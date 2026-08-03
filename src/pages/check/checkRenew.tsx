import {
    Button,
    DatePicker, Dropdown,
    Input,
    List, Menu,
    MenuProps,
    message,
    Modal,
    Pagination, Popover,
    Select,
    Space,
    Spin,
    Table,
    Tag
} from "antd";
import dayjs from "dayjs";
import {history,connect} from "umi";
import {useEffect, useState} from "react";
import {checkSessionStorage, updateSessionStorage} from "@/utils/OpenTool";
import RenameType from "@/ModelTypes/TypeRename";
import RenewType from "@/ModelTypes/TypeRenew";

const CheckRenew=(props)=>{
    // 当前页数
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    // 手机号
    const [phone,setPhone]=useState(checkSessionStorage('/check/checkAfterSales/','CheckRenewPhone')||'');
    // 状态 0全部，1未审核，2审核通过
    const [stutes,setStutes]=useState(checkSessionStorage('/check/checkAfterSales/','CheckRenewStutes')||0);
    // 开始时间
    const [startDate,setStartDate]=useState(checkSessionStorage('/check/checkAfterSales/','CheckRenewStartDate')||'2000-01-01');
    // 结束时间
    const [endDate,setEndDate]=useState(checkSessionStorage('/check/checkAfterSales/','CheckRenewEndDate')||'2099-01-01');
    // 审核弹窗
    const [isOpen,setOpen]=useState(false);
    // 更名的手机号
    const [uphone,setUphone]=useState('');
    const [spinning, setSpinning] = useState(false);
    // id
    const [uid,setUid]=useState(0);
    // 驳回弹窗
    const [openTranslation,setOpenTranslation]=useState(false);
    const [tenant_name,setTenant_name]=useState('');
    // 驳回原因
    const [remark,setRemark]=useState('');
    const columns =[
        {
            title: '单元名称',
            dataIndex: 'unitList',
            key: 'unitList',
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
                        {/* 如果 unitList 数组长度大于 2，则显示省略号或其他提示 */}
                        {record.unitList.length > 2 && <span>...</span>}
                    </div>
                )
            }
        },
        {
            title: '申请日期',
            dataIndex: 'created',
            key: 'created',
            render:(_:any,record:any)=>(
                <div>
                    {dayjs(record.created).format("YYYY-MM-DD")}
                </div>
            )
        },
        {
            title: '合同编号',
            dataIndex: 'identifier',
            key: 'identifier',
        },
        {
            title: '租户名字',
            dataIndex: 'tenant_name',
            key: 'tenant_name',
        },
        {
            title: '联系方式',
            dataIndex: 'tenant_phone',
            key: 'tenant_phone',
        },
        {
            title: '续租开始时间',
            dataIndex: 'beginData',
            key: 'beginData',
            render:(_:any,record:any)=>(
                <div>
                    {dayjs(record.beginData).format("YYYY-MM-DD")}
                </div>
            )
        },
        {
            title: '续租到期时间',
            dataIndex: 'endDate',
            key: 'endDate',
            render:(_:any,record:any)=>(
                <div>
                    {dayjs(record.endDate).format("YYYY-MM-DD")}
                </div>
            )
        },
        {
            title: '状态',
            dataIndex: 'renameStatus',
            key: 'renameStatus',
            render: (text: any, record: RenameType) => {
                const status = record.renameStatus;
                let tagDom;
                if (status === 2) {
                    tagDom = <Tag color="green">已审核</Tag>;
                } else if (status === 3) {
                    // 驳回，增加气泡展示备注
                    tagDom = (
                        <Popover content={record.remark || '无驳回原因'} title="驳回理由">
                            <Tag color="red">驳回？</Tag>
                        </Popover>
                    );
                } else {
                    tagDom = <Tag color="orange">未审核</Tag>;
                }
                return tagDom;
            }
        },
        {
            title: '操作',
            dataIndex: 'cao',
            key: 'cao',
            render: (text: any, record: RenewType) => {
                // 下拉菜单配置
                const menuItems: MenuProps['items'] = [
                    {
                        key: 'info',
                        label: '详情',
                        onClick: () => toInfo(record)
                    }
                ];
                // 状态不等于2（未审核/驳回），追加审核、驳回
                if (record.renameStatus !== 2) {
                    menuItems.push(
                        {
                            key: 'check',
                            label: '审核',
                            onClick: () => isCheck(record)
                        },
                        {
                            key: 'reject',
                            danger: true,
                            label: '驳回',
                            onClick: () => isTranslation(record)
                        }
                    );
                }
                const menu = <Menu items={menuItems} />;
                return (
                    <Dropdown overlay={menu} trigger={['click']}>
                        <Button>操作</Button>
                    </Dropdown>
                );
            }
        }
    ];
    // 监听页数
    const onChange=(e:number,pageSize:number)=>{
        setPage(e);
        setPageSize(pageSize);
    };
    // 时间选择
    const changeDate=(_:any,data:string[])=>{
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setStartDate('2000-01-01');
            setEndDate('2099-01-01');
            updateSessionStorage('/check/checkAfterSales/','CheckRenewStartDate','2000-01-01');
            updateSessionStorage('/check/checkAfterSales/','CheckRenewEndDate','2099-01-01');
        } else {
            setStartDate(data[0]);
            setEndDate(data[1]);
            updateSessionStorage('/check/checkAfterSales/','CheckRenewStartDate',data[0]);
            updateSessionStorage('/check/checkAfterSales/','CheckRenewEndDate',data[1]);
        }
    };
    // 监听姓名
    const changePhone=(e)=>{
        setPhone(e.target.value);
        updateSessionStorage('/check/checkAfterSales/','CheckRenewPhone',e.target.value);
    };
    // 监听状态
    const changeStutes=(e:number)=>{
        setStutes(e);
        updateSessionStorage('/check/checkAfterSales/','CheckRenewStutes',e);
    };
    // 分页
    const logFenye=()=>{
        props.dispatch({
            type:"Renew/fetch",
            payload:{page,phone,stutes,startDate,endDate,pageSize}
        })
    };

    useEffect(() => {
        logFenye();
    }, [page,pageSize]);

    // 搜索
    const suosou=()=>{
        setPage(1);
        logFenye();
    };

    // 审核弹窗
    const isCheck=(e:any)=>{
        setOpen(true);
        setUid(e.id);
        setUphone(e.tenant_phone)
    };
    const onOk=()=>{
        setSpinning(true);
        props.dispatch({
            type:'Renew/check',
            payload:uid
        }).then((res:any)=>{
            if (res.ErrorCode==0){
                message.success('审核通过');
                setOpen(false);
                setSpinning(false);
            }else {
                message.error(res.Data);
                setSpinning(false);
                setOpen(false);
            }
        })
    };
    const toInfo=(e:RenewType)=>{
        history.push(`/enter/editRenew?id=${e.id}&renewStatus=${1}`);
    };
    const onTranslationOk=()=>{
        setSpinning(true);
        props.dispatch({
            type:'Renew/translation',
            payload:{uid,remark}
        }).then((res:any)=>{
            if (res.ErrorCode==0){
                message.success('驳回成功');
                setOpenTranslation(false);
                setSpinning(false);
                logFenye();
            }else {
                message.error(res.Data);
                setOpenTranslation(false);
                setSpinning(false);
            }
        })
    };
    const isTranslation=(e:RenewType)=>{
        setOpenTranslation(true);
        setUid(e.id);
        setUphone(e.tenant_phone);
        setTenant_name(e.tenant_name);
    };
    return(
        <Spin spinning={spinning}>
            <List>
                <List.Item>
                    <Space>
                        <Input
                            addonBefore="手机号:"
                            onChange={changePhone}
                            value={phone}
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
                                日期:
                            </div>
                            {startDate=='2000-01-01'&&endDate=='2099-01-01'?<DatePicker.RangePicker onChange={changeDate}/>:<DatePicker.RangePicker onChange={changeDate} defaultValue={[dayjs(startDate),dayjs(endDate)]}/>}
                        </Space.Compact>
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
                                    { value:0, label: '全部' },
                                    { value:1, label: '未审核' },
                                    { value:2, label: '已审核' },
                                    { value:3, label: '驳回' },
                                ]}
                            />
                        </Space.Compact>
                        <Button type="primary" onClick={suosou}>
                            搜索
                        </Button>
                    </Space>
                </List.Item>
            </List>
            <Table
                columns={columns}
                rowKey={(columns) => columns.id}
                pagination={false}
                size='small'
                scroll={{y:'60vh'}}
                dataSource={props.RenewList}
                rowClassName={(record, index) =>
                    index % 2 === 1 ? 'tbodd' : 'tbeven'
                }
            />
            {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
            {/*审核弹窗*/}
            <Modal open={isOpen} onOk={onOk} onCancel={()=>setOpen(false)} title='审核更名' loading={spinning}>
                <span>是否审核通过手机号:<span style={{color:'red'}}>{uphone}</span>的用户吗?</span>
            </Modal>
            {/*驳回弹窗*/}
            <Modal open={openTranslation} onOk={onTranslationOk} onCancel={()=>setOpenTranslation(false)} title='驳回更名' loading={spinning}>
                <span>是否驳回手机号:<span style={{color:'red'}}>{`${uphone}(${tenant_name})`}</span>的更名吗?</span>
                <Input.TextArea
                    placeholder="请输入驳回原因"
                    onChange={(e:any)=>setRemark(e.target.value)}
                    value={remark}
                />
            </Modal>
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        RenewList: state.Renew.list,
        count: state.Renew.count,
    }
};
export default connect(mapStateToProps) (CheckRenew)