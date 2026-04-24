import React, { useState, useEffect } from 'react';
import { Clock, MapPin, CalendarDays, FileText } from 'lucide-react';
import API from '../services/api';
import { format } from 'date-fns';

const Exams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await API.get('/student/exams');
        setExams(res.data);
      } catch (err) {
        console.error('Error fetching exams', err);
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (exams.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-4">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <FileText size={32} className="text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-700">No Upcoming Exams</h2>
        <p className="text-gray-500 max-w-md">
          You don't have any examinations scheduled at the moment. Enjoy the breather!
        </p>
      </div>
    );
  }

  // Sort exams by date ascending
  const sortedExams = [...exams].sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-text mb-2">Examination Timetable</h1>
        <p className="text-gray-500">
          Your official schedule for upcoming midterms and final examinations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {sortedExams.map((exam) => {
          const examDate = new Date(exam.date);
          const isPast = examDate < new Date(new Date().setHours(0, 0, 0, 0));

          return (
            <div key={exam._id} className={`card p-6 flex flex-col shadow-sm border ${isPast ? 'bg-gray-50 border-gray-200' : 'bg-white border-border hover:border-primary/30'} transition-all`}>
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${isPast ? 'bg-gray-200 text-gray-500' : 'bg-red-50 text-red-500'}`}>
                  <FileText size={24} />
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">{format(examDate, 'MMM')}</p>
                  <p className={`text-3xl font-black ${isPast ? 'text-gray-400' : 'text-text'}`}>{format(examDate, 'dd')}</p>
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <h3 className={`text-xl font-bold ${isPast ? 'text-gray-500 line-through' : 'text-text'}`}>{exam.subject}</h3>
                  <p className="text-sm font-semibold text-gray-500 mt-1">{exam.title}</p>
                </div>

                <div className="space-y-2 pt-4 border-t border-gray-100">
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock size={16} className={`mr-3 ${isPast ? 'text-gray-400' : 'text-primary'}`} />
                    <span className="font-medium">{exam.time}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin size={16} className={`mr-3 ${isPast ? 'text-gray-400' : 'text-primary'}`} />
                    <span>{exam.location}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CalendarDays size={16} className={`mr-3 ${isPast ? 'text-gray-400' : 'text-primary'}`} />
                    <span>{format(examDate, 'EEEE, MMMM do yyyy')}</span>
                  </div>
                </div>
              </div>

              {isPast && (
                <div className="mt-4 pt-4 border-t border-gray-200 text-center">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Completed</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Exams;
