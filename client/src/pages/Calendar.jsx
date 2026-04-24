import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Filter, MapPin, Clock, X, AlertCircle } from 'lucide-react';
import API from '../services/api';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [selectedDayEvents, setSelectedDayEvents] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({
    start: startDate,
    end: endDate
  });

  const getEventsForDay = (day) => {
    return events.filter(event => isSameDay(new Date(event.startDate), day))
                 .filter(event => filter === 'All' || event.type === filter);
  };

  const handleDayClick = (dayEvents, day) => {
    if (dayEvents.length > 0) {
      setSelectedDayEvents({ day, events: dayEvents });
      setIsModalOpen(true);
    }
  };

  const eventTypes = ['All', 'Exam', 'Deadline', 'Holiday', 'Workshop', 'Event'];

  const getEventColor = (type) => {
    switch (type) {
      case 'Exam': return 'bg-red-500';
      case 'Deadline': return 'bg-orange-500';
      case 'Holiday': return 'bg-green-500';
      case 'Workshop': return 'bg-blue-500';
      case 'Event': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getDayHighlight = (dayEvents) => {
    if (dayEvents.length === 0) return '';
    const types = dayEvents.map(e => e.type);
    if (types.includes('Exam')) return 'bg-red-100/60 border-red-200 shadow-sm';
    if (types.includes('Deadline')) return 'bg-orange-100/60 border-orange-200 shadow-sm';
    if (types.includes('Holiday')) return 'bg-green-100/60 border-green-200 shadow-sm';
    return 'bg-blue-100/60 border-blue-200 shadow-sm';
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text">Academic Calendar</h1>
          <p className="text-gray-500 mt-1">Keep track of your exams, deadlines, and cultural events.</p>
        </div>
        <div className="flex bg-white border border-border rounded-xl p-1 shadow-sm overflow-x-auto">
          {eventTypes.map(type => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${filter === type ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <div className="card bg-white p-6 shadow-xl border-none">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-text">{format(currentMonth, 'MMMM yyyy')}</h2>
              <div className="flex space-x-2">
                <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 hover:bg-gray-100 rounded-lg transition-colors border border-border"><ChevronLeft size={20} /></button>
                <button onClick={() => setCurrentMonth(new Date())} className="px-4 py-2 text-sm font-bold text-primary hover:bg-primary/5 rounded-lg border border-primary/20">Today</button>
                <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 hover:bg-gray-100 rounded-lg transition-colors border border-border"><ChevronRight size={20} /></button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-px bg-border border border-border rounded-xl overflow-hidden shadow-inner">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="bg-gray-50 p-4 text-center text-xs font-bold text-gray-500 uppercase tracking-widest">{day}</div>
              ))}
              {days.map((day, i) => {
                const dayEvents = getEventsForDay(day);
                const isCurrentMonth = isSameMonth(day, monthStart);
                const isToday = isSameDay(day, new Date());
                const isSunday = day.getDay() === 0;
                
                return (
                  <div 
                    key={i} 
                    onClick={() => handleDayClick(dayEvents, day)}
                    className={`min-h-[120px] p-2 transition-all cursor-pointer group relative border-2
                      ${isCurrentMonth ? 'bg-white' : 'bg-gray-50/40'} 
                      ${getDayHighlight(dayEvents)}
                      ${dayEvents.length > 0 ? 'hover:shadow-xl hover:z-10 border-primary/20 scale-[1.01]' : 'border-transparent'}
                    `}
                  >
                    <div className="flex justify-between items-start">
                      <span className={`text-sm font-bold ${
                        isToday ? 'w-8 h-8 bg-primary text-white flex items-center justify-center rounded-full shadow-lg shadow-primary/30' : 
                        isCurrentMonth ? 'text-text' : 'text-gray-300'
                      }`}>
                        {format(day, 'd')}
                      </span>
                      {dayEvents.length > 0 && (
                        <div className="flex -space-x-1">
                          {Array.from(new Set(dayEvents.map(e => e.type))).slice(0, 3).map((type, idx) => (
                            <div key={idx} className={`w-2 h-2 rounded-full border border-white ${getEventColor(type)}`}></div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="mt-2 space-y-1 overflow-hidden">
                      {dayEvents.slice(0, 2).map((event, j) => (
                        <div key={j} className={`text-[10px] p-1.5 rounded-md font-bold truncate transition-transform group-hover:scale-[1.02] ${
                          event.type === 'Exam' ? 'bg-red-500 text-white' :
                          event.type === 'Deadline' ? 'bg-orange-500 text-white' :
                          event.type === 'Holiday' ? 'bg-green-600 text-white' :
                          'bg-primary text-white'
                        }`}>
                          {event.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-[9px] text-gray-400 font-bold pl-1">
                          + {dayEvents.length - 2} more
                        </div>
                      )}
                    </div>

                    {/* Tooltip on Hover */}
                    {dayEvents.length > 0 && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-gray-900 text-white p-2 rounded-lg text-xs opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-xl">
                        {dayEvents.map((e, idx) => (
                          <div key={idx} className="flex items-center space-x-1 mb-1 last:mb-0">
                            <div className={`w-1.5 h-1.5 rounded-full ${getEventColor(e.type)}`}></div>
                            <span className="truncate">{e.title}</span>
                          </div>
                        ))}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-gray-900"></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-bold text-text flex items-center">
            <Clock className="mr-2 text-primary" size={20} />
            Timeline
          </h3>
          <div className="space-y-4">
            {events.filter(e => new Date(e.startDate) >= new Date()).slice(0, 6).map((event, i) => (
              <div key={i} className="relative pl-6 pb-6 border-l-2 border-border last:pb-0 group">
                <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-4 border-white shadow-sm transition-transform group-hover:scale-125 ${
                  event.type === 'Exam' ? 'bg-red-500' : event.type === 'Deadline' ? 'bg-orange-500' : 'bg-primary'
                }`}></div>
                <div className="card p-4 hover:shadow-lg transition-all bg-white border-none cursor-pointer">
                  <p className="text-[10px] font-bold text-primary uppercase mb-1">{format(new Date(event.startDate), 'EEEE, MMM dd')}</p>
                  <h4 className="font-bold text-text text-sm group-hover:text-primary transition-colors">{event.title}</h4>
                  <div className="flex items-center text-xs text-gray-500 mt-2">
                    <AlertCircle size={12} className="mr-1" />
                    {event.type}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Event Details Modal */}
      {isModalOpen && selectedDayEvents && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-border flex justify-between items-center bg-gray-50">
              <div>
                <h3 className="text-2xl font-bold text-text">{format(selectedDayEvents.day, 'MMMM dd, yyyy')}</h3>
                <p className="text-gray-500 text-sm">{selectedDayEvents.events.length} Events Scheduled</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
              {selectedDayEvents.events.map((event, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-2xl border border-border hover:border-primary/30 transition-colors">
                  <div className={`w-2 rounded-full ${getEventColor(event.type)}`}></div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-text text-lg">{event.title}</h4>
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-white ${getEventColor(event.type)}`}>
                        {event.type}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed mb-3">{event.description}</p>
                    <div className="flex items-center text-xs text-gray-400 space-x-4">
                      <span className="flex items-center"><Clock size={14} className="mr-1" /> All Day</span>
                      <span className="flex items-center"><MapPin size={14} className="mr-1" /> Main Campus</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-6 bg-gray-50 flex justify-end">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="btn-primary px-8 py-3 rounded-xl font-bold"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
