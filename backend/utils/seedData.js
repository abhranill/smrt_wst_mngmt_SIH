const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const { run, get, all } = require('../config/database');

// Create lightweight sample images if not present
const createSampleImages = () => {
  const uploadDir = path.join(__dirname, '../uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const sampleImages = [
    {
      name: 'sample-plastic-bottles.svg',
      title: 'Plastic Waste Collection',
      color: '#0284c7',
      icon: '🍾 🥤',
      desc: 'Single-use PET bottles & polythene packaging'
    },
    {
      name: 'sample-organic-vegetable.svg',
      title: 'Organic Food Waste',
      color: '#16a34a',
      icon: '🥦 🍌',
      desc: 'Fruit peels and wet kitchen food scraps'
    },
    {
      name: 'sample-cardboard-boxes.svg',
      title: 'Paper & Cardboard Scrap',
      color: '#d97706',
      icon: '📦 📰',
      desc: 'Corrugated cartons and folded packaging sheets'
    },
    {
      name: 'sample-glass-bottles.svg',
      title: 'Glass Shards & Bottles',
      color: '#0d9488',
      icon: '🍶 🪟',
      desc: 'Discarded beverage glass and broken jars'
    },
    {
      name: 'sample-metal-cans.svg',
      title: 'Metal Cans & Scrap',
      color: '#475569',
      icon: '🥫 🔩',
      desc: 'Aluminum soda cans and metal tin scrap'
    },
    {
      name: 'sample-mixed-garbage.svg',
      title: 'Mixed Roadside Garbage',
      color: '#dc2626',
      icon: '🗑️ ⚠️',
      desc: 'Unsegregated municipal roadside waste pile'
    },
    {
      name: 'sample-resolved-clean.svg',
      title: 'Sanitation Verification: Area Cleaned',
      color: '#059669',
      icon: '✨ 🧹',
      desc: 'Site cleared and sanitized by Municipal Sanitation Squad'
    }
  ];

  for (const item of sampleImages) {
    const filePath = path.join(uploadDir, item.name);
    if (!fs.existsSync(filePath)) {
      const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="600" height="400" viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${item.color};stop-opacity:0.9" />
      <stop offset="100%" style="stop-color:#0f172a;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="600" height="400" fill="url(#grad)" rx="16"/>
  <circle cx="300" cy="160" r="70" fill="rgba(255,255,255,0.15)"/>
  <text x="300" y="180" font-size="64" text-anchor="middle">${item.icon}</text>
  <text x="300" y="270" font-size="24" font-weight="bold" fill="#ffffff" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif">${item.title}</text>
  <text x="300" y="305" font-size="14" fill="#e2e8f0" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif">${item.desc}</text>
  <rect x="200" y="335" width="200" height="28" rx="14" fill="rgba(255,255,255,0.2)"/>
  <text x="300" y="354" font-size="12" font-weight="600" fill="#ffffff" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif">SIH 2026 Verified Sample</text>
</svg>`;
      fs.writeFileSync(filePath, svg);
    }
  }
};

const seedDatabase = async (force = false) => {
  try {
    createSampleImages();

    // Check if already seeded
    const userCount = await get('SELECT COUNT(*) as count FROM users');
    if (userCount && userCount.count > 0 && !force) {
      console.log('ℹ️ Database already contains data. Skipping initial seeding.');
      return;
    }

    if (force) {
      console.log('🔄 Re-seeding database...');
      await run('DELETE FROM status_history');
      await run('DELETE FROM complaints');
      await run('DELETE FROM workers');
      await run('DELETE FROM users');
    }

    console.log('🌱 Seeding CleanCity 360 database with initial data...');

    const salt = await bcrypt.genSalt(10);
    const adminPasswordHash = await bcrypt.hash('Admin@123', salt);
    const citizenPasswordHash = await bcrypt.hash('Citizen@123', salt);

    // 1. Insert Users
    const adminUser = await run(
      `INSERT INTO users (name, email, password_hash, role, phone) 
       VALUES (?, ?, ?, 'admin', ?)`,
      ['Shri Rajesh Verma (Zonal Health Officer)', 'admin@cleancity.gov.in', adminPasswordHash, '+91 94123 00001']
    );

    const citizen1 = await run(
      `INSERT INTO users (name, email, password_hash, role, phone) 
       VALUES (?, ?, ?, 'citizen', ?)`,
      ['Priya Sharma', 'citizen@cleancity.gov.in', citizenPasswordHash, '+91 98765 11111']
    );

    const citizen2 = await run(
      `INSERT INTO users (name, email, password_hash, role, phone) 
       VALUES (?, ?, ?, 'citizen', ?)`,
      ['Rahul Sen', 'rahul@gmail.com', citizenPasswordHash, '+91 98765 22222']
    );

    // 2. Insert Workers
    const workers = [
      {
        name: 'Ramesh Kumar',
        phone: '+91 98765 43210',
        zone: 'Zone 1 - Central Market',
        designation: 'Sanitation Squad Lead',
        vehicle: 'DL-01-EA-4521'
      },
      {
        name: 'Sunita Devi',
        phone: '+91 98765 43211',
        zone: 'Zone 2 - Western Sector',
        designation: 'Dry Waste Segregation Specialist',
        vehicle: 'DL-02-GB-9812'
      },
      {
        name: 'Rajesh Sharma',
        phone: '+91 98765 43212',
        zone: 'Zone 3 - Eastern Corridor',
        designation: 'Organic Bio-Compost Supervisor',
        vehicle: 'DL-03-TC-3341'
      },
      {
        name: 'Mohammed Arif',
        phone: '+91 98765 43213',
        zone: 'Zone 4 - Northern Industrial',
        designation: 'Heavy Waste Tipper Driver',
        vehicle: 'DL-04-TR-7729'
      },
      {
        name: 'Kavita Patra',
        phone: '+91 98765 43214',
        zone: 'Zone 5 - Southern Suburb',
        designation: 'Ward Rapid Response Inspector',
        vehicle: 'DL-05-EV-1120'
      }
    ];

    const workerIds = [];
    for (const w of workers) {
      const res = await run(
        `INSERT INTO workers (name, phone, zone, designation, vehicle_number, status)
         VALUES (?, ?, ?, ?, ?, 'available')`,
        [w.name, w.phone, w.zone, w.designation, w.vehicle]
      );
      workerIds.push(res.id);
    }

    // 3. Sample Complaints with realistic coordinates in urban center
    const complaints = [
      {
        id: 'CC-2026-1001',
        user_id: citizen1.id,
        category: 'Plastic',
        description: 'Large pile of single-use plastic water bottles, disposable cups, and polythene wrappers scattered across the pavement near Bus Stand exit.',
        image_url: '/uploads/sample-plastic-bottles.svg',
        resolution_image_url: null,
        latitude: 28.6328,
        longitude: 77.2197,
        address: 'Near Gate 4, Central Bus Terminus, Connaught Place, Ward 1',
        landmark: 'Opposite State Bank ATM',
        priority: 'Medium',
        status: 'Reported',
        worker_id: null,
        admin_notes: 'Automated triage completed. Queued for zonal dispatch.',
        ai_suggested_category: 'Plastic',
        ai_confidence: 0.91
      },
      {
        id: 'CC-2026-1002',
        user_id: citizen2.id,
        category: 'Mixed waste',
        description: 'Severe open roadside dump overflowing onto the road. Foul smell and stray animal congregation causing traffic hazard.',
        image_url: '/uploads/sample-mixed-garbage.svg',
        resolution_image_url: null,
        latitude: 28.6517,
        longitude: 77.1906,
        address: '14/B Ajmal Khan Road, Northern Sector, Karol Bagh, Ward 4',
        landmark: 'Behind Government Girls School',
        priority: 'Critical',
        status: 'Reported',
        worker_id: null,
        admin_notes: 'Flagged as high-density hotspot. Requires mechanized backhoe loader.',
        ai_suggested_category: 'Mixed waste',
        ai_confidence: 0.84
      },
      {
        id: 'CC-2026-1003',
        user_id: citizen1.id,
        category: 'Organic/Wet waste',
        description: 'Rotting vegetable heaps and fruit waste dumped after morning market. Breeding flies and emitting strong odor.',
        image_url: '/uploads/sample-organic-vegetable.svg',
        resolution_image_url: null,
        latitude: 28.6389,
        longitude: 77.2412,
        address: 'Subzi Mandi Wholesale Complex, Eastern Corridor, Ward 3',
        landmark: 'Near Wholesale Shed No. 3',
        priority: 'High',
        status: 'Assigned',
        worker_id: workerIds[2], // Rajesh Sharma
        admin_notes: 'Assigned to Bio-Compost squad for transfer to Okhla Waste-to-Energy composting unit.',
        ai_suggested_category: 'Organic/Wet waste',
        ai_confidence: 0.88
      },
      {
        id: 'CC-2026-1004',
        user_id: citizen2.id,
        category: 'Paper',
        description: 'Disposed industrial carton packages, shipping crates, and shredded paper accumulated behind logistics warehouse.',
        image_url: '/uploads/sample-cardboard-boxes.svg',
        resolution_image_url: null,
        latitude: 28.6214,
        longitude: 77.1852,
        address: 'Plot 45, Western Sector Commercial Block, Ward 2',
        landmark: 'Next to Courier Logistics Hub',
        priority: 'Medium',
        status: 'Assigned',
        worker_id: workerIds[1], // Sunita Devi
        admin_notes: 'Dry recyclable pickup scheduled. Compact packaging truck routed.',
        ai_suggested_category: 'Paper',
        ai_confidence: 0.89
      },
      {
        id: 'CC-2026-1005',
        user_id: citizen1.id,
        category: 'Glass',
        description: 'Shattered glass bottles and broken window panels scattered across public walking track. Severe pedestrian safety risk.',
        image_url: '/uploads/sample-glass-bottles.svg',
        resolution_image_url: null,
        latitude: 28.6291,
        longitude: 77.2145,
        address: 'Public Walkway, Outer Circle, Connaught Place, Ward 1',
        landmark: 'Beside Central Park Pavilion',
        priority: 'High',
        status: 'In Progress',
        worker_id: workerIds[0], // Ramesh Kumar
        admin_notes: 'Worker Ramesh Kumar on site with puncture-proof protective gloves and glass containment drum.',
        ai_suggested_category: 'Glass',
        ai_confidence: 0.86
      },
      {
        id: 'CC-2026-1006',
        user_id: citizen2.id,
        category: 'Metal',
        description: 'Rusted tin sheets, beverage cans, and discarded metal rebar obstructing stormwater drainage channel.',
        image_url: '/uploads/sample-metal-cans.svg',
        resolution_image_url: null,
        latitude: 28.6582,
        longitude: 77.2011,
        address: 'Drainage Channel Bridge, Northern Industrial Area, Ward 4',
        landmark: 'Near Power Substation',
        priority: 'Medium',
        status: 'In Progress',
        worker_id: workerIds[3], // Mohammed Arif
        admin_notes: 'Tipper truck deployed to clear channel before monsoon runoff.',
        ai_suggested_category: 'Metal',
        ai_confidence: 0.87
      },
      {
        id: 'CC-2026-1007',
        user_id: citizen1.id,
        category: 'Mixed waste',
        description: 'Heavy overflow of roadside community bin. Garbage spilling over 20 square meters onto footpath.',
        image_url: '/uploads/sample-mixed-garbage.svg',
        resolution_image_url: '/uploads/sample-resolved-clean.svg',
        latitude: 28.6341,
        longitude: 77.2183,
        address: 'Barakhamba Road Junction, Central Market, Ward 1',
        landmark: 'Opposite Metro Station Exit 2',
        priority: 'High',
        status: 'Resolved',
        worker_id: workerIds[0], // Ramesh Kumar
        admin_notes: 'Area thoroughly cleared, sanitized with bleaching powder, and new covered dustbins installed.',
        ai_suggested_category: 'Mixed waste',
        ai_confidence: 0.82
      },
      {
        id: 'CC-2026-1008',
        user_id: citizen2.id,
        category: 'Organic/Wet waste',
        description: 'Pruned tree branches and dried foliage piled up in municipal park, drying out and creating a fire hazard.',
        image_url: '/uploads/sample-organic-vegetable.svg',
        resolution_image_url: '/uploads/sample-resolved-clean.svg',
        latitude: 28.5724,
        longitude: 77.2289,
        address: 'Green Belt Community Park, Southern Suburb, Ward 5',
        landmark: 'Jogging Track Perimeter',
        priority: 'Low',
        status: 'Resolved',
        worker_id: workerIds[4], // Kavita Patra
        admin_notes: 'Horticulture waste shredded and turned into mulch for park flowerbeds.',
        ai_suggested_category: 'Organic/Wet waste',
        ai_confidence: 0.89
      }
    ];

    for (const c of complaints) {
      await run(
        `INSERT INTO complaints (
          id, user_id, category, description, image_url, resolution_image_url,
          latitude, longitude, address, landmark, priority, status,
          assigned_worker_id, admin_notes, ai_suggested_category, ai_confidence,
          created_at, updated_at, resolved_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 
          datetime('now', '-2 days'), 
          datetime('now', '-1 hours'), 
          ${c.status === 'Resolved' ? "datetime('now', '-30 minutes')" : 'NULL'})`,
        [
          c.id, c.user_id, c.category, c.description, c.image_url, c.resolution_image_url,
          c.latitude, c.longitude, c.address, c.landmark, c.priority, c.status,
          c.worker_id, c.admin_notes, c.ai_suggested_category, c.ai_confidence
        ]
      );

      // Add status history
      await run(
        `INSERT INTO status_history (complaint_id, previous_status, new_status, changed_by, notes, created_at)
         VALUES (?, NULL, 'Reported', 'Citizen', 'Report filed with geo-coordinates and photo verification.', datetime('now', '-2 days'))`,
        [c.id]
      );

      if (c.status === 'Assigned' || c.status === 'In Progress' || c.status === 'Resolved') {
        const workerName = workers.find((w, idx) => workerIds[idx] === c.worker_id)?.name || 'Sanitation Worker';
        await run(
          `INSERT INTO status_history (complaint_id, previous_status, new_status, changed_by, notes, created_at)
           VALUES (?, 'Reported', 'Assigned', 'Municipal Control Room', 'Assigned to field technician ${workerName}', datetime('now', '-1 days'))`,
          [c.id]
        );
      }

      if (c.status === 'In Progress' || c.status === 'Resolved') {
        await run(
          `INSERT INTO status_history (complaint_id, previous_status, new_status, changed_by, notes, created_at)
           VALUES (?, 'Assigned', 'In Progress', 'Field Operations', 'Sanitation vehicle dispatched to location. Cleanup initiated.', datetime('now', '-4 hours'))`,
          [c.id]
        );
      }

      if (c.status === 'Resolved') {
        await run(
          `INSERT INTO status_history (complaint_id, previous_status, new_status, changed_by, notes, created_at)
           VALUES (?, 'In Progress', 'Resolved', 'Zonal Health Officer', 'Site inspected and verified clean. Resolved with photo proof.', datetime('now', '-30 minutes'))`,
          [c.id]
        );
      }
    }

    // Refresh workers active task counts
    for (const wId of workerIds) {
      await run(
        `UPDATE workers 
         SET active_tasks = (SELECT COUNT(*) FROM complaints WHERE assigned_worker_id = ? AND status IN ('Assigned', 'In Progress'))
         WHERE id = ?`,
        [wId, wId]
      );
    }

    console.log('✅ Database seeded successfully with 2 test accounts, 5 workers, and 8 realistic complaints.');
  } catch (err) {
    console.error('❌ Error during seeding:', err);
  }
};

module.exports = {
  seedDatabase,
  createSampleImages
};
