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
      search_and_filter: "/api/countries?search=uz&region=asia",
      single_country: "/api/countries/:code (masalan: /api/countries/uz yoki /api/countries/DEU yoki /api/countries/France)",
    },
  });
});

// Davlatlar ro'yxati, qidiruv va filter
app.get("/api/countries", (req, res) => {
  try {
    const { region, search } = req.query;

    const filteredCountries = countries.filter((country) => {
      // Region tekshiruvi (agar 'all' bo'lsa yoki bo'sh bo'lsa hamma regionlarni oladi)
      const isAllRegion =
        !region || region.trim().toLowerCase() === "all";
      const matchesRegion = isAllRegion
        ? true
        : country.region.toLowerCase() === region.trim().toLowerCase();

      // Qidiruv (davlat nomi, 2 harfli yoki 3 harfli kodi bo'yicha)
      const searchQuery = search ? search.trim().toLowerCase() : "";
      const matchesSearch = searchQuery
        ? country.name.toLowerCase().includes(searchQuery) ||
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

// Bitta davlat ma'lumotini olish (code, alpha3Code yoki name orqali)
app.get("/api/countries/:code", (req, res) => {
  try {
    const inputCode = req.params.code?.trim().toLowerCase();

    const findItem = countries.find(
      (item) =>
        item.code.toLowerCase() === inputCode ||
        item.alpha3Code?.toLowerCase() === inputCode ||
        item.name.toLowerCase() === inputCode
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
