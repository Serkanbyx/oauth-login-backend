require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");

const fakeUsers = [
  {
    provider: "google",
    providerId: "google-001",
    displayName: "Jane Doe",
    email: "jane.doe@example.com",
    avatar: "https://i.pravatar.cc/150?u=jane-google",
  },
  {
    provider: "google",
    providerId: "google-002",
    displayName: "John Smith",
    email: "john.smith@example.com",
    avatar: "https://i.pravatar.cc/150?u=john-google",
  },
  {
    provider: "google",
    providerId: "google-003",
    displayName: "Alice Johnson",
    email: "alice.johnson@example.com",
    avatar: "https://i.pravatar.cc/150?u=alice-google",
  },
  {
    provider: "github",
    providerId: "github-001",
    displayName: "bob-dev",
    email: "bob.dev@example.com",
    avatar: "https://i.pravatar.cc/150?u=bob-github",
  },
  {
    provider: "github",
    providerId: "github-002",
    displayName: "charlie-codes",
    email: null,
    avatar: "https://i.pravatar.cc/150?u=charlie-github",
  },
  {
    provider: "github",
    providerId: "github-003",
    displayName: "diana-hacker",
    email: "diana.hacker@example.com",
    avatar: "https://i.pravatar.cc/150?u=diana-github",
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected for seeding...");

    await User.deleteMany({});
    console.log("Existing users cleared.");

    const createdUsers = await User.insertMany(fakeUsers);
    console.log(`${createdUsers.length} fake users seeded successfully:`);

    createdUsers.forEach((user) => {
      console.log(`  - ${user.displayName} (${user.provider})`);
    });
  } catch (error) {
    console.error(`Seed error: ${error.message}`);
  } finally {
    await mongoose.connection.close();
    console.log("MongoDB connection closed.");
  }
};

seedDatabase();
