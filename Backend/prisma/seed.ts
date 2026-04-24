// prisma/seed.ts
// Run with: npx prisma db seed

import { PrismaClient, Role, PaymentMethod } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding VBILL database...')

  // 1. Create Business
  const business = await prisma.business.upsert({
    where: { gstin: '29ABCDE1234F1Z5' },
    update: {},
    create: {
      name: 'VBILL Demo Company',
      gstin: '29ABCDE1234F1Z5',
      email: 'demo@vbill.com',
      phone: '+91 9876543210',
      address: '123 MG Road',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001',
      currency: 'INR',
      invoicePrefix: 'INV',
    },
  })

  // 2. Create Admin User
  const passwordHash = await bcrypt.hash('vbill@123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@vbill.com' },
    update: {},
    create: {
      email: 'admin@vbill.com',
      passwordHash,
      fullName: 'Admin User',
      role: Role.ADMIN,
      emailVerified: true,
      businessId: business.id,
    },
  })

  // 3. Create Categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { businessId_name: { businessId: business.id, name: 'Electronics' } },
      update: {},
      create: { businessId: business.id, name: 'Electronics' },
    }),
    prisma.category.upsert({
      where: { businessId_name: { businessId: business.id, name: 'Stationery' } },
      update: {},
      create: { businessId: business.id, name: 'Stationery' },
    }),
  ])

  // 4. Create Products
  await prisma.product.createMany({
    skipDuplicates: true,
    data: [
      {
        businessId: business.id,
        categoryId: categories[0].id,
        name: 'USB-C Hub 7-in-1',
        sku: 'USBHUB001',
        sellingPrice: 1499,
        costPrice: 900,
        taxPercent: 18,
        stockQuantity: 50,
        unit: 'PCS',
      },
      {
        businessId: business.id,
        categoryId: categories[1].id,
        name: 'A4 Paper Ream (500 Sheets)',
        sku: 'PAPER001',
        sellingPrice: 299,
        costPrice: 180,
        taxPercent: 12,
        stockQuantity: 200,
        unit: 'BOX',
      },
    ],
  })

  // 5. Create a Customer
  await prisma.customer.upsert({
    where: { id: 'seed-customer-1' },
    update: {},
    create: {
      id: 'seed-customer-1',
      businessId: business.id,
      name: 'Ravi Shankar',
      email: 'ravi@example.com',
      phone: '+91 9000000001',
      city: 'Chennai',
      state: 'Tamil Nadu',
    },
  })

  console.log('✅ Seed complete!')
  console.log(`   Business : ${business.name}`)
  console.log(`   Admin    : ${admin.email} / vbill@123`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
