import { useEffect, useState } from "react";

import {
  Button,
  Card,
  Input,
  message,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  DatePicker
} from "antd";

import dayjs from "dayjs";

import axiosInstance from "../utils/axios";

const { TextArea } = Input;
const { Text } = Typography;
const { RangePicker } = DatePicker;

export default function ManagePurchaseRequests() {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [status, setStatus] = useState("");
  const [remarks, setRemarks] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: undefined,
    department: undefined,
    priority: undefined,
    dateRange: [],
  });

  useEffect(() => {
    fetchPurchaseRequests();
  }, []);

  const fetchPurchaseRequests = async (customFilters = filters) => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      if (customFilters.status) {
        params.append("status", customFilters.status);
      }

      if (customFilters.department) {
        params.append("department", customFilters.department);
      }

      if (customFilters.priority) {
        params.append("priority", customFilters.priority);
      }

      if (customFilters.dateRange?.length === 2) {
        params.append(
          "date_from",
          customFilters.dateRange[0].format("YYYY-MM-DD")
        );
        params.append(
          "date_to",
          customFilters.dateRange[1].format("YYYY-MM-DD")
        );
      }

      const res = await axiosInstance.get(
        `/purchase/list?${params.toString()}`
      );

      if (res.status) {
        setData(res.data);
      }
    } catch (err) {
      message.error(err.message || "Failed to fetch requests");
    } finally {
      setLoading(false);
    }
  };
  const handleOpenModal = (record) => {
    setSelectedRequest(record);
    setStatus(record.status);
    setRemarks(record.remarks || "");
    setOpen(true);

  };

  const handleFilterChange = (key, value) => {
    const updated = {
      ...filters,
      [key]: value,
    };

    setFilters(updated);
    fetchPurchaseRequests(updated);
  };

  const resetFilters = () => {
    const cleared = {
      status: undefined,
      department: undefined,
      priority: undefined,
      dateRange: [],
    };

    setFilters(cleared);
    fetchPurchaseRequests(cleared);
  };

  const handleUpdateStatus = async () => {

    try {

      setUpdateLoading(true);

      const res = await axiosInstance.put(
        `/purchase/update-status/${selectedRequest.id}`,
        {
          status,
          remarks,
        }
      );

      if (res.status) {

        message.success(
          "Status updated successfully"
        );

        setOpen(false);

        fetchPurchaseRequests();

      }

    } catch (err) {

      message.error(
        err.message || "Failed to update request"
      );

    } finally {

      setUpdateLoading(false);

    }

  };

  const columns = [
{
  title: "S.No",
  key: "serial",
  render: (_, __, index) => index + 1,
},
    {
      title: "Item",
      dataIndex: "item_name",
      key: "item_name",
    },

    {
      title: "Department",
      dataIndex: "department",
      key: "department",
    },

    {
      title: "Quantity",
      key: "quantity",
      render: (_, record) => (
        <span>
          {record.quantity} {record.unit}
        </span>
      ),
    },

    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      render: (priority) => {

        let color = "green";

        if (priority === "MEDIUM") {
          color = "orange";
        }

        if (priority === "HIGH") {
          color = "red";
        }

        return (
          <Tag color={color}>
            {priority}
          </Tag>
        );

      },
    },

    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {

        let color = "default";

        if (status === "APPROVED") {
          color = "green";
        }

        if (status === "REJECTED") {
          color = "red";
        }

        if (status === "SUBMITTED") {
          color = "blue";
        }

        return (
          <Tag color={color}>
            {status}
          </Tag>
        );

      },
    },

    {
      title: "Requested By",
      key: "created_by",
      render: (_, record) => (
        <div>
          <Text strong>
            {record.created_by?.name}
          </Text>

          <br />

          <Text type="secondary">
            {record.created_by?.email}
          </Text>
        </div>
      ),
    },

    {
      title: "Required Date",
      dataIndex: "required_date",
      key: "required_date",
      render: (date) =>
        dayjs(date).format("DD MMM YYYY"),
    },

    {
      title: "Action",
      key: "action",
      render: (_, record) => (

        <Button
          type="primary"
          onClick={() => handleOpenModal(record)}
         className="bg-primary! border-primary!"
        >
          Update Status
        </Button>

      ),
    },

  ];

  return (

    <div>

      <Card
        bordered={false}
        style={{
          borderRadius: 16,
        }}
      >

        <div className="mb-6">

          <h2 className="text-xl font-semibold text-gray-800">
            Manage Purchase Requests
          </h2>

          <p className="text-xs text-gray-400 mt-1">
            Review and update employee purchase requests
          </p>

        </div>

        <div>
          <div className="flex flex-wrap gap-3 mb-5">

            {/* Status */}
            <Select
              placeholder="Status"
              allowClear
              style={{ width: 160 }}
              value={filters.status}
              onChange={(val) => handleFilterChange("status", val)}
              options={[
                { label: "Draft", value: "DRAFT" },
                { label: "Submitted", value: "SUBMITTED" },
                { label: "Approved", value: "APPROVED" },
                { label: "Rejected", value: "REJECTED" },
              ]}
            />

            {/* Department */}
            <Select
              placeholder="Department"
              allowClear
              style={{ width: 160 }}
              value={filters.department}
              onChange={(val) => handleFilterChange("department", val)}
              options={[
                {
                  label: "Production",
                  value: "Production",
                },
                {
                  label: "HR",
                  value: "HR",
                },
                {
                  label: "Operations",
                  value: "Operations",
                },
                {
                  label: "Finance",
                  value: "Finance",
                },
                {
                  label: "Warehouse",
                  value: "Warehouse",
                },
              ]}
            />

            {/* Priority */}
            <Select
              placeholder="Priority"
              allowClear
              style={{ width: 160 }}
              value={filters.priority}
              onChange={(val) => handleFilterChange("priority", val)}
              options={[
                { label: "Low", value: "LOW" },
                { label: "Medium", value: "MEDIUM" },
                { label: "High", value: "HIGH" },
              ]}
            />

            {/* Date Range */}
            <RangePicker
              value={filters.dateRange}
              onChange={(val) => handleFilterChange("dateRange", val || [])}
            />

            {/* Reset */}
            <Button onClick={resetFilters}>
              Reset
            </Button>

          </div>
        </div>



        <Table
          rowKey="id"
          columns={columns}
          dataSource={data}
          loading={loading}
          pagination={{
            pageSize: 8,
          }}
        />

      </Card>

      <Modal
        open={open}
        title="Update Purchase Request"
        onCancel={() => setOpen(false)}
        footer={false}
      >

        <div className="flex flex-col gap-5 mt-4">

          <div>

            <Text strong>
              Status
            </Text>

            <Select
              className="w-full mt-2"
              size="large"
              value={status}
              onChange={setStatus}
              options={[
                {
                  label: "APPROVED",
                  value: "APPROVED",
                },
                {
                  label: "REJECTED",
                  value: "REJECTED",
                },
              ]}
            />

          </div>

          <div>

            <Text strong>
              Remarks
            </Text>

            <TextArea
              rows={4}
              value={remarks}
              onChange={(e) =>
                setRemarks(e.target.value)
              }
              placeholder="Enter remarks"
              className="mt-2"
            />

          </div>

          <Space className="justify-end w-full">

            <Button
              size="large"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>

            <Button
              type="primary"
              size="large"
              loading={updateLoading}
              onClick={handleUpdateStatus}
              className="bg-primary! border-primary!"

            >
              Update
            </Button>

          </Space>

        </div>

      </Modal>

    </div>

  );

}