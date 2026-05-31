import { describe, it, expect } from 'vitest';
import { convertToCSV, downloadCSV } from './csvUtils';

describe('CSV Utilities', () => {
  describe('convertToCSV', () => {
    it('should convert an array of objects to a CSV string', () => {
      const data = [
        { id: 1, name: 'Alice', role: 'admin' },
        { id: 2, name: 'Bob', role: 'user' },
      ];
      const csv = convertToCSV(data);
      expect(csv).toBe('id,name,role\n1,Alice,admin\n2,Bob,user');
    });

    it('should handle empty data', () => {
      expect(convertToCSV([])).toBe('');
    });

    it('should handle special characters and commas in values', () => {
      const data = [
        { name: 'Smith, John', note: 'Line 1\nLine 2' },
      ];
      const csv = convertToCSV(data);
      // Basic implementation might not handle quotes/escaping yet, 
      // but let's see what we need.
      // For now, let's assume simple CSV.
      expect(csv).toContain('"Smith, John"');
    });
  });
});
