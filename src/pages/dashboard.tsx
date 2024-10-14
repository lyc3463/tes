import {
    Button,
    Descriptions,
    message,
  } from 'antd';
  import { useEffect, useState } from 'react';
  
  export default function TongjiIndex() {
    const [tjdata, setTjdata] = useState([]);
    useEffect(() => {
        didmount();
    }, []);
    const didmount = () => {

    }
    return (
        <div>
            仪表盘
        </div>
    );
  }
  