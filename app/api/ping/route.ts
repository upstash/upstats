import { NextResponse, NextRequest } from "next/server";
import { verifySignatureEdge } from "@upstash/qstash/dist/nextjs";
import axios from "axios";
import { RedisClient } from "@/lib/redis-client";

const redis = RedisClient();

// export const POST = verifySignatureEdge(handler);

// async function handler(request: NextRequest) {
export async function POST(request: NextRequest) {
  const { url } = await request.json();

  const currentTime = Date.now();

  const res = await axios.get(`${url}`);
  const pingTime = Date.now() - currentTime;

  type StatusType = "success" | "fail" | "missing";
  const status: StatusType = res.status === 200 ? "success" : "fail";

  type StatusDataType = {
    time: string;
    ping: number;
    status: StatusType;
  };
  const statusData: StatusDataType = {
    time: currentTime.toString(),
    ping: pingTime,
    status: status,
  };

  console.log(statusData);

  await redis.zadd(`daily_status:${url}`, {
    score: currentTime,
    member: JSON.stringify(statusData),
  });

  const retentionPeriod = 60 * 60 * 24 * 1000;

  await redis.zremrangebyscore(
    `daily_status:${url}`,
    0,
    currentTime - retentionPeriod
  );

  return NextResponse.json(statusData);
}
