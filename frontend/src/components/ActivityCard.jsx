import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const ActivityCard = ({ result, heartPoints }) => {
  return (
    <div className="p-4  rounded-lg  mx-auto w-full h-full">
      <h2 className="text-2xl font-medium mb-4 text-[#354f52]">Activity</h2>
      <div className="flex flex-col md:flex-row justify-between gap-4">
        {/* Step Count Chart */}
        <div className="p-4 bg-gray-100 rounded-md flex-1">
          <h3 className="text-xl font-semibold mb-6 text-[#354f52]">Step Count</h3>
          <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
  <BarChart
    data={result}
    margin={{
      top: 20,
      right: 20,
      left: 20,
      bottom: 5,
    }}
    className="rounded-lg" // Apply rounded corners and shadow
  >
    <XAxis
      dataKey="date"
      hide={true} // Hide the X-axis
    />
    <YAxis
      tick={{ fill: "#6B7280b0" }} // Light gray text color for Y-axis ticks
      axisLine={{ stroke: "#D1D5DBB0" }} // Lighter axis line
    />
    <Tooltip
  contentStyle={{
    borderRadius: "8px",
    backgroundColor: "#FFFFFFC0", // Semi-transparent white background
    backdropFilter: "blur(8px)",  // Apply background blur effect
    WebkitBackdropFilter: "blur(8px)", // Safari support
  }}
/>
    <Bar
      type="monotone"
      dataKey="step_count"
      stroke="#212529" // Lighter blue for the bar stroke
      fill="#212529c0" // Matching fill for consistency
      barSize={32} // Increased size for thicker bars
      radius={[8, 8, 0, 0]} // Rounded corners on top of the bars
    />
  </BarChart>
</ResponsiveContainer>

          </div>
        </div>

        {/* Heart Points Chart */}
        <div className="p-4 bg-gray-100 rounded-md flex-1">
          <h3 className="text-xl font-semibold mb-6 text-[#354f52]">Heart Points</h3>
          <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
  <LineChart data={heartPoints}>
    <XAxis
      dataKey="day"
      hide={true} // Hide the X-axis
    />
    <YAxis
      tick={{ fill: "#6B7280b0" }} // Light gray text color for Y-axis ticks
      axisLine={{ stroke: "#D1D5DBB0" }} // Lighter axis line
    />
    <Tooltip
      contentStyle={{
        borderRadius: "8px",
        backgroundColor: "#FFFFFFC0", // Semi-transparent white background
        backdropFilter: "blur(8px)", // Apply background blur effect
        WebkitBackdropFilter: "blur(8px)", // Safari support
      }}
    />
    <Line
      type="monotone"
      dataKey="heartPoints"
      stroke="#82ca9d"
      strokeWidth={4}
    />
  </LineChart>
</ResponsiveContainer>


          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;
