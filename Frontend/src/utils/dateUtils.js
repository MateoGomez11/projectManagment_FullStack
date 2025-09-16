// Utilidades para manejo de fechas
export const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatDateShort = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('es-ES');
};

export const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  return dateString.split('T')[0];
};

export const createISODate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toISOString();
};


export const formatMonthYearShort = (yyyyMm) => {
  if (!yyyyMm) return '';
  const [y, m] = String(yyyyMm).split('-').map(Number);
  if (!y || !m) return String(yyyyMm);
  const d = new Date(y, m - 1, 1);
  return new Intl.DateTimeFormat('es-ES', { month: 'short', year: '2-digit' }).format(d);
};
