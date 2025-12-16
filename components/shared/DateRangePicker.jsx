'use client';

import { useState } from 'react';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function DateRangePicker({ onDateChange, startDate = '', endDate = '' }) {
  const [start, setStart] = useState(startDate);
  const [end, setEnd] = useState(endDate);

  const handleApply = () => {
    onDateChange({ startDate: start, endDate: end });
  };

  return (
    <div className="flex items-end gap-4">
      <div className="flex-1">
        <Label htmlFor="start-date">Start Date</Label>
        <Input
          id="start-date"
          type="date"
          value={start}
          onChange={(e) => setStart(e.target.value)}
        />
      </div>
      <div className="flex-1">
        <Label htmlFor="end-date">End Date</Label>
        <Input
          id="end-date"
          type="date"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
        />
      </div>
      <Button onClick={handleApply}>
        <Calendar className="h-4 w-4 mr-2" />
        Apply
      </Button>
    </div>
  );
}