-- ============================================================================
-- Nexus Clean — PostgreSQL / Supabase Demo Seed Data
-- ============================================================================

-- 1. SEED USERS (Password hashes for 'demo123' generated with bcrypt)
-- bcrypt hash for 'demo123': $2a$10$wN9iM1f0xYh3q890aJbvcuY7fFzHk3L1PZ5F9P2Ym3T5yV7qI2H3u
INSERT INTO users (id, name, email, password_hash, role, location, area, phone, avatar, title, department, jurisdiction)
VALUES 
(
  'USR-CITIZEN-01',
  'Aarav Sharma',
  'citizen@nexusclean.org',
  '$2a$10$wN9iM1f0xYh3q890aJbvcuY7fFzHk3L1PZ5F9P2Ym3T5yV7qI2H3u',
  'citizen',
  'Civil Lines, Kanpur',
  'Civil Lines',
  '+91 98765 43210',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  'Civic Ambassador',
  'Community Action',
  'Zone 3'
),
(
  'USR-ADMIN-01',
  'Officer Sunita Verma',
  'admin@nexusclean.org',
  '$2a$10$wN9iM1f0xYh3q890aJbvcuY7fFzHk3L1PZ5F9P2Ym3T5yV7qI2H3u',
  'admin',
  'Municipal HQ, Kanpur',
  'Civil Lines',
  '+91 94150 11223',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
  'Chief Sanitation & Operations Director',
  'Municipal Smart Waste Directorate',
  'Zone 3 & Central Corridor'
),
(
  'USR-COLLECTOR-01',
  'Ramesh Yadav',
  'collector@nexusclean.org',
  '$2a$10$wN9iM1f0xYh3q890aJbvcuY7fFzHk3L1PZ5F9P2Ym3T5yV7qI2H3u',
  'collector',
  'Dispatch Depot 4',
  'Zone 3',
  '+91 98390 99887',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  'Field Operations Lead',
  'Rapid Response Unit #04',
  'Zone 3'
)
ON CONFLICT (id) DO NOTHING;

-- 2. SEED ECO SCORES
INSERT INTO eco_scores (user_id, total, max, level, monthly_improvement, breakdown, achievements)
VALUES (
  'USR-CITIZEN-01',
  78,
  100,
  'Eco Guardian (Tier II)',
  '+18%',
  '[
    {"category": "Waste Reporting", "points": 20, "max": 25, "description": "Active & verified issue logging"},
    {"category": "Proper Segregation", "points": 25, "max": 30, "description": "Consistent door-to-door dry/wet sorting"},
    {"category": "Community Participation", "points": 18, "max": 25, "description": "Peer validations & neighborhood cleanups"},
    {"category": "Awareness Activities", "points": 15, "max": 20, "description": "Waste sorting quizzes & guides completed"}
  ]'::jsonb,
  '[
    {"id": "ach-1", "title": "First Reporter", "description": "Logged your first verified municipal waste issue", "icon": "Flag", "unlocked": true, "date": "May 2025"},
    {"id": "ach-2", "title": "Segregation Starter", "description": "Completed 10 consecutive door-to-door sorted pickups", "icon": "CheckCircle2", "unlocked": true, "date": "Jun 2025"},
    {"id": "ach-3", "title": "Community Champion", "description": "Helped reduce local hotspot complaints by 15%+", "icon": "Award", "unlocked": true, "date": "Aug 2025"},
    {"id": "ach-4", "title": "Zero Contamination", "description": "Maintain 100% clean recyclable sorting for 30 days", "icon": "ShieldCheck", "unlocked": false, "progress": 65},
    {"id": "ach-5", "title": "Hotspot Spotter", "description": "Reported an issue that led to proactive route deployment", "icon": "Zap", "unlocked": true, "date": "Sep 2025"}
  ]'::jsonb
)
ON CONFLICT (user_id) DO NOTHING;

-- 3. SEED COMPLAINTS
INSERT INTO complaints (id, user_id, title, category, description, address, area, latitude, longitude, priority, status, assigned_team, before_image, after_image, ai_analysis, verification, created_at)
VALUES
(
  'NC-1042',
  'USR-CITIZEN-01',
  'Severe Commercial Bin Overflow',
  'Overflowing Bin',
  'Two 1100L municipal containers overflowing onto pedestrian walkway. Food waste attracting stray animals and creating foul odor.',
  'Opposite Metro Station Gate 2, Civil Lines',
  'Civil Lines',
  26.4725,
  80.3412,
  'High',
  'Resolution Submitted',
  'Rapid Response Unit #04',
  'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1526951521990-620dc14c214b?auto=format&fit=crop&w=800&q=80',
  '{
    "detectedIssue": "Overflowing Bin (High Density Organic & Plastic)",
    "confidence": 94,
    "priority": "HIGH",
    "suggestedAction": "Schedule emergency collection within 4 hours. Increase evening bin clearance frequency.",
    "materialBreakdown": {"organic": "65%", "recyclablePlastic": "25%", "other": "10%"},
    "isPrototype": true
  }'::jsonb,
  '{
    "status": "Pending Admin Approval",
    "score": 92,
    "summary": "Resolution appears successful. 92% visual clearance of pavement and sanitized perimeter detected by AI model comparison.",
    "submittedByTeam": "Foreman R. Sharma",
    "submittedAt": "2026-09-29T14:30:00Z"
  }'::jsonb,
  '2026-09-28T09:15:00Z'
),
(
  'NC-1043',
  'USR-CITIZEN-01',
  'Illegal Dump Site on Green Belt',
  'Illegal Dumping',
  'Mixed debris, discarded packaging crates, and broken glass dumped near the residential park border.',
  'Block C Sector 4, Swaroop Nagar',
  'Swaroop Nagar',
  26.4812,
  80.3315,
  'High',
  'In Progress',
  'Zone 2 Heavy Duty Truck #11',
  'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=800&q=80',
  NULL,
  '{
    "detectedIssue": "Illegal Dumping (Construction & Dry Waste)",
    "confidence": 89,
    "priority": "HIGH",
    "suggestedAction": "Deploy heavy loader truck. Notify municipal zoning enforcement.",
    "materialBreakdown": {"packaging": "40%", "rubble": "35%", "nonRecyclable": "25%"},
    "isPrototype": true
  }'::jsonb,
  NULL,
  '2026-09-29T08:00:00Z'
),
(
  'NC-1044',
  'USR-CITIZEN-01',
  'Roadside Littering Along Market Lane',
  'Roadside Garbage',
  'Single-use cups, paper food wrappers, and drink cans scattered along the 150m market walkway.',
  'Near Central Book Depot, Mall Road',
  'Mall Road',
  26.4650,
  80.3520,
  'Medium',
  'Pending',
  'Pending Dispatch',
  'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=800&q=80',
  NULL,
  '{
    "detectedIssue": "Roadside Garbage (Commercial Food Packaging)",
    "confidence": 91,
    "priority": "MEDIUM",
    "suggestedAction": "Assign street sweeping crew during off-peak hours (2 PM - 4 PM).",
    "materialBreakdown": {"paperCardboard": "50%", "plasticBeverage": "40%", "other": "10%"},
    "isPrototype": true
  }'::jsonb,
  NULL,
  '2026-09-29T10:20:00Z'
),
(
  'NC-1045',
  'USR-CITIZEN-01',
  'Missed Morning Door-to-Door Collection',
  'Missed Collection',
  'Compactor van skipped Lane 4 and 5; residents left bins outside creating hazard.',
  'Lane 5, Shastri Nagar',
  'Shastri Nagar',
  26.4590,
  80.3200,
  'Low',
  'Assigned',
  'Zone 3 Van #08',
  'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80',
  NULL,
  '{
    "detectedIssue": "Missed Municipal Route Window",
    "confidence": 95,
    "priority": "LOW",
    "suggestedAction": "Reroute nearest active auxiliary tipper van.",
    "isPrototype": true
  }'::jsonb,
  NULL,
  '2026-09-29T11:45:00Z'
)
ON CONFLICT (id) DO NOTHING;

-- 4. SEED COMPLAINT STATUS HISTORY
INSERT INTO complaint_status_history (complaint_id, step, title, status, time, actor, completed, current)
VALUES
('NC-1042', 1, 'Complaint Submitted', 'Pending', 'Sep 28, 09:15 AM', 'Citizen (You)', true, false),
('NC-1042', 2, 'Admin Reviewed', 'Pending', 'Sep 28, 09:40 AM', 'Central Dispatch', true, false),
('NC-1042', 3, 'Collection Team Assigned', 'Assigned', 'Sep 28, 10:15 AM', 'Rapid Response #04', true, false),
('NC-1042', 4, 'Cleanup In Progress', 'In Progress', 'Sep 29, 11:00 AM', 'Field Crew #04', true, false),
('NC-1042', 5, 'Resolution Verification', 'Resolution Submitted', 'Sep 29, 02:30 PM', 'AI & Admin Approval', true, true),
('NC-1042', 6, 'Resolved', 'Resolved', 'Pending Approval', 'Nexus Clean System', false, false),

('NC-1043', 1, 'Complaint Submitted', 'Pending', 'Sep 29, 08:00 AM', 'Citizen Verified', true, false),
('NC-1043', 2, 'Admin Reviewed', 'Pending', 'Sep 29, 08:30 AM', 'Supervisor Gupta', true, false),
('NC-1043', 3, 'Collection Team Assigned', 'Assigned', 'Sep 29, 09:15 AM', 'Zone 2 Fleet', true, false),
('NC-1043', 4, 'Cleanup In Progress', 'In Progress', 'Sep 29, 11:45 AM', 'Heavy Loader Unit', true, true),
('NC-1043', 5, 'Resolution Verification', 'Resolution Submitted', 'Estimated 05:00 PM', 'AI Verification', false, false),
('NC-1043', 6, 'Resolved', 'Resolved', 'Pending', 'System', false, false),

('NC-1044', 1, 'Complaint Submitted', 'Pending', 'Sep 29, 10:20 AM', 'Citizen', true, true),
('NC-1044', 2, 'Admin Reviewed', 'Pending', 'Awaiting Review', 'Dispatch', false, false),
('NC-1044', 3, 'Collection Team Assigned', 'Assigned', '--', '--', false, false),
('NC-1044', 4, 'Cleanup In Progress', 'In Progress', '--', '--', false, false),
('NC-1044', 5, 'Resolution Verification', 'Resolution Submitted', '--', '--', false, false),
('NC-1044', 6, 'Resolved', 'Resolved', '--', '--', false, false);

-- 5. SEED PICKUPS
INSERT INTO pickup_requests (id, user_id, requester_name, requester_phone, waste_type, estimated_quantity, address, area, zone, preferred_date, preferred_time, photo_url, status, priority, assigned_crew, created_at)
VALUES
(
  'PK-2081',
  'USR-CITIZEN-01',
  'Dr. Arvind Saxena',
  '+91 98390 12345',
  'E-Waste',
  '2 Broken Laptops, 1 Printer, 4 Battery Packs (~12kg)',
  'Flat 402, Green Valley Apartments, Civil Lines',
  'Civil Lines',
  'Zone 3',
  '2026-10-02',
  '10:00 AM - 12:00 PM',
  'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=600&q=80',
  'Pickup Requested',
  'High',
  'E-Waste Recovery Unit #02',
  '2026-09-29T09:30:00Z'
),
(
  'PK-2082',
  'USR-CITIZEN-01',
  'Pooja Malhotra',
  '+91 94150 56789',
  'Bulk Waste',
  '1 Discarded Wooden Dining Table, 4 Chairs',
  'B-12, Sector 3, Swaroop Nagar',
  'Swaroop Nagar',
  'Zone 3',
  '2026-10-02',
  '01:00 PM - 03:00 PM',
  'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=600&q=80',
  'Assigned',
  'Medium',
  'Flatbed Truck #07',
  '2026-09-29T10:15:00Z'
),
(
  'PK-2083',
  'USR-CITIZEN-01',
  'Community Hall Committee',
  '+91 98399 77881',
  'Recyclable',
  '18 Large Bags of Plastic Bottles & Cardboard from College Fest',
  'City Convention Ground, Mall Road',
  'Mall Road',
  'Zone 3',
  '2026-10-02',
  '03:30 PM - 05:30 PM',
  'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80',
  'Assigned',
  'High',
  'Compactor Van #03',
  '2026-09-29T11:00:00Z'
),
(
  'PK-2084',
  'USR-CITIZEN-01',
  'Rakesh Verma',
  '+91 97931 22334',
  'Dry',
  'Garden trimmings and pruned tree branches (6 sacks)',
  'House 24, Lane 7, Kakadeo',
  'Kakadeo',
  'Zone 3',
  '2026-10-03',
  '09:00 AM - 11:00 AM',
  NULL,
  'Pickup Requested',
  'Low',
  'Bio-Compost Van #01',
  '2026-09-29T13:40:00Z'
)
ON CONFLICT (id) DO NOTHING;

-- 6. SEED PREDICTIVE HOTSPOTS
INSERT INTO hotspots (id, name, area, risk, risk_score, complaints_count, trend, trend_direction, primary_issue, secondary_issue, coord_x, coord_y, peak_hours, ai_recommendation, deep_analysis, is_prototype)
VALUES
(
  'HS-01',
  'Civil Lines Commercial Hub',
  'Civil Lines',
  'HIGH',
  91,
  23,
  '+28%',
  'up',
  'Overflowing bins',
  'Commercial food waste',
  38,
  32,
  '5:00 PM – 8:30 PM',
  'Increase evening collection frequency between 5 PM and 8 PM. Deploy two supplementary 1100L heavy-duty containers.',
  '{
    "possibleCause": "Surge in evening street food stalls and student foot traffic combined with a 12-hour gap between municipal rounds.",
    "confidence": "94% (Prototype Intelligence)",
    "recurringCycle": "Every Friday & Saturday evening",
    "recommendedIntervention": "Dynamic routing dispatch: reroute Truck #04 for an automated 6:30 PM clearance sweep.",
    "preventedCostSavings": "Estimated 3.4 hrs field crew overtime avoided weekly."
  }'::jsonb,
  true
),
(
  'HS-02',
  'Swaroop Nagar Residential Perimeter',
  'Swaroop Nagar',
  'MEDIUM',
  68,
  11,
  '-8%',
  'down',
  'Illegal dumping',
  'Construction debris',
  62,
  25,
  '9:00 PM – 11:30 PM',
  'Deploy mobile surveillance unit and install solar CCTV deterrent signage at Block C perimeter.',
  '{
    "possibleCause": "Unlit vacant plot boundary attracting unauthorized nighttime renovation contractors dumping debris.",
    "confidence": "88% (Prototype Intelligence)",
    "recurringCycle": "Bi-weekly mid-month",
    "recommendedIntervention": "Install perimeter barrier fencing and schedule neighborhood vigilance inspection.",
    "preventedCostSavings": "Prevents repeated heavy JCB excavator hiring costs."
  }'::jsonb,
  true
),
(
  'HS-03',
  'Mall Road Shopping Promenade',
  'Mall Road',
  'HIGH',
  86,
  19,
  '+14%',
  'up',
  'Roadside littering',
  'Single-use beverage plastic',
  50,
  65,
  '3:30 PM – 7:00 PM',
  'Install dual-stream smart sorting bins every 50 meters and engage shopkeeper association in morning cleanup pledge.',
  '{
    "possibleCause": "High pedestrian density with inadequate bin volume; current dustbins fill up within 90 minutes on weekends.",
    "confidence": "91% (Prototype Intelligence)",
    "recurringCycle": "Weekends & holiday afternoons",
    "recommendedIntervention": "Install solar compactor bins that notify sanitation control room at 80% capacity.",
    "preventedCostSavings": "Reduces daily manual roadside sweeping labor hours by 40%."
  }'::jsonb,
  true
),
(
  'HS-04',
  'Kakadeo Coaching Corridor',
  'Kakadeo',
  'LOW',
  34,
  5,
  '-22%',
  'down',
  'Missed morning collection',
  'Pamphlet & paper waste',
  22,
  70,
  '8:00 AM – 10:00 AM',
  'Maintain current morning door-to-door schedule. Recent route adjustment successfully reduced complaints by 22%.',
  '{
    "possibleCause": "Previous driver navigation bottlenecks on narrow alleyways resolved with GPS micro-van routing.",
    "confidence": "85% (Prototype Intelligence)",
    "recurringCycle": "Historically Mondays only",
    "recommendedIntervention": "Routine weekly telemetry monitoring; no emergency intervention needed.",
    "preventedCostSavings": "Achieved sustained 92% citizen satisfaction in Sector 3."
  }'::jsonb,
  true
),
(
  'HS-05',
  'Govind Nagar Industrial Fringe',
  'Govind Nagar',
  'MEDIUM',
  72,
  14,
  '+6%',
  'up',
  'Improper Segregation',
  'Industrial packaging foam',
  78,
  80,
  '1:00 PM – 3:00 PM',
  'Conduct targeted compliance audit of local small-scale workshop packaging disposal.',
  '{
    "possibleCause": "Packaging waste mixed into municipal compactor due to lack of separate recyclable pickup channel.",
    "confidence": "89% (Prototype Intelligence)",
    "recurringCycle": "Post-shipment weekdays",
    "recommendedIntervention": "Provide dedicated commercial cardboard baling service pickup on Tuesday and Thursday.",
    "preventedCostSavings": "Prevents mixed contamination at central recycling MRF."
  }'::jsonb,
  true
)
ON CONFLICT (id) DO NOTHING;

-- 7. SEED AWARENESS CONTENT
INSERT INTO awareness_content (id, title, category, color, bin_color, examples, disposal_guide, environmental_impact)
VALUES
(
  'aw-wet',
  'Wet Waste Management',
  'Wet Waste',
  'emerald',
  'Green Bin',
  '["Vegetable & fruit peels", "Leftover cooked food", "Tea leaves & coffee grounds", "Eggshells & bones", "Garden leaves"]'::jsonb,
  'Store in breathable containers. Drain excess liquid. Do not line green bins with plastic bags.',
  'Processed via community aerobic composting or anaerobic digestion into bio-gas fuel.'
),
(
  'aw-dry',
  'Dry Waste Management',
  'Dry Waste',
  'sky',
  'Blue Bin',
  '["Cardboard & paper packaging", "Clean plastic wrappers", "Metal foil & tin cans", "Rubber & leather scraps", "Textile clippings"]'::jsonb,
  'Keep clean and dry. Rinse food residues to prevent microbial contamination and pest infestation.',
  'Mechanically segregated at Material Recovery Facilities (MRF) and baled for industrial reuse.'
),
(
  'aw-recyclable',
  'Recyclable Materials',
  'Recyclable Waste',
  'teal',
  'Teal / White Bin',
  '["PET bottles", "Aluminum drink cans", "Glass jars", "HDPE shampoo containers", "Clean corrugated cartons"]'::jsonb,
  'Flatten bottles and cartons to conserve space. Remove plastic caps where required.',
  'Recycled directly into new manufacturing feedstocks, slashing raw resource extraction.'
),
(
  'aw-ewaste',
  'Safe Electronic Disposal',
  'E-Waste',
  'purple',
  'Designated Depot Box',
  '["Smartphones & laptops", "Power adapters & cables", "Broken LED bulbs", "Circuit boards", "Small kitchen appliances"]'::jsonb,
  'Book an on-demand specialized pickup through Nexus Clean. Never throw in household rubbish.',
  'Precious metals (copper, gold, silver) extracted in certified eco-dismantling plants.'
),
(
  'aw-hazardous',
  'Hazardous Materials',
  'Hazardous Waste',
  'rose',
  'Red Bin / Sealed Pack',
  '["Medical syringes & bandages", "Paint thinners & solvent cans", "Pesticide containers", "Expired medicines", "Chemical bottles"]'::jsonb,
  'Keep tightly sealed in heavy-duty containment bags clearly marked HAZARD.',
  'Incinerated at regulated high temperatures or placed in engineered secure hazardous landfills.'
)
ON CONFLICT (id) DO NOTHING;

-- 8. SEED NOTIFICATIONS
INSERT INTO notifications (user_id, title, message, type, is_read, link)
VALUES
('USR-CITIZEN-01', 'Resolution Proof Submitted', 'Resolution proof submitted for Complaint #NC-1042.', 'info', false, '/citizen/complaints/NC-1042'),
('USR-CITIZEN-01', 'Eco Score Points Awarded', 'You earned +10 Eco Points for reporting verified waste issue.', 'success', false, '/citizen/eco-score'),
('USR-ADMIN-01', 'High Risk Hotspot Alert', 'Hotspot HS-01 (Civil Lines) reached 91 Risk Score. Action recommended.', 'warning', false, '/admin/predictive');
