import JSEncrypt from 'jsencrypt';
import CryptoUtils from './utils/Crypto';


const PUB_KEY1 = `MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC0bRMhYntvXcc3hI50Fthvf+52`;
const PUB_KEY2 = `GeqZMrdT/tR+0EV8u9oxENZrJj4nPkAFwMemO2V2j8nRP5lgCwlXI9/PXaIZMSNK`;
const PUB_KEY3 = `MR1qwRWORNsL7zGp6KA/rfBHQU7Qv7EEQ+//E9GFvKphoJ96Fpqmh+ASctxZBMfghB7jgkJHNkyQ2kqudwIDAQAB`;

/**全局的数据 */
class StaticInfoClass {

  //用户数据
  public deviceId: string = '';
  public userState: boolean = false;
  public userId: number = 0;
  public username: string = '';
  public token: string = '';
  public park_id: number = 0;
  public uqx: string = '';
  public park_name: string = '';
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
