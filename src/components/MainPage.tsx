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
    message, Table, Tag, Popconfirm, Select,
} from 'antd';
import { Link, history as UmiHistory } from 'umi';
import BreadcrumbMap from '@/constants/BreadcrumbMap';
import NotificationList from '@/components/NotificationList';
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
import {
    AlertFilled,
    CloseOutlined,
    LeftOutlined,
    QuestionCircleOutlined,
    RedoOutlined,
    RightOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";
import {deleteSessionStorageRoute} from "@/utils/OpenTool";
const { Header, Content, Footer, Sider } = Layout;
type MenuItem = Required<MenuProps>['items'][number];
import * as RechargeService from '@/services/recharge';
import TypeErrorCode from "@/ModelTypes/TypeErrorCode";

class MainPage extends Component<any> {
  constructor(props: any) {
    super(props);
    this.containerRef = React.createRef();
    this.scrollStep = 150;
  }
  componentDidUpdate(prevProps, prevState) {
    // 当菜单项变化时，滚动到当前活动项
    if (this.containerRef.current) {
      const activeItem = this.containerRef.current.querySelector('.active-item');
      if (activeItem) {
        activeItem.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
  };
  removeMenuItem = (itemId) => {
      deleteSessionStorageRoute(itemId.route);
      this.setState(prevState => ({
          sessionStorageMune: prevState.sessionStorageMune.filter(item => item.id !== itemId.id)
      }));
  };
  scrollToLeft = () => {
    if (this.containerRef.current) {
      this.containerRef.current.scrollLeft -= this.scrollStep;
    }
  };

  scrollToRight = () => {
    if (this.containerRef.current) {
      this.containerRef.current.scrollLeft += this.scrollStep;
    }
  };
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
      open:false,
      smsNumber:0,
      popOpen:false,
      parkOpen:false,
      uqx:[],
      park_id:StaticInfo.park_id,
      sessionStorageMune:[{ id: 0, name: '仪表盘', route: '/dashboard/', authId: 0 }]
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
      let uq=StaticInfo.uqx.split('');
      this.setState({uqx:uq});
      if (uq[297]=='1'){
          this.getSMSNumber();
      }
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
      let sessMumeList=JSON.parse(sessionStorage.getItem('sessMumeList'));
      // 如果缓存不存在，初始化空对象
      if (!sessMumeList) {
          sessMumeList = {};
      }
        // 检查当前路由名称是否已存在于缓存中
      if (!sessMumeList.hasOwnProperty(e.key)) {
          // 如果不存在，则初始化为空对象
          sessMumeList[e.key] = {};
          // 保存回 sessionStorage
          sessionStorage.setItem('sessMumeList', JSON.stringify(sessMumeList));
      }
      let itemKey = e.key.split();
      for (const route of itemKey) {
          const matchedItem = menuData.find(item => item.route === route);
          if (matchedItem) {
              // 检查当前matchedItem的id是否已存在于sessionStorageMune中
              const isExists = this.state.sessionStorageMune.some(item => item.id === matchedItem.id);
              if (!isExists) {
                  this.setState(prevState => ({
                      sessionStorageMune: [...prevState.sessionStorageMune, matchedItem]
                  }));
              }
              return;
          }
      }
  };
    tuichu() {
        LoginService.outLogin().then((res:any)=>{
            if (res.ErrorCode==0){
                message.success('退出成功');
                sessionStorage.clear();
                localStorage.clear();
                location.pathname = '/login';
            }else {
                sessionStorage.clear();
                localStorage.clear();
                location.pathname = '/login';
            }
        })
    }
    test1870=()=>{
        LoginService.test1870().then((res:any)=>{
            if (res.ErrorCode==0){
                message.success('测试成功');
            }else {
                message.error(res.Data);
            }
        })
    }
  // editPawword=()=>{
  //   UmiHistory.push('/EditPassword')
  // };
  getList=()=>{
    CommonService.get1166(1,'','',0).then((res:any)=>{
      if (res.ErrorCode==0){
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
    toHisYou=(e)=>{
        UmiHistory.push(`${e.route}`);
    };
    toOpen=()=>{
        UmiHistory.push('/systemManage/renewPark');
    };
    getSMSNumber=()=>{
      RechargeService.one().then((res:any)=>{
        if (res.ErrorCode==0){
          this.setState({smsNumber:res.Data.SmsNumber});
          if (res.Data.SmsNumber<=300){
            this.setState({popOpen:true});
          }
        }else {
          message.error(res.Data);
        }
      })
    };
    // 查询园区有效期
    getValidityPeriod=()=>{

    };
    changePark=(e:any,parkList:any)=>{
        CommonService.swPark(e).then((res:TypeErrorCode)=>{
            if (res.ErrorCode==0){
                StaticInfo.park_id=e;
                StaticInfo.park_name=parkList.children;
                StaticInfo.uqx=res.Data;
                this.setState({park_id:e});
                sessionStorage.setItem('park_id',e);
                sessionStorage.setItem('park_id',e);
                sessionStorage.setItem('park_name',parkList.children);
                sessionStorage.setItem('uqx',res.Data);
                UmiHistory.push('/');
            }else {
                message.error(res.Data);
            }
        })

    };
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
              items={this.state.menus}/>
          </Sider>
          <Layout style={{ marginLeft: 200 }}>
            <div style={{ position: 'relative', marginTop: '10px', width: '100%', height: '50px' }}>
              {/* 隐藏默认滚动条 */}
              <div
                  ref={this.containerRef}
                  style={{
                    display: 'flex',
                    overflowX: 'hidden', // 隐藏默认滚动条
                    scrollBehavior: 'smooth', // 平滑滚动
                    whiteSpace: 'nowrap',
                    padding: '0 40px', // 为按钮留出空间
                    height: '50px',
                    alignItems:'center'
                  }}
              >
                {this.state.sessionStorageMune.map((item: any) => {
                  const isActive = window.location.pathname === item.route;
                  return (
                      <div
                          key={item.id}
                          className={isActive ? 'active-item' : ''}
                          style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              width: "150px",
                              height: '38px',
                              border: `1px solid ${isActive ? '#1890ff' : '#999'}`,
                              borderRadius: '10px',
                              backgroundColor: isActive ? '#e6f7ff' : 'transparent',
                              marginRight: '8px',
                              padding: '0 8px',
                              flexShrink: 0 // 防止宽度被压缩
                          }}
                      >
                        <div
                            style={{
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              color: isActive ? '#1890ff' : '#8a8b8c',
                              flex: 1,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                            onClick={() => this.toHisYou(item)}
                        >
                          {item.name}
                        </div>
                        <span
                            style={{
                              width: '10px',
                              height: '10px',
                              fontSize: '10px',
                              cursor: 'pointer',
                              color: isActive ? '#1890ff' : '#999'
                            }}
                            onClick={() => this.removeMenuItem(item)}
                        >
                  <CloseOutlined />
                </span>
                      </div>
                  );
                })}
              </div>

              {/* 自定义滚动按钮 */}
              <button
                  onClick={this.scrollToLeft}
                  style={{
                    position: 'absolute',
                    left: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(255, 255, 255, 0.7)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '30px',
                    height: '30px',
                    cursor: 'pointer',
                    zIndex: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)'
                  }}
              >
                <LeftOutlined />
              </button>
              <button
                  onClick={this.scrollToRight}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(255, 255, 255, 0.7)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '30px',
                    height: '30px',
                    cursor: 'pointer',
                    zIndex: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)'
                  }}
              >
                <RightOutlined />
              </button>
            </div>
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
                  {/*<Button type="link" onClick={()=>this.setState({open:true})}>*/}
                  {/*  {this.state.list.length}*/}
                  {/*  <AlertFilled />*/}
                  {/*</Button>*/}
                    <span>
                        园区有效期:{`${dayjs(StaticInfo.beginTime).format('YYYY-MM-DD')}至${dayjs(StaticInfo.endTime).format('YYYY-MM-DD')}`}
                        <Button style={{border:'none',padding:'0',margin:'0'}} onClick={this.toOpen}><QuestionCircleOutlined/></Button>
                    </span>
                    <Popconfirm
                        title="园区即将到期"
                        description="该园区即将到期请及时续费"
                        placement="bottom"
                        open={this.state.parkOpen}
                        onPopupClick={() => {this.setState({parkOpen:false})}}
                        okText="知道了"
                    />
                    <span>
                        用户姓名:{StaticInfo.username}
                    </span>
                    <span>
                       当前园区:<Select placeholder="请选择园区" style={{ width: 200 }} value={this.state.park_id} onChange={(e,parkList)=>this.changePark(e,parkList)}>
                            {Array.isArray(StaticInfo.parkList) && StaticInfo.parkList.map(park => (
                                <Select.Option
                                    key={park.parkId}
                                    value={park.parkId}
                                >
                                    {park.park_name}
                                </Select.Option>
                            ))}
                        </Select>
                    </span>
                    {this.state.uqx[297]=='1'?<>
                        <span>短信条数:{this.state.smsNumber}条<Button style={{border:'none',padding:'0',margin:'0'}} onClick={this.getSMSNumber}><RedoOutlined/></Button>
                        </span>
                    </>:null}
                    <Popconfirm
                        title="短信条数不足提醒"
                        description="您的短信剩余数量已不足300条，建议及时到短信管理模块充值。"
                        placement="bottom"
                        open={this.state.popOpen}
                        onPopupClick={() => {this.setState({popOpen:false})}}
                        okText="知道了"
                    />
                    <NotificationList/>
                    <Button type="link" onClick={this.tuichu}>退出</Button>
                    {/*<Button type="link" onClick={this.test1870}>测试</Button>*/}
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
