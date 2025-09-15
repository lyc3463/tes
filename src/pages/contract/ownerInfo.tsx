import {
    Button,
    DatePicker, Dropdown,
    Form,
    Input,
    List,
    message,
    Modal,
    Pagination,
    Select,
    Space, Spin,
    Table,
    Tag,
    Tooltip
} from "antd";
import {history,connect} from "umi";
import React, {useEffect, useState} from "react";
import dayjs from "dayjs";
import {CopyOutlined} from "@ant-design/icons";
import * as ApplyRenovationServer from "@/services/applyRenovation";
import * as OwnerInfoServer from "@/services/ownerInfo";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {updateSessionStorage} from "@/utils/OpenTool";

const OwnerInfo=(props)=>{
    const [startDate,setStartDate]=useState('2000-01-01');
    const [endDate,setEndDate]=useState('2099-01-01');
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    const [stutes,setStutes]=useState(0);
    const [name,setName]=useState('');
    const [visible,setVisible]=useState(false); // 甲方账户信息弹窗
    const [visibleDel,setVisibleDel]=useState(false); // 删除弹窗
    const [ownerInfo,setOwnerInfo]=useState({}); // 甲方账户信息
    const [pdfName,setPdfName]=useState('');  // pdf名称
    const [uid,setUid]=useState(0); // 合同id
    const [spinning,setspinning]=useState(false);
    const [checkVisible,setCheckVisible]=useState(false);// 审核弹窗
    const [rentVisible,setRentVisible]=useState(false);// 租金明细弹窗
    const [rentList,setRentList]=useState([]);// 租金明细列表
    const [payVisible,setPayVisible]=useState(false); // 交租确定弹窗
    const [ownerId,setOwnerId]=useState(0);// 租金明细id
    const toadd=()=>{
      history.push('/contract/addOwnerlnfo/');
    };
    // 监听日期
    const changeDate=(_:any,data:string[])=>{
        if (data.length === 2 && data[0] === '' && data[1] === '') {
            setStartDate('2000-01-01');
            setEndDate('2099-01-01');
        } else {
            setStartDate(data[0]);
            setEndDate(data[1]);
        }
    };
    const sousuo=()=>{
        setPage(1);
        console.log(props);
        getList();
        logFenye();
    };
    // 业主信息列表
    const columns =[
        {
            title: '起租日',
            dataIndex: 'beginTime',
            key: 'beginTime',
            align:'center',
            render: (text:any, record:any) => {
                return(
                    <div>
                        {dayjs(record.beginTime).format("YYYY-MM-DD")}
                    </div>
                )
            }
        },
        {
            title: '截止日',
            dataIndex: 'endTime',
            key: 'endTime',
            align:'center',
            render: (text:any, record:any) => {
                return(
                    <div>
                        {dayjs(record.endTime).format("YYYY-MM-DD")}
                    </div>
                )
            }
        },
        {
            title: '客户名称',
            dataIndex: 'customerName',
            key: 'customerName',
            align:'center',
        },
        {
            title: '地址',
            dataIndex: 'customerAddress',
            key: 'customerAddress',
            align:'center',
        },
        {
            title: '手机号',
            dataIndex: 'customerPhone',
            key: 'customerPhone',
            align:'center',
        },
        {
            title: '租金(元)',
            dataIndex: 'zuMoney',
            key: 'zuMoney',
            align:'center',
        },
        {
            title: '押金(元)',
            dataIndex: 'deposit',
            key: 'deposit',
            align:'center',
        },
        {
            title: '下次交租时间',
            dataIndex: 'rentTime',
            key: 'rentTime',
            align:'center',
            render: (text:any, record:any) => {
                return(
                    <div>
                        {record.contractStatus==2?dayjs(record.rentTime).format("YYYY-MM-DD"):'待审核'}
                    </div>
                )
            }
        },
        {
            title: '状态',
            dataIndex: 'contractStatus',
            key: 'contractStatus',
            align:'center',
            render: (text:any, record:any) => {
                return(
                    <div>
                        {text==1?<Tag color='blue'>未审核</Tag>:<Tag color='green'>已审核</Tag>}
                    </div>
                )
            }
        },
        {
            title: '甲方账户',
            dataIndex: 'back',
            key: 'back',
            align:'center',
            render: (text:any, record:any) => {
                return(
                    <Button type='primary' onClick={()=>onBackInfo(record)}>
                        查看
                    </Button>
                )
            }
        },
        {
            title: '操作',
            dataIndex: 'x',
            key: 'x',
            align:'center',
            render: (text:any, record:any) => {
                const menuItems = [];
                const { contractStatus } = record;
                if (contractStatus==1) {
                    menuItems.push(
                        {
                            key: 'edit',
                            label: '编辑',
                            onClick: () => isActivate(record)
                        },
                        {
                            key: 'delete',
                            label: '删除',
                            onClick: () => onRemove(record)
                        },
                        {
                            key: 'approve',
                            label: '审核',
                            onClick: () => onCheck(record)
                        }
                    );
                }
                menuItems.push(
                    {
                        key: 'download',
                        label: '下载',
                        onClick: () => onDownload(record)
                    },
                    {
                        key: 'detail',
                        label: '详情',
                        onClick: () => onInfo(record)
                    },

                );
                if (contractStatus==2) {
                    menuItems.push(
                        {
                            key: 'payRent',
                            label: '交租',
                            onClick: () => onPayRent(record)
                        }
                    );
                }
                return (
                    <Dropdown menu={{ items: menuItems }} placement="bottomRight">
                       <Button type="primary">操作</Button>
                    </Dropdown>
                )
            }
        },
    ];
    // 租金信息列表
    const rentColumns =[
        {
            title: '周期',
            dataIndex: 'xx',
            key: 'xx',
            align:'center',
            render: (text:any, record:any) => {
                return(
                    <div>
                        {dayjs(record.monthBeginDate).format("YYYY-MM-DD")}至{dayjs(record.monthEndDate).format("YYYY-MM-DD")}
                    </div>
                )
            }
        },
        {
            title: '租金',
            dataIndex: 'rent',
            key: 'rent',
            align:'center',
            render: (text:any, record:any) => {
                return(
                    <div>
                        {record.rent}元
                    </div>
                )
            }
        },

        {
            title: '状态',
            dataIndex: 'billStatus',
            key: 'billStatus',
            align:'center',
            render: (text:any, record:any) => {
                return(
                    <div>
                        {text==1?<Tag color='blue'>未支付</Tag>:<Tag color='green'>已支付</Tag>}
                    </div>
                )
            }
        },
        {
            title: '操作',
            dataIndex: 'zz',
            key: 'zz',
            align:'center',
            render: (text:any, record:any) => {
                return(
                    <div>
                        {
                            record.billStatus==1?<Button type='primary' onClick={()=>PayRent(record)}>
                                交租
                            </Button>:<Tag color='green'>已支付</Tag>
                        }
                    </div>
                )
            }
        },
    ];
    const PayRent=(e)=>{
        setPayVisible(true);
        setOwnerId(e.id);
    }
    // 交租弹窗
    const onPayRent=(e)=>{
        setUid(e.id);
        getRentList(e.id);
        setRentVisible(true);
    };
    const getRentList=(e:any)=>{
        setspinning(true);
        OwnerInfoServer.rentList(e).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                console.log('列表信息',res);
                setRentList(res.Data);
                setspinning(false);
            }else {
                message.error(res.Data);
                setspinning(false);
            }
        })
    };
    // 去编辑页面
    const isActivate=(e)=>{
        history.push(`/contract/editOwnerlnfo?id=${e.id}`);
    };
    // 下载pdf
    const onDownload=(e)=>{
        setUid(e.id);
        setspinning(true);
        ApplyRenovationServer.getPDFBase64(e.pdfName).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                downloadPdf(res.Data,e.pdfName);
                setspinning(false);
            }else {
                message.error(res.Data);
                setspinning(false);
            }
        })

    };
    // 下载
    const downloadPdf = (base64String,fileName) => {
        if (!base64String) {
            console.error('Base64字符串为空');
            return;
        }
        let cleanBase64 = base64String;
        if (base64String.includes('base64,')) {
            cleanBase64 = base64String.split('base64,')[1];
        }

        try {
            const byteCharacters = atob(cleanBase64);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/pdf' });

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error('下载失败:', error);
            alert('文件下载失败');
        }
    };
    // 删除页面
    const onRemove=(e)=>{
        setUid(e.id);
        setPdfName(e.pdfName);
        setVisibleDel(true);
    };
    // 合同详情
    const onInfo=(e)=>{
        history.push(`/contract/ownerInfoDetail?id=${e.id}`);
    };
    // 账户详情
    const onBackInfo=(record:any)=>{
        setOwnerInfo(record);
        setVisible(true);
    };
    // 审核详情
    const onCheck=(e)=>{
        setUid(e.id);
        setCheckVisible(true);
    };
    // 日期选择
    const onChange=(e:number,p:number)=>{
        setPage(e);
        setPageSize(p);
    };
    // 列表
    const getList=()=>{
        props.dispatch({
            type:"OwnerInfo/fetch",
            payload:{page,name,startDate,endDate,pageSize,stutes}
        })
    };
    // 分页
    const logFenye=()=>{
        props.dispatch({
            type:"OwnerInfo/fenye",
            payload:{name,startDate,endDate,pageSize,stutes}
        })
    };
    useEffect(() => {
        getList();
    }, [page,pageSize]);
    useEffect(() => {
        logFenye();
    }, []);
    {/* 添加复制功能函数 */}
    const copyToClipboard = (text: string, fieldName: string) => {
        if (!text) {
            message.warning(`${fieldName}内容为空，无法复制`);
            return;
        }
        navigator.clipboard.writeText(text).then(() => {
            message.success(`${fieldName}复制成功`);
        }).catch(() => {
            message.error('复制失败，请手动复制');
        });
    };
    // 删除确定
    const onDelOk=()=>{
        setspinning(true);
        props.dispatch({
            type:"OwnerInfo/remove",
            payload:{uid,pdfName}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('删除成功');
                setVisibleDel(false);
                setspinning(false);
            }else {
                message.error(res.Data);
                setspinning(false);
            }
        })
    };
    // 审核确定
    const onCheckOk=()=>{
        setspinning(true);
        props.dispatch({
            type:"OwnerInfo/check",
            payload:{uid,stutes:2}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('审核成功');
                setCheckVisible(false);
                setspinning(false);
            }else {
                message.error(res.Data);
                setspinning(false);
            }
        })
    };
    const payOk=()=>{
        setspinning(true);
        OwnerInfoServer.PayownerBill(ownerId).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('支付成功');
                setspinning(false);
                setPayVisible(false);
                getRentList(uid);
            }else {
                message.error(res.Data);
                setspinning(false);
            }
        })
    };
    const changeType=(e)=>{
        setStutes(e);
    };
    return(
        <Spin spinning={spinning}>
            <List>
                <List.Item>
                    <div>
                        <Button type="primary" onClick={toadd} >
                            业主信息录入
                        </Button>
                    </div>
                    <Space>
                        <Input
                            style={{ width: 300 }}
                            addonBefore="名称:"
                            onChange={(e)=>setName(e.target.value)}
                            value={name}
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
                                类型:
                            </div>
                            <Select
                                onChange={changeType}
                                value={stutes}
                                style={{ width: 120 }}
                                options={[
                                    { value:0, label: '全部' },
                                    { value:1, label: '未审核' },
                                    { value:2, label: '已审核' },

                                ]}
                            />
                        </Space.Compact>
                        {/*<Space.Compact>*/}
                        {/*    <div*/}
                        {/*        style={{*/}
                        {/*            borderRadius: '6px',*/}
                        {/*            borderStartEndRadius: 0,*/}
                        {/*            borderEndEndRadius: 0,*/}
                        {/*            padding: '0 11px',*/}
                        {/*            border: '1px solid #d9d9d9',*/}
                        {/*            display: 'flex',*/}
                        {/*            flexWrap:'wrap',*/}
                        {/*            alignItems: 'center',*/}
                        {/*            borderInlineEnd: 0,*/}
                        {/*        }}*/}
                        {/*    >*/}
                        {/*        日期:*/}
                        {/*    </div>*/}
                        {/*    <DatePicker.RangePicker onChange={changeDate}/>*/}
                        {/*</Space.Compact>*/}
                        <Button type="primary" onClick={sousuo}>
                            搜索
                        </Button>
                    </Space>
                </List.Item>
            </List>
            <Table
                style={{border:'1px solid #ddd',borderRadius:'4px'}}
                columns={columns}
                size='small'
                scroll={{y:'60vh'}}
                pagination={false}
                rowKey={(columns) => columns.id}
                dataSource={props.OwnerInfoList}
            />
            {props.count?<Pagination total={props.count.count} pageSize={50} current={page}  onChange={onChange} pageSizeOptions={[50]}/>:''}
            {/*甲方账户*/}
            <Modal open={visible} onCancel={()=>setVisible(false)} onOk={()=>setVisible(false)} title={'账户信息'}>
                <Form>
                    <Form.Item label='甲方名称'>
                        <Space.Compact style={{ width: '100%' }}>
                            <Input value={ownerInfo.ownerName} readOnly />
                            <Tooltip title="复制甲方名称">
                                <Button
                                    icon={<CopyOutlined />}
                                    onClick={() => copyToClipboard(ownerInfo.ownerName || '', '甲方名称')}
                                />
                            </Tooltip>
                        </Space.Compact>
                    </Form.Item>
                    <Form.Item label='户名'>
                        <Space.Compact style={{ width: '100%' }}>
                            <Input value={ownerInfo.accountName} readOnly />
                            <Tooltip title="复制户名">
                                <Button
                                    icon={<CopyOutlined />}
                                    onClick={() => copyToClipboard(ownerInfo.accountName || '', '户名')}
                                />
                            </Tooltip>
                        </Space.Compact>
                    </Form.Item>
                    <Form.Item label='预留手机号'>
                        <Space.Compact style={{ width: '100%' }}>
                            <Input value={ownerInfo.ownerPhone} readOnly />
                            <Tooltip title="复制预留手机号">
                                <Button
                                    icon={<CopyOutlined />}
                                    onClick={() => copyToClipboard(ownerInfo.ownerPhone || '', '预留手机号')}
                                />
                            </Tooltip>
                        </Space.Compact>
                    </Form.Item>
                    <Form.Item label='银行账号'>
                        <Space.Compact style={{ width: '100%' }}>
                            <Input value={ownerInfo.ownerCard} readOnly />
                            <Tooltip title="复制银行账号">
                                <Button
                                    icon={<CopyOutlined />}
                                    onClick={() => copyToClipboard(ownerInfo.ownerCard || '', '银行账号')}
                                />
                            </Tooltip>
                        </Space.Compact>
                    </Form.Item>
                    <Form.Item label='开户行'>
                        <Space.Compact style={{ width: '100%' }}>
                            <Input value={ownerInfo.bankName} readOnly />
                            <Tooltip title="复制开户行">
                                <Button
                                    icon={<CopyOutlined />}
                                    onClick={() => copyToClipboard(ownerInfo.bankName || '', '开户行')}
                                />
                            </Tooltip>
                        </Space.Compact>
                    </Form.Item>
                </Form>
            </Modal>
            {/*删除弹窗*/}
            <Modal open={visibleDel} onCancel={()=>setVisibleDel(false)} onOk={onDelOk} title={'删除'} loading={spinning}>
                <div>是否要删除?</div>
            </Modal>
            {/*删除弹窗*/}
            <Modal open={checkVisible} onCancel={()=>setCheckVisible(false)} onOk={onCheckOk} title={'审核'} loading={spinning}>
                <div>是否是要审核?</div>
            </Modal>
            {/* 租金明细弹窗*/}
            <Modal open={rentVisible} onCancel={()=>setRentVisible(false)} onOk={()=>setRentVisible(false)} title={'租金明细'} loading={spinning}>
                <Table
                    style={{border:'1px solid #ddd',borderRadius:'4px'}}
                    columns={rentColumns}
                    size='small'
                    scroll={{y:'60vh'}}
                    pagination={false}
                    rowKey={(columns) => columns.id}
                    dataSource={rentList}
                />
            </Modal>
            {/* 交租弹窗*/}
            <Modal open={payVisible} onCancel={()=>setPayVisible(false)} onOk={payOk} title={'确定交租'} loading={spinning}>
                <div>确定要交租吗?</div>
            </Modal>
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        OwnerInfoList: state.OwnerInfo.list,
        count:state.OwnerInfo.count
    }
};
export default connect(mapStateToProps) (OwnerInfo)