import React, { useState, useEffect } from 'react';
import { Clock, MapPin, User, CalendarDays } from 'lucide-react';
import API from '../services/api';

const Timetable = () => {
  const [timetable, setTimetable] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const res = await API.get('/student/timetable');
        // Handle empty schedule from backend
        if (res.data && res.data.schedule && res.data.schedule.length > 0) {
          setTimetable(res.data);
        } else {
          setTimetable(null);
        }
      } catch (err) {
        console.error('Error fetching timetable', err);
        setTimetable(null);
      } finally {
        setLoading(false);
      }
    };
    fetchTimetable();
  }, []);

  const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!timetable) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-4">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <CalendarDays size={32} className="text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-700">No Timetable Available</h2>
        <p className="text-gray-500 max-w-md">
          Your timetable hasn't been uploaded yet or there are no classes scheduled for your section. Please check back later.
        </p>
      </div>
    );
  }

  // Sort schedule by daysOrder
  const sortedSchedule = [...timetable.schedule].sort(
    (a, b) => daysOrder.indexOf(a.dayOfWeek) - daysOrder.indexOf(b.dayOfWeek)
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-text mb-2">Weekly Timetable</h1>
        <p className="text-gray-500">
          Your academic schedule for <span className="font-semibold text-primary">{timetable.department}</span>, 
          Year {timetable.year}, Sem {timetable.semester}, Section {timetable.section}.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50 border-b border-border">
                <th className="p-4 font-bold text-text uppercase text-xs tracking-wider border-r border-border w-32 bg-gray-100/50">Day</th>
                {Array.from({ length: Math.max(...sortedSchedule.map(d => d.periods.length)) || 1 }).map((_, idx) => (
                  <th key={idx} className="p-4 font-bold text-gray-500 uppercase text-xs tracking-wider border-r border-border text-center">
                    Period {idx + 1}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedSchedule.map((day, rowIdx) => (
                <tr key={day._id || day.dayOfWeek} className="border-b border-border hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 border-r border-border font-bold text-primary bg-gray-50/30 align-middle text-center">
                    {day.dayOfWeek}
                  </td>
                  
                  {day.periods.length === 0 ? (
                    <td colSpan="100%" className="p-4 text-center text-gray-400 text-sm font-medium italic bg-gray-50">
                      No classes scheduled
                    </td>
                  ) : (
                    // Fill periods
                    day.periods.map((period, colIdx) => (
                      <td key={period._id || colIdx} className="p-4 border-r border-border align-top min-w-[200px]">
                        <div className="bg-primary/5 rounded-xl p-3 border border-primary/10 hover:border-primary/30 hover:shadow-sm transition-all h-full">
                          <h4 className="font-bold text-text text-sm mb-2">{period.subject}</h4>
                          
                          <div className="space-y-1.5 mt-3">
                            <div className="flex items-center text-xs text-gray-600">
                              <Clock size={14} className="mr-2 text-primary" />
                              <span className="font-semibold">{period.startTime} - {period.endTime}</span>
                            </div>
                            <div className="flex items-center text-xs text-gray-600">
                              <MapPin size={14} className="mr-2 text-primary" />
                              <span>Room {period.room}</span>
                            </div>
                            <div className="flex items-center text-xs text-gray-600">
                              <User size={14} className="mr-2 text-primary" />
                              <span>{period.teacher}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                    ))
                  )}
                  {/* Fill empty cells if this day has fewer periods than maxPeriods */}
                  {Array.from({ length: Math.max(...sortedSchedule.map(d => d.periods.length)) - day.periods.length }).map((_, idx) => (
                    <td key={`empty-${idx}`} className="p-4 border-r border-border bg-gray-50/30"></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Timetable;
