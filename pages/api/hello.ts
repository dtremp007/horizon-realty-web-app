// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { readFileSync, writeFileSync } from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
import { join } from "path";

type Data = {
  name: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  writeFileSync(
    join(process.cwd(), "lib", "sample.json"),
    JSON.stringify(req.body)
  );
  res.status(200).json({ name: "John Doe" });
}
