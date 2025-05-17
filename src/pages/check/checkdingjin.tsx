import * as ContractTypeService from "@/services/contractType";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {useEffect, useState} from "react";
import {Button, Input, message, Modal} from "antd";
import * as StaffServer from "@/services/staff";
import dayjs from "dayjs";
import * as CustomService from "@/services/custom";
import * as UnitService from "@/services/unit";
import html2pdf from "html2pdf.js";
import {numberToRMB} from "@/utils/OpenTool";
import {oneOne} from "@/services/staff";

const Checkdingjin=()=>{
    const templateType=1;
    // 客户列表
    const [kehuList,setKehuList]=useState([]);
    // 单元列表
    const [unitList,setUnitList]=useState([]);
    // 开始时间
    const [startDate,setStartDate]=useState('');
    // 装修费
    const [decorationCost,setdecorationCost]=useState(0);
    // 结束时间
    const [endDate,setEndDate]=useState('');
    // 交付日
    const [deliveryDate,setdeliveryDate]=useState('');
    // 押金
    const [deposit,setdeposit]=useState(0);
    // 管理费
    const [manageFee,setmanageFee]=useState(0);
    const [formItems,setformItems]=useState([]);
    // 公司名称
    const [companyName,setCompanyName]=useState('');
    // 公司地址
    const [companyAddress,setCompanyAddress]=useState('');
    // 出租地址
    const [rentAddress,setrentAddress]=useState('')
    // 开户名称
    const [openName,setopenName]=useState('');
    // 开户银行
    const [openBank,setopenBank]=useState('');
    // 银行账号
    const [bankCard,setbankCard]=useState('');
    // 法定人
    const [legalPerson,setlegalPerson]=useState('');
    // 联系电话
    const [phone,setphone]=useState('');
    // 证件图片
    const [documentImage,setdocumentImage]=useState('');
    // 招商电话
    const [attractPhone,setattractPhone]=useState('');
    // 招商人
    const [attract,setattract]=useState('');
    // 招商微信号
    const [attractWXNumber,setattractWXNumber]=useState('');
    // 举报电话
    const [reportPhone,setreportPhone]=useState('');
    // 举报邮箱
    const [reportEmail,setreportEmail]=useState('');
    // 联系人
    const [contacts,setcontacts]=useState('');
    // 乙方地址
    const [office_area,setoffice_area]=useState('');
    // 承租方
    const [custom_name,setcustom_name]=useState('');
    // 乙方电话
    const [yiphone,setyiphone]=useState('');
    // 单元名称
    const [unit_name,setunit_name]=useState('');
    // 单元可租面积
    const [rentable_area,setrentable_area]=useState(0);
    // 单元类型
    const [unit_type,setunit_type]=useState(0);
    // 主体
    const [businessEntity,setbusinessEntity]=useState('');
    // 经营范围
    const [businessScope,setbusinessScope]=useState('');
    // 乙方派遣人
    const [dispatchName,setdispatchName]=useState('');
    // 派遣人身份证
    const [dispatchCard,setdispatchCard]=useState('');
    // 乙方公司
    const [customcompany_name,setcustomcompany_name]=useState('');
    // 客户身份证
    const [customCard,setcustomCard]=useState('');
    // 电价
    const [elePrice,setelePrice]=useState('');
    // 租金
    const [zuMoney,setzuMoney]=useState(0);
    // 房号
    const [unitName,setunitName]=useState('');
    const [isonpen,setisopen]=useState(false);
    // 图片显示的名字
    const [b64,setB64]=useState('');
    const getOne=()=>{
        ContractTypeService.one(templateType).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setCompanyName(res.Data.companyName);
                setCompanyAddress(res.Data.companyAddress);
                setopenName(res.Data.openName);
                setopenBank(res.Data.openBank);
                setbankCard(res.Data.bankCard);
                setlegalPerson(res.Data.legalPerson);
                setphone(res.Data.phone);
                setdocumentImage(res.Data.documentImage);
                setattractPhone(res.Data.attractPhone);
                setattractWXNumber(res.Data.attractWXNumber);
                setrentAddress(res.Data.rentAddress);
                setreportPhone(res.Data.attractWXNumber);
            }else {

            }
        })
    };
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        getContrantez(id);
    }, []);
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


    // 获取合同详情
    const getContrantez=(oneID)=>{
        StaffServer.oneOne(oneID).then((res:TypeErrorCode)=>{
            console.log('详情',res)
            if (res.ErrorCode==0){
                setbusinessEntity(res.Data[0].businessEntity);
                setbusinessScope(res.Data[0].businessScope);
                setStartDate(dayjs(res.Data[0].beginTime).format("YYYY-MM-DD"));
                setEndDate(dayjs(res.Data[0].endTime).format("YYYY-MM-DD"));
                setdeliveryDate(dayjs(res.Data[0].deliveryDate).format("YYYY-MM-DD"));
                setdeposit(res.Data[0].deposit);
                setmanageFee(res.Data[0].manageFee);
                setdecorationCost(res.Data[0].decorationCost);
                setdispatchName(res.Data[0].dispatchName);
                setdispatchCard(res.Data[0].dispatchCard);
                setcustomCard(res.Data[0].customCard);
                setelePrice(res.Data[0].elePrice);
                setzuMoney(res.Data[0].zuMoney);
                setunit_name(res.Data[0].unit_name);
                setrentable_area(res.Data[0].rentable_area);
                setunit_type(res.Data[0].unit_type);
                setoffice_area(res.Data[0].office_area);
                setcustom_name(res.Data[0].customName);
                // setyiphone(res.Data.phone);
                setcustomcompany_name(res.Data[0].customCompany);
                setCompanyName(res.Data[0].companyName);
                setCompanyAddress(res.Data[0].companyAddress);
                setopenName(res.Data[0].openName);
                setopenBank(res.Data[0].openBank);
                setbankCard(res.Data[0].bankCard);
                setlegalPerson(res.Data[0].legalPerson);
                setphone(res.Data[0].phone);
                setdocumentImage(res.Data[0].documentImage);
                setattractPhone(res.Data[0].attractPhone);
                setattractWXNumber(res.Data[0].attractWXNumber);
                setrentAddress(res.Data[0].rentAddress);
                setreportPhone(res.Data[0].attractWXNumber);
                setunitName(res.Data[0].unitName);
            }else {
                message.error(res.Data);
            }
        })
    };
    return(
        <div>
            <div>
                <Button type='primary' onClick={()=>setisopen(true)}>预览PDF</Button>
            </div>
            <div className="receipt-container">
                <h1 style={{textAlign:'center'}}>定金合同</h1>
                <div className="receipt-info">
                    <p>甲方（付款方）：{customcompany_name}</p>
                    <p>乙方（收款方）：{companyName}</p>
                    <p style={{marginLeft:'30px'}}>甲、乙双方因甲方拟租赁乙方商铺事宜，双方经协商一致，就定金担保事宜达成如下协议:</p>
                    <p style={{marginLeft:'30px'}}>第一条：{custom_name}已详细了解要签署的主合同并已知首年租金（大写）<span >{numberToRMB(zuMoney)}</span>，租赁地址位于{rentAddress}
                        {unitName}
                        号的物业。
                    </p>
                    <p style={{marginLeft:'30px'}}>第二条:甲方应在本合同签订之日向乙方一次性支付交付定金{deposit}元整，乙方收款账户如下：</p>
                    <p style={{marginLeft:'50px'}}>开户名称:{openName}</p>
                    <p style={{marginLeft:'50px'}}>开户银行:{openBank}</p>
                    <p style={{marginLeft:'50px'}}>银行账号:{bankCard}</p>
                    <p style={{marginLeft:'30px'}}>第三条:本合同生效后，甲、乙任何一方不得擅自变更或解除，除非使双方协商一致并达成书面协议。</p>
                    <p style={{marginLeft:'30px'}}>第四条:甲方履行主合同义务（主合同即甲乙双方签订的《租赁合同》，该租赁合同自收到<span style={{color:'red'}}>甲方</span>定金后3日内签订，租赁合同的全文及其租赁物业的状况、位置、押金数额、租金数额及其支付方式<span style={{color:'red'}}>甲乙</span>均已详细知晓）后，乙方应返还定金或以该定金冲抵甲方应付乙方款项(押金或租金)。</p>
                    <p style={{marginLeft:'30px'}}>第五条:因甲方原因逾期不签订主合同或不履行主合同，无权要求返还定金；乙方不履行主合同，应当双倍返还定金。定金罚则的执行，不影响任何一方要求赔偿的权利。</p>
                    <p style={{marginLeft:'30px'}}>第六条:本合同经双方签章自定金交付之日起生效，一式两份；双方各执一份，具有同等法律效力。</p>
                    <p style={{marginLeft:'30px'}}>签订地点：{rentAddress}</p>
                    <p style={{marginLeft:'30px'}}><span style={{marginRight:'100px'}}>甲方 :{customcompany_name}</span><span>乙方:{companyName}</span></p>
                    <p style={{marginLeft:'30px'}}><span style={{marginRight:'100px'}}>签订日期 :<span style={{color:"red"}}></span></span><span>签订日期:<span style={{color:'red'}}></span></span></p>
                </div>
            </div>

            <Modal open={isonpen}  onCancel={()=>setisopen(false)} width={800} footer={[
                <Button onClick={onOk} type='primary'>下载PDF</Button>
            ]}>
                <div className="receipt-container" id='pdf-content'>
                    <h1 style={{textAlign:'center'}}>定金合同</h1>
                    <div className="receipt-info">
                        <p>甲方（付款方）：{customcompany_name}</p>
                        <p>乙方（收款方）：{companyName}</p>
                        <p style={{marginLeft:'30px'}}>甲、乙双方因甲方拟租赁乙方商铺事宜，双方经协商一致，就定金担保事宜达成如下协议:</p>
                        <p style={{marginLeft:'30px'}}>第一条：{custom_name}已详细了解要签署的主合同并已知首年租金（大写）<span >{numberToRMB(zuMoney)}</span>，租赁地址位于{rentAddress}
                            {unitName}
                            号的物业。
                        </p>
                        <p style={{marginLeft:'30px'}}>第二条:甲方应在本合同签订之日向乙方一次性支付交付定金{deposit}元整，乙方收款账户如下：</p>
                        <p style={{marginLeft:'50px'}}>开户名称:{openName}</p>
                        <p style={{marginLeft:'50px'}}>开户银行:{openBank}</p>
                        <p style={{marginLeft:'50px'}}>银行账号:{bankCard}</p>
                        <p style={{marginLeft:'30px'}}>第三条:本合同生效后，甲、乙任何一方不得擅自变更或解除，除非使双方协商一致并达成书面协议。</p>
                        <p style={{marginLeft:'30px'}}>第四条:甲方履行主合同义务（主合同即甲乙双方签订的《租赁合同》，该租赁合同自收到<span style={{color:'red'}}>甲方</span>定金后3日内签订，租赁合同的全文及其租赁物业的状况、位置、押金数额、租金数额及其支付方式<span style={{color:'red'}}>甲乙</span>均已详细知晓）后，乙方应返还定金或以该定金冲抵甲方应付乙方款项(押金或租金)。</p>
                        <p style={{marginLeft:'30px'}}>第五条:因甲方原因逾期不签订主合同或不履行主合同，无权要求返还定金；乙方不履行主合同，应当双倍返还定金。定金罚则的执行，不影响任何一方要求赔偿的权利。</p>
                        <p style={{marginLeft:'30px'}}>第六条:本合同经双方签章自定金交付之日起生效，一式两份；双方各执一份，具有同等法律效力。</p>
                        <p style={{marginLeft:'30px'}}>签订地点：{rentAddress}</p>
                        <p style={{marginLeft:'30px'}}><span style={{marginRight:'100px'}}>甲方 :{customcompany_name}</span><span>乙方:{companyName}</span></p>
                        <p style={{marginLeft:'30px'}}><span style={{marginRight:'100px'}}>签订日期 :<span style={{color:"red"}}></span></span><span>签订日期:<span style={{color:'red'}}></span></span></p>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
export default Checkdingjin