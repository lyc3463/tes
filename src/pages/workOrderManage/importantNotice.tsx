import {Button, DatePicker, Image, Input, List, message, Modal, Pagination, Space, Spin, Table} from "antd";
import dayjs from "dayjs";
import {history,connect} from "umi";
import {useEffect, useState} from "react";
import {updateSessionStorage} from "@/utils/OpenTool";
import * as ImportantNoticeService from '@/services/importantNotice';
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";

const ImportantNotice=(props)=>{
    const [startDate,setStartDate]=useState(sessionStorage.getItem('importantNoticeStartDate') || '2000-01-01');
    const [endDate,setEndDate]=useState(sessionStorage.getItem('importantNoticeEndDate') || '2099-01-01');
    const [page,setPage]=useState(1);
    const [pageSize,setPageSize]=useState(50);
    const [open,setOpen]=useState(false);
    const [spinning,setSpinning]=useState(false);
    const [dOpen,setdOpen]=useState(false);
    const [uid,setUid]=useState(0);
    const [imgs,setImgs]=useState([]);
    const toadd=()=>{
        history.push('/workOrderManage/importantNoticeAdd');
    };
   const changeDate=(_:any,data:string[])=>{
       if (data.length === 2 && data[0] === '' && data[1] === '') {
           setStartDate('2000-01-01');
           setEndDate('2099-01-01');
           updateSessionStorage('/workOrderManage/worlOrder/','importantNoticeStartDate','2000-01-01');
           updateSessionStorage('/workOrderManage/worlOrder/','importantNoticeEndDate','2099-01-01');
       } else {
           setStartDate(data[0]);
           setEndDate(data[1]);
           updateSessionStorage('/workOrderManage/worlOrder/','importantNoticeStartDate',data[0]);
           updateSessionStorage('/workOrderManage/worlOrder/','importantNoticeEndDate',data[1]);
       }
   };
   const getList=()=>{
     props.dispatch({
         type:'ImportantNotice/fetch',
         payload:{startDate, endDate,page,pageSize}
     })
   };
    const getListFenye=()=>{
        props.dispatch({
            type:'ImportantNotice/fenye',
            payload:{startDate, endDate,pageSize}
        })
    };
   const suosou=()=>{
       setPage(1);
       getList();
       getListFenye();
       console.log('props',props)

   };
    useEffect(() => {
        getListFenye();
    }, []);
    useEffect(() => {
        getList();
    }, [page,pageSize]);
   const columns=[
       {
           title:'日期',
           dataIndex:'created',
           key:'created',
           align:'center',
           render:(text:any)=>{
               return dayjs(text).format('YYYY-MM-DD HH:mm:ss');
           }
       },
       {
           title:'标题',
           dataIndex:'inType',
           key:'inType',
           align:'center',
           render:(text:any)=>(
               <div>
                   <Input value={text} />
               </div>
           )
       },
       {
           title:'内容',
           dataIndex:'inContent',
           key:'inContent',
           align:'center',
           render:(text:any)=>(
               <div>
                   <Input.TextArea value={text} />
               </div>
           )
       },
       {
           title:'发起人',
           align:'center',
           dataIndex:'user_name',
           key:'user_name',
       },
       {
           title:'操作',
           align:'center',
           dataIndex:'x',
           key:'x',
           render:(text:any,record:any)=>(
               <Space>
                   <Button type='primary' onClick={()=>onInfo(record)}>详情</Button>
                   <Button type='primary' danger onClick={()=>onDelete(record)}>删除</Button>
               </Space>
           )
       }
   ];
    const onChange=(e:number,pageSize:number)=>{
        setPage(e);
        setPageSize(pageSize);
    };
    const onInfo=(e)=>{
        setOpen(true);
        getInfo(e.id);
    };
    const getInfo=(e)=>{
        setSpinning(true);
        ImportantNoticeService.one(e).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setSpinning(false);
                if (res.Data.inImageBase64){
                    setImgs(res.Data.inImageBase64);
                }else {
                    setImgs([]);
                }
                // setImgs(res.Data.inImageBase64);
            }else {
                message.error(res.Data);
                setSpinning(false);
            }
        })
    };
    const onDelete=(e)=>{
        setUid(e.id);
        setdOpen(true);
    };
    const onOK=()=>{
        setSpinning(true);
        props.dispatch({
            type:'ImportantNotice/remove',
            payload:uid
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                message.success('删除成功');
                setSpinning(false);
                setdOpen(false)
            }else {
                message.error(res.Data);
                setSpinning(false);
                setdOpen(false)
            }
        })
    };
    return(
        <Spin spinning={spinning}>
            <List>
                <div>
                    <Button type="primary" onClick={toadd}>添加重要通知</Button>
                </div>
                <List.Item>
                    <Space>
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
                                时间:
                            </div>
                            {startDate=='2000-01-01'&&endDate=='2099-01-01'?<DatePicker.RangePicker onChange={changeDate}/>:<DatePicker.RangePicker onChange={changeDate} defaultValue={[dayjs(startDate),dayjs(endDate)]}/>}
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
            {/*详情的弹窗*/}
            <Modal open={open} onCancel={()=>setOpen(false)} loading={spinning} onOk={()=>setOpen(false)}>
                <Space style={{display:'flex',flexWrap:'wrap'}}>
                    {imgs.map((item,index)=>{
                        return <Image key={index} src={item} style={{width:'100px',height:'100px'}}/>
                    })}
                </Space>
            </Modal>
            {/*删除的弹窗*/}
            <Modal open={dOpen} onCancel={()=>setdOpen(false)} loading={spinning} onOk={onOK}>
                <div>
                    <div>确定删除吗？</div>
                </div>
            </Modal>
            {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
        </Spin>
    )
}
const mapStateToProps = (state: any) => {
    return {
        ReportList: state.ImportantNotice.list,
        count: state.ImportantNotice.count,
    }
};
export default connect(mapStateToProps)(ImportantNotice);
