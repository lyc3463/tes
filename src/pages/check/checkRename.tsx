import dayjs from "dayjs";
import {
    Button,
    DatePicker, Dropdown,
    Input,
    List,
    Menu,
    message,
    Modal,
    Pagination,
    Popover,
    Select,
    Space,
    Spin,
    Table,
    Tag
} from "antd";
import {history,connect} from "umi";
import {useEffect, useState} from "react";
import type { MenuProps } from 'antd';
import {checkSessionStorage, updateSessionStorage} from "@/utils/OpenTool";
import RenameType from "@/ModelTypes/TypeRename";

const CheckRename=(props:any)=>{
    // 当前页数
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    // 手机号
    const [phone,setPhone]=useState(checkSessionStorage('/check/checkAfterSales/','CheckRenamePhone')||'');
    // 状态 0全部，1未审核，2审核通过
    const [stutes,setStutes]=useState(checkSessionStorage('/check/checkAfterSales/','CheckRenameStutes')||0);
    // 开始时间
    const [startDate,setStartDate]=useState(checkSessionStorage('/check/checkAfterSales/','CheckRenameStartDate')||'2000-01-01');
    // 结束时间
    const [endDate,setEndDate]=useState(checkSessionStorage('/check/checkAfterSales/','CheckRenameEndDate')||'2099-01-01');
    // 审核弹窗
    const [isOpen,setOpen]=useState(false);
    // 更名的手机号
    const [uphone,setUphone]=useState('');
    // id
    const [uid,setUid]=useState(0);
    const [spinning, setSpinning] = useState(false);
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
            render: (text:any, record:RenameType) => {
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
            render:(_:any,record:RenameType)=>(
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
            title: '原名字',
            dataIndex: 'tenant_name',
            key: 'tenant_name',
        },
        {
            title: '更改后的名字',
            dataIndex: 'rename',
            key: 'rename',
        },
        {
            title: '原手机号',
            dataIndex: 'tenant_phone',
            key: 'tenant_phone',
        },
        {
            title: '更改后手机号',
            dataIndex: 'rephone',
            key: 'rephone',
        },
        {
            title: '原身份证',
            dataIndex: 'customCard',
            key: 'customCard',
        },
        {
            title: '更改后身份证',
            dataIndex: 'reCard',
            key: 'reCard',
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
            render: (text: any, record: RenameType) => {
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
    ]
    const toInfo=(e:RenameType)=>{
        history.push(`/enter/editRename?id=${e.id}&renameStatus=${2}`);
    };
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
            updateSessionStorage('/check/checkAfterSales/','CheckRenameStartDate','2000-01-01');
            updateSessionStorage('/check/checkAfterSales/','CheckRenameEndDate','2099-01-01');
        } else {
            setStartDate(data[0]);
            setEndDate(data[1]);
            updateSessionStorage('/check/checkAfterSales/','CheckRenameStartDate',data[0]);
            updateSessionStorage('/check/checkAfterSales/','CheckRenameEndDate',data[1]);
        }
    };
    const isTranslation=(e:RenameType)=>{
        setUid(e.id);
        setOpenTranslation(true);
        setTenant_name(e.tenant_name);
    };
    // 监听姓名
    const changePhone=(e)=>{
        setPhone(e.target.value);
        updateSessionStorage('/check/checkAfterSales/','CheckRenamePhone',e.target.value);
    };
    // 监听状态
    const changeStutes=(e:number)=>{
        setStutes(e);
        updateSessionStorage('/check/checkAfterSales/','CheckRenameStutes',e);
    };
    // 分页
    const logFenye=()=>{
        props.dispatch({
            type:"Rename/fetch",
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
    const isCheck=(e:RenameType)=>{
        setOpen(true);
        setUid(e.id);
        setUphone(e.tenant_phone);
        setTenant_name(e.tenant_name);
    };
    const onOk=()=>{
        setSpinning(true);
        props.dispatch({
            type:'Rename/check',
            payload:uid
        }).then((res:any)=>{
            if (res.ErrorCode==0){
                message.success('审核通过');
                setOpen(false);
                setSpinning(false);
                logFenye();
            }else {
                message.error(res.Data);
                setOpen(false);
                setSpinning(false);
            }
        })
    };
    const onTranslationOk=()=>{
        setSpinning(true);
        props.dispatch({
            type:'Rename/translation',
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
    return(
        <Spin spinning={spinning}>
            <List>
                <List.Item>
                    <Space>
                        <Input
                            addonBefore="原手机号:"
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
                scroll={{y:'60vh',x:1500}}
                rowClassName={(record, index) =>
                    index % 2 === 1 ? 'tbodd' : 'tbeven'
                }
                dataSource={props.RenameList}
            />
            {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
            {/*审核弹窗*/}
            <Modal open={isOpen} onOk={onOk} onCancel={()=>setOpen(false)} title='审核更名' loading={spinning}>
                <span>是否审核通过手机号:<span style={{color:'red'}}>{`${uphone}(${tenant_name})`}</span>的更名吗?</span>
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
        RenameList: state.Rename.list,
        count: state.Rename.count
    }
};
export default connect(mapStateToProps) (CheckRename)