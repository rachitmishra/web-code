/**
 * Converts an array of objects to a CSV string.
 */
export const convertToCSV = (data: any[]): string => {
  if (data.length === 0) return '';

  const headers = Object.keys(data[0]);
  const rows = data.map(obj => {
    return headers.map(header => {
      let val = obj[header];
      if (val === undefined || val === null) val = '';
      
      // Escape quotes and wrap in quotes if contains comma, newline or quotes
      const strVal = String(val);
      if (strVal.includes(',') || strVal.includes('\n') || strVal.includes('"')) {
        return `"${strVal.replace(/"/g, '""')}"`;
      }
      return strVal;
    }).join(',');
  });

  return [headers.join(','), ...rows].join('\n');
};

/**
 * Triggers a browser download for a CSV string.
 */
export const downloadCSV = (csv: string, filename: string) => {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
