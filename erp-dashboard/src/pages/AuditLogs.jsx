import { useEffect, useState } from "react";
import { Card, message, Table, Tag, Typography, Avatar } from "antd";
import dayjs from "dayjs";
import axiosInstance from "../utils/axios";

const { Text } = Typography;

export default function AuditLogs() {

  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/audit-logs/list");
      if (res.status) {
        setData(res.data);
      }
    } catch (err) {
      message.error(err.message || "Failed to fetch audit logs");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "S.No",
      key: "serial",
      render: (_, __, index) => index + 1,
    },

    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (action) => {
        const map = {
          submitted: "blue",
          approved:  "green",
          rejected:  "red",
        };
        return (
          <Tag color={map[action] || "default"}>
            {action?.toUpperCase()}
          </Tag>
        );
      },
    },

    {
      title: "Status Change",
      key: "status_change",
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <Tag color="default">
            {record.from_status || "—"}
          </Tag>
          <Text type="secondary">→</Text>
          <Tag color={
            record.to_status === "APPROVED" ? "green" :
            record.to_status === "REJECTED" ? "red"   :
            record.to_status === "SUBMITTED" ? "blue" : "default"
          }>
            {record.to_status || "—"}
          </Tag>
        </div>
      ),
    },


    {
      title: "Performed By",
      key: "performed_by",
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <Avatar
            src={record.performed_by?.avatar}
            size={32}
            style={{ background: "#1D9E75", flexShrink: 0 }}
          >
            {record.performed_by?.name?.[0]}
          </Avatar>
          <div>
            <Text strong style={{ fontSize: 13 }}>
              {record.performed_by?.name || "—"}
            </Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.performed_by?.email || "—"}
            </Text>
          </div>
        </div>
      ),
    },

    {
      title: "Role",
      key: "role",
      render: (_, record) => (
        <Tag color={
          record.performed_by?.role === "MANAGER" ? "purple" : "blue"
        }>
          {record.performed_by?.role || "—"}
        </Tag>
      ),
    },

    {
      title: "Date & Time",
      dataIndex: "created_at",
      key: "created_at",
      render: (date) => (
        <div>
          <Text style={{ fontSize: 13 }}>
            {dayjs(date).format("DD MMM YYYY")}
          </Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            {dayjs(date).format("hh:mm A")}
          </Text>
        </div>
      ),
    },

  ];

  return (
    <div>
      <Card
        bordered={false}
        style={{ borderRadius: 16 }}
      >

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Audit Logs
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Track all status changes and actions on purchase requests
          </p>
        </div>

        {/* Table */}
        <Table
          rowKey="id"
          columns={columns}
          dataSource={data}
          loading={loading}
          pagination={{ pageSize: 10 }}
        />

      </Card>
    </div>
  );
}