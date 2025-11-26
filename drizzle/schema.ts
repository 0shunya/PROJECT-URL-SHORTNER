import { pgTable, unique, check, uuid, varchar, text, timestamp } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const users = pgTable("users", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	firstName: varchar("first_name", { length: 55 }).notNull(),
	lastName: varchar("last_name", { length: 55 }),
	email: varchar({ length: 255 }).notNull(),
	password: text().notNull(),
	salt: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
}, (table) => [
	unique("users_email_unique").on(table.email),
	check("users_id_not_null", sql`NOT NULL id`),
	check("users_first_name_not_null", sql`NOT NULL first_name`),
	check("users_email_not_null", sql`NOT NULL email`),
	check("users_password_not_null", sql`NOT NULL password`),
	check("users_salt_not_null", sql`NOT NULL salt`),
	check("users_created_at_not_null", sql`NOT NULL created_at`),
]);
