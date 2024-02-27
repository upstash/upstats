import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { StatusBarChart } from "./status-bar-chart";
import { Interval } from "lib/types";

const StatusCard = ({ data, interval }: { data: any; interval: Interval }) => {
  return (
    <Card className="w-full border-transparent shadow-none rounded-xl">
      <CardHeader className="flex flex-row gap-2">
        <CardTitle>{interval}</CardTitle>
        <CardDescription>status check</CardDescription>
      </CardHeader>
      <CardContent>
        <StatusBarChart data={data} interval={interval} />
      </CardContent>
    </Card>
  );
};

export default StatusCard;
