import React, {useEffect, useState} from 'react';
import {Button, Card, Input, InputNumber, message, Select, Spin} from 'antd';
import {connect} from "umi";
import * as processConfiguration from '@/services/processConfiguration';
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import './approvalFlow.less';

const ProcessConfiguration = (props:any) => {
    const [uid,setUid]=useState(0);
    // const [reviewer1,setReviewer1]=useState([]); // 会计
    // const [reviewer2,setReviewer2]=useState([]); // 领导
    // const [reviewer3,setReviewer3]=useState([]);// 出纳

    const [title1,setTitle1] = useState('审核人1')
    const [reviewer1,setReviewer1] = useState([])

    const [title2,setTitle2] = useState('审核人2')
    const [reviewer2,setReviewer2] = useState([])

    const [title3,setTitle3] = useState('审核人3')
    const [reviewer3,setReviewer3] = useState([])

    const [title4,setTitle4] = useState('审核人4')
    const [reviewer4,setReviewer4] = useState([])

    const [title5,setTitle5] = useState('审核人5')
    const [reviewer5,setReviewer5] = useState([])

    const [title6,setTitle6] = useState('审核人6')
    const [reviewer6,setReviewer6] = useState([])

    const [title7,setTitle7] = useState('审核人7')
    const [reviewer7,setReviewer7] = useState([])

    const [title8,setTitle8] = useState('审核人8')
    const [reviewer8,setReviewer8] = useState([])

    const [title9,setTitle9] = useState('审核人9')
    const [reviewer9,setReviewer9] = useState([])

    const [title10,setTitle10] = useState('审核人10')
    const [reviewer10,setReviewer10] = useState([])

    const [amount1,setAmount1] = useState<number | string>('')
    const [amount2,setAmount2] = useState<number | string>('')
    const [amount3,setAmount3] = useState<number | string>('')
    const [amount4,setAmount4] = useState<number | string>('')
    const [amount5,setAmount5] = useState<number | string>('')
    const [amount6,setAmount6] = useState<number | string>('')
    const [amount7,setAmount7] = useState<number | string>('')
    const [amount8,setAmount8] = useState<number | string>('')
    const [amount9,setAmount9] = useState<number | string>('')
    const [amount10,setAmount10] = useState<number | string>('')

    const [title11,setTitle11] = useState('发起人')
    const [reviewer11,setReviewer11] = useState([])

    const [title12,setTitle12] = useState('抄送人')
    const [reviewer12,setReviewer12] = useState([])

    const [spinning,setspinning]=useState(false);
    const getProcessConfiguration=()=>{
        setspinning(true);
        processConfiguration.one().then((res:TypeErrorCode)=>{
            setUid(res.Data.id);
            if (res.ErrorCode==0){
                if (res.Data.reviewer1 && res.Data.reviewer1.trim() !== '') {
                    setReviewer1(res.Data.reviewer1.split('|').map(Number));
                } else {
                    // 为空时重置成空数组，避免出现 [0]
                    setReviewer1([]);
                }
                if (res.Data.reviewer2 && res.Data.reviewer2.trim() !== '') {
                    setReviewer2(res.Data.reviewer2.split('|').map(Number));
                } else {
                    // 为空时重置成空数组，避免出现 [0]
                    setReviewer2([]);
                }
                if (res.Data.reviewer3 && res.Data.reviewer3.trim() !== '') {
                    setReviewer3(res.Data.reviewer3.split('|').map(Number));
                } else {
                    // 为空时重置成空数组，避免出现 [0]
                    setReviewer3([]);
                }
                if (res.Data.reviewer4 && res.Data.reviewer4.trim() !== '') {
                    setReviewer4(res.Data.reviewer4.split('|').map(Number));
                } else {
                    // 为空时重置成空数组，避免出现 [0]
                    setReviewer4([]);
                }
                if (res.Data.reviewer5 && res.Data.reviewer5.trim() !== '') {
                    setReviewer5(res.Data.reviewer5.split('|').map(Number));
                } else {
                    // 为空时重置成空数组，避免出现 [0]
                    setReviewer5([]);
                }
                if (res.Data.reviewer6 && res.Data.reviewer6.trim() !== '') {
                    setReviewer6(res.Data.reviewer6.split('|').map(Number));
                } else {
                    // 为空时重置成空数组，避免出现 [0]
                    setReviewer6([]);
                }
                if (res.Data.reviewer7 && res.Data.reviewer7.trim() !== '') {
                    setReviewer7(res.Data.reviewer7.split('|').map(Number));
                } else {
                    // 为空时重置成空数组，避免出现 [0]
                    setReviewer7([]);
                }
                if (res.Data.reviewer8 && res.Data.reviewer8.trim() !== '') {
                    setReviewer8(res.Data.reviewer8.split('|').map(Number));
                } else {
                    // 为空时重置成空数组，避免出现 [0]
                    setReviewer8([]);
                }
                if (res.Data.reviewer9 && res.Data.reviewer9.trim() !== '') {
                    setReviewer9(res.Data.reviewer9.split('|').map(Number));
                } else {
                    // 为空时重置成空数组，避免出现 [0]
                    setReviewer9([]);
                }
                if (res.Data.reviewer10 && res.Data.reviewer10.trim() !== '') {
                    setReviewer10(res.Data.reviewer10.split('|').map(Number));
                } else {
                    // 为空时重置成空数组，避免出现 [0]
                    setReviewer10([]);
                }
                if (res.Data.reviewer11 && res.Data.reviewer11.trim() !== '') {
                    setReviewer11(res.Data.reviewer11.split('|').map(Number));
                } else {
                    // 为空时重置成空数组，避免出现 [0]
                    setReviewer11([]);
                }
                if (res.Data.carbonCopy && res.Data.carbonCopy.trim() !== '') {
                    setReviewer12(res.Data.carbonCopy.split('|').map(Number));
                } else {
                    // 为空时重置成空数组，避免出现 [0]
                    setReviewer12([]);
                }
                if (res.Data.rpName1 !== null) {
                    setTitle1(res.Data.rpName1);
                }
                if (res.Data.rpName2 !== null) {
                    setTitle2(res.Data.rpName2);
                }
                if (res.Data.rpName3 !== null) {
                    setTitle3(res.Data.rpName3);
                }
                if (res.Data.rpName4 !== null) {
                    setTitle4(res.Data.rpName4);
                }
                if (res.Data.rpName5 !== null) {
                    setTitle5(res.Data.rpName5);
                }
                if (res.Data.rpName6 !== null) {
                    setTitle6(res.Data.rpName6);
                }
                if (res.Data.rpName7 !== null) {
                    setTitle7(res.Data.rpName7);
                }
                if (res.Data.rpName8 !== null) {
                    setTitle8(res.Data.rpName8);
                }
                if (res.Data.rpName9 !== null) {
                    setTitle9(res.Data.rpName9);
                }
                if (res.Data.rpName10 !== null) {
                    setTitle10(res.Data.rpName10);
                }
                if (res.Data.amount1 !== undefined && res.Data.amount1 !== null && res.Data.amount1 !== '') {
                    setAmount1(res.Data.amount1);
                } else { setAmount1(''); }
                if (res.Data.amount2 !== undefined && res.Data.amount2 !== null && res.Data.amount2 !== '') {
                    setAmount2(res.Data.amount2);
                } else { setAmount2(''); }
                if (res.Data.amount3 !== undefined && res.Data.amount3 !== null && res.Data.amount3 !== '') {
                    setAmount3(res.Data.amount3);
                } else { setAmount3(''); }
                if (res.Data.amount4 !== undefined && res.Data.amount4 !== null && res.Data.amount4 !== '') {
                    setAmount4(res.Data.amount4);
                } else { setAmount4(''); }
                if (res.Data.amount5 !== undefined && res.Data.amount5 !== null && res.Data.amount5 !== '') {
                    setAmount5(res.Data.amount5);
                } else { setAmount5(''); }
                if (res.Data.amount6 !== undefined && res.Data.amount6 !== null && res.Data.amount6 !== '') {
                    setAmount6(res.Data.amount6);
                } else { setAmount6(''); }
                if (res.Data.amount7 !== undefined && res.Data.amount7 !== null && res.Data.amount7 !== '') {
                    setAmount7(res.Data.amount7);
                } else { setAmount7(''); }
                if (res.Data.amount8 !== undefined && res.Data.amount8 !== null && res.Data.amount8 !== '') {
                    setAmount8(res.Data.amount8);
                } else { setAmount8(''); }
                if (res.Data.amount9 !== undefined && res.Data.amount9 !== null && res.Data.amount9 !== '') {
                    setAmount9(res.Data.amount9);
                } else { setAmount9(''); }
                if (res.Data.amount10 !== undefined && res.Data.amount10 !== null && res.Data.amount10 !== '') {
                    setAmount10(res.Data.amount10);
                } else { setAmount10(''); }
            }else {
                message.error(res.Data);
            }
            setspinning(false);
        })
    };
    const getUserList=()=>{
        props.dispatch({
            type:"Users/fetch",
        })
    };
    // const onSave=()=>{
    //     if (uid>0){
    //         editProcessConfiguration();
    //     }else {
    //         addProcessConfiguration();
    //     }
    // };
    // 编辑
    const editProcessConfiguration=()=>{
        setspinning(true);
        processConfiguration.edit({
            reviewer1: reviewer1.join('|'),
            reviewer2: reviewer2.join('|'),
            reviewer3: reviewer3.join('|'),
            reviewer4: reviewer4.join('|'),
            reviewer5: reviewer5.join('|'),
            reviewer6: reviewer6.join('|'),
            reviewer7: reviewer7.join('|'),
            reviewer8: reviewer8.join('|'),
            reviewer9: reviewer9.join('|'),
            reviewer10: reviewer10.join('|'),
            reviewer11: reviewer11.join('|'),
            carbonCopy: reviewer12.join('|'),
            rpName1: title1,
            rpName2: title2,
            rpName3: title3,
            rpName4: title4,
            rpName5: title5,
            rpName6: title6,
            rpName7: title7,
            rpName8: title8,
            rpName9: title9,
            rpName10: title10,
            amount1, amount2, amount3, amount4, amount5,
            amount6, amount7, amount8, amount9, amount10,
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                getProcessConfiguration();
                message.success('保存成功');
            }else {
                message.error(res.Data);
            }
            setspinning(false);
        })
    }
    // 添加
    const addProcessConfiguration=()=>{
        setspinning(true);
        processConfiguration.add({
            reviewer1: reviewer1.join('|'),
            reviewer2: reviewer2.join('|'),
            reviewer3: reviewer3.join('|'),
            reviewer4: reviewer4.join('|'),
            reviewer5: reviewer5.join('|'),
            reviewer6: reviewer6.join('|'),
            reviewer7: reviewer7.join('|'),
            reviewer8: reviewer8.join('|'),
            reviewer9: reviewer9.join('|'),
            reviewer10: reviewer10.join('|'),
            reviewer11: reviewer11.join('|'),
            carbonCopy: reviewer12.join('|'),
            rpName1: title1,
            rpName2: title2,
            rpName3: title3,
            rpName4: title4,
            rpName5: title5,
            rpName6: title6,
            rpName7: title7,
            rpName8: title8,
            rpName9: title9,
            rpName10: title10,
            amount1, amount2, amount3, amount4, amount5,
            amount6, amount7, amount8, amount9, amount10,
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                getProcessConfiguration();
                message.success('保存成功');
            }else {
                message.error(res.Data);
            }
            setspinning(false);
        })
    };
    useEffect(() => {
        getUserList();
        getProcessConfiguration();
    }, []);
    const changeReviewer1=(val:any)=>{
        setReviewer1(val);
    };
    const changeReviewer2=(val:any)=>{
        setReviewer2(val);
    };
    const changeReviewer3=(val:any)=>{
        setReviewer3(val);
    };

    const ReviewerSelect = ({ users, setUsers }) => (
        <Select
            mode="multiple"
            value={users}
            style={{ width:150 }}
            onChange={setUsers}
            showSearch
        >
            {props.UsersList?.map(u=>(
                <Option key={u.id} value={u.id}>{u.user_name}</Option>
            ))}
        </Select>
    );
    const onSave = ()=>{
        if (uid>0){
            editProcessConfiguration();
        }else {
            addProcessConfiguration();
        }
    }
    return (
        <Spin spinning={spinning}>
            <Card title="审批流程配置">
                <Button type="primary" onClick={onSave}>保存</Button>
                <div style={{ marginTop:20, display:'flex', flexDirection:'column', gap:20, alignItems:'center' }}>
                    <div className="start">开始</div>
                    <span style={{color:'#555'}}>注:请按照顺序来分配审核人,如您没那么多审核人分配可以留空，请不要间隔来分配</span>
                    <div className="down">↓</div>
                    {/* 第一行 */}
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
                            <Input value={title11} disabled style={{ width:150, marginBottom:6 }}/>
                            <ReviewerSelect users={reviewer11} setUsers={setReviewer11}/>
                        </div>
                        <div style={{ fontSize:28 }}>→</div>
                        <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
                            <Input value={title12} disabled style={{ width:150, marginBottom:6 }}/>
                            <ReviewerSelect users={reviewer12} setUsers={setReviewer12}/>
                        </div>
                        <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
                            <Input value={title1} onChange={e=>setTitle1(e.target.value)} style={{ width:150, marginBottom:6 }}/>
                            <ReviewerSelect users={reviewer1} setUsers={setReviewer1}/>
                            <InputNumber value={amount1} onChange={(v)=>setAmount1(v ?? '')} placeholder='金额' min={0} style={{ width:150, marginTop:6 }} addonAfter='元'/>
                        </div>
                        <div style={{ fontSize:28 }}>→</div>
                        <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
                            <Input value={title2} onChange={e=>setTitle2(e.target.value)} style={{ width:150, marginBottom:6 }}/>
                            <ReviewerSelect users={reviewer2} setUsers={setReviewer2}/>
                            <InputNumber value={amount2} onChange={(v)=>setAmount2(v ?? '')} placeholder='金额' min={0} style={{ width:150, marginTop:6 }} addonAfter='元'/>
                        </div>

                        <div style={{ fontSize:28 }}>↓</div>
                    </div>
                    {/* 第二行（蛇形反向） */}
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <div style={{ fontSize:28 }}>↓</div>

                        <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
                            <Input value={title6} onChange={e=>setTitle6(e.target.value)} style={{ width:150, marginBottom:6 }}/>
                            <ReviewerSelect users={reviewer6} setUsers={setReviewer6}/>
                            <InputNumber value={amount6} onChange={(v)=>setAmount6(v ?? '')} placeholder='金额' min={0} style={{ width:150, marginTop:6 }} addonAfter='元'/>
                        </div>
                        <div style={{ fontSize:28 }}>←</div>
                        <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
                            <Input value={title5} onChange={e=>setTitle5(e.target.value)} style={{ width:150, marginBottom:6 }}/>
                            <ReviewerSelect users={reviewer5} setUsers={setReviewer5}/>
                            <InputNumber value={amount5} onChange={(v)=>setAmount5(v ?? '')} placeholder='金额' min={0} style={{ width:150, marginTop:6 }} addonAfter='元'/>
                        </div>
                        <div style={{ fontSize:28 }}>←</div>
                        <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
                            <Input value={title4} onChange={e=>setTitle4(e.target.value)} style={{ width:150, marginBottom:6 }}/>
                            <ReviewerSelect users={reviewer4} setUsers={setReviewer4}/>
                            <InputNumber value={amount4} onChange={(v)=>setAmount4(v ?? '')} placeholder='金额' min={0} style={{ width:150, marginTop:6 }} addonAfter='元'/>
                        </div>
                        <div style={{ fontSize:28 }}>←</div>
                        <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
                            <Input value={title3} onChange={e=>setTitle3(e.target.value)} style={{ width:150, marginBottom:6 }}/>
                            <ReviewerSelect users={reviewer3} setUsers={setReviewer3}/>
                            <InputNumber value={amount3} onChange={(v)=>setAmount3(v ?? '')} placeholder='金额' min={0} style={{ width:150, marginTop:6 }} addonAfter='元'/>
                        </div>
                    </div>

                    {/* 第三行 */}
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>

                        <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
                            <Input value={title7} onChange={e=>setTitle7(e.target.value)} style={{ width:150, marginBottom:6 }}/>
                            <ReviewerSelect users={reviewer7} setUsers={setReviewer7}/>
                            <InputNumber value={amount7} onChange={(v)=>setAmount7(v ?? '')} placeholder='金额' min={0} style={{ width:150, marginTop:6 }} addonAfter='元'/>
                        </div>
                        <div style={{ fontSize:28 }}>→</div>
                        <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
                            <Input value={title8} onChange={e=>setTitle8(e.target.value)} style={{ width:150, marginBottom:6 }}/>
                            <ReviewerSelect users={reviewer8} setUsers={setReviewer8}/>
                            <InputNumber value={amount8} onChange={(v)=>setAmount8(v ?? '')} placeholder='金额' min={0} style={{ width:150, marginTop:6 }} addonAfter='元'/>
                        </div>
                        <div style={{ fontSize:28 }}>→</div>
                        <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
                            <Input value={title9} onChange={e=>setTitle9(e.target.value)} style={{ width:150, marginBottom:6 }}/>
                            <ReviewerSelect users={reviewer9} setUsers={setReviewer9}/>
                            <InputNumber value={amount9} onChange={(v)=>setAmount9(v ?? '')} placeholder='金额' min={0} style={{ width:150, marginTop:6 }} addonAfter='元'/>
                        </div>
                        <div style={{ fontSize:28 }}>→</div>
                        <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
                            <Input value={title10} onChange={e=>setTitle10(e.target.value)} style={{ width:150, marginBottom:6 }}/>
                            <ReviewerSelect users={reviewer10} setUsers={setReviewer10}/>
                            <InputNumber value={amount10} onChange={(v)=>setAmount10(v ?? '')} placeholder='金额' min={0} style={{ width:150, marginTop:6 }} addonAfter='元'/>
                        </div>
                    </div>
                    <div className="down">↓</div>
                    <div className="end">结束</div>
                </div>
            </Card>
        </Spin>
    );
};
const mapStateToProps = (state: any) => {
    return {
        UsersList: state.Users.list,
    }
};
export default connect(mapStateToProps) (ProcessConfiguration);
