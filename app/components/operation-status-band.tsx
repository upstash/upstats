"use client";

import React from "react";
import { CheckIcon } from "./icons/check-icon";
import { AlertIcon } from "./icons/alert-icon";

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

export default OperationStatusBand;
