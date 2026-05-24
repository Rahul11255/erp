import {
  Layout,
  Menu,
} from "antd";

import {
  DashboardOutlined,
  FileTextOutlined,
  PlusSquareOutlined,
} from "@ant-design/icons";

import {
  useNavigate,
  useLocation,
} from "react-router-dom";

const { Sider } = Layout;

export default function SidebarMenu() {

  const navigate = useNavigate();

  const location = useLocation();

  const user = JSON.parse(
    localStorage.getItem("userInfo")
  );

  const items = [

    {
      key: "/",
      icon: <DashboardOutlined />,
      label: "Dashboard",
    },

    ...(user?.role === "EMPLOYEE"
      ? [
          {
            key: "/create-request",
            icon: <PlusSquareOutlined />,
            label: "Create Purchase Req",
          },
        ]
      : []),

    ...(user?.role === "MANAGER"
      ? [
          {
            key: "/all-requests",
            icon: <FileTextOutlined />,
            label: "All Purchase Requests",
          },
        ]
      : []),

        {
            key: "/audit-logs",
            icon: <FileTextOutlined />,
            label: "Audit Logs",
        },

  ];

  return (

    <Sider
      width={260}
      breakpoint="lg"
      collapsedWidth="0"
      style={{
        background: "#0F3D2E",
        minHeight: "100vh",
        position: "sticky",
        top: 0,
        left: 0,
      }}
    >

      <div className="px-6 py-7 border-b border-[#1D5C46]">

        <div className="flex items-center gap-3">

          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center bg-primary text-white font-bold text-lg"
            
          >
            K95
          </div>

          <div>

            <h2 className="text-white text-lg font-semibold leading-none m-0">
              K95 Foods
            </h2>

            <p className="text-[#A7D7C5] text-xs mt-1 mb-0">
              Purchase ERP
            </p>

          </div>

        </div>

      </div>

      <div className="px-3 py-5">

        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={items}
          onClick={({ key }) => navigate(key)}
          style={{
            background: "transparent",
            border: "none",
            color: "#fff",
          }}
          theme="dark"
        />

      </div>

      <div className="absolute bottom-5 left-0 w-full px-5">

        <div
          className="rounded-2xl p-4"
          style={{
            background: "#1D5C46",
          }}
        >

          <p className="text-[#D8F3E8] text-xs mb-1">
            K95 Foods ERP
          </p>

          <h4 className="text-white text-sm font-semibold mb-2">
            Purchase Management
          </h4>

          <p className="text-[#A7D7C5] text-xs leading-relaxed mb-0">
            Streamline purchase requests, approvals and tracking with a modern workflow.
          </p>

        </div>

      </div>

    </Sider>
  );
}