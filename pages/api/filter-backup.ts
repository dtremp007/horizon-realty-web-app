import { readFileSync, writeFileSync } from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
import { join } from "path";

type Data = {
  [key: string]: any;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const raw = readFileSync(
    join(process.cwd(), "lib", "filters.json"),
    {encoding: "utf-8"}
  );

  const filters = JSON.parse(raw).filters;

  res.status(200).json(filters);
}
