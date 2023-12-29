"use client";

import React, { PureComponent } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useStatusData } from "../hooks/useStatusData";
import { Spinner } from "./icons/spinner";

import { CheckIcon } from "./icons/check-icon";
import { AlertIcon } from "./icons/alert-icon";
import { StatusBarChart } from "./StatusBarChart";
import { Separator } from "@/components/ui/separator";

function formatUrl(url: string) {
  return url.replace(/^(https?:\/\/)/, "");
}

export const MainCard = () => {
  const url = process.env.NEXT_PUBLIC_URL_TO_CHECK || " ";
  const { getStatusData, dailyStatusData, monthlyAverage, isOperational } =
    useStatusData({ url });

  return (
    <div className="flex flex-col items-center w-full h-full">
      <div className="flex flex-row items-center w-6/12 gap-4 mb-4 text-4xl font-bold text-center">
        {formatUrl(url)}
        {<OperationStatusBand isOperational={isOperational} />}
      </div>
      <Card className="w-6/12 py-4 border-slate-400 rounded-xl">
        <CardContent>
          {/* <button
            className="border border-black"
            onClick={async () => {
              const res = await fetch("/api/ping", {
                method: "POST",
                body: JSON.stringify({
                  url: "https://www.upstash.com",
                }),
              });
              console.log(res);
            }}
          >
            Send
          </button> */}
          {/* <button
            className="border border-black"
            onClick={async () => {
              await getStatusData();
            }}
          >
            GET DATA
          </button> */}
          <StatusRow data={monthlyAverage} interval="Monthly" />
          <Separator className="my-4 text-black" />
          <StatusRow data={dailyStatusData} interval="Recently" />
        </CardContent>
      </Card>
    </div>
  );
};

type Interval = "Recently" | "Monthly";

const StatusRow = ({ data, interval }: { data: any; interval: Interval }) => {
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

const OperationStatusBand = ({ isOperational }: { isOperational: boolean }) => {
  return (
    <div className="flex flex-row items-center gap-1 text-lg ">
      {isOperational ? (
        <>
          <CheckIcon />
          <p className="text-emerald-700">Operational</p>
        </>
      ) : (
        <>
          <AlertIcon />
          <p className="text-red-700">Warning</p>
        </>
      )}
    </div>
  );
};
