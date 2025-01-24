import { useEffect, useRef, useState } from "react";
import * as StaffServer from "@/services/staff";
import dayjs from "dayjs";
import { connect } from "umi";
import {Form, Input, InputNumber, message, Select, DatePicker, Button, Table, Image, Modal, Space} from "antd";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import styles from "@/pages/contract/endContran.less";
import "@/pages/contract/endContran.less";
import * as ContractTypeService from "@/services/contractType";
import * as CustomService from "@/services/custom";
import * as UnitService from "@/services/unit";
import html2pdf from "html2pdf.js";
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";
import {numberToRMB, calculateTotalRentalDays, calculateYearsAndMonths} from "@/utils/OpenTool";
const tailLayout = {
    wrapperCol: { offset: 3 },
};
const Contractez = () => {
    let contractType = 2;
    const [isOpen,setisOpen]=useState(false);
    // 开始时间
    const [startDate, setStartDate] = useState('');
    // 装修费
    const [decorationCost, setdecorationCost] = useState(0);
    // 结束时间
    const [endDate, setEndDate] = useState('');
    // 交付日
    const [deliveryDate, setdeliveryDate] = useState('');
    // 押金
    const [deposit, setdeposit] = useState(0);
    // 管理费
    const [manageFee, setmanageFee] = useState(0);
    const [formItems, setformItems] = useState([]);
    // 公司名称
    const [companyName, setCompanyName] = useState('');
    // 公司地址
    const [companyAddress, setCompanyAddress] = useState('');
    // 出租地址
    const [rentAddress, setrentAddress] = useState('')
    // 开户名称
    const [openName, setopenName] = useState('');
    // 开户银行
    const [openBank, setopenBank] = useState('');
    // 银行账号
    const [bankCard, setbankCard] = useState('');
    // 法定人
    const [legalPerson, setlegalPerson] = useState('');
    // 联系电话
    const [phone, setphone] = useState('');
    // 出租房证件图片
    const [documentImage, setdocumentImage] = useState([]);
    // 招商电话
    const [attractPhone, setattractPhone] = useState('');
    // 招商人
    const [attract, setattract] = useState('');
    // 招商微信号
    const [attractWXNumber, setattractWXNumber] = useState('');
    // 举报电话
    const [reportPhone, setreportPhone] = useState('');
    // 举报邮箱
    const [reportEmail, setreportEmail] = useState('');
    // 联系人
    const [contacts, setcontacts] = useState('');
    // 乙方地址
    const [office_area, setoffice_area] = useState('');
    // 承租方
    const [custom_name, setcustom_name] = useState('');
    // 乙方电话
    const [yiphone, setyiphone] = useState('');
    // 单元名称
    const [unit_name, setunit_name] = useState('');
    // 单元可租面积
    const [rentable_area, setrentable_area] = useState(0);
    // 单元类型
    const [unit_type, setunit_type] = useState(0);
    // 主体
    const [businessEntity, setbusinessEntity] = useState('');
    // 经营范围
    const [businessScope, setbusinessScope] = useState('');
    // 乙方派遣人
    const [dispatchName, setdispatchName] = useState('');
    // 派遣人身份证
    const [dispatchCard, setdispatchCard] = useState('');
    // 乙方公司
    const [customcompany_name, setcustomcompany_name] = useState('');
    // 客户身份证
    const [customCard, setcustomCard] = useState('');
    // 电价
    const [elePrice, setelePrice] = useState('');
    // 免租期
    const [mzq,setmzq]=useState([]);
    // 租金
    const [zuMoney,setzuMoney]=useState(0);
    // 电费损耗
    const [eleloss,seteleloss]=useState(0);
    // 代缴电费
    const [elePice,setelePice]=useState(0);
    // 代缴水费
    const [waterPice,setwaterPice]=useState(0);
    // 管理费递增
    const [manageFeeRent,setmanageFeeRent]=useState(0);
    // 递增
    const [dz,setdz]=useState([]);
    // 物品清单
    const [wupinList,setwupinList]=useState([]);
    // 租户证件图片显示的名字
    const [b64, setB64] = useState([]);
    // 单元平面图
    const [unitImage,setunitImage]=useState([]);
    // 管理费押金
    const [depositFee,setdepositFee]=useState(0);
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('id');
        // getOneStaff(id);
        // getcontractTypeInfo();
        getContrantez(id);
    }, []);

    const columns = [
        {
            title: '租期',
            dataIndex: 'beginTime',
            key: 'beginTime',
            render:(text:any,record:any,)=>{
                return(
                      <p className={styles.linheP} >
                        {dayjs(record.beginTime).format("YYYY-MM-DD")}至{dayjs(record.endTime).format("YYYY-MM-DD")}
                    </p>
                )
            }
        },
        {
            title: '递增比例',
            dataIndex: 'incremental',
            key: 'incremental',
            render:(text:any,record:any,)=>{
                return(
                      <p className={styles.linheP} >
                        {record.incremental}%
                    </p>
                )
            }
        },
        {
            title: '月租金金额（人民币）',
            dataIndex: 'name',
            key: 'name',
            render:(text:any,record:any,)=>{
                return(
                      <p className={styles.linheP} >
                        {(((record.incremental/100)*zuMoney)+zuMoney).toFixed(2)}元
                    </p>
                )
            }
        },
    ];
    // 下载pdf
    const onOk = async () => {
        const element = document.getElementById("pdf-content");
        const options = {
            margin: 30,
            filename: `${customcompany_name}合同.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2,dpi:92 },
            // pagebreak:{
            //     mode: ['css', 'legacy','avoid-all'], // 启用分页支持
            //     before: '#page2el'
            // },
            // jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
            pagebreak: { before:'#page2el'}, // 启用分页支持
            // pagebreak: {
            //     mode: ['css', 'legacy','avoid-all'], // 启用分页支持
            //     before: '#page2el'       // 在特定元素前分页
            // },
            jsPDF: { unit: "pt", format: "a4", orientation: "portrait" },
        };
        html2pdf().from(element).set(options).save()
    };
    // 获取合同详情
    const getContrantez=(oneID)=>{
        StaffServer.oneOne(oneID).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                setCompanyName(res.Data[0].companyName);
                setCompanyAddress(res.Data[0].companyAddress);
                setopenName(res.Data[0].openName);
                setopenBank(res.Data[0].openBank);
                setbankCard(res.Data[0].bankCard);
                setlegalPerson(res.Data[0].legalPerson);
                setphone(res.Data[0].phone);

                setattractPhone(res.Data[0].attractPhone);
                setattractWXNumber(res.Data[0].attractWXNumber);
                setrentAddress(res.Data[0].rentAddress);
                setreportPhone(res.Data[0].reportPhone);
                setreportEmail(res.Data[0].reportEmail);
                setcontacts(res.Data[0].contacts);
                setattract(res.Data[0].attract);
                seteleloss(res.Data[0].loss);
                setelePice(res.Data[0].elePrice);
                setmanageFeeRent(res.Data[0].manageFeeRent);
                setwaterPice(res.Data[0].waterPrice);
                // getcustomInfo(res.Data[0].clientId);
                // getUnitInfo(res.Data[0].unit_id);
                setbusinessEntity(res.Data[0].businessEntity);
                setbusinessScope(res.Data[0].businessScope);
                setStartDate(dayjs(res.Data[0].beginTime).format("YYYY-MM-DD"));
                setEndDate(dayjs(res.Data[0].endTime).format("YYYY-MM-DD"));
                setdeliveryDate(dayjs(res.Data[0].deliveryDate).format("YYYY-MM-DD"));
                setdeposit(res.Data[0].deposit);
                setdepositFee(res.Data[0].depositFee);
                setmanageFee(res.Data[0].init_manageFee);
                setdecorationCost(res.Data[0].decorationCost);
                setdispatchName(res.Data[0].dispatchName);
                setdispatchCard(res.Data[0].dispatchCard);
                setcustomCard(res.Data[0].customCard);
                setelePrice(res.Data[0].elePrice);
                setzuMoney(res.Data[0].zuMoney);
                setmzq(res.Data[1]);
                setdz(res.Data[2]);
                setoffice_area(res.Data[0].customAddress);
                setcustom_name(res.Data[0].customName);
                setyiphone(res.Data[0].customPhone);
                setcustomcompany_name(res.Data[0].customCompany);
                setunit_name(res.Data[0].unitName);
                let sum=numReduce(res.Data[0].floor_area)
                setrentable_area(sum);
                setunit_type(res.Data[0].unit_type);
                let unitImagesp=res.Data[0].unitImage.split('|');
                setunitImage(unitImagesp);
                let tenantImagesp=res.Data[0].tenantImage.split('|');
                setB64(tenantImagesp);
                let documentImagesp=res.Data[0].documentImage.split('|');
                setdocumentImage(documentImagesp);
                let joinData=JSON.parse(res.Data[0].goodsJson);
                setwupinList(joinData);
            }else {
                message.error(res.Data);
            }
        })
    };
    const wupinTab=[
        {
            title: '物品名称',
            dataIndex: 'wupinName',
            key: 'wupinName'
        },
        {
            title: '物品标准',
            dataIndex: 'wupininfo',
            key: 'wupininfo'
        },
        {
            title: '物品数量',
            dataIndex: 'wupinNuber',
            key: 'wupinNuber'
        },
    ];
    // 转换成累加数字
    const numReduce=(str)=>{
        let sum;
        const arr = str.split(',');
        const numbers = arr.map(Number);
        sum = numbers.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        return sum
    };
    return (
          <p className={styles.linheP} >
              <p className={styles.linheP} ><Button type='primary' onClick={()=>setisOpen(true)}>预览PDF</Button></p>
              <p  className="receipt-container" style={{fontSize:'14px'}}>

                <h1 style={{ textAlign: 'center', paddingTop: '50px' }}>房屋租赁合同书</h1>
                  <p   className="receipt-info">
                          <p className={styles.linheP}  >出租方(甲方):{companyName}</p>
                          <p className={styles.linheP}  >地址：{companyAddress}</p>
                          <p className={styles.linheP}  >法定代表人：{legalPerson}</p>
                          <p className={styles.linheP}  >联系电话：{phone}</p>
                          <p className={styles.linheP}  >联系人：{contacts}</p>
                          <p className={styles.linheP}  style={{ paddingTop: '30px' }}></p>
                          <p className={styles.linheP}  >承租方(乙方): {custom_name}</p>
                          <p className={styles.linheP}  >地址：{office_area}</p>
                          <p className={styles.linheP}  >法定代表人：{custom_name}</p>
                          <p className={styles.linheP}  >联系电话：{yiphone}</p>
                          <p className={styles.linheP}  >联系人：{custom_name}</p>
                          <p className={styles.linheP}   >根据《中华人民共和国民法典》及相关法律法规，就乙方承租甲方房屋事宜，甲、乙双方在自愿、平等和互利的基础上，经协商一致，签订本合同并共同遵守。</p>
                          <p className={styles.linheP}  style={{    fontWeight: 500, fontSize: '24px' }}>第一条：房屋状况</p>
                          <p className={styles.linheP}  >
                              <span style={{ fontSize: "1rem", fontWeight: 600 }}>1.</span>甲方将位于{rentAddress}{unit_name}房号的建筑物（以下简称“租赁物”）出租给乙方使用。经甲乙双
                              方认可确定租赁物面积约为{rentable_area}1．平方米计（本合同与面积相关的费用计算均以此面积为基础，其他方式的测量均不影响对该租赁面积的确认，双方均不得以租赁面积与实际交付面积存在误差为由解除合同或要求对方支付补偿或赔偿）。签订本合同前，乙方已充分获悉租赁物的现场情况、土地性质、规划用途和消防、竣工及产权状况，本项目周边市政配套及道路等，乙方承诺在租赁期限内或本合同终止后，不再以前述任何理由要求解除本合同或调整租赁面积或要求甲方退还、减免租金、物业费等款项。
                          </p>
                          <p className={styles.linheP}  >
                              <span style={{ fontSize: "1rem", fontWeight: 600 }}>2.</span>
                              租赁物的位置见本合同附件《租赁物平面图》阴影部分所示（租赁物平面图只作一般位置识别之用，并不显示租赁物实际面积大小，租赁物的具体位置、面积大小以本合同约定及现场实际情况为准）。
                          </p>
                          <p className={styles.linheP}  >
                              <span style={{ fontSize: "1rem", fontWeight: 600 }}>3.</span>
                              租赁物的交付标准见附件《房屋内交付标准》，乙方据此条件接收租赁物。交付的设备设施的具体数量、大小及位置以实际交付时的状态为准，由甲方（或甲方指定方）和乙方在交付时共同签署《交接确认书》予以确认。
                          </p>

                      <p className={styles.linheP}  >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>4.</span>
                        本合同租赁物用途为{unit_type == 1 ? '商业' : '办公'}。乙方在租赁物从事经营的主体名称是{businessEntity}，其经营范围或业务范围为{businessScope}。
                        如乙方需变更在租赁物从事经营主体、经营范围或业务范围的，需要事先征得甲方书面同意；涉及须经政府主管部门批准或办理登记手续的，乙方应自行办理。未经甲方书面同意，乙方不得将租赁物用于本条规定以外的其他用途。
                    </p>
                      <p className={styles.linheP}  style={{    fontWeight: 500, fontSize: '24px' }}>第二条：租赁期限</p>
                      <p className={styles.linheP}  >
                        租赁期限为 {calculateYearsAndMonths(startDate,endDate)}，即从{startDate}-{endDate}止（含免租期）。租赁期限届满前1个月，如双方未就续约事宜达成一致的，甲方可带新租户或未来使用者勘察该出租单元。合同到期乙方如需续租，须在合同到期日的1个月前向甲方书面申请，在同等条件下，乙方有优先承租权。
                    </p>
                      <p  style={{    fontWeight: 500, fontSize: '24px' }}>第三条：免租期</p>
                      <p className={styles.linheP}  >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>1.</span>
                        租赁物的免租期为{calculateTotalRentalDays(mzq)}天,即从{
                        mzq.map((item,index)=>{
                            return(
                                <span key={index}>
                                    <span>{dayjs(item.rentBeginTime).format('YYYY-MM-DD')}</span>至<span>{dayjs(item.rentEndTime).format('YYYY-MM-DD')}</span>，
                                </span>
                            )
                        })
                    }止。免租期届满次日为起租日，由起租日开始计收租金。免租期内乙方无须向甲方支付租金，但须承担实际使用租赁物所产生的水费、电费、物业费等；因乙方原因本租赁合同实际履行期不足一年的，则乙方须向甲方支付免租期租金，免租期租金的计算公式为：本租赁合同首期租金÷30×免租期天数。
                    </p>

                      <p className={styles.linheP}  >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>2.</span>
                        双方约定在{deliveryDate}（下称“交付日”），甲方将租赁物按双方约定的交付标准交付乙方使用，乙方同意按租赁物及设施的约定及现场实际状况标准承租。乙方应派专人（持乙方授权委托书及身份证明原件）到租赁物现场与甲方办理交付手续。乙方逾期不办理租赁物交付手续的，本合同规定的租赁期和免租期的起止日期不顺延；乙方逾期七天仍未办理租赁物交付手续的，甲方可单方解除合同，不予退回保证金和乙方已支付的其他全部费用，如乙方尚未交纳租赁保证金或物业费保证金的，须向甲方支付相当于租赁保证金及物业费保证金金额的违约金；如乙方未缴齐租赁保证金、物业费保证金及合同约定的首期租金、首期物业费的，甲方可顺延交付租赁物的时间，但合同约定的免租期及租赁期限均不予顺延。
                    </p>
                      <p className={styles.linheP}  style={{    fontWeight: 500, fontSize: '24px' }} >第四条：租赁费用</p>
                      <p className={styles.linheP}  >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>1.</span>
                        合同保证金：本租赁合同的保证金为人民币{deposit}元（大写：{numberToRMB(deposit)}），乙方在本合同签订当日向甲方支付。租赁期满，在乙方办理退租手续、交还租赁物、结清全部费用，注销以租赁物为注册地址之登记手续，以及甲方在收到乙方提交的相关材料后将租赁保证金无息退还乙方。
                        如乙方违反本合同之规定，甲方有权将租赁保证金没收或做相应扣除，乙方在接到甲方扣除通知后的十五日内将甲方扣除的租赁保证金补足给甲方。
                    </p>

                      <p className={styles.linheP}  >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>2.</span>
                        租金：租赁物租金第1年起为每月{zuMoney}元。以此类推。合同租金明细如下:
                        <Table columns={columns} dataSource={dz}  rowKey={(columns) => columns.id} size='small' pagination={false}/>
                    </p>
                      <p className={styles.linheP}  >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>3.</span>
                        租金按月结算。乙方在本合同签署日支付首月租金给甲方；除首月租金外，乙方在每月二十八日前（按自然月计算）向甲方支付次月租金。
                    </p>
                      <p className={styles.linheP}  >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>4.</span>
                        物业费保证金及物业费:
                    </p>
                      <p className={styles.linheP}     >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>(1)</span>
                        物业费保证金为人民币{depositFee}元（大写：{numberToRMB(depositFee)}），乙方在本合同签订当日向甲方支付。租赁期满，在乙方办理退租手续、交还租赁物、结清全部应付各项费用，注销以租赁物为注册地址之登记手续，以及甲方在收到乙方提交的相关材料后将物业费保证金无息退还乙方。
                    </p>
                      <p className={styles.linheP}     >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>(2)</span>
                        租赁期间租赁物物业费为每月{manageFee}元，第2年起每年物业费将在上年的基础上递增{manageFeeRent}%，以此类推。乙方在本合同乙方签署之日支付首期物业费给甲方；除首期物业费外，乙方在每月二十八日前（按自然月计算）向甲方或甲方指定的物业服务方支付次月物业费。
                    </p>
                      <p className={styles.linheP}  >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>5.</span>
                        水费、电费
                    </p>
                      <p className={styles.linheP}     >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>(1)</span>
                        租赁期间乙方经营过程中所产生的水电费按乙方实际使用量计算，每月电费、水费需提前充值预付，具体充值办法详见附件《关于钱市街小程序使用的告知书》；（1）如乙方未按约向甲方支付租金等款项的，甲方可从乙方充值预付款中扣除乙方须向甲方支付的款项；以上水电单价均不含公摊及损耗，公摊及损害由乙方据实缴纳。如遇有关部门调整收费标准，则甲方可相应调整水电费标准。
                    </p>
                      <p className={styles.linheP}     >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>(2)</span>
                        除水电费外，租赁期间乙方实际使用的物业等费用，按实际发生金额由乙方承担。法律法规规定由甲方代收的，乙方应按甲方通知及时交纳。
                    </p>
                      <p className={styles.linheP}  >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>6.</span>
                        租金、保证金等费用支付方式：以支票或转账形式支付。
                    </p>
                      <p className={styles.linheP}     >开户名称:{openName}</p>
                      <p className={styles.linheP}     >开户银行:{openBank}</p>
                      <p className={styles.linheP}     >银行账号:{bankCard}</p>
                      <p className={styles.linheP}     >
                        乙方支付至上述账户的款项按以下顺序扣款：1、赔偿金；2、违约金；3、租金，如扣除1、2项后剩余的款项不足以缴纳当期租金的，乙方须及时补足，否则，按本合同约定逾期缴纳租金承担违约责任。
                    </p>
                      <p className={styles.linheP}  style={{    fontWeight: 500, fontSize: '24px' }}>第五条：租赁物的维护、保养</p>
                      <p className={styles.linheP}  >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>1.</span>
                        在租赁期内，租赁物所在的房屋主体结构所产生的修缮、维护费用由甲方承担；如乙方经营范围包括餐饮或乙方在租赁物内开展食品制作、加工的，乙方须按租赁面积与本项目内其他同类承租人共同分摊项目排烟管道、滤油池等设施定期清理、维护所产生的费用（具体分摊方案由甲方或甲方指定的物业公司根据项目实际情况核算）；如乙方拒绝承担相应费用的，甲方采取措施暂停乙方使用相应的设施。
                    </p>
                      <p className={styles.linheP}  >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>2.</span>
                        租赁期间，租赁物内乙方专用设施的维修、保养由乙方负责。乙方在租赁期内应爱护租赁物，因使用不当造成租赁物或专用设施损坏的，由乙方承担责任和支付维修费用，对于租赁物的易损件由乙方承担维修费用。
                    </p>

                      <p className={styles.linheP}  >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>3.</span>
                        在租赁期内，甲方不负责乙方任何生产垃圾的处理，所有生产垃圾均由乙方自行处理。乙方在租赁期满或合同提前终止时，须将租赁物清扫干净（如甲方提供家具的乙方应确保家具外观完好且能正常使用），除乙方的自有设备等电器可拆除外，租赁物要按本合同交还条款的相关约定向甲方交还租赁物，乙方不能破坏装修、空调，如乙方破坏装修及空调的，甲方可要求乙方支付修复的费用（也可从保证金中扣除），如保证金不足扣除费用的，甲方有权追缴乙方欠款并要求乙方赔偿。
                    </p>
                      <p className={styles.linheP}  >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>4.</span>
                        乙方在使用租赁物时必须遵守国家有关法律、广州市行政法规以及甲方有关租赁物管理的有关规定。如有违反，乙方要承担相应的责任。若影响到周围其他用户的正常运作及财物损失，损失由乙方赔偿。
                    </p>
                      <p className={styles.linheP}  >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>5.</span>
                       若租赁期内甲方提供设施设备供乙方无偿使用，乙方需确保甲方提供的设施设备外观完好且能正常使用，使用期间维护费用由乙方承担。合同期满，相关设施设备随同出租物业移交甲方验收，若出现破损或丢失，乙方须赔偿，甲方可从保证金中扣除相应费用。
                    </p>
                      <p className={styles.linheP}  style={{    fontWeight: 500, fontSize: '24px' }}>第六条：转租、转让和交换</p>
                      <p className={styles.linheP}  >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>1.</span>
                        租赁期限内，未经甲方书面确认，乙方不得对外转租、分租，不得将本合同项下的权利和义务转让给他人，也不得将租赁物与他人承租的租赁物进行交换，否则视乙方违约，甲方可以解除合同，不予退回全部保证金并要求乙方承担违约责任。
                    </p>
                      <p className={styles.linheP}  >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>2.</span>
                        乙方在合同期内甲方同意其转租的，甲方将向乙方收取相当于转租时一个月租金的合同转名费及合同剩余租期的租金的印花税。
                    </p>
                      <p className={styles.linheP}  style={{    fontWeight: 500, fontSize: '24px' }}>第七条：安全管理</p>
                      <p className={styles.linheP}  >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>1.</span>
                        甲方负责租赁物所在建筑物（简称“本项目”）一次消防（即建筑物整体消防验收）；乙方承租租赁物后，对租赁物进行装饰装修需要办理的二次消防（包括但不限于消防设计审查、消防备案、公众聚集场所投入使用、营业前消防安全检查等）由乙方自行负责；乙方在租赁期间须严格遵守《中华人民共和国消防法》以及广州市政府有关消防安全管理制度，积极配合甲方做好消防工作。
                    </p>
                      <p className={styles.linheP}  >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>2.</span>
                        由于乙方的经营、装修等国家规定必须重新进行行政审批手续的，乙方必须依法向有关部门申请并将相应书面文件提交甲方，聘请政府有关部门认可的施工单位报甲方书面同意后施工，费用由乙方支付。乙方负责审核装修设计单位和装修施工单位的相关资质，严控安全合规风险；乙方须与相关单位签订安全生产及消防安全管理协议，明确各自的安全生产管理职责。除因本项目整体规划、消防不合规导致乙方不能办理后续的手续外，乙方不得以租赁物不能通过相应的审批为由解除合同。
                    </p>
                      <p className={styles.linheP}  >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>3.</span>
                        租赁物内因维修等需进行级临时动火作业时（含电焊、风焊等明火作业），需要经得甲方书面同意，如法律规定需要办理有关手续的乙方需经有关部门批准才能进行。
                    </p>
                      <p className={styles.linheP}  >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>4.</span>
                        租赁期间，租赁物内不得存放化学、有毒、有害气体、易燃易爆等危险物品，否则，由此造成的一切经济损失和责任由乙方承担。
                    </p>

                      <p className={styles.linheP}  >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>5.</span>
                        如果乙方安装的电器或线路或管道发生危险和不安全时，当甲方或有关政府机关提出要求时，乙方须立即更换上述设备、线路或管道。乙方须允许甲方或甲方指定方检查由乙方安装在该单元内的电器设备、线路或管道。由于乙方在该单元内安装的设备、线路或管道的故障或维修不善而造成的损失以及一切的赔偿由乙方负责，乙方并保证甲方不会因此而遭受任何损失。
                    </p>
                      <p className={styles.linheP}  style={{    fontWeight: 500, fontSize: '24px' }}>第八条：装修条款</p>
                      <p className={styles.linheP}  >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>1.</span>
                        在租赁期内如乙方须对租赁物进行装修、改建时必须向甲方提供装修、改建方案并取得甲方的书面同意（甲方之认可并不免除乙方需要办理的行政审批、许可、备案手续），必要时须向政府有关部门申报批准后方可开展装修作业。如装修、改建方案可能对公用部分及其他相邻用户造成影响的，甲方可对该方案提出异议，乙方必须予以修改。改建、装修费用由乙方承担。
                    </p>
                      <p className={styles.linheP}  >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>2.</span>
                        租赁物装修及使用期间，乙方须遵照甲方或甲方指定物业管理公司的要求施工，并遵守物业管理公司的相关规定（包括不限于缴纳相应的装修保证金等），且确保装修后的消防、环保、生产安全合格，否则产生的全部责任和损失均由乙方承担，因此造成甲方损失的，由乙方赔偿。
                    </p>
                      <p className={styles.linheP}  >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>3.</span>
                        如乙方的装修、改建方案可能对租赁物主体结构造成影响的，则须经甲方及原设计单位书面同意后方能进行。乙方在装修工程竣工后，须根据国家、地方消防验收相关标准要求，对需要验收或备案的装修工程依法进行验收或备案，并请甲方及物业管理公司查看，确定装修工程符合经批准的设计图则、装修效果图后方可投入使用。
                    </p>
                      <p className={styles.linheP}   >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>4.</span>
                        乙方如需对租赁物业进行电力增容，须提前向甲方书面申请，经甲方书面同意后方可实施，因电力增容所产生的所有费用均由乙方承担，乙方确认在合同租赁期满或无论何种原因导致合同提前解除、终止时，电力增容设备均无偿归甲方所有。
                    </p>
                      <p className={styles.linheP}  >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>5.</span>
                        乙方如发现租赁物主体结构、公共设备及共用基础设施或设备部分出现损坏或故障，应及时通知甲方而不得擅自处理，否则由此产生的一切损失由乙方负责。甲方应在接到乙方通知后予以答复并开始予以维修。
                    </p>
                      <p className={styles.linheP}  >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>6.</span>
                        甲乙双方共同确认，为达成本租赁合同甲方根据乙方要求对租赁物进行了定制装修，装修费用合计{decorationCost}元；本合同提前解除或终止的，乙方须按照如下标准补偿甲方装修投入：剩余未履行的租赁期÷租赁期×甲方投入装修价值。
                    </p>
                      <p className={styles.linheP}  style={{    fontWeight: 500, fontSize: '24px' }}>第九条：租赁物交还及提前终止合同</p>
                      <p className={styles.linheP}  >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>1.</span>
                        乙方须于租赁期满日或本合同提前终止/解约之日前，按本合同约定的交还标准向甲方交还租赁物。交还时双方须办理书面的交接手续，包括：共同检查核对甲方交付给乙方使用的设备设施是否完好（自然损耗除外），如有损毁乙方须予以修复或赔偿；将租赁物大门及其内部所有房门的钥匙、乙方雇员进出本项目的证件全部交给甲方；付清全部租金、物业服务费及水电费等其他应付费用。
                    </p>
                      <p className={styles.linheP}  >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>2.</span>
                        乙方逾期不交还租赁物，每逾期一日，乙方应按租赁期满日或本合同提前终止/解约之日时日租金及日物业费之和的双倍向甲方支付房屋占用使用费，同时，乙方还须承担租赁物在被乙方占用期间内发生的其他乙方应付的一切费用。如因乙方逾期腾退租赁物而造成甲方其他损失的，乙方还须承担赔偿责任包括但不限于赔偿金、诉讼费、律师费、罚金、滞纳金等。
                    </p>
                      <p className={styles.linheP}  >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>3.</span>
                        如乙方在租赁期满或本合同提前终止/解除之日没有向甲方交还租赁物，则甲方除可按约定向乙方收取占用使用费及其他费用以外，还有权在租赁期满之日或本合同提前终止/解约之日起次日自行开启或更换门锁、自行或委托第三人还原租赁物对租赁物内的物品（包括但不限于家具、装置和其他添置物）进行处理、对装修进行拆除，处理并拆除完毕后将租赁物重新租予其他承租方。甲方对因此而引起的损坏及乙方之损失概不负责。乙方不予以处理的装饰、装修、遗留设施设备、物品视为遗弃物，甲方可以自行处理，而不对乙方承担任何赔偿或补偿责任。甲方执行上述行为而引起的一切开支及费用均由乙方负担，甲方可以就上述费用向乙方追偿或选择直接在乙方支付的保证金中予以扣除，如保证金不足以支付租赁物的还原费用的，乙方应另行向甲方支付。
                    </p>
                      <p className={styles.linheP}  >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>4.</span>
                        租赁期满或本合同提前终止乙方交还租赁物时，如甲方发现租赁物内本合同附件所列的装修、设备和设施被损坏或遗失（自然损耗除外），甲方可以要求乙方赔偿损失，并可从乙方交付的保证金中扣除。如保证金不足赔偿甲方损失的，甲方有权要求乙方赔偿差额。
                    </p>
                      <p className={styles.linheP}  >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>5.</span>
                        租赁期限尚未届满，因乙方原因导致本合同解除的，乙方所缴纳的保证金均作为违约金不予退还，并且按违约处理。
                    </p>
                      <p className={styles.linheP}  >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>6.</span>
                        租赁期限尚未届满且乙方无任何违约行为的情况下，若甲方要求提前终止本合同，甲方需向乙方支付相当于解除时月租金及月物业管理费之和二倍的违约金。
                    </p>
                      <p className={styles.linheP}  >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>7.</span>
                        本合同解除或终止时，甲方可以选择租赁物装修、固定物品归甲方所有，或要求乙方在交还租赁物时按现状交还或整体/部分恢复至交付时之标准，由此发生的费用由乙方承担；如甲方书面同意乙方无需将租赁物恢复原状，甲方无须就乙方对租赁物和其装修、设备和设施进行的增建或改建做出任何补偿或赔偿。
                    </p>
                      <p className={styles.linheP}  >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>8.</span>
                        双方的权利义务
                    </p>
                      <p className={styles.linheP}  >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>1</span>
                        甲方的权利和义务
                    </p>
                      <p className={styles.linheP}     >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>(1)</span>
                        甲方保证有权将租赁物出租给乙方用于本合同规定的用途，有完全的权限和能力签订租赁合同及履行租赁合同中甲方的义务。甲方应按附件二所列提供基础设施及承租区域内用电、用水等的正常供应，但使用费由乙方承担。
                    </p>
                      <p className={styles.linheP}     >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>(2)</span>
                        甲方保留对本项目的命名权以及变更本项目的名称、标志、总体面积、用途和整体装修风格的权利，甲方可以根据实际经营需要变更本项目内除租赁物外其他租赁物业的数目、编号、面积和具体用途，上述变更不构成对本租赁合同的违反，也不影响租赁合同的效力。
                    </p>
                      <p className={styles.linheP}     >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>(3)</span>
                        在不影响乙方对租赁物租赁使用的前提下，甲方可以对甲方指定的物业公司或其他供应商变更，无需提前征询乙方。
                    </p>
                      <p className={styles.linheP}     >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>(4)</span>
                        本项目及租赁物的外立面、大堂、电梯厅、电梯轿厢、走廊等公共部分使用权等归甲方所有（包括不限于举行活动或发布广告等）。
                    </p>
                      <p className={styles.linheP}     >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>(5)</span>
                        如发生意外事故或紧急情况，危及人身或财产安全或影响本项目正常运作时，甲方可以不经乙方同意而采取紧急避险行动，如破门窗进入租赁物排除险情等，但甲方在采取紧急避险行动后应及时通知乙方，乙方应及时到达现场。如甲方采取的紧急避险行动有利于乙方财产或租赁物内留存的第三方的财产安全，则甲方采取紧急避险行动造成的租赁物门、窗等损坏及乙方其他损失，由乙方承担；其他损失，按法律规定承担或分担。
                    </p>
                      <p className={styles.linheP}  >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>2.</span>
                        乙方的权利和义务
                    </p>
                      <p className={styles.linheP}     >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>(1)</span>
                        乙方保证有完全的权限和能力签订租赁合同及履行租赁合同中乙方的义务，保证在租赁物内的一切活动符合法律法规和租赁合同的规定。在不违反国家法律法规和租赁合同约定的前提下，乙方可自主使用租赁物。
                    </p>
                      <p className={styles.linheP}     >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>(2)</span>
                        乙方租赁的租赁物不容许住宿、煮食（租赁物用途为餐饮的除外）、私拉乱接用电及存放易燃易爆物品，未经甲方或甲方指定的物业公司同意不得占道摆放物品。如因乙方违反相关规定而发生意外事故，一切法律责任和经济责任由乙方承担。
                    </p>
                      <p className={styles.linheP}     >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>(3)</span>
                        乙方对其承租的租赁物，除本合同约定的限制及本项目相关物业管理规定中约定的事项、法律法规明令禁止之外，享有充分的使用权。甲方对乙方合法守章的经营活动不得进行干涉妨碍。
                    </p>
                      <p className={styles.linheP}     >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>(4)</span>
                        乙方须按时缴交租金及其他应缴之费用。
                    </p>
                      <p className={styles.linheP}     >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>(5)</span>
                        乙方在其生产经营对外宣传中，不得宣称或令其他第三方误认为其与甲方关系属合作、合营、合伙、联营或关联企业关系；否则甲方可以要求乙方向甲方支付届时月租金及月物业管理费之和的两倍作为违约金；同时乙方应立刻停止使用相关名称。如造成甲方损失，乙方须承担赔偿责任。
                    </p>
                      <p className={styles.linheP}     >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>(6)</span>
                        在租赁物业内发生人员伤亡、财产损失等事件，乙方应直接承担全部责任。乙方承诺甲方无需对非因甲方原因造成的自然灾害、水灾、火灾、盗窃、乙方自有设备设施故障等造成的人身损害、财产和其他损失承担任何法律责任。如遇第三方直接向甲方进行追索时（包括提起仲裁、诉讼），乙方同意由乙方自行出面解决，并承担全部责任。若乙方需要甲方协助处理的，须提前书面通知甲方，由此发生的费用由乙方负责。若因乙方推诿而导致甲方损失的，则由此导致甲方产生的一切费用和所有损失包括但不限于赔偿金、诉讼费、律师费、罚金、滞纳金等均由乙方负责承担。同时，甲方可以单方解除本合同，没收全部保证金作为违约金。如造成甲方损失，乙方须承担赔偿责任。
                    </p>
                      <p className={styles.linheP}     >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>(7)</span>
                        乙方不得在租赁物内进行或容许他人进行任何造成噪音、空气污染、排污管堵塞或其他违反相邻关系的行为而影响邻近承租方。
                    </p>
                      <p className={styles.linheP}     >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>(8)</span>
                        乙方承租后，自行办理按本合同规定用途使用租赁物所需要的各种政府许可或批文，自负盈亏，一切债权债务均自行负责，与甲方或甲方指定的物业公司均无关。
                    </p>
                      <p className={styles.linheP}     >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>(9)</span>
                        乙方须向政府有关部门申请必要的执照、批准证书或许可证等（如法律法规要求）。乙方须在开始营业前申请并取得在租赁物内开展经营业务活动所需的一切许可和批准并在租赁期内保持有效。
                    </p>
                      <p className={styles.linheP}     >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>(10)</span>
                        乙方须于租赁期满或提前终止后60天内办理完毕工商登记注销或迁出本项目租赁地址相关手续。否则，每逾期一天，乙方须参照租赁期满日或本合同提前终止/解约之日时日租金和日物业管理费之和的的两倍支付违约金，并承担由此造成甲方的损失，同时甲方可以从保证金中扣除违约金，乙方须在接到书面通知后5日内补足保证金，逾期交纳相关费用，每逾期一天，以应付未付款金额为基数按每日千分之三标准计算向甲方支付违约金。
                    </p>
                      <p className={styles.linheP}     >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>(11)</span>
                        乙方对其雇员、代理人、聘用的第三方和访客在本项目内的一切行为向甲方承担连带责任，乙方及其雇员、代理人、聘用的第三方和访客造成甲方及其雇员、代理人、本项目的其他租户或使用者人身损害、财产或其他损失的，乙方承担连带赔偿责任。
                    </p>
                      <p className={styles.linheP}     >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>(12)</span>
                        乙方使用租赁物时，须遵守国家和地方关于安全生产、消防、治安保卫、劳动保护及职业病防治的安全法律法规，乙方承担租赁物内的安全经营责任，乙方的负责人为租赁物经营安全的第一责任人；同时，乙方指定该负责人作为租赁物安全经营的直接责任人，负责租赁物安全经营的具体工作。乙方须做好租赁物及租赁物与本项目相连接部分的防火、防盗、防工伤等安全经营工作，接受甲方的安全监督检查，积极配合甲方做好本项目的安全经营管理工作。
                    </p>
                      <p className={styles.linheP}     >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>(13)</span>
                        乙方保证按照约定的租赁用途，在其合法经营范围内，按照使用规范，正常合理地使用租赁房屋及其设施、设备，不放置任何超过或可能超过建筑物设计荷载范围的物品，不得影响、妨碍公共设施、设备的正常使用和正常维护、维修、保养，不得损坏租赁房屋结构及附属设备设施。
                    </p>
                      <p className={styles.linheP}     >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>(14)</span>
                        在承租期内的任何时候、任何情况下，乙方不能主张以保证金折抵应付甲方租赁费用及其他应付费用。
                    </p>
                      <p className={styles.linheP}  style={{    fontWeight: 500, fontSize: '24px' }} >第十条：违约责任</p>
                      <p className={styles.linheP}  >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>1.</span>
                        甲乙双方同意，有下列情形之一，乙方可书面通知甲方提前解除本合同。甲方无息退还乙方缴纳的保证金（如有），除此外甲方无需承担其他违约责任：
                    </p>
                      <p className={styles.linheP}     >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>(1)</span>
                        甲方交付的租赁物存在设计、质量缺陷，危及乙方人身财产安全的；
                    </p>
                      <p className={styles.linheP}     >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>(2)</span>
                        甲方交付的租赁物不符合本合同的约定，致使乙方无法使用租赁物的；
                    </p>
                      <p className={styles.linheP}     >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>(3)</span>
                        租赁物因甲方原因被司法机关或者主管行政机关依法查封，致使租赁物不能使用连续超过30天的。
                    </p>
                      <p className={styles.linheP}  >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>2.</span>
                        乙方逾期缴付租金、物业费及其他应缴费用的，每逾期一日，以乙方未付费用为基数，按照每日千分之三的标准向甲方支付逾期付款违约金，直至乙方付清所有前述费用。乙方拖欠费用超过七天（含）的，甲方及/或物业管理公司可在提前二十四小时书面通知乙方的前提下，停止向租赁物提供空调（如有）等物业服务直到乙方支付所有欠款及因此而引起的费用（包括重新接驳空调等服务供应的费用），甲方对乙方因此而蒙受的任何破坏和损失不承担任何责任。
                    </p>
                      <p className={styles.linheP}  >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>3.</span>
                        甲、乙双方同意，有下列情形之一的，甲方解除本合同，乙方已支付的全部费用包括但不限于租金、物业服务费（无论该等费用对应的租赁期间是否届满）、保证金等甲方可以不予退还，并且乙方还需向甲方支付相当于解除时月租金及月物业管理费之和二倍的违约金；若该等前述费用不足抵付甲方损失的，甲方可以继续向乙方追偿：
                    </p>
                      <p className={styles.linheP}     >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>(1)</span>
                        乙方逾期支付租金或其他应付费用连续超过三十日或累计超过四十五日的；
                    </p>
                      <p className={styles.linheP}     >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>(2)</span>
                        乙方提前终止本合同的；
                    </p>
                      <p className={styles.linheP}     >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>(3)</span>
                        乙方未征得甲方书面同意改变租赁物用途，或未经相关政府部门批准从事非法经营活动；
                    </p>
                      <p className={styles.linheP}     >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>(4)</span>
                        因乙方原因造成租赁物主体结构损坏的，或未征得甲方书面同意改变房屋结构的；
                    </p>
                      <p className={styles.linheP}     >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>(5)</span>
                        乙方擅自转租或与他人交换各自承租的房屋的；
                    </p>
                      <p className={styles.linheP}     >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>(6)</span>
                        乙方违反本合同约定给甲方造成损失，且经甲方书面催告后五日内拒不改正违约行为的；
                    </p>
                      <p className={styles.linheP}     >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>(7)</span>
                        乙方将租赁物用于任何非法目的或乙方将租赁物用于乙方营业执照所列经营范围以外之目的的；
                    </p>
                      <p className={styles.linheP}     >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>(8)</span>
                        乙方破产或进入清算程序的，或乙方之财产被强制执行，或乙方被接管人接收的；
                    </p>
                      <p className={styles.linheP}     >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>(9)</span>
                        乙方因违法经营、债权债务等原因致使政府有关部门、法院或仲裁机构责令其停止营业或查封扣押租赁房屋及其内财物的；
                    </p>
                      <p className={styles.linheP}     >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>(10)</span>
                        乙方被指侵害他人合法权益，使甲方被卷入诉讼或行政查处案件的；债权人上门追讨债务，影响本项目全部或部分正常营业的或造成甲方和物业管理方名誉受损的；
                    </p>
                      <p className={styles.linheP}     >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>(11)</span>
                        乙方因不正当竞争或虚假宣传等被消费者围堵，影响本项目全部或部分正常营业的或造成甲方和物业管理方名誉受损的；
                    </p>
                      <p className={styles.linheP}     >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>(12)</span>
                        乙方承租期间，如在本项目物业范围内，发生针对乙方或乙方关联方的群体性社会事件，社会群体围堵聚集本项目物业或乙方租赁物业，影响本项目物业正常营业的；
                    </p>
                      <p className={styles.linheP}     >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>(13)</span>
                        除上述情形外，乙方其他行为影响本项目全部或部分正常营业、对其他业户造成不良影响或造成甲方和物业管理方名誉受损，甲方和物业管理方要求限期改正而仍未改正的；
                    </p>
                      <p className={styles.linheP}     >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>(14)</span>
                        其他归因于乙方，法律允许甲方单方解除合同之情形的。
                    </p>
                      <p className={styles.linheP}  >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>4.</span>
                        因乙方违约导致甲方采取诉讼或非诉讼方式维护合法权益实现债权的，乙方须赔偿甲方蒙受的损失，包括但不限于甲方为此支付的诉讼费、律师费、差旅费及其他维护合法权益实现债权的费用。
                    </p>
                      <p className={styles.linheP}  >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>5.</span>
                        乙方特此同意，在下述情况下，甲方无须对下列事件负责（且本合同项下之租金及其他费用不得减免或中止支付）：
                    </p>
                      <p className={styles.linheP}     >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>(1)</span>
                        因对租赁物或其相邻房屋或本项目进行维修保养或因按本合同规定的程序对租赁物或其相邻房屋或本项目进行装修、增建或改建，致使公用设施临时性停止使用，或导致租赁物的水、电、电话、传真或其他有关服务或供应临时性中断，从而使乙方或乙方的雇员、代理人或访客发生损失的；
                    </p>
                      <p className={styles.linheP}     >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>(2)</span>
                        因发生地震、火灾、水灾、暴风雨、爆炸、台风、战争、动乱、暴乱、罢工、国家或政府机关征用、征收、征购、没收或收归国有，或发生任何甲方无法控制的其他不可抗力事件或事故，致使乙方或乙方的雇员、代理人或访客发生损失的；
                    </p>
                      <p className={styles.linheP}     >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>(3)</span>
                        由于乙方的原因造成的任何损失和/或伤害或乙方未及时采取措施导致扩大的损失或损害；
                    </p>
                      <p className={styles.linheP}     >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>(4)</span>
                        任何时间租赁物内的非因甲方故意或重大过失原因造成的人身损害或财产损失（甲方或甲方指定的物业公司的保安人员、值班人员对本项目提供的保安服务并不构成甲方对租赁物及其内部人员与财产的保卫责任）。
                    </p>
                      <p className={styles.linheP}  >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>6.</span>
                        若因政府有关法律法规的修改或政府征收等行为（乙方因自身原因以及违法行为导致政府的行政处罚除外）导致双方无法继续履行本合同时，本合同自行终止，甲方将剩余保证金退还给乙方，双方互不追究责任。
                    </p>
                      <p className={styles.linheP}  >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>7.</span>
                        因乙方违约导致甲方依据本合同约定解除合同时，乙方须协助甲方开具红字发票等事宜。如因此造成甲方损失的（包括但不限于不配合办理开具红字增值税专用发票、无法抵扣增值税、多缴增值税等），乙方须承担赔偿责任。
                    </p>
                      <p className={styles.linheP}  >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>8.</span>
                        乙方未按本合同规定履行其安全生产职责的，甲方可以立即制止乙方的违法、违约行为，要求乙方立即予以整改，如乙方拒不停止或拒不改正的，甲方可以解除租赁合同，收回租赁租赁物，保证金及其他乙方已付费用归甲方享有无需退还乙方。乙方或其聘用的第三方的原因造成的安全事故或造成的第三方人身伤害或财产损失，均由乙方承担全部责任，如因此给甲方造成损失（包括但不限于财产损失）的，乙方须赔偿甲方的损失。
                    </p>
                      <p className={styles.linheP}  >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>9.</span>
                        租赁期内，因乙方原因导致租赁合同提前解除或终止，最后一个计租周期不足一个月的，乙方须按照一个月的标准向甲方支付租金、物业费。
                    </p>
                      <p className={styles.linheP}  style={{    fontWeight: 500, fontSize: '24px' }}>第十一条：保险</p>
                      <p className={styles.linheP}  >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>1.</span>
                        乙方须在租赁物的装修期间及整个租赁期间购买乙方财产与人身安全的保险、乙方公众责任险及建筑工程一切险，以及可能发生的其他风险购买相应责任险及财产险，并保证上述保险在整个租赁期间有效存在。
                    </p>
                      <p className={styles.linheP}  >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>2.</span>
                        若因乙方的原因，发生涉及甲方损失的保险事故，乙方从保险公司获得的赔款须首先用于赔偿甲方的损失；如果乙方从保险公司获得的赔款不足以赔偿甲方的损失，则差额部分由乙方赔偿甲方。如遇租赁物内发生意外时，若因乙方未购买前述保险或投保金额不足以弥补所产生的一切损失（包括前述保险单赔偿范围内的损失）及责任均由乙方承担。
                    </p>
                      <p className={styles.linheP}  >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>3.</span>
                        如果乙方发生财产保险条款规定之意外，甲方可协助乙方向保险公司索赔，受益人为乙方，赔付金额以保险公司核定赔付为准，乙方不得再向甲方提出额外赔偿。
                    </p>
                      <p  style={{    fontWeight: 500, fontSize: '24px' }}>第十二条:争议解决</p>
                      <p className={styles.linheP}  >
                        本合同订立、履行、解释、争议的解决等与本合同有关的所有事宜均适用中华人民共和国法律。在履行本合同过程中发生争议，双方应友好协商解决。协商不成，双方均可以向租赁物所在地人民法院提起诉讼。
                    </p>
                      <p className={styles.linheP}  style={{    fontWeight: 500, fontSize: '24px' }}>第十三条:通知和送达</p>
                      <p className={styles.linheP}  >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>1.</span>
                        甲方指定如下人员为与乙方的联系人，负责转达甲方的指示和要求，提供文件和资料，接收乙方向甲方送达的通知、文件和资料等，甲方更换联系人须及时书面通知乙方：
                        <form className={styles.gridForm}>
                              <p  className={styles.gridItem}>甲方指派人员</p>
                              <p  className={styles.gridItem}>联系电话</p>
                              <p  className={styles.gridItem}>地址</p>
                              <p  className={styles.gridItem}>{attract}</p>
                              <p  className={styles.gridItem}>{attractPhone}</p>
                              <p  className={styles.gridItem}>{attractWXNumber}</p>
                        </form>
                    </p>
                      <p className={styles.linheP}  >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>2.</span>
                        乙方指定如下人员为与甲方的联系人，负责转达乙方的指示和要求，提供文件和资料，接收甲方向乙方送达的通知、文件和资料等，乙方更换联系人须及时书面通知甲方：
                        <form className={styles.gridForm}>
                              <p className={styles.gridItem}>乙方指派人员</p>
                              <p className={styles.gridItem}>身份证</p>
                              <p className={styles.gridItem}>微信号</p>
                              <p className={styles.gridItem}>{dispatchName}</p>
                              <p className={styles.gridItem}>{dispatchCard}</p>
                              <p className={styles.gridItem}>{yiphone}</p>
                        </form>
                    </p>
                      <p className={styles.linheP}  >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>3.</span>
                        甲、乙双方因履行本合同而相互发出或者提供的所有通知、文件、资料，均以合同中所列明的电子邮箱/微信、地址、电话送达。电子邮箱和移动电话短信或微信送达的，电子邮件或短信或微信发出之日视为送达之日，邮寄方式按地址使用EMS、顺丰等快递邮寄的，自邮件发出后视为送达（对方拒收、非本人签收、退回、无法送达等均视为送达并同样产生送达的法律效力）。
                    </p>
                      <p className={styles.linheP}  >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>4.</span>
                        甲方及甲方指定的本项目物业管理公司在本项目适当的公共范围设置告示板，以张贴管理规则及其他规定的通知及布告，通知或布告在告示板上连续张贴3天后，即构成对乙方的有效通知。
                    </p>
                      <p className={styles.linheP}  style={{    fontWeight: 500, fontSize: '24px' }}>第十四条：其他条款</p>
                      <p className={styles.linheP}  >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>1.</span>
                        双方确认，甲方已经将租赁物的情况详细告知乙方，乙方对租赁物的情况已经充分了解（包括租赁物周边市政设施配套情况等）。
                    </p>
                      <p className={styles.linheP}  >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>2.</span>
                        乙方法定代表人作为乙方的关联方自愿对本租赁合同项下乙方的全部债务承担无限连带责任，保证期间为三年。
                    </p>
                      <p className={styles.linheP}  >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>3.</span>
                        合同未尽事宜，经双方协商一致后，可另行签订书面补充协议，书面补充协议与本合同具有同等法律效力。
                    </p>
                      <p className={styles.linheP}  >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>4.</span>
                        本合同的附件系本合同不可分割的一部分，与本合同具有同等法律效力。
                    </p>
                      <p className={styles.linheP}  >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>5.</span>
                        本合同一式四份，甲、乙双方各执二份，经双方签署后生效。
                    </p>
                      <p className={styles.linheP}  >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>6.</span>
                        若按照适用法律及/或政府之规定，本合同需办理登记备案，且登记备案后方可取得备案证明的，乙方应负责办理登记备案手续，并承担由此产生的一切（包括证照）费用。若因当地房屋租赁管理部门之要求，需使用其标准示范文本（简称备案合同）的，则该备案合同仅为房产租赁登记部门方便存档之用途，不论备案合同签订的时间是否晚于本合同签订时间，基于租赁关系项下的甲乙双方最终的权利义务以及租赁合同生效时间、纠纷解决都以本合同约定内容为准，备案合同记载之内容与本合同不一致或有冲突的，依本合同约定为准。
                    </p>
                      <p className={styles.linheP}  >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>7.</span>
                        签订本合同系双方真实意思表示。乙方确认在同意订立本合同前，已仔细阅读本合同所有条款，对本合同所有条款及内容已经阅悉，均无异议，并对双方的权利义务达成了充分的理解，对甲方所特别提示的，免除或者限制甲方责任的条款有充分了解和预期。
                    </p>
                      <p className={styles.linheP}  style={{    fontWeight: 500, fontSize: '24px' }}>（以下无正文）</p>
                      <p className={styles.linheP}  >
                        附件一 租赁物平面图
                    </p>
                      <p className={styles.linheP}  >
                        附件二 房屋交付标准
                    </p>
                      <p className={styles.linheP}  >
                        附件三 交接确认书
                    </p>
                      <p className={styles.linheP}  >
                        附件四 廉洁诚信承诺书
                    </p>
                      <p className={styles.linheP}  >
                        附件五 双方证照文件
                    </p>
                      <p className={styles.linheP}  >
                        附件六 《关于钱市街小程序使用的告知书》
                    </p>
                      <p className={styles.linheP}  >
                        附件七 《安全生产责任书》
                    </p>
                      <p className={styles.linheP}  >
                        附件八  代缴确认书
                    </p>
                      <p className={styles.linheP}  >
                        【签署页  无正文】
                    </p>

                      <p className={styles.linheP}   ><span style={{ marginRight: '100px' }}>甲方（签署）:{companyName}</span><span>乙方（签署）:{customcompany_name}</span></p>
                      <p className={styles.linheP}   ><span style={{ marginRight: '200px' }}>法定代表人:{legalPerson}</span><span>法定代表人:{custom_name}</span></p>
                      <p className={styles.linheP}   ><span style={{ marginRight: '300px' }}>签订日期 :<span style={{ color: "red" }}></span></span><span>签订日期:<span style={{ color: 'red' }}></span></span></p>

                      <p className={styles.linheP}  >
                        <h3>
                            附件一：《租赁物平面图》
                        </h3>
                          <p className={styles.linheP} >
                            {unitImage.length>0?
                                unitImage.map((item:any,index:any)=>{
                                    return   <p className={styles.linheP}  key={index}>
                                        <Image src={item} style={{width:'300px',height:'300px'}}/>
                                    </p>
                                })
                                :''}
                        </p>
                    </p>
                      <p className={styles.linheP}  >
                        <h3>
                            附件二：1、房屋内交付标准
                        </h3>
                          <p className={styles.linheP} >
                            <Table columns={wupinTab} rowKey={(columns) => columns.key} dataSource={wupinList} size='small' style={{width:'600px'}}  pagination={false}/>
                            {/*{wupinList.map((item:any,index:number) => (*/}
                            {/*      <p className={styles.linheP}  style={{ display: 'flex'}} key={item.key}>*/}
                            {/*        <Form.Item label="物品名称">*/}
                            {/*            <Input*/}
                            {/*                value={item.wupinName}*/}
                            {/*            />*/}
                            {/*        </Form.Item>*/}
                            {/*        <Form.Item label="交付标准">*/}
                            {/*            <Input*/}
                            {/*                value={item.wupininfo}*/}
                            {/*            />*/}
                            {/*        </Form.Item>*/}
                            {/*        <Form.Item label="数量">*/}
                            {/*            <InputNumber*/}
                            {/*                value={item.wupinNuber}*/}
                            {/*            />*/}
                            {/*        </Form.Item>*/}
                            {/*    </p>*/}

                            {/*))}*/}
                        </p>
                    </p>
                      <p className={styles.linheP}  >
                        <h3>
                            2、物品清单
                        </h3>
                    </p>
                      <p className={styles.linheP}  >
                        <h3>
                            附件三：交接确认书
                        </h3>

                    </p>
                    <h2 style={{ textAlign: 'center', fontSize: '24px' }}>
                        交接确认书
                    </h2>
                      <p className={styles.linheP}  >
                        甲方：{companyName}
                    </p>
                      <p className={styles.linheP}  >
                        乙方：{customcompany_name}
                    </p>
                      <p className={styles.linheP}  >
                        鉴于：双方于<span >{deliveryDate}</span>日就位于{rentAddress}{unit_name}房号的建筑物（以下简称“租赁物”）的租赁事宜签署了《房屋租赁合同书》。根据《房屋租赁合同书》约定，甲方应于{startDate}日之前按照合同约定向乙方交付租赁房地产。
                    </p>
                      <p className={styles.linheP}     >
                        现双方根据租赁房地产验收交付等情况确认如下：
                    </p>
                      <p className={styles.linheP}     >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>1.</span>
                        经乙方查验，租赁房地产完全符合《房地产租赁合同》及其附件约定的交付清单，乙方同意接收租赁房地产。
                    </p>
                      <p className={styles.linheP}     >
                        <span style={{ fontSize: "1rem", fontWeight: 600 }}>2.</span>
                        双方确认：<span>{deliveryDate}</span>为签署《房屋租赁合同书》项下的租赁物交付日。
                    </p>
                      <p className={styles.linheP}     >
                        本确认书经双方签署之日起生效。
                    </p>
                      <p className={styles.linheP}   ><span style={{ marginRight: '100px' }}>甲方（签署）:{companyName}</span><span>乙方（签署）:{customcompany_name}</span></p>
                      <p className={styles.linheP}   ><span style={{ marginRight: '300px' }}>签订日期 :<span style={{ color: "red" }}></span></span><span>签订日期:<span style={{ color: 'red' }}></span></span></p>
                      <p className={styles.linheP}  >
                        <h3>
                            附件四：廉洁诚信承诺书
                        </h3>
                    </p>
                      <p className={styles.linheP}  style={{ textAlign: 'center' }}>
                        <h2 style={{ fontWeight: 600, fontSize: '24px' }}>廉洁诚信承诺书</h2>
                    </p>
                      <p className={styles.linheP}  >
                        为规范企业经营活动，倡导廉洁诚信，抵制商业贿赂和不正当竞争，保障甲乙双方的合法权益，遵循诚实守信的原则，营造公平竞争、健康有序的商业环境，特制定本承诺书，承诺如下：
                    </p>
                      <p className={styles.linheP}  >
                        第一条  严格遵守国家有关法律法规，保持正当的经济（合作）业务活动。
                    </p>
                      <p className={styles.linheP}  >
                        第二条  在经济（合作）业务活动中应当廉洁自律，不得发生任何涉及商业贿赂或损害对方企业利益的行为，包括但不限于以下情形：
                    </p>
                      <p className={styles.linheP}     >
                        （一）参加对方单位及对方工作人员安排的可能对公正履行职责有影响的活动，如宴请、消费娱乐和健身、旅游等；
                    </p>
                      <p className={styles.linheP}     >
                        （二）向对方单位及对方工作人员索要或接受对方单位及对方工作人员的回扣、提成、礼品、礼金、有价证券或其他名义交付的现金、实物及其他利益；
                    </p>
                      <p className={styles.linheP}     >
                        （三）在对方单位报销任何应由本方或本方工作人员个人支付的费用；
                    </p>
                      <p className={styles.linheP}     >
                        （四）要求对方单位为其亲属（指配偶、父母、子女、兄弟姐妹及配偶的父母、兄弟姐妹，下同）安排工作、住房，要求对方单位为本方工作人员及其亲属装修房屋；
                    </p>
                      <p className={styles.linheP}     >
                        （五）为对方工作人员及其亲属的工作和业务提供便利、优惠及利益；
                    </p>
                      <p className={styles.linheP}     >
                        （六）为对方单位及对方工作人员提供本承诺书第二条第（一）至（四）项所约定的内容。
                    </p>
                      <p className={styles.linheP}  >
                        第三条  不得在业务活动中以不正当的理由设置障碍、态度粗鲁，刁难对方。
                    </p>
                      <p className={styles.linheP}  >
                        第四条  如承租方发现出租方工作人员在业务活动中有违法、违规、违纪及违反本承诺书规定的行为时，应及时向出租方监督部门举报。
                    </p>
                      <p className={styles.linheP}     >
                        举报电话：{reportPhone}
                    </p>
                      <p className={styles.linheP}     >
                        举报邮箱：{reportEmail}
                    </p>
                      <p className={styles.linheP}  >
                        第五条 承租方违反本承诺书给出租方造成经济损失的，直接追究当事人的赔偿责任。
                    </p>
                      <p className={styles.linheP}  >
                        第六条 出租方如查实承租方或承租方工作人员违反本承诺书约定的，有权立即解除与其签订的所有合同或协议，该单位负责赔偿因此给出租方造成的经济损失。同时，出租方有权将该单位列入黑名单，以后再次合作将受到限制。
                    </p>
                      <p className={styles.linheP}  >
                        第七条 本承诺书作为合同附件，与合同具有同等法律效力。
                    </p>
                      <p className={styles.linheP}  >
                        （以下无正文）
                    </p>
                      <p className={styles.linheP}  >
                        承租方签署:{customcompany_name}
                    </p>
                      <p className={styles.linheP}  >
                        签约日期:
                    </p>
                      <p className={styles.linheP}  >
                        <h3>
                            附件五：双方证照文件
                        </h3>
                    </p>
                      <p className={styles.linheP}  >
                        <h4>
                            1、承租方证照文件
                            {b64.length>0 ?b64.map((item:any,index:number)=>  <p className={styles.linheP}  key={index}>
                                    <Image src={item} style={{ width: '200px',height:'200px',margin:'5px'}} />
                                </p>

                            ) : ''}
                        </h4>
                    </p>
                      <p className={styles.linheP}  >
                        <h4>
                            2、出租方证照文件
                        </h4>
                        {documentImage.length>0 ?documentImage.map((item:any,index:number)=>  <p className={styles.linheP}  key={index}>
                                <Image src={item} style={{ width: '200px',height:'200px',margin:'5px' }} />
                            </p>

                        ) : ''}

                    </p>
                      <p className={styles.linheP}  >
                        <h3>
                            附件六：关于钱市街小程序使用的告知书
                        </h3>
                    </p>
                      <p className={styles.linheP}  style={{   textAlign: 'center' }}>
                        <h2>
                            关于钱市街小程序使用的告知书
                        </h2>
                    </p>
                      <p className={styles.linheP}  >
                        <h4>
                            尊敬的商户：
                        </h4>
                    </p>
                      <p className={styles.linheP}     >
                        您好！
                    </p>
                      <p className={styles.linheP}     >
                        为了提高服务效率，更及时反馈商户的费用信息，我司统一采用《钱市街小程序》电子商务平台进行缴费管理，其中包含了微信提醒服务、账务管理以及欠费项目提示等诸多功能，各商户可以通过平台自助缴纳如水电费、物业服务费、租金等相关费用，节省缴费时间；请商户合理安排缴费时间、金额，避免因拖欠水电费用导致受限。
                    </p>
                      <p className={styles.linheP}     >
                        缴费流程如下：
                    </p>
                      <p className={styles.linheP}     >
                        请使用微信搜索《钱市街小程序》，关注公众号，绑定账户，输入门牌号、姓名、手机号登录平台后选择相应待缴费项目如“水费”“电费”“物业服务费”“租金”等。各商户届时可以自主在公众号根据缴费界面提示要求选择服务项并核对金额后进行缴费操作。谢谢！
                    </p>
                      <p className={styles.linheP}     >
                        { companyName}
                    </p>
                      <p className={styles.linheP}     >
                        日期:
                    </p>
                      <p className={styles.linheP}  style={{ display: 'flex', justifyContent: 'center' }}>
                          <p className={styles.linheP}  style={{ width: '80%', borderBottom: '1px solid #000' }}>
                        </p>
                    </p>
                      <p className={styles.linheP}  style={{   textAlign: 'center' }}>
                        <h3>
                            关于钱市街小程序使用的告知书——签收联
                        </h3>
                    </p>
                      <p className={styles.linheP}     >
                        签收人:{custom_name}
                    </p>
                      <p className={styles.linheP}     >
                        租赁单元:{unit_name}
                    </p>
                      <p className={styles.linheP}     >
                        签收日期:
                    </p>
                      <p className={styles.linheP}  >
                        <h3>
                            附件七：安全生产责任书
                        </h3>
                    </p>
                      <p className={styles.linheP}  style={{   textAlign: 'center' }}>
                        <h2>
                            安全生产责任书
                        </h2>
                    </p>
                      <p className={styles.linheP}  >
                        为了积极贯彻执行国家和本省、本市有关安全生产、消防、治安保卫、劳动保护等法律法规和相关标准，包括但不限于《中华人民共和国安全生产法》《中华人民共和国消防法》《中华人民共和国劳动法》《中华人民共和国反恐怖主义法》《中华人民共和国治安管理处罚法》《中华人民共和国环境保护法》《广东省安全生产条例》、广东省实施《中华人民共和国消防法》办法、《广东省公共安全视频图像信息系统管理办法》《广州市安全生产条例》《广州市安全生产管理规定》《仓库防火安全管理规则》《建筑内部装修设计防火规范》等。安全生产工作实行管行业必须管安全、管业务必须管安全、管生产经营必须管安全，强化和落实生产经营单位主体责任。
                    </p>
                      <p className={styles.linheP}  >
                        一、现由{custom_name}先生/小姐，（身份证：{customCard}）为《房屋租赁合同书》项下租赁物现场安全负责人，负责租赁期内租赁场地现场的生产经营、消防、治安保卫等安全管理工作。如指派的现场安全负责人有变动，承租方须至少提前7个工作日书面告知出租方。
                    </p>
                      <p className={styles.linheP}  >
                        二、生产经营单位的主要负责人是本单位安全生产第一责任人，对本单位的安全生产工作全面负责。
                    </p>
                      <p className={styles.linheP}  >
                        三、承租方向现场安全负责人告知本责任书内容，有责任督促现场安全负责人遵守本协议书内容并积极配合出租方的安全管理工作。
                    </p>
                      <p className={styles.linheP}  >
                        四、装修施工安全管理
                    </p>
                      <p className={styles.linheP}  >
                        1．严禁聘请无资质装修工程承包商。
                    </p>
                      <p className={styles.linheP}  >
                        2．涉及消防工程的施工，应聘请有消防资质的承包商。承租方应提前做好筹划工作，按有关法律法规要求执行，按要求取得《建设工程消防验收意见书》（验收结果须合格）后方可进驻办公。如涉及国家政策变化的，按国家最新要求执行。
                    </p>
                      <p className={styles.linheP}  >
                        3．负责督促聘请的装修工程承包商遵守国家有关安全生产法律法规和国家标准或者行业标准，以及出租方有关装修管理、电气安全、危险作业等安全管理要求，服从出租方的安全监管。
                    </p>
                      <p className={styles.linheP}  >
                        4．装修期间落实专人负责装修现场的安全管理工作。
                    </p>
                      <p className={styles.linheP}  >
                        五、办公现场安全管理
                    </p>
                      <p className={styles.linheP}  >
                        （一）消防安全管理
                    </p>
                      <p className={styles.linheP}  >
                        1．落实租赁场地内消防安全“四个能力”建设（检查消除火灾隐患的能力、组织扑救初起火灾的能力、组织人员疏散逃生的能力、消防宣传教育培训的能力）。
                    </p>
                      <p className={styles.linheP}  >
                        2．对租赁场地内员工（含实习生及使用的被派遣劳动者）进行岗前安全培训和定期再培训，确保所有员工掌握消防“一懂三会”（懂本场所火灾危险性，会报警、会灭火、会逃生）以及掌握本岗位所需的有关安全知识和应急处置措施。
                    </p>
                      <p className={styles.linheP}  >
                        3．积极参加消防演习、安全培训、安全会议等安全活动。
                    </p>
                      <p className={styles.linheP}  >
                        4．严禁擅自改变租赁场地内安全疏散通道等装修布局。
                    </p>
                      <p className={styles.linheP}  >
                        5．严禁堵塞、占用消防安全疏散通道及安全出口，严禁任何影响人员安全疏散的行为。
                    </p>
                      <p className={styles.linheP}  >
                        6．对配置的消防器材（灭火器、防烟面具、灭火毯）、疏散指示灯、应急照明灯、防火门（如有）、气体灭火系统（如有）等设施应定期进行检查、维保，建立检查、维保记录。
                    </p>
                      <p className={styles.linheP}  >
                        7．消防器材应摆放在明显易取位置，且完整好用。落实专人每月进行一次检查，做好检查记录。
                    </p>
                      <p className={styles.linheP}  >
                        8．落实专人负责每季度对应急照明灯、疏散指示灯进行一次检测，并做好检测记录。
                    </p>
                      <p className={styles.linheP}  >
                        9．落实专人负责办公时间结束后的安全检查。
                    </p>
                      <p className={styles.linheP}  >
                        10．钱市街大厦广场内严禁吸烟及动用明火（除按规定办理了临时动火许可证外）。
                    </p>
                      <p className={styles.linheP}  >
                        11．严禁擅自动用、拆装、移位、阻挡租赁区域内及公共区域的消防设施及器材，或将消防设施和器材挪作他用；不得破坏消防标志。
                    </p>
                      <p className={styles.linheP}  >
                        12．租赁区域内的消防自然排烟窗仅限于紧急情况下由出租方负责打开，承租方严禁私自动用。
                    </p>
                      <p className={styles.linheP}  >
                        13．严禁“三合一”（生产、住宿、仓储在同一建筑空间内）生产经营活动。
                    </p>
                      <p className={styles.linheP}  >
                        （二）电气安全管理
                    </p>
                      <p className={styles.linheP}  >
                        1．严禁私拉乱接电气线路。
                    </p>
                      <p className={styles.linheP}  >
                        2．严禁使用不合格电器或无牌、无证伪劣电器产品。
                    </p>
                      <p className={styles.linheP}  >
                        3．不得阻挡配电箱，电箱应完整无损坏，电箱内各路电源应作标识。应急照明及疏散指示系统电源应独立设置。电箱内和正下方以及正下方50厘米内不得堆放物品；电箱前的通道宽度不小于80厘米。
                    </p>
                      <p className={styles.linheP}  >
                        4．用电检修等特种作业，必须安排由持有有效特种作业操作证的人员进行，安排专人做好现场监管并督促作业人员严格遵守安全操作规范。
                    </p>
                      <p className={styles.linheP}  >
                        5．严禁停放电动自行车、电动滑板车、独轮平衡车，以及携带电动车电池进入钱市街大厦内充电。
                    </p>
                      <p className={styles.linheP}  >
                        6．做好电气线路及用电设备的定期安全检查、维护、保养工作。
                    </p>
                      <p className={styles.linheP}  >
                        （三）安保安全管理
                    </p>
                      <p className={styles.linheP}  >
                        1．加强门、锁、现金、贵重物品的管理和防盗措施，对贵重物品、钱物的保管要订立行之有效的规章制度和检查措施。
                    </p>
                      <p className={styles.linheP}  >
                        2．落实预防爆炸、投毒等反恐事件的安全防范和安全教育工作。
                    </p>
                      <p className={styles.linheP}  >
                        3．严禁从事色情、吸毒、赌博、违反社会公德和封建迷信活动，不得组织、参加非法团体和集会，并不得提供租赁场地作为上述活动的场所。
                    </p>
                      <p className={styles.linheP}  >
                        4．严禁在租赁场地内贮藏枪支、管制刀具、炸药、雷管、汽油、烟花爆竹、化学腐蚀、毒性溶剂等易燃、易爆和危害公共安全的物品。
                    </p>
                      <p className={styles.linheP}  >
                        （四）应急管理
                    </p>
                      <p className={styles.linheP}  >
                        1．发生火情等紧急突发情况，承租方应履行灭火等应急处置义务，并立即通知出租方。
                    </p>
                      <p className={styles.linheP}  >
                        2．发生火情等紧急突发情况，需进行人员疏散时，承租方负责租赁场地内人员的安全疏散，并负责租赁场地内人员的清理工作，确保无人遗留在租赁场地内，并及时向出租方报告疏散情况。
                    </p>
                      <p className={styles.linheP}  >
                        六、承租方除上述应尽安全职责外，未尽事宜，按照国家有关法律法规和国家标准及行业标准规定执行。
                    </p>
                      <p className={styles.linheP}  >
                        七、违约责任
                    </p>
                      <p className={styles.linheP}  >
                        1．承租方违反应尽义务和约定的，承担责任及相应损失，依法赔偿物业   代管方因此造成的经济损失。
                    </p>
                      <p className={styles.linheP}  >
                        2．承租方违反应尽义务和约定的，造成安全事故的，造成甲方财产损失、人身伤害或者人员伤亡的，以及其他承租人、顾客造成伤害或损失的，承租方依法承担相应责任。
                    </p>
                      <p className={styles.linheP}  >
                        3．出租方发现承租方存在安全隐患，承租方不及时排除安全隐患，或拒不纠正的，出租方有权停止物业服务，有权向业主、当地负有安全生产监督管理职能的部门如实反映和上报。情节严重的，出租方可依据租赁合同的违约条款处理，申请终止租赁，因此造成的损失由承租方自行承担。
                    </p>
                      <p className={styles.linheP}  >
                        4．承租方对公共区域造成安全隐患的，按出租方要求进行整改。
                    </p>
                      <p className={styles.linheP}  >
                        5．同一个安全隐患被出租方发现2次以上的（含第2次），出租方根据本责任书的约定，有权要求承租方支付违约金人民币1000元/次。违约金须按出租方要求进行缴纳，否则出租方有权在承租方的保证金中扣除，甲方同时有权按七.3条款处理。
                    </p>
                      <p className={styles.linheP}  >
                        八、其他约定
                    </p>
                      <p className={styles.linheP}  >
                        （一）根据国家法律法规、国家标准和行业标准变更以及实际安全管理需要，出租方有权对本责任书相应条款进行调整与修订，并重新组织签订。
                    </p>
                      <p className={styles.linheP}  >
                        （二）发生非出租方责任的火情等突发情况时，出租方采取的应急措施包括但不限于必须损坏租户门及其他物品的应急措施时，出租方不承担承租方受损物品、恢复正常办公以及由此造成的相关费用。
                    </p>
                      <p className={styles.linheP}  >
                        九、本责任书自签署之日起生效。
                    </p>
                      <p className={styles.linheP}  >
                        承租方签署：
                    </p>
                      <p className={styles.linheP}  >
                        现场安全负责人签署：
                    </p>
                      <p className={styles.linheP}  >
                        联系电话：
                    </p>
                      <p className={styles.linheP}  >
                        签署日期：
                    </p>
                      <p className={styles.linheP}  style={{   textAlign: 'center' }}>
                        <h2>
                            代缴电费确认书
                        </h2>
                    </p>
                      <p className={styles.linheP}  >

                    </p>
                    {/*填写地址*/}
                      <p className={styles.linheP}     >
                        根据贵我双方所签订的《房屋租赁合同》约定，我方承租贵方位于{rentAddress}{unit_name}房号的房地产（下称“租赁房地产”）。
                    </p>
                      <p className={styles.linheP}     >
                        我方确认，租赁期间，贵方将按{elePice}元/度的电费，及{waterPice}元/吨的水费标准向我方收取租赁房地产使用期间所产生的水电费。贵方通过钱市街小程序扣缴的其他费用，包括但不限于水费、物业管理费等，均与电费无关。如我方逾期支付电费的，贵方可参照租赁合同中拖欠租金的相关条款追究我方违约责任。
                    </p>
                      <p className={styles.linheP}  style={{ marginLeft: '70px', fontSize: '24px' }}>
                        特此确认！
                    </p>
                      <p className={styles.linheP}  >
                        物业位置：{rentAddress}{unit_name}房号
                    </p>
                      <p className={styles.linheP}  >
                        确认人：
                    </p>
                      <p className={styles.linheP}  >
                        日期：
                    </p>
                      <p className={styles.linheP}  style={{   textAlign: 'center' }}>
                        <h2>
                            代缴损耗确认书
                        </h2>
                    </p>
                      <p className={styles.linheP}  >

                    </p>
                      <p className={styles.linheP}  >
                        根据贵我双方所签订的《租赁合同》约定，我方承租贵方位于{rentAddress}{unit_name}房号的房地产（下称“租赁房地产”）
                    </p>
                      <p className={styles.linheP}  >
                        我方确认，租赁期间，我方每月须按照按每度 {eleloss} 元向贵方缴纳设备损耗、维护费。前述设备损耗、维护费与我方每月应缴纳的物业管理费、水费、电费同时缴纳，如我方逾期支付的，贵方可参照租赁合同中拖欠租金的相关条款追究我方违约责任。
                    </p>
                      <p className={styles.linheP}  >
                        我方确认，前述设备损耗、维护费为贵方统筹协调租赁房地产综合管理所应收取的对价，在任何情况下我方均不以设备损耗、维护费畸高或不合理为由要求调整。
                    </p>
                      <p className={styles.linheP}  style={{ marginLeft: '70px', fontSize: '24px' }}>
                        特此确认！
                    </p>
                      <p className={styles.linheP}  >
                        物业位置：{rentAddress}{unit_name}房号
                    </p>
                      <p className={styles.linheP}  >
                        确认人：
                    </p>
                      <p className={styles.linheP}  >
                        日期：
                    </p>
                </p>
            </p>
            <Modal open={isOpen}  onCancel={()=>setisOpen(false)} width={850} footer={[
                <Button onClick={onOk} type='primary'>下载PDF</Button>
            ]}>
                  <p  className="receipt-container" id='pdf-content' style={{fontSize:'14px',padding:'0 20px'}} >
                    <h1 style={{ textAlign: 'center', paddingTop: '50px' }}>房屋租赁合同书</h1>
                      <p  className="receipt-info">
                          <p style={{  height:'950px'}}>
                              <p className={styles.linheP}  style={{fontWeight:'600',paddingTop:'20px' }}>出租方(甲方):{companyName}</p>
                              <p className={styles.linheP}   >地址：{companyAddress}</p>
                              <p className={styles.linheP}  >法定代表人：{legalPerson}</p>
                              <p className={styles.linheP}   >联系电话：{phone}</p>
                              <p className={styles.linheP}  >联系人：{contacts}</p>
                              <p className={styles.linheP}  style={{paddingTop: '30px' }}></p>
                              <p className={styles.linheP}  style={{fontWeight:'600' }}>承租方(乙方): {custom_name}</p>
                              <p className={styles.linheP}  >地址：{office_area}</p>
                              <p className={styles.linheP}   >法定代表人：{custom_name}</p>
                              <p className={styles.linheP}  >联系电话：{yiphone}</p>
                              <p className={styles.linheP}  >联系人：{custom_name}</p>
                              <p className={styles.linheP}   >根据《中华人民共和国民法典》及相关法律法规，就乙方承租甲方房屋事宜，甲、乙双方在自愿、平等和互利的基础上，经协商一致，签订本合同并共同遵守。</p>
                              <p  style={{    fontWeight: 500, fontSize: '24px' }} className={styles.linheP}>第一条：房屋状况</p>
                              <p className={styles.linheP}  >
                                <span style={{ fontSize: "1rem", fontWeight: 600 ,marginLeft:'20px'}}>1.</span>甲方将位于{rentAddress}{unit_name}房号的建筑物（以下简称“租赁物”）出租给乙方使用。
                                经甲乙双方认可确定租赁物面积约为{rentable_area}1．平方米计（本合同与面积相关的费用计算均以此面积为基础，其他方式的测量均不影响对该租赁面积的确认，双方均不得以租赁面积与实际交付面积存在误差为由解除合同或要求对方支付补偿或赔偿）。签订本合同前，乙方已充分获悉租赁物的现场情况、土地性质、规划用途和消防、竣工及产权状况，本项目周边市政配套及道路等，乙方承诺在租赁期限内或本合同终止后，不再以前述任何理由要求解除本合同或调整租赁面积或要求甲方退还、减免租金、物业费等款项。
                            </p>
                              <p className={styles.linheP}  >
                                <span style={{ fontSize: "1rem", fontWeight: 600,marginLeft:'20px' }}>2.</span>
                                租赁物的位置见本合同附件《租赁物平面图》阴影部分所示（租赁物平面图只作一般位置识别之用，并不显示租赁物实际面积大小，租赁物的具体位置、面积大小以本合同约定及现场实际情况为准）。
                            </p>
                              <p className={styles.linheP}  >
                                <span style={{ fontSize: "1rem", fontWeight: 600 ,marginLeft:'20px'}} >3.</span>
                                租赁物的交付标准见附件《房屋内交付标准》，乙方据此条件接收租赁物。交付的设备设施的具体数量、大小及位置以实际交付时的状态为准，由甲方（或甲方指定方）和乙方在交付时共同签署《交接确认书》予以确认。
                            </p>
                              <p className={styles.linheP}   >
                                  <span style={{ fontSize: "1rem", fontWeight: 600 ,marginLeft:'20px'}}>4.</span>
                                  本合同租赁物用途为{unit_type == 1 ? '商业' : '办公'}。乙方在租赁物从事经营的主体名称是{businessEntity}，其经营范围或业务范围为{businessScope}。如乙方需变更在租赁物从事经营主体、经营范围或业务范围的，需要事先征得甲方书面同意；涉及须经政府主管部门批准或办理登记手续的，乙方应自行办理。未经甲方书面同意，乙方不得将租赁物用于本条规定以外的其他用途。
                              </p>
                        </p>
                          <p style={{height:"980px"}}>
                              <p   style={{fontWeight: 500, fontSize: '24px'}} className={styles.linheP}>第二条：租赁期限</p>
                              <p className={styles.linheP}   >
                                  <span style={{marginLeft:'20px'}}></span>租赁期限为 {calculateYearsAndMonths(startDate,endDate)}年，即从{startDate}-{endDate}止（含免租期）。租赁期限届满前1个月，如双方未就续约事宜达成一致的，甲方可带新租户或未来使用者勘察该出租单元。合同到期乙方如需续租，须在合同到期日的1个月前向甲方书面申请，在同等条件下，乙方有优先承租权。
                              </p>
                              <p  style={{fontWeight: 500, fontSize: '24px' }} className={styles.linheP} >第三条：免租期</p>
                              <p className={styles.linheP}   >
                                  <span style={{ fontSize: "1rem", fontWeight: 600,marginLeft:'20px' }}>1.</span>
                                  租赁物的免租期为{calculateTotalRentalDays(mzq)}天,即从{
                                  mzq.map((item,index)=>{
                                      return(
                                          <span key={index}>
                                                <span>{dayjs(item.rentBeginTime).format('YYYY-MM-DD')}</span>至<span>{dayjs(item.rentEndTime).format('YYYY-MM-DD')}</span>，
                                          </span>
                                      )
                                  })
                              }止。免租期届满次日为起租日，由起租日开始计收租金。免租期内乙方无须向甲方支付租金，但须承担实际使用租赁物所产生的水费、电费、物业费等；因乙方原因本租赁合同实际履行期不足一年的，则乙方须向甲方支付免租期租金，免租期租金的计算公式为：本租赁合同首期租金÷30×免租期天数。
                              </p>
                              <p className={styles.linheP}     >
                                  <span style={{ fontSize: "1rem", fontWeight: 600,marginLeft:'20px' }}>2.</span>
                                  双方约定在{deliveryDate}（下称“交付日”），甲方将租赁物按双方约定的交付标准交付乙方使用，乙方同意按租赁物及设施的约定及现场实际状况标准承租。乙方应派专人（持乙方授权委托书及身份证明原件）到租赁物现场与甲方办理交付手续。乙方逾期不办理租赁物交付手续的，本合同规定的租赁期和免租期的起止日期不顺延；乙方逾期七天仍未办理租赁物交付手续的，甲方可单方解除合同，不予退回保证金和乙方已支付的其他全部费用，如乙方尚未交纳租赁保证金或物业费保证金的，须向甲方支付相当于租赁保证金及物业费保证金金额的违约金；如乙方未缴齐租赁保证金、物业费保证金及合同约定的首期租金、首期物业费的，甲方可顺延交付租赁物的时间，但合同约定的免租期及租赁期限均不予顺延。
                              </p>
                              <p style={{    fontWeight: 500, fontSize: '24px' }} className={styles.linheP} >第四条：租赁费用</p>
                              <p className={styles.linheP}   >
                                  <span style={{ fontSize: "1rem", fontWeight: 600,marginLeft:'20px' }}>1.</span>
                                  合同保证金：本租赁合同的保证金为人民币{deposit}元（大写：{numberToRMB(deposit)}），乙方在本合同签订当日向甲方支付。租赁期满，在乙方办理退租手续、交还租赁物、结清全部费用，注销以租赁物为注册地址之登记手续，以及甲方在收到乙方提交的相关材料后将租赁保证金无息退还乙方。
                                  如乙方违反本合同之规定，甲方有权将租赁保证金没收或做相应扣除，乙方在接到甲方扣除通知后的十五日内将甲方扣除的租赁保证金补足给甲方。
                              </p>
                          </p>
                          <p style={{height:'1050px'}}>
                              <p className={styles.linheP}>
                                  <span style={{ fontSize: "1rem", fontWeight: 600 ,marginLeft:'20px'}}>2.</span>
                                  租金：租赁物租金第1年起为每月{zuMoney}元。以此类推。合同租金明细如下:
                              </p>
                              <p className={styles.linheP}   >
                                  <Table columns={columns} dataSource={dz}  rowKey={(columns) => columns.id} size='small' pagination={false}/>
                              </p>
                              <p className={styles.linheP}   >
                                  <span style={{ fontSize: "1rem", fontWeight: 600 ,marginLeft:'20px'}}>3.</span>
                                  租金按月结算。乙方在本合同签署日支付首月租金给甲方；除首月租金外，乙方在每月二十八日前（按自然月计算）向甲方支付次月租金。
                              </p>
                              <p className={styles.linheP}>
                                  <span style={{ fontSize: "1rem", fontWeight: 600 ,marginLeft:'20px'}}>4.</span>
                                  物业费保证金及物业费:
                              </p>
                              <p className={styles.linheP}        >
                                  <span style={{ fontSize: "1rem", fontWeight: 600 ,marginLeft:'40px'}}>(1)</span>
                                  物业费保证金为人民币{depositFee}元（大写：{numberToRMB(depositFee)}），乙方在本合同签订当日向甲方支付。租赁期满，在乙方办理退租手续、交还租赁物、结清全部应付各项费用，注销以租赁物为注册地址之登记手续，以及甲方在收到乙方提交的相关材料后将物业费保证金无息退还乙方。
                              </p>
                              <p className={styles.linheP}       >
                                  <span style={{ fontSize: "1rem", fontWeight: 600 ,marginLeft:'40px'}}>(2)</span>
                                  租赁期间租赁物物业费为每月{manageFee}元，第2年起每年物业费将在上年的基础上递增{manageFeeRent}%，以此类推。乙方在本合同乙方签署之日支付首期物业费给甲方；除首期物业费外，乙方在每月二十八日前（按自然月计算）向甲方或甲方指定的物业服务方支付次月物业费。
                              </p>
                              <p className={styles.linheP}   >
                                  <span style={{ fontSize: "1rem", fontWeight: 600,marginLeft:'20px' }}>5.</span>
                                  水费、电费
                              </p>
                              <p className={styles.linheP}       >
                                  <span style={{ fontSize: "1rem", fontWeight: 600,marginLeft:'40px' }}>(1)</span>
                                  租赁期间乙方经营过程中所产生的水电费按乙方实际使用量计算，每月电费、水费需提前充值预付，具体充值办法详见附件《关于钱市街小程序使用的告知书》；（1）如乙方未按约向甲方支付租金等款项的，甲方可从乙方充值预付款中扣除乙方须向甲方支付的款项；以上水电单价均不含公摊及损耗，公摊及损害由乙方据实缴纳。如遇有关部门调整收费标准，则甲方可相应调整水电费标准。
                              </p>
                              <p className={styles.linheP}       >
                                  <span style={{ fontSize: "1rem", fontWeight: 600,marginLeft:'40px' }}>(2)</span>
                                  除水电费外，租赁期间乙方实际使用的物业等费用，按实际发生金额由乙方承担。法律法规规定由甲方代收的，乙方应按甲方通知及时交纳。
                              </p>
                              <p className={styles.linheP}   >
                                  <span style={{ fontSize: "1rem", fontWeight: 600,marginLeft:'20px' }}>6.</span>
                                  租金、保证金等费用支付方式：以支票或转账形式支付。
                              </p>
                              <p className={styles.linheP}    style={{marginLeft:'20px' }}>开户名称:{openName}</p>
                              <p className={styles.linheP}    style={{marginLeft:'20px' }} >开户银行:{openBank}</p>
                              <p className={styles.linheP}    style={{marginLeft:'20px' }} >银行账号:{bankCard}</p>
                              <p className={styles.linheP}    style={{marginLeft:'20px' }}>
                                  乙方支付至上述账户的款项按以下顺序扣款：1、赔偿金；2、违约金；3、租金，如扣除1、2项后剩余的款项不足以缴纳当期租金的，乙方须及时补足，否则，按本合同约定逾期缴纳租金承担违约责任。
                              </p>
                          </p>
                          <p style={{height:'1000px'}}>
                              <p  style={{    fontWeight: 500, fontSize: '24px' }} className={styles.linheP}>第五条：租赁物的维护、保养</p>
                              <p className={styles.linheP}   >
                                  <span style={{ fontSize: "1rem", fontWeight: 600,marginLeft:'20px' }}>1.</span>
                                  在租赁期内，租赁物所在的房屋主体结构所产生的修缮、维护费用由甲方承担；如乙方经营范围包括餐饮或乙方在租赁物内开展食品制作、加工的，乙方须按租赁面积与本项目内其他同类承租人共同分摊项目排烟管道、滤油池等设施定期清理、维护所产生的费用（具体分摊方案由甲方或甲方指定的物业公司根据项目实际情况核算）；如乙方拒绝承担相应费用的，甲方采取措施暂停乙方使用相应的设施。
                              </p>
                              <p className={styles.linheP}  >
                                  <span style={{ fontSize: "1rem", fontWeight: 600 ,marginLeft:'20px' }}>2.</span>
                                  租赁期间，租赁物内乙方专用设施的维修、保养由乙方负责。乙方在租赁期内应爱护租赁物，因使用不当造成租赁物或专用设施损坏的，由乙方承担责任和支付维修费用，对于租赁物的易损件由乙方承担维修费用。
                              </p>
                              <p className={styles.linheP} >
                                  <span style={{ fontSize: "1rem", fontWeight: 600,marginLeft:'20px' }}>3.</span>
                                  在租赁期内，甲方不负责乙方任何生产垃圾的处理，所有生产垃圾均由乙方自行处理。乙方在租赁期满或合同提前终止时，须将租赁物清扫干净（如甲方提供家具的乙方应确保家具外观完好且能正常使用），除乙方的自有设备等电器可拆除外，租赁物要按本合同交还条款的相关约定向甲方交还租赁物，乙方不能破坏装修、空调，如乙方破坏装修及空调的，甲方可要求乙方支付修复的费用（也可从保证金中扣除），如保证金不足扣除费用的，甲方有权追缴乙方欠款并要求乙方赔偿。
                              </p>
                              <p className={styles.linheP}  >
                                  <span style={{ fontSize: "1rem", fontWeight: 600,marginLeft:'20px' }}>4.</span>
                                  乙方在使用租赁物时必须遵守国家有关法律、广州市行政法规以及甲方有关租赁物管理的有关规定。如有违反，乙方要承担相应的责任。若影响到周围其他用户的正常运作及财物损失，损失由乙方赔偿。
                              </p>
                              <p className={styles.linheP}   >
                                  <span style={{ fontSize: "1rem", fontWeight: 600 ,marginLeft:'20px'}}>5.</span>
                                  若租赁期内甲方提供设施设备供乙方无偿使用，乙方需确保甲方提供的设施设备外观完好且能正常使用，使用期间维护费用由乙方承担。合同期满，相关设施设备随同出租物业移交甲方验收，若出现破损或丢失，乙方须赔偿，甲方可从保证金中扣除相应费用。
                              </p>
                              <p style={{    fontWeight: 500, fontSize: '24px' }} className={styles.linheP}>第六条：转租、转让和交换</p>
                              <p className={styles.linheP}>
                                  <span style={{ fontSize: "1rem", fontWeight: 600 ,marginLeft:'20px'}}>1.</span>
                                  租赁期限内，未经甲方书面确认，乙方不得对外转租、分租，不得将本合同项下的权利和义务转让给他人，也不得将租赁物与他人承租的租赁物进行交换，否则视乙方违约，甲方可以解除合同，不予退回全部保证金并要求乙方承担违约责任。
                              </p>
                              <p className={styles.linheP}  >
                                  <span style={{ fontSize: "1rem", fontWeight: 600 ,marginLeft:'20px'}}>2.</span>
                                  乙方在合同期内甲方同意其转租的，甲方将向乙方收取相当于转租时一个月租金的合同转名费及合同剩余租期的租金的印花税。
                              </p>
                              <p style={{    fontWeight: 500, fontSize: '24px' }} className={styles.linheP}>第七条：安全管理</p>
                              <p className={styles.linheP}   >
                                  <span style={{ fontSize: "1rem", fontWeight: 600,marginLeft:'20px' }}>1.</span>
                                  甲方负责租赁物所在建筑物（简称“本项目”）一次消防（即建筑物整体消防验收）；乙方承租租赁物后，对租赁物进行装饰装修需要办理的二次消防（包括但不限于消防设计审查、消防备案、公众聚集场所投入使用、营业前消防安全检查等）由乙方自行负责；乙方在租赁期间须严格遵守《中华人民共和国消防法》以及广州市政府有关消防安全管理制度，积极配合甲方做好消防工作。
                              </p>
                              <p className={styles.linheP}  >
                                  <span style={{ fontSize: "1rem", fontWeight: 600,marginLeft:'20px' }}>2.</span>
                                  由于乙方的经营、装修等国家规定必须重新进行行政审批手续的，乙方必须依法向有关部门申请并将相应书面文件提交甲方，聘请政府有关部门认可的施工单位报甲方书面同意后施工，费用由乙方支付。乙方负责审核装修设计单位和装修施工单位的相关资质，严控安全合规风险；乙方须与相关单位签订安全生产及消防安全管理协议，明确各自的安全生产管理职责。除因本项目整体规划、消防不合规导致乙方不能办理后续的手续外，乙方不得以租赁物不能通过相应的审批为由解除合同。
                              </p>
                              <p className={styles.linheP}   >
                                  <span style={{ fontSize: "1rem", fontWeight: 600 ,marginLeft:'20px'}}>3.</span>
                                  租赁物内因维修等需进行级临时动火作业时（含电焊、风焊等明火作业），需要经得甲方书面同意，如法律规定需要办理有关手续的乙方需经有关部门批准才能进行。
                              </p>
                          </p>
                          <p style={{height:'1030px'}}>
                              <p className={styles.linheP}  >
                                  <span style={{ fontSize: "1rem", fontWeight: 600,marginLeft:'20px' }}>4.</span>
                                  租赁期间，租赁物内不得存放化学、有毒、有害气体、易燃易爆等危险物品，否则，由此造成的一切经济损失和责任由乙方承担。
                              </p>
                              <p className={styles.linheP}   >
                                  <span style={{ fontSize: "1rem", fontWeight: 600,marginLeft:'20px' }}>5.</span>
                                  如果乙方安装的电器或线路或管道发生危险和不安全时，当甲方或有关政府机关提出要求时，乙方须立即更换上述设备、线路或管道。乙方须允许甲方或甲方指定方检查由乙方安装在该单元内的电器设备、线路或管道。由于乙方在该单元内安装的设备、线路或管道的故障或维修不善而造成的损失以及一切的赔偿由乙方负责，乙方并保证甲方不会因此而遭受任何损失。
                              </p>
                              <p style={{    fontWeight: 500, fontSize: '24px' }} >第八条：装修条款</p>
                              <p className={styles.linheP}>
                                  <span style={{ fontSize: "1rem", fontWeight: 600 ,marginLeft:'20px'}}>1.</span>
                                  在租赁期内如乙方须对租赁物进行装修、改建时必须向甲方提供装修、改建方案并取得甲方的书面同意（甲方之认可并不免除乙方需要办理的行政审批、许可、备案手续），必要时须向政府有关部门申报批准后方可开展装修作业。如装修、改建方案可能对公用部分及其他相邻用户造成影响的，甲方可对该方案提出异议，乙方必须予以修改。改建、装修费用由乙方承担。
                              </p>
                              <p className={styles.linheP}   >
                                  <span style={{ fontSize: "1rem", fontWeight: 600 ,marginLeft:'20px'}}>2.</span>
                                  租赁物装修及使用期间，乙方须遵照甲方或甲方指定物业管理公司的要求施工，并遵守物业管理公司的相关规定（包括不限于缴纳相应的装修保证金等），且确保装修后的消防、环保、生产安全合格，否则产生的全部责任和损失均由乙方承担，因此造成甲方损失的，由乙方赔偿。
                              </p>
                              <p className={styles.linheP}  >
                                  <span style={{ fontSize: "1rem", fontWeight: 600,marginLeft:'20px' }}>3.</span>
                                  如乙方的装修、改建方案可能对租赁物主体结构造成影响的，则须经甲方及原设计单位书面同意后方能进行。乙方在装修工程竣工后，须根据国家、地方消防验收相关标准要求，对需要验收或备案的装修工程依法进行验收或备案，并请甲方及物业管理公司查看，确定装修工程符合经批准的设计图则、装修效果图后方可投入使用。
                              </p>
                              <p className={styles.linheP}   >
                                  <span style={{ fontSize: "1rem", fontWeight: 600,marginLeft:'20px' }}>4.</span>
                                  乙方如需对租赁物业进行电力增容，须提前向甲方书面申请，经甲方书面同意后方可实施，因电力增容所产生的所有费用均由乙方承担，乙方确认在合同租赁期满或无论何种原因导致合同提前解除、终止时，电力增容设备均无偿归甲方所有。
                              </p>
                              <p className={styles.linheP}  >
                                  <span style={{ fontSize: "1rem", fontWeight: 600,marginLeft:'20px' }} >5.</span>
                                  乙方如发现租赁物主体结构、公共设备及共用基础设施或设备部分出现损坏或故障，应及时通知甲方而不得擅自处理，否则由此产生的一切损失由乙方负责。甲方应在接到乙方通知后予以答复并开始予以维修。
                              </p>
                              <p className={styles.linheP}   >
                                  <span style={{ fontSize: "1rem", fontWeight: 600,marginLeft:'20px' }}>6.</span>
                                  甲乙双方共同确认，为达成本租赁合同甲方根据乙方要求对租赁物进行了定制装修，装修费用合计{decorationCost}元；本合同提前解除或终止的，乙方须按照如下标准补偿甲方装修投入：剩余未履行的租赁期÷租赁期×甲方投入装修价值。
                              </p>
                              <p style={{    fontWeight: 500, fontSize: '24px' }}>第九条：租赁物交还及提前终止合同</p>
                              <p className={styles.linheP}   >
                                  <span style={{ fontSize: "1rem", fontWeight: 600 ,marginLeft:'20px'}}>1.</span>
                                  乙方须于租赁期满日或本合同提前终止/解约之日前，按本合同约定的交还标准向甲方交还租赁物。交还时双方须办理书面的交接手续，包括：共同检查核对甲方交付给乙方使用的设备设施是否完好（自然损耗除外），如有损毁乙方须予以修复或赔偿；将租赁物大门及其内部所有房门的钥匙、乙方雇员进出本项目的证件全部交给甲方；付清全部租金、物业服务费及水电费等其他应付费用。
                              </p>
                              <p className={styles.linheP}  >
                                  <span style={{ fontSize: "1rem", fontWeight: 600 ,marginLeft:'20px'}}>2.</span>
                                  乙方逾期不交还租赁物，每逾期一日，乙方应按租赁期满日或本合同提前终止/解约之日时日租金及日物业费之和的双倍向甲方支付房屋占用使用费，同时，乙方还须承担租赁物在被乙方占用期间内发生的其他乙方应付的一切费用。如因乙方逾期腾退租赁物而造成甲方其他损失的，乙方还须承担赔偿责任包括但不限于赔偿金、诉讼费、律师费、罚金、滞纳金等。
                              </p>
                          </p>
                          <p style={{height:'1030px'}}>

                              <p className={styles.linheP}   >
                                  <span style={{ fontSize: "1rem", fontWeight: 600 ,marginLeft:'20px'}}>3.</span>
                                  如乙方在租赁期满或本合同提前终止/解除之日没有向甲方交还租赁物，则甲方除可按约定向乙方收取占用使用费及其他费用以外，还有权在租赁期满之日或本合同提前终止/解约之日起次日自行开启或更换门锁、自行或委托第三人还原租赁物对租赁物内的物品（包括但不限于家具、装置和其他添置物）进行处理、对装修进行拆除，处理并拆除完毕后将租赁物重新租予其他承租方。甲方对因此而引起的损坏及乙方之损失概不负责。乙方不予以处理的装饰、装修、遗留设施设备、物品视为遗弃物，甲方可以自行处理，而不对乙方承担任何赔偿或补偿责任。甲方执行上述行为而引起的一切开支及费用均由乙方负担，甲方可以就上述费用向乙方追偿或选择直接在乙方支付的保证金中予以扣除，如保证金不足以支付租赁物的还原费用的，乙方应另行向甲方支付。
                              </p>
                              <p className={styles.linheP}  >
                                  <span style={{ fontSize: "1rem", fontWeight: 600,marginLeft:'20px' }}>4.</span>
                                  租赁期满或本合同提前终止乙方交还租赁物时，如甲方发现租赁物内本合同附件所列的装修、设备和设施被损坏或遗失（自然损耗除外），甲方可以要求乙方赔偿损失，并可从乙方交付的保证金中扣除。如保证金不足赔偿甲方损失的，甲方有权要求乙方赔偿差额。
                              </p>
                              <p className={styles.linheP}   >
                                  <span style={{ fontSize: "1rem", fontWeight: 600 ,marginLeft:'20px'}}>5.</span>
                                  租赁期限尚未届满，因乙方原因导致本合同解除的，乙方所缴纳的保证金均作为违约金不予退还，并且按违约处理。
                              </p>
                              <p className={styles.linheP}  >
                                  <span style={{ fontSize: "1rem", fontWeight: 600,marginLeft:'20px' }}>6.</span>
                                  租赁期限尚未届满且乙方无任何违约行为的情况下，若甲方要求提前终止本合同，甲方需向乙方支付相当于解除时月租金及月物业管理费之和二倍的违约金。
                              </p>
                              <p className={styles.linheP}    >
                                  <span style={{ fontSize: "1rem", fontWeight: 600 ,marginLeft:'20px'}}>7.</span>
                                  本合同解除或终止时，甲方可以选择租赁物装修、固定物品归甲方所有，或要求乙方在交还租赁物时按现状交还或整体/部分恢复至交付时之标准，由此发生的费用由乙方承担；如甲方书面同意乙方无需将租赁物恢复原状，甲方无须就乙方对租赁物和其装修、设备和设施进行的增建或改建做出任何补偿或赔偿。
                              </p>
                              <p className={styles.linheP}  >
                                  <span style={{ fontSize: "1rem", fontWeight: 600 ,marginLeft:'20px'}}>8.</span>
                                  双方的权利义务
                              </p>
                              <p className={styles.linheP}   >
                                  <span style={{ fontSize: "1rem", fontWeight: 600 ,marginLeft:'20px'}}>1</span>
                                  甲方的权利和义务
                              </p>
                              <p className={styles.linheP}     >
                                  <span style={{ fontSize: "1rem", fontWeight: 600,marginLeft:'40px' }}>(1)</span>
                                  甲方保证有权将租赁物出租给乙方用于本合同规定的用途，有完全的权限和能力签订租赁合同及履行租赁合同中甲方的义务。甲方应按附件二所列提供基础设施及承租区域内用电、用水等的正常供应，但使用费由乙方承担。
                              </p>
                              <p className={styles.linheP}>
                                  <span style={{ fontSize: "1rem", fontWeight: 600 ,marginLeft:'40px'}}>(2)</span>
                                  甲方保留对本项目的命名权以及变更本项目的名称、标志、总体面积、用途和整体装修风格的权利，甲方可以根据实际经营需要变更本项目内除租赁物外其他租赁物业的数目、编号、面积和具体用途，上述变更不构成对本租赁合同的违反，也不影响租赁合同的效力。
                              </p>
                              <p className={styles.linheP}     >
                                  <span style={{ fontSize: "1rem", fontWeight: 600,marginLeft:'40px' }}>(3)</span>
                                  在不影响乙方对租赁物租赁使用的前提下，甲方可以对甲方指定的物业公司或其他供应商变更，无需提前征询乙方。
                              </p>
                              <p className={styles.linheP}      >
                                  <span style={{ fontSize: "1rem", fontWeight: 600,marginLeft:'40px' }}>(4)</span>
                                  本项目及租赁物的外立面、大堂、电梯厅、电梯轿厢、走廊等公共部分使用权等归甲方所有（包括不限于举行活动或发布广告等）。
                              </p>
                              <p className={styles.linheP}     >
                                  <span style={{ fontSize: "1rem", fontWeight: 600,marginLeft:'40px' }}>(5)</span>
                                  如发生意外事故或紧急情况，危及人身或财产安全或影响本项目正常运作时，甲方可以不经乙方同意而采取紧急避险行动，如破门窗进入租赁物排除险情等，但甲方在采取紧急避险行动后应及时通知乙方，乙方应及时到达现场。如甲方采取的紧急避险行动有利于乙方财产或租赁物内留存的第三方的财产安全，则甲方采取紧急避险行动造成的租赁物门、窗等损坏及乙方其他损失，由乙方承担；其他损失，按法律规定承担或分担。
                              </p>
                              <p className={styles.linheP} style={{padding:'16px 0'}} >
                                  <span style={{ fontSize: "1rem", fontWeight: 600,marginLeft:'20px' }}>2.</span>
                                  乙方的权利和义务
                              </p>
                              <p className={styles.linheP}     >
                                  <span style={{ fontSize: "1rem", fontWeight: 600,marginLeft:'40px' }}>(1)</span>
                                  乙方保证有完全的权限和能力签订租赁合同及履行租赁合同中乙方的义务，保证在租赁物内的一切活动符合法律法规和租赁合同的规定。在不违反国家法律法规和租赁合同约定的前提下，乙方可自主使用租赁物。
                              </p>
                          </p>
                          <p style={{height:'1030px'}}>
                              <p className={styles.linheP}      >
                                  <span style={{ fontSize: "1rem", fontWeight: 600,marginLeft:'40px' }}>(2)</span>
                                  乙方租赁的租赁物不容许住宿、煮食（租赁物用途为餐饮的除外）、私拉乱接用电及存放易燃易爆物品，未经甲方或甲方指定的物业公司同意不得占道摆放物品。如因乙方违反相关规定而发生意外事故，一切法律责任和经济责任由乙方承担。
                              </p>
                              <p className={styles.linheP}     >
                                  <span style={{ fontSize: "1rem", fontWeight: 600 ,marginLeft:'40px'}}>(3)</span>
                                  乙方对其承租的租赁物，除本合同约定的限制及本项目相关物业管理规定中约定的事项、法律法规明令禁止之外，享有充分的使用权。甲方对乙方合法守章的经营活动不得进行干涉妨碍。
                              </p>
                              <p className={styles.linheP}      >
                                  <span style={{ fontSize: "1rem", fontWeight: 600 ,marginLeft:'40px'}}>(4)</span>
                                  乙方须按时缴交租金及其他应缴之费用。
                              </p>
                              <p className={styles.linheP}     >
                                  <span style={{ fontSize: "1rem", fontWeight: 600 ,marginLeft:'40px'}}>(5)</span>
                                  乙方在其生产经营对外宣传中，不得宣称或令其他第三方误认为其与甲方关系属合作、合营、合伙、联营或关联企业关系；否则甲方可以要求乙方向甲方支付届时月租金及月物业管理费之和的两倍作为违约金；同时乙方应立刻停止使用相关名称。如造成甲方损失，乙方须承担赔偿责任。
                              </p>
                              <p className={styles.linheP}      >
                                  <span style={{ fontSize: "1rem", fontWeight: 600 ,marginLeft:'40px'}}>(6)</span>
                                  在租赁物业内发生人员伤亡、财产损失等事件，乙方应直接承担全部责任。乙方承诺甲方无需对非因甲方原因造成的自然灾害、水灾、火灾、盗窃、乙方自有设备设施故障等造成的人身损害、财产和其他损失承担任何法律责任。如遇第三方直接向甲方进行追索时（包括提起仲裁、诉讼），乙方同意由乙方自行出面解决，并承担全部责任。若乙方需要甲方协助处理的，须提前书面通知甲方，由此发生的费用由乙方负责。若因乙方推诿而导致甲方损失的，则由此导致甲方产生的一切费用和所有损失包括但不限于赔偿金、诉讼费、律师费、罚金、滞纳金等均由乙方负责承担。同时，甲方可以单方解除本合同，没收全部保证金作为违约金。如造成甲方损失，乙方须承担赔偿责任。
                              </p>
                              <p className={styles.linheP} >
                                  <span style={{ fontSize: "1rem", fontWeight: 600 ,marginLeft:'40px'}}>(7)</span>
                                  乙方不得在租赁物内进行或容许他人进行任何造成噪音、空气污染、排污管堵塞或其他违反相邻关系的行为而影响邻近承租方。
                              </p>
                              <p className={styles.linheP}      >
                                  <span style={{ fontSize: "1rem", fontWeight: 600 ,marginLeft:'40px'}}>(8)</span>
                                  乙方承租后，自行办理按本合同规定用途使用租赁物所需要的各种政府许可或批文，自负盈亏，一切债权债务均自行负责，与甲方或甲方指定的物业公司均无关。
                              </p>
                              <p className={styles.linheP}      >
                                  <span style={{ fontSize: "1rem", fontWeight: 600,marginLeft:'40px' }}>(9)</span>
                                  乙方须向政府有关部门申请必要的执照、批准证书或许可证等（如法律法规要求）。乙方须在开始营业前申请并取得在租赁物内开展经营业务活动所需的一切许可和批准并在租赁期内保持有效。
                              </p>
                              <p className={styles.linheP}      >
                                  <span style={{ fontSize: "1rem", fontWeight: 600,marginLeft:'40px' }}>(10)</span>
                                  乙方须于租赁期满或提前终止后60天内办理完毕工商登记注销或迁出本项目租赁地址相关手续。否则，每逾期一天，乙方须参照租赁期满日或本合同提前终止/解约之日时日租金和日物业管理费之和的的两倍支付违约金，并承担由此造成甲方的损失，同时甲方可以从保证金中扣除违约金，乙方须在接到书面通知后5日内补足保证金，逾期交纳相关费用，每逾期一天，以应付未付款金额为基数按每日千分之三标准计算向甲方支付违约金。
                              </p>
                              <p className={styles.linheP}     >
                                  <span style={{ fontSize: "1rem", fontWeight: 600 ,marginLeft:'40px'}}>(11)</span>
                                  乙方对其雇员、代理人、聘用的第三方和访客在本项目内的一切行为向甲方承担连带责任，乙方及其雇员、代理人、聘用的第三方和访客造成甲方及其雇员、代理人、本项目的其他租户或使用者人身损害、财产或其他损失的，乙方承担连带赔偿责任。
                              </p>
                              <p className={styles.linheP}      >
                                  <span style={{ fontSize: "1rem", fontWeight: 600 ,marginLeft:'40px'}}>(12)</span>
                                  乙方使用租赁物时，须遵守国家和地方关于安全生产、消防、治安保卫、劳动保护及职业病防治的安全法律法规，乙方承担租赁物内的安全经营责任，乙方的负责人为租赁物经营安全的第一责任人；同时，乙方指定该负责人作为租赁物安全经营的直接责任人，负责租赁物安全经营的具体工作。乙方须做好租赁物及租赁物与本项目相连接部分的防火、防盗、防工伤等安全经营工作，接受甲方的安全监督检查，积极配合甲方做好本项目的安全经营管理工作。
                              </p>
                              <p className={styles.linheP}     >
                                  <span style={{ fontSize: "1rem", fontWeight: 600 ,marginLeft:'40px'}}>(13)</span>
                                  乙方保证按照约定的租赁用途，在其合法经营范围内，按照使用规范，正常合理地使用租赁房屋及其设施、设备，不放置任何超过或可能超过建筑物设计荷载范围的物品，不得影响、妨碍公共设施、设备的正常使用和正常维护、维修、保养，不得损坏租赁房屋结构及附属设备设施。
                              </p>
                              <p className={styles.linheP}      >
                                  <span style={{ fontSize: "1rem", fontWeight: 600 ,marginLeft:'40px'}}>(14)</span>
                                  在承租期内的任何时候、任何情况下，乙方不能主张以保证金折抵应付甲方租赁费用及其他应付费用。
                              </p>
                          </p>
                          <p style={{height:'1030px'}}>
                              <p style={{    fontWeight: 500, fontSize: '24px' }}>第十条：违约责任</p>
                              <p className={styles.linheP}   >
                                  <span style={{ fontSize: "1rem", fontWeight: 600 ,marginLeft:'20px'}}>1.</span>
                                  甲乙双方同意，有下列情形之一，乙方可书面通知甲方提前解除本合同。甲方无息退还乙方缴纳的保证金（如有），除此外甲方无需承担其他违约责任：
                              </p>
                              <p className={styles.linheP}     >
                                  <span style={{ fontSize: "1rem", fontWeight: 600,marginLeft:'40px' }}>(1)</span>
                                  甲方交付的租赁物存在设计、质量缺陷，危及乙方人身财产安全的；
                              </p>
                              <p className={styles.linheP}      >
                                  <span style={{ fontSize: "1rem", fontWeight: 600,marginLeft:'40px' }}>(2)</span>
                                  甲方交付的租赁物不符合本合同的约定，致使乙方无法使用租赁物的；
                              </p>
                              <p className={styles.linheP}   >
                                  <span style={{ fontSize: "1rem", fontWeight: 600 ,marginLeft:'40px'}}>(3)</span>
                                  租赁物因甲方原因被司法机关或者主管行政机关依法查封，致使租赁物不能使用连续超过30天的。
                              </p>
                              <p className={styles.linheP}   >
                                  <span style={{ fontSize: "1rem", fontWeight: 600 ,marginLeft:'20px'}}>2.</span>
                                  乙方逾期缴付租金、物业费及其他应缴费用的，每逾期一日，以乙方未付费用为基数，按照每日千分之三的标准向甲方支付逾期付款违约金，直至乙方付清所有前述费用。乙方拖欠费用超过七天（含）的，甲方及/或物业管理公司可在提前二十四小时书面通知乙方的前提下，停止向租赁物提供空调（如有）等物业服务直到乙方支付所有欠款及因此而引起的费用（包括重新接驳空调等服务供应的费用），甲方对乙方因此而蒙受的任何破坏和损失不承担任何责任。
                              </p>
                              <p className={styles.linheP}  >
                                  <span style={{ fontSize: "1rem", fontWeight: 600,marginLeft:'20px' }}>3.</span>
                                  甲、乙双方同意，有下列情形之一的，甲方解除本合同，乙方已支付的全部费用包括但不限于租金、物业服务费（无论该等费用对应的租赁期间是否届满）、保证金等甲方可以不予退还，并且乙方还需向甲方支付相当于解除时月租金及月物业管理费之和二倍的违约金；若该等前述费用不足抵付甲方损失的，甲方可以继续向乙方追偿：
                              </p>
                              <p className={styles.linheP}      >
                                  <span style={{ fontSize: "1rem", fontWeight: 600 ,marginLeft:'40px'}}>(1)</span>
                                  乙方逾期支付租金或其他应付费用连续超过三十日或累计超过四十五日的；
                              </p>
                              <p className={styles.linheP}     >
                                  <span style={{ fontSize: "1rem", fontWeight: 600 ,marginLeft:'40px'}}>(2)</span>
                                  乙方提前终止本合同的；
                              </p>
                              <p className={styles.linheP}      >
                                  <span style={{ fontSize: "1rem", fontWeight: 600 ,marginLeft:'40px'}}>(3)</span>
                                  乙方未征得甲方书面同意改变租赁物用途，或未经相关政府部门批准从事非法经营活动；
                              </p>
                              <p className={styles.linheP}     >
                                  <span style={{ fontSize: "1rem", fontWeight: 600 ,marginLeft:'40px'}}>(4)</span>
                                  因乙方原因造成租赁物主体结构损坏的，或未征得甲方书面同意改变房屋结构的；
                              </p>
                              <p className={styles.linheP}      >
                                  <span style={{ fontSize: "1rem", fontWeight: 600,marginLeft:'40px' }}>(5)</span>
                                  乙方擅自转租或与他人交换各自承租的房屋的；
                              </p>
                              <p className={styles.linheP}     >
                                  <span style={{ fontSize: "1rem", fontWeight: 600 ,marginLeft:'40px'}}>(6)</span>
                                  乙方违反本合同约定给甲方造成损失，且经甲方书面催告后五日内拒不改正违约行为的；
                              </p>
                              <p className={styles.linheP}      >
                                  <span style={{ fontSize: "1rem", fontWeight: 600,marginLeft:'40px' }}>(7)</span>
                                  乙方将租赁物用于任何非法目的或乙方将租赁物用于乙方营业执照所列经营范围以外之目的的；
                              </p>
                              <p className={styles.linheP}     >
                                  <span style={{ fontSize: "1rem", fontWeight: 600,marginLeft:'40px' }}>(8)</span>
                                  乙方破产或进入清算程序的，或乙方之财产被强制执行，或乙方被接管人接收的；
                              </p>
                              <p className={styles.linheP}      >
                                  <span style={{ fontSize: "1rem", fontWeight: 600,marginLeft:'40px' }} >(9)</span>
                                  乙方因违法经营、债权债务等原因致使政府有关部门、法院或仲裁机构责令其停止营业或查封扣押租赁房屋及其内财物的；
                              </p>
                              <p className={styles.linheP}     >
                                  <span style={{ fontSize: "1rem", fontWeight: 600 ,marginLeft:'40px'}}>(10)</span>
                                  乙方被指侵害他人合法权益，使甲方被卷入诉讼或行政查处案件的；债权人上门追讨债务，影响本项目全部或部分正常营业的或造成甲方和物业管理方名誉受损的；
                              </p>
                              <p className={styles.linheP}      >
                                  <span style={{ fontSize: "1rem", fontWeight: 600,marginLeft:'40px' }}>(11)</span>
                                  乙方因不正当竞争或虚假宣传等被消费者围堵，影响本项目全部或部分正常营业的或造成甲方和物业管理方名誉受损的；
                              </p>
                              <p className={styles.linheP}     >
                                  <span style={{ fontSize: "1rem", fontWeight: 600 ,marginLeft:'40px'}}>(12)</span>
                                  乙方承租期间，如在本项目物业范围内，发生针对乙方或乙方关联方的群体性社会事件，社会群体围堵聚集本项目物业或乙方租赁物业，影响本项目物业正常营业的；
                              </p>
                          </p>
                          <p style={{height:'1030px'}}>

                              <p className={styles.linheP}      >
                                  <span style={{ fontSize: "1rem", fontWeight: 600 ,marginLeft:'40px'}}>(13)</span>
                                  除上述情形外，乙方其他行为影响本项目全部或部分正常营业、对其他业户造成不良影响或造成甲方和物业管理方名誉受损，甲方和物业管理方要求限期改正而仍未改正的；
                              </p>
                              <p className={styles.linheP}     >
                                  <span style={{ fontSize: "1rem", fontWeight: 600 ,marginLeft:'40px'}}>(14)</span>
                                  其他归因于乙方，法律允许甲方单方解除合同之情形的。
                              </p>
                              <p className={styles.linheP}   >
                                  <span style={{ fontSize: "1rem", fontWeight: 600,marginLeft:'20px' }}>4.</span>
                                  因乙方违约导致甲方采取诉讼或非诉讼方式维护合法权益实现债权的，乙方须赔偿甲方蒙受的损失，包括但不限于甲方为此支付的诉讼费、律师费、差旅费及其他维护合法权益实现债权的费用。
                              </p>
                              <p className={styles.linheP}  >
                                  <span style={{ fontSize: "1rem", fontWeight: 600,marginLeft:'20px' }}>5.</span>
                                  乙方特此同意，在下述情况下，甲方无须对下列事件负责（且本合同项下之租金及其他费用不得减免或中止支付）：
                              </p>
                              <p className={styles.linheP}      >
                                  <span style={{ fontSize: "1rem", fontWeight: 600 ,marginLeft:'40px'}}>(1)</span>
                                  因对租赁物或其相邻房屋或本项目进行维修保养或因按本合同规定的程序对租赁物或其相邻房屋或本项目进行装修、增建或改建，致使公用设施临时性停止使用，或导致租赁物的水、电、电话、传真或其他有关服务或供应临时性中断，从而使乙方或乙方的雇员、代理人或访客发生损失的；
                              </p>
                              <p className={styles.linheP}   >
                                  <span style={{ fontSize: "1rem", fontWeight: 600 ,marginLeft:'40px'}}>(2)</span>
                                  因发生地震、火灾、水灾、暴风雨、爆炸、台风、战争、动乱、暴乱、罢工、国家或政府机关征用、征收、征购、没收或收归国有，或发生任何甲方无法控制的其他不可抗力事件或事故，致使乙方或乙方的雇员、代理人或访客发生损失的；
                              </p>
                              <p className={styles.linheP}      >
                                  <span style={{ fontSize: "1rem", fontWeight: 600 ,marginLeft:'40px'}}>(3)</span>
                                  由于乙方的原因造成的任何损失和/或伤害或乙方未及时采取措施导致扩大的损失或损害；
                              </p>
                              <p className={styles.linheP}     >
                                  <span style={{ fontSize: "1rem", fontWeight: 600 ,marginLeft:'40px'}}>(4)</span>
                                  任何时间租赁物内的非因甲方故意或重大过失原因造成的人身损害或财产损失（甲方或甲方指定的物业公司的保安人员、值班人员对本项目提供的保安服务并不构成甲方对租赁物及其内部人员与财产的保卫责任）。
                              </p>
                              <p className={styles.linheP}   >
                                  <span style={{ fontSize: "1rem", fontWeight: 600,marginLeft:'20px' }}>6.</span>
                                  若因政府有关法律法规的修改或政府征收等行为（乙方因自身原因以及违法行为导致政府的行政处罚除外）导致双方无法继续履行本合同时，本合同自行终止，甲方将剩余保证金退还给乙方，双方互不追究责任。
                              </p>
                              <p className={styles.linheP}  >
                                  <span style={{ fontSize: "1rem", fontWeight: 600,marginLeft:'20px' }}>7.</span>
                                  因乙方违约导致甲方依据本合同约定解除合同时，乙方须协助甲方开具红字发票等事宜。如因此造成甲方损失的（包括但不限于不配合办理开具红字增值税专用发票、无法抵扣增值税、多缴增值税等），乙方须承担赔偿责任。
                              </p>
                              <p className={styles.linheP}   >
                                  <span style={{ fontSize: "1rem", fontWeight: 600 ,marginLeft:'20px'}}>8.</span>
                                  乙方未按本合同规定履行其安全生产职责的，甲方可以立即制止乙方的违法、违约行为，要求乙方立即予以整改，如乙方拒不停止或拒不改正的，甲方可以解除租赁合同，收回租赁租赁物，保证金及其他乙方已付费用归甲方享有无需退还乙方。乙方或其聘用的第三方的原因造成的安全事故或造成的第三方人身伤害或财产损失，均由乙方承担全部责任，如因此给甲方造成损失（包括但不限于财产损失）的，乙方须赔偿甲方的损失。
                              </p>
                              <p className={styles.linheP}  >
                                  <span style={{ fontSize: "1rem", fontWeight: 600 ,marginLeft:'20px'}}>9.</span>
                                  租赁期内，因乙方原因导致租赁合同提前解除或终止，最后一个计租周期不足一个月的，乙方须按照一个月的标准向甲方支付租金、物业费。
                              </p>
                              <p   style={{    fontWeight: 500, fontSize: '24px',paddingTop:'50px'}}>第十一条：保险</p>
                              <p className={styles.linheP}    >
                                  <span style={{ fontSize: "1rem", fontWeight: 600,marginLeft:'20px' }}>1.</span>
                                  乙方须在租赁物的装修期间及整个租赁期间购买乙方财产与人身安全的保险、乙方公众责任险及建筑工程一切险，以及可能发生的其他风险购买相应责任险及财产险，并保证上述保险在整个租赁期间有效存在。
                              </p>
                              <p className={styles.linheP}  >
                                  <span style={{ fontSize: "1rem", fontWeight: 600 ,marginLeft:'20px'}}>2.</span>
                                  若因乙方的原因，发生涉及甲方损失的保险事故，乙方从保险公司获得的赔款须首先用于赔偿甲方的损失；如果乙方从保险公司获得的赔款不足以赔偿甲方的损失，则差额部分由乙方赔偿甲方。如遇租赁物内发生意外时，若因乙方未购买前述保险或投保金额不足以弥补所产生的一切损失（包括前述保险单赔偿范围内的损失）及责任均由乙方承担。
                              </p>
                          </p>
                          <p style={{height:'1030px'}}>

                              <p className={styles.linheP}   >
                                  <span style={{ fontSize: "1rem", fontWeight: 600 ,marginLeft:'20px'}}>3.</span>
                                  如果乙方发生财产保险条款规定之意外，甲方可协助乙方向保险公司索赔，受益人为乙方，赔付金额以保险公司核定赔付为准，乙方不得再向甲方提出额外赔偿。
                              </p>
                              <p style={{    fontWeight: 500, fontSize: '24px' }}>第十二条:争议解决</p>
                              <p className={styles.linheP}   >
                                  本合同订立、履行、解释、争议的解决等与本合同有关的所有事宜均适用中华人民共和国法律。在履行本合同过程中发生争议，双方应友好协商解决。协商不成，双方均可以向租赁物所在地人民法院提起诉讼。
                              </p>
                              <p  style={{    fontWeight: 500, fontSize: '24px' }}>第十三条:通知和送达</p>
                              <p className={styles.linheP}   >
                                  <span style={{ fontSize: "1rem", fontWeight: 600 ,marginLeft:'20px'}}>1.</span>
                                  甲方指定如下人员为与乙方的联系人，负责转达甲方的指示和要求，提供文件和资料，接收乙方向甲方送达的通知、文件和资料等，甲方更换联系人须及时书面通知乙方：
                                  <form className={styles.gridForm}>
                                      <p   className={styles.gridItem}>甲方指派人员</p>
                                      <p   className={styles.gridItem}>联系电话</p>
                                      <p   className={styles.gridItem}>地址</p>
                                      <p   className={styles.gridItem}>{attract}</p>
                                      <p   className={styles.gridItem}>{attractPhone}</p>
                                      <p   className={styles.gridItem}>{attractWXNumber}</p>
                                  </form>
                              </p>
                              <p className={styles.linheP}  >
                                  <span style={{ fontSize: "1rem", fontWeight: 600,marginLeft:'20px' }}>2.</span>
                                  乙方指定如下人员为与甲方的联系人，负责转达乙方的指示和要求，提供文件和资料，接收甲方向乙方送达的通知、文件和资料等，乙方更换联系人须及时书面通知甲方：
                                  <form className={styles.gridForm}>
                                      <p  className={styles.gridItem}>乙方指派人员</p>
                                      <p  className={styles.gridItem}>身份证</p>
                                      <p  className={styles.gridItem}>微信号</p>
                                      <p  className={styles.gridItem}>{dispatchName}</p>
                                      <p  className={styles.gridItem}>{dispatchCard}</p>
                                      <p  className={styles.gridItem}>{yiphone}</p>
                                  </form>
                              </p>
                              <p className={styles.linheP}   >
                                  <span style={{ fontSize: "1rem", fontWeight: 600,marginLeft:'20px' }}>3.</span>
                                  甲、乙双方因履行本合同而相互发出或者提供的所有通知、文件、资料，均以合同中所列明的电子邮箱/微信、地址、电话送达。电子邮箱和移动电话短信或微信送达的，电子邮件或短信或微信发出之日视为送达之日，邮寄方式按地址使用EMS、顺丰等快递邮寄的，自邮件发出后视为送达（对方拒收、非本人签收、退回、无法送达等均视为送达并同样产生送达的法律效力）。
                              </p>
                              <p className={styles.linheP}  >
                                  <span style={{ fontSize: "1rem", fontWeight: 600 ,marginLeft:'20px'}}>4.</span>
                                  甲方及甲方指定的本项目物业管理公司在本项目适当的公共范围设置告示板，以张贴管理规则及其他规定的通知及布告，通知或布告在告示板上连续张贴3天后，即构成对乙方的有效通知。
                              </p>

                          </p>
                          <p style={{height:'1030px'}}>
                              <p  style={{ fontWeight: 500, fontSize: '24px' }}>第十四条:其他条款</p>
                              <p className={styles.linheP}   >
                                  <span style={{ fontSize: "1rem", fontWeight: 600 ,marginLeft:'20px'}}>1.</span>
                                  双方确认，甲方已经将租赁物的情况详细告知乙方，乙方对租赁物的情况已经充分了解（包括租赁物周边市政设施配套情况等）。
                              </p>
                              <p className={styles.linheP}  >
                                  <span style={{ fontSize: "1rem", fontWeight: 600,marginLeft:'20px' }}>2.</span>
                                  乙方法定代表人作为乙方的关联方自愿对本租赁合同项下乙方的全部债务承担无限连带责任，保证期间为三年。
                              </p>
                              <p className={styles.linheP}   >
                                  <span style={{ fontSize: "1rem", fontWeight: 600,marginLeft:'20px' }}>3.</span>
                                  合同未尽事宜，经双方协商一致后，可另行签订书面补充协议，书面补充协议与本合同具有同等法律效力。
                              </p>
                              <p className={styles.linheP}  >
                                  <span style={{ fontSize: "1rem", fontWeight: 600,marginLeft:'20px' }}>4.</span>
                                  本合同的附件系本合同不可分割的一部分，与本合同具有同等法律效力。
                              </p>
                              <p className={styles.linheP}   >
                                  <span style={{ fontSize: "1rem", fontWeight: 600,marginLeft:'20px' }}>5.</span>
                                  本合同一式四份，甲、乙双方各执二份，经双方签署后生效。
                              </p>
                              <p className={styles.linheP}  >
                                  <span style={{ fontSize: "1rem", fontWeight: 600 ,marginLeft:'20px'}}>6.</span>
                                  若按照适用法律及/或政府之规定，本合同需办理登记备案，且登记备案后方可取得备案证明的，乙方应负责办理登记备案手续，并承担由此产生的一切（包括证照）费用。
                                  <span >若因当地房屋租赁管理部门之要求，需使用其标准示范文本（简称备案合同）的，则该备案合同仅为房产租赁登记部门方便存档之用途，不论备案合同签订的时间是否晚于本合同签订时间，基于租赁关系项下的甲乙双方最终的权利义务以及租赁合同生效时间、纠纷解决都以本合同约定内容为准，备案合同记载之内容与本合同不一致或有冲突的，依本合同约定为准。</span>
                              </p>
                              <p className={styles.linheP}   >
                                  <span style={{ fontSize: "1rem", fontWeight: 600,marginLeft:'20px' }}>7.</span>
                                  签订本合同系双方真实意思表示。乙方确认在同意订立本合同前，已仔细阅读本合同所有条款，对本合同所有条款及内容已经阅悉，均无异议，并对双方的权利义务达成了充分的理解，对甲方所特别提示的，免除或者限制甲方责任的条款有充分了解和预期。
                              </p>
                          </p>
                          <p style={{height:'1030px'}}>
                              <p className={styles.linheP}  style={{    fontWeight: 500, fontSize: '24px' }}>（以下无正文）</p>
                              <p className={styles.linheP}  >
                                  附件一 租赁物平面图
                              </p>
                              <p className={styles.linheP}  >
                                  附件二 房屋交付标准
                              </p>
                              <p className={styles.linheP}  >
                                  附件三 交接确认书
                              </p>
                              <p className={styles.linheP}  >
                                  附件四 廉洁诚信承诺书
                              </p>
                              <p className={styles.linheP}   >
                                  附件五 双方证照文件
                              </p>
                              <p className={styles.linheP}     >
                                  附件六 《关于钱市街小程序使用的告知书》
                              </p>
                              <p className={styles.linheP}  >
                                  附件七 《安全生产责任书》
                              </p>
                              <p className={styles.linheP}  >
                                  附件八  代缴确认书
                              </p>
                              <p className={styles.linheP}  >
                                  【签署页  无正文】
                              </p>
                              <p className={styles.linheP}><span style={{ marginRight: '100px' }}>甲方（签署）:{companyName}</span><span>乙方（签署）:{customcompany_name}</span></p>
                              <p className={styles.linheP}><span style={{ marginRight: '200px' }}>法定代表人:{legalPerson}</span><span>法定代表人:{custom_name}</span></p>
                              <p className={styles.linheP}><span style={{ marginRight: '300px' }}>签订日期 :<span style={{ color: "red" }}></span></span><span>签订日期:<span style={{ color: 'red' }}></span></span></p>
                        </p>
                          <p  style={{height:'1030px'}}>
                              <h3 >
                                  附件一：《租赁物平面图》
                              </h3>
                              <p className={styles.linheP} >
                                  <div style={{display:'flex'}}>
                                      {unitImage.length>0?
                                          unitImage.map((item:any,index:any)=>{
                                              return   <Space key={index}>
                                                  <Image src={item} style={{width:'300px',height:'300px'}}/>
                                              </Space>
                                          })
                                          :''}
                                  </div>
                              </p>
                          </p>
                          <p style={{height:"1030px"}}>
                              <p className={styles.linheP}>
                                  <h3>
                                      附件二：1、房屋内交付标准
                                  </h3>
                                  <p className={styles.linheP} >
                                      <Table columns={wupinTab} rowKey={(columns) => columns.key} dataSource={wupinList} size='small' style={{width:'600px'}}  pagination={false}/>
                                  </p>
                              </p>
                              <p className={styles.linheP} >
                                  <h3>
                                      2、物品清单
                                  </h3>
                              </p>
                          </p>
                          <p style={{height:'1030px'}}>
                              <p className={styles.linheP} >
                                  <h3>
                                      附件三：交接确认书
                                  </h3>
                              </p>
                              <h2 style={{ textAlign: 'center', fontSize: '24px' }} >
                                  交接确认书
                              </h2>
                              <p className={styles.linheP}  >
                                  甲方：{companyName}
                              </p>
                              <p className={styles.linheP}   >
                                  乙方：{customcompany_name}
                              </p>
                              <p className={styles.linheP}  >
                                  鉴于：双方于<span >{deliveryDate}</span>日就位于{rentAddress}{unit_name}房号的建筑物（以下简称“租赁物”）的租赁事宜签署了《房屋租赁合同书》。根据《房屋租赁合同书》约定，甲方应于{startDate}日之前按照合同约定向乙方交付租赁房地产。
                              </p>
                              <p className={styles.linheP}      >
                                  现双方根据租赁房地产验收交付等情况确认如下：
                              </p>
                              <p className={styles.linheP}     >
                                  <span style={{ fontSize: "1rem", fontWeight: 600,marginLeft:'20px' }}>1.</span>
                                  经乙方查验，租赁房地产完全符合《房地产租赁合同》及其附件约定的交付清单，乙方同意接收租赁房地产。
                              </p>
                              <p className={styles.linheP}      >
                                  <span style={{ fontSize: "1rem", fontWeight: 600,marginLeft:'20px' }}>2.</span>
                                  双方确认：<span>{deliveryDate}</span>为签署《房屋租赁合同书》项下的租赁物交付日。
                              </p>
                              <p className={styles.linheP}     >
                                  本确认书经双方签署之日起生效。
                              </p>
                              <p className={styles.linheP}    ><span style={{ marginRight: '100px' }}>甲方（签署）:{companyName}</span><span>乙方（签署）:{customcompany_name}</span></p>
                              <p className={styles.linheP}   ><span style={{ marginRight: '300px' }}>签订日期 :<span style={{ color: "red" }}></span></span><span>签订日期:<span style={{ color: 'red' }}></span></span></p>
                              <p className={styles.linheP} >
                              </p>
                          </p>
                          <p style={{height:'1030px'}}>
                              <h3>
                                  附件四：廉洁诚信承诺书
                              </h3>
                              <p className={styles.linheP}  style={{ textAlign: 'center' }}>
                                  <h2 style={{ fontWeight: 600, fontSize: '24px' }}>廉洁诚信承诺书</h2>
                              </p>
                              <p className={styles.linheP}   >
                                  为规范企业经营活动，倡导廉洁诚信，抵制商业贿赂和不正当竞争，保障甲乙双方的合法权益，遵循诚实守信的原则，营造公平竞争、健康有序的商业环境，特制定本承诺书，承诺如下：
                              </p>
                              <p className={styles.linheP}  >
                                  第一条  严格遵守国家有关法律法规，保持正当的经济（合作）业务活动。
                              </p>
                              <p className={styles.linheP}   >
                                  第二条  在经济（合作）业务活动中应当廉洁自律，不得发生任何涉及商业贿赂或损害对方企业利益的行为，包括但不限于以下情形：
                              </p>
                              <p className={styles.linheP}     >
                                  （一）参加对方单位及对方工作人员安排的可能对公正履行职责有影响的活动，如宴请、消费娱乐和健身、旅游等；
                              </p>
                              <p className={styles.linheP}      >
                                  （二）向对方单位及对方工作人员索要或接受对方单位及对方工作人员的回扣、提成、礼品、礼金、有价证券或其他名义交付的现金、实物及其他利益；
                              </p>
                              <p className={styles.linheP}     >
                                  （三）在对方单位报销任何应由本方或本方工作人员个人支付的费用；
                              </p>
                              <p className={styles.linheP}      >
                                  （四）要求对方单位为其亲属（指配偶、父母、子女、兄弟姐妹及配偶的父母、兄弟姐妹，下同）安排工作、住房，要求对方单位为本方工作人员及其亲属装修房屋；
                              </p>
                              <p className={styles.linheP}     >
                                  （五）为对方工作人员及其亲属的工作和业务提供便利、优惠及利益；
                              </p>
                              <p className={styles.linheP}      >
                                  （六）为对方单位及对方工作人员提供本承诺书第二条第（一）至（四）项所约定的内容。
                              </p>
                              <p className={styles.linheP}  >
                                  第三条  不得在业务活动中以不正当的理由设置障碍、态度粗鲁，刁难对方。
                              </p>
                              <p className={styles.linheP}   >
                                  第四条  如承租方发现出租方工作人员在业务活动中有违法、违规、违纪及违反本承诺书规定的行为时，应及时向出租方监督部门举报。
                              </p>
                              <p className={styles.linheP}     >
                                  举报电话：{reportPhone}
                              </p>
                              <p className={styles.linheP}      >
                                  举报邮箱：{reportEmail}
                              </p>
                              <p className={styles.linheP}  >
                                  第五条 承租方违反本承诺书给出租方造成经济损失的，直接追究当事人的赔偿责任。
                              </p>
                              <p className={styles.linheP}   >
                                  第六条 出租方如查实承租方或承租方工作人员违反本承诺书约定的，有权立即解除与其签订的所有合同或协议，该单位负责赔偿因此给出租方造成的经济损失。同时，出租方有权将该单位列入黑名单，以后再次合作将受到限制。
                              </p>
                              <p className={styles.linheP}  >
                                  第七条 本承诺书作为合同附件，与合同具有同等法律效力。
                              </p>
                              <p className={styles.linheP}   >
                                  （以下无正文）
                              </p>
                              <p className={styles.linheP}  >
                                  承租方签署:{customcompany_name}
                              </p>
                              <p className={styles.linheP}   >
                                  签约日期:
                              </p>
                          </p>
                          <p style={{height:'1030px'}}>
                              <p >
                                  <h3  >
                                      附件五：双方证照文件
                                  </h3>
                                  <p >
                                      <h4>
                                          1、承租方证照文件
                                          <div style={{display:'flex'}}>
                                              {b64.length>0 ?b64.map((item:any,index:number)=>  <Space   key={index}>
                                                      <Image src={item} style={{ width: '200px',height:'200px',margin:'5px'}} />
                                                  </Space>

                                              ) : ''}
                                          </div>

                                      </h4>
                                  </p>
                                  <p className={styles.linheP}    >
                                      <h4>
                                          2、出租方证照文件
                                      </h4>
                                      <div style={{display:'flex'}}>
                                          {documentImage.length>0 ?documentImage.map((item:any,index:number)=>  <Space   key={index}>
                                                  <Image src={item} style={{ width: '200px',height:'200px',margin:'5px' }} />
                                              </Space>

                                          ) : ''}
                                      </div>
                                  </p>
                              </p>
                          </p>
                          <p style={{height:'1030px'}}>
                              <p  >
                                  <p>
                                      <h3 >
                                          附件六：关于钱市街小程序使用的告知书
                                      </h3>
                                  </p>
                                  <p className={styles.linheP}  style={{   textAlign: 'center', margin:'20px 0' }}>
                                      <h2>
                                          关于钱市街小程序使用的告知书
                                      </h2>
                                  </p>
                                  <p className={styles.linheP}  >
                                      <h4>
                                          尊敬的商户：
                                      </h4>
                                  </p>
                                  <p className={styles.linheP}     >
                                      您好！
                                  </p>
                                  <p className={styles.linheP}      >
                                      为了提高服务效率，更及时反馈商户的费用信息，我司统一采用《钱市街小程序》电子商务平台进行缴费管理，其中包含了微信提醒服务、账务管理以及欠费项目提示等诸多功能，各商户可以通过平台自助缴纳如水电费、物业服务费、租金等相关费用，节省缴费时间；请商户合理安排缴费时间、金额，避免因拖欠水电费用导致受限。
                                  </p>
                                  <p className={styles.linheP}     >
                                      缴费流程如下：
                                  </p>
                                  <p className={styles.linheP}      >
                                      请使用微信搜索《钱市街小程序》，关注公众号，绑定账户，输入门牌号、姓名、手机号登录平台后选择相应待缴费项目如“水费”“电费”“物业服务费”“租金”等。各商户届时可以自主在公众号根据缴费界面提示要求选择服务项并核对金额后进行缴费操作。谢谢！
                                  </p>
                                  <p className={styles.linheP}     >
                                      { companyName}
                                  </p>
                                  <p className={styles.linheP}      >
                                      日期:
                                  </p>
                              </p>
                              <p style={{ display: 'flex', justifyContent: 'center',margin:'100px 0' }}>
                                  <p   style={{ width: '80%', borderBottom: '1px solid #000' }}>
                                  </p>
                              </p>
                              <p className={styles.linheP}  style={{   textAlign: 'center' }}>
                                  <h3>
                                      关于钱市街小程序使用的告知书——签收联
                                  </h3>
                              </p>
                              <p className={styles.linheP}      >
                                  签收人:{custom_name}
                              </p>
                              <p className={styles.linheP}     >
                                  租赁单元:{unit_name}
                              </p>
                              <p className={styles.linheP}      >
                                  签收日期:
                              </p>
                          </p>

                          <p style={{height:'1010px'}}>
                              <p className={styles.linheP}  >
                                  <h3>
                                      附件七：安全生产责任书
                                  </h3>
                              </p>
                              <p className={styles.linheP}  style={{   textAlign: 'center' }}>
                                  <h2>
                                      安全生产责任书
                                  </h2>
                              </p>
                              <p className={styles.linheP}   >
                                  为了积极贯彻执行国家和本省、本市有关安全生产、消防、治安保卫、劳动保护等法律法规和相关标准，包括但不限于《中华人民共和国安全生产法》《中华人民共和国消防法》《中华人民共和国劳动法》《中华人民共和国反恐怖主义法》《中华人民共和国治安管理处罚法》《中华人民共和国环境保护法》《广东省安全生产条例》、广东省实施《中华人民共和国消防法》办法、《广东省公共安全视频图像信息系统管理办法》《广州市安全生产条例》《广州市安全生产管理规定》《仓库防火安全管理规则》《建筑内部装修设计防火规范》等。安全生产工作实行管行业必须管安全、管业务必须管安全、管生产经营必须管安全，强化和落实生产经营单位主体责任。
                              </p>
                              <p className={styles.linheP}  >
                                  一、现由{custom_name}先生/小姐，（身份证：{customCard}）为《房屋租赁合同书》项下租赁物现场安全负责人，负责租赁期内租赁场地现场的生产经营、消防、治安保卫等安全管理工作。如指派的现场安全负责人有变动，承租方须至少提前7个工作日书面告知出租方。
                              </p>
                              <p className={styles.linheP}  >
                                  二、生产经营单位的主要负责人是本单位安全生产第一责任人，对本单位的安全生产工作全面负责。
                              </p>
                              <p className={styles.linheP}   >
                                  三、承租方向现场安全负责人告知本责任书内容，有责任督促现场安全负责人遵守本协议书内容并积极配合出租方的安全管理工作。
                              </p>
                              <p className={styles.linheP}  >
                                  四、装修施工安全管理
                              </p>
                              <p className={styles.linheP}   >
                                  1．严禁聘请无资质装修工程承包商。
                              </p>
                              <p className={styles.linheP}  >
                                  2．涉及消防工程的施工，应聘请有消防资质的承包商。承租方应提前做好筹划工作，按有关法律法规要求执行，按要求取得《建设工程消防验收意见书》（验收结果须合格）后方可进驻办公。如涉及国家政策变化的，按国家最新要求执行。
                              </p>
                              <p className={styles.linheP}   >
                                  3．负责督促聘请的装修工程承包商遵守国家有关安全生产法律法规和国家标准或者行业标准，以及出租方有关装修管理、电气安全、危险作业等安全管理要求，服从出租方的安全监管。
                              </p>
                              <p className={styles.linheP}  >
                                  4．装修期间落实专人负责装修现场的安全管理工作。
                              </p>
                              <p className={styles.linheP}   >
                                  五、办公现场安全管理
                              </p>
                              <p className={styles.linheP}  >
                                  （一）消防安全管理
                              </p>
                              <p className={styles.linheP}   >
                                  1．落实租赁场地内消防安全“四个能力”建设（检查消除火灾隐患的能力、组织扑救初起火灾的能力、组织人员疏散逃生的能力、消防宣传教育培训的能力）。
                              </p>
                              <p className={styles.linheP}  >
                                  2．对租赁场地内员工（含实习生及使用的被派遣劳动者）进行岗前安全培训和定期再培训，确保所有员工掌握消防“一懂三会”（懂本场所火灾危险性，会报警、会灭火、会逃生）以及掌握本岗位所需的有关安全知识和应急处置措施。
                              </p>
                              <p className={styles.linheP}   >
                                  3．积极参加消防演习、安全培训、安全会议等安全活动。
                              </p>
                              <p className={styles.linheP}  >
                                  4．严禁擅自改变租赁场地内安全疏散通道等装修布局。
                              </p>
                              <p className={styles.linheP}   >
                                  5．严禁堵塞、占用消防安全疏散通道及安全出口，严禁任何影响人员安全疏散的行为。
                              </p>
                              <p className={styles.linheP}  >
                                  6．对配置的消防器材（灭火器、防烟面具、灭火毯）、疏散指示灯、应急照明灯、防火门（如有）、气体灭火系统（如有）等设施应定期进行检查、维保，建立检查、维保记录。
                              </p>

                          </p>
                          <p style={{height:'1010px'}}>
                              <p className={styles.linheP}   >
                                  7．消防器材应摆放在明显易取位置，且完整好用。落实专人每月进行一次检查，做好检查记录。
                              </p>
                              <p className={styles.linheP}  >
                                  8．落实专人负责每季度对应急照明灯、疏散指示灯进行一次检测，并做好检测记录。
                              </p>
                              <p className={styles.linheP}   >
                                  9．落实专人负责办公时间结束后的安全检查。
                              </p>
                              <p className={styles.linheP}  >
                                  10．钱市街大厦广场内严禁吸烟及动用明火（除按规定办理了临时动火许可证外）。
                              </p>
                              <p className={styles.linheP}   >
                                  11．严禁擅自动用、拆装、移位、阻挡租赁区域内及公共区域的消防设施及器材，或将消防设施和器材挪作他用；不得破坏消防标志。
                              </p>
                              <p className={styles.linheP}  >
                                  12．租赁区域内的消防自然排烟窗仅限于紧急情况下由出租方负责打开，承租方严禁私自动用。
                              </p>
                              <p className={styles.linheP}   >
                                  13．严禁“三合一”（生产、住宿、仓储在同一建筑空间内）生产经营活动。
                              </p>
                              <p className={styles.linheP}  >
                                  （二）电气安全管理
                              </p>
                              <p className={styles.linheP}   >
                                  1．严禁私拉乱接电气线路。
                              </p>
                              <p className={styles.linheP}  >
                                  2．严禁使用不合格电器或无牌、无证伪劣电器产品。
                              </p>
                              <p className={styles.linheP}   >
                                  3．不得阻挡配电箱，电箱应完整无损坏，电箱内各路电源应作标识。应急照明及疏散指示系统电源应独立设置。电箱内和正下方以及正下方50厘米内不得堆放物品；电箱前的通道宽度不小于80厘米。
                              </p>
                              <p className={styles.linheP}  >
                                  4．用电检修等特种作业，必须安排由持有有效特种作业操作证的人员进行，安排专人做好现场监管并督促作业人员严格遵守安全操作规范。
                              </p>
                              <p className={styles.linheP}   >
                                  5．严禁停放电动自行车、电动滑板车、独轮平衡车，以及携带电动车电池进入钱市街大厦内充电。
                              </p>
                              <p className={styles.linheP}  >
                                  6．做好电气线路及用电设备的定期安全检查、维护、保养工作。
                              </p>
                              <p className={styles.linheP}   >
                                  （三）安保安全管理
                              </p>
                              <p className={styles.linheP}  >
                                  1．加强门、锁、现金、贵重物品的管理和防盗措施，对贵重物品、钱物的保管要订立行之有效的规章制度和检查措施。
                              </p>
                              <p className={styles.linheP}   >
                                  2．落实预防爆炸、投毒等反恐事件的安全防范和安全教育工作。
                              </p>
                              <p className={styles.linheP}  >
                                  3．严禁从事色情、吸毒、赌博、违反社会公德和封建迷信活动，不得组织、参加非法团体和集会，并不得提供租赁场地作为上述活动的场所。
                              </p>
                              <p className={styles.linheP}   >
                                  4．严禁在租赁场地内贮藏枪支、管制刀具、炸药、雷管、汽油、烟花爆竹、化学腐蚀、毒性溶剂等易燃、易爆和危害公共安全的物品。
                              </p>
                              <p className={styles.linheP}  >
                                  （四）应急管理
                              </p>
                              <p className={styles.linheP}   >
                                  1．发生火情等紧急突发情况，承租方应履行灭火等应急处置义务，并立即通知出租方。
                              </p>
                              <p className={styles.linheP}  >
                                  2．发生火情等紧急突发情况，需进行人员疏散时，承租方负责租赁场地内人员的安全疏散，并负责租赁场地内人员的清理工作，确保无人遗留在租赁场地内，并及时向出租方报告疏散情况。
                              </p>
                              <p className={styles.linheP}   >
                                  六、承租方除上述应尽安全职责外，未尽事宜，按照国家有关法律法规和国家标准及行业标准规定执行。
                              </p>
                              <p className={styles.linheP}  >
                                  七、违约责任
                              </p>
                              <p className={styles.linheP}   >
                                  1．承租方违反应尽义务和约定的，承担责任及相应损失，依法赔偿物业   代管方因此造成的经济损失。
                              </p>

                          </p>
                          <p style={{height:'1030px'}}>
                              <p className={styles.linheP}  >
                                  2．承租方违反应尽义务和约定的，造成安全事故的，造成甲方财产损失、人身伤害或者人员伤亡的，以及其他承租人、顾客造成伤害或损失的，承租方依法承担相应责任。
                              </p>
                              <p className={styles.linheP}   >
                                  3．出租方发现承租方存在安全隐患，承租方不及时排除安全隐患，或拒不纠正的，出租方有权停止物业服务，有权向业主、当地负有安全生产监督管理职能的部门如实反映和上报。情节严重的，出租方可依据租赁合同的违约条款处理，申请终止租赁，因此造成的损失由承租方自行承担。
                              </p>
                              <p className={styles.linheP}  >
                                  4．承租方对公共区域造成安全隐患的，按出租方要求进行整改。
                              </p>
                              <p className={styles.linheP}   >
                                  5．同一个安全隐患被出租方发现2次以上的（含第2次），出租方根据本责任书的约定，有权要求承租方支付违约金人民币1000元/次。违约金须按出租方要求进行缴纳，否则出租方有权在承租方的保证金中扣除，甲方同时有权按七.3条款处理。
                              </p>
                              <p className={styles.linheP}  >
                                  八、其他约定
                              </p>
                              <p className={styles.linheP}   >
                                  （一）根据国家法律法规、国家标准和行业标准变更以及实际安全管理需要，出租方有权对本责任书相应条款进行调整与修订，并重新组织签订。
                              </p>
                              <p className={styles.linheP}  >
                                  （二）发生非出租方责任的火情等突发情况时，出租方采取的应急措施包括但不限于必须损坏租户门及其他物品的应急措施时，出租方不承担承租方受损物品、恢复正常办公以及由此造成的相关费用。
                              </p>
                              <p className={styles.linheP}   >
                                  九、本责任书自签署之日起生效。
                              </p>
                              <p className={styles.linheP}  >
                                  承租方签署：
                              </p>
                              <p className={styles.linheP}   >
                                  现场安全负责人签署：
                              </p>
                              <p className={styles.linheP}  >
                                  联系电话：
                              </p>
                              <p className={styles.linheP}   >
                                  签署日期：
                              </p>
                          </p>
                          <p style={{height:"1030px"}}>
                              <p className={styles.linheP}  style={{   textAlign: 'center' }} >
                                  <h2>
                                      代缴电费确认书
                                  </h2>
                              </p>
                              <p className={styles.linheP}  ></p>
                              {/*填写地址*/}
                              <p className={styles.linheP}      >
                                  根据贵我双方所签订的《房屋租赁合同》约定，我方承租贵方位于{rentAddress}{unit_name}房号的房地产（下称“租赁房地产”）。
                              </p>
                              <p className={styles.linheP}     >
                                  我方确认，租赁期间，贵方将按{elePice}元/度的电费，及{waterPice}元/吨的水费标准向我方收取租赁房地产使用期间所产生的水电费。贵方通过钱市街小程序扣缴的其他费用，包括但不限于水费、物业管理费等，均与电费无关。如我方逾期支付电费的，贵方可参照租赁合同中拖欠租金的相关条款追究我方违约责任。
                              </p>
                              <p className={styles.linheP}  style={{ marginLeft: '70px', fontSize: '24px' }}>
                                  特此确认！
                              </p>
                              <p className={styles.linheP}   >
                                  物业位置：{rentAddress}{unit_name}房号
                              </p>
                              <p className={styles.linheP}  >
                                  确认人：
                              </p>
                              <p className={styles.linheP}   >
                                  日期：
                              </p>
                          </p>
                          <p style={{height:'1030px'}}>
                              <p className={styles.linheP}  style={{   textAlign: 'center'}}>
                                  <h2>
                                      代缴损耗确认书
                                  </h2>
                              </p>
                              <p className={styles.linheP}   >
                                  根据贵我双方所签订的《租赁合同》约定，我方承租贵方位于{rentAddress}{unit_name}房号的房地产（下称“租赁房地产”）
                              </p>
                              <p className={styles.linheP}  >
                                  我方确认，租赁期间，我方每月须按照按每度 {eleloss} 元向贵方缴纳设备损耗、维护费。前述设备损耗、维护费与我方每月应缴纳的物业管理费、水费、电费同时缴纳，如我方逾期支付的，贵方可参照租赁合同中拖欠租金的相关条款追究我方违约责任。
                              </p>
                              <p className={styles.linheP}   >
                                  我方确认，前述设备损耗、维护费为贵方统筹协调租赁房地产综合管理所应收取的对价，在任何情况下我方均不以设备损耗、维护费畸高或不合理为由要求调整。
                              </p>
                              <p className={styles.linheP}  style={{ marginLeft: '70px', fontSize: '24px' }}>
                                  特此确认！
                              </p>
                              <p className={styles.linheP}   >
                                  物业位置：{rentAddress}{unit_name}房号
                              </p>
                              <p className={styles.linheP}  >
                                  确认人：
                              </p>
                              <p className={styles.linheP}  >
                                  日期：
                              </p>
                          </p>
                    </p>
                </p>
            </Modal>
        </p>
    )
}
export default connect()(Contractez)




// <script>
//     import jsPDF from "jspdf";
//     import html2canvas from "html2canvas";
//
//     const exportToPDF = async () => {
//       // 获取需要导出的 HTML 元素
//       const element = document.getElementById("pdf-content");
//
//       // 使用 html2canvas 将 HTML 转为图片
//       const canvas = await html2canvas(element, { scale: 2,useCORS: true });
//
//       const imgData = canvas.toDataURL("image/png");
//
//       // 创建 jsPDF 实例
//       const pdf = new jsPDF("p", "mm", "a4");
//
//       // 计算内容宽高比例，确保适配 A4 页面
//       const pdfWidth = pdf.internal.pageSize.getWidth();
//       const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
//
//       // 添加图片到 PDF
//       pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
//
//       // 下载 PDF
//       pdf.save("document.pdf");
//     };
//   </script>
//
//   <style>
//     /* 预览的样式示例 */
//     #pdf-content {
//       width: 210mm; /* A4 纸宽度 */
//       padding: 20px;
//       background: white;
//       border: 1px solid #ddd;
//     }
//   </style>
//
//   <!-- HTML 结构 -->
//     <p className={styles.linheP}  style="color:black;">
//       <p className={styles.linheP}  id="pdf-content">
//       <h1>Svelte HTML 转 PDF 示例</h1>
//         <p className={styles.linheP} >这是一个简单的 HTML 示例内容，点击按钮后将导出为 PDF。</p>
//       <img src="https://picsum.photos/800/400" alt="示例图片" crossorigin="anonymous" />
//     </p>
//     <button on:click={exportToPDF}>下载 PDF</button>
//   </p>
