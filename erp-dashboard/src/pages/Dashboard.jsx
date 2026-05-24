import { useEffect, useState } from "react";
import { Card, Tag, Avatar, Spin } from "antd";
import dayjs from "dayjs";
import axiosInstance from "../utils/axios";

export default function Dashboard() {

  const [stats,    setStats]    = useState(null);
  const [activity, setActivity] = useState([]);
  const [pending,  setPending]  = useState([]);
  const [loading,  setLoading]  = useState(false);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/dashboard/details");
      if (res.status) {
        setStats(res.data.stats);
        setActivity(res.data.recent_activity);
        // pending = submitted requests from activity
        setPending(
          res.data.recent_activity.filter(
            (i) => i.request?.status === "SUBMITTED"
          )
        );
      }
    } catch (err) {
      console.error("Dashboard fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      label: "Total requests",
      value: stats?.total    ?? 0,
      color: "#185FA5",
      bg:    "#E6F1FB",
      icon:  "ti-file-text",
      sub:   "All time",
    },
    {
      label: "Pending",
      value: stats?.pending  ?? 0,
      color: "#854F0B",
      bg:    "#FAEEDA",
      icon:  "ti-clock",
      sub:   "Awaiting review",
    },
    {
      label: "Approved",
      value: stats?.approved ?? 0,
      color: "#0F6E56",
      bg:    "#E1F5EE",
      icon:  "ti-circle-check",
      sub:   "This month",
    },
    {
      label: "Rejected",
      value: stats?.rejected ?? 0,
      color: "#A32D2D",
      bg:    "#FCEBEB",
      icon:  "ti-circle-x",
      sub:   "This month",
    },
    {
      label: "Drafts",
      value: stats?.draft    ?? 0,
      color: "#5F5E5A",
      bg:    "#F1EFE8",
      icon:  "ti-pencil",
      sub:   "In progress",
    },
  ];

  const actionConfig = {
    submitted: { bg: "#E6F1FB", color: "#0C447C", icon: "ti-send"         },
    approved:  { bg: "#E1F5EE", color: "#085041", icon: "ti-circle-check" },
    rejected:  { bg: "#FCEBEB", color: "#791F1F", icon: "ti-circle-x"     },
  };

  const priorityConfig = {
    HIGH:   { bg: "#FAEEDA", color: "#633806" },
    MEDIUM: { bg: "#E6F1FB", color: "#0C447C" },
    LOW:    { bg: "#EAF3DE", color: "#27500A" },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-6" style={{ background: "#f8f7f4", minHeight: "100vh" }}>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        {statCards.map((s, i) => (
          <div key={i}
            className="bg-white rounded-xl p-4"
            style={{ border: "0.5px solid #e5e5e3" }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-md flex items-center justify-center"
                style={{ background: s.bg }}>
                <i className={`ti ${s.icon}`}
                  style={{ fontSize: 14, color: s.color }}
                  aria-hidden="true"
                />
              </div>
              <span className="text-xs text-gray-400">{s.label}</span>
            </div>
            <p className="text-3xl font-medium" style={{ color: s.color }}>
              {s.value}
            </p>
            <p className="text-xs text-gray-400 mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Recent activity */}
        <Card
          bordered={false}
          size="small"
          style={{ borderRadius: 16, border: "0.5px solid #e5e5e3" }}
        >
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm font-medium text-gray-800">Recent activity</p>
            <p className="text-xs text-gray-400">Last 10 actions</p>
          </div>

          {activity.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-8">
              No recent activity
            </p>
          ) : (
            activity.map((item, i) => {
              const cfg = actionConfig[item.action] || actionConfig.submitted;
              return (
                <div key={i}
                  className="flex items-start gap-3 py-3"
                  style={{ borderBottom: i < activity.length - 1 ? "0.5px solid #f0f0f0" : "none" }}
                >
                  <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: cfg.bg }}>
                    <i className={`ti ${cfg.icon}`}
                      style={{ fontSize: 13, color: cfg.color }}
                      aria-hidden="true"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">
                      {item.request?.item_name} — {item.action}
                    </p>
                    <p className="text-xs text-gray-400">
                      by {item.performed_by?.name} · {item.request?.department}
                    </p>
                    <p className="text-xs text-gray-300 mt-0.5">
                      {dayjs(item.created_at).format("DD MMM, hh:mm A")}
                    </p>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ background: cfg.bg, color: cfg.color }}>
                    {item.to_status}
                  </span>
                </div>
              );
            })
          )}
        </Card>

        {/* Pending requests */}
        <Card
        size="small"
          bordered={false}
          style={{ borderRadius: 16, border: "0.5px solid #e5e5e3" }}
        >
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm font-medium text-gray-800">Pending requests</p>
            <p className="text-xs text-gray-400">Needs attention</p>
          </div>

          {pending.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-8">
              No pending requests
            </p>
          ) : (
            pending.map((item, i) => {
              const pc = priorityConfig[item.request?.priority] || priorityConfig.LOW;
              return (
                <div key={i}
                  className="flex items-center gap-3 py-3"
                  style={{ borderBottom: i < pending.length - 1 ? "0.5px solid #f0f0f0" : "none" }}
                >
                  <Avatar
                    size={30}
                    style={{ background: "#E1F5EE", color: "#085041", fontSize: 12, flexShrink: 0 }}
                  >
                    {item.performed_by?.name?.[0]}
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">
                      {item.request?.item_name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {item.request?.department}
                    </p>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ background: pc.bg, color: pc.color }}>
                    {item.request?.priority}
                  </span>
                </div>
              );
            })
          )}
        </Card>

      </div>
    </div>
  );
}