import React, {useEffect, useState} from "react";
import {
    Button,
    Input,
    InputNumber,
    List,
    message,
    Modal,
    Pagination,
    Select,
    Space,
    Spin,
    Table,
    Tag
} from "antd";
import {history,connect} from "umi";
import dayjs from "dayjs";
import {checkSessionStorage, updateSessionStorage} from "@/utils/OpenTool";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import * as ApplyRenovationServer from "@/services/applyRenovation";

const RenovationList=(props)=>{
    const [spinning,setspinning]=useState(false);
    const [startDate,setStartDate]=useState(checkSessionStorage('/propertyServerManage/renovationList/','startDate')|| '2000-01-01');
    const [endDate,setEndDate]=useState(checkSessionStorage('/propertyServerManage/renovationList/','endDate') || '2099-01-01');
    const [name,setName]=useState(checkSessionStorage('/propertyServerManage/renovationList/','name') || '');
    const [phone,setPhone]=useState(checkSessionStorage('/propertyServerManage/renovationList/','phone') || '');
    const [stutes,setStutes]=useState(Number(checkSessionStorage('/propertyServerManage/renovationList/','status')) || 0);
    const [userID,setUserID]=useState(Number(checkSessionStorage('/propertyServerManage/renovationList/','userID')) || 0);
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    const [uid,setUid]=useState(0);
    const [applyMoney,setApplyMoney]=useState(0);
    const [delVisible,setDelVisible]=useState(false);
    const [editDepositOpen,setEditDepositOpen]=useState(false);
    const [checkOpen,setCheckOpen]=useState(false);
    const suosou=()=>{
        setPage(1);
        getList();
        getListFenye();
        console.log('查询',props);
    };
    const toadd=()=>{
        history.push('/propertyServerManage/addRenovation/');
    };
    // 监听手机号
    const changePhone=(e)=>{
        setPhone(e.target.value);
        updateSessionStorage('/propertyServerManage/renovationList/','phone',e.target.value);
    };
    // 监听名字
    const changeName=(e)=>{
        setName(e.target.value);
        updateSessionStorage('/propertyServerManage/renovationList/','name',e.target.value);
    };
    // 监听状态
    const changeState=(e)=>{
        setStutes(e);
        updateSessionStorage('/propertyServerManage/renovationList/','status',e);
    };
    const onChange=(e:number,pageSize:number)=>{
        setPage(e);
        setPageSize(pageSize);
    };
    const columns=[
        {
            title:'装修开始时间',
            dataIndex:'applyTime',
            key:'applyTime',
            render:(text)=>{
                return dayjs(text).format('YYYY-MM-DD');
            }
        },
        {
            title:'装修结束时间',
            dataIndex:'endTime',
            key:'endTime',
            render:(text)=>{
                return dayjs(text).format('YYYY-MM-DD');
            }
        },
        {
            title:'姓名',
            dataIndex:'tenant_name',
            key:'tenant_name',
            render:(text)=>{
                return text||'';
            }
        },
        {
            title:'手机号',
            dataIndex:'tenant_phone',
            key:'tenant_phone',
            render:(text)=>{
                return text||'';
            }
        },
        {
            title:'押金(元)',
            dataIndex:'applyMoney',
            key:'applyMoney',
        },
        {
            title:'装修类型',
            dataIndex:'applyType',
            key:'applyType',
            render:(text)=>{
                if (text===1){
                    return <Tag color="warning">公司装修</Tag>;
                }
                if (text===2){
                    return <Tag color="processing">自装</Tag>;
                }
                if (text===3){
                    return <Tag color="warning">高危作业</Tag>;
                }
                return '未知状态';
            }
        },
        {
            title:'状态',
            dataIndex:'applyStatus',
            key:'applyStatus',
            render:(text)=>{
                if (text===1){
                    return <Tag color="warning">待审核</Tag>;
                }
                if (text===2){
                    return <Tag color="green">已审核</Tag>;
                }
                return '未知状态';
            }
        },
        {
            title:'操作',
            dataIndex:'operation',
            key:'operation',
            render:(text,record)=>{
                return(
                    <Space>
                        {record.applyStatus==1?<>
                            <Button type="primary" onClick={()=>onCheck(record)}>审核</Button>
                            <Button type="primary" onClick={()=>changeDeposit(record)}>修改押金</Button>
                            <Button type="primary" danger onClick={()=>del(record)}>删除</Button>
                            {/*<Button type="primary" onClick={()=>toEdit(record)}>编辑</Button>*/}
                        </>:''}
                        <Button type="primary" onClick={()=>toDol(record)}>下载</Button>
                    </Space>
                )
            }
        },
    ];
    // 修改押金
    const changeDeposit=(record)=>{
        setUid(record.id);
        setEditDepositOpen(true);
        setApplyMoney(record.applyMoney);
    };
    // 删除
    const del=(e)=>{
        setUid(e.id);
        setDelVisible(true);
    };
    // 审核
    const onCheck=(e)=>{
        setUid(e.id);
        setCheckOpen(true);
    };
    // 下载
    const toDol= async (record)=>{
        setspinning(true);
        getOne(record.pdfName);
    };
    const getOne=(e)=>{
        ApplyRenovationServer.getPDFBase64(e).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                downloadPdf(res.Data,'document.pdf');
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
    const getList=()=>{
        props.dispatch({
            type:'ApplyRenovation/fetch',
            payload:{page, pageSize, name, phone, stutes, userID}
        })
    };
    const getListFenye=()=>{
        props.dispatch({
            type:'ApplyRenovation/fenye',
            payload:{pageSize, name, phone, stutes,userID}
        })
    };
    useEffect(() => {
        getList();
    }, [page,pageSize]);
    useEffect(() => {
        getListFenye();
    }, []);
    // 删除的确定
    const onDelOk=()=>{
        setspinning(true);
        props.dispatch({
            type:'ApplyRenovation/remove',
            payload:uid
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('删除成功');
                setDelVisible(false);
                setspinning(false);
            }else {
                message.error(res.Data);
                setDelVisible(false);
                setspinning(false);
            }
        })
    };
    const onEditDepositOk=()=>{
        setspinning(true);
        props.dispatch({
            type:'ApplyRenovation/editDeposit',
            payload:{uid,applyMoney}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('修改押金成功');
                setEditDepositOpen(false);
                setspinning(false);
            }else {
                message.error(res.Data);
                setEditDepositOpen(false);
                setspinning(false);
            }
        })
    };
    const onCheckOk=()=>{
        setspinning(true);
        props.dispatch({
            type:'ApplyRenovation/check',
            payload:uid
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('审核成功');
                setCheckOpen(false);
                setspinning(false);
            }else {
                message.error(res.Data);
                setCheckOpen(false);
                setspinning(false);
            }
        })
    };
    return(
        <Spin spinning={spinning}>
            <List>
                <div>
                    <Button type="primary" onClick={toadd}>添加装修申请</Button>
                </div>
                <List.Item>
                    <Space>
                        <Input
                            addonBefore="手机号:"
                            onChange={changePhone}
                            value={phone}
                        />
                        <Input
                            addonBefore="姓名:"
                            onChange={changeName}
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
                                状态:
                            </div>
                            <Select value={stutes} onChange={changeState}  style={{ width: 120 }}>
                                <Select.Option value={0}>
                                    全部
                                </Select.Option>
                                <Select.Option value={1}>
                                    待审核
                                </Select.Option>
                                <Select.Option value={2}>
                                    已审核
                                </Select.Option>
                            </Select>
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
                dataSource={props.ReportList}
                rowClassName={(record, index) =>
                    index % 2 === 1 ? 'tbodd' : 'tbeven'
                }
            />
            {/*删除弹窗*/}
            <Modal open={delVisible} onCancel={()=>setDelVisible(false)} onOk={onDelOk} loading={spinning}>
                <div>
                    确定删除吗？
                </div>
            </Modal>
            {/*修改金额弹窗*/}
            <Modal open={editDepositOpen} onCancel={()=>setEditDepositOpen(false)} onOk={onEditDepositOk} loading={spinning}>
                <div>
                    <div>
                        请输入新的押金金额：
                    </div>
                    <InputNumber value={applyMoney} onChange={(val)=>setApplyMoney(val)} min={0}/>
                </div>
            </Modal>
            {/*审核弹窗*/}
            <Modal open={checkOpen} onCancel={()=>setCheckOpen(false)} onOk={onCheckOk} loading={spinning}>
                <div>是否要审核?</div>
            </Modal>
            {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        ReportList: state.ApplyRenovation.list,
        count: state.ApplyRenovation.count,
    };
};
export default connect(mapStateToProps) (RenovationList);
