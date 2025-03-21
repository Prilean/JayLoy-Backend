import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { AccountsService } from 'src/accounts/accounts.service';
import { CreateTransactionDto } from 'src/transactions/dto/create-transaction.dto';
import { TypeEnum } from 'src/config/contants';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private accountService: AccountsService,
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

    const  user = await  this.usersService.createOne({
      username: "admin",
      email: 'admin@gmail.com',
      password: 'adminpassword',
      gender: 'MALE',
    });
    
    await this.prisma.$executeRaw`
      INSERT INTO "Transaction" (amount, type, description, date, "categoryID", "accountID")
      VALUES
        (84321, 'INCOME', 'Freelance payment', '2025-03-21', 13, 1),
        (4567, 'EXPENSE', 'Grocery shopping', '2025-03-21', 3, 1),
        (23489, 'INCOME', 'Investment dividends', '2025-03-21', 12, 1),
        (1999, 'EXPENSE', 'Streaming service', '2025-03-21', 7, 1),
        (150000, 'INCOME', 'Monthly salary', '2025-03-21', 11, 1),
        (6543, 'EXPENSE', 'Fuel payment', '2025-03-21', 5, 1),
        (8950, 'EXPENSE', 'Coffee shop', '2025-03-21', 9, 1),
        (32476, 'INCOME', 'Bonus payment', '2025-03-21', 14, 1),
        (2345, 'EXPENSE', 'Book purchase', '2025-03-21', 2, 1),
        (15678, 'EXPENSE', 'Restaurant dinner', '2025-03-21', 6, 1),
        (49995, 'EXPENSE', 'Electronics repair', '2025-03-20', 4, 1),
        (7890, 'INCOME', 'Stock gains', '2025-03-20', 13, 1),
        (1234, 'EXPENSE', 'Public transport', '2025-03-20', 8, 1),
        (25600, 'INCOME', 'Consulting fee', '2025-03-20', 11, 1),
        (4500, 'EXPENSE', 'Gym membership', '2025-03-20', 10, 1),
        (67823, 'INCOME', 'Rental income', '2025-03-20', 14, 1),
        (3215, 'EXPENSE', 'Pharmacy items', '2025-03-20', 1, 1),
        (14567, 'EXPENSE', 'Home supplies', '2025-03-20', 4, 1),
        (8999, 'INCOME', 'Online sale', '2025-03-20', 12, 1),
        (23045, 'EXPENSE', 'Car maintenance', '2025-03-20', 5, 1),
        (5678, 'INCOME', 'Cashback reward', '2025-03-20', 13, 1),
        (1599, 'EXPENSE', 'Mobile plan', '2025-03-19', 7, 1),
        (43210, 'EXPENSE', 'Furniture purchase', '2025-03-19', 3, 1),
        (76543, 'INCOME', 'Project milestone', '2025-03-19', 11, 1),
        (2995, 'EXPENSE', 'Movie tickets', '2025-03-19', 9, 1),
        (12345, 'INCOME', 'Tax refund', '2025-03-19', 14, 1),
        (8765, 'EXPENSE', 'Clothing purchase', '2025-03-19', 2, 1),
        (34567, 'EXPENSE', 'Home renovation', '2025-03-19', 6, 1),
        (4321, 'INCOME', 'Interest income', '2025-03-19', 12, 1),
        (6500, 'EXPENSE', 'Software license', '2025-03-19', 8, 1),
        (21050, 'INCOME', 'Side hustle', '2025-03-19', 13, 1);
    `;
    await this.accountService.verifyBalance(user.id);
    console.log('✅ Automatic seeding completed!');
  }
} 