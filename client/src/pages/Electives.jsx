import React, { useState, useEffect } from 'react';
import { Search, Filter, BookOpen, Clock, User, CheckCircle2, AlertCircle } from 'lucide-react';
import API from '../services/api';
import { format } from 'date-fns';

const Electives = () => {
  const [electives, setElectives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');

  useEffect(() => {
    const fetchElectives = async () => {
      try {
        const res = await API.get('/student/electives');
        setElectives(res.data);
      } catch (err) {
        console.error('Error fetching electives', err);
      } finally {
        setLoading(false);
      }
    };
    fetchElectives();
  }, []);

  const filteredElectives = electives.filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          e.faculty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || e.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleRegister = async (id) => {
    // Mock registration
    alert('Registration request submitted! You will be notified once approved.');
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text">Electives</h1>
          <p className="text-gray-500 mt-1">Browse and register for professional and open electives.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by name or faculty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <select 
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="input-field md:w-48 bg-white"
        >
          <option value="All">All Types</option>
          <option value="Professional">Professional</option>
          <option value="Open">Open</option>
          <option value="Science">Science</option>
          <option value="Humanities">Humanities</option>
        </select>
      </div>

      {/* Electives Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="card h-64 animate-pulse bg-gray-50"></div>
          ))
        ) : filteredElectives.length > 0 ? filteredElectives.map((e) => (
          <div key={e._id} className="card group hover:border-primary/50 transition-all">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  e.type === 'Professional' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
                }`}>
                  {e.type}
                </span>
                <span className={`flex items-center text-xs font-semibold ${
                  e.seatsAvailable < 10 ? 'text-red-500' : 'text-green-500'
                }`}>
                  {e.seatsAvailable} seats left
                </span>
              </div>
              <h3 className="text-xl font-bold text-text group-hover:text-primary transition-colors">{e.name}</h3>
              <p className="text-sm text-gray-500 mt-2 line-clamp-2">{e.description}</p>
              
              <div className="mt-6 space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <User size={16} className="mr-2 text-gray-400" />
                  <span>{e.faculty}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock size={16} className="mr-2 text-gray-400" />
                  <span>Credits: {e.credits} • Deadline: {format(new Date(e.deadline), 'MMM dd')}</span>
                </div>
              </div>
            </div>
            <div className="p-4 bg-gray-50 border-t border-border flex items-center justify-between">
              <div className="flex items-center space-x-1">
                {[1, 2, 3].map(i => (
                  <div key={i} className={`w-2 h-2 rounded-full ${
                    e.difficulty === 'Hard' ? 'bg-red-400' : e.difficulty === 'Medium' ? 'bg-yellow-400' : 'bg-green-400'
                  }`}></div>
                ))}
                <span className="text-[10px] font-bold text-gray-400 uppercase ml-1">{e.difficulty}</span>
              </div>
              <button 
                onClick={() => handleRegister(e._id)}
                className="btn-primary text-xs py-2"
              >
                Register Now
              </button>
            </div>
          </div>
        )) : (
          <div className="col-span-full py-20 text-center">
            <BookOpen className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500 font-medium">No electives found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Electives;
