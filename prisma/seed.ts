import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing
  await prisma.evaluationCriterion.deleteMany();
  await prisma.evaluation.deleteMany();
  await prisma.attempt.deleteMany();
  await prisma.problem.deleteMany();
  await prisma.user.deleteMany();

  await prisma.user.create({
    data: {
      name: 'Demo User',
      email: 'demo@designlab.ai',
    },
  });

  const problems = [
    {
      title: 'Parking Lot',
      slug: 'parking-lot',
      description: 'Design a parking lot system that can hold motorcycles, cars, and buses.',
      difficulty: 'Medium',
      requirements: [
        'Multiple floors',
        'Different vehicle types (Motorcycle, Car, Bus)',
        'Payment processing based on time',
        'Find nearest available spot'
      ],
      constraints: [
        'A bus can take 5 car spots',
        'System should handle concurrent requests'
      ],
      expectedConcepts: ['ParkingFloor', 'ParkingSpot', 'Vehicle', 'PaymentStrategy']
    },
    {
      title: 'Vending Machine',
      slug: 'vending-machine',
      description: 'Design a vending machine that accepts coins and bills and dispenses products.',
      difficulty: 'Easy',
      requirements: [
        'Accepts coins and bills',
        'Dispense products',
        'Return change',
        'Manage inventory'
      ],
      constraints: [
        'State pattern is highly recommended',
        'Thread safety for inventory'
      ],
      expectedConcepts: ['VendingMachineState', 'Product', 'Coin', 'Inventory']
    },
    {
      title: 'Elevator System',
      slug: 'elevator-system',
      description: 'Design an elevator system for a building with multiple elevators.',
      difficulty: 'Hard',
      requirements: [
        'Multiple elevators',
        'Dispatching strategy (e.g., nearest elevator)',
        'Internal and external button panels',
        'Handle capacity limits'
      ],
      constraints: [
        'Minimize wait time',
        'Handle concurrent button presses'
      ],
      expectedConcepts: ['ElevatorController', 'Elevator', 'ButtonPanel', 'DispatchStrategy']
    },
    {
      title: 'Library Management System',
      slug: 'library-management',
      description: 'Design a system for a library to manage books, members, and borrowing.',
      difficulty: 'Easy',
      requirements: [
        'Add/remove books',
        'Register members',
        'Checkout and return books',
        'Calculate fines for late returns'
      ],
      constraints: [
        'A book can have multiple copies (Items)',
        'Max 5 books per member'
      ],
      expectedConcepts: ['Book', 'BookItem', 'Member', 'LendingService']
    },
    {
      title: 'ATM',
      slug: 'atm',
      description: 'Design an Automated Teller Machine.',
      difficulty: 'Medium',
      requirements: [
        'Card authentication (PIN)',
        'Cash withdrawal',
        'Balance inquiry',
        'Deposit'
      ],
      constraints: [
        'Chain of responsibility for dispensing cash',
        'Transactions must be atomic'
      ],
      expectedConcepts: ['ATMController', 'CardReader', 'CashDispenser', 'BankService']
    },
    {
      title: 'Tic-Tac-Toe',
      slug: 'tic-tac-toe',
      description: 'Design a scalable Tic-Tac-Toe game.',
      difficulty: 'Easy',
      requirements: [
        '2 players',
        'Detect win/draw',
        'Reset game',
        'Keep score'
      ],
      constraints: [
        'Extensible for N x N board'
      ],
      expectedConcepts: ['Board', 'Player', 'Game', 'WinningStrategy']
    }
  ];

  for (const p of problems) {
    await prisma.problem.create({ 
      data: {
        ...p,
        requirements: JSON.stringify(p.requirements),
        constraints: JSON.stringify(p.constraints),
        expectedConcepts: JSON.stringify(p.expectedConcepts)
      } 
    });
  }

  console.log('Database seeded!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
