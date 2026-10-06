import { NextResponse } from "next/server";
import type { HomePage } from '@/src/types/home-page';

export async function GET() {
  const data: HomePage[] = [
    {
      id: 1,
      week: 39,
      title: "Hoạt động trồng cây tuần 39",
      totalChildren: 42,
    },
    {
      id: 2,
      week: 38,
      title: "Kỹ năng an toàn giao thông",
      totalChildren: 38,
    },
  ];

  return NextResponse.json(data);
}
