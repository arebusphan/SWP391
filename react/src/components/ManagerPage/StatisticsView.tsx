import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  FaUserGraduate,
  FaSchool,
  FaNotesMedical,
  FaHeartbeat,
  FaUserCheck,
  FaUserTimes,
} from "react-icons/fa";
import { getOverviewStatistics } from "@/service/serviceauth";

const COLORS = ["#8884d8", "#82ca9d", "#ff7f50", "#ffc658", "#a0e0f0", "#d0a0f0"];

export default function StatisticView() {
  const [statCards, setStatCards] = useState<any[]>([]);
  const [barData, setBarData] = useState<any[]>([]);
  const [medicationPie, setMedicationPie] = useState<any[]>([]);
  const [vaccinePie, setVaccinePie] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getOverviewStatistics();

        const iconMap: Record<string, ReactNode> = {
          "Total Students": <FaUserGraduate className="text-blue-500" />,
          "Total Classes": <FaSchool className="text-green-500" />,
          "Pending Medication Requests": <FaNotesMedical className="text-yellow-500" />,
          "Health Check Visits": <FaHeartbeat className="text-red-500" />,
          "Vaccinated Students": <FaUserCheck className="text-green-600" />,
          "Unvaccinated Students": <FaUserTimes className="text-red-600" />,
        };

        setStatCards(
          data.statCards.map((card: any) => ({
            ...card,
            icon: iconMap[card.label] || null,
          }))
        );

        setBarData(data.barData);
        setMedicationPie(data.medicationPie);
        setVaccinePie(data.vaccinePie);
      } catch (err) {
        console.error("Failed to fetch overview statistics", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Overview Statistics</h1>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {statCards.map((card, idx) => (
          <Card
            key={idx}
            className="flex items-center gap-4 p-4 shadow-md rounded-2xl min-h-[100px]"
          >
            <div className="text-3xl">{card.icon}</div>
            <div>
              <div className="text-xl font-bold">{card.value}</div>
              <div className="text-sm text-gray-500">{card.label}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Bar chart */}
      <div className="bg-white p-4 shadow-md rounded-2xl">
        <h2 className="font-semibold text-lg mb-4">Number of Students per Class</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="students">
              {barData.map((_, idx) => (
                <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white p-4 shadow-md rounded-2xl">
          <h2 className="font-semibold text-lg mb-4">Medication Request Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={medicationPie}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, percent }) =>
                  `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
                }
              >
                {medicationPie.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 shadow-md rounded-2xl">
          <h2 className="font-semibold text-lg mb-4">Vaccination Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={vaccinePie}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, percent }) =>
                  `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
                }
              >
                {vaccinePie.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
