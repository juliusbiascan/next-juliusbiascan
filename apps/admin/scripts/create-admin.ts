import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const envFile = readFileSync(
  fileURLToPath(new URL("../.env", import.meta.url)),
  "utf8",
);

for (const line of envFile.split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const separator = trimmed.indexOf("=");
  if (separator === -1) continue;
  const key = trimmed.slice(0, separator);
  let value = trimmed.slice(separator + 1);
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }
  process.env[key] ??= value;
}

const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;
const name = process.env.ADMIN_NAME ?? "Admin";

if (!email || !password) {
  throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set.");
}

const { auth } = await import("../lib/auth");
const { db } = await import("@repo/db");

const context = await auth.$context;
const passwordHash = await context.password.hash(password);
const existing = await db.user.findUnique({ where: { email } });

if (!existing) {
  const user = await db.user.create({
    data: {
      email,
      name,
      emailVerified: true,
    },
  });

  await db.account.create({
    data: {
      accountId: String(user.id),
      providerId: "credential",
      userId: user.id,
      password: passwordHash,
    },
  });

  console.log(`Created ${email}`);
} else {
  await db.user.update({
    where: { id: existing.id },
    data: { emailVerified: true, name: existing.name || name },
  });

  const account = await db.account.findFirst({
    where: { userId: existing.id, providerId: "credential" },
  });

  if (!account) {
    await db.account.create({
      data: {
        accountId: String(existing.id),
        providerId: "credential",
        userId: existing.id,
        password: passwordHash,
      },
    });
    console.log(`Added a password for ${email}`);
  } else {
    console.log(`${email} already has a password`);
  }
}

await db.$disconnect();
