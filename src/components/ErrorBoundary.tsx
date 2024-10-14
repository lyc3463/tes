import React, { Component, ReactNode } from 'react';
import { Result, Button } from 'antd';
import { Link } from 'umi';

interface IProps {
    children: ReactNode;
  }

class ErrorBoundary extends Component<IProps> {
    constructor(props: any) {
        super(props);
    }
    state = {
        hasError: false
    };
    componentDidCatch(error: any, info: any) {
        this.setState({
            hasError: true
        })
    }
    render() {
        if (this.state.hasError) {
            return <Result
                status="404"
                title="404"
                subTitle="Sorry, the page you visited does not exist."
                extra={<Button type="primary"><Link to='../'>回到首页</Link></Button>}
            />
        }
        return this.props.children;
    }
}
export default ErrorBoundary;