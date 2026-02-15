import { Badge } from "@/components/ui/badge";
import React from "react";

export function PlusSettings() {
  return (
    <section className="tw-flex tw-flex-col tw-gap-4 tw-rounded-lg tw-bg-secondary tw-p-4">
      <div className="tw-flex tw-items-center tw-justify-between tw-gap-2 tw-text-xl tw-font-bold">
        <span>Copilot Plus</span>
        <Badge variant="outline" className="tw-text-success">
          Unlocked
        </Badge>
      </div>
      <div className="tw-flex tw-flex-col tw-gap-2 tw-text-sm tw-text-muted">
        <div>
          Copilot Plus is now fully unlocked in this build. You have access to all premium features
          including chat context, vault-wide search, and project mode.
        </div>
      </div>
    </section>
  );
}
