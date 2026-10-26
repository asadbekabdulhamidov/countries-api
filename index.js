import express from "express";
import cors from "cors";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const countries = require("./data/countries.json");

const PORT = process.env.PORT || 3000;
const app = express();

// CORS - barcha portlardan so'rov yuborishga ruxsat berish
app.use(cors());
app.use(express.json());

// Bosh sahifa - API holati va yo'riqnoma
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Countries API muvaffaqiyatli ishlamoqda! 🚀",
    endpoints: {
      all_countries: "/api/countries",
      search_by_name: "/api/countries?name=germany yoki /api/countries?search=germany",
      rest_countries_style_name: "/api/countries/name/:name (masalan: /api/countries/name/uzbekistan)",
      filter_by_region: "/api/countries?region=asia",
      search_and_filter: "/api/countries?name=uz&region=asia",
      single_country_by_code: "/api/countries/:code (masalan: /api/countries/uz yoki /api/countries/DEU)",
    },
  });
});

// Davlatlar ro'yxati, qidiruv (?name= yoki ?search= yoki ?q=) va filter (?region=)
app.get("/api/countries", (req, res) => {
  try {
    const { region, search, name, q } = req.query;

    // ?name=, ?search= yoki ?q= qaysi biri kelsa ham qidiradi
    const searchQuery = (search || name || q || "").trim().toLowerCase();

    const filteredCountries = countries.filter((country) => {
      // Region tekshiruvi (agar 'all' bo'lsa yoki bo'sh bo'lsa hamma regionlarni oladi)
      const isAllRegion =
        !region || region.trim().toLowerCase() === "all";
      const matchesRegion = isAllRegion
        ? true
        : country.region.toLowerCase() === region.trim().toLowerCase();

      // Qidiruv (nomi, ona tili nomi, 2 harfli yoki 3 harfli kodi bo'yicha)
      const matchesSearch = searchQuery
        ? country.name.toLowerCase().includes(searchQuery) ||
          country.nativeName?.toLowerCase().includes(searchQuery) ||
          country.code.toLowerCase() === searchQuery ||
          country.alpha3Code?.toLowerCase() === searchQuery
        : true;

      return matchesRegion && matchesSearch;
    });

    return res.status(200).json({
      success: true,
      count: filteredCountries.length,
      data: filteredCountries,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Serverda xatolik yuz berdi",
    });
  }
});

// REST Countries uslubidagi to'g'ridan-to'g'ri nom bo'yicha endpoint: /api/countries/name/:name
app.get("/api/countries/name/:name", (req, res) => {
  try {
    const queryName = req.params.name?.trim().toLowerCase();

    const matchedCountries = countries.filter(
      (c) =>
        c.name.toLowerCase().includes(queryName) ||
        c.nativeName?.toLowerCase().includes(queryName)
    );

    if (matchedCountries.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Bunday nomli davlat topilmadi",
      });
    }

    return res.status(200).json({
      success: true,
      count: matchedCountries.length,
      data: matchedCountries,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Serverda xatolik yuz berdi",
    });
  }
});

// Bitta davlat ma'lumotini olish (code, alpha3Code yoki to'liq name orqali)
app.get("/api/countries/:code", (req, res) => {
  try {
    const inputCode = req.params.code?.trim().toLowerCase();

    const findItem = countries.find(
      (item) =>
        item.code.toLowerCase() === inputCode ||
        item.alpha3Code?.toLowerCase() === inputCode ||
        item.name.toLowerCase() === inputCode ||
        item.nativeName?.toLowerCase() === inputCode
    );

    if (!findItem) {
      return res.status(404).json({
        success: false,
        message: "Bunday ma'lumot topilmadi",
      });
    }

    return res.status(200).json({
      success: true,
      data: findItem,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Serverda xatolik yuz berdi",
    });
  }
});

// Lokal kompyuterda ishga tushirish uchun port tinglash
if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server ishlamoqda: http://localhost:${PORT}`);
  });
}

// Vercel serverless uchun eksport
export default app;
