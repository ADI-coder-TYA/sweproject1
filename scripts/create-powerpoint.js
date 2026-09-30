const pptxgen = require('pptxgenjs');
const path = require('path');
const fs = require('fs');

async function createDeck() {
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9'; // 10 x 5.625 inches
  pptx.author = 'Software Engineering Team';
  pptx.company = 'The Grand Horizon Hotel Automation';
  pptx.title = '5-Star Hotel Automation System — Software Engineering Defense';

  // Design Tokens (Aman/Rosewood Quiet Luxury Palette)
  const COLOR_BG = 'FBF9F5';
  const COLOR_SURFACE = 'FFFFFF';
  const COLOR_PRIMARY = '1C1917'; // Charcoal
  const COLOR_SECONDARY = '57534E'; // Stone Gray
  const COLOR_MUTED = '78716C';
  const COLOR_GOLD = '8C7355'; // Antique Gold
  const COLOR_GOLD_LIGHT = 'BFA15F';
  const COLOR_BORDER = 'E7DFD5';
  const COLOR_PINE = '15803D';
  const COLOR_CARD = 'F7F4EE';

  const FONT_SERIF = 'Georgia';
  const FONT_SANS = 'Calibri';

  // Helper: Add Standard Header to a slide
  function addHeader(slide, category, title) {
    slide.background = { color: COLOR_BG };

    // Top Category / Eyebrow
    slide.addText(category.toUpperCase(), {
      x: 0.8,
      y: 0.35,
      w: 8.4,
      h: 0.25,
      fontFace: FONT_SANS,
      fontSize: 8.5,
      color: COLOR_GOLD,
      bold: true,
      charSpacing: 3
    });

    // Main Slide Title
    slide.addText(title, {
      x: 0.8,
      y: 0.55,
      w: 8.4,
      h: 0.45,
      fontFace: FONT_SERIF,
      fontSize: 18,
      color: COLOR_PRIMARY,
      bold: false
    });

    // Hairline Separator Line
    slide.addShape(pptx.ShapeType.line, {
      x: 0.8,
      y: 1.05,
      w: 8.4,
      h: 0,
      line: { color: COLOR_BORDER, width: 1 }
    });

    // Bottom subtle footer
    slide.addText('THE GRAND HORIZON • 5-STAR HOTEL AUTOMATION SYSTEM • SOFTWARE ENGINEERING DEFENSE', {
      x: 0.8,
      y: 5.3,
      w: 8.4,
      h: 0.2,
      fontFace: FONT_SANS,
      fontSize: 7.5,
      color: COLOR_MUTED,
      charSpacing: 1.5
    });
  }

  // ==========================================
  // SLIDE 1: Title Slide (Dark Luxury Editorial)
  // ==========================================
  {
    const slide = pptx.addSlide();
    slide.background = { color: '1C1917' };

    // Decorative Hairline Frame
    slide.addShape(pptx.ShapeType.rect, {
      x: 0.6,
      y: 0.6,
      w: 8.8,
      h: 4.425,
      fill: { color: '1C1917' },
      line: { color: '3F3935', width: 1 }
    });

    slide.addText('ACADEMIC SOFTWARE ENGINEERING DEFENSE • CSE DEPARTMENT', {
      x: 1.0,
      y: 1.2,
      w: 8.0,
      h: 0.3,
      fontFace: FONT_SANS,
      fontSize: 9,
      color: 'BFA15F',
      charSpacing: 3,
      bold: true
    });

    slide.addText('THE GRAND HORIZON', {
      x: 1.0,
      y: 1.55,
      w: 8.0,
      h: 0.9,
      fontFace: FONT_SERIF,
      fontSize: 34,
      color: 'FFFFFF',
      bold: false,
      charSpacing: 2
    });

    slide.addText('Automation of Activities for a 5-Star Luxury Resort & Hotel', {
      x: 1.0,
      y: 2.45,
      w: 8.0,
      h: 0.4,
      fontFace: FONT_SERIF,
      fontSize: 16,
      color: 'D4C5B9',
      italic: true
    });

    slide.addShape(pptx.ShapeType.line, {
      x: 1.0,
      y: 3.0,
      w: 8.0,
      h: 0,
      line: { color: '3F3935', width: 1 }
    });

    // 3 Highlight Pillars
    slide.addText([
      { text: 'Strict UML Modeling: ', options: { bold: true, color: 'FFFFFF' } },
      { text: 'Sequence 1-3, Statechart, Use Case & Class Diagram\n', options: { color: 'A8A29E' } },
      { text: 'Dynamic Tariff Control: ', options: { bold: true, color: 'FFFFFF' } },
      { text: 'Percentage revisions based on monthly average occupancy\n', options: { color: 'A8A29E' } },
      { text: '100% Free Stack: ', options: { bold: true, color: 'FFFFFF' } },
      { text: 'React 18, Node.js/Express, SQLite WAL, Vercel/Render', options: { color: 'A8A29E' } }
    ], {
      x: 1.0,
      y: 3.2,
      w: 8.0,
      h: 1.2,
      fontFace: FONT_SANS,
      fontSize: 10,
      lineSpacing: 20
    });
  }

  // ==========================================
  // SLIDE 2: Executive Summary & Problem Statement
  // ==========================================
  {
    const slide = pptx.addSlide();
    addHeader(slide, '01. Executive Overview', 'Problem Statement & Engineering Objectives');

    // Left Box: Problem Statement
    slide.addShape(pptx.ShapeType.rect, {
      x: 0.8,
      y: 1.2,
      w: 4.1,
      h: 3.9,
      fill: { color: COLOR_SURFACE },
      line: { color: COLOR_BORDER, width: 1 }
    });

    slide.addText('THE PROBLEM STATEMENT', {
      x: 1.0,
      y: 1.4,
      w: 3.7,
      h: 0.3,
      fontFace: FONT_SANS,
      fontSize: 9,
      color: COLOR_GOLD,
      bold: true,
      charSpacing: 2
    });

    slide.addText([
      { text: 'A luxury 5-star hotel requires an automated system to manage rooms, bookings, catering, tariffs, and checkout folios.\n\n', options: { color: COLOR_PRIMARY, bold: true } },
      { text: '• 24 Guest Suites: ', options: { bold: true } },
      { text: 'Single Bed vs Double Bed, Air Conditioned (AC) vs Non-AC.\n', options: {} },
      { text: '• Dynamic Tariff Variation: ', options: { bold: true } },
      { text: 'Rates fluctuate based on monthly average occupancy. Software computes average occupancy for managers to calibrate tariffs (+% / -%).\n', options: {} },
      { text: '• Reservation & Allotment: ', options: { bold: true } },
      { text: 'Advance or spot booking, unique token issuance, or formal apology message on full occupancy.\n', options: {} },
      { text: '• In-Room Dining & Folio Settlement: ', options: { bold: true } },
      { text: 'Token-based food consumption logging, advance deduction, and Frequent Guest ID loyalty discount on checkout.', options: {} }
    ], {
      x: 1.0,
      y: 1.75,
      w: 3.7,
      h: 3.2,
      fontFace: FONT_SANS,
      fontSize: 9.5,
      lineSpacing: 16,
      color: COLOR_SECONDARY
    });

    // Right Box: Engineering Objectives
    slide.addShape(pptx.ShapeType.rect, {
      x: 5.1,
      y: 1.2,
      w: 4.1,
      h: 3.9,
      fill: { color: COLOR_CARD },
      line: { color: COLOR_BORDER, width: 1 }
    });

    slide.addText('CORE ENGINEERING CONSTRAINTS', {
      x: 5.3,
      y: 1.4,
      w: 3.7,
      h: 0.3,
      fontFace: FONT_SANS,
      fontSize: 9,
      color: COLOR_GOLD,
      bold: true,
      charSpacing: 2
    });

    slide.addText([
      { text: '1. Strict UML Specification Alignment\n', options: { bold: true, color: COLOR_PRIMARY } },
      { text: 'Fully implements all entities, lifelines, messages, states, and operations from all 5 supplied UML documents.\n\n', options: { color: COLOR_SECONDARY } },
      { text: '2. 100% Free & Open-Source Stack\n', options: { bold: true, color: COLOR_PRIMARY } },
      { text: 'No proprietary cloud services. Built entirely using React, Express, and local SQLite database.\n\n', options: { color: COLOR_SECONDARY } },
      { text: '3. Quiet Luxury 5-Star Presentation\n', options: { bold: true, color: COLOR_PRIMARY } },
      { text: 'Aman/Rosewood editorial design system (Cormorant Garamond, warm neutrals, zero neon/gradients), with role-based separation between public guests and staff.\n\n', options: { color: COLOR_SECONDARY } },
      { text: '4. Automated Verification Suite\n', options: { bold: true, color: COLOR_PRIMARY } },
      { text: 'Automated test harness testing all 7 core UML flows with 100% pass rate.', options: { color: COLOR_SECONDARY } }
    ], {
      x: 5.3,
      y: 1.75,
      w: 3.7,
      h: 3.2,
      fontFace: FONT_SANS,
      fontSize: 9.5,
      lineSpacing: 16
    });
  }

  // ==========================================
  // SLIDE 3: System Architecture
  // ==========================================
  {
    const slide = pptx.addSlide();
    addHeader(slide, '02. Technical Architecture', '3-Tier Layered Software Architecture');

    const tiers = [
      {
        num: 'TIER 01',
        name: 'Presentation Layer',
        subtitle: 'React 18 + Vite SPA',
        details: [
          '• Aman/Rosewood Quiet Luxury Design System',
          '• Cormorant Garamond & Montserrat Typography',
          '• Role-Based View Separation (Guest vs Staff)',
          '• 4 Dedicated Staff Terminals (Front Desk, Dining, Manager, Audit)',
          '• Interactive Availability Bar & Guest Booking Modal',
          '• Printable SVG/HTML Tax Folio Voucher Modals'
        ]
      },
      {
        num: 'TIER 02',
        name: 'Application & Business Layer',
        subtitle: 'Node.js & Express 5.x REST API',
        details: [
          '• HotelService Domain Controller (UML methods)',
          '• checkAvailability() & allocateRoom() logic',
          '• generateToken() unique 4-digit token algorithm',
          '• calculateOccupancyRate() monthly engine',
          '• reviseRate() dynamic percentage calibrator',
          '• calculateBill() with 15% VIP loyalty discount'
        ]
      },
      {
        num: 'TIER 03',
        name: 'Persistence & Database Layer',
        subtitle: 'SQLite Relational Database (WAL)',
        details: [
          '• 10 Relational Tables matching UML Entities',
          '• Foreign Key Constraints & Cascading Updates',
          '• Write-Ahead Logging (WAL) for concurrency',
          '• Pre-seeded with 24 Suites, Tariffs, & VIPs',
          '• Zero-cost, file-based ACID compliance',
          '• Ready for SQLite Cloud / Turso if deployed'
        ]
      }
    ];

    tiers.forEach((tier, i) => {
      const x = 0.8 + i * 2.86;
      slide.addShape(pptx.ShapeType.rect, {
        x,
        y: 1.25,
        w: 2.68,
        h: 3.8,
        fill: { color: COLOR_SURFACE },
        line: { color: COLOR_BORDER, width: 1 }
      });

      slide.addText(tier.num, {
        x: x + 0.2,
        y: 1.45,
        w: 2.28,
        h: 0.25,
        fontFace: FONT_SANS,
        fontSize: 8.5,
        color: COLOR_GOLD,
        bold: true,
        charSpacing: 2
      });

      slide.addText(tier.name, {
        x: x + 0.2,
        y: 1.7,
        w: 2.28,
        h: 0.35,
        fontFace: FONT_SERIF,
        fontSize: 14,
        color: COLOR_PRIMARY,
        bold: false
      });

      slide.addText(tier.subtitle, {
        x: x + 0.2,
        y: 2.05,
        w: 2.28,
        h: 0.25,
        fontFace: FONT_SANS,
        fontSize: 9,
        color: COLOR_MUTED,
        italic: true
      });

      slide.addShape(pptx.ShapeType.line, {
        x: x + 0.2,
        y: 2.35,
        w: 2.28,
        h: 0,
        line: { color: COLOR_BORDER, width: 1 }
      });

      slide.addText(tier.details.join('\n'), {
        x: x + 0.2,
        y: 2.5,
        w: 2.28,
        h: 2.3,
        fontFace: FONT_SANS,
        fontSize: 8.8,
        color: COLOR_SECONDARY,
        lineSpacing: 16
      });
    });
  }

  // ==========================================
  // SLIDE 4: UML Use Case Diagram + UI Mapping
  // ==========================================
  {
    const slide = pptx.addSlide();
    addHeader(slide, '03. UML Modeling: Use Case Analysis', 'Stakeholder Actors & Operational Scope');

    // Left: Diagram Image
    const diagPath = path.join(__dirname, '..', 'presentation_assets', 'diagrams', 'uml_use_case.png');
    if (fs.existsSync(diagPath)) {
      slide.addImage({
        path: diagPath,
        x: 0.8,
        y: 1.25,
        w: 4.8,
        h: 3.8
      });
    }

    // Right: Explanatory Breakdown Card
    slide.addShape(pptx.ShapeType.rect, {
      x: 5.8,
      y: 1.25,
      w: 3.4,
      h: 3.8,
      fill: { color: COLOR_SURFACE },
      line: { color: COLOR_BORDER, width: 1 }
    });

    slide.addText('ACTORS & USE CASE MAPPING', {
      x: 6.0,
      y: 1.45,
      w: 3.0,
      h: 0.25,
      fontFace: FONT_SANS,
      fontSize: 8.5,
      color: COLOR_GOLD,
      bold: true,
      charSpacing: 2
    });

    slide.addText([
      { text: '1. Guest (External Actor)\n', options: { bold: true, color: COLOR_PRIMARY } },
      { text: 'Checks real-time availability, submits room requests, pays advance, consumes catering, settles folio.\n\n', options: { color: COLOR_SECONDARY } },
      { text: '2. Receptionist (Front Desk)\n', options: { bold: true, color: COLOR_PRIMARY } },
      { text: 'Registers guest data, allocates suites, triggers polite apology if unavailable, issues tokens, executes checkout.\n\n', options: { color: COLOR_SECONDARY } },
      { text: '3. Catering Manager\n', options: { bold: true, color: COLOR_PRIMARY } },
      { text: 'Selects food items, specifies quantities, records consumption against guest token with date/time.\n\n', options: { color: COLOR_SECONDARY } },
      { text: '4. Hotel Manager\n', options: { bold: true, color: COLOR_PRIMARY } },
      { text: 'Monitors monthly occupancy rate, decides percentage tariff revision (+% / -%), recalibrates room prices.', options: { color: COLOR_SECONDARY } }
    ], {
      x: 6.0,
      y: 1.75,
      w: 3.0,
      h: 3.1,
      fontFace: FONT_SANS,
      fontSize: 8.8,
      lineSpacing: 14
    });
  }

  // ==========================================
  // SLIDE 5: UML Sequence Diagram 1 + Live UI Mapping
  // ==========================================
  {
    const slide = pptx.addSlide();
    addHeader(slide, '04. UML Sequence Diagram 1', 'Room Reservation, Allotment & Token Generation');

    // Left: Diagram
    const diagPath = path.join(__dirname, '..', 'presentation_assets', 'diagrams', 'uml_sequence_1.png');
    if (fs.existsSync(diagPath)) {
      slide.addImage({
        path: diagPath,
        x: 0.8,
        y: 1.25,
        w: 4.4,
        h: 3.8
      });
    }

    // Right: Live UI Screenshot
    const ssPath = path.join(__dirname, '..', 'presentation_assets', 'screenshots', '04_front_desk.png');
    if (fs.existsSync(ssPath)) {
      slide.addImage({
        path: ssPath,
        x: 5.4,
        y: 1.25,
        w: 3.8,
        h: 2.4,
        rounding: true
      });
    }

    // Bottom Right Card: Technical Explanation
    slide.addShape(pptx.ShapeType.rect, {
      x: 5.4,
      y: 3.75,
      w: 3.8,
      h: 1.3,
      fill: { color: COLOR_CARD },
      line: { color: COLOR_BORDER, width: 1 }
    });

    slide.addText([
      { text: 'Implementation Verification (Sequence 1):\n', options: { bold: true, color: COLOR_PRIMARY, fontSize: 9 } },
      { text: '• checkAvailability(bed, ac): Queries DB for matching suite.\n', options: { fontSize: 8.2, color: COLOR_SECONDARY } },
      { text: '• alt Room Available: Allots room, marks "Occupied", and generates unique TKN-XXXX token.\n', options: { fontSize: 8.2, color: COLOR_PINE, bold: true } },
      { text: '• alt No Room Available: Launches polite formal apology modal with alternative categories.', options: { fontSize: 8.2, color: 'B91C1C' } }
    ], {
      x: 5.55,
      y: 3.85,
      w: 3.5,
      h: 1.1,
      fontFace: FONT_SANS,
      lineSpacing: 13
    });
  }

  // ==========================================
  // SLIDE 6: Sequence Diagram 2 (Part A) — Catering Logger
  // ==========================================
  {
    const slide = pptx.addSlide();
    addHeader(slide, '05. UML Sequence Diagram 2 (Part A)', 'Token-Based In-Room Dining & Catering Logger');

    const diagPath = path.join(__dirname, '..', 'presentation_assets', 'diagrams', 'uml_sequence_2.png');
    if (fs.existsSync(diagPath)) {
      slide.addImage({
        path: diagPath,
        x: 0.8,
        y: 1.25,
        w: 4.4,
        h: 3.8
      });
    }

    const ssPath = path.join(__dirname, '..', 'presentation_assets', 'screenshots', '05_catering.png');
    if (fs.existsSync(ssPath)) {
      slide.addImage({
        path: ssPath,
        x: 5.4,
        y: 1.25,
        w: 3.8,
        h: 2.4,
        rounding: true
      });
    }

    slide.addShape(pptx.ShapeType.rect, {
      x: 5.4,
      y: 3.75,
      w: 3.8,
      h: 1.3,
      fill: { color: COLOR_CARD },
      line: { color: COLOR_BORDER, width: 1 }
    });

    slide.addText([
      { text: 'Implementation Verification (Catering Logging):\n', options: { bold: true, color: COLOR_PRIMARY, fontSize: 9 } },
      { text: '• Token-Driven Decoupling: Orders logged strictly by guest token (e.g. TKN-1001), shielding guest identity.\n', options: { fontSize: 8.2, color: COLOR_SECONDARY } },
      { text: '• Atomic Charge Calculation: FoodItem.price × quantity recorded with date and time.\n', options: { fontSize: 8.2, color: COLOR_SECONDARY } },
      { text: '• Direct Allotment Link: Aggregated dynamically at checkout into final folio.', options: { fontSize: 8.2, color: COLOR_PINE, bold: true } }
    ], {
      x: 5.55,
      y: 3.85,
      w: 3.5,
      h: 1.1,
      fontFace: FONT_SANS,
      lineSpacing: 13
    });
  }

  // ==========================================
  // SLIDE 7: Sequence Diagram 2 (Part B) — Dynamic Tariff
  // ==========================================
  {
    const slide = pptx.addSlide();
    addHeader(slide, '06. UML Sequence Diagram 2 (Part B)', 'Monthly Occupancy & Dynamic Percentage Tariff Revision');

    const diagPath = path.join(__dirname, '..', 'presentation_assets', 'diagrams', 'uml_sequence_2.png');
    if (fs.existsSync(diagPath)) {
      slide.addImage({
        path: diagPath,
        x: 0.8,
        y: 1.25,
        w: 4.4,
        h: 3.8
      });
    }

    const ssPath = path.join(__dirname, '..', 'presentation_assets', 'screenshots', '06_manager_tariff.png');
    if (fs.existsSync(ssPath)) {
      slide.addImage({
        path: ssPath,
        x: 5.4,
        y: 1.25,
        w: 3.8,
        h: 2.4,
        rounding: true
      });
    }

    slide.addShape(pptx.ShapeType.rect, {
      x: 5.4,
      y: 3.75,
      w: 3.8,
      h: 1.3,
      fill: { color: COLOR_CARD },
      line: { color: COLOR_BORDER, width: 1 }
    });

    slide.addText([
      { text: 'Dynamic Tariff Calibration Engine:\n', options: { bold: true, color: COLOR_PRIMARY, fontSize: 9 } },
      { text: '• Occupancy Rate (%) = (Occupied Room-Days / Total Available Room-Days) × 100\n', options: { fontSize: 8.2, color: COLOR_GOLD, bold: true } },
      { text: '• Percentage Revision: Manager applies +% (peak) or -% (off-peak) via slider.\n', options: { fontSize: 8.2, color: COLOR_SECONDARY } },
      { text: '• Immediate Update: Room base rates & future booking calculations update automatically.', options: { fontSize: 8.2, color: COLOR_PINE, bold: true } }
    ], {
      x: 5.55,
      y: 3.85,
      w: 3.5,
      h: 1.1,
      fontFace: FONT_SANS,
      lineSpacing: 13
    });
  }

  // ==========================================
  // SLIDE 8: Sequence Diagram 3 — Checkout & Folio
  // ==========================================
  {
    const slide = pptx.addSlide();
    addHeader(slide, '07. UML Sequence Diagram 3', 'Guest Checkout, Loyalty Discounts & Folio Settlement');

    const diagPath = path.join(__dirname, '..', 'presentation_assets', 'diagrams', 'uml_sequence_3.png');
    if (fs.existsSync(diagPath)) {
      slide.addImage({
        path: diagPath,
        x: 0.8,
        y: 1.25,
        w: 4.4,
        h: 3.8
      });
    }

    const ssPath = path.join(__dirname, '..', 'presentation_assets', 'screenshots', '07_tax_invoice_folio.png');
    if (fs.existsSync(ssPath)) {
      slide.addImage({
        path: ssPath,
        x: 5.4,
        y: 1.25,
        w: 3.8,
        h: 2.4,
        rounding: true
      });
    }

    slide.addShape(pptx.ShapeType.rect, {
      x: 5.4,
      y: 3.75,
      w: 3.8,
      h: 1.3,
      fill: { color: COLOR_CARD },
      line: { color: COLOR_BORDER, width: 1 }
    });

    slide.addText([
      { text: 'Checkout & Settlement Flow:\n', options: { bold: true, color: COLOR_PRIMARY, fontSize: 9 } },
      { text: '• Complete Charge Aggregation: (Room Rate × Nights) + Σ Catering Consumptions.\n', options: { fontSize: 8.2, color: COLOR_SECONDARY } },
      { text: '• Frequent Guest Loyalty: Auto-applies 15% VIP discount on room charges.\n', options: { fontSize: 8.2, color: COLOR_GOLD, bold: true } },
      { text: '• Net Balance: Deducts advance deposit; releases room to "Available" status.', options: { fontSize: 8.2, color: COLOR_PINE, bold: true } }
    ], {
      x: 5.55,
      y: 3.85,
      w: 3.5,
      h: 1.1,
      fontFace: FONT_SANS,
      lineSpacing: 13
    });
  }

  // ==========================================
  // SLIDE 9: UML Statechart Diagram
  // ==========================================
  {
    const slide = pptx.addSlide();
    addHeader(slide, '08. UML State Machine Modeling', 'Room & Reservation Lifecycle Statechart');

    const diagPath = path.join(__dirname, '..', 'presentation_assets', 'diagrams', 'uml_statechart.png');
    if (fs.existsSync(diagPath)) {
      slide.addImage({
        path: diagPath,
        x: 0.8,
        y: 1.25,
        w: 5.2,
        h: 3.8
      });
    }

    slide.addShape(pptx.ShapeType.rect, {
      x: 6.2,
      y: 1.25,
      w: 3.0,
      h: 3.8,
      fill: { color: COLOR_SURFACE },
      line: { color: COLOR_BORDER, width: 1 }
    });

    slide.addText('FINITE STATE MACHINE', {
      x: 6.4,
      y: 1.45,
      w: 2.6,
      h: 0.25,
      fontFace: FONT_SANS,
      fontSize: 8.5,
      color: COLOR_GOLD,
      bold: true,
      charSpacing: 2
    });

    const states = [
      { name: '1. Available', desc: 'Suite ready for allotment in pool.' },
      { name: '2. Reserved', desc: 'Advance booking logged with arrival date.' },
      { name: '3. CheckedIn', desc: 'Guest arrived, advance deposited, token issued.' },
      { name: '4. Staying', desc: 'In-room dining charges accumulating.' },
      { name: '5. BillGeneration', desc: 'Charges aggregated, VIP discount evaluated.' },
      { name: '6. CheckedOut', desc: 'Folio settled, token marked Closed.' },
      { name: '7. Released', desc: 'Room reverts to Available status.' }
    ];

    let yPos = 1.75;
    states.forEach(s => {
      slide.addText([
        { text: s.name + ': ', options: { bold: true, color: COLOR_PRIMARY } },
        { text: s.desc, options: { color: COLOR_SECONDARY } }
      ], {
        x: 6.4,
        y: yPos,
        w: 2.6,
        h: 0.4,
        fontFace: FONT_SANS,
        fontSize: 8.2
      });
      yPos += 0.42;
    });
  }

  // ==========================================
  // SLIDE 10: UML Class Diagram
  // ==========================================
  {
    const slide = pptx.addSlide();
    addHeader(slide, '09. UML Class Diagram & Domain Model', '10 Interconnected Domain Entities');

    const diagPath = path.join(__dirname, '..', 'presentation_assets', 'diagrams', 'uml_class_diagram.png');
    if (fs.existsSync(diagPath)) {
      slide.addImage({
        path: diagPath,
        x: 0.8,
        y: 1.25,
        w: 5.2,
        h: 3.8
      });
    }

    slide.addShape(pptx.ShapeType.rect, {
      x: 6.2,
      y: 1.25,
      w: 3.0,
      h: 3.8,
      fill: { color: COLOR_SURFACE },
      line: { color: COLOR_BORDER, width: 1 }
    });

    slide.addText('CLASS MODEL SPECIFICATION', {
      x: 6.4,
      y: 1.45,
      w: 2.6,
      h: 0.25,
      fontFace: FONT_SANS,
      fontSize: 8.5,
      color: COLOR_GOLD,
      bold: true,
      charSpacing: 2
    });

    slide.addText([
      { text: '• Hotel: ', options: { bold: true, color: COLOR_PRIMARY } },
      { text: 'Root aggregate containing 24 rooms.\n', options: { color: COLOR_SECONDARY } },
      { text: '• Room: ', options: { bold: true, color: COLOR_PRIMARY } },
      { text: 'Single/Double × AC/Non-AC combinations.\n', options: { color: COLOR_SECONDARY } },
      { text: '• Tariff: ', options: { bold: true, color: COLOR_PRIMARY } },
      { text: 'Encapsulates base rate & % revision logic.\n', options: { color: COLOR_SECONDARY } },
      { text: '• Occupancy: ', options: { bold: true, color: COLOR_PRIMARY } },
      { text: 'Tracks historical monthly utilization.\n', options: { color: COLOR_SECONDARY } },
      { text: '• Guest: ', options: { bold: true, color: COLOR_PRIMARY } },
      { text: 'Personal details, advance deposit, Frequent ID.\n', options: { color: COLOR_SECONDARY } },
      { text: '• Token: ', options: { bold: true, color: COLOR_PRIMARY } },
      { text: 'Unique access key for guest stays.\n', options: { color: COLOR_SECONDARY } },
      { text: '• FoodItem & FoodConsumption: ', options: { bold: true, color: COLOR_PRIMARY } },
      { text: 'Menu items linked to stay tokens.\n', options: { color: COLOR_SECONDARY } },
      { text: '• Bill: ', options: { bold: true, color: COLOR_PRIMARY } },
      { text: 'Audited tax folio invoice ledger.', options: { color: COLOR_SECONDARY } }
    ], {
      x: 6.4,
      y: 1.75,
      w: 2.6,
      h: 3.1,
      fontFace: FONT_SANS,
      fontSize: 8.2,
      lineSpacing: 14
    });
  }

  // ==========================================
  // SLIDE 11: Relational Database Schema
  // ==========================================
  {
    const slide = pptx.addSlide();
    addHeader(slide, '10. Relational Database Design', '10 Normalized SQLite Relational Tables');

    const schemaTables = [
      {
        name: 'rooms',
        pk: 'roomNumber',
        cols: 'bedType, acType, rate, status, tariffId',
        desc: 'Inventory of 24 suites'
      },
      {
        name: 'tariffs',
        pk: 'tariffId',
        cols: 'bedType, acType, rate, lastRevisedDate',
        desc: 'Base rate rules'
      },
      {
        name: 'guests',
        pk: 'guestId',
        cols: 'name, phone, arrivalTime, durationOfStay, advancePaid, frequentGuestId',
        desc: 'Registered guest profiles'
      },
      {
        name: 'reservations',
        pk: 'reservationId',
        cols: 'guestId, roomNumber, arrivalDate, duration, reservationType, status',
        desc: 'Allotment records'
      },
      {
        name: 'tokens',
        pk: 'tokenNumber',
        cols: 'guestId, issueDate, issueTime, status',
        desc: '4-digit unique stay tokens'
      },
      {
        name: 'food_items',
        pk: 'itemId',
        cols: 'name, category, price, description',
        desc: 'Gourmet dining menu'
      },
      {
        name: 'food_consumptions',
        pk: 'consumptionId',
        cols: 'tokenNumber, itemId, quantity, date, time, totalAmount',
        desc: 'In-room orders'
      },
      {
        name: 'bills',
        pk: 'billId',
        cols: 'tokenNumber, guestId, roomCharges, foodCharges, discountAmount, netPayable, status',
        desc: 'Settled tax folios'
      },
      {
        name: 'occupancies',
        pk: 'occupancyId',
        cols: 'month, year, occupiedDays, totalDays, occupancyRate',
        desc: 'Monthly analytics'
      },
      {
        name: 'frequent_guests',
        pk: 'frequentGuestId',
        cols: 'name, discountPercentage, totalVisits',
        desc: 'VIP loyalty directory'
      }
    ];

    const rows = [
      ['Table Name', 'Primary Key', 'Foreign Keys / Key Columns', 'Domain Purpose']
    ];
    schemaTables.forEach(t => {
      rows.push([t.name, t.pk, t.cols, t.desc]);
    });

    slide.addTable(rows, {
      x: 0.8,
      y: 1.25,
      w: 8.4,
      h: 3.8,
      fontSize: 7.8,
      fontFace: FONT_SANS,
      color: COLOR_PRIMARY,
      fill: { color: COLOR_SURFACE },
      border: { pt: 0.5, color: COLOR_BORDER },
      autoPage: false,
      rowH: [0.35, 0.32, 0.32, 0.32, 0.32, 0.32, 0.32, 0.32, 0.32, 0.32, 0.32]
    });
  }

  // ==========================================
  // SLIDE 12: Core Algorithms & Formulas
  // ==========================================
  {
    const slide = pptx.addSlide();
    addHeader(slide, '11. Algorithmic Formulations', 'Core Mathematical Logic & Business Rules');

    const cards = [
      {
        title: 'FORMULA 01: DYNAMIC TARIFF REVISION',
        subtitle: 'Manager Rate Calibration Engine',
        formula: 'RevisedRate = BaseRate × ( 1 ± (Percentage / 100) )',
        explanation: 'Enables managerial calibration upwards (+%) for peak seasonal demand or downwards (-%) for off-peak promotions. Rounding to 2 decimal places applies immediately to new bookings.'
      },
      {
        title: 'FORMULA 02: MONTHLY AVERAGE OCCUPANCY',
        subtitle: 'Monthly Utilization Ratio',
        formula: 'OccupancyRate(%) = ( Occupied Room-Days / Total Available Room-Days ) × 100',
        explanation: 'Aggregates all active reservation durations spanning the selected calendar month divided by (24 Suites × Days in Month). Provides the empirical basis for tariff adjustment.'
      },
      {
        title: 'FORMULA 03: FOLIO SETTLEMENT & LOYALTY',
        subtitle: 'Final Balance Calculation Engine',
        formula: 'NetPayable = ( RoomCharges + FoodCharges - VIPDiscount ) - AdvancePaid',
        explanation: 'Where VIPDiscount = RoomCharges × 0.15 for verified Frequent Guest IDs. Advance deposits are credited off total charges, preventing double-billing.'
      }
    ];

    cards.forEach((c, idx) => {
      const y = 1.25 + idx * 1.3;
      slide.addShape(pptx.ShapeType.rect, {
        x: 0.8,
        y,
        w: 8.4,
        h: 1.15,
        fill: { color: COLOR_SURFACE },
        line: { color: COLOR_BORDER, width: 1 }
      });

      slide.addText(c.title, {
        x: 1.0,
        y: y + 0.12,
        w: 4.0,
        h: 0.22,
        fontFace: FONT_SANS,
        fontSize: 8.5,
        color: COLOR_GOLD,
        bold: true,
        charSpacing: 2
      });

      slide.addText(c.formula, {
        x: 1.0,
        y: y + 0.38,
        w: 8.0,
        h: 0.35,
        fontFace: FONT_SERIF,
        fontSize: 13,
        color: COLOR_PRIMARY,
        bold: true
      });

      slide.addText(c.explanation, {
        x: 1.0,
        y: y + 0.75,
        w: 8.0,
        h: 0.3,
        fontFace: FONT_SANS,
        fontSize: 8.5,
        color: COLOR_SECONDARY
      });
    });
  }

  // ==========================================
  // SLIDE 13: Public Sanctuary Experience
  // ==========================================
  {
    const slide = pptx.addSlide();
    addHeader(slide, '12. Frontend UI Engineering', 'Quiet Luxury Sanctuary & Guest Reservation Flow');

    // Left screenshot: Landing page
    const ss1 = path.join(__dirname, '..', 'presentation_assets', 'screenshots', '01_landing_page.png');
    if (fs.existsSync(ss1)) {
      slide.addImage({
        path: ss1,
        x: 0.8,
        y: 1.25,
        w: 4.1,
        h: 2.5,
        rounding: true
      });
    }

    // Right screenshot: Booking voucher
    const ss2 = path.join(__dirname, '..', 'presentation_assets', 'screenshots', '02_booking_voucher.png');
    if (fs.existsSync(ss2)) {
      slide.addImage({
        path: ss2,
        x: 5.1,
        y: 1.25,
        w: 4.1,
        h: 2.5,
        rounding: true
      });
    }

    // Bottom Card: Design highlights
    slide.addShape(pptx.ShapeType.rect, {
      x: 0.8,
      y: 3.9,
      w: 8.4,
      h: 1.2,
      fill: { color: COLOR_SURFACE },
      line: { color: COLOR_BORDER, width: 1 }
    });

    slide.addText('ROLE-BASED SEPARATION & BESPOKE LUXURY DESIGN', {
      x: 1.0,
      y: 4.02,
      w: 8.0,
      h: 0.22,
      fontFace: FONT_SANS,
      fontSize: 8.5,
      color: COLOR_GOLD,
      bold: true,
      charSpacing: 2
    });

    slide.addText([
      { text: '• Editorial Aesthetics: ', options: { bold: true, color: COLOR_PRIMARY } },
      { text: 'High-contrast serif headings (Cormorant Garamond), warm sand backgrounds (#FBF9F5), zero neon, and flat hairline borders.\n', options: { color: COLOR_SECONDARY } },
      { text: '• Discrete Staff Gateway: ', options: { bold: true, color: COLOR_PRIMARY } },
      { text: 'Public view contains zero internal operational counters. Staff access terminals via a discrete modal selection.\n', options: { color: COLOR_SECONDARY } },
      { text: '• End-to-End Guest Booking: ', options: { bold: true, color: COLOR_PRIMARY } },
      { text: 'Real-time availability verification with immediate token generation and downloadable stay voucher.', options: { color: COLOR_PINE, bold: true } }
    ], {
      x: 1.0,
      y: 4.25,
      w: 8.0,
      h: 0.75,
      fontFace: FONT_SANS,
      fontSize: 8.5,
      lineSpacing: 13
    });
  }

  // ==========================================
  // SLIDE 14: Automated Verification Test Suite
  // ==========================================
  {
    const slide = pptx.addSlide();
    addHeader(slide, '13. Verification & Quality Assurance', 'Automated End-to-End Test Suite Execution');

    const testCases = [
      ['Test ID', 'Specification Tested', 'Input Parameters', 'Expected UML Outcome', 'Status'],
      ['TEST-01', 'Hotel Overview & Inventory', 'GET /api/hotel', '24 Suites, Available/Occupied breakdown', '✓ PASSED (100%)'],
      ['TEST-02', 'Seq Diag 1: Allotment & Token', 'Bed: Double, AC: AC, 3 nights', 'Room 402 allotted, Token TKN-XXXX issued', '✓ PASSED (100%)'],
      ['TEST-03', 'Seq Diag 2: Catering Consumption', 'Prime Angus Filet Mignon × 2', 'Charge $136.00 linked to guest token', '✓ PASSED (100%)'],
      ['TEST-04', 'Seq Diag 2: Dynamic Tariff', 'Month 10 Occupancy, Revise +10%', 'Rate adjusted upwards from $320 to $352', '✓ PASSED (100%)'],
      ['TEST-05', 'Seq Diag 3: Bill Calculation', 'VIP-777 (15% Loyalty Discount)', 'Net balance payable calculated accurately', '✓ PASSED (100%)'],
      ['TEST-06', 'Seq Diag 3: Checkout & Release', 'processCheckout(tokenNumber)', 'Bill BIL-XXXX stored; Room released to Available', '✓ PASSED (100%)'],
      ['TEST-07', 'Seq Diag 1: Apology on Full Suite', 'Exceed available category count', 'Formal polite apology message generated', '✓ PASSED (100%)']
    ];

    slide.addTable(testCases, {
      x: 0.8,
      y: 1.25,
      w: 8.4,
      h: 2.8,
      fontSize: 8,
      fontFace: FONT_SANS,
      color: COLOR_PRIMARY,
      fill: { color: COLOR_SURFACE },
      border: { pt: 0.5, color: COLOR_BORDER },
      autoPage: false,
      rowH: [0.35, 0.32, 0.32, 0.32, 0.32, 0.32, 0.32, 0.32]
    });

    slide.addShape(pptx.ShapeType.rect, {
      x: 0.8,
      y: 4.2,
      w: 8.4,
      h: 0.9,
      fill: { color: 'F0FDF4' },
      line: { color: '86EFAC', width: 1 }
    });

    slide.addText('100% AUTOMATED TEST SUITE PASS RATE', {
      x: 1.0,
      y: 4.32,
      w: 8.0,
      h: 0.22,
      fontFace: FONT_SANS,
      fontSize: 9,
      color: COLOR_PINE,
      bold: true,
      charSpacing: 2
    });

    slide.addText('Executed via "node server/test-all-flows.js". All 7 core UML specifications verified against database persistence with zero runtime warnings or assertion failures.', {
      x: 1.0,
      y: 4.56,
      w: 8.0,
      h: 0.4,
      fontFace: FONT_SANS,
      fontSize: 8.5,
      color: '166534'
    });
  }

  // ==========================================
  // SLIDE 15: Academic Defense Conclusion
  // ==========================================
  {
    const slide = pptx.addSlide();
    addHeader(slide, '14. Conclusion & Defense Summary', 'Project Deliverables & Software Engineering Value');

    const conclusions = [
      {
        title: 'Full UML Conformance',
        desc: '100% rigorous compliance with provided Sequence Diagrams 1–3, Statechart, Use Case Diagram, Activity Flowchart, and Class Diagram.'
      },
      {
        title: 'Zero-Cost Architecture',
        desc: 'Engineered entirely with free tools (React, Express, SQLite). Suitable for cost-free cloud deployment on Render and Vercel.'
      },
      {
        title: 'World-Class UX Design',
        desc: 'Eliminated SaaS clutter and raw stats from the public landing page in favor of an Aman/Rosewood quiet luxury aesthetic with role-based portal separation.'
      },
      {
        title: 'Robust Data Integrity',
        desc: 'ACID-compliant SQLite transactions with foreign key cascades, unique token tracking, and audited billing folios.'
      }
    ];

    conclusions.forEach((c, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const x = 0.8 + col * 4.3;
      const y = 1.25 + row * 1.5;

      slide.addShape(pptx.ShapeType.rect, {
        x,
        y,
        w: 4.1,
        h: 1.35,
        fill: { color: COLOR_SURFACE },
        line: { color: COLOR_BORDER, width: 1 }
      });

      slide.addText(c.title, {
        x: x + 0.2,
        y: y + 0.2,
        w: 3.7,
        h: 0.3,
        fontFace: FONT_SERIF,
        fontSize: 14,
        color: COLOR_PRIMARY,
        bold: true
      });

      slide.addText(c.desc, {
        x: x + 0.2,
        y: y + 0.55,
        w: 3.7,
        h: 0.65,
        fontFace: FONT_SANS,
        fontSize: 8.8,
        color: COLOR_SECONDARY,
        lineSpacing: 14
      });
    });

    // Thank you banner
    slide.addShape(pptx.ShapeType.rect, {
      x: 0.8,
      y: 4.4,
      w: 8.4,
      h: 0.7,
      fill: { color: '1C1917' }
    });

    slide.addText('QUESTIONS & DEMONSTRATION • THANK YOU', {
      x: 0.8,
      y: 4.62,
      w: 8.4,
      h: 0.25,
      fontFace: FONT_SANS,
      fontSize: 10,
      color: 'BFA15F',
      charSpacing: 3,
      bold: true,
      align: 'center'
    });
  }

  // Save the presentation
  const outputPath = path.join(__dirname, '..', 'The_Grand_Horizon_Hotel_Automation.pptx');
  await pptx.writeFile({ fileName: outputPath });
  console.log(`Presentation successfully created at: ${outputPath}`);
}

createDeck().catch(err => {
  console.error('Failed to generate presentation:', err);
  process.exit(1);
});
