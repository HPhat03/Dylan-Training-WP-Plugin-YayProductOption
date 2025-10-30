import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { IErrorDialog } from "@/lib/interface";
import { AlertCircleIcon } from "lucide-react";
import type React from "react";

const ErrorDialog: React.FC<IErrorDialog> = ({ error, messages }) => {
  return error ? (
    <Alert variant="destructive" className="m-2">
      <AlertCircleIcon />
      <AlertTitle>Unable to save your option.</AlertTitle>
      <AlertDescription>
        <p>Please check the error below and try again.</p>
        <ul className="list-inside list-disc text-sm">
          {messages.map((x) => (
            <li>{x}</li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  ) : (
    <></>
  );
};

export default ErrorDialog;
