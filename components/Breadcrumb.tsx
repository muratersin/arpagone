"use client";

import { Breadcrumb } from "antd";
import { usePathname } from "next/navigation";

export default function AppBreadcrump() {
  const pathName = usePathname();
  const splitPath = pathName?.split("/") || [];
  const key = decodeURIComponent(splitPath[4] || "");
  const bucket = decodeURIComponent(splitPath[2] || "");
  const items: { title: string }[] = [];
  if (bucket) {
    items.push({
      title: bucket,
    });
  }
  if (key) {
    items.push({
      title: key,
    });
  }

  return (
    <Breadcrumb
      style={{ marginLeft: "16px", marginTop: "16px" }}
      items={items}
    />
  );
}
