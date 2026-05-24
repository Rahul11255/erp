import {
  Layout,
  Avatar,
  Space,
  Typography,
  Tag,
} from "antd";

import {
  UserOutlined,
} from "@ant-design/icons";

import {
  useEffect,
  useState,
} from "react";

import axiosInstance from "../utils/axios";

const { Header } = Layout;
const { Text } = Typography;

export default function HeaderBar() {

  const [userInfo, setUserInfo] = useState(
    JSON.parse(localStorage.getItem("userInfo"))
  );

  useEffect(() => {
    fetchMe();
  }, []);

  const fetchMe = async () => {

    try {

      const res = await axiosInstance.get("/users/me");

      if (res.status) {

        setUserInfo(res.data);

        localStorage.setItem(
          "userInfo",
          JSON.stringify(res.data)
        );
      }

    } catch (err) {
      console.error("Failed to fetch user:", err);
    }
  };

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");

    window.location.href = "/login";
  };

  return (

    <Header
      className="px-4 md:px-6 flex items-center justify-between"
      style={{
        background: "#fff",
        height: 70,
        lineHeight: "normal",
      }}
    >

      <div>
        <h2 className="text-lg md:text-xl font-semibold text-gray-800 m-0">
          K95 Foods
        </h2>
      </div>

      <div className="flex items-center gap-3">

        <Space size={12}>

          <Avatar
            size={42}
            src={userInfo?.avatar}
            icon={<UserOutlined />}
          />

          <div className="hidden sm:flex flex-col leading-tight">

            <Text strong className="text-gray-800">
              {userInfo?.name}
            </Text>

            <Text
              type="secondary"
              className="text-xs"
            >
              {userInfo?.email}
            </Text>

          </div>

          <Tag
            color={
              userInfo?.role === "MANAGER"
                ? "purple"
                : "blue"
            }
            className="hidden md:block"
          >
            {userInfo?.role}
          </Tag>

        </Space>

        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 transition"
        >
          Logout
        </button>

      </div>

    </Header>
  );
}