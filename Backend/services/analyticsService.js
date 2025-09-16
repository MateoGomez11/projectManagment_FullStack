const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function countByStatus() {
  const rows = await prisma.project.groupBy({
    by: ['status'],
    _count: { _all: true },
  });
  return rows.map(r => ({ status: r.status, count: r._count._all }));
}

async function countByMonth() {
  const rows = await prisma.project.findMany({
    select: { startDate: true },
    orderBy: { startDate: 'asc' },
  });

  const counts = {};
  rows.forEach(r => {
    if (r.startDate) {
      const d = new Date(r.startDate);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      counts[key] = (counts[key] || 0) + 1;
    }
  });

  return Object.entries(counts).map(([month, count]) => ({ month, count }));
}

module.exports = {countByStatus, countByMonth}