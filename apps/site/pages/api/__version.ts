import type { NextApiRequest, NextApiResponse } from "next";
export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  const sha = process.env.VERCEL_GIT_COMMIT_SHA || "local";
  const ref = process.env.VERCEL_GIT_COMMIT_REF || "local";
  const ver = process.env.NEXT_PUBLIC_APP_VERSION || "";
  res.status(200).json({ ok: true, sha, ref, version: ver, ts: new Date().toISOString() });
}
