const db = require('./database');

function seedDatabase() {
  console.log('Seeding 5-Star Hotel Automation Database...');

  // 1. Seed Hotel
  db.prepare(`
    INSERT OR REPLACE INTO hotels (hotelId, name, totalRooms)
    VALUES (?, ?, ?)
  `).run('HTL-001', 'The Grand Horizon Luxury Suites & Hotel', 24);

  // 2. Seed Tariffs (4 distinct room types as per specification)
  const tariffs = [
    { tariffId: 'TRF-S-NAC', bedType: 'Single', acType: 'Non-AC', rate: 120.00 },
    { tariffId: 'TRF-S-AC',  bedType: 'Single', acType: 'AC',     rate: 180.00 },
    { tariffId: 'TRF-D-NAC', bedType: 'Double', acType: 'Non-AC', rate: 220.00 },
    { tariffId: 'TRF-D-AC',  bedType: 'Double', acType: 'AC',     rate: 320.00 },
  ];

  const insertTariff = db.prepare(`
    INSERT OR REPLACE INTO tariffs (tariffId, bedType, acType, rate)
    VALUES (@tariffId, @bedType, @acType, @rate)
  `);
  tariffs.forEach(t => insertTariff.run(t));

  // 3. Seed Frequent Guests (Loyalty program)
  const frequentGuests = [
    { frequentGuestId: 'VIP-777', name: 'Lady Eleanor Vance', discountPercentage: 15.0, totalVisits: 8 },
    { frequentGuestId: 'VIP-888', name: 'Dr. Marcus Sterling', discountPercentage: 15.0, totalVisits: 5 },
    { frequentGuestId: 'VIP-999', name: 'Ambassador Julian Thorne', discountPercentage: 20.0, totalVisits: 12 },
    { frequentGuestId: 'GOLD-101', name: 'Sophia Chen', discountPercentage: 10.0, totalVisits: 3 },
  ];
  const insertFG = db.prepare(`
    INSERT OR REPLACE INTO frequent_guests (frequentGuestId, name, discountPercentage, totalVisits)
    VALUES (@frequentGuestId, @name, @discountPercentage, @totalVisits)
  `);
  frequentGuests.forEach(fg => insertFG.run(fg));

  // 4. Seed 24 Rooms (6 of each category)
  // Single Non-AC: 101, 102, 103, 104, 105, 106
  // Single AC: 201, 202, 203, 204, 205, 206
  // Double Non-AC: 301, 302, 303, 304, 305, 306
  // Double AC: 401, 402, 403, 404, 405, 406
  const rooms = [];
  const roomConfigs = [
    { prefix: 100, count: 6, bedType: 'Single', acType: 'Non-AC', tariffId: 'TRF-S-NAC', rate: 120.00 },
    { prefix: 200, count: 6, bedType: 'Single', acType: 'AC',     tariffId: 'TRF-S-AC',  rate: 180.00 },
    { prefix: 300, count: 6, bedType: 'Double', acType: 'Non-AC', tariffId: 'TRF-D-NAC', rate: 220.00 },
    { prefix: 400, count: 6, bedType: 'Double', acType: 'AC',     tariffId: 'TRF-D-AC',  rate: 320.00 },
  ];

  roomConfigs.forEach(cfg => {
    for (let i = 1; i <= cfg.count; i++) {
      const roomNumber = String(cfg.prefix + i);
      rooms.push({
        roomNumber,
        bedType: cfg.bedType,
        acType: cfg.acType,
        rate: cfg.rate,
        status: 'Available',
        tariffId: cfg.tariffId,
      });
    }
  });

  const insertRoom = db.prepare(`
    INSERT OR REPLACE INTO rooms (roomNumber, bedType, acType, rate, status, tariffId)
    VALUES (@roomNumber, @bedType, @acType, @rate, @status, @tariffId)
  `);
  rooms.forEach(r => insertRoom.run(r));

  // 5. Seed 5-Star Catering Menu Items
  const foodItems = [
    { itemId: 'FOD-101', itemName: 'Grand Horizon Continental Breakfast', category: 'Breakfast', price: 28.00 },
    { itemId: 'FOD-102', itemName: 'Smoked Salmon Eggs Benedict', category: 'Breakfast', price: 34.00 },
    { itemId: 'FOD-103', itemName: 'Signature Wagyu Club Sandwich', category: 'Lunch & Snacks', price: 42.00 },
    { itemId: 'FOD-104', itemName: 'Mediterranean Truffle Salad', category: 'Lunch & Snacks', price: 26.00 },
    { itemId: 'FOD-105', itemName: 'Prime Angus Filet Mignon (8oz)', category: 'Dinner Entrees', price: 68.00 },
    { itemId: 'FOD-106', itemName: 'Pan-Seared Chilean Sea Bass', category: 'Dinner Entrees', price: 62.00 },
    { itemId: 'FOD-107', itemName: 'Wild Mushroom Risotto with White Truffle', category: 'Dinner Entrees', price: 45.00 },
    { itemId: 'FOD-108', itemName: 'Domaine Chandon Sparkling Wine (Glass)', category: 'Beverages', price: 24.00 },
    { itemId: 'FOD-109', itemName: 'Artisanal Single-Origin Espresso', category: 'Beverages', price: 9.00 },
    { itemId: 'FOD-110', itemName: 'Fresh Pressed Valencia Orange Juice', category: 'Beverages', price: 12.00 },
    { itemId: 'FOD-111', itemName: 'Valrhona Chocolate Lava Dome', category: 'Desserts', price: 22.00 },
    { itemId: 'FOD-112', itemName: 'Madagascar Vanilla Bean Creme Brulee', category: 'Desserts', price: 18.00 },
  ];

  const insertFood = db.prepare(`
    INSERT OR REPLACE INTO food_items (itemId, itemName, category, price)
    VALUES (@itemId, @itemName, @category, @price)
  `);
  foodItems.forEach(f => insertFood.run(f));

  // 6. Seed Sample Active Guests & Stays for Testing
  // Guest 1: In Room 401 (Double AC), Frequent Guest Lady Eleanor Vance
  const today = new Date().toISOString().split('T')[0];
  const nowTime = new Date().toTimeString().split(' ')[0].substring(0, 5);

  db.prepare(`
    INSERT OR REPLACE INTO guests (guestId, name, phone, arrivalTime, durationOfStay, advancePaid, frequentGuestId)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run('GST-201', 'Lady Eleanor Vance', '+1 (555) 234-8901', `${today} 14:00`, 3, 300.00, 'VIP-777');

  db.prepare(`
    INSERT OR REPLACE INTO tokens (tokenNumber, guestId, issueDate, issueTime, status)
    VALUES (?, ?, ?, ?, ?)
  `).run('TKN-8421', 'GST-201', today, '14:15', 'Active');

  db.prepare(`
    INSERT OR REPLACE INTO reservations (reservationId, guestId, roomNumber, arrivalDate, duration, reservationType, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run('RSV-501', 'GST-201', '401', today, 3, 'Advance', 'CheckedIn');

  db.prepare(`UPDATE rooms SET status = 'Occupied' WHERE roomNumber = '401'`).run();

  // Add initial food consumption for TKN-8421
  db.prepare(`
    INSERT OR REPLACE INTO food_consumptions (consumptionId, tokenNumber, itemId, quantity, date, time, amount)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run('CSM-901', 'TKN-8421', 'FOD-105', 1, today, '19:30', 68.00);

  db.prepare(`
    INSERT OR REPLACE INTO food_consumptions (consumptionId, tokenNumber, itemId, quantity, date, time, amount)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run('CSM-902', 'TKN-8421', 'FOD-108', 2, today, '19:45', 48.00);

  // Guest 2: In Room 202 (Single AC), Regular Guest
  db.prepare(`
    INSERT OR REPLACE INTO guests (guestId, name, phone, arrivalTime, durationOfStay, advancePaid, frequentGuestId)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run('GST-202', 'Benjamin Hayes', '+1 (555) 789-4321', `${today} 11:30`, 2, 100.00, null);

  db.prepare(`
    INSERT OR REPLACE INTO tokens (tokenNumber, guestId, issueDate, issueTime, status)
    VALUES (?, ?, ?, ?, ?)
  `).run('TKN-8422', 'GST-202', today, '11:45', 'Active');

  db.prepare(`
    INSERT OR REPLACE INTO reservations (reservationId, guestId, roomNumber, arrivalDate, duration, reservationType, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run('RSV-502', 'GST-202', '202', today, 2, 'OnSpot', 'CheckedIn');

  db.prepare(`UPDATE rooms SET status = 'Occupied' WHERE roomNumber = '202'`).run();

  db.prepare(`
    INSERT OR REPLACE INTO food_consumptions (consumptionId, tokenNumber, itemId, quantity, date, time, amount)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run('CSM-903', 'TKN-8422', 'FOD-101', 2, today, '08:30', 56.00);

  // 7. Seed Occupancy History for past months so Manager Portal has immediate historical trends
  const currentYear = new Date().getFullYear();
  const sampleOccupancy = [
    { month: 1, year: currentYear, occupiedRooms: 18, totalRooms: 24, occupancyRate: 75.0 },
    { month: 2, year: currentYear, occupiedRooms: 20, totalRooms: 24, occupancyRate: 83.3 },
    { month: 3, year: currentYear, occupiedRooms: 22, totalRooms: 24, occupancyRate: 91.7 },
    { month: 4, year: currentYear, occupiedRooms: 15, totalRooms: 24, occupancyRate: 62.5 },
    { month: 5, year: currentYear, occupiedRooms: 19, totalRooms: 24, occupancyRate: 79.2 },
    { month: 6, year: currentYear, occupiedRooms: 21, totalRooms: 24, occupancyRate: 87.5 },
    { month: 7, year: currentYear, occupiedRooms: 23, totalRooms: 24, occupancyRate: 95.8 },
    { month: 8, year: currentYear, occupiedRooms: 22, totalRooms: 24, occupancyRate: 91.7 },
    { month: 9, year: currentYear, occupiedRooms: 17, totalRooms: 24, occupancyRate: 70.8 },
  ];

  const insertOcc = db.prepare(`
    INSERT OR REPLACE INTO occupancies (month, year, occupiedRooms, totalRooms, occupancyRate)
    VALUES (@month, @year, @occupiedRooms, @totalRooms, @occupancyRate)
  `);
  sampleOccupancy.forEach(o => insertOcc.run(o));

  console.log('Database seeded successfully with 24 rooms, tariffs, catering menu, active guests, and occupancy records!');
}

seedDatabase();

module.exports = { seedDatabase };
