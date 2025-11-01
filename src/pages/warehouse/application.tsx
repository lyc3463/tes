import {Button, DatePicker, Input, List, message, Modal, Pagination, Space, Spin, Table, Tabs, Tag} from "antd";
import {connect, history} from "umi";
import {useEffect, useState} from "react";
import dayjs from "dayjs";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
const Application=(props)=>{
    const [spinning,setSpinning]=useState(false);
    const [page,setPage]=useState(1);  // 当前页数
    const [orderCode,setOrderCode]=useState('');// 采购单号
    const [warehouseName,setWarehouseName]=useState('');// 仓库名称
    const [supplierName,setSupplierName]=useState('');// 供应商
    const [startDate,setStartDate]=useState('2000-01-01');// 开始时间
    const [endDate,setEndDate]=useState('2099-01-01');// 结束日期
    const [orderStatus,setOrderStatus]=useState(1);// 订单状态
    const [billStatus,setBillStatus]=useState(0);// 是否交完钱状态
    const [orderType,setOrderType]=useState(1);// 订单类型
    const [pageSize,setPageSize]=useState(50); // 每页数量
    const [dUid,setDUid]=useState(0);// 删除的ID
    const [dOpne,setDOpen]=useState(false);// 删除确认弹窗
    const columns=[
        {
            title:'申请日期',
            dataIndex:'orderTime',
            key:'orderTime',
            align:'center',
            render:(text)=>{
                return <div>{dayjs(text).format('YYYY-MM-DD')}</div>
            }
        },
        {
            title:'采购单号',
            dataIndex:'orderCode',
            key:'orderCode',
            align:'center',
            render:(text,record)=>{
                return(
                    <Button type='link' onClick={()=>{history.push(`/warehouse/infpApplication?id=${record.id}`);}}>{text}</Button>
                )
            }
        },
        {
            title:'入库仓库',
            dataIndex:'warehouseName',
            key:'warehouseName',
            align:'center',
            ellipsis:true,

        },
        {
            title:'供应商',
            dataIndex:'supplierName',
            key:'supplierName',
            align:'center',
            ellipsis:true,
        },
        {
            title:'已交金额',
            dataIndex:'paidAmount',
            key:'paidAmount',
            align:'center',
        },
        {
            title:'物品总价',
            dataIndex:'totalAmount',
            key:'totalAmount',
            align:'center',
        },
        {
            title:'状态',
            dataIndex:'orderStatus',
            key:'orderStatus',
            align:'center',
            render:(text)=>{
                return(
                    <Space>
                        <Tag color={text==1?'blue':'green'}>{text==1?'未审核':'已审核'}</Tag>
                    </Space>
                )
            }
        },
        {
            title:'备注',
            dataIndex:'remark',
            key:'remark',
            align:'center',
            ellipsis:true,
        },
        {
            title:'操作',
            dataIndex:'status',
            key:'status',
            align:'center',
            render:(text,record)=>{
                return(
                    <Space>
                        {record.orderStatus==1&&<>
                            <Button type="primary" onClick={()=>{
                                history.push(`/warehouse/editApplication?id=${record.id}`);
                            }}>
                                编辑
                            </Button>
                            <Button type="primary" danger onClick={()=>isDelOpen(record.id)}>
                                删除
                            </Button>
                        </>}
                    </Space>
                )
            }

        },
    ];
    const isDelOpen=(e)=>{
        setDUid(e);
        setDOpen(true);
    };
    const toAdd=()=>{
        history.push('/warehouse/addApplication');
    };
    // 列表信息
    const getList=()=>{
        props.dispatch({
            type:'Application/fetch',
            payload:{page, pageSize, orderCode, warehouseName, supplierName, startDate, endDate, orderStatus, billStatus,orderType}
        })
    };
    // 分页信息
    const getFenye=()=>{
        props.dispatch({
            type:'Application/fenye',
            payload:{pageSize, orderCode, warehouseName, supplierName, startDate, endDate, orderStatus, billStatus,orderType}
        })
    };
    const onChange=(page:number,pageSize:number)=>{
        setPage(page);
        setPageSize(pageSize);
    };
    useEffect(() => {
        getFenye();
    }, []);
    useEffect(() => {
        getList();
    }, [page,pageSize]);
    const delOk=()=>{
        setSpinning(true);
        props.dispatch({
            type:'Application/remove',
            payload:dUid,
        }).then((res:TypeErrorCode)=>{
            setSpinning(false);
            if(res.ErrorCode===0){
                message.success('删除成功');
                setDOpen(false);
            }else{
                message.error(res.Data);
                setSpinning(false);
            }
        })
    };
    return(
      <Spin spinning={spinning}>
          <List>
              <List.Item>
                  <Space>
                      <Button type="primary" onClick={toAdd}>
                          新增采购单
                      </Button>
                  </Space>
                  <Space>
                      <Input
                          addonBefore="仓库名称:"
                      />
                      <Input
                          addonBefore="单号:"
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
                          <DatePicker.RangePicker/>
                      </Space.Compact>
                      <Button type="primary" >
                          搜索
                      </Button>
                  </Space>
              </List.Item>
          </List>
          <Table
              columns={columns}
              style={{border:'1px solid #ddd',borderRadius:'4px'}}
              pagination={false}
              scroll={{y:'60vh'}}
              dataSource={props.list}
              rowKey={(columns) => columns.id}
              size='small'
          />
          {props.count?<Pagination total={props.count.count} showSizeChanger pageSize={pageSize} current={page}  onChange={onChange} pageSizeOptions={[50,100,500,1000,10000]}/>:''}
          <Modal title="删除确认" open={dOpne} onOk={()=>delOk()} onCancel={()=>setDOpen(false)} loading={spinning}>
              是否要删除?
          </Modal>
      </Spin>
    )
}
const mapStateToProps = (state: any) => ({
    list: state.Application.list,
    count: state.Application.count,
});
export default connect(mapStateToProps)(Application);
