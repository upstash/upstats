import React from "react";
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { CustomTooltip } from "./custom-tooltip";
import { Interval, ResponseStatusType } from "lib/types";

export const StatusBarChart = ({
  data,
  interval,
}: {
  data: any;
  interval: Interval;
}) => {
  const getColor = (value: any) => {
    if (value === ResponseStatusType.SUCCESS) return "#10b98190";
    if (value === ResponseStatusType.FAIL) return "#ef444490";
    if (value === ResponseStatusType.MISSING) return "#d4d4d890";
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
