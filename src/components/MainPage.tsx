import React, { Component, ReactNode } from 'react';
import _ from 'lodash';
import '@/layouts/index.less';
import {
  Layout,
  Menu,
  Avatar,
  Button,
  ConfigProvider,
  Breadcrumb,
  List,
  Space,
  Spin,
  Modal,
  message, Table, Tag,
} from 'antd';
import { Link, history as UmiHistory } from 'umi';
import BreadcrumbMap from '@/constants/BreadcrumbMap';
import ComponentErrorBoundary from '@/components/ErrorBoundary';
import zhCN from 'antd/lib/locale/zh_CN';
import { EventMgr } from '@/Event/EventMgr';
import { info_event } from '@/Event/EventEnum';
import { fixPathname } from '@/utils/common';
import { StaticInfo } from '@/StaticInfo';
import * as CommonService from '@/services/common';
import { menuData } from '@/constants/menu/main';
import TypeMenu from '@/ModelTypes/TypeMenu';
import * as LoginService from '@/services/login';
import type { MenuProps } from 'antd';
import 'dayjs/locale/zh-cn';
import {AlertFilled} from "@ant-design/icons";
import dayjs from "dayjs";
const { Header, Content, Footer, Sider } = Layout;
type MenuItem = Required<MenuProps>['items'][number];

class MainPage extends Component<any> {
  constructor(props: any) {
    super(props);
  }
  state = {
    breadcrumbData: [],
    menuData: [],
    openKeys: [],
    isDashboard: false,
    modalShow: false,
    planList: [],
    currentPlan: '',
    collapsed: false,
    menus: new Array<any>(),
    loading: false,
    list:[],
    open:false
  };
  errorBoundary: React.RefObject<ComponentErrorBoundary> = React.createRef();
  
  componentDidMount(): void {
    if (this.errorBoundary.current) {
      this.errorBoundary.current.state.hasError = false;
    }
    EventMgr.on(info_event.showWait, this, this.shhowWait);
    EventMgr.on(info_event.hideWait, this, this.hideWait);
    
    const buildTree=(menuItems: TypeMenu[], parentId: number | undefined = undefined): MenuItem[] => {
      return menuItems
        .filter(item => item.parentId === parentId)
        .map(item => {
          const children = buildTree(menuItems, item.id);
          const treeNode: MenuItem = {
            key: item.route || '',
            label: item.name,
            children: children.length > 0 ? children : undefined,
            disabled: authArr[item.authId] === 0
          };
          return treeNode;
        });
    }
    let qxList=StaticInfo.uqx;
    let authArr =qxList.split('').map(Number)

    let md: TypeMenu[] = [];
    for (let i = 0; i < menuData.length; i++) {
      let m = menuData[i];
      if (authArr[m.authId] == 0) {
        if (m.parentId != undefined) {
          md.push(m)
        }
      } else {
        md.push(m)
      }
    }
    this.setState({
      menus: buildTree(md),
    });
    // this.getList();
  }
  componentWillUnmount(): void {
    EventMgr.off(info_event.showWait, this, this.shhowWait);
    EventMgr.off(info_event.hideWait, this, this.hideWait);
  }
  shhowWait() {
    this.setState({
      loading: true,
    });
  }
  hideWait() {
    this.setState({
      loading: false,
    });
  }
  exit(e: any) {
    e.preventDefault();
    localStorage.clear();
    window.location.pathname = '../login';
  }
  shouqicaidan() { }
  dianjicaidan = (e:any) => {
    UmiHistory.push(e.key);
  };
  tuichu() {
    LoginService.outLogin(StaticInfo.userId).then((res:any)=>{
      if (res.ErrorCode==0){
        message.success('退出成功');
        sessionStorage.clear();
        location.pathname = '/login';
      }else {
        sessionStorage.clear();
        location.pathname = '/login';
      }
    })
  };
  // editPawword=()=>{
  //   UmiHistory.push('/EditPassword')
  // };
  getList=()=>{
    CommonService.get1166(1,'','',0).then((res:any)=>{
      if (res.ErrorCode==0){
        console.log("res",res);
        this.setState({list:res.Data});
      }
    })
  };
  columns=[
    {
      title: '日期',
      dataIndex: 'estarttime',
      key: 'estarttime',
      render:(text:any,record:any)=>{
        return(
            <div>
              {dayjs(record.estarttime).format('YYYY-MM-DD')}
            </div>
        )
      }
    }
  ];
  render() {
    // const ContentPage = loadable(() => import(`@/pages${this.props.contentPage}`));

    return (
      <ConfigProvider locale={zhCN}>
        <Layout style={{ minHeight: '100vh' }}>
          <Sider
            style={{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0, top: 0, bottom: 0 }}
          >
            <div
              style={{
                color: '#ffffff',
                height: '32px',
                margin: '16px',
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              物业管理后台
            </div>
            <Menu theme="dark" mode="inline"
              defaultSelectedKeys={[UmiHistory.location.pathname]}
              onClick={this.dianjicaidan.bind(this)}
              items={this.state.menus} />
          </Sider>
          <Layout style={{ marginLeft: 200 }}>
            <Header style={{ padding: '0px 40px', background: '#ffffff' }} >
              <div style={{ display: 'flex' }}>
                <Space style={{ marginRight: 'auto' }}>
                  <div>当前位置:</div>
                  <Breadcrumb
                    style={{ margin: '16px 0' }}
                    items={fixPathname(location.pathname)
                      .split('/')
                      .slice(1).slice(0, -1)
                      .map((o: any) => ({ title: BreadcrumbMap[o] }))}
                  />
                </Space>
                <Modal open={this.state.open} onOk={()=>this.setState({open:false})} onCancel={()=>this.setState({open:false})} title='消息'>
                  {
                    this.state.list.length>0&&this.state.list?this.state.list.map((item:any)=>{
                      return(
                          <Table columns={this.columns}/>
                      )
                    }):'暂无消息'
                  }
                </Modal>
                <Space size="large">
                  <Button type="link" onClick={()=>this.setState({open:true})}>
                    {this.state.list.length}
                    <AlertFilled />
                  </Button>
                  <span>
                    用户姓名:{StaticInfo.username}
                  </span>
                  <span>
                    园区:{StaticInfo.park_name}
                  </span>
                  <Button type="link" onClick={this.tuichu}>
                    退出
                  </Button>
                </Space>
              </div>
            </Header>

            <Content style={{ margin: '24px 16px' }}>
              <div
                style={{
                  padding: 24,
                  height: '100%',
                  background: '#ffffff',
                  borderRadius: '8px',
                }}
              >
                <Spin spinning={this.state.loading}>{this.props.children}</Spin>
              </div>
            </Content>
            {/* <Footer style={{ textAlign: 'center' }}>
              JetGame©{new Date().getFullYear()}
            </Footer> */}
          </Layout>
        </Layout>
      </ConfigProvider>
    );
  }
}

export default MainPage;
