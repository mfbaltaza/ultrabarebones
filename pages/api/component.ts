// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { readFileSync, writeFile } from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
import { Component } from "../../src/types";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // content is the arr in the database with all the components
  const content = JSON.parse(
    readFileSync(`${process.cwd()}/database.json`, "utf8")
  );

  if (req.method === "GET") {
    res.status(200).json(content);
  }

  // component is a component we'd like to add / update
  const component = JSON.parse(req.body);

  if (req.method === "POST") {
    content.push(component);
    writeFile(`${process.cwd()}/database.json`, JSON.stringify(content), (err) => {
      if (err) throw err;
      res.status(200).json(component);
    });
  }
  if (req.method === "PUT") {
    const foundComponent = content.find(
      (c: Component) => c.id === component.id
    );
    // Currently we only support image and text components, so for updating
    // If the component finds an image src, changes that property otherwise it changes text
    component.src
      ? (foundComponent.src = component.src)
      : (foundComponent.text = component.text);
    writeFile(`${process.cwd()}/database.json`, JSON.stringify(content), (err) => {
      if (err) console.error(err);
    });
    res.status(200).json(component);
  }
  res.status(404).json({ message: "Not found" });
}
