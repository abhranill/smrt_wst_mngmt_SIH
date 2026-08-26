const { run, get, all } = require('../config/database');

// List all workers with their active task counts
const getAllWorkers = async (req, res, next) => {
  try {
    const workers = await all(`
      SELECT 
        w.*,
        COUNT(CASE WHEN c.status IN ('Assigned', 'In Progress') THEN 1 END) AS current_active_complaints
      FROM workers w
      LEFT JOIN complaints c ON c.assigned_worker_id = w.id
      GROUP BY w.id
      ORDER BY w.zone ASC, w.name ASC
    `);

    res.json({
      success: true,
      workers
    });
  } catch (error) {
    next(error);
  }
};

// Get single worker details
const getWorkerById = async (req, res, next) => {
  try {
    const worker = await get('SELECT * FROM workers WHERE id = ?', [req.params.id]);
    if (!worker) {
      return res.status(404).json({ success: false, message: 'Worker not found' });
    }

    const tasks = await all(
      `SELECT id, category, priority, status, address, created_at 
       FROM complaints 
       WHERE assigned_worker_id = ? 
       ORDER BY created_at DESC`,
      [req.params.id]
    );

    res.json({
      success: true,
      worker: {
        ...worker,
        tasks
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllWorkers,
  getWorkerById
};
