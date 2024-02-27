import { NextRequest, NextResponse } from "next/server";
import { verifySignatureEdge } from "@upstash/qstash/dist/nextjs";
import axios from "axios";
import { RedisClient } from "lib/redis-client";
import { ResponseStatusType } from "lib/types";

type StatusDataType = {
  time: string;
  ping: number;
  status: ResponseStatusType;
};

const redis = RedisClient();

export const POST = verifySignatureEdge(handler);

async function handler(request: NextRequest) {
  const { url } = await request.json();

  const currentTime = Date.now();

  const res = await axios.get(`${url}`);
  const pingTime = Date.now() - currentTime;

  const status =
    res.status === 200 ? ResponseStatusType.SUCCESS : ResponseStatusType.FAIL;

  const statusData: StatusDataType = {
    time: currentTime.toString(),
    ping: pingTime,
    status: status,
  };

  await redis.zadd(`daily_status:${url}`, {
    score: currentTime,
    member: JSON.stringify(statusData),
  });

  const retentionPeriod = 60 * 60 * 24 * 1000;

  await redis.zremrangebyscore(
    `daily_status:${url}`,
    0,
    currentTime - retentionPeriod,
  );

  return NextResponse.json(statusData);
}
