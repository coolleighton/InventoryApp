#! /usr/bin/env node

console.log("This script populates some test cars");

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const economyCar = require("./models/economyCar");
const luxuryCar = require("./models/luxuryCar");

const economyCars = [];
const luxuryCars = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createEconomyCars();
  await createLuxuryCars();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

async function economyCarCreate(
  index,
  model,
  manufacturer,
  type,
  price,
  seats,
  luggageVolume,
  stock
) {
  const economyCarDetail = {
    index: index,
    model: model,
    manufacturer: manufacturer,
    type: type,
    price: price,
    seats: seats,
    luggageVolume: luggageVolume,
    stock: stock,
  };
  const newEconomyCar = new economyCar(economyCarDetail);
  await newEconomyCar.save();
  economyCars[index] = newEconomyCar;
  console.log(`Added economy car: ${manufacturer} ${model}`);
}

async function luxuryCarCreate(
  index,
  model,
  manufacturer,
  type,
  price,
  power,
  engine,
  stock
) {
  const luxuryCarDetail = {
    index: index,
    model: model,
    manufacturer: manufacturer,
    type: type,
    price: price,
    power: power,
    engine: engine,
    stock: stock,
  };
  const newLuxuryCar = new luxuryCar(luxuryCarDetail);
  await newLuxuryCar.save();
  luxuryCars[index] = newLuxuryCar;
  console.log(`Added luxury car: ${manufacturer} ${model}`);
}

async function createLuxuryCars() {
  console.log("Adding luxury cars");
  await Promise.all([
    luxuryCarCreate(
      0,
      "Regera",
      "Koenigsegg",
      "Coupe",
      2000000,
      1500,
      "5.0 L V8",
      5
    ),
    luxuryCarCreate(
      1,
      "Jesko",
      "Koenigsegg",
      "Coupe",
      3000000,
      1600,
      "5.0 L V8",
      3
    ),
    luxuryCarCreate(
      2,
      "Huayra",
      "Pagani",
      "Coupe",
      2500000,
      730,
      "6.0 L twin-turbo V12",
      3
    ),
    luxuryCarCreate(
      3,
      "Chiron",
      "Bugatti",
      "Coupe",
      3000000,
      1479,
      "8.0 L quad-turbocharged W16",
      2
    ),
    luxuryCarCreate(
      4,
      "Aventador SVJ",
      "Lamborghini",
      "Coupe",
      550000,
      770,
      "6.5 L V12",
      10
    ),
    luxuryCarCreate(
      5,
      "720S",
      "McLaren",
      "Coupe",
      300000,
      710,
      "4.0 L twin-turbo V8",
      8
    ),
  ]);
}

async function createEconomyCars() {
  console.log("Adding economy cars");
  await Promise.all([
    economyCarCreate(0, "Corsa", "Vauxhall", "Hatchback", 15000, 5, 285, 15),
    economyCarCreate(1, "Astra", "Vauxhall", "Sedan", 20000, 5, 420, 10),
    economyCarCreate(2, "Polo", "Volkswagen", "Hatchback", 18000, 5, 350, 18),
    economyCarCreate(3, "Golf", "Volkswagen", "Hatchback", 22000, 5, 380, 20),
    economyCarCreate(4, "Clio", "Renault", "Hatchback", 17000, 5, 300, 18),
    economyCarCreate(5, "Megane", "Renault", "Sedan", 21000, 5, 370, 14),
    economyCarCreate(6, "Cooper", "Mini", "Hatchback", 22000, 4, 211, 12),
    economyCarCreate(7, "Countryman", "Mini", "SUV", 28000, 5, 450, 8),
    economyCarCreate(8, "Fiesta", "Ford", "Hatchback", 16000, 5, 292, 22),
    economyCarCreate(9, "Focus", "Ford", "Sedan", 20000, 5, 375, 17),
    economyCarCreate(10, "Civic", "Honda", "Sedan", 22000, 5, 428, 13),
    economyCarCreate(11, "Fit", "Honda", "Hatchback", 18000, 5, 470, 16),
  ]);
}
