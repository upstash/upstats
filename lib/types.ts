export enum ResponseStatusType {
  SUCCESS = "success",
  FAIL = "fail",
  MISSING = "missing",
}

export type StatusDataType = {
  time: string;
  ping: number;
  status: ResponseStatusType;
};

export type Interval = "Recently" | "Monthly";

export type DailyStatusDataType = {
  name: string;
  pv: number;
  ping: number;
  time: string;
  status: ResponseStatusType;
};

export type MonthlyStatusDataType = {
  time: string;
  pv: number;
  avg_ping: string;
  totalCheck: number;
  successfulCheck: number;
  status: ResponseStatusType;
};
