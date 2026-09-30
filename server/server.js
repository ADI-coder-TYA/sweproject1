const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./database');
const HotelService = require('./hotelService');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ==================== API ROUTES ====================

// 1. Hotel Overview & Real-time Stats
app.get('/api/hotel', (req, res) => {
  try {
    const overview = HotelService.getHotelOverview();
    res.json(overview);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Room Inventory & Availability
app.get('/api/rooms', (req, res) => {
  try {
    const { bedType, acType, status } = req.query;
    let query = `SELECT * FROM rooms WHERE 1=1`;
    const params = [];

    if (bedType) {
      query += ` AND bedType = ?`;
      params.push(bedType);
    }
    if (acType) {
      query += ` AND acType = ?`;
      params.push(acType);
    }
    if (status) {
      query += ` AND status = ?`;
      params.push(status);
    }

    query += ` ORDER BY roomNumber ASC`;
    const rooms = db.prepare(query).all(...params);
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/rooms/categories', (req, res) => {
  try {
    const categories = HotelService.getRoomCategoryAvailability();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/rooms/check-availability', (req, res) => {
  try {
    const { bedType, acType, duration = 1 } = req.body;
    const availableRooms = HotelService.checkAvailability(bedType, acType);
    if (!availableRooms || availableRooms.length === 0) {
      return res.json({
        available: false,
        apologyMessage: `We sincerely apologize, but no ${bedType || 'selected'} Bed (${acType || ''}) suites are currently available for the requested schedule.`,
        availableCategories: HotelService.getRoomCategoryAvailability(),
      });
    }
    const sample = availableRooms[0];
    res.json({
      available: true,
      availableCount: availableRooms.length,
      sampleRoom: sample,
      rate: sample.rate,
      totalEstimated: sample.rate * Number(duration),
      bedType: sample.bedType,
      acType: sample.acType,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Reservations & Room Allotment (Sequence Diagram 1)
app.post('/api/reservations', (req, res) => {
  try {
    const { name, phone, arrivalTime, durationOfStay, advancePaid, bedType, acType, frequentGuestId, reservationType } = req.body;

    if (!name || !bedType || !acType || !durationOfStay) {
      return res.status(400).json({ error: 'Name, Bed Type, AC Type, and Duration of Stay are required.' });
    }

    const result = HotelService.makeReservation({
      name,
      phone: phone || 'N/A',
      arrivalTime,
      durationOfStay: Number(durationOfStay),
      advancePaid: Number(advancePaid) || 0,
      bedType,
      acType,
      frequentGuestId: frequentGuestId ? frequentGuestId.trim() : null,
      reservationType: reservationType || 'OnSpot',
    });

    if (!result.success) {
      // 409 Conflict with apology message as per Sequence Diagram 1
      return res.status(409).json(result);
    }

    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/reservations', (req, res) => {
  try {
    const reservations = db.prepare(`
      SELECT res.*, g.name as guestName, g.phone, g.advancePaid, g.frequentGuestId,
             r.bedType, r.acType, r.rate, t.tokenNumber
      FROM reservations res
      JOIN guests g ON res.guestId = g.guestId
      JOIN rooms r ON res.roomNumber = r.roomNumber
      LEFT JOIN tokens t ON t.guestId = g.guestId AND t.status = 'Active'
      ORDER BY res.reservationId DESC
    `).all();
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Catering Management (Sequence Diagram 2)
app.get('/api/catering/menu', (req, res) => {
  try {
    const items = db.prepare(`SELECT * FROM food_items ORDER BY category ASC, price ASC`).all();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/catering/consume', (req, res) => {
  try {
    const { tokenNumber, itemId, quantity, date, time } = req.body;
    if (!tokenNumber || !itemId) {
      return res.status(400).json({ error: 'Token Number and Food Item are required.' });
    }

    const record = HotelService.recordFoodConsumption({
      tokenNumber: tokenNumber.trim(),
      itemId,
      quantity: Number(quantity) || 1,
      date,
      time,
    });

    res.status(201).json(record);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/catering/orders/:tokenNumber', (req, res) => {
  try {
    const orders = HotelService.getFoodConsumptionsByToken(req.params.tokenNumber);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Manager Occupancy & Dynamic Tariff Revision (Sequence Diagram 2 & Activity Diagram)
app.get('/api/manager/occupancy', (req, res) => {
  try {
    const now = new Date();
    const month = req.query.month ? Number(req.query.month) : now.getMonth() + 1;
    const year = req.query.year ? Number(req.query.year) : now.getFullYear();

    const monthlyData = HotelService.calculateOccupancyRate(month, year);

    // Also get all historical records for graph
    const history = db.prepare(`SELECT * FROM occupancies ORDER BY year ASC, month ASC`).all();

    res.json({ current: monthlyData, history });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/manager/revise-tariff', (req, res) => {
  try {
    const { percentage, tariffId } = req.body;
    if (percentage === undefined || percentage === null) {
      return res.status(400).json({ error: 'Percentage is required.' });
    }

    const result = HotelService.reviseRate(percentage, tariffId);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 6. Checkout & Billing (Sequence Diagram 3 & Statechart)
app.get('/api/billing/calculate/:tokenNumber', (req, res) => {
  try {
    const calculation = HotelService.calculateBill(req.params.tokenNumber.trim());
    res.json(calculation);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

app.post('/api/billing/checkout', (req, res) => {
  try {
    const { tokenNumber } = req.body;
    if (!tokenNumber) {
      return res.status(400).json({ error: 'Token number is required.' });
    }

    const receipt = HotelService.processCheckout(tokenNumber.trim());
    res.json(receipt);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/bills', (req, res) => {
  try {
    const bills = db.prepare(`
      SELECT b.*, g.name as guestName, g.phone
      FROM bills b
      JOIN guests g ON b.guestId = g.guestId
      ORDER BY b.generatedAt DESC
    `).all();
    res.json(bills);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 7. Frequent Guest Directory
app.get('/api/frequent-guests', (req, res) => {
  try {
    const list = db.prepare(`SELECT * FROM frequent_guests ORDER BY totalVisits DESC`).all();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/frequent-guests/:id', (req, res) => {
  try {
    const guest = db.prepare(`SELECT * FROM frequent_guests WHERE frequentGuestId = ?`).get(req.params.id);
    if (!guest) return res.status(404).json({ error: 'Frequent guest ID not recognized.' });
    res.json(guest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve frontend build in production
const clientDistPath = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientDistPath));

// Catch-all fallback for SPA
app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API route not found' });
  }
  const indexHtml = path.join(clientDistPath, 'index.html');
  res.sendFile(indexHtml, (err) => {
    if (err) {
      res.send(`5-Star Hotel Automation Backend is running on port ${PORT}. Frontend will be served once built.`);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Hotel Automation Server listening on http://localhost:${PORT}`);
});
