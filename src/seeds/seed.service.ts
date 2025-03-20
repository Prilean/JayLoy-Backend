import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
  ) {}

  async onApplicationBootstrap() {
    if (process.env.SEED_DATABASE === 'true') {
      await this.seed();
    }
  }

  async seed() {
    console.log('🌱 Starting automatic seeding...');
    
    await this.prisma.$executeRaw`TRUNCATE TABLE "User", "Category", "Currency" RESTART IDENTITY CASCADE`;

    await this.prisma.$executeRaw`
      INSERT INTO public."Currency" (name)
      VALUES ('Dollar');
    `;

    await this.prisma.$executeRaw`
      INSERT INTO public."Category" (id, name, type)
      VALUES (1, 'Food', 'EXPENSE'),
        (2, 'Transport', 'EXPENSE'),
        (3, 'Medicine', 'EXPENSE'),
        (4, 'Groceries', 'EXPENSE'),
        (5, 'Savings', 'EXPENSE'),
        (6, 'Rent', 'EXPENSE'),
        (7, 'Gifts', 'EXPENSE'),
        (8, 'Entertainment', 'EXPENSE'),
        (9, 'Internet', 'EXPENSE'),
        (10, 'Transfer', 'EXPENSE'),
        (11, 'Salary', 'INCOME'),
        (12, 'Freelance', 'INCOME'),
        (13, 'Invest', 'INCOME'),
        (14, 'Recieve', 'INCOME');
    `;

    await this.usersService.createOne({
      email: 'admin@gmail.com',
      password: 'adminpassword',
      gender: 'MALE',
    });

    // First create an account for the user
    await this.prisma.$executeRaw`
      INSERT INTO "Account" (name, balance, "userID", "currencyID")
      VALUES ('Main Account', 0, 1, 1);
    `;

    // Then insert transactions with accountID instead of userId
    await this.prisma.$executeRaw`
      INSERT INTO "Transaction" (amount, type, description, date, "categoryID", "accountID")
      VALUES
        (84321, 'INCOME', 'Freelance payment', '2025-03-22', 13, 1),
        (4567, 'EXPENSE', 'Grocery shopping', '2025-03-22', 3, 1),
        (23489, 'INCOME', 'Investment dividends', '2025-03-22', 12, 1),
        (1999, 'EXPENSE', 'Streaming service', '2025-03-22', 7, 1),
        (150000, 'INCOME', 'Monthly salary', '2025-03-22', 11, 1),
        (6543, 'EXPENSE', 'Fuel payment', '2025-03-22', 5, 1),
        (8950, 'EXPENSE', 'Coffee shop', '2025-03-22', 9, 1),
        (32476, 'INCOME', 'Bonus payment', '2025-03-22', 14, 1),
        (2345, 'EXPENSE', 'Book purchase', '2025-03-22', 2, 1),
        (15678, 'EXPENSE', 'Restaurant dinner', '2025-03-22', 6, 1),
        (49995, 'EXPENSE', 'Electronics repair', '2025-03-22', 4, 1),
        (7890, 'INCOME', 'Stock gains', '2025-03-22', 13, 1),
        (1234, 'EXPENSE', 'Public transport', '2025-03-22', 8, 1),
        (25600, 'INCOME', 'Consulting fee', '2025-03-22', 11, 1),
        (4500, 'EXPENSE', 'Gym membership', '2025-03-22', 10, 1),
        (67823, 'INCOME', 'Rental income', '2025-03-22', 14, 1),
        (3215, 'EXPENSE', 'Pharmacy items', '2025-03-22', 1, 1),
        (14567, 'EXPENSE', 'Home supplies', '2025-03-22', 4, 1),
        (8999, 'INCOME', 'Online sale', '2025-03-22', 12, 1),
        (23045, 'EXPENSE', 'Car maintenance', '2025-03-22', 5, 1),
        (5678, 'INCOME', 'Cashback reward', '2025-03-22', 13, 1),
        (1599, 'EXPENSE', 'Mobile plan', '2025-03-22', 7, 1),
        (43210, 'EXPENSE', 'Furniture purchase', '2025-03-22', 3, 1),
        (76543, 'INCOME', 'Project milestone', '2025-03-22', 11, 1),
        (2995, 'EXPENSE', 'Movie tickets', '2025-03-22', 9, 1),
        (12345, 'INCOME', 'Tax refund', '2025-03-22', 14, 1),
        (8765, 'EXPENSE', 'Clothing purchase', '2025-03-22', 2, 1),
        (34567, 'EXPENSE', 'Home renovation', '2025-03-22', 6, 1),
        (4321, 'INCOME', 'Interest income', '2025-03-22', 12, 1),
        (6500, 'EXPENSE', 'Software license', '2025-03-22', 8, 1),
        (21050, 'INCOME', 'Side hustle', '2025-03-22', 13, 1),
        (1950, 'EXPENSE', 'Fast food', '2025-03-22', 10, 1),
        (450000, 'EXPENSE', 'Insurance payment', '2025-03-22', 4, 1),
        (9530, 'INCOME', 'Gift received', '2025-03-22', 14, 1),
        (7525, 'EXPENSE', 'Pet supplies', '2025-03-22', 1, 1),
        (19999, 'EXPENSE', 'Smartwatch', '2025-03-22', 5, 1),
        (54321, 'INCOME', 'Contract work', '2025-03-22', 11, 1),
        (2375, 'EXPENSE', 'Office supplies', '2025-03-22', 7, 1),
        (8888, 'INCOME', 'Dividend payout', '2025-03-22', 12, 1),
        (15600, 'EXPENSE', 'Hotel booking', '2025-03-22', 9, 1),
        (6789, 'EXPENSE', 'Parking fee', '2025-03-22', 3, 1),
        (23456, 'INCOME', 'Bonus', '2025-03-22', 14, 1),
        (1299, 'EXPENSE', 'Music subscription', '2025-03-22', 8, 1),
        (45678, 'EXPENSE', 'Laptop repair', '2025-03-22', 2, 1),
        (765000, 'INCOME', 'Freelance project', '2025-03-22', 13, 1),
        (3415, 'EXPENSE', 'Laundry service', '2025-03-22', 10, 1),
        (12345, 'INCOME', 'Commission', '2025-03-22', 11, 1);
    `;

    console.log('✅ Automatic seeding completed!');
  }
} 