import JSEncrypt from 'jsencrypt';
import CryptoUtils from './utils/Crypto';


const PUB_KEY1 = `MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC0bRMhYntvXcc3hI50Fthvf+52`;
const PUB_KEY2 = `GeqZMrdT/tR+0EV8u9oxENZrJj4nPkAFwMemO2V2j8nRP5lgCwlXI9/PXaIZMSNK`;
const PUB_KEY3 = `MR1qwRWORNsL7zGp6KA/rfBHQU7Qv7EEQ+//E9GFvKphoJ96Fpqmh+ASctxZBMfghB7jgkJHNkyQ2kqudwIDAQAB`;

/**全局的数据 */
class StaticInfoClass {

  //用户数据
  public deviceId: string = localStorage.getItem('fp')?localStorage.getItem('fp'):'';
  public userState: boolean = sessionStorage.getItem('userState')==='true'?true:false;
  public userId: number = parseInt(sessionStorage.getItem('userId'))>0?parseInt(sessionStorage.getItem('userId')):0;
  public username: string = sessionStorage.getItem('username');
  public token: string = sessionStorage.getItem('token');
  public park_id: number = parseInt(sessionStorage.getItem('park_id'))>0?parseInt(sessionStorage.getItem('park_id')):0;
  public uqx: string = sessionStorage.getItem('uqx');
  public park_name: string =sessionStorage.getItem('park_name');
  public beginTime: string =sessionStorage.getItem('loginbeginTime')||'2025-01-01';
  public endTime: string =sessionStorage.getItem('loginendTime')||'2025-12-01';
  public meal_id: number =Number(sessionStorage.getItem('loginmeal_id'))||0;
  public isTask: string =sessionStorage.getItem('isTask')||'';
  //根据情况添加
  //用户数据结束


  //系统数据
  public pTypenames: string[] = [
    '微信',
    '支付宝',
    '银行卡'
  ];
  //根据情况添加
  //系统数据结束
  public csx: number = 0;
  private PUB_KEY = PUB_KEY1 + PUB_KEY2 + PUB_KEY3;
  private pkey ='#$%#ADV344800%3a';
  public rsaEncrypt(msg:string){
    const encrypt = new JSEncrypt();
    encrypt.setPublicKey(StaticInfo.PUB_KEY);
    let md5str = CryptoUtils.md5(msg+this.pkey);
    const encrypted = encrypt.encrypt(md5str);
    return encrypted || '';
  }
}
export const StaticInfo = new StaticInfoClass();
