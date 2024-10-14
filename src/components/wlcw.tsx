import { Button, Result } from 'antd';

export default () => {
  return (
    <Result
      status="warning"
      title="无法连接服务器，请检查网络."
      extra={
        <Button type="primary" onClick={()=>{location.reload()}}>
          刷新
        </Button>
      }
    />
  );
}
