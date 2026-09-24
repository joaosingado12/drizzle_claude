import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  timestamp,
  primaryKey,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

/**
 * EDITORAS (publishers)
 * 1 editora -> N heróis
 */
export const publishers = pgTable(
  "publishers",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    foundedYear: integer("founded_year"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    nameIdx: uniqueIndex("publishers_name_idx").on(table.name),
  })
);

/**
 * EQUIPES (teams)
 * 1 equipe -> N heróis
 */
export const teams = pgTable(
  "teams",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    description: text("description"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    nameIdx: uniqueIndex("teams_name_idx").on(table.name),
  })
);

/**
 * PODERES (powers)
 * N poderes <-> N heróis (relação muitos-para-muitos via hero_powers)
 */
export const powers = pgTable(
  "powers",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    description: text("description"),
  },
  (table) => ({
    nameIdx: uniqueIndex("powers_name_idx").on(table.name),
  })
);

/**
 * SUPER-HERÓIS (superheroes)
 * N heróis -> 1 editora (opcional)
 * N heróis -> 1 equipe (opcional)
 */
export const superheroes = pgTable(
  "superheroes",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 100 }).notNull(), // ex: Peter Parker
    alias: varchar("alias", { length: 100 }).notNull(), // ex: Homem-Aranha
    powerLevel: integer("power_level").notNull().default(1), // 1 a 100
    publisherId: integer("publisher_id").references(() => publishers.id, {
      onDelete: "set null",
    }),
    teamId: integer("team_id").references(() => teams.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    aliasIdx: uniqueIndex("superheroes_alias_idx").on(table.alias),
  })
);

/**
 * TABELA DE JUNÇÃO: HERO_POWERS
 * Resolve o relacionamento N:N entre superheroes e powers
 */
export const heroPowers = pgTable(
  "hero_powers",
  {
    heroId: integer("hero_id")
      .notNull()
      .references(() => superheroes.id, { onDelete: "cascade" }),
    powerId: integer("power_id")
      .notNull()
      .references(() => powers.id, { onDelete: "cascade" }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.heroId, table.powerId] }),
  })
);

/* ------------------------------------------------------------------ */
/* RELATIONS (usadas pela query API do Drizzle -> db.query.xxx.findMany) */
/* ------------------------------------------------------------------ */

export const publishersRelations = relations(publishers, ({ many }) => ({
  heroes: many(superheroes),
}));

export const teamsRelations = relations(teams, ({ many }) => ({
  heroes: many(superheroes),
}));

export const powersRelations = relations(powers, ({ many }) => ({
  heroPowers: many(heroPowers),
}));

export const superheroesRelations = relations(superheroes, ({ one, many }) => ({
  publisher: one(publishers, {
    fields: [superheroes.publisherId],
    references: [publishers.id],
  }),
  team: one(teams, {
    fields: [superheroes.teamId],
    references: [teams.id],
  }),
  heroPowers: many(heroPowers),
}));

export const heroPowersRelations = relations(heroPowers, ({ one }) => ({
  hero: one(superheroes, {
    fields: [heroPowers.heroId],
    references: [superheroes.id],
  }),
  power: one(powers, {
    fields: [heroPowers.powerId],
    references: [powers.id],
  }),
}));

/* Tipos inferidos, úteis nos services/controllers */
export type Publisher = typeof publishers.$inferSelect;
export type NewPublisher = typeof publishers.$inferInsert;

export type Team = typeof teams.$inferSelect;
export type NewTeam = typeof teams.$inferInsert;

export type Power = typeof powers.$inferSelect;
export type NewPower = typeof powers.$inferInsert;

export type Superhero = typeof superheroes.$inferSelect;
export type NewSuperhero = typeof superheroes.$inferInsert;
