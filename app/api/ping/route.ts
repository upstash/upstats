import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { RedisClient } from "lib/redis-client";
import { ResponseStatusType, StatusDataType } from "lib/types";

const redis = RedisClient();
const retentionPeriod = 60 * 60 * 24 * 1000;

export async function POST(request: NextRequest) {
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

  await redis.zremrangebyscore(
    `daily_status:${url}`,
    0,
    currentTime - retentionPeriod,
  );

  return NextResponse.json(statusData);
}
