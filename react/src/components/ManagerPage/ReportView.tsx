import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { getReportByType } from "@/service/serviceauth";
import * as XLSX from "xlsx";

const PIE_COLORS: Record<string, string[]> = {
  medication: ["#fbc02d", "#4caf50", "#f44336", "#2196f3"],
  "vaccine-consent": ["#66bb6a", "#ef5350", "#fbc02d"],
  "vaccine-status": ["#42a5f5", "#fbc02d"],
  healthcheck: ["#03a9f4", "#ff9800", "#e91e63"],
  incident: ["#9c27b0", "#f9a825", "#607d8b"],
};

const tabs = [
  { key: "all", label: "All" },
  { key: "medication", label: "Medication Requests" },
  { key: "vaccine-consent", label: "Vaccine Consent" },
  { key: "vaccine-status", label: "Vaccination Status" },
  { key: "healthcheck", label: "Health Check" },
  { key: "incident", label: "Medical Incidents" },
];

const filters = [
  { key: "week", label: "Week" },
  { key: "month", label: "Month" },
  { key: "year", label: "Year" },
];

const groupByGradeFn = (
  data: { name: string; [key: string]: any }[],
  pieLabels: string[]
) => {
  const grouped: Record<string, any> = {};
  data.forEach((item) => {
    const match = item.name.match(/^(\d+)/);
    const grade = match ? `Grade ${match[1]}` : "Other";
    if (!grouped[grade]) {
      grouped[grade] = { name: grade };
      pieLabels.forEach((label) => {
        grouped[grade][label] = 0;
      });
    }
    pieLabels.forEach((label) => {
      grouped[grade][label] += item[label] || 0;
    });
  });
  return Object.values(grouped);
};

export default function ReportView() {
  const [activeTab, setActiveTab] = useState("all");
  const [activeFilter, setActiveFilter] = useState("month");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [reportData, setReportData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (activeTab === "all") {
          const allKeys = tabs.filter((t) => t.key !== "all").map((t) => t.key);
          const promises = allKeys.map((k) => getReportByType(k));
          const results = await Promise.all(promises);
          const combined: Record<string, any> = {};
          allKeys.forEach((key, index) => {
            combined[key] = results[index];
          });
          setReportData(combined);
        } else {
          const data = await getReportByType(activeTab);
          setReportData({ [activeTab]: data });
        }
      } catch (error) {
        console.error("Error loading report data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  const handleExport = () => {
    const wb = XLSX.utils.book_new();

    const exportSingle = (key: string, label: string) => {
      const section = reportData[key];
      if (!section) return;

      const barSheet = XLSX.utils.json_to_sheet(section.bar);
      const pieSheet = XLSX.utils.json_to_sheet(section.pie);

      XLSX.utils.book_append_sheet(wb, barSheet, `${label} - Bar`);
      XLSX.utils.book_append_sheet(wb, pieSheet, `${label} - Pie`);
    };

    if (activeTab === "all") {
      tabs
        .filter((t) => t.key !== "all")
        .forEach((t) => exportSingle(t.key, t.label));
    } else {
      const label = tabs.find((t) => t.key === activeTab)?.label || "Report";
      exportSingle(activeTab, label);
    }

    const fileName =
      activeTab === "all" ? "Full_Report.xlsx" : `${activeTab}_report.xlsx`;

    XLSX.writeFile(wb, fileName);
  };

  const renderSection = (key: string) => {
    const data = reportData[key];
    if (!data) return null;

    const pieLabels = data.pie.map((p: any) => p.name);
    const pieColors = PIE_COLORS[key] || [];

    let barData = data.bar;

    if (["1", "2", "3", "4", "5"].includes(gradeFilter)) {
      barData = data.bar.filter((item: any) =>
        item.name.startsWith(gradeFilter)
      );
    }

    if (gradeFilter === "group") {
      barData = groupByGradeFn(data.bar, pieLabels);
    }

    const barTitle =
      key === "medication"
        ? "Medication Requests by Class"
        : key === "vaccine-consent"
        ? "Vaccine Consent Responses"
        : key === "vaccine-status"
        ? "Vaccination Status"
        : key === "healthcheck"
        ? "Health Check Count by Class"
        : "Medical Incidents by Class";

    const pieTitle =
      key === "medication"
        ? "Medication Request Status"
        : key === "vaccine-consent"
        ? "Consent Response Breakdown"
        : key === "vaccine-status"
        ? "Vaccination Distribution"
        : key === "healthcheck"
        ? "Health Check Results"
        : "Types of Medical Incidents";

    return (
      <div className="space-y-6" key={key}>
        <h2 className="text-xl font-semibold text-gray-800 mt-6">
          {tabs.find((t) => t.key === key)?.label}
        </h2>

        <div className="bg-white p-4 rounded-xl shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">{barTitle}</h3>
            <select
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value="all">All Classes</option>
              <option value="group">Grouped by Grade</option>
              <option value="1">Grade 1</option>
              <option value="2">Grade 2</option>
              <option value="3">Grade 3</option>
              <option value="4">Grade 4</option>
              <option value="5">Grade 5</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {pieLabels.map((label: string, idx: number) => (
                <Bar
                  key={label}
                  dataKey={label}
                  fill={pieColors[idx % pieColors.length]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="font-semibold text-lg mb-4">{pieTitle}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.pie}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, percent }: any) =>
                  `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
                }
              >
                {data.pie.map((_entry: any, idx: number) => (
                  <Cell
                    key={`cell-${idx}`}
                    fill={pieColors[idx % pieColors.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">System Reports</h1>
        <Button onClick={handleExport}>Export to Excel</Button>
      </div>

      <div className="flex justify-between items-center border-b pb-2">
        <select
          value={activeTab}
          onChange={(e) => setActiveTab(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 text-sm"
        >
          {tabs.map((t) => (
            <option key={t.key} value={t.key}>
              {t.label}
            </option>
          ))}
        </select>

        <select
          value={activeFilter}
          onChange={(e) => setActiveFilter(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 text-sm"
        >
          {filters.map((f) => (
            <option key={f.key} value={f.key}>
              By {f.label}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-center text-gray-600 mt-6">Loading data...</p>
      ) : activeTab === "all" ? (
        tabs.filter((t) => t.key !== "all").map((t) => renderSection(t.key))
      ) : (
        renderSection(activeTab)
      )}
    </div>
  );
}
