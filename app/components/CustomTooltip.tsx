import { Separator } from "@/components/ui/separator";

type Interval = "Recently" | "Monthly";

type PingState = "success" | "fail" | "missing";
export const CustomTooltip = ({
  active,
  payload,
  label,
  interval,
}: {
  active: any;
  payload: any;
  label: any;
  interval: Interval;
}) => {
  if (active && payload && payload.length) {
    const { value, time, ping, avg_ping, totalCheck, successfulCheck } =
      payload[0].payload;

    const status = payload[0].payload.status as PingState;

    const date = new Date(parseInt(time));

    const year = date.getUTCFullYear();
    const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
    const day = (date.getUTCDate() + 1).toString().padStart(2, "0");
    const hours = date.getUTCHours().toString().padStart(2, "0");
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");

    const formattedTime = `${hours}:${minutes}`;
    const formattedDate = `${day}/${month}/${year}`;

    const tooltipMessage: Record<PingState, string> = {
      success: "Successful",
      fail: "Failed",
      missing: "Missing Data",
    };

    if (!status) {
      status == totalCheck > 0
        ? "missing"
        : (totalCheck * 3) / 4 < successfulCheck
        ? "success"
        : "fail";
    }

    return (
      <div className="flex flex-col gap-2 p-2 ml-4 text-sm border rounded-lg bg-slate-50 border-slate-200 ">
        <p
          className={`${
            status === "success"
              ? "text-emerald-500"
              : status === "fail"
              ? "text-red-500"
              : "text-yellow-500"
          }
		  `}
        >
          {tooltipMessage[status]}
        </p>
        {status != "missing" && interval == "Monthly" && (
          <>
            <div className="flex flex-row gap-4">
              <p>{time === "0" ? "00/00/0000" : formattedDate}</p>
              <p>
                avg: <b>{avg_ping}</b>
              </p>
            </div>

            <Separator />
            <div className="flex flex-row justify-between gap-2">
              <p>
                total <b>{totalCheck}</b>
              </p>
              <p>
                successful <b className="text-emerald-500">{successfulCheck}</b>
              </p>
            </div>
          </>
        )}
        {status != "missing" && interval == "Recently" && (
          <div className="flex flex-row gap-4">
            <p>{formattedTime}</p>
            <p>
              latency: <b>{ping}</b>
            </p>
          </div>
        )}
      </div>
    );
  }
};
