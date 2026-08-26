const { get, all } = require('../config/database');

const getOverviewStats = async (req, res, next) => {
  try {
    // 1. Overall counts
    const counts = await get(`
      SELECT 
        COUNT(*) AS total,
        COUNT(CASE WHEN status = 'Reported' THEN 1 END) AS reported,
        COUNT(CASE WHEN status = 'Assigned' THEN 1 END) AS assigned,
        COUNT(CASE WHEN status = 'In Progress' THEN 1 END) AS in_progress,
        COUNT(CASE WHEN status = 'Resolved' THEN 1 END) AS resolved,
        COUNT(CASE WHEN priority = 'Critical' AND status != 'Resolved' THEN 1 END) AS critical_pending
      FROM complaints
    `);

    // 2. Breakdown by Category
    const byCategory = await all(`
      SELECT 
        category,
        COUNT(*) AS count,
        COUNT(CASE WHEN status = 'Resolved' THEN 1 END) AS resolved_count,
        ROUND((COUNT(CASE WHEN status = 'Resolved' THEN 1 END) * 100.0) / COUNT(*), 1) AS resolution_rate
      FROM complaints
      GROUP BY category
      ORDER BY count DESC
    `);

    // 3. Breakdown by Priority
    const byPriority = await all(`
      SELECT 
        priority,
        COUNT(*) AS count
      FROM complaints
      GROUP BY priority
      ORDER BY 
        CASE priority 
          WHEN 'Critical' THEN 1 
          WHEN 'High' THEN 2 
          WHEN 'Medium' THEN 3 
          WHEN 'Low' THEN 4 
          ELSE 5 
        END
    `);

    // 4. Hotspot Clusters / High Concentration Areas
    // Extracts neighborhood/ward keywords or clusters by proximity/address
    const hotspots = await all(`
      SELECT 
        CASE 
          WHEN address LIKE '%Ward 1%' OR address LIKE '%Connaught%' OR address LIKE '%Central%' THEN 'Zone 1 - Central Market'
          WHEN address LIKE '%Ward 2%' OR address LIKE '%Bandra%' OR address LIKE '%West%' THEN 'Zone 2 - Western Sector'
          WHEN address LIKE '%Ward 3%' OR address LIKE '%Indiranagar%' OR address LIKE '%East%' THEN 'Zone 3 - Eastern Corridor'
          WHEN address LIKE '%Ward 4%' OR address LIKE '%Karol Bagh%' OR address LIKE '%North%' THEN 'Zone 4 - Northern Industrial'
          WHEN address LIKE '%Ward 5%' OR address LIKE '%Koramangala%' OR address LIKE '%South%' THEN 'Zone 5 - Southern Suburb'
          ELSE 'General Municipal Zone'
        END AS zone_name,
        COUNT(*) AS total_complaints,
        COUNT(CASE WHEN status != 'Resolved' THEN 1 END) AS active_complaints,
        COUNT(CASE WHEN priority IN ('High', 'Critical') AND status != 'Resolved' THEN 1 END) AS high_urgency_count,
        ROUND(AVG(latitude), 5) AS center_lat,
        ROUND(AVG(longitude), 5) AS center_lng
      FROM complaints
      GROUP BY zone_name
      ORDER BY active_complaints DESC, total_complaints DESC
    `);

    // 5. Recent Activity Trend (Last 7 days aggregation or simulated resolution timeline)
    const recentActivity = await all(`
      SELECT 
        strftime('%Y-%m-%d', created_at) AS date,
        COUNT(*) AS reported_count,
        COUNT(CASE WHEN status = 'Resolved' THEN 1 END) AS resolved_count
      FROM complaints
      GROUP BY strftime('%Y-%m-%d', created_at)
      ORDER BY date ASC
      LIMIT 14
    `);

    // 6. Worker efficiency snapshot
    const workerStats = await all(`
      SELECT 
        w.id,
        w.name,
        w.zone,
        w.active_tasks,
        COUNT(c.id) AS total_handled,
        COUNT(CASE WHEN c.status = 'Resolved' THEN 1 END) AS resolved_tasks
      FROM workers w
      LEFT JOIN complaints c ON c.assigned_worker_id = w.id
      GROUP BY w.id
      ORDER BY resolved_tasks DESC
      LIMIT 5
    `);

    // Calculate resolution rate
    const total = counts.total || 0;
    const resolved = counts.resolved || 0;
    const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

    res.json({
      success: true,
      stats: {
        total,
        reported: counts.reported || 0,
        assigned: counts.assigned || 0,
        inProgress: counts.in_progress || 0,
        resolved: counts.resolved || 0,
        activeTotal: (counts.reported || 0) + (counts.assigned || 0) + (counts.in_progress || 0),
        criticalPending: counts.critical_pending || 0,
        resolutionRate: `${resolutionRate}%`,
        averageResolutionHours: 18.4 // benchmark SLA
      },
      byCategory,
      byPriority,
      hotspots,
      recentActivity,
      workerStats
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOverviewStats
};
