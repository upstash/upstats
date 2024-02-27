import * as React from "react";

import { cn } from "lib/utils";

const Card = ({
  className,
  ...props
}: React.PropsWithChildren & {
  className?: string;
}) => (
  <div
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className,
    )}
    {...props}
  />
);

const CardHeader = ({
  className,
  ...props
}: React.PropsWithChildren & {
  className?: string;
}) => (
  <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
);

const CardTitle = ({
  className,
  ...props
}: React.PropsWithChildren & {
  className?: string;
}) => (
  <h3
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className,
    )}
    {...props}
  />
);

const CardDescription = ({
  className,
  ...props
}: React.PropsWithChildren & {
  className?: string;
}) => (
  <p className={cn("text-sm text-muted-foreground", className)} {...props} />
);

const CardContent = ({
  className,
  ...props
}: React.PropsWithChildren & {
  className?: string;
}) => <div className={cn("p-6 pt-0", className)} {...props} />;

export { Card, CardHeader, CardTitle, CardDescription, CardContent };
