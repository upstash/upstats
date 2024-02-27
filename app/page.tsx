"use client";

import React from "react";
import { useStatusData } from "app/hooks/useStatusData";
import { formatUrl } from "lib/utils";
import { Card, CardContent } from "./components/ui/card";
import { Separator } from "./components/ui/separator";
import OperationStatusBand from "./components/operation-status-band";
import StatusCard from "./components/status-card";

export default function Index() {
  const url = formatUrl(process.env.NEXT_PUBLIC_URL_TO_CHECK);

  const { dailyStatusData, monthlyAverage, isOperational } = useStatusData({
    url,
  });

  return (
    <main className="py-10">
      <div className="flex flex-col items-center w-full h-full">
        <div className="flex flex-row items-center gap-4 mx-auto mb-4 text-4xl font-bold text-center w-[48rem]">
          {url}
          {<OperationStatusBand isOperational={isOperational} />}
        </div>
        <Card className="py-4 mx-auto w-[48rem] border-slate-400 rounded-xl">
          <CardContent>
            <StatusCard data={monthlyAverage} interval="Monthly" />
            <Separator className="my-4 text-black" />
            <StatusCard data={dailyStatusData} interval="Recently" />
          </CardContent>
        </Card>
      </div>

      {/*<div className="mb-4">
        <p className="text-center ">
          This application is using QStash for serverless task scheduling, and
          Upstash Redis for storing the state. <br /> You can see the Github
          repository{" "}
          <a
            href="https://github.com/fahreddinozcan/upstats"
            className="font-bold text-blue-500"
          >
            here
          </a>{" "}
          to learn how to utilize Upstash products with Next.js Server Side
          Rendering.
        </p>
      </div>
      <footer className="flex items-center justify-center w-full gap-3 py-4 bg-black">
        <span className="font-bold text-white">Powered by</span>
        <a href="https://www.upstash.com" target="_blank">
          <UpstashLogo />
        </a>
      </footer>*/}
    </main>
  );
}
