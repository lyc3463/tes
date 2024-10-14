import { Link, Navigate, Outlet, useLocation } from 'umi';
import './index.less';
import { StaticInfo } from '@/StaticInfo';
import { fixPathname } from '@/utils/common';
import MainPage from '@/components/MainPage';
import { useSelectedRoutes } from '@/.umi/exports';

export default function Layout() {
  const umilocation = useLocation();
  const pathname = fixPathname(umilocation.pathname);
  const mrs = useSelectedRoutes();
  let is404 = mrs.some((o: any) => o.route.id == '404')
  if (is404 && pathname!='/404.html') {
    return <Navigate to={`/404.html`} replace />
  }
  if (StaticInfo.userId == 0 && pathname != '/login/') {
    // history.replace('/login');
    return <Navigate to={`/login/`} replace />
  }
  if (pathname == '/') {
    // history.replace('/login');
    return <Navigate to={`/dashboard/`} replace />
  }
  let children = null;
  if (pathname == '/login/') {
    children = <Outlet />;
  } else {
    children = <MainPage>
      <Outlet />
    </MainPage>;
  }
  return children;
}
