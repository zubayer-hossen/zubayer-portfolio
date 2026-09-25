# সেটআপ গাইড (বাংলায়)

এই প্রজেক্টে আপনাকে কোনো কোড লিখতে হবে না। শুধু প্যাকেজ ইনস্টল করে চালাতে হবে।

## ১. যা লাগবে

1. **Node.js 18 বা তার নতুন ভার্সন** — https://nodejs.org (LTS নিন)
2. **MongoDB ডাটাবেস** — সবচেয়ে সহজ: ফ্রি **MongoDB Atlas** (https://www.mongodb.com/atlas)। চাইলে নিজের কম্পিউটারে MongoDB Community Server-ও চলবে।

টার্মিনালে দেখে নিন: `node -v` (v18+ হতে হবে)।

## ২. MongoDB Atlas (ফ্রি) ঠিক করুন

1. Atlas-এ অ্যাকাউন্ট খুলে একটি **Free (M0) cluster** বানান।
2. **Database Access** → নতুন ইউজার বানান (username + password মনে রাখুন)।
3. **Network Access** → `Add IP Address` → লোকাল টেস্টের জন্য `Allow access from anywhere` দিন।
4. **Connect → Drivers** থেকে connection string কপি করুন। দেখতে এরকম:
   `mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/`
5. শেষে ডাটাবেসের নাম যোগ করুন: `.../zubayer-portfolio`
   (পাসওয়ার্ডে `@ : / #` এর মতো চিহ্ন থাকলে সেগুলো URL-encode করতে হবে, নাহলে সহজ পাসওয়ার্ড দিন।)

## ৩. প্রজেক্ট চালান

Zip ফাইল extract করে ফোল্ডারে টার্মিনাল খুলুন:

```bash
# (ক) সব প্যাকেজ ইনস্টল
npm run setup

# (খ) server/.env ফাইল খুলে এই লাইনগুলো ঠিক করুন
#     MONGO_URI=...  (Atlas এর string)
#     ADMIN_EMAIL=আপনার-ইমেইল@example.com
#     ADMIN_PASSWORD=একটি-শক্ত-পাসওয়ার্ড   (১০+ অক্ষর, বড় হাতের, ছোট হাতের ও সংখ্যা)

# (গ) অ্যাডমিন ইউজার ও শুরুর কনটেন্ট তৈরি (একবারই)
npm run seed

# (ঘ) সাইট চালু
npm run dev
```

- সাইট: http://localhost:5173
- অ্যাডমিন প্যানেল: http://localhost:5173/admin
- API: http://localhost:5000/api/health

## ৪. প্রথম কাজগুলো

সাইটে কিছু **Placeholder (নমুনা)** কনটেন্ট আছে — সেগুলো আপনার আসল কাজ দিয়ে বদলাতে হবে। অ্যাডমিন ড্যাশবোর্ড এ নিয়ে সতর্ক করবে।

1. **Security** → পাসওয়ার্ড বদলান (যদি ডিফল্ট পাসওয়ার্ড রেখে থাকেন)।
2. **Profile / Hero / About** → নিজের তথ্য ও ছবি দিন।
3. **Skills** → লেভেলগুলো সৎভাবে ঠিক করুন; যেগুলো ইন্টারভিউতে বলতে পারবেন না সেগুলো সরিয়ে দিন।
4. **Projects** → ৩টি নমুনা প্রজেক্ট মুছে/এডিট করে আসল প্রজেক্ট দিন (স্ক্রিনশট, Live link, GitHub link)।
5. **Resume** → আপনার PDF আপলোড করুন।
6. **Social links** → GitHub/LinkedIn লিংক দিয়ে চালু (Visible) করুন।

## ৫. সমস্যা হলে

| সমস্যা | সমাধান |
|---|---|
| `Could not connect to MongoDB` | `MONGO_URI` ঠিক আছে কিনা দেখুন; Atlas এ Network Access খোলা আছে কিনা দেখুন |
| সাইটে "Cannot reach the server" | API চালু নেই। `npm run dev` চলছে কিনা দেখুন (টার্মিনালে error থাকতে পারে) |
| `Port 5000 already in use` | `server/.env` এ `PORT=5001` দিন এবং `client/vite.config.js` এ backend ঠিকানা মেলান (অথবা পুরনো প্রসেস বন্ধ করুন) |
| Login হচ্ছে না | `npm run seed` চালানো হয়েছে কিনা দেখুন; `.env` এর ADMIN_EMAIL/PASSWORD ই ব্যবহার করুন। ইমেইল বদলালে নতুন ইউজার তৈরি হয় |
| ছবি আপলোড হচ্ছে কিন্তু deploy এর পর হারিয়ে যায় | Cloudinary কী (`CLOUDINARY_*`) `.env` এ দিন — ডেভেলপমেন্টে ছবি সার্ভারের ডিস্কে থাকে |

## ৬. Deploy (সংক্ষেপে)

বিস্তারিত `README.md` এ আছে।

1. **Database:** MongoDB Atlas
2. **API:** Render বা Railway (root = `server`), env variables বসান (`NODE_ENV=production`, `MONGO_URI`, secrets, `CLIENT_URL`, `SERVER_URL`, Cloudinary)
3. **Site:** Netlify বা Vercel — `netlify.toml` এবং `client/vercel.json` এর `YOUR-BACKEND.onrender.com` অংশ আপনার API ঠিকানা দিয়ে **অবশ্যই** বদলান
4. Production এ `.env` এর secrets নতুন করে বানান এবং ডিফল্ট পাসওয়ার্ড রাখবেন না

> `server/.env` ফাইলে শুধু লোকাল ডেভেলপমেন্টের জন্য তৈরি করা secrets আছে। এই ফাইল GitHub এ পুশ করবেন না (`.gitignore` এ বাদ দেওয়া আছে)।
