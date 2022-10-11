// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { readFileSync } from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
import { Component } from "../../src/types";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const content = JSON.parse(
      readFileSync(`${process.cwd()}/database.json`, "utf8")
    );
    res.status(200).json(content);
  } else {
    res.status(404).json({ message: "Not found" });
  }
}
