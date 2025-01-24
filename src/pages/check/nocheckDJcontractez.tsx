import * as ContractTypeService from "@/services/contractType";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {useEffect, useRef, useState} from "react";
import {Button, Input, InputNumber, message, Modal} from "antd";
import * as StaffServer from "@/services/staff";
import dayjs from "dayjs";
import * as CustomService from "@/services/custom";
import * as UnitService from "@/services/unit";
import html2pdf from "html2pdf.js";
import {connect} from 'umi';
import {numberToRMB, getUnitNamesByIds, getUserNamesById} from "@/utils/OpenTool";

const NocheckDJcontractez=(props)=>{
    const templateType=1;
    const [uid,setUid]=useState('');
    // 房屋ID
    const [house_id,setsethouse_id]=useState(0);
    // 签订日
    const [dayDate,setDayDate]=useState('');
    // 合同类型
    const [contractTypeid,setcontractTypeid]=useState(0);
    // 单元列表id
    const [unitarrList,setUnitarrList]=useState([]);
    // 房屋列表
    const [houseList,sethouseList]=useState([]);
    // 单元列表
    const [unitList,setUnitList]=useState([]);
    // 预览弹窗
    const [isonpen,setisopen]=useState(false);
    // 合同模板公司名称
    const [companyName,setCompanyName]=useState('');
    // 合同模板公司地址
    const [companyAddress,setCompanyAddress]=useState('');
    // 合同模板出租地址
    const [rentAddress,setrentAddress]=useState('')
    // 合同模板开户名称
    const [openName,setopenName]=useState('');
    // 合同模板开户银行
    const [openBank,setopenBank]=useState('');
    // 合同模板银行账号
    const [bankCard,setbankCard]=useState('');
    // 合同模板法定人
    const [legalPerson,setlegalPerson]=useState('');
    // 合同模板联系电话
    const [phone,setphone]=useState('');
    // 租金
    const [zuMoney,setzuMoney]=useState(0);
    // 客户id
    const [clientId,setclientId]=useState(0);
    // 客户列表
    const [clientList,setclientList]=useState([]);
    // 押金
    const [deposit,setdeposit]=useState(0);
    const getOneStaff= (id:string)=>{
        StaffServer.onedj(id).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                console.log('定金合同详情',res);
                setsethouse_id(res.Data[0].houseId);
                setzuMoney(res.Data[0].zuMoney);
                setdeposit(res.Data[0].deposit);
                setclientId(res.Data[0].clientId);
                setDayDate(dayjs(res.Data[0].beginTime).format("YYYY-MM-DD"));
                setcontractTypeid(res.Data[0].contractType);
                setUnitarrList(res.Data[1]);
            }else {
                message.error(res.Data);
            }
        })
    };
    // 定金合同模板详情
    const getDjOne=()=>{
        ContractTypeService.one(templateType).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                console.log('定金合同模板',res);
                setUid(res.Data.id);
                setCompanyName(res.Data.companyName);
                setCompanyAddress(res.Data.companyAddress);
                setopenName(res.Data.openName);
                setopenBank(res.Data.openBank);
                setbankCard(res.Data.bankCard);
                setlegalPerson(res.Data.legalPerson);
                setphone(res.Data.phone);
                setrentAddress(res.Data.rentAddress);
            }
        })
    };
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        setUid(id);
        getOneStaff(id);
        getHouseList();
        getUnitList();
        getCheckCompanyList();
        getDjOne();
    }, []);
    // 获取房屋列表
    const getHouseList=()=>{
        props.dispatch({
            type:'House/fetch'
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                console.log('房屋列表',res);
                sethouseList(res.Data);
            }else {
                message.error(res.Data)
            }
        })
    };
    // 获取单元列表
    const getUnitList=()=>{
        props.dispatch({
            type:'Unit/fetch',
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                console.log('单元列表',res);
                setUnitList(res.Data);
            }else {
                message.error(res.Data);
            }
        })
    };
    // 获取客户列表
    const getCheckCompanyList=()=>{
        props.dispatch({
            type:'CheckCompany/fetch'
        }).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                console.log('客户列表',res);
                setclientList(res.Data);
            }
        });
    };
    // 下载pdf
    const onOk = async () => {
        const element = document.getElementById("pdf-content");
        const options = {
            margin: 15,
            filename: "document.pdf",
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        };
        html2pdf().from(element).set(options).save();
    };
    return(
        <div>
            <div>
                <Button type='primary' onClick={()=>setisopen(true)}>预览PDF</Button>
            </div>
            <div className="receipt-container">
                <h1 style={{textAlign:'center'}}>定金合同(浏览版)</h1>
                <div className="receipt-info">
                    <p>甲方（付款方）：{getUserNamesById(clientList,clientId)}</p>
                    {/*<p>甲方（付款方）：{}</p>*/}
                    <p>乙方（收款方）：{companyName}</p>
                    <p style={{marginLeft:'30px'}}>甲、乙双方因甲方拟租赁乙方商铺事宜，双方经协商一致，就定金担保事宜达成如下协议:</p>
                    <p style={{marginLeft:'30px'}}>第一条：{getUserNamesById(clientList,clientId)}已详细了解要签署的主合同并已知首年租金（大写）<span >{numberToRMB(zuMoney)}</span>，租赁地址位于{rentAddress}
                        {getUnitNamesByIds(unitList,unitarrList)}号的物业。
                    </p>
                    <p style={{marginLeft:'30px'}}>第二条:甲方应在本合同签订之日向乙方一次性支付交付定金{deposit}元整，乙方收款账户如下：</p>
                    <p style={{marginLeft:'50px'}}>开户名称:{openName}</p>
                    <p style={{marginLeft:'50px'}}>开户银行:{openBank}</p>
                    <p style={{marginLeft:'50px'}}>银行账号:{bankCard}</p>
                    <p style={{marginLeft:'30px'}}>第三条:本合同生效后，甲、乙任何一方不得擅自变更或解除，除非使双方协商一致并达成书面协议。</p>
                    <p style={{marginLeft:'30px'}}>第四条:甲方履行主合同义务（主合同即甲乙双方签订的《租赁合同》，该租赁合同自收到甲方定金后3日内签订，租赁合同的全文及其租赁物业的状况、位置、押金数额、租金数额及其支付方式<span style={{color:'red'}}>甲乙</span>均已详细知晓）后，乙方应返还定金或以该定金冲抵甲方应付乙方款项(押金或租金)。</p>
                    <p style={{marginLeft:'30px'}}>第五条:因甲方原因逾期不签订主合同或不履行主合同，无权要求返还定金；乙方不履行主合同，应当双倍返还定金。定金罚则的执行，不影响任何一方要求赔偿的权利。</p>
                    <p style={{marginLeft:'30px'}}>第六条:本合同经双方签章自定金交付之日起生效，一式两份；双方各执一份，具有同等法律效力。</p>
                    <p style={{marginLeft:'30px'}}>签订地点：{rentAddress}</p>
                    <p style={{marginLeft:'30px'}}><span style={{marginRight:'100px'}}>甲方 :{getUserNamesById(clientList,clientId)}</span><span>乙方:{companyName}</span></p>
                    <p style={{marginLeft:'30px'}}><span style={{marginRight:'100px'}}>签订日期 :<span style={{color:"red"}}></span></span><span>签订日期:<span style={{color:'red'}}></span></span></p>
                </div>
            </div>

            <Modal open={isonpen}  onCancel={()=>setisopen(false)} width={800} footer={[
                <Button onClick={onOk} type='primary'>下载PDF</Button>
            ]}>
                <div className="receipt-container" id='pdf-content'>
                    <h1 style={{textAlign:'center'}}>定金合同(浏览版)</h1>
                    <div className="receipt-info">
                        <p>甲方（付款方）：{getUserNamesById(clientList,clientId)}</p>
                        {/*<p>甲方（付款方）：{}</p>*/}
                        <p>乙方（收款方）：{companyName}</p>
                        <p style={{marginLeft:'30px'}}>甲、乙双方因甲方拟租赁乙方商铺事宜，双方经协商一致，就定金担保事宜达成如下协议:</p>
                        <p style={{marginLeft:'30px'}}>第一条：{getUserNamesById(clientList,clientId)}已详细了解要签署的主合同并已知首年租金（大写）<span >{numberToRMB(zuMoney)}</span>，租赁地址位于{rentAddress}
                            {getUnitNamesByIds(unitList,unitarrList)}
                            号的物业。
                        </p>
                        <p style={{marginLeft:'30px'}}>第二条:甲方应在本合同签订之日向乙方一次性支付交付定金{deposit}元整，乙方收款账户如下：</p>
                        <p style={{marginLeft:'50px'}}>开户名称:{openName}</p>
                        <p style={{marginLeft:'50px'}}>开户银行:{openBank}</p>
                        <p style={{marginLeft:'50px'}}>银行账号:{bankCard}</p>
                        <p style={{marginLeft:'30px'}}>第三条:本合同生效后，甲、乙任何一方不得擅自变更或解除，除非使双方协商一致并达成书面协议。</p>
                        <p style={{marginLeft:'30px'}}>第四条:甲方履行主合同义务（主合同即甲乙双方签订的《租赁合同》，该租赁合同自收到甲方定金后3日内签订，租赁合同的全文及其租赁物业的状况、位置、押金数额、租金数额及其支付方式甲乙均已详细知晓）后，乙方应返还定金或以该定金冲抵甲方应付乙方款项(押金或租金)。</p>
                        <p style={{marginLeft:'30px'}}>第五条:因甲方原因逾期不签订主合同或不履行主合同，无权要求返还定金；乙方不履行主合同，应当双倍返还定金。定金罚则的执行，不影响任何一方要求赔偿的权利。</p>
                        <p style={{marginLeft:'30px'}}>第六条:本合同经双方签章自定金交付之日起生效，一式两份；双方各执一份，具有同等法律效力。</p>
                        <p style={{marginLeft:'30px'}}>签订地点：{rentAddress}</p>
                        <p style={{marginLeft:'30px'}}><span style={{marginRight:'100px'}}>甲方 :{getUserNamesById(clientList,clientId)}</span><span>乙方:{companyName}</span></p>
                        <p style={{marginLeft:'30px'}}><span style={{marginRight:'100px'}}>签订日期 :<span style={{color:"red"}}></span></span><span>签订日期:<span style={{color:'red'}}></span></span></p>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
export default connect() (NocheckDJcontractez)