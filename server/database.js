const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'hotel.sqlite');
const db = new Database(dbPath);

// Enable WAL mode and foreign keys for high performance and integrity
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

function initSchema() {
  db.exec(`
    -- 1. Hotel
    CREATE TABLE IF NOT EXISTS hotels (
      hotelId TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      totalRooms INTEGER NOT NULL
    );

    -- 2. Tariffs (Single/Double x AC/Non-AC)
    CREATE TABLE IF NOT EXISTS tariffs (
      tariffId TEXT PRIMARY KEY,
      bedType TEXT CHECK(bedType IN ('Single', 'Double')) NOT NULL,
      acType TEXT CHECK(acType IN ('AC', 'Non-AC')) NOT NULL,
      rate REAL NOT NULL
    );

    -- 3. Room Inventory
    CREATE TABLE IF NOT EXISTS rooms (
      roomNumber TEXT PRIMARY KEY,
      bedType TEXT CHECK(bedType IN ('Single', 'Double')) NOT NULL,
      acType TEXT CHECK(acType IN ('AC', 'Non-AC')) NOT NULL,
      rate REAL NOT NULL,
      status TEXT CHECK(status IN ('Available', 'Allocated', 'Occupied', 'Maintenance')) DEFAULT 'Available',
      tariffId TEXT,
      FOREIGN KEY(tariffId) REFERENCES tariffs(tariffId)
    );

    -- 4. Frequent Guests Master
    CREATE TABLE IF NOT EXISTS frequent_guests (
      frequentGuestId TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      discountPercentage REAL DEFAULT 15.0,
      totalVisits INTEGER DEFAULT 1
    );

    -- 5. Guests
    CREATE TABLE IF NOT EXISTS guests (
      guestId TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      arrivalTime TEXT NOT NULL,
      durationOfStay INTEGER NOT NULL,
      advancePaid REAL DEFAULT 0.0,
      frequentGuestId TEXT,
      FOREIGN KEY(frequentGuestId) REFERENCES frequent_guests(frequentGuestId)
    );

    -- 6. Tokens (Unique per active stay)
    CREATE TABLE IF NOT EXISTS tokens (
      tokenNumber TEXT PRIMARY KEY,
      guestId TEXT NOT NULL,
      issueDate TEXT NOT NULL,
      issueTime TEXT NOT NULL,
      status TEXT CHECK(status IN ('Active', 'Closed')) DEFAULT 'Active',
      FOREIGN KEY(guestId) REFERENCES guests(guestId)
    );

    -- 7. Reservations
    CREATE TABLE IF NOT EXISTS reservations (
      reservationId TEXT PRIMARY KEY,
      guestId TEXT NOT NULL,
      roomNumber TEXT NOT NULL,
      arrivalDate TEXT NOT NULL,
      duration INTEGER NOT NULL,
      reservationType TEXT CHECK(reservationType IN ('Advance', 'OnSpot')) DEFAULT 'OnSpot',
      status TEXT CHECK(status IN ('Reserved', 'CheckedIn', 'CheckedOut', 'Cancelled')) DEFAULT 'CheckedIn',
      FOREIGN KEY(guestId) REFERENCES guests(guestId),
      FOREIGN KEY(roomNumber) REFERENCES rooms(roomNumber)
    );

    -- 8. Food Items (Catering Catalog)
    CREATE TABLE IF NOT EXISTS food_items (
      itemId TEXT PRIMARY KEY,
      itemName TEXT NOT NULL,
      category TEXT DEFAULT 'General',
      price REAL NOT NULL
    );

    -- 9. Food Consumption
    CREATE TABLE IF NOT EXISTS food_consumptions (
      consumptionId TEXT PRIMARY KEY,
      tokenNumber TEXT NOT NULL,
      itemId TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      amount REAL NOT NULL,
      FOREIGN KEY(tokenNumber) REFERENCES tokens(tokenNumber),
      FOREIGN KEY(itemId) REFERENCES food_items(itemId)
    );

    -- 10. Bills
    CREATE TABLE IF NOT EXISTS bills (
      billNumber TEXT PRIMARY KEY,
      guestId TEXT NOT NULL,
      tokenNumber TEXT NOT NULL,
      roomCharges REAL NOT NULL,
      foodCharges REAL NOT NULL,
      discount REAL DEFAULT 0.0,
      advancePaid REAL DEFAULT 0.0,
      totalAmount REAL NOT NULL,
      balanceAmount REAL NOT NULL,
      generatedAt TEXT NOT NULL,
      status TEXT CHECK(status IN ('Unpaid', 'Paid')) DEFAULT 'Paid',
      FOREIGN KEY(guestId) REFERENCES guests(guestId),
      FOREIGN KEY(tokenNumber) REFERENCES tokens(tokenNumber)
    );

    -- 11. Occupancies (Historical & calculated monthly rates)
    CREATE TABLE IF NOT EXISTS occupancies (
      month INTEGER NOT NULL,
      year INTEGER NOT NULL,
      occupiedRooms INTEGER NOT NULL,
      totalRooms INTEGER NOT NULL,
      occupancyRate REAL NOT NULL,
      PRIMARY KEY(month, year)
    );
  `);
}

initSchema();

module.exports = db;
