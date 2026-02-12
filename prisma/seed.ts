import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding des places...");

  const seats = [
    { label: "A1", x: 115, y: 80 },
    { label: "A2", x: 185, y: 80 },
    { label: "A3", x: 255, y: 80 },
    { label: "A4", x: 325, y: 80 },
    { label: "A5", x: 395, y: 80 },
    { label: "B1", x: 535, y: 80 },
    { label: "B2", x: 605, y: 80 },
    { label: "B3", x: 675, y: 80 },
    { label: "B4", x: 745, y: 80 },
    { label: "B5", x: 815, y: 80 },
    { label: "C1", x: 115, y: 250 },
    { label: "C2", x: 185, y: 250 },
    { label: "C3", x: 255, y: 250 },
    { label: "C4", x: 325, y: 250 },
    { label: "C5", x: 395, y: 250 },
    { label: "D1", x: 535, y: 250 },
    { label: "D2", x: 605, y: 250 },
    { label: "D3", x: 675, y: 250 },
    { label: "D4", x: 745, y: 250 },
    { label: "D5", x: 815, y: 250 },
  ];

  for (const seat of seats) {
    await prisma.seat.upsert({
      where: { label: seat.label },
      update: { x: seat.x, y: seat.y },
      create: seat,
    });
    console.log(`  Place ${seat.label} creee/mise a jour`);
  }

  console.log("\n20 places creees avec succes !");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
