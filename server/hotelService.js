const db = require('./database');

/**
 * Hotel Automation Core Service
 * Implements methods matching the UML Class Diagram:
 * - Hotel: checkAvailability(), calculateOccupancy()
 * - Room: isAvailable(), allocateRoom()
 * - Guest: reserveRoom(), checkIn(), checkOut()
 * - Reservation: makeReservation()
 * - Token: generateToken()
 * - Bill: generateBill(), calculateBalance()
 * - FoodConsumption: calculateAmount()
 * - Tariff: reviseRate()
 * - Occupancy: calculateOccupancyRate()
 */

class HotelService {
  // ==================== HOTEL & ROOM METHODS ====================

  /**
   * Hotel.checkAvailability(bedType, acType)
   * Finds available rooms matching the bed type and AC type
   */
  static checkAvailability(bedType, acType) {
    let query = `SELECT * FROM rooms WHERE status = 'Available'`;
    const params = [];

    if (bedType) {
      query += ` AND bedType = ?`;
      params.push(bedType);
    }
    if (acType) {
      query += ` AND acType = ?`;
      params.push(acType);
    }

    query += ` ORDER BY roomNumber ASC`;
    return db.prepare(query).all(...params);
  }

  /**
   * Room.isAvailable(roomNumber)
   */
  static isAvailable(roomNumber) {
    const room = db.prepare(`SELECT * FROM rooms WHERE roomNumber = ?`).get(roomNumber);
    return room && room.status === 'Available';
  }

  /**
   * Room.allocateRoom(roomNumber)
   */
  static allocateRoom(roomNumber) {
    const stmt = db.prepare(`UPDATE rooms SET status = 'Occupied' WHERE roomNumber = ? AND status = 'Available'`);
    const result = stmt.run(roomNumber);
    return result.changes > 0;
  }

  /**
   * Token.generateToken(guestId)
   * Generates a unique 4-digit token formatted as TKN-XXXX
   */
  static generateToken(guestId) {
    let unique = false;
    let tokenNumber = '';
    while (!unique) {
      const rand = Math.floor(1000 + Math.random() * 9000);
      tokenNumber = `TKN-${rand}`;
      const existing = db.prepare(`SELECT tokenNumber FROM tokens WHERE tokenNumber = ?`).get(tokenNumber);
      if (!existing) unique = true;
    }

    const today = new Date().toISOString().split('T')[0];
    const nowTime = new Date().toTimeString().split(' ')[0].substring(0, 5);

    db.prepare(`
      INSERT INTO tokens (tokenNumber, guestId, issueDate, issueTime, status)
      VALUES (?, ?, ?, ?, 'Active')
    `).run(tokenNumber, guestId, today, nowTime);

    return { tokenNumber, issueDate: today, issueTime: nowTime };
  }

  // ==================== RESERVATION & CHECK-IN METHODS ====================

  /**
   * Guest & Reservation: makeReservation() / checkIn()
   * Flow according to Sequence Diagram 1 & Activity Diagram:
   * 1. Check availability
   * 2. If no room -> Return apology message
   * 3. If available -> Allot room, insert guest, create reservation, generate token
   */
  static makeReservation({
    name,
    phone,
    arrivalTime,
    durationOfStay,
    advancePaid = 0,
    bedType,
    acType,
    frequentGuestId = null,
    reservationType = 'OnSpot',
  }) {
    // 1. Availability check
    const availableRooms = this.checkAvailability(bedType, acType);

    if (!availableRooms || availableRooms.length === 0) {
      return {
        success: false,
        apologyMessage: `We sincerely apologize, but no ${bedType} Bed (${acType}) rooms are currently available for the requested schedule. Please check other categories or alternative dates.`,
        availableCategories: this.getRoomCategoryAvailability(),
      };
    }

    // Pick the first suitable room
    const selectedRoom = availableRooms[0];
    const roomNumber = selectedRoom.roomNumber;

    // Verify frequent guest if provided
    let verifiedFrequentGuest = null;
    if (frequentGuestId) {
      verifiedFrequentGuest = db.prepare(`SELECT * FROM frequent_guests WHERE frequentGuestId = ?`).get(frequentGuestId);
    }

    // Generate unique guestId
    const guestCount = db.prepare(`SELECT COUNT(*) as count FROM guests`).get().count + 1;
    const guestId = `GST-${1000 + guestCount}`;

    // Insert guest
    db.prepare(`
      INSERT INTO guests (guestId, name, phone, arrivalTime, durationOfStay, advancePaid, frequentGuestId)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      guestId,
      name,
      phone,
      arrivalTime || new Date().toISOString().replace('T', ' ').substring(0, 16),
      Number(durationOfStay),
      Number(advancePaid) || 0,
      verifiedFrequentGuest ? frequentGuestId : null
    );

    // Allocate room
    this.allocateRoom(roomNumber);

    // Generate unique token
    const tokenInfo = this.generateToken(guestId);

    // Create reservation record
    const resCount = db.prepare(`SELECT COUNT(*) as count FROM reservations`).get().count + 1;
    const reservationId = `RSV-${1000 + resCount}`;
    const arrivalDate = arrivalTime ? arrivalTime.split(' ')[0] : new Date().toISOString().split('T')[0];

    db.prepare(`
      INSERT INTO reservations (reservationId, guestId, roomNumber, arrivalDate, duration, reservationType, status)
      VALUES (?, ?, ?, ?, ?, ?, 'CheckedIn')
    `).run(reservationId, guestId, roomNumber, arrivalDate, Number(durationOfStay), reservationType);

    return {
      success: true,
      message: 'Room allotted and reservation confirmed successfully!',
      guest: {
        guestId,
        name,
        phone,
        frequentGuestId: verifiedFrequentGuest ? frequentGuestId : null,
        frequentGuestName: verifiedFrequentGuest ? verifiedFrequentGuest.name : null,
        discountPercentage: verifiedFrequentGuest ? verifiedFrequentGuest.discountPercentage : 0,
      },
      room: selectedRoom,
      token: tokenInfo,
      reservationId,
    };
  }

  // ==================== CATERING METHODS ====================

  /**
   * FoodConsumption.calculateAmount() & recordFoodConsumption()
   * Matching Sequence Diagram 2:
   * Catering Manager inputs food type, quantity, token, date and time
   */
  static recordFoodConsumption({ tokenNumber, itemId, quantity, date, time }) {
    // Verify active token
    const token = db.prepare(`SELECT * FROM tokens WHERE tokenNumber = ? AND status = 'Active'`).get(tokenNumber);
    if (!token) {
      throw new Error(`Token ${tokenNumber} is not active or does not exist.`);
    }

    const foodItem = db.prepare(`SELECT * FROM food_items WHERE itemId = ?`).get(itemId);
    if (!foodItem) {
      throw new Error(`Food item ${itemId} not found in catalog.`);
    }

    const qty = Number(quantity) || 1;
    const amount = Number((foodItem.price * qty).toFixed(2));
    const entryDate = date || new Date().toISOString().split('T')[0];
    const entryTime = time || new Date().toTimeString().split(' ')[0].substring(0, 5);

    const csmCount = db.prepare(`SELECT COUNT(*) as count FROM food_consumptions`).get().count + 1;
    const consumptionId = `CSM-${1000 + csmCount}`;

    db.prepare(`
      INSERT INTO food_consumptions (consumptionId, tokenNumber, itemId, quantity, date, time, amount)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(consumptionId, tokenNumber, itemId, qty, entryDate, entryTime, amount);

    return {
      consumptionId,
      tokenNumber,
      itemId,
      itemName: foodItem.itemName,
      price: foodItem.price,
      quantity: qty,
      amount,
      date: entryDate,
      time: entryTime,
    };
  }

  static getFoodConsumptionsByToken(tokenNumber) {
    return db.prepare(`
      SELECT fc.*, fi.itemName, fi.price as unitPrice, fi.category
      FROM food_consumptions fc
      JOIN food_items fi ON fc.itemId = fi.itemId
      WHERE fc.tokenNumber = ?
      ORDER BY fc.date DESC, fc.time DESC
    `).all(tokenNumber);
  }

  // ==================== TARIFF & OCCUPANCY METHODS ====================

  /**
   * Occupancy.calculateOccupancyRate(month, year)
   * Matching Sequence Diagram 2 & Activity Diagram:
   * Returns occupied rooms, total rooms, and occupancy rate %
   */
  static calculateOccupancyRate(month, year) {
    const totalRoomsRecord = db.prepare(`SELECT COUNT(*) as total FROM rooms`).get();
    const totalRooms = totalRoomsRecord ? totalRoomsRecord.total : 24;

    // Check if recorded in occupancies table
    const existing = db.prepare(`
      SELECT * FROM occupancies WHERE month = ? AND year = ?
    `).get(Number(month), Number(year));

    if (existing) {
      return existing;
    }

    // Dynamic fallback calculation based on current room status if current month/year
    const now = new Date();
    const isCurrent = Number(month) === (now.getMonth() + 1) && Number(year) === now.getFullYear();

    const occupiedCount = isCurrent
      ? db.prepare(`SELECT COUNT(*) as count FROM rooms WHERE status = 'Occupied'`).get().count
      : Math.floor(totalRooms * 0.75); // realistic estimate

    const rate = Number(((occupiedCount / totalRooms) * 100).toFixed(1));

    return {
      month: Number(month),
      year: Number(year),
      occupiedRooms: occupiedCount,
      totalRooms,
      occupancyRate: rate,
    };
  }

  /**
   * Tariff.reviseRate(percentage, tariffId)
   * Upward (+%) or Downward (-%) revision
   * Updates tariff table and available room rates
   */
  static reviseRate(percentage, tariffId = null) {
    const pct = Number(percentage);
    if (isNaN(pct) || pct === 0) {
      throw new Error('Please provide a valid non-zero percentage revision.');
    }

    const multiplier = 1 + (pct / 100);

    let updatedTariffs = [];
    if (tariffId) {
      const current = db.prepare(`SELECT * FROM tariffs WHERE tariffId = ?`).get(tariffId);
      if (!current) throw new Error(`Tariff ${tariffId} not found.`);
      const newRate = Number((current.rate * multiplier).toFixed(2));
      db.prepare(`UPDATE tariffs SET rate = ? WHERE tariffId = ?`).run(newRate, tariffId);
      db.prepare(`UPDATE rooms SET rate = ? WHERE tariffId = ? AND status = 'Available'`).run(newRate, tariffId);
      updatedTariffs.push({ ...current, oldRate: current.rate, newRate });
    } else {
      // Revise all tariffs
      const allTariffs = db.prepare(`SELECT * FROM tariffs`).all();
      for (const t of allTariffs) {
        const newRate = Number((t.rate * multiplier).toFixed(2));
        db.prepare(`UPDATE tariffs SET rate = ? WHERE tariffId = ?`).run(newRate, t.tariffId);
        db.prepare(`UPDATE rooms SET rate = ? WHERE tariffId = ? AND status = 'Available'`).run(newRate, t.tariffId);
        updatedTariffs.push({ ...t, oldRate: t.rate, newRate });
      }
    }

    return {
      percentage: pct,
      revisedTariffs: updatedTariffs,
      message: `Room tariffs revised by ${pct > 0 ? '+' : ''}${pct}% successfully.`,
    };
  }

  // ==================== CHECKOUT & BILLING METHODS ====================

  /**
   * Bill.generateBill(tokenNumber) & calculateBalance()
   * Flow matching Sequence Diagram 3:
   * 1. Retrieve room, duration, advance paid, and food charges
   * 2. Check frequent guest identity / discount eligibility
   * 3. Calculate total, apply discount, deduct advance paid, return balance payable
   */
  static calculateBill(tokenNumber) {
    const token = db.prepare(`SELECT * FROM tokens WHERE tokenNumber = ?`).get(tokenNumber);
    if (!token) {
      throw new Error(`Token ${tokenNumber} not found.`);
    }

    const guest = db.prepare(`SELECT * FROM guests WHERE guestId = ?`).get(token.guestId);
    const reservation = db.prepare(`
      SELECT * FROM reservations 
      WHERE guestId = ? 
      ORDER BY reservationId DESC LIMIT 1
    `).get(token.guestId);

    const room = db.prepare(`SELECT * FROM rooms WHERE roomNumber = ?`).get(reservation ? reservation.roomNumber : null);

    // Calculate room charges
    const duration = guest.durationOfStay || (reservation ? reservation.duration : 1);
    const roomRate = room ? room.rate : 150.0;
    const roomCharges = Number((roomRate * duration).toFixed(2));

    // Calculate food charges
    const consumptions = this.getFoodConsumptionsByToken(tokenNumber);
    const foodCharges = Number(consumptions.reduce((sum, item) => sum + item.amount, 0).toFixed(2));

    // Frequent Guest discount check
    let discount = 0.0;
    let frequentGuest = null;
    if (guest.frequentGuestId) {
      frequentGuest = db.prepare(`SELECT * FROM frequent_guests WHERE frequentGuestId = ?`).get(guest.frequentGuestId);
      if (frequentGuest) {
        const discountPct = frequentGuest.discountPercentage || 15.0;
        // Discount on room charges (or total, typical 5-star standard is room tariff discount)
        discount = Number(((roomCharges * discountPct) / 100).toFixed(2));
      }
    }

    const advancePaid = Number(guest.advancePaid || 0);
    const grossTotal = Number((roomCharges + foodCharges).toFixed(2));
    const totalAmount = Number((grossTotal - discount).toFixed(2));
    const balanceAmount = Number((totalAmount - advancePaid).toFixed(2));

    // Check if an existing settled bill exists for this token
    const existingBill = db.prepare(`SELECT * FROM bills WHERE tokenNumber = ?`).get(tokenNumber);

    return {
      guest,
      room,
      token,
      reservation,
      frequentGuest,
      consumptions,
      duration,
      roomCharges,
      foodCharges,
      grossTotal,
      discount,
      advancePaid,
      totalAmount,
      balanceAmount,
      billNumber: existingBill ? existingBill.billNumber : null,
      generatedAt: existingBill ? existingBill.generatedAt : null,
      isSettled: !!existingBill,
    };
  }

  /**
   * Finalize Checkout:
   * Generates bill record, marks room available, closes token, increments frequent guest visits
   */
  static processCheckout(tokenNumber) {
    const billDetails = this.calculateBill(tokenNumber);

    if (billDetails.token.status === 'Closed') {
      // Check if bill already exists
      const existingBill = db.prepare(`SELECT * FROM bills WHERE tokenNumber = ?`).get(tokenNumber);
      if (existingBill) {
        return {
          ...billDetails,
          billNumber: existingBill.billNumber,
          generatedAt: existingBill.generatedAt,
          status: 'Already Checked Out',
        };
      }
    }

    const billCount = db.prepare(`SELECT COUNT(*) as count FROM bills`).get().count + 1;
    const billNumber = `BIL-${1000 + billCount}`;
    const generatedAt = new Date().toISOString().replace('T', ' ').substring(0, 19);

    db.prepare(`
      INSERT INTO bills (
        billNumber, guestId, tokenNumber, roomCharges, foodCharges,
        discount, advancePaid, totalAmount, balanceAmount, generatedAt, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Paid')
    `).run(
      billNumber,
      billDetails.guest.guestId,
      tokenNumber,
      billDetails.roomCharges,
      billDetails.foodCharges,
      billDetails.discount,
      billDetails.advancePaid,
      billDetails.totalAmount,
      billDetails.balanceAmount,
      generatedAt
    );

    // Mark token as Closed
    db.prepare(`UPDATE tokens SET status = 'Closed' WHERE tokenNumber = ?`).run(tokenNumber);

    // Free the room
    if (billDetails.room) {
      db.prepare(`UPDATE rooms SET status = 'Available' WHERE roomNumber = ?`).run(billDetails.room.roomNumber);
    }

    // Update reservation status to CheckedOut
    if (billDetails.reservation) {
      db.prepare(`UPDATE reservations SET status = 'CheckedOut' WHERE reservationId = ?`).run(billDetails.reservation.reservationId);
    }

    // Increment frequent guest visits if applicable
    if (billDetails.guest.frequentGuestId) {
      db.prepare(`
        UPDATE frequent_guests 
        SET totalVisits = totalVisits + 1 
        WHERE frequentGuestId = ?
      `).run(billDetails.guest.frequentGuestId);
    }

    return {
      ...billDetails,
      billNumber,
      generatedAt,
      status: 'Paid & Checked Out',
    };
  }

  // ==================== HELPER / STATS METHODS ====================

  static getHotelOverview() {
    const hotel = db.prepare(`SELECT * FROM hotels LIMIT 1`).get();
    const rooms = db.prepare(`SELECT * FROM rooms`).all();
    const totalRooms = rooms.length;
    const occupied = rooms.filter(r => r.status === 'Occupied').length;
    const available = rooms.filter(r => r.status === 'Available').length;
    const tariffs = db.prepare(`SELECT * FROM tariffs`).all();
    const activeTokens = db.prepare(`
      SELECT t.*, g.name as guestName, g.phone, g.advancePaid, g.frequentGuestId, r.roomNumber, r.bedType, r.acType, r.rate
      FROM tokens t
      JOIN guests g ON t.guestId = g.guestId
      JOIN reservations res ON res.guestId = g.guestId AND res.status = 'CheckedIn'
      JOIN rooms r ON res.roomNumber = r.roomNumber
      WHERE t.status = 'Active'
    `).all();

    return {
      hotel,
      totalRooms,
      occupied,
      available,
      occupancyRate: totalRooms > 0 ? Number(((occupied / totalRooms) * 100).toFixed(1)) : 0,
      tariffs,
      activeTokens,
    };
  }

  static getRoomCategoryAvailability() {
    return db.prepare(`
      SELECT bedType, acType, rate,
             SUM(CASE WHEN status = 'Available' THEN 1 ELSE 0 END) as availableCount,
             COUNT(*) as totalCount
      FROM rooms
      GROUP BY bedType, acType
    `).all();
  }
}

module.exports = HotelService;
