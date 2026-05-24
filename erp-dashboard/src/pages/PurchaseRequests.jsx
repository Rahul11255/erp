import { useEffect, useState } from "react";

import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Table,
  Tag,
  DatePicker,
  message,
  Space,
  Typography,
} from "antd";

import {
  PlusOutlined,
  EditOutlined,
} from "@ant-design/icons";

import dayjs from "dayjs";

import axiosInstance from "../utils/axios";

const { TextArea } = Input;
const { Text } = Typography;
const { RangePicker } = DatePicker;



export default function PurchaseRequests() {

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [data, setData] = useState([]);
  const [editId, setEditId] = useState(null);
  const [form] = Form.useForm();

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

      setTableLoading(true);
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

      console.log(err);

    } finally {

      setTableLoading(false);

    }

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

  const handleSubmit = async (values) => {

    try {

      setLoading(true);

      const payload = {
        ...values,
        required_date: dayjs(
          values.required_date
        ).format("YYYY-MM-DD"),
      };

      let res;

      if (editId) {

        res = await axiosInstance.put(
          `/purchase/update/${editId}`,
          payload
        );

      } else {

        res = await axiosInstance.post(
          "/purchase/create",
          payload
        );

      }

      if (res.status) {

        message.success(
          editId
            ? "Purchase request updated successfully"
            : "Purchase request created successfully"
        );
        form.resetFields();
        setOpen(false);
        setEditId(null);
        fetchPurchaseRequests();
      }

    } catch (err) {
      message.error(
        err.message || "Something went wrong"
      );

    } finally {

      setLoading(false);

    }

  };

  const handleEdit = (record) => {
    setEditId(record.id);
    form.setFieldsValue({
      ...record,
      required_date: dayjs(record.required_date),
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditId(null);
    form.resetFields();
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
        if (status === "DRAFT") {
          color = "orange";
        }
        return (
          <Tag color={color}>
            {status}
          </Tag>
        );
      },
    },

    {
      title: "Required Date",
      dataIndex: "required_date",
      key: "required_date",
      render: (date) =>
        dayjs(date).format("DD MMM YYYY"),
    },
   {
      title: "Reviewed By",
      key: "reviewed_by",
      render: (_, record) => (
        record.reviewed_by ? (
          <div>
            <Text strong>
              {record.reviewed_by?.name}
            </Text>
            <br />
            <Text type="secondary">
              {record.reviewed_by?.email}
            </Text>
          </div>
        ) : (
          <Text type="secondary" italic>
            Review pending
          </Text>
        )
      ),
    },

     {
      title: "Remarks",
      dataIndex: "remarks",
      key: "remarks",
      width:250
      
    },

  {
  title: "Action",
  key: "action",
  render: (_, record) => {

    const isDisabled =
      record.status === "APPROVED" ||
      record.status === "REJECTED";

    return (
      <Space>

        <Button
          icon={<EditOutlined />}
          onClick={() => handleEdit(record)}
          disabled={isDisabled}
        >
          Edit
        </Button>

      </Space>
    );
  },
},

  ];

  return (

    <div>

      <Card
        bordered={false}
        size="small"
        style={{
          borderRadius: 16,
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Purchase Requests
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Manage and track all purchase requests
            </p>
            </div>
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



          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={() => setOpen(true)}
            className="bg-primary! border-primary!"

          >
            Create Request
          </Button>

        </div>

        <Table
          columns={columns}
          dataSource={data}
          loading={tableLoading}
          rowKey="id"
          pagination={{
            pageSize: 8,
          }}
        />

      </Card>

      <Modal
        open={open}
        title={
          editId
            ? "Update Purchase Request"
            : "Create Purchase Request"
        }
        onCancel={handleClose}
        footer={false}
        width={800}
      >

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Item Name"
                name="item_name"
                rules={[
                  {
                    required: true,
                    message: "Please enter item name",
                  },
                ]}
              >
                <Input
                  placeholder="Enter item name"
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label="Quantity"
                name="quantity"
                rules={[
                  {
                    required: true,
                    message: "Required",
                  },
                ]}
              >
                <Input
                  type="number"
                  placeholder="Qty"
                  size="large"
                />
              </Form.Item>

            </Col>

            <Col span={6}>
              <Form.Item
                label="Unit"
                name="unit"
                rules={[
                  {
                    required: true,
                    message: "Required",
                  },
                ]}
              >
                <Select
                  size="large"
                  placeholder="Select"
                  options={[
                    {
                      label: "PCS",
                      value: "PCS",
                    },
                    {
                      label: "KG",
                      value: "KG",
                    },
                    {
                      label: "LTR",
                      value: "LTR",
                    },
                    {
                      label: "BOX",
                      value: "BOX",
                    },
                  ]}
                />
              </Form.Item>

            </Col>

          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Department"
                name="department"
                rules={[
                  {
                    required: true,
                    message: "Please select department",
                  },
                ]}
              >
                <Select
                  size="large"
                  placeholder="Select department"
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
              </Form.Item>

            </Col>

            <Col span={12}>

              <Form.Item
                label="Required Date"
                name="required_date"
                rules={[
                  {
                    required: true,
                    message: "Please select date",
                  },
                ]}
              >
                <DatePicker
                  className="w-full"
                  size="large"
                />
              </Form.Item>

            </Col>

          </Row>

          <Row gutter={16}>

            <Col span={12}>

              <Form.Item
                label="Status"
                name="status"
                initialValue="SUBMITTED"
              >
                <Select
                  size="large"
                  options={[
                    {
                      label: "Draft",
                      value: "DRAFT",
                    },
                    {
                      label: "Submitted",
                      value: "SUBMITTED",
                    },
                  ]}
                />
              </Form.Item>

            </Col>

            <Col span={12}>

              <Form.Item
                label="Priority"
                name="priority"
                initialValue="MEDIUM"
              >
                <Select
                  size="large"
                  options={[
                    {
                      label: "LOW",
                      value: "LOW",
                    },
                    {
                      label: "MEDIUM",
                      value: "MEDIUM",
                    },
                    {
                      label: "HIGH",
                      value: "HIGH",
                    },
                  ]}
                />
              </Form.Item>

            </Col>

          </Row>

          <Form.Item
            label="Justification"
            name="justification"
          >
            <TextArea
              rows={4}
              placeholder="Why do you need this item?"
            />
          </Form.Item>

          <div className="flex justify-end gap-3">

            <Button
              size="large"
              onClick={handleClose}
            >
              Cancel
            </Button>

            <Button
              htmlType="submit"
              type="primary"
              size="large"
              loading={loading}
                           className="bg-primary! border-primary!"

            >
              {
                editId
                  ? "Update Request"
                  : "Submit Request"
              }
            </Button>

          </div>

        </Form>

      </Modal>

    </div>
  );
}