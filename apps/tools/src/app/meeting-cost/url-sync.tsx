"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

interface MeetingCostUrlSyncProps {
  attendees: number;
  salary: number;
}

export function MeetingCostUrlSync({ attendees, salary }: MeetingCostUrlSyncProps) {
  const router = useRouter();
  const pathname = usePathname();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _searchParams = useSearchParams(); // required to be inside Suspense boundary

  useEffect(() => {
    const params = new URLSearchParams();
    if (attendees !== 6) params.set("attendees", String(attendees));
    if (salary !== 100000) params.set("salary", String(salary));
    const qs = params.toString();
    router.replace(`${pathname}${qs ? "?" + qs : ""}`, { scroll: false });
  }, [attendees, salary, router, pathname]);

  return null;
}
