import React from 'react';
import styles from '@/less/ld.less';
import { Spin } from 'antd';

// loading components from code split
// https://umijs.org/plugin/umi-plugin-react/#dynamicimport
export default () => (
  <div className={styles.overlayContent}>
    <Spin />
  </div>
);
