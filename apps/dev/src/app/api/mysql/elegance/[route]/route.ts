import { NextResponse } from "next/server";
import { Routes } from "@singlestore/elegance-sdk/server";
import { eleganceServerClientMySQL } from "@/services/eleganceServerClient";

export async function POST(request: Request, { params }: { params: { route: Routes } }) {
  try {
    const result = await eleganceServerClientMySQL.handleRoute(params.route, await request.json());
    return NextResponse.json(result);
  } catch (error: any) {
    error.status = error.status ?? 500;
    return NextResponse.json(error, { status: error.status });
  }
}
