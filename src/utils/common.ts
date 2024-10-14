import { message } from 'antd';


export function fixPathname(s: any) {
  if (s.endsWith('/')) {
    return s;
  } else {
    if (s.endsWith('.html')) {
      return s
    } else {
      return s + '/';
    }
  }
}

export function stringToHex(str: string) {
  let re = /[\u4E00-\u9FA5]/
  let ar = []
  for (let i = 0; i < str.length; i++) {
    let a = ''
    if (re.test(str.charAt(i))) { // 中文
      a = encodeURI(str.charAt(i)).replace(/%/g, '')
    } else {
      a = str.charCodeAt(i).toString(16)
    }
    ar.push(a)
  }
  str = ar.join('')
  return str
}

export function sleep(time: number) {
  return new Promise(resolve => setTimeout(resolve, time));
}

export function getAvatarUrl(s: any) {
  if (s != '' && isFinite(s)) {
    let xx = `/staticfiles/headimgs/head${s.toString()}.png`;
    return xx;
  } else {
    return s;
  }
}

export function getBeforeDate(bf: number) {
  const num = bf;
  const date = new Date();
  let year = date.getFullYear();
  let mon = date.getMonth() + 1;
  let day = date.getDate();
  if (day <= num) {
    if (mon > 1) {
      mon = mon - 1;
    } else {
      year = year - 1;
      mon = 12;
    }
  }
  date.setDate(date.getDate() - num);
  year = date.getFullYear();
  mon = date.getMonth() + 1;
  day = date.getDate();
  const s = mon + '-' + day;
  return s;
}
