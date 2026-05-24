import { Layout } from "antd";
import SidebarMenu from "../components/SidebarMenu";
import HeaderBar from "../components/HeaderBar";
import { Outlet } from "react-router-dom";

const { Content } = Layout;

export default function AppLayout() {

  return (

    <Layout style={{ minHeight: "100vh" }}>
      <SidebarMenu />
      <Layout>
        <HeaderBar />
        <Content
          style={{
            margin: "20px",
          }}
        >

          <div
            style={{
              background: "#fff",
              minHeight: "calc(100vh - 110px)",
              borderRadius: 16,
              padding: 20,
            }}
          >

            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}