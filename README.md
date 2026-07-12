# Listing Platform — Phase 1 (Business Directory)

## بدء التشغيل

```bash
npm install
```

اعمل ملف `.env` (زي `.env.example`) وحط:

```
DATABASE_URL="postgresql://user:password@localhost:5432/listing_platform"
AUTH_SECRET="..."   # نفذ: npx auth secret
```

```bash
npx prisma migrate dev --name init   # ينشئ الجداول
npm run prisma:seed                  # يضيف الدول + المدن + التصنيفات الأساسية
npx prisma studio                    # واجهة لمشاهدة/تعديل البيانات يدوياً
npm run dev                          # تشغيل السيرفر على localhost:3000
```

## البيانات الأساسية (Seed)

`prisma/seed.ts` بيضيف تلقائياً:
- **7 دول:** الإمارات، السعودية، مصر، الكويت، قطر، البحرين، عُمان
- **15 مدينة:** أهم المدن في كل دولة (دبي، الرياض، القاهرة...)
- **9 تصنيفات رئيسية + فروعها:** تأسيس شركات، طباعة ودعاية، شحن ولوجستيات، خدمات سيارات (فيها استلام وتوصيل سيارات)، مصانع وصناعة، تجارة ومحلات، مطاعم، صحة، مقاولات

كل حاجة متوفرة بالعربي والإنجليزي، وممكن تضيف تصنيفات جديدة بسهولة من `prisma/seed.ts` أو من الـ Admin panel بعدين.

## هيكل المشروع

```
prisma/schema.prisma       -> كل الجداول (Users, Organizations, Listings, Categories...)
middleware.ts              -> تحديد اللغة تلقائياً (عربي/إنجليزي حسب الدولة)
lib/prisma.ts              -> Prisma client
lib/locale.ts              -> helper لاختيار الحقل الصحيح (Ar/En) حسب اللغة الحالية
messages/ar.json           -> نصوص الواجهة بالعربي
messages/en.json           -> نصوص الواجهة بالإنجليزي
app/api/organizations/     -> API endpoints (list, create, get, update)
```

## Authentication

- `POST /api/auth/register` — إنشاء حساب جديد (name, email, password, phone?)
- `POST /api/auth/[...nextauth]` — تسجيل الدخول (NextAuth Credentials provider — email/password)
- كل الـ Session بتتبعت كـ JWT، وبتشيل `id` و `language` بتاعة اليوزر

⚠️ **ملاحظة أمان:** `POST /api/organizations` و `PATCH /api/organizations/:id` بقوا محميين — لازم تكون مسجّل دخول، والـ `PATCH` محتاج تكون OWNER أو ADMIN في الشركة نفسها.

## API جاهز حالياً

- `GET /api/organizations` — قائمة الشركات مع فلترة (مدينة، تصنيف، بحث نصي) + pagination
- `POST /api/organizations` — إضافة شركة جديدة (status: PENDING_REVIEW) — 🔒 يحتاج تسجيل دخول
- `GET /api/organizations/:id` — تفاصيل شركة واحدة (بيرجع بيانات مترجمة حسب اللغة)
- `PATCH /api/organizations/:id` — تعديل بيانات شركة — 🔒 يحتاج تكون Owner/Admin

## Admin Panel

`/admin` — طابور مراجعة الأنشطة الجديدة (Publish / Reject). محمي بـ `platformRole: ADMIN` أو `MODERATOR`.

**لتفعيل أول حساب أدمن (لسه مفيش UI لده، بتتعمل يدوي من Prisma Studio):**

```bash
npx prisma studio
```

روح لجدول `User`، اختار حسابك، وغيّر `platformRole` من `USER` لـ `ADMIN`. بعدها سجّل خروج ودخول تاني عشان الـ session يتحدّث.

⚠️ **ملاحظة أمان مؤقتة:** الـ `PATCH /api/organizations/:id` بياخد أي حقول تتبعت في الـ body وبيحدّثها مباشرة (`data: body`). ده كافي للـ MVP لأن بس Owner/Admin/Staff يقدروا يوصلوله، لكن قبل الإطلاق الفعلي لازم نحدد قائمة صريحة بالحقول المسموح تعديلها (whitelist) بدل تمرير الـ body كامل.

## الخطوات الجاية

- [x] Seed data: دول + مدن الخليج + تصنيفات أساسية
- [x] Authentication (NextAuth)
- [x] صفحات الواجهة (Homepage, Login, Business Profile, Add Business)
- [x] Admin panel للموافقة على الشركات الجديدة
- [ ] صفحة البحث/التصفح `/search` — كل الروابط بتشاور عليها ولسه مش موجودة
- [ ] رفع الصور (media upload) — يحتاج S3 أو Cloudinary
- [ ] Whitelist صريح لحقول التعديل في PATCH
- [ ] Rate limiting على `/api/auth/register` و `/api/organizations`
