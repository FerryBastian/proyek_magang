import { useEffect, useState } from "react";
import { adminApi } from "../services/api";
import { useAuth } from "../context/AuthContext";

import {
  Chart as ChartJS,
  LineElement,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from "chart.js";

import { Line, Doughnut, Bar } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

export default function AdminDashboard() {

  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getDashboard()
      .then(res => setDashboardData(res.data))
      .catch(console.log)
      .finally(() => setLoading(false));
  }, []);

  const stats = dashboardData?.stats;

  // ===============================
  // TREND PENGAJUAN 7 HARI
  // ===============================
  const trendData = {
    labels: ["8 Mar", "9 Mar", "10 Mar", "11 Mar", "12 Mar", "13 Mar", "14 Mar"],
    datasets: [
      {
        label: "Jumlah Pengajuan",
        data: [0, 1, 0, 2, 2, 0, 0],
        borderColor: "#0096C7",
        backgroundColor: "#0096C7",
        tension: 0.4
      }
    ]
  };

  // ===============================
  // STATUS PENGAJUAN
  // ===============================
  const statusData = {
    labels: ["Pending", "Approved", "Rejected"],
    datasets: [
      {
        data: [
          stats?.pending_count || 0,
          stats?.approved_count || 0,
          stats?.rejected_count || 0
        ],
        backgroundColor: [
          "#F59E0B",
          "#22C55E",
          "#EF4444"
        ]
      }
    ]
  };

  // ===============================
  // PENGAJUAN PER BULAN
  // ===============================
  const monthlyData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "Mei", "Juni", "Juli", "Agustus", "Sept", "Okt", "Nov", "Des" ],
    datasets: [
      {
        label: "Jumlah Pengajuan",
        data: [1, 3, 2, 0],
        backgroundColor: "#0096C7",
        borderRadius: 6
      }
    ]
  };

  return (
    <div style={{ fontFamily: "'Barlow', sans-serif", padding: 20 }}>

      {/* HEADER DASHBOARD */}
      <div
        style={{
          background: "linear-gradient(135deg,#0077A8,#00B4D8)",
          borderRadius: 20,
          padding: "28px 32px",
          marginBottom: 30,
          color: "#fff"
        }}
      >
        <p style={{ margin: 0, fontSize: 13, opacity: 0.8 }}>
          Selamat datang kembali 👋
        </p>

        <h2 style={{ margin: "4px 0", fontWeight: 700 }}>
          {user?.name || "Admin"}
        </h2>

        <p style={{ margin: 0, fontSize: 12 }}>
          {new Date().toLocaleDateString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
          })}
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 40 }}>
          Memuat statistik...
        </div>
      ) : (
        <>
          {/* GRID CHART */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr",
              gap: 24
            }}
          >

            {/* LINE CHART */}
            <div
              style={{
                background: "#fff",
                padding: 20,
                borderRadius: 16,
                border: "1px solid #cce6f0",
                height: 320
              }}
            >
              <h3 style={{ marginBottom: 15 }}>
                Trend Pengajuan 7 Hari Terakhir
              </h3>

              <div style={{ height: 240 }}>
                <Line
                  data={trendData}
                  options={{
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: { stepSize: 1 }
                      }
                    }
                  }}
                />
              </div>
            </div>

            {/* DOUGHNUT CHART */}
            <div
              style={{
                background: "#fff",
                padding: 20,
                borderRadius: 16,
                border: "1px solid #cce6f0",
                height: 320
              }}
            >
              <h3 style={{ marginBottom: 15 }}>
                Proporsi Status Pengajuan
              </h3>

              <div style={{ height: 240 }}>
                <Doughnut
                  data={statusData}
                  options={{
                    maintainAspectRatio: false,
                    cutout: "65%",
                    plugins: {
                      legend: {
                        position: "bottom"
                      }
                    }
                  }}
                />
              </div>
            </div>

          </div>

          {/* BAR CHART BULAN */}
          <div
            style={{
              background: "#fff",
              padding: 20,
              borderRadius: 16,
              border: "1px solid #cce6f0",
              marginTop: 24
            }}
          >
            <h3 style={{ marginBottom: 15 }}>
              Pengajuan per Bulan
            </h3>

            <div style={{ height: 300 }}>
              <Bar
                data={monthlyData}
                options={{
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: { stepSize: 1 }
                    }
                  },
                  plugins: {
                    legend: {
                      display: false
                    }
                  }
                }}
              />
            </div>
          </div>

        </>
      )}
    </div>
  );
}