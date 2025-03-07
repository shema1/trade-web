import { Outlet, useNavigate } from 'react-router-dom';
import { HomeOutlined, LineChartOutlined } from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';
import React from 'react';

const { Header, Content, Footer, Sider } = Layout;

function App() {
  const navigate = useNavigate();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Оновлені пункти меню відповідно до наявних роутів
  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: 'Головна',
      onClick: () => navigate('/'),
    },
    {
      key: '/info',
      icon: <LineChartOutlined />,
      label: 'Аналіз',
      onClick: () => navigate('/info'),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
      >
        <div className="demo-logo-vertical" />
        <Menu 
          theme="dark" 
          mode="inline" 
          defaultSelectedKeys={['/']} 
          items={menuItems} 
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: '24px 16px 0' }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  )
}

export default App;
