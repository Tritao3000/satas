import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey(),
  userType: text("user_type").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export type User = typeof users;

export const startupProfiles = pgTable("startup_profiles", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  logo: text("logo"),
  banner: text("banner"),
  location: text("location"),
  industry: text("industry"),
  stage: text("stage"),
  teamSize: integer("team_size"),
  foundedYear: integer("founded_year"),
  linkedin: text("linkedin"),
  website: text("website"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export type StartupProfile = typeof startupProfiles;

export const individualProfiles = pgTable("individual_profiles", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  location: text("location"),
  industry: text("industry"),
  role: text("role"),
  description: text("description"),
  linkedin: text("linkedin"),
  twitter: text("twitter"),
  github: text("github"),
  website: text("website"),
  profilePicture: text("profile_picture"),
  coverPicture: text("cover_picture"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export type IndividualProfile = typeof individualProfiles;

export const jobs = pgTable("jobs", {
  id: uuid("id").primaryKey(),
  startupId: uuid("startup_id")
    .notNull()
    .references(() => startupProfiles.userId, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  type: text("type").notNull(),
  salary: integer("salary"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export type Job = typeof jobs;

export const jobApplications = pgTable("job_applications", {
  id: uuid("id").primaryKey(),
  jobId: uuid("job_id")
    .notNull()
    .references(() => jobs.id, { onDelete: "cascade" }),
  applicantId: uuid("applicant_id")
    .notNull()
    .references(() => individualProfiles.userId, { onDelete: "cascade" }),
  status: text("status").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export type JobApplication = typeof jobApplications;

export const events = pgTable("events", {
  id: uuid("id").primaryKey(),
  startupId: uuid("startup_id")
    .notNull()
    .references(() => startupProfiles.userId, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  location: text("location").notNull(),
  date: timestamp("date").notNull(),
  startTime: timestamp("start_time"),
  endTime: timestamp("end_time"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export type Event = typeof events;

export const eventRegistrations = pgTable("event_registrations", {
  id: uuid("id").primaryKey(),
  eventId: uuid("event_id")
    .notNull()
    .references(() => events.id, { onDelete: "cascade" }),
  registrantId: uuid("registrant_id")
    .notNull()
    .references(() => individualProfiles.userId, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export type EventRegistration = typeof eventRegistrations;
