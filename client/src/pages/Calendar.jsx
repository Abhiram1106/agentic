import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Filter, MapPin, Clock } from 'lucide-react';
import API from '../services/api';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await API.get('/student/calendar');
        setEvents(res.data);
      } catch (err) {
        console.error('Error fetching calendar events', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });

  const getEventsForDay = (day) => {
    return events.filter(event => isSameDay(new Date(event.startDate), day));
  };

  const eventTypes = ['All', 'Exam', 'Deadline', 'Holiday', 'Workshop', 'Event'];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text">Academic Calendar</h1>
          <p className="text-gray-500 mt-1">Keep track of your exams, deadlines, and cultural events.</p>
        </div>
        <div className="flex bg-white border border-border rounded-xl p-1 shadow-sm">
          {eventTypes.slice(0, 3).map(type => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${filter === type ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Calendar View (Simple List for MVP/Demo clarity or Mini Grid) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="card bg-white p-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-text">{format(currentMonth, 'MMMM yyyy')}</h2>
              <div className="flex space-x-2">
                <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 hover:bg-gray-100 rounded-lg"><ChevronLeft /></button>
                <button onClick={() => setCurrentMonth(new Date())} className="px-4 py-2 text-sm font-bold text-primary hover:bg-primary/5 rounded-lg">Today</button>
                <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 hover:bg-gray-100 rounded-lg"><ChevronRight /></button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-px bg-border border border-border rounded-xl overflow-hidden">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="bg-gray-50 p-4 text-center text-xs font-bold text-gray-500 uppercase tracking-widest">{day}</div>
              ))}
              {/* This is a simplified grid, ideally we should pad leading/trailing days */}
              {days.map((day, i) => {
                const dayEvents = getEventsForDay(day);
                return (
                  <div key={i} className="bg-white min-h-[120px] p-2 hover:bg-gray-50 transition-colors">
                    <span className={`text-sm font-semibold ${isSameDay(day, new Date()) ? 'w-8 h-8 bg-primary text-white flex items-center justify-center rounded-full' : 'text-gray-400'}`}>
                      {format(day, 'd')}
                    </span>
                    <div className="mt-2 space-y-1">
                      {dayEvents.map((event, j) => (
                        <div key={j} className={`text-[10px] p-1.5 rounded-md font-bold truncate ${event.type === 'Exam' ? 'bg-red-50 text-red-600 border border-red-100' :
                            event.type === 'Deadline' ? 'bg-orange-50 text-orange-600 border border-orange-100' :
                              'bg-blue-50 text-blue-600 border border-blue-100'
                          }`}>
                          {event.title}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Upcoming List */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-text">Timeline</h3>
          <div className="space-y-4">
            {events.slice(0, 5).map((event, i) => (
              <div key={i} className="relative pl-6 pb-6 border-l-2 border-border last:pb-0">
                <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white ${event.type === 'Exam' ? 'bg-red-500' : event.type === 'Deadline' ? 'bg-orange-500' : 'bg-primary'
                  }`}></div>
                <div className="card p-4 hover:shadow-md transition-shadow">
                  <p className="text-[10px] font-bold text-primary uppercase mb-1">{format(new Date(event.startDate), 'EEEE, MMM dd')}</p>
                  <h4 className="font-bold text-text text-sm">{event.title}</h4>
                  <div className="flex items-center text-xs text-gray-500 mt-2 space-x-3">
                    <span className="flex items-center"><Clock size={12} className="mr-1" /> {format(new Date(event.startDate), 'hh:mm a')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
