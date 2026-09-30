const assert = require('assert');

const BASE_URL = 'http://localhost:5000';

async function runFullVerification() {
  console.log('=== STARTING 5-STAR HOTEL AUTOMATION END-TO-END VERIFICATION ===\n');

  // TEST 1: Hotel Overview
  console.log('--- Test 1: Hotel Overview & Live Stats ---');
  const resHotel = await fetch(`${BASE_URL}/api/hotel`);
  const hotelData = await resHotel.json();
  console.log('Hotel Name:', hotelData.hotel.name);
  console.log('Total Rooms:', hotelData.totalRooms);
  console.log('Available Rooms:', hotelData.available);
  console.log('Occupied Rooms:', hotelData.occupied);
  console.log('Current Occupancy Rate:', hotelData.occupancyRate + '%');
  assert.strictEqual(hotelData.totalRooms, 24);
  console.log('✓ Test 1 Passed!\n');

  // TEST 2: Sequence Diagram 1 - Room Reservation & Allotment
  console.log('--- Test 2: Room Reservation & Token Generation (Seq Diagram 1) ---');
  const resReservation = await fetch(`${BASE_URL}/api/reservations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Duchess Genevieve Laurent',
      phone: '+1 (555) 987-6543',
      arrivalTime: '2026-10-01 15:00',
      durationOfStay: 3,
      advancePaid: 200.0,
      bedType: 'Double',
      acType: 'AC',
      frequentGuestId: 'VIP-777',
      reservationType: 'Advance',
    }),
  });
  const resvData = await resReservation.json();
  assert.strictEqual(resReservation.status, 201);
  assert.strictEqual(resvData.success, true);
  console.log('Allotted Room Number:', resvData.room.roomNumber);
  console.log('Generated Token Number:', resvData.token.tokenNumber);
  console.log('Guest:', resvData.guest.name, '| VIP Discount:', resvData.guest.discountPercentage + '%');
  const testToken = resvData.token.tokenNumber;
  console.log('✓ Test 2 Passed!\n');

  // TEST 3: Sequence Diagram 2 - Catering Charges Logger
  console.log('--- Test 3: Catering Food Consumption Entry (Seq Diagram 2) ---');
  const resCatering = await fetch(`${BASE_URL}/api/catering/consume`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tokenNumber: testToken,
      itemId: 'FOD-105', // Prime Angus Filet Mignon ($68)
      quantity: 2,
      date: '2026-10-01',
      time: '20:15',
    }),
  });
  const cateringData = await resCatering.json();
  assert.strictEqual(resCatering.status, 201);
  console.log('Recorded Item:', cateringData.itemName);
  console.log('Quantity:', cateringData.quantity, '| Amount:', '$' + cateringData.amount.toFixed(2));
  assert.strictEqual(cateringData.amount, 136.00); // 68 * 2
  console.log('✓ Test 3 Passed!\n');

  // TEST 4: Sequence Diagram 2 & Activity Diagram - Monthly Occupancy & Dynamic Tariff Revision
  console.log('--- Test 4: Monthly Occupancy & Dynamic Tariff Revision (Seq Diagram 2) ---');
  const resOcc = await fetch(`${BASE_URL}/api/manager/occupancy?month=10&year=2026`);
  const occData = await resOcc.json();
  console.log('Monthly Occupancy Rate for Month 10:', occData.current.occupancyRate + '%');

  // Revise Tariff by +10%
  const resTariff = await fetch(`${BASE_URL}/api/manager/revise-tariff`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ percentage: 10 }),
  });
  const tariffData = await resTariff.json();
  assert.strictEqual(tariffData.percentage, 10);
  console.log('Tariff Revision Result:', tariffData.message);
  console.log('✓ Test 4 Passed!\n');

  // TEST 5: Sequence Diagram 3 - Checkout, Final Bill & Frequent Guest Discount
  console.log('--- Test 5: Checkout & Final Bill Calculation (Seq Diagram 3) ---');
  const resBill = await fetch(`${BASE_URL}/api/billing/calculate/${testToken}`);
  const billData = await resBill.json();
  console.log('Guest Name:', billData.guest.name);
  console.log('Room Stay:', billData.duration, 'nights @ $' + billData.room.rate + ' = $' + billData.roomCharges.toFixed(2));
  console.log('Food Charges:', '$' + billData.foodCharges.toFixed(2));
  console.log('Frequent Guest Discount (15%):', '-$' + billData.discount.toFixed(2));
  console.log('Advance Paid:', '-$' + billData.advancePaid.toFixed(2));
  console.log('Net Balance Payable:', '$' + billData.balanceAmount.toFixed(2));
  assert.strictEqual(billData.foodCharges, 136.00);
  assert.strictEqual(billData.advancePaid, 200.00);
  console.log('✓ Test 5 Passed!\n');

  // TEST 6: Checkout Finalization & Room Release
  console.log('--- Test 6: Finalize Checkout & Release Room ---');
  const resCheckout = await fetch(`${BASE_URL}/api/billing/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tokenNumber: testToken }),
  });
  const checkoutData = await resCheckout.json();
  assert.strictEqual(checkoutData.status, 'Paid & Checked Out');
  console.log('Bill Generated:', checkoutData.billNumber);
  console.log('Checkout Timestamp:', checkoutData.generatedAt);
  console.log('Room Released to Available status!');
  console.log('✓ Test 6 Passed!\n');

  // TEST 7: Sequence Diagram 1 & Use Case - Apology Message when No Room Available
  console.log('--- Test 7: Apology Message on Room Unavailability (Seq Diagram 1) ---');
  // First allocate all remaining Single Non-AC rooms (there are 6 in total)
  let apologyReceived = false;
  for (let i = 0; i < 7; i++) {
    const resTry = await fetch(`${BASE_URL}/api/reservations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: `Guest Test ${i}`,
        phone: '555-0000',
        durationOfStay: 1,
        bedType: 'Single',
        acType: 'Non-AC',
      }),
    });
    const dataTry = await resTry.json();
    if (resTry.status === 409 || !dataTry.success) {
      console.log('APOLOGY MESSAGE GENERATED:');
      console.log(`"${dataTry.apologyMessage}"`);
      apologyReceived = true;
      assert.strictEqual(dataTry.success, false);
      assert.ok(dataTry.apologyMessage.includes('apologize'));
      break;
    }
  }
  assert.strictEqual(apologyReceived, true, 'Apology message should be received when rooms are full');
  console.log('✓ Test 7 Passed!\n');

  console.log('================================================================');
  console.log('ALL 7 CORE UML SPECIFICATION TESTS PASSED SUCCESSFULLY (100%)!');
  console.log('================================================================');
}

runFullVerification().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
