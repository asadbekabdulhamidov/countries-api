import { json } from "body-parser";
import express from "express";

import fs from "fs/promises";

const PORT = 3000;
const app = express();

const readFile = async () => {
  try {
    const data = await fs.readFile("./data/countries.json", "utf-8");

    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const writeFile = async (data) => {
  await fs.writeFile(
    "./data/notes.json",
    JSON.stringify(data, null, 2),
    "utf-8",
  );
};

app.get("/api/countries", async (req, res) => {
  const countries = await readFile();

  res.status(200).json({
    success: true,
    count: countries.length,
    data: countries,
  });
});

app.listen(PORT, () => {
  console.log(`Server ishlamoqda: http://localhost:${PORT}`);
});
