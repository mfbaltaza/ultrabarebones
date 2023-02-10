// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { readFileSync, writeFile } from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
// import { Component } from "../../src/types";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const content = JSON.parse(
    readFileSync(`${process.cwd()}/database.json`, "utf8")
  );
  if (req.method === "POST") {
    const component = JSON.parse(req.body)
    content.push(component);
    const newContent = JSON.stringify(content);
    writeFile(`${process.cwd()}/database.json`, newContent, (err) => {
      if (err) throw err;
      res.status(200).json(component);
    });
    // res.status(200).json({success: true});
  } else if (req.method === "GET") {
    res.status(200).json(content);
  } else res.status(404).json({ message: "Not found" });
}
