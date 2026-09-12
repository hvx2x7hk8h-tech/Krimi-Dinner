import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL;
  const name = process.env.SEED_ADMIN_NAME ?? "Plattform-Admin";
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!email || !password) {
    console.error(
      "SEED_ADMIN_EMAIL und SEED_ADMIN_PASSWORD müssen in .env gesetzt sein."
    );
    process.exit(1);
  }

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`Admin-Konto für ${email} existiert bereits — überspringe.`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await db.user.create({
    data: { email, name, passwordHash, role: "ADMIN" },
  });

  console.log(`Admin-Konto angelegt: ${email}`);
  console.log("Bitte das Passwort nach dem ersten Login ändern.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
