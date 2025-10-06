import { NextResponse } from "next/server";
export const runtime = "edge";
export function GET(){
  const sha = process.env.VERCEL_GIT_COMMIT_SHA || "local";
  const ref = process.env.VERCEL_GIT_COMMIT_REF || "local";
  const ver = process.env.NEXT_PUBLIC_APP_VERSION || "";
  return NextResponse.json({ ok:true, sha, ref, version: ver }, { status:200 });
}
