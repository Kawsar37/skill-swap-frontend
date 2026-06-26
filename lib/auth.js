import dns from "node:dns";
dns.setDefaultResultOrder("ipv4first");

import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db("skill-swap");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "client", // Google OAuth users default to 'client' per assignment rules
        input: true, // Allows this to be passed from the signup form
      },
      skills: {
        type: "string", // BetterAuth stores arrays as comma-separated strings or JSON strings depending on adapter
        required: false,
        defaultValue: "[]",
        input: false, // Not collected on signup
      },
      bio: {
        type: "string",
        required: false,
        defaultValue: "",
        input: false, // Not collected on signup
      },
      isBlocked: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: false, // Only editable by Admin
      },
    },
  },
});
