import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

import fs from "fs/promises";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const countriesPath = path.join(__dirname, "data", "countries.json");

const PORT = 3000;
const app = express();

const readFile = async () => {
  try {
    const data = await fs.readFile(countriesPath, "utf-8");

    return JSON.parse(data);
  } catch (error) {
    console.error("JSON faylni o‘qishda xato:", error);
    throw error;
  }
};

const writeFile = async (data) => {
  await fs.writeFile(
    "./data/notes.json",
    JSON.stringify(data, null, 2),
    "utf-8",
  );
};

// app.get("/api/countries", async (req, res) => {
//   const countries = await readFile();

//   res.status(200).json({
//     success: true,
//     count: countries.length,
//     data: countries,
//   });
// });

app.get("/api/countries/:code", async (req, res) => {
  const countryCode = req.params.code;
  const countries = await readFile();

  let findItem = countries.find((item) => item.code === countryCode);

  if (!findItem) {
    return res.status(404).json({
      success: false,
      message: "Bunday malumot topilmadi",
    });
  }

  res.status(200).json({
    success: true,
    data: findItem,
  });
});

// qidiruv va filter

app.get("/api/countries", async (req, res) => {
  const countries = await readFile();
  const { region } = req.query;

  if (!region) {
    return res.status(200).json({
      success: true,
      count: countries.length,
      data: countries,
    });
  }

  const filteredCountries = region
    ? countries.filter(
        (country) => country.region.toLowerCase() === region.toLowerCase(),
      )
    : countries;

  res.status(200).json({
    success: true,
    count: filteredCountries.length,
    data: filteredCountries,
  });
});

app.listen(PORT, () => {
  console.log(`Server ishlamoqda: http://localhost:${PORT}`);
});
