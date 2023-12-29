import React from "react";
import { BarChart, Bar, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { CustomTooltip } from "./CustomTooltip";

type Interval = "Monthly" | "Recently";
export const StatusBarChart = ({
  data,
  interval,
}: {
  data: any;
  interval: Interval;
}) => {
  const getColor = (value: any) => {
    if (value === "success") return "#10b98190";
    if (value === "fail") return "#ef444490";
    if (value === "missing") return "#d4d4d890";
    return "#d4d4d890";
  };

  return (
    <ResponsiveContainer width="100%" height={50}>
      <BarChart width={150} height={40} data={data} barSize={12}>
        (
        <Tooltip
          content={<CustomTooltip interval={interval} />}
          cursor={{ fill: "transparent" }}
        />
        <Bar
          dataKey="pv"
          data={data}
          style={{ borderRadius: "10px" }}
          radius={4}
        >
          {data.map((entry: any, index: any) => {
            return <Cell key={`cell-${index}`} fill={getColor(entry.status)} />;
          })}
        </Bar>
        )
      </BarChart>
    </ResponsiveContainer>
  );
};
