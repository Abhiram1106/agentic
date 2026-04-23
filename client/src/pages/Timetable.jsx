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

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {sortedSchedule.map((day) => (
          <div key={day._id || day.dayOfWeek} className="card bg-white p-5 h-full flex flex-col shadow-sm border border-border">
            <h3 className="text-xl font-bold text-text mb-4 pb-2 border-b border-gray-100 flex items-center">
              <span className="w-2 h-6 bg-primary rounded mr-3"></span>
              {day.dayOfWeek}
            </h3>
            
            <div className="space-y-4 flex-1">
              {day.periods.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-sm font-medium">No classes</div>
              ) : (
                day.periods.map((period, idx) => (
                  <div key={period._id || idx} className="bg-gray-50 rounded-xl p-4 transition-all hover:shadow-md hover:bg-white hover:border-primary/20 border border-transparent">
                    <h4 className="font-bold text-text text-sm mb-2">{period.subject}</h4>
                    
                    <div className="space-y-2">
                      <div className="flex items-center text-xs text-gray-600">
                        <Clock size={14} className="mr-2 text-primary" />
                        <span className="font-medium">{period.startTime} - {period.endTime}</span>
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
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timetable;
