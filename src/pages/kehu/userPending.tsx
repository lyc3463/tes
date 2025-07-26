import {connect} from "umi";
import {useEffect, useState} from "react";
import {Button, Input, List, Space, Table} from "antd";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {checkSessionStorage, updateSessionStorage} from "@/utils/OpenTool";

const UserPending=(props)=>{
    const [phone,setPhone]=useState(checkSessionStorage('/kehu/userPending','phone')||'');
    const [name,setName]=useState(checkSessionStorage('/kehu/userPending','name')||'');
    const [balance,setbalance]=useState(0);  // 余额总数
    const [billMoney,setbillMoney]=useState(0);  // 账单总数
    const calculateSums=(sumDate)=>{
        // 初始化四个求和变量
        let balance = 0;
        let billMoney = 0;
        // 遍历数组，累加每个属性的值
        sumDate.map(transaction => {
            balance += transaction.balance|| 0; // 使用||0确保未定义或null值不会破坏计算
            billMoney += transaction.billMoney || 0;
        });
        // 返回一个对象，包含四个求和结果
        return {
            balance: balance.toFixed(2)*1,
            billMoney: billMoney.toFixed(2)*1,
        };
    };
    const shousuo=()=>{
        getList();
    };
    const getList=()=>{
        props.dispatch({
            type:'UserPending/fetch',
            payload:{name,phone}
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                let sum=calculateSums(res.Data);
                setbalance(sum.balance);
                setbillMoney(sum.billMoney);
            }
        })
    };
    const changeName=(e)=>{
        setName(e.target.value);
        updateSessionStorage('/kehu/userPending','name',e.target.value);

    };
    const changePhone=(e)=>{
        setPhone(e.target.value);
        updateSessionStorage('/kehu/userPending','phone',e.target.value);

    };
    useEffect(() => {
        getList();
    }, []);
    const columns =[
        {
            title: '姓名',
            dataIndex: 'user_name',
            key: 'user_name',
        },
        {
            title: '联系方式',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: '余额(元)',
            dataIndex: 'balance',
            key: 'balance',
            render:(text:any,record:any,)=>{
                return(
                    <div>
                        {record.balance.toFixed(2)}元
                    </div>
                )
            }
        },
        {
            title: '全部账单(元)',
            dataIndex: 'billMoney',
            key: 'billMoney',
            render:(text:any,record:any,)=>{
                return(
                    <div>
                        {record.billMoney.toFixed(2)}元
                    </div>
                )
            }
        },
    ];
    return(
        <>
            <List>
                <List.Item>
                    <Space>
                        <Input
                            addonBefore="姓名:"
                            onChange={changeName}
                            value={name}
                        />
                        <Input
                            addonBefore="手机号:"
                            onChange={changePhone}
                            value={phone}
                        />
                        <Button type="primary" onClick={shousuo}>
                            搜索
                        </Button>
                        <span>余额总数:{balance}元</span>
                        <span>账单总数:{billMoney}元</span>
                    </Space>
                </List.Item>
            </List>
            <Table
                style={{border:'1px solid #ddd',borderRadius:'4px'}}
                columns={columns}
                size='small'
                rowKey={(columns) => columns.id}
                dataSource={props.UserPendingList}
                scroll={{x:1500,y:'60vh'}}
                pagination={false}
            />
        </>
    )
}
const mapStateToProps = (state: any) => {
    return {
        UserPendingList: state.UserPending.list,
    }
};
export default connect(mapStateToProps) (UserPending);