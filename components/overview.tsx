"use client";

import React from "react";
import { BarChart, ResponsiveContainer, XAxis, YAxis, Bar } from "recharts";

interface OverviewPropsType {
  data: any[];
}

const Overview: React.FC<OverviewPropsType> = ({ data }) => {
  return (
    <ResponsiveContainer width={"100%"} height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey={"name"}
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Bar dataKey={"total"} fill="#3498db" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default Overview;