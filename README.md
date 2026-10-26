# 🌍 REST Countries API — O‘quvchilar uchun qo‘llanma

Ushbu API frontend darslarida **"Where in the world? (REST Countries)"** loyihasini yaratish uchun maxsus tayyorlangan. API orqali dunyoning 40 ta davlati haqida to‘liq ma’lumotlarni olish, qidirish va hududlar bo‘yicha filtrlash mumkin.

---

## 📌 Asosiy ma’lumotlar (Base URL)

> **Base URL:** `https://countries-api-iota-six.vercel.app` *(yoki ustozingiz taqdim etgan Vercel linki)*  
> **Lokal test uchun:** `http://localhost:3000`

---

## 🚀 API Endpointlar

| № | Vazifasi | Method | Endpoint | Misol |
|---|---|:---:|---|---|
| **1** | Barcha davlatlar ro‘yxati | `GET` | `/api/countries` | `/api/countries` |
| **2** | Nomi bo‘yicha qidirish (Query) | `GET` | `/api/countries?name={nomi}` yoki `?search={nomi}` | `/api/countries?name=germany` |
| **3** | Nomi bo‘yicha qidirish (Path) | `GET` | `/api/countries/name/{nomi}` | `/api/countries/name/uzbekistan` |
| **4** | Hudud (qit’a) bo‘yicha filtrlash | `GET` | `/api/countries?region={region}` | `/api/countries?region=europe` |
| **5** | Qidiruv va Filterni birgalikda | `GET` | `/api/countries?region={region}&name={nomi}` | `/api/countries?region=asia&name=uz` |
| **6** | Bitta davlat kodi bo‘yicha (Detail) | `GET` | `/api/countries/:code` | `/api/countries/uz` yoki `/api/countries/DEU` |

---

## 📖 Endpointlar tafsiloti va parametrlar

### 1. Barcha davlatlarni olish
Bosh sahifada kartochkalarni chizish uchun ishlatiladi.
- **URL:** `/api/countries`
- **Method:** `GET`
- **Javob formati:**
```json
{
  "success": true,
  "count": 40,
  "data": [
    {
      "code": "UZ",
      "alpha3Code": "UZB",
      "name": "Uzbekistan",
      "nativeName": "Oʻzbekiston",
      "flag": "https://flagcdn.com/w320/uz.png",
      "capital": "Tashkent",
      "region": "Asia",
      "subregion": "Central Asia",
      "population": 34232050,
      "area": 448978,
      "languages": ["Uzbek"],
      "currencies": [
        {
          "code": "UZS",
          "name": "Uzbekistani soʻm",
          "symbol": "soʻm"
        }
      ],
      "timezones": ["UTC+05:00"],
      "borders": ["AFG", "KAZ", "KGZ", "TJK", "TKM"]
    }
  ]
}
```

---

### 2. Qidiruv (Search)
- **URL:** `/api/countries?search={qiymat}`
- **Imkoniyatlari:** Katta-kichik harf farq qilmaydi (`Uz`, `UZ`, `uz`). Davlat nomi, 2 harfli yoki 3 harfli kodi bo‘yicha qidiradi.
- **Misol:**
  - `/api/countries?search=germany`
  - `/api/countries?search=jp`

---

### 3. Hudud bo‘yicha filtrlash (Filter by Region)
- **URL:** `/api/countries?region={region}`
- **Qabul qilinadigan qiymatlar:**
  - `Africa`
  - `Americas`
  - `Asia`
  - `Europe`
  - `Oceania`
  - `all` (Barchasini ko‘rsatish)
- **Misol:**
  - `/api/countries?region=asia`

---

### 4. Bitta davlat tafsilotlari (Detail sahifa)
Davlat kartochkasi yoki chegara (border) tugmasi bosilganda to‘liq ma’lumotni ochish uchun.
- **URL:** `/api/countries/:code`
- **Parametr turlari:**
  - 2 harfli kod: `/api/countries/uz`, `/api/countries/fr`
  - 3 harfli chegara kodi: `/api/countries/uzb`, `/api/countries/fra`
  - Davlat nomi: `/api/countries/uzbekistan`
- **Topilmagandagi javob (`404`):**
```json
{
  "success": false,
  "message": "Bunday ma'lumot topilmadi"
}
```

---

## 💻 Frontendda ishlatish (JavaScript namunalari)

### `fetch` orqali:
```javascript
const BASE_URL = "https://<sizning-api-link>.vercel.app";

// 1. Davlatlar ro'yxatini yuklash
async function getCountries(region = "", search = "") {
  try {
    const params = new URLSearchParams();
    if (region && region !== "all") params.append("region", region);
    if (search) params.append("search", search);

    const res = await fetch(`${BASE_URL}/api/countries?${params.toString()}`);
    const result = await res.json();
    return result.data; // Davlatlar massivi
  } catch (error) {
    console.error("Ma'lumot olishda xatolik:", error);
  }
}

// 2. Bitta davlat ma'lumotini olish
async function getCountryDetail(code) {
  try {
    const res = await fetch(`${BASE_URL}/api/countries/${code}`);
    const result = await res.json();
    return result.data;
  } catch (error) {
    console.error("Davlatni yuklashda xatolik:", error);
  }
}
```

---

## 🎯 O‘quvchi uchun amaliy vazifa talablari

### 🔹 Asosiy talablar (MVP):
1. **Bosh sahifa (Home):**
   - API'dan barcha davlatlarni yuklab, Grid ko‘rinishida kartochka qilib chiqarish.
   - Har bir kartochkada: Bayroq (`flag`), Davlat nomi (`name`), Aholisi (`population`), Hududi (`region`), Poytaxti (`capital`) aks etsin.
2. **Qidiruv (Search Input):**
   - Foydalanuvchi inputga yozganda real vaqtda mos davlatlar chiqsin.
3. **Filter (Select / Dropdown):**
   - Hudud (Region) tanlanganda faqat o‘sha qit’adagi davlatlar filtrlanib ko‘rinsin.
4. **Batafsil sahifa (Detail Page / Modal):**
   - Kartochka bosilganda o‘sha davlat haqida to‘liq ma’lumotlar (valyutasi, tillari, vaqt mintaqasi, maydoni va h.k.) chiqsin.
   - Chegara davlatlar (`borders`) alohida tugma bo‘lib ko‘rinsin va tugma bosilganda o‘sha chegara davlatiga o‘tsin.

### 🌟 Qo‘shimcha bonus talablar:
- **Dark / Light mode:** Saytda qorong‘u va yorug‘ rejim tugmasi bo‘lsin.
- **Skeleton / Loader:** Ma’lumot yuklanayotganda chiroyli animatsion loader ko‘rinsin.
- **Topilmadi (Not found):** Agar qidiruv bo‘yicha davlat topilmasa, chiroyli ogohlantirish xabari chiqsin.
- **Responsive dizayn:** Mobil, planshet va kompyuter ekranlariga to‘liq moslashsin.
