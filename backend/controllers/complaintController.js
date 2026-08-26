const { run, get, all } = require('../config/database');

// Helper to generate a realistic tracking ID: CC-2026-XXXX
const generateComplaintId = () => {
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `CC-2026-${rand}`;
};

// 1. Create a new waste complaint (Citizen)
const createComplaint = async (req, res, next) => {
  try {
    const {
      category,
      description,
      imageUrl,
      latitude,
      longitude,
      address,
      landmark,
      priority,
      aiSuggestedCategory,
      aiConfidence
    } = req.body;

    // Validation
    if (!category || !description || !imageUrl || latitude === undefined || longitude === undefined || !address) {
      return res.status(400).json({
        success: false,
        message: 'Please provide category, description, waste image, location coordinates, and address.'
      });
    }

    const latNum = parseFloat(latitude);
    const lngNum = parseFloat(longitude);
    if (isNaN(latNum) || isNaN(lngNum) || latNum < -90 || latNum > 90 || lngNum < -180 || lngNum > 180) {
      return res.status(400).json({
        success: false,
        message: 'Invalid latitude/longitude coordinates.'
      });
    }

    // Generate unique complaint ID with collision check
    let complaintId;
    let exists = true;
    while (exists) {
      complaintId = generateComplaintId();
      const row = await get('SELECT id FROM complaints WHERE id = ?', [complaintId]);
      if (!row) exists = false;
    }

    const resolvedPriority = priority || (category === 'Mixed waste' || category === 'Organic/Wet waste' ? 'High' : 'Medium');

    await run(
      `INSERT INTO complaints (
        id, user_id, category, description, image_url,
        latitude, longitude, address, landmark, priority,
        status, ai_suggested_category, ai_confidence
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Reported', ?, ?)`,
      [
        complaintId,
        req.user.id,
        category,
        description.trim(),
        imageUrl,
        latNum,
        lngNum,
        address.trim(),
        landmark ? landmark.trim() : null,
        resolvedPriority,
        aiSuggestedCategory || null,
        aiConfidence ? parseFloat(aiConfidence) : null
      ]
    );

    // Record initial status history
    await run(
      `INSERT INTO status_history (complaint_id, previous_status, new_status, changed_by, notes)
       VALUES (?, NULL, 'Reported', ?, 'Waste report submitted by citizen with GPS location and AI categorization tag.')`,
      [complaintId, req.user.name || 'Citizen']
    );

    const created = await get(
      `SELECT c.*, u.name as citizen_name, u.phone as citizen_phone, u.email as citizen_email
       FROM complaints c
       JOIN users u ON c.user_id = u.id
       WHERE c.id = ?`,
      [complaintId]
    );

    res.status(201).json({
      success: true,
      message: `Complaint submitted successfully! Your tracking ID is ${complaintId}`,
      complaint: created
    });
  } catch (error) {
    next(error);
  }
};

// 2. Get all complaints (Admin or GIS Map)
const getAllComplaints = async (req, res, next) => {
  try {
    const { status, category, priority, search } = req.query;

    let query = `
      SELECT 
        c.*,
        u.name AS citizen_name,
        u.email AS citizen_email,
        u.phone AS citizen_phone,
        w.name AS worker_name,
        w.phone AS worker_phone,
        w.zone AS worker_zone,
        w.vehicle_number AS worker_vehicle
      FROM complaints c
      LEFT JOIN users u ON c.user_id = u.id
      LEFT JOIN workers w ON c.assigned_worker_id = w.id
      WHERE 1=1
    `;
    const params = [];

    if (status && status !== 'all') {
      query += ` AND c.status = ?`;
      params.push(status);
    }

    if (category && category !== 'all') {
      query += ` AND c.category = ?`;
      params.push(category);
    }

    if (priority && priority !== 'all') {
      query += ` AND c.priority = ?`;
      params.push(priority);
    }

    if (search) {
      query += ` AND (c.id LIKE ? OR c.description LIKE ? OR c.address LIKE ? OR c.landmark LIKE ?)`;
      const term = `%${search}%`;
      params.push(term, term, term, term);
    }

    query += ` ORDER BY c.created_at DESC`;

    const complaints = await all(query, params);

    res.json({
      success: true,
      count: complaints.length,
      complaints
    });
  } catch (error) {
    next(error);
  }
};

// 3. Get complaints reported by logged-in citizen
const getMyComplaints = async (req, res, next) => {
  try {
    const complaints = await all(
      `SELECT 
        c.*,
        w.name AS worker_name,
        w.phone AS worker_phone,
        w.zone AS worker_zone
      FROM complaints c
      LEFT JOIN workers w ON c.assigned_worker_id = w.id
      WHERE c.user_id = ?
      ORDER BY c.created_at DESC`,
      [req.user.id]
    );

    res.json({
      success: true,
      count: complaints.length,
      complaints
    });
  } catch (error) {
    next(error);
  }
};

// 4. Get detailed complaint by ID (includes status history)
const getComplaintById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const complaint = await get(
      `SELECT 
        c.*,
        u.name AS citizen_name,
        u.email AS citizen_email,
        u.phone AS citizen_phone,
        w.name AS worker_name,
        w.phone AS worker_phone,
        w.zone AS worker_zone,
        w.designation AS worker_designation,
        w.vehicle_number AS worker_vehicle
      FROM complaints c
      LEFT JOIN users u ON c.user_id = u.id
      LEFT JOIN workers w ON c.assigned_worker_id = w.id
      WHERE c.id = ?`,
      [id]
    );

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: `Complaint with ID ${id} not found.`
      });
    }

    // Fetch full timeline/audit history
    const history = await all(
      `SELECT * FROM status_history WHERE complaint_id = ? ORDER BY created_at ASC`,
      [id]
    );

    res.json({
      success: true,
      complaint: {
        ...complaint,
        history
      }
    });
  } catch (error) {
    next(error);
  }
};

// 5. Assign complaint to worker (Admin)
const assignWorker = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { workerId, notes } = req.body;

    if (!workerId) {
      return res.status(400).json({
        success: false,
        message: 'Worker ID is required.'
      });
    }

    const complaint = await get('SELECT * FROM complaints WHERE id = ?', [id]);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found.' });
    }

    const worker = await get('SELECT * FROM workers WHERE id = ?', [workerId]);
    if (!worker) {
      return res.status(404).json({ success: false, message: 'Worker not found.' });
    }

    const previousStatus = complaint.status;
    const newStatus = previousStatus === 'Reported' ? 'Assigned' : previousStatus;

    await run(
      `UPDATE complaints 
       SET assigned_worker_id = ?, status = ?, updated_at = CURRENT_TIMESTAMP,
           admin_notes = COALESCE(?, admin_notes)
       WHERE id = ?`,
      [workerId, newStatus, notes || `Assigned to ${worker.name}`, id]
    );

    // Audit log
    await run(
      `INSERT INTO status_history (complaint_id, previous_status, new_status, changed_by, notes)
       VALUES (?, ?, ?, ?, ?)`,
      [
        id,
        previousStatus,
        newStatus,
        req.user.name || 'Admin',
        notes || `Assigned task to worker ${worker.name} (${worker.designation}, Zone: ${worker.zone}, Vehicle: ${worker.vehicle_number || 'N/A'})`
      ]
    );

    // Update worker active task counter
    await run(
      `UPDATE workers 
       SET active_tasks = (SELECT COUNT(*) FROM complaints WHERE assigned_worker_id = ? AND status IN ('Assigned', 'In Progress'))
       WHERE id = ?`,
      [workerId, workerId]
    );

    const updated = await get(
      `SELECT c.*, w.name as worker_name, w.phone as worker_phone, w.zone as worker_zone 
       FROM complaints c 
       LEFT JOIN workers w ON c.assigned_worker_id = w.id 
       WHERE c.id = ?`,
      [id]
    );

    res.json({
      success: true,
      message: `Complaint ${id} assigned to ${worker.name}.`,
      complaint: updated
    });
  } catch (error) {
    next(error);
  }
};

// 6. Update complaint status (Admin)
const updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, notes, resolutionImageUrl, priority } = req.body;

    const validStatuses = ['Reported', 'Assigned', 'In Progress', 'Resolved'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const complaint = await get('SELECT * FROM complaints WHERE id = ?', [id]);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found.' });
    }

    const previousStatus = complaint.status;
    const isResolving = status === 'Resolved';

    await run(
      `UPDATE complaints 
       SET status = ?, 
           priority = COALESCE(?, priority),
           admin_notes = COALESCE(?, admin_notes),
           resolution_image_url = COALESCE(?, resolution_image_url),
           resolved_at = CASE WHEN ? = 'Resolved' THEN CURRENT_TIMESTAMP ELSE resolved_at END,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        status,
        priority || null,
        notes || null,
        resolutionImageUrl || null,
        status,
        id
      ]
    );

    // Record audit trail
    await run(
      `INSERT INTO status_history (complaint_id, previous_status, new_status, changed_by, notes)
       VALUES (?, ?, ?, ?, ?)`,
      [
        id,
        previousStatus,
        status,
        req.user.name || 'Municipal Officer',
        notes || `Status updated from ${previousStatus} to ${status}`
      ]
    );

    // If complaint was resolved and had a worker, refresh worker's active tasks
    if (complaint.assigned_worker_id) {
      await run(
        `UPDATE workers 
         SET active_tasks = (SELECT COUNT(*) FROM complaints WHERE assigned_worker_id = ? AND status IN ('Assigned', 'In Progress'))
         WHERE id = ?`,
        [complaint.assigned_worker_id, complaint.assigned_worker_id]
      );
    }

    const updated = await get(
      `SELECT c.*, w.name as worker_name, w.phone as worker_phone 
       FROM complaints c 
       LEFT JOIN workers w ON c.assigned_worker_id = w.id 
       WHERE c.id = ?`,
      [id]
    );

    const history = await all(
      `SELECT * FROM status_history WHERE complaint_id = ? ORDER BY created_at ASC`,
      [id]
    );

    res.json({
      success: true,
      message: `Complaint ${id} status updated to ${status}.`,
      complaint: {
        ...updated,
        history
      }
    });
  } catch (error) {
    next(error);
  }
};

// 7. Public status tracking (no login required, used by citizen tracker)
const trackPublic = async (req, res, next) => {
  try {
    const { id } = req.params;

    const complaint = await get(
      `SELECT 
        c.id, c.category, c.description, c.image_url, c.resolution_image_url,
        c.status, c.priority, c.address, c.landmark, c.created_at, c.updated_at, c.resolved_at,
        c.admin_notes,
        w.name AS worker_name, w.zone AS worker_zone, w.phone AS worker_phone
      FROM complaints c
      LEFT JOIN workers w ON c.assigned_worker_id = w.id
      WHERE c.id = ?`,
      [id.trim().toUpperCase()]
    );

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: `No complaint found with ID "${id}". Please check your tracking number (format: CC-2026-XXXX).`
      });
    }

    const history = await all(
      `SELECT previous_status, new_status, changed_by, notes, created_at 
       FROM status_history 
       WHERE complaint_id = ? 
       ORDER BY created_at ASC`,
      [complaint.id]
    );

    res.json({
      success: true,
      complaint: {
        ...complaint,
        history
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createComplaint,
  getAllComplaints,
  getMyComplaints,
  getComplaintById,
  assignWorker,
  updateStatus,
  trackPublic
};
