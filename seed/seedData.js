/**
 * Seed Data Script
 * Populates the database with sample data
 * Run with: npm run seed
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import prisma, { connectDB, disconnectDB } from '../config/db.js';
import { hashPassword } from '../utils/passwordUtils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('✓ Connected to database');

    await prisma.orderItem.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.productReview.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.user.deleteMany({});
    console.log('✓ Cleared existing data');

    const usersData = [
      { name: 'Super Admin User', email: 'admin@rolex.com', password: 'password123', role: 'SuperAdmin', isActive: true },
      { name: 'Manager User', email: 'manager@rolex.com', password: 'password123', role: 'Manager', isActive: true },
      { name: 'Staff User', email: 'staff@rolex.com', password: 'password123', role: 'Staff', isActive: true },
      { name: 'John Customer', email: 'customer@rolex.com', password: 'password123', role: 'Customer', isActive: true },
      { name: 'Jane Doe', email: 'jane@rolex.com', password: 'password123', role: 'Customer', isActive: true },
    ];

    const hashedUsers = await Promise.all(
      usersData.map(async (user) =>
        prisma.user.create({
          data: {
            name: user.name,
            email: user.email,
            password: await hashPassword(user.password),
            role: user.role,
            isActive: user.isActive,
          },
        })
      )
    );

    console.log(`✓ Seeded ${hashedUsers.length} users`);

    const products = await Promise.all([
      prisma.product.create({
        data: {
          name: 'Submariner Watch',
          description: 'Professional diving watch with water resistance up to 300m',
          category: 'Watches',
          price: 9850,
          stock: 15,
          image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600',
        },
      }),
      prisma.product.create({
        data: {
          name: 'Datejust Watch',
          description: 'Classic automatic watch with date window and elegant design',
          category: 'Watches',
          price: 7250,
          stock: 20,
          image: 'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=600',
        },
      }),
      prisma.product.create({
        data: {
          name: 'Daytona Chronograph',
          description: 'Professional chronograph watch with tachymeter bezel',
          category: 'Watches',
          price: 14550,
          stock: 8,
          image: 'https://images.unsplash.com/photo-1622434641406-a158123450f9?w=600',
        },
      }),
      prisma.product.create({
        data: {
          name: 'Sea-Dweller',
          description: 'Deep diving watch with helium escape valve for saturation diving',
          category: 'Watches',
          price: 12750,
          stock: 5,
          image: 'https://images.unsplash.com/photo-1606390144157-d8417f07bb58?w=600',
        },
      }),
      prisma.product.create({
        data: {
          name: 'GMT-Master II',
          description: 'Dual time zone watch perfect for international travelers',
          category: 'Watches',
          price: 11450,
          stock: 12,
          image: 'https://images.unsplash.com/photo-1611251213699-c0fbd49e4e1d?w=600',
        },
      }),
      prisma.product.create({
        data: {
          name: 'Yacht-Master',
          description: 'Nautical watch with maritime-inspired design and features',
          category: 'Watches',
          price: 6850,
          stock: 25,
          image: 'https://images.unsplash.com/photo-1639006570490-79c0c53f1080?w=600',
        },
      }),
      prisma.product.create({
        data: {
          name: 'Watch Strap - Leather',
          description: 'Premium leather watch strap, compatible with most Rolex models',
          category: 'Accessories',
          price: 450,
          stock: 50,
          image: 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=600',
        },
      }),
      prisma.product.create({
        data: {
          name: 'Watch Box - Luxury',
          description: 'Official Rolex luxury watch box with velvet interior',
          category: 'Accessories',
          price: 350,
          stock: 30,
          image: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=600',
        },
      }),
    ]);

    console.log(`✓ Seeded ${products.length} products`);

    const orders = await Promise.all([
      prisma.order.create({
        data: {
          customerId: hashedUsers[3].id,
          totalAmount: products[0].price + products[6].price * 2,
          status: 'Completed',
          shippingAddress: {
            street: '123 Main St',
            city: 'New York',
            state: 'NY',
            postalCode: '10001',
            country: 'USA',
          },
          items: {
            create: [
              { productId: products[0].id, quantity: 1, price: products[0].price },
              { productId: products[6].id, quantity: 2, price: products[6].price },
            ],
          },
        },
      }),
      prisma.order.create({
        data: {
          customerId: hashedUsers[4].id,
          totalAmount: products[1].price + products[7].price,
          status: 'Processing',
          shippingAddress: {
            street: '456 Oak Ave',
            city: 'Los Angeles',
            state: 'CA',
            postalCode: '90001',
            country: 'USA',
          },
          items: {
            create: [
              { productId: products[1].id, quantity: 1, price: products[1].price },
              { productId: products[7].id, quantity: 1, price: products[7].price },
            ],
          },
        },
      }),
      prisma.order.create({
        data: {
          customerId: hashedUsers[3].id,
          totalAmount: products[2].price,
          status: 'Pending',
          shippingAddress: {
            street: '789 Pine Rd',
            city: 'Chicago',
            state: 'IL',
            postalCode: '60601',
            country: 'USA',
          },
          items: {
            create: [{ productId: products[2].id, quantity: 1, price: products[2].price }],
          },
        },
      }),
    ]);

    console.log(`✓ Seeded ${orders.length} orders`);

    console.log('\n✓ Database seeding completed successfully!');
    console.log('\n--- Test Credentials ---');
    console.log('SuperAdmin:');
    console.log('  Email: admin@rolex.com');
    console.log('  Password: password123');
    console.log('\nManager:');
    console.log('  Email: manager@rolex.com');
    console.log('  Password: password123');
    console.log('\nStaff:');
    console.log('  Email: staff@rolex.com');
    console.log('  Password: password123');
    console.log('\nCustomer:');
    console.log('  Email: customer@rolex.com');
    console.log('  Password: password123');

    await disconnectDB();
    process.exit(0);
  } catch (error) {
    console.error('✗ Error seeding database:', error.message);
    await disconnectDB();
    process.exit(1);
  }
};

seedDatabase();
