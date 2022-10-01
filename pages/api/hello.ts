// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { writeFileSync } from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
import { join } from "path";

type Data = {
  name: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  console.log(req.body.sex);
  res.status(200).json({ name: "John Doe" });
}
