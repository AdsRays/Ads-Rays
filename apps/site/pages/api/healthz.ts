import type { NextApiRequest, NextApiResponse } from "next";
export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("content-type", "text/plain; charset=utf-8");
  res.status(200).send("ok");
}
