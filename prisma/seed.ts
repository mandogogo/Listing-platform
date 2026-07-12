import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // ============================================
  // Countries (GCC + Egypt as MENA anchor)
  // ============================================
  const countries = [
    { code: "AE", nameAr: "الإمارات العربية المتحدة", nameEn: "United Arab Emirates" },
    { code: "SA", nameAr: "المملكة العربية السعودية", nameEn: "Saudi Arabia" },
    { code: "EG", nameAr: "مصر", nameEn: "Egypt" },
    { code: "KW", nameAr: "الكويت", nameEn: "Kuwait" },
    { code: "QA", nameAr: "قطر", nameEn: "Qatar" },
    { code: "BH", nameAr: "البحرين", nameEn: "Bahrain" },
    { code: "OM", nameAr: "عُمان", nameEn: "Oman" },
  ];

  const countryRecords: Record<string, { id: string }> = {};
  for (const c of countries) {
    const record = await prisma.country.upsert({
      where: { code: c.code },
      update: {},
      create: c,
    });
    countryRecords[c.code] = record;
  }
  console.log(`✓ ${countries.length} countries seeded`);

  // ============================================
  // Cities (major cities per country)
  // ============================================
  const cities = [
    // UAE
    { countryCode: "AE", nameAr: "دبي", nameEn: "Dubai", slug: "dubai" },
    { countryCode: "AE", nameAr: "أبوظبي", nameEn: "Abu Dhabi", slug: "abu-dhabi" },
    { countryCode: "AE", nameAr: "الشارقة", nameEn: "Sharjah", slug: "sharjah" },
    { countryCode: "AE", nameAr: "عجمان", nameEn: "Ajman", slug: "ajman" },
    // Saudi
    { countryCode: "SA", nameAr: "الرياض", nameEn: "Riyadh", slug: "riyadh" },
    { countryCode: "SA", nameAr: "جدة", nameEn: "Jeddah", slug: "jeddah" },
    { countryCode: "SA", nameAr: "الدمام", nameEn: "Dammam", slug: "dammam" },
    { countryCode: "SA", nameAr: "مكة المكرمة", nameEn: "Makkah", slug: "makkah" },
    // Egypt
    { countryCode: "EG", nameAr: "القاهرة", nameEn: "Cairo", slug: "cairo" },
    { countryCode: "EG", nameAr: "الإسكندرية", nameEn: "Alexandria", slug: "alexandria" },
    { countryCode: "EG", nameAr: "الجيزة", nameEn: "Giza", slug: "giza" },
    // Kuwait
    { countryCode: "KW", nameAr: "مدينة الكويت", nameEn: "Kuwait City", slug: "kuwait-city" },
    // Qatar
    { countryCode: "QA", nameAr: "الدوحة", nameEn: "Doha", slug: "doha" },
    // Bahrain
    { countryCode: "BH", nameAr: "المنامة", nameEn: "Manama", slug: "manama" },
    // Oman
    { countryCode: "OM", nameAr: "مسقط", nameEn: "Muscat", slug: "muscat" },
  ];

  for (const city of cities) {
    await prisma.city.upsert({
      where: { slug: city.slug },
      update: {},
      create: {
        nameAr: city.nameAr,
        nameEn: city.nameEn,
        slug: city.slug,
        countryId: countryRecords[city.countryCode].id,
      },
    });
  }
  console.log(`✓ ${cities.length} cities seeded`);

  // ============================================
  // Categories (Phase 1: Business categories only)
  // Structure: parent -> children, matches the brief
  // (companies, factories, shops, printing, shipping, car pickup, business setup...)
  // ============================================
  const categoryTree: {
    nameAr: string;
    nameEn: string;
    slug: string;
    children?: { nameAr: string; nameEn: string; slug: string }[];
  }[] = [
    {
      nameAr: "تأسيس الشركات",
      nameEn: "Business Setup",
      slug: "business-setup",
      children: [
        { nameAr: "تأسيس شركات تجارية", nameEn: "Company Formation", slug: "company-formation" },
        { nameAr: "تراخيص وتصاريح", nameEn: "Licensing & Permits", slug: "licensing-permits" },
        { nameAr: "خدمات مناطق حرة", nameEn: "Free Zone Services", slug: "free-zone-services" },
        { nameAr: "استشارات قانونية للشركات", nameEn: "Corporate Legal Consulting", slug: "corporate-legal" },
      ],
    },
    {
      nameAr: "الطباعة والدعاية",
      nameEn: "Printing & Advertising",
      slug: "printing-advertising",
      children: [
        { nameAr: "طباعة تجارية", nameEn: "Commercial Printing", slug: "commercial-printing" },
        { nameAr: "لافتات ولوحات إعلانية", nameEn: "Signage & Billboards", slug: "signage-billboards" },
        { nameAr: "طباعة تغليف", nameEn: "Packaging Printing", slug: "packaging-printing" },
        { nameAr: "هدايا دعائية", nameEn: "Promotional Items", slug: "promotional-items" },
      ],
    },
    {
      nameAr: "الشحن والخدمات اللوجستية",
      nameEn: "Shipping & Logistics",
      slug: "shipping-logistics",
      children: [
        { nameAr: "شحن دولي", nameEn: "International Shipping", slug: "international-shipping" },
        { nameAr: "شحن محلي", nameEn: "Local Delivery", slug: "local-delivery" },
        { nameAr: "تخليص جمركي", nameEn: "Customs Clearance", slug: "customs-clearance" },
        { nameAr: "تخزين ومستودعات", nameEn: "Warehousing & Storage", slug: "warehousing-storage" },
      ],
    },
    {
      nameAr: "خدمات السيارات",
      nameEn: "Car Services",
      slug: "car-services",
      children: [
        { nameAr: "استلام وتوصيل السيارات", nameEn: "Car Pickup & Delivery", slug: "car-pickup-delivery" },
        { nameAr: "صيانة وميكانيكا", nameEn: "Maintenance & Repair", slug: "car-maintenance" },
        { nameAr: "غسيل وتلميع", nameEn: "Car Wash & Detailing", slug: "car-wash-detailing" },
        { nameAr: "تأجير سيارات", nameEn: "Car Rental", slug: "car-rental" },
      ],
    },
    {
      nameAr: "المصانع والصناعة",
      nameEn: "Factories & Manufacturing",
      slug: "factories-manufacturing",
      children: [
        { nameAr: "الصناعات الغذائية", nameEn: "Food Manufacturing", slug: "food-manufacturing" },
        { nameAr: "الصناعات النسيجية", nameEn: "Textile Manufacturing", slug: "textile-manufacturing" },
        { nameAr: "البلاستيك والتغليف", nameEn: "Plastics & Packaging", slug: "plastics-packaging" },
        { nameAr: "مواد بناء", nameEn: "Construction Materials", slug: "construction-materials" },
      ],
    },
    {
      nameAr: "التجارة والمحلات",
      nameEn: "Retail & Shops",
      slug: "retail-shops",
      children: [
        { nameAr: "ملابس وأزياء", nameEn: "Clothing & Fashion", slug: "clothing-fashion" },
        { nameAr: "إلكترونيات", nameEn: "Electronics", slug: "electronics" },
        { nameAr: "مواد غذائية", nameEn: "Groceries", slug: "groceries" },
        { nameAr: "أثاث ومفروشات", nameEn: "Furniture & Home", slug: "furniture-home" },
      ],
    },
    {
      nameAr: "المطاعم والمقاهي",
      nameEn: "Restaurants & Cafes",
      slug: "restaurants-cafes",
    },
    {
      nameAr: "الصحة والعيادات",
      nameEn: "Health & Clinics",
      slug: "health-clinics",
    },
    {
      nameAr: "المقاولات والبناء",
      nameEn: "Contracting & Construction",
      slug: "contracting-construction",
    },
  ];

  let categoryCount = 0;
  for (const parent of categoryTree) {
    const parentRecord = await prisma.category.upsert({
      where: { slug: parent.slug },
      update: {},
      create: {
        nameAr: parent.nameAr,
        nameEn: parent.nameEn,
        slug: parent.slug,
        categoryType: "BUSINESS",
      },
    });
    categoryCount++;

    if (parent.children) {
      for (const child of parent.children) {
        await prisma.category.upsert({
          where: { slug: child.slug },
          update: {},
          create: {
            nameAr: child.nameAr,
            nameEn: child.nameEn,
            slug: child.slug,
            categoryType: "BUSINESS",
            parentId: parentRecord.id,
          },
        });
        categoryCount++;
      }
    }
  }
  console.log(`✓ ${categoryCount} categories seeded`);

  console.log("\n✅ Seed completed successfully");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
