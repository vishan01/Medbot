import React from "react";
import { Box, Text } from "@chakra-ui/react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const FatGraph = ({ calories }) => {
  return (
    <Box
  border="1px solid #E2E8F0"
  borderRadius="md"
  className="shadow-xl bg-[#f5f5f5] rounded-lg" // Add shadow and rounded corners
>
  <Text fontSize="xl" fontWeight="semibold" mb={4} p={4} className="text-[#354f52] text-2xl">
    Calories Expended
  </Text>
  <ResponsiveContainer width="100%" height={265}>
    <AreaChart
      data={calories}
      margin={{
        top: 20,
        right: 20,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" stroke="#D1D5DB" />
      <XAxis dataKey="date" hide={true} /> {/* Hide X-axis */}
      <YAxis tick={{ fill: "#6B7280b0" }} axisLine={{ stroke: "#D1D5DBB0" }} /> {/* Styling for Y-axis */}
      <Tooltip
        contentStyle={{
          borderRadius: "8px",
          backgroundColor: "#FFFFFFC0", // Semi-transparent white background
          backdropFilter: "blur(8px)", // Apply background blur effect
          WebkitBackdropFilter: "blur(8px)", // Safari support
        }}
      />
      <Area
        type="monotone"
        dataKey="calories"
        stroke="#8884d8"
        fill="#8884d8"
        fillOpacity={0.4} // Slight transparency for the filled area
      />
    </AreaChart>
  </ResponsiveContainer>
</Box>

  );
};

export default FatGraph;