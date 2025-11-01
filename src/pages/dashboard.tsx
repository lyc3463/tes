import {Button, Descriptions, message} from 'antd';
import { useEffect, useState } from 'react';
import * as AccountService from '@/services/account';
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";

export default function TongjiIndex() {
    const [tjdata, setTjdata] = useState([]);
    useEffect(() => {
        didmount();
    }, []);
    const didmount = () => {

    };
    const onOK=()=>{
        AccountService.testOnOK().then((res:TypeErrorCode)=>{
            console.log(res)
        })
    };
    return (
        <div>
            仪表盘
            {/*<Button onClick={onOK}>按钮</Button>*/}
        </div>
    );
  }
  