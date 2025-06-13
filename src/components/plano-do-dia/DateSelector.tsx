
import React from 'react';
import { Input } from '@/components/ui/input';

interface DateSelectorProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

const DateSelector = ({ selectedDate, onDateChange }: DateSelectorProps) => {
  return (
    <div className="mb-6">
      <div className="flex items-center space-x-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="w-auto"
          />
        </div>
        <div className="flex items-center mt-6 px-3 py-1 bg-white rounded-lg shadow-sm">
          <i className="ri-sun-line text-yellow-500 w-5 h-5 mr-2"></i>
          <span className="text-sm text-gray-600">28°C - São Paulo</span>
        </div>
      </div>
    </div>
  );
};

export default DateSelector;
