const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const diagrams = [
  {
    id: 'uml_use_case',
    title: 'UML Use Case Diagram: 5-Star Hotel Automation',
    svg: `
    <svg width="1000" height="720" viewBox="0 0 1000 720" xmlns="http://www.w3.org/2000/svg" style="background:#FFFFFF; font-family:'Segoe UI', sans-serif;">
      <!-- System Boundary Box -->
      <rect x="220" y="40" width="560" height="640" rx="10" fill="#FAF8F5" stroke="#8C7355" stroke-width="2" stroke-dasharray="6,4"/>
      <text x="500" y="70" text-anchor="middle" font-size="16" font-weight="bold" fill="#1C1917" letter-spacing="1">SYSTEM BOUNDARY: HOTEL AUTOMATION</text>

      <!-- Actors Left -->
      <!-- Guest Actor -->
      <circle cx="100" cy="180" r="16" fill="#F4F0E8" stroke="#1C1917" stroke-width="2"/>
      <line x1="100" y1="196" x2="100" y2="236" stroke="#1C1917" stroke-width="2"/>
      <line x1="75" y1="210" x2="125" y2="210" stroke="#1C1917" stroke-width="2"/>
      <line x1="100" y1="236" x2="80" y2="270" stroke="#1C1917" stroke-width="2"/>
      <line x1="100" y1="236" x2="120" y2="270" stroke="#1C1917" stroke-width="2"/>
      <text x="100" y="295" text-anchor="middle" font-size="14" font-weight="bold" fill="#1C1917">Guest</text>

      <!-- Receptionist Actor -->
      <circle cx="100" cy="460" r="16" fill="#F4F0E8" stroke="#1C1917" stroke-width="2"/>
      <line x1="100" y1="476" x2="100" y2="516" stroke="#1C1917" stroke-width="2"/>
      <line x1="75" y1="490" x2="125" y2="490" stroke="#1C1917" stroke-width="2"/>
      <line x1="100" y1="516" x2="80" y2="550" stroke="#1C1917" stroke-width="2"/>
      <line x1="100" y1="516" x2="120" y2="550" stroke="#1C1917" stroke-width="2"/>
      <text x="100" y="575" text-anchor="middle" font-size="14" font-weight="bold" fill="#1C1917">Receptionist</text>

      <!-- Actors Right -->
      <!-- Catering Manager Actor -->
      <circle cx="900" cy="200" r="16" fill="#F4F0E8" stroke="#1C1917" stroke-width="2"/>
      <line x1="900" y1="216" x2="900" y2="256" stroke="#1C1917" stroke-width="2"/>
      <line x1="875" y1="230" x2="925" y2="230" stroke="#1C1917" stroke-width="2"/>
      <line x1="900" y1="256" x2="880" y2="290" stroke="#1C1917" stroke-width="2"/>
      <line x1="900" y1="256" x2="920" y2="290" stroke="#1C1917" stroke-width="2"/>
      <text x="900" y="315" text-anchor="middle" font-size="14" font-weight="bold" fill="#1C1917">Catering Manager</text>

      <!-- Hotel Manager Actor -->
      <circle cx="900" cy="480" r="16" fill="#F4F0E8" stroke="#1C1917" stroke-width="2"/>
      <line x1="900" y1="496" x2="900" y2="536" stroke="#1C1917" stroke-width="2"/>
      <line x1="875" y1="510" x2="925" y2="510" stroke="#1C1917" stroke-width="2"/>
      <line x1="900" y1="536" x2="880" y2="570" stroke="#1C1917" stroke-width="2"/>
      <line x1="900" y1="536" x2="920" y2="570" stroke="#1C1917" stroke-width="2"/>
      <text x="900" y="595" text-anchor="middle" font-size="14" font-weight="bold" fill="#1C1917">Hotel Manager</text>

      <!-- Use Cases (Ovals) -->
      <!-- UC1: Check Room Availability -->
      <ellipse cx="360" cy="130" rx="100" ry="32" fill="#FFFFFF" stroke="#1C1917" stroke-width="1.8"/>
      <text x="360" y="134" text-anchor="middle" font-size="13" font-weight="600" fill="#1C1917">Check Availability</text>

      <!-- UC2: Reserve Room (Advance / Spot) -->
      <ellipse cx="360" cy="220" rx="100" ry="32" fill="#FFFFFF" stroke="#1C1917" stroke-width="1.8"/>
      <text x="360" y="224" text-anchor="middle" font-size="13" font-weight="600" fill="#1C1917">Reserve Suite</text>

      <!-- UC3: Allot Room & Generate Token -->
      <ellipse cx="380" cy="320" rx="110" ry="32" fill="#FFFFFF" stroke="#1C1917" stroke-width="1.8"/>
      <text x="380" y="324" text-anchor="middle" font-size="13" font-weight="600" fill="#1C1917">Allot Room & Issue Token</text>

      <!-- UC4: Apology on Full Occupancy -->
      <ellipse cx="640" cy="140" rx="95" ry="30" fill="#FFF5F5" stroke="#DC2626" stroke-width="1.5" stroke-dasharray="4,3"/>
      <text x="640" y="144" text-anchor="middle" font-size="12" font-weight="600" fill="#B91C1C">«extend» Apology Msg</text>

      <!-- UC5: In-Room Dining & Food Logging -->
      <ellipse cx="630" cy="240" rx="105" ry="32" fill="#FFFFFF" stroke="#1C1917" stroke-width="1.8"/>
      <text x="630" y="244" text-anchor="middle" font-size="13" font-weight="600" fill="#1C1917">Record Food Consumption</text>

      <!-- UC6: Calculate Monthly Occupancy -->
      <ellipse cx="630" cy="440" rx="110" ry="32" fill="#FFFFFF" stroke="#1C1917" stroke-width="1.8"/>
      <text x="630" y="444" text-anchor="middle" font-size="13" font-weight="600" fill="#1C1917">Calculate Occupancy Rate</text>

      <!-- UC7: Revise Room Tariff (+% / -%) -->
      <ellipse cx="630" cy="540" rx="105" ry="32" fill="#FFFFFF" stroke="#1C1917" stroke-width="1.8"/>
      <text x="630" y="544" text-anchor="middle" font-size="13" font-weight="600" fill="#1C1917">Revise Tariff (+% / -%)</text>

      <!-- UC8: Checkout & Billing Folio -->
      <ellipse cx="380" cy="460" rx="110" ry="34" fill="#FFFFFF" stroke="#1C1917" stroke-width="1.8"/>
      <text x="380" y="464" text-anchor="middle" font-size="13" font-weight="600" fill="#1C1917">Checkout & Generate Bill</text>

      <!-- UC9: Frequent Guest Loyalty Discount -->
      <ellipse cx="380" cy="580" rx="105" ry="30" fill="#FEFCE8" stroke="#CA8A04" stroke-width="1.5" stroke-dasharray="4,3"/>
      <text x="380" y="584" text-anchor="middle" font-size="12" font-weight="600" fill="#A16207">«extend» Apply VIP Discount</text>

      <!-- Association Lines -->
      <!-- Guest lines -->
      <line x1="125" y1="200" x2="260" y2="135" stroke="#57534E" stroke-width="1.5"/>
      <line x1="125" y1="220" x2="260" y2="220" stroke="#57534E" stroke-width="1.5"/>

      <!-- Receptionist lines -->
      <line x1="125" y1="460" x2="260" y2="230" stroke="#57534E" stroke-width="1.5"/>
      <line x1="125" y1="480" x2="270" y2="330" stroke="#57534E" stroke-width="1.5"/>
      <line x1="125" y1="500" x2="270" y2="460" stroke="#57534E" stroke-width="1.5"/>

      <!-- Catering Manager lines -->
      <line x1="875" y1="230" x2="735" y2="240" stroke="#57534E" stroke-width="1.5"/>

      <!-- Hotel Manager lines -->
      <line x1="875" y1="500" x2="740" y2="450" stroke="#57534E" stroke-width="1.5"/>
      <line x1="875" y1="520" x2="735" y2="540" stroke="#57534E" stroke-width="1.5"/>

      <!-- Include / Extend Dashed Arrows -->
      <line x1="460" y1="130" x2="545" y2="140" stroke="#DC2626" stroke-width="1.5" stroke-dasharray="4,3"/>
      <polygon points="545,140 535,134 537,144" fill="#DC2626"/>

      <line x1="380" y1="494" x2="380" y2="550" stroke="#CA8A04" stroke-width="1.5" stroke-dasharray="4,3"/>
      <polygon points="380,550 375,540 385,540" fill="#CA8A04"/>
    </svg>
    `
  },
  {
    id: 'uml_sequence_1',
    title: 'UML Sequence Diagram 1: Room Reservation & Allotment',
    svg: `
    <svg width="1000" height="720" viewBox="0 0 1000 720" xmlns="http://www.w3.org/2000/svg" style="background:#FFFFFF; font-family:'Segoe UI', sans-serif;">
      <!-- Lifelines -->
      <!-- G: Guest -->
      <rect x="70" y="30" width="120" height="40" rx="6" fill="#F4F0E8" stroke="#1C1917" stroke-width="1.8"/>
      <text x="130" y="55" text-anchor="middle" font-size="14" font-weight="bold">Guest</text>
      <line x1="130" y1="70" x2="130" y2="670" stroke="#A8A29E" stroke-width="1.5" stroke-dasharray="6,4"/>

      <!-- R: Receptionist -->
      <rect x="290" y="30" width="140" height="40" rx="6" fill="#F4F0E8" stroke="#1C1917" stroke-width="1.8"/>
      <text x="360" y="55" text-anchor="middle" font-size="14" font-weight="bold">Receptionist</text>
      <line x1="360" y1="70" x2="360" y2="670" stroke="#A8A29E" stroke-width="1.5" stroke-dasharray="6,4"/>

      <!-- S: Hotel System -->
      <rect x="530" y="30" width="160" height="40" rx="6" fill="#F4F0E8" stroke="#1C1917" stroke-width="1.8"/>
      <text x="610" y="55" text-anchor="middle" font-size="14" font-weight="bold">Automation Software</text>
      <line x1="610" y1="70" x2="610" y2="670" stroke="#A8A29E" stroke-width="1.5" stroke-dasharray="6,4"/>

      <!-- DB: Database -->
      <rect x="790" y="30" width="140" height="40" rx="6" fill="#F4F0E8" stroke="#1C1917" stroke-width="1.8"/>
      <text x="860" y="55" text-anchor="middle" font-size="14" font-weight="bold">Room Database</text>
      <line x1="860" y1="70" x2="860" y2="670" stroke="#A8A29E" stroke-width="1.5" stroke-dasharray="6,4"/>

      <!-- Message 1 -->
      <line x1="130" y1="120" x2="350" y2="120" stroke="#1C1917" stroke-width="1.8"/>
      <polygon points="350,120 340,115 340,125" fill="#1C1917"/>
      <text x="240" y="112" text-anchor="middle" font-size="12" font-weight="600">1: Request room (type, stay, advance)</text>

      <!-- Message 2 -->
      <line x1="360" y1="160" x2="600" y2="160" stroke="#1C1917" stroke-width="1.8"/>
      <polygon points="600,160 590,155 590,165" fill="#1C1917"/>
      <text x="485" y="152" text-anchor="middle" font-size="12" font-weight="600">2: Enter guest reservation details</text>

      <!-- Message 3 -->
      <line x1="610" y1="200" x2="850" y2="200" stroke="#1C1917" stroke-width="1.8"/>
      <polygon points="850,200 840,195 840,205" fill="#1C1917"/>
      <text x="730" y="192" text-anchor="middle" font-size="12" font-weight="600">3: checkAvailability(bed, ac)</text>

      <!-- Message 4 (Return) -->
      <line x1="860" y1="240" x2="620" y2="240" stroke="#1C1917" stroke-width="1.5" stroke-dasharray="5,3"/>
      <polygon points="620,240 630,235 630,245" fill="#1C1917"/>
      <text x="740" y="232" text-anchor="middle" font-size="12">4: return available rooms list</text>

      <!-- Alt Frame Box -->
      <rect x="50" y="270" width="880" height="360" rx="8" fill="none" stroke="#78716C" stroke-width="1.5"/>
      <path d="M 50 270 L 130 270 L 140 290 L 50 290 Z" fill="#E7DFD5" stroke="#78716C" stroke-width="1.5"/>
      <text x="90" y="285" text-anchor="middle" font-size="12" font-weight="bold">alt</text>

      <!-- Condition 1: Room Available -->
      <text x="160" y="310" font-size="13" font-weight="bold" fill="#15803D">[Room Available]</text>

      <!-- Message 5 -->
      <line x1="610" y1="340" x2="850" y2="340" stroke="#15803D" stroke-width="1.8"/>
      <polygon points="850,340 840,335 840,345" fill="#15803D"/>
      <text x="730" y="332" text-anchor="middle" font-size="12" font-weight="600" fill="#15803D">5: allocateRoom() &amp; generateToken()</text>

      <!-- Message 6 -->
      <line x1="610" y1="380" x2="370" y2="380" stroke="#15803D" stroke-width="1.8"/>
      <polygon points="370,380 380,375 380,385" fill="#15803D"/>
      <text x="490" y="372" text-anchor="middle" font-size="12" font-weight="600" fill="#15803D">6: Allot room &amp; return Token TKN-XXXX</text>

      <!-- Message 7 -->
      <line x1="360" y1="420" x2="140" y2="420" stroke="#15803D" stroke-width="1.8"/>
      <polygon points="140,420 150,415 150,425" fill="#15803D"/>
      <text x="250" y="412" text-anchor="middle" font-size="12" font-weight="600" fill="#15803D">7: Confirm reservation &amp; issue voucher</text>

      <!-- Divider line -->
      <line x1="50" y1="460" x2="930" y2="460" stroke="#78716C" stroke-width="1.5" stroke-dasharray="6,4"/>

      <!-- Condition 2: No Room Available -->
      <text x="160" y="490" font-size="13" font-weight="bold" fill="#B91C1C">[No Room Available / Full Occupancy]</text>

      <!-- Message 8 -->
      <line x1="610" y1="520" x2="370" y2="520" stroke="#B91C1C" stroke-width="1.8"/>
      <polygon points="370,520 380,515 380,525" fill="#B91C1C"/>
      <text x="490" y="512" text-anchor="middle" font-size="12" font-weight="600" fill="#B91C1C">8: Generate polite formal Apology Message</text>

      <!-- Message 9 -->
      <line x1="360" y1="570" x2="140" y2="570" stroke="#B91C1C" stroke-width="1.8"/>
      <polygon points="140,570 150,565 150,575" fill="#B91C1C"/>
      <text x="250" y="562" text-anchor="middle" font-size="12" font-weight="600" fill="#B91C1C">9: Apology: No suitable suites available</text>
    </svg>
    `
  },
  {
    id: 'uml_sequence_2',
    title: 'UML Sequence Diagram 2: Catering & Tariff Revision',
    svg: `
    <svg width="1000" height="720" viewBox="0 0 1000 720" xmlns="http://www.w3.org/2000/svg" style="background:#FFFFFF; font-family:'Segoe UI', sans-serif;">
      <!-- Lifelines -->
      <!-- CM: Catering Manager -->
      <rect x="50" y="30" width="150" height="40" rx="6" fill="#F4F0E8" stroke="#1C1917" stroke-width="1.8"/>
      <text x="125" y="55" text-anchor="middle" font-size="13" font-weight="bold">Catering Manager</text>
      <line x1="125" y1="70" x2="125" y2="670" stroke="#A8A29E" stroke-width="1.5" stroke-dasharray="6,4"/>

      <!-- HM: Hotel Manager -->
      <rect x="290" y="30" width="140" height="40" rx="6" fill="#F4F0E8" stroke="#1C1917" stroke-width="1.8"/>
      <text x="360" y="55" text-anchor="middle" font-size="13" font-weight="bold">Hotel Manager</text>
      <line x1="360" y1="70" x2="360" y2="670" stroke="#A8A29E" stroke-width="1.5" stroke-dasharray="6,4"/>

      <!-- S: System -->
      <rect x="530" y="30" width="160" height="40" rx="6" fill="#F4F0E8" stroke="#1C1917" stroke-width="1.8"/>
      <text x="610" y="55" text-anchor="middle" font-size="13" font-weight="bold">Automation Software</text>
      <line x1="610" y1="70" x2="610" y2="670" stroke="#A8A29E" stroke-width="1.5" stroke-dasharray="6,4"/>

      <!-- DB: Database -->
      <rect x="790" y="30" width="140" height="40" rx="6" fill="#F4F0E8" stroke="#1C1917" stroke-width="1.8"/>
      <text x="860" y="55" text-anchor="middle" font-size="13" font-weight="bold">Database Records</text>
      <line x1="860" y1="70" x2="860" y2="670" stroke="#A8A29E" stroke-width="1.5" stroke-dasharray="6,4"/>

      <!-- Section A: Catering Logging -->
      <rect x="40" y="100" width="910" height="200" rx="8" fill="#FDFBF7" stroke="#BFA15F" stroke-width="1.5"/>
      <text x="60" y="125" font-size="13" font-weight="bold" fill="#8C7355">PART A: TOKEN-BASED IN-ROOM DINING LOGGING</text>

      <!-- Message 1 -->
      <line x1="125" y1="160" x2="600" y2="160" stroke="#1C1917" stroke-width="1.8"/>
      <polygon points="600,160 590,155 590,165" fill="#1C1917"/>
      <text x="360" y="152" text-anchor="middle" font-size="12" font-weight="600">1: recordFoodConsumption(foodId, qty, tokenNumber, date, time)</text>

      <!-- Message 2 -->
      <line x1="610" y1="200" x2="850" y2="200" stroke="#1C1917" stroke-width="1.8"/>
      <polygon points="850,200 840,195 840,205" fill="#1C1917"/>
      <text x="730" y="192" text-anchor="middle" font-size="12" font-weight="600">2: Store food consumption linked to Token</text>

      <!-- Message 3 -->
      <line x1="860" y1="240" x2="620" y2="240" stroke="#1C1917" stroke-width="1.5" stroke-dasharray="5,3"/>
      <polygon points="620,240 630,235 630,245" fill="#1C1917"/>
      <text x="740" y="232" text-anchor="middle" font-size="12">3: Consumption logged &amp; charge calculated</text>

      <!-- Section B: Tariff & Occupancy Management -->
      <rect x="40" y="340" width="910" height="310" rx="8" fill="#FDFBF7" stroke="#BFA15F" stroke-width="1.5"/>
      <text x="60" y="365" font-size="13" font-weight="bold" fill="#8C7355">PART B: DYNAMIC MONTHLY OCCUPANCY &amp; TARIFF REVISION</text>

      <!-- Message 4 -->
      <line x1="360" y1="400" x2="600" y2="400" stroke="#1C1917" stroke-width="1.8"/>
      <polygon points="600,400 590,395 590,405" fill="#1C1917"/>
      <text x="480" y="392" text-anchor="middle" font-size="12" font-weight="600">4: calculateOccupancyRate(month, year)</text>

      <!-- Message 5 -->
      <line x1="610" y1="440" x2="850" y2="440" stroke="#1C1917" stroke-width="1.8"/>
      <polygon points="850,440 840,435 840,445" fill="#1C1917"/>
      <text x="730" y="432" text-anchor="middle" font-size="12">5: Query monthly total occupied vs available room-days</text>

      <!-- Message 6 -->
      <line x1="860" y1="480" x2="620" y2="480" stroke="#1C1917" stroke-width="1.5" stroke-dasharray="5,3"/>
      <polygon points="620,480 630,475 630,485" fill="#1C1917"/>
      <text x="740" y="472" text-anchor="middle" font-size="12">6: Return monthly room stay counts</text>

      <!-- Message 7 -->
      <line x1="610" y1="520" x2="370" y2="520" stroke="#1C1917" stroke-width="1.8"/>
      <polygon points="370,520 380,515 380,525" fill="#1C1917"/>
      <text x="490" y="512" text-anchor="middle" font-size="12" font-weight="600">7: Display average occupancy rate (e.g. 75.0%)</text>

      <!-- Message 8 -->
      <line x1="360" y1="560" x2="600" y2="560" stroke="#B45309" stroke-width="1.8"/>
      <polygon points="600,560 590,555 590,565" fill="#B45309"/>
      <text x="480" y="552" text-anchor="middle" font-size="12" font-weight="600" fill="#B45309">8: reviseRate(percentage, tariffId) [e.g. +10% or -10%]</text>

      <!-- Message 9 -->
      <line x1="610" y1="600" x2="850" y2="600" stroke="#B45309" stroke-width="1.8"/>
      <polygon points="850,600 840,595 840,605" fill="#B45309"/>
      <text x="730" y="592" text-anchor="middle" font-size="12" font-weight="600" fill="#B45309">9: Update room base tariffs in database</text>
    </svg>
    `
  },
  {
    id: 'uml_sequence_3',
    title: 'UML Sequence Diagram 3: Checkout, Food Charges & Final Folio',
    svg: `
    <svg width="1000" height="720" viewBox="0 0 1000 720" xmlns="http://www.w3.org/2000/svg" style="background:#FFFFFF; font-family:'Segoe UI', sans-serif;">
      <!-- Lifelines -->
      <!-- G: Guest -->
      <rect x="70" y="30" width="120" height="40" rx="6" fill="#F4F0E8" stroke="#1C1917" stroke-width="1.8"/>
      <text x="130" y="55" text-anchor="middle" font-size="14" font-weight="bold">Guest</text>
      <line x1="130" y1="70" x2="130" y2="670" stroke="#A8A29E" stroke-width="1.5" stroke-dasharray="6,4"/>

      <!-- R: Receptionist -->
      <rect x="290" y="30" width="140" height="40" rx="6" fill="#F4F0E8" stroke="#1C1917" stroke-width="1.8"/>
      <text x="360" y="55" text-anchor="middle" font-size="14" font-weight="bold">Receptionist</text>
      <line x1="360" y1="70" x2="360" y2="670" stroke="#A8A29E" stroke-width="1.5" stroke-dasharray="6,4"/>

      <!-- S: Hotel System -->
      <rect x="530" y="30" width="160" height="40" rx="6" fill="#F4F0E8" stroke="#1C1917" stroke-width="1.8"/>
      <text x="610" y="55" text-anchor="middle" font-size="14" font-weight="bold">Automation Software</text>
      <line x1="610" y1="70" x2="610" y2="670" stroke="#A8A29E" stroke-width="1.5" stroke-dasharray="6,4"/>

      <!-- DB: Database -->
      <rect x="790" y="30" width="140" height="40" rx="6" fill="#F4F0E8" stroke="#1C1917" stroke-width="1.8"/>
      <text x="860" y="55" text-anchor="middle" font-size="14" font-weight="bold">Database Records</text>
      <line x1="860" y1="70" x2="860" y2="670" stroke="#A8A29E" stroke-width="1.5" stroke-dasharray="6,4"/>

      <!-- Message 1 -->
      <line x1="130" y1="120" x2="350" y2="120" stroke="#1C1917" stroke-width="1.8"/>
      <polygon points="350,120 340,115 340,125" fill="#1C1917"/>
      <text x="240" y="112" text-anchor="middle" font-size="12" font-weight="600">1: Request checkout &amp; return token</text>

      <!-- Message 2 -->
      <line x1="360" y1="170" x2="600" y2="170" stroke="#1C1917" stroke-width="1.8"/>
      <polygon points="600,170 590,165 590,175" fill="#1C1917"/>
      <text x="480" y="162" text-anchor="middle" font-size="12" font-weight="600">2: calculateBill(tokenNumber)</text>

      <!-- Message 3 -->
      <line x1="610" y1="220" x2="850" y2="220" stroke="#1C1917" stroke-width="1.8"/>
      <polygon points="850,220 840,215 840,225" fill="#1C1917"/>
      <text x="730" y="212" text-anchor="middle" font-size="12">3: Fetch stay duration, room rate, advance paid</text>

      <!-- Message 4 -->
      <line x1="610" y1="270" x2="850" y2="270" stroke="#1C1917" stroke-width="1.8"/>
      <polygon points="850,270 840,265 840,275" fill="#1C1917"/>
      <text x="730" y="262" text-anchor="middle" font-size="12">4: Aggregate food consumptions from catering</text>

      <!-- Message 5 -->
      <line x1="610" y1="320" x2="850" y2="320" stroke="#B45309" stroke-width="1.8"/>
      <polygon points="850,320 840,315 840,325" fill="#B45309"/>
      <text x="730" y="312" text-anchor="middle" font-size="12" font-weight="600" fill="#B45309">5: Check Frequent Guest ID (VIP Loyalty discount %)</text>

      <!-- Message 6 -->
      <line x1="860" y1="370" x2="620" y2="370" stroke="#1C1917" stroke-width="1.5" stroke-dasharray="5,3"/>
      <polygon points="620,370 630,365 630,375" fill="#1C1917"/>
      <text x="740" y="362" text-anchor="middle" font-size="12">6: Return charge details &amp; discount eligibility</text>

      <!-- Self message on System -->
      <path d="M 610 410 L 650 410 L 650 435 L 610 435" fill="none" stroke="#1C1917" stroke-width="1.5"/>
      <polygon points="610,435 620,430 620,440" fill="#1C1917"/>
      <text x="660" y="426" font-size="11" font-weight="600">Balance = (Room + Food - Discount) - Advance</text>

      <!-- Message 7 -->
      <line x1="610" y1="480" x2="370" y2="480" stroke="#1C1917" stroke-width="1.8"/>
      <polygon points="370,480 380,475 380,485" fill="#1C1917"/>
      <text x="490" y="472" text-anchor="middle" font-size="12" font-weight="600">7: Return itemized breakdown &amp; net balance</text>

      <!-- Message 8 -->
      <line x1="360" y1="530" x2="600" y2="530" stroke="#15803D" stroke-width="1.8"/>
      <polygon points="600,530 590,525 590,535" fill="#15803D"/>
      <text x="480" y="522" text-anchor="middle" font-size="12" font-weight="600" fill="#15803D">8: processCheckout(tokenNumber) [Settle &amp; Release]</text>

      <!-- Message 9 -->
      <line x1="610" y1="580" x2="850" y2="580" stroke="#15803D" stroke-width="1.8"/>
      <polygon points="850,580 840,575 840,585" fill="#15803D"/>
      <text x="730" y="572" text-anchor="middle" font-size="12" font-weight="600" fill="#15803D">9: Store Bill record, set Token 'Closed', Room 'Available'</text>

      <!-- Message 10 -->
      <line x1="360" y1="630" x2="140" y2="630" stroke="#15803D" stroke-width="1.8"/>
      <polygon points="140,630 150,625 150,635" fill="#15803D"/>
      <text x="250" y="622" text-anchor="middle" font-size="12" font-weight="600" fill="#15803D">10: Present &amp; print final tax folio invoice</text>
    </svg>
    `
  },
  {
    id: 'uml_statechart',
    title: 'UML Statechart: Room & Reservation State Lifecycle',
    svg: `
    <svg width="1000" height="720" viewBox="0 0 1000 720" xmlns="http://www.w3.org/2000/svg" style="background:#FFFFFF; font-family:'Segoe UI', sans-serif;">
      <!-- Title -->
      <text x="500" y="40" text-anchor="middle" font-size="16" font-weight="bold" fill="#1C1917">STATE MACHINE: ROOM ALLOTMENT &amp; GUEST STAY LIFECYCLE</text>

      <!-- Start state -->
      <circle cx="80" cy="180" r="14" fill="#1C1917"/>

      <!-- Initial transition -->
      <line x1="94" y1="180" x2="170" y2="180" stroke="#1C1917" stroke-width="2"/>
      <polygon points="170,180 160,175 160,185" fill="#1C1917"/>
      <text x="130" y="170" text-anchor="middle" font-size="11">Request Room</text>

      <!-- State 1: Reservation Request -->
      <rect x="180" y="150" width="160" height="60" rx="8" fill="#F4F0E8" stroke="#1C1917" stroke-width="2"/>
      <text x="260" y="185" text-anchor="middle" font-size="14" font-weight="bold">Reservation</text>

      <!-- Transition to Choice -->
      <line x1="340" y1="180" x2="420" y2="180" stroke="#1C1917" stroke-width="2"/>
      <polygon points="420,180 410,175 410,185" fill="#1C1917"/>

      <!-- Availability Check Choice Diamond -->
      <polygon points="450,150 490,180 450,210 410,180" fill="#FFFFFF" stroke="#8C7355" stroke-width="2"/>
      <text x="450" y="185" text-anchor="middle" font-size="10" font-weight="bold">Check</text>

      <!-- Branch Fail: Apology -->
      <line x1="450" y1="150" x2="450" y2="80" stroke="#B91C1C" stroke-width="2"/>
      <line x1="450" y1="80" x2="560" y2="80" stroke="#B91C1C" stroke-width="2"/>
      <polygon points="560,80 550,75 550,85" fill="#B91C1C"/>
      <text x="480" y="70" font-size="11" font-weight="bold" fill="#B91C1C">[Full / Unavailable]</text>

      <!-- State: Apology Shown -->
      <rect x="570" y="50" width="160" height="60" rx="8" fill="#FFF5F5" stroke="#B91C1C" stroke-width="2"/>
      <text x="650" y="85" text-anchor="middle" font-size="13" font-weight="bold" fill="#B91C1C">Apology Delivered</text>

      <!-- End state from Apology -->
      <line x1="730" y1="80" x2="800" y2="80" stroke="#B91C1C" stroke-width="2"/>
      <polygon points="800,80 790,75 790,85" fill="#B91C1C"/>
      <circle cx="820" cy="80" r="14" fill="#FFFFFF" stroke="#1C1917" stroke-width="2"/>
      <circle cx="820" cy="80" r="8" fill="#1C1917"/>

      <!-- Branch Success: Room Allocated -->
      <line x1="490" y1="180" x2="570" y2="180" stroke="#15803D" stroke-width="2"/>
      <polygon points="570,180 560,175 560,185" fill="#15803D"/>
      <text x="530" y="170" text-anchor="middle" font-size="11" font-weight="bold" fill="#15803D">[Available]</text>

      <!-- State 2: Room Allocated -->
      <rect x="580" y="150" width="160" height="60" rx="8" fill="#F0FDF4" stroke="#15803D" stroke-width="2"/>
      <text x="660" y="175" text-anchor="middle" font-size="13" font-weight="bold" fill="#15803D">RoomAllocated</text>
      <text x="660" y="195" text-anchor="middle" font-size="10" fill="#166534">Token Issued</text>

      <!-- Transition to CheckedIn -->
      <line x1="740" y1="180" x2="820" y2="180" stroke="#1C1917" stroke-width="2"/>
      <polygon points="820,180 810,175 810,185" fill="#1C1917"/>
      <text x="780" y="170" text-anchor="middle" font-size="10">Advance Paid</text>

      <!-- State 3: Checked In / In-House Stay -->
      <rect x="830" y="150" width="130" height="60" rx="8" fill="#F4F0E8" stroke="#1C1917" stroke-width="2"/>
      <text x="895" y="185" text-anchor="middle" font-size="14" font-weight="bold">CheckedIn</text>

      <!-- Loop down to In-House Dining / Staying -->
      <line x1="895" y1="210" x2="895" y2="330" stroke="#1C1917" stroke-width="2"/>
      <polygon points="895,330 890,320 900,320" fill="#1C1917"/>

      <!-- State 4: Staying & In-Room Dining -->
      <rect x="790" y="340" width="180" height="90" rx="8" fill="#FEFCE8" stroke="#CA8A04" stroke-width="2"/>
      <text x="880" y="370" text-anchor="middle" font-size="14" font-weight="bold" fill="#854D0E">Staying</text>
      <text x="880" y="390" text-anchor="middle" font-size="11" fill="#A16207">Catering consumed</text>
      <text x="880" y="410" text-anchor="middle" font-size="10" fill="#A16207">Charges logged to token</text>

      <!-- Transition to Checkout -->
      <line x1="790" y1="385" x2="680" y2="385" stroke="#1C1917" stroke-width="2"/>
      <polygon points="680,385 690,380 690,390" fill="#1C1917"/>
      <text x="735" y="375" text-anchor="middle" font-size="11">Request Checkout</text>

      <!-- State 5: Bill Generation -->
      <rect x="500" y="350" width="170" height="70" rx="8" fill="#F4F0E8" stroke="#1C1917" stroke-width="2"/>
      <text x="585" y="380" text-anchor="middle" font-size="13" font-weight="bold">BillGeneration</text>
      <text x="585" y="400" text-anchor="middle" font-size="10" fill="#57534E">Room + Food Aggregated</text>

      <!-- Transition to Discount Decision -->
      <line x1="500" y1="385" x2="380" y2="385" stroke="#1C1917" stroke-width="2"/>
      <polygon points="380,385 390,380 390,390" fill="#1C1917"/>
      <text x="440" y="375" text-anchor="middle" font-size="11">Frequent Guest?</text>

      <!-- State 6: Discount Applied -->
      <rect x="220" y="350" width="150" height="70" rx="8" fill="#FEFCE8" stroke="#B45309" stroke-width="2"/>
      <text x="295" y="380" text-anchor="middle" font-size="13" font-weight="bold" fill="#B45309">DiscountApplied</text>
      <text x="295" y="400" text-anchor="middle" font-size="10" fill="#92400E">15% VIP Loyalty Credit</text>

      <!-- Move to Final Payment & Settle -->
      <line x1="295" y1="420" x2="295" y2="520" stroke="#1C1917" stroke-width="2"/>
      <polygon points="295,520 290,510 300,510" fill="#1C1917"/>
      <text x="310" y="470" font-size="11">Advance Deducted</text>

      <!-- State 7: Settled & Checked Out -->
      <rect x="210" y="530" width="170" height="70" rx="8" fill="#F0FDF4" stroke="#15803D" stroke-width="2"/>
      <text x="295" y="560" text-anchor="middle" font-size="14" font-weight="bold" fill="#15803D">CheckedOut</text>
      <text x="295" y="580" text-anchor="middle" font-size="10" fill="#166534">Bill BIL-XXXX Settled</text>

      <!-- Transition to Room Release -->
      <line x1="380" y1="565" x2="520" y2="565" stroke="#15803D" stroke-width="2"/>
      <polygon points="520,565 510,560 510,570" fill="#15803D"/>
      <text x="450" y="555" text-anchor="middle" font-size="11" font-weight="bold" fill="#15803D">releaseRoom()</text>

      <!-- State 8: Room Available -->
      <rect x="530" y="530" width="180" height="70" rx="8" fill="#F4F0E8" stroke="#1C1917" stroke-width="2"/>
      <text x="620" y="560" text-anchor="middle" font-size="14" font-weight="bold">Room Available</text>
      <text x="620" y="580" text-anchor="middle" font-size="10" fill="#57534E">Token Closed</text>

      <!-- Final state -->
      <line x1="710" y1="565" x2="800" y2="565" stroke="#1C1917" stroke-width="2"/>
      <polygon points="800,565 790,560 790,570" fill="#1C1917"/>
      <circle cx="820" cy="565" r="14" fill="#FFFFFF" stroke="#1C1917" stroke-width="2"/>
      <circle cx="820" cy="565" r="8" fill="#1C1917"/>
    </svg>
    `
  },
  {
    id: 'uml_class_diagram',
    title: 'UML Class Diagram: 10 Domain Model Entities',
    svg: `
    <svg width="1000" height="720" viewBox="0 0 1000 720" xmlns="http://www.w3.org/2000/svg" style="background:#FFFFFF; font-family:'Segoe UI', sans-serif;">
      <!-- Title -->
      <text x="500" y="30" text-anchor="middle" font-size="16" font-weight="bold" fill="#1C1917">UML CLASS DIAGRAM: 10 DOMAIN ENTITIES &amp; RELATIONSHIPS</text>

      <!-- Class 1: Hotel -->
      <rect x="40" y="60" width="200" height="120" rx="4" fill="#FAF8F5" stroke="#8C7355" stroke-width="1.8"/>
      <rect x="40" y="60" width="200" height="26" fill="#E7DFD5"/>
      <text x="140" y="78" text-anchor="middle" font-size="13" font-weight="bold">Hotel</text>
      <text x="50" y="102" font-size="11">- hotelId: string</text>
      <text x="50" y="118" font-size="11">- name: string</text>
      <text x="50" y="134" font-size="11">- totalRooms: int = 24</text>
      <line x1="40" y1="142" x2="240" y2="142" stroke="#8C7355" stroke-width="1"/>
      <text x="50" y="160" font-size="11">+ checkAvailability()</text>
      <text x="50" y="174" font-size="11">+ calculateOccupancy()</text>

      <!-- Class 2: Room -->
      <rect x="290" y="60" width="200" height="130" rx="4" fill="#FAF8F5" stroke="#8C7355" stroke-width="1.8"/>
      <rect x="290" y="60" width="200" height="26" fill="#E7DFD5"/>
      <text x="390" y="78" text-anchor="middle" font-size="13" font-weight="bold">Room</text>
      <text x="300" y="102" font-size="11">- roomNumber: string</text>
      <text x="300" y="118" font-size="11">- bedType: Single | Double</text>
      <text x="300" y="134" font-size="11">- acType: AC | Non-AC</text>
      <text x="300" y="150" font-size="11">- status: Available | Occupied</text>
      <line x1="290" y1="156" x2="490" y2="156" stroke="#8C7355" stroke-width="1"/>
      <text x="300" y="174" font-size="11">+ isAvailable(): boolean</text>
      <text x="300" y="188" font-size="11">+ allocateRoom(): void</text>

      <!-- Class 3: Tariff -->
      <rect x="540" y="60" width="190" height="110" rx="4" fill="#FAF8F5" stroke="#8C7355" stroke-width="1.8"/>
      <rect x="540" y="60" width="190" height="26" fill="#E7DFD5"/>
      <text x="635" y="78" text-anchor="middle" font-size="13" font-weight="bold">Tariff</text>
      <text x="550" y="102" font-size="11">- tariffId: string</text>
      <text x="550" y="118" font-size="11">- rate: float</text>
      <text x="550" y="134" font-size="11">- lastRevisedDate: date</text>
      <line x1="540" y1="140" x2="730" y2="140" stroke="#8C7355" stroke-width="1"/>
      <text x="550" y="158" font-size="11">+ reviseRate(percentage)</text>

      <!-- Class 4: Occupancy -->
      <rect x="770" y="60" width="190" height="110" rx="4" fill="#FAF8F5" stroke="#8C7355" stroke-width="1.8"/>
      <rect x="770" y="60" width="190" height="26" fill="#E7DFD5"/>
      <text x="865" y="78" text-anchor="middle" font-size="13" font-weight="bold">Occupancy</text>
      <text x="780" y="102" font-size="11">- month: int</text>
      <text x="780" y="118" font-size="11">- year: int</text>
      <text x="780" y="134" font-size="11">- occupancyRate: float</text>
      <line x1="770" y1="140" x2="960" y2="140" stroke="#8C7355" stroke-width="1"/>
      <text x="780" y="158" font-size="11">+ calculateMonthlyRate()</text>

      <!-- Class 5: Guest -->
      <rect x="40" y="270" width="220" height="150" rx="4" fill="#FAF8F5" stroke="#8C7355" stroke-width="1.8"/>
      <rect x="40" y="270" width="220" height="26" fill="#E7DFD5"/>
      <text x="150" y="288" text-anchor="middle" font-size="13" font-weight="bold">Guest</text>
      <text x="50" y="312" font-size="11">- guestId: string</text>
      <text x="50" y="328" font-size="11">- name: string</text>
      <text x="50" y="344" font-size="11">- phone: string</text>
      <text x="50" y="360" font-size="11">- advancePaid: float</text>
      <text x="50" y="376" font-size="11">- frequentGuestId: string</text>
      <line x1="40" y1="382" x2="260" y2="382" stroke="#8C7355" stroke-width="1"/>
      <text x="50" y="400" font-size="11">+ reserveRoom()</text>
      <text x="50" y="414" font-size="11">+ checkIn() / checkOut()</text>

      <!-- Class 6: Reservation -->
      <rect x="310" y="270" width="200" height="130" rx="4" fill="#FAF8F5" stroke="#8C7355" stroke-width="1.8"/>
      <rect x="310" y="270" width="200" height="26" fill="#E7DFD5"/>
      <text x="410" y="288" text-anchor="middle" font-size="13" font-weight="bold">Reservation</text>
      <text x="320" y="312" font-size="11">- reservationId: string</text>
      <text x="320" y="328" font-size="11">- roomNumber: string</text>
      <text x="320" y="344" font-size="11">- arrivalDate: string</text>
      <text x="320" y="360" font-size="11">- duration: int</text>
      <line x1="310" y1="366" x2="510" y2="366" stroke="#8C7355" stroke-width="1"/>
      <text x="320" y="384" font-size="11">+ createReservation()</text>

      <!-- Class 7: Token -->
      <rect x="560" y="270" width="180" height="110" rx="4" fill="#FAF8F5" stroke="#8C7355" stroke-width="1.8"/>
      <rect x="560" y="270" width="180" height="26" fill="#E7DFD5"/>
      <text x="650" y="288" text-anchor="middle" font-size="13" font-weight="bold">Token</text>
      <text x="570" y="312" font-size="11">- tokenNumber: string</text>
      <text x="570" y="328" font-size="11">- issueDate: date</text>
      <text x="570" y="344" font-size="11">- status: Active | Closed</text>
      <line x1="560" y1="350" x2="740" y2="350" stroke="#8C7355" stroke-width="1"/>
      <text x="570" y="368" font-size="11">+ generateToken(guestId)</text>

      <!-- Class 8: Bill -->
      <rect x="780" y="270" width="190" height="140" rx="4" fill="#FAF8F5" stroke="#8C7355" stroke-width="1.8"/>
      <rect x="780" y="270" width="190" height="26" fill="#E7DFD5"/>
      <text x="875" y="288" text-anchor="middle" font-size="13" font-weight="bold">Bill</text>
      <text x="790" y="312" font-size="11">- billId: string</text>
      <text x="790" y="328" font-size="11">- roomCharges: float</text>
      <text x="790" y="344" font-size="11">- foodCharges: float</text>
      <text x="790" y="360" font-size="11">- discountAmount: float</text>
      <line x1="780" y1="366" x2="970" y2="366" stroke="#8C7355" stroke-width="1"/>
      <text x="790" y="384" font-size="11">+ calculateTotal(): float</text>
      <text x="790" y="398" font-size="11">+ printBill(): void</text>

      <!-- Class 9: FoodItem -->
      <rect x="180" y="500" width="190" height="110" rx="4" fill="#FAF8F5" stroke="#8C7355" stroke-width="1.8"/>
      <rect x="180" y="500" width="190" height="26" fill="#E7DFD5"/>
      <text x="275" y="518" text-anchor="middle" font-size="13" font-weight="bold">FoodItem</text>
      <text x="190" y="542" font-size="11">- itemId: string</text>
      <text x="190" y="558" font-size="11">- name: string</text>
      <text x="190" y="574" font-size="11">- price: float</text>
      <line x1="180" y1="580" x2="370" y2="580" stroke="#8C7355" stroke-width="1"/>
      <text x="190" y="598" font-size="11">+ getPrice(): float</text>

      <!-- Class 10: FoodConsumption -->
      <rect x="470" y="500" width="220" height="130" rx="4" fill="#FAF8F5" stroke="#8C7355" stroke-width="1.8"/>
      <rect x="470" y="500" width="220" height="26" fill="#E7DFD5"/>
      <text x="580" y="518" text-anchor="middle" font-size="13" font-weight="bold">FoodConsumption</text>
      <text x="480" y="542" font-size="11">- consumptionId: string</text>
      <text x="480" y="558" font-size="11">- tokenNumber: string</text>
      <text x="480" y="574" font-size="11">- quantity: int</text>
      <text x="480" y="590" font-size="11">- totalAmount: float</text>
      <line x1="470" y1="596" x2="690" y2="596" stroke="#8C7355" stroke-width="1"/>
      <text x="480" y="614" font-size="11">+ calculateAmount()</text>

      <!-- Multiplicity and Relationship lines -->
      <line x1="240" y1="120" x2="290" y2="120" stroke="#1C1917" stroke-width="1.5"/>
      <text x="245" y="112" font-size="10">1</text>
      <text x="270" y="112" font-size="10">1..*</text>

      <line x1="490" y1="120" x2="540" y2="120" stroke="#1C1917" stroke-width="1.5"/>
      <text x="495" y="112" font-size="10">1</text>
      <text x="525" y="112" font-size="10">1</text>

      <line x1="260" y1="330" x2="310" y2="330" stroke="#1C1917" stroke-width="1.5"/>
      <text x="265" y="322" font-size="10">1</text>
      <text x="290" y="322" font-size="10">1..*</text>

      <line x1="510" y1="330" x2="560" y2="330" stroke="#1C1917" stroke-width="1.5"/>
      <text x="515" y="322" font-size="10">1</text>
      <text x="545" y="322" font-size="10">1</text>

      <line x1="740" y1="330" x2="780" y2="330" stroke="#1C1917" stroke-width="1.5"/>
      <text x="745" y="322" font-size="10">1</text>
      <text x="765" y="322" font-size="10">1</text>

      <line x1="370" y1="550" x2="470" y2="550" stroke="#1C1917" stroke-width="1.5"/>
      <text x="375" y="542" font-size="10">1</text>
      <text x="450" y="542" font-size="10">1..*</text>
    </svg>
    `
  }
];

async function generateDiagrams() {
  const outDir = path.join(__dirname, '..', 'presentation_assets', 'diagrams');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Users\\mohan\\AppData\\Local\\ms-playwright\\chromium-1155\\chrome-win\\chrome.exe'
  });

  const page = await browser.newPage({ viewport: { width: 1000, height: 720 } });

  for (const diag of diagrams) {
    console.log(`Rendering diagram: ${diag.id} ...`);
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { margin: 0; padding: 0; background: #FFFFFF; display: flex; align-items: center; justify-content: center; }
        </style>
      </head>
      <body>
        ${diag.svg}
      </body>
      </html>
    `;
    await page.setContent(html);
    await page.waitForTimeout(200);
    const dest = path.join(outDir, `${diag.id}.png`);
    await page.screenshot({ path: dest });
    console.log(`Saved ${dest}`);
  }

  await browser.close();
  console.log('All UML diagram images generated successfully!');
}

generateDiagrams().catch(err => {
  console.error('Diagram generation failed:', err);
  process.exit(1);
});
