import { useEffect, useState } from "react";
import {
  DailyStatusDataType,
  MonthlyStatusDataType,
  ResponseStatusType,
  StatusDataType,
} from "lib/types";
import { RedisClient } from "lib/redis-client";

const redis = RedisClient();

const defaultData: DailyStatusDataType = {
  name: "status_data",
  pv: 2400,
  ping: 0,
  time: "0",
  status: ResponseStatusType.MISSING,
};

/**
 * useStatusData
 * @param url
 */

export function useStatusData({ url }: { url: string }) {
  const [dailyStatusData, setDailyStatusData] = useState<DailyStatusDataType[]>(
    [],
  );
  const [monthlyAverage, setMonthlyAverage] = useState<MonthlyStatusDataType[]>(
    [],
  );

  const [isOperational, setIsOperational] = useState<boolean>(false);

  const getDailyStatusData = async () => {
    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0, 0);
    const startTime = startOfDay.getTime();

    const endOfDay = new Date();
    endOfDay.setUTCHours(23, 59, 59, 999);
    const endTime = endOfDay.getTime();

    const result = await redis.zrange<StatusDataType[]>(
      `daily_status:${url}`,
      startTime,
      endTime,
      {
        byScore: true,
      },
    );

    const newDailyStatusData = [];

    result.reverse().forEach((data: StatusDataType) => {
      newDailyStatusData.push({
        name: "status_data",
        pv: 2400,
        ping: data.ping,
        time: data.time,
        status: data.status,
      } as DailyStatusDataType);
    });

    let dailyAverageSum = 0;
    let dailyTotalCheck = 0;
    let dailySuccessfulCheck = 0;

    result.forEach((data: StatusDataType) => {
      dailyAverageSum += data.ping;
      dailyTotalCheck += 1;
      if (data.status === ResponseStatusType.SUCCESS) {
        dailySuccessfulCheck += 1;
      }
    });

    const dailyAverage =
      result.length > 0 ? dailyAverageSum / result.length : 0;

    while (newDailyStatusData.length < 30) {
      newDailyStatusData.push(defaultData);
    }

    setDailyStatusData(newDailyStatusData.reverse());

    setIsOperational(
      newDailyStatusData.at(newDailyStatusData.length - 1)?.status ===
        ResponseStatusType.SUCCESS,
    );

    setDailyAverage(
      dailyAverage,
      dailyTotalCheck,
      dailySuccessfulCheck,
      new Date().toISOString(),
    );
    return result;
  };

  const setDailyAverage = async (
    dailyAverage: number,
    totalCheck: number,
    successfulCheck: number,
    time: string,
  ) => {
    const date = new Date(time);

    date.setHours(0, 0, 0, 0);
    const dayKey = date.getTime();

    const dailyAverageData = {
      avg_ping: dailyAverage.toFixed(0),
      totalCheck: totalCheck,
      successfulCheck: successfulCheck,
      status:
        totalCheck == 0
          ? ResponseStatusType.MISSING
          : (totalCheck * 3) / 4 < successfulCheck
            ? ResponseStatusType.SUCCESS
            : ResponseStatusType.FAIL,
    };

    const jsonExists = await redis.json.type(
      `daily_status_json:${url}`,
      `$.${dayKey}`,
    );

    if (!jsonExists) {
      await redis.json.set(`daily_status_json:${url}`, "$", JSON.stringify({}));
    }
    await redis.json.set(
      `daily_status_json:${url}`,
      `$.${dayKey}`,
      JSON.stringify(dailyAverageData),
    );
  };

  const getDailyAverage = async (time: string) => {
    const now = new Date(time);

    now.setHours(0, 0, 0, 0);
    const endTime = now.getTime();

    const path = `$.${endTime}`;

    const result = await redis.json.get(`daily_status_json:${url}`, path);

    const newMonthlyAverageData = monthlyAverage.slice(0, -1);

    const newTodayAverageData = {
      time: endTime.toString(),
      pv: 2400,
      avg_ping: result.avg_ping,
      totalCheck: result.totalCheck,
      successfulCheck: result.successfulCheck,
      status: result.status,
    };

    if (!newTodayAverageData) return;

    newMonthlyAverageData.push(newTodayAverageData);

    setMonthlyAverage(newMonthlyAverageData);

    return result;
  };

  const getMonthlyData = async (time: string) => {
    const today = new Date(time);
    today.setHours(0, 0, 0, 0);

    const path = `$`;

    const result = await redis.json.get(`daily_status_json:${url}`, path);

    const newMonthlyData: MonthlyStatusDataType[] = Object.keys(result[0]).map(
      (key) => {
        return {
          time: key,
          pv: 2400,
          avg_ping: result[0][key].avg_ping,
          totalCheck: result[0][key].totalCheck,
          successfulCheck: result[0][key].successfulCheck,
          status: result[0][key].status,
        };
      },
    );

    newMonthlyData
      .sort((a, b) => parseInt(a.time) - parseInt(b.time))
      .reverse();

    while (newMonthlyData.length < 30) {
      newMonthlyData.push({
        time: "0",
        pv: 2400,
        avg_ping: "0",
        totalCheck: 0,
        successfulCheck: 0,
        status: ResponseStatusType.MISSING,
      });
    }

    setMonthlyAverage(newMonthlyData.reverse());
  };

  const fillMockData = () => {
    while (dailyStatusData.length < 30) {
      dailyStatusData.push(defaultData);
    }

    while (monthlyAverage.length < 30) {
      monthlyAverage.push({
        time: "0",
        pv: 2400,
        avg_ping: "0",
        totalCheck: 0,
        successfulCheck: 0,
        status: ResponseStatusType.MISSING,
      });
    }
  };

  const getStatusData = async () => {
    if (!url) {
      fillMockData();
      return;
    }

    getDailyStatusData();

    await getDailyAverage(new Date().toISOString());
    await getMonthlyData(new Date().toISOString());
  };

  const init = async () => {
    await getDailyStatusData();
    await getMonthlyData(new Date().toISOString());
  };

  useEffect(() => {
    if (!url) {
      return fillMockData();
    }

    init();
  }, []);

  useEffect(() => {
    const intervalID = setInterval(getStatusData, 1000 * 60 * 10);
    return () => clearInterval(intervalID);
  }, []);

  return { dailyStatusData, monthlyAverage, isOperational };
}
