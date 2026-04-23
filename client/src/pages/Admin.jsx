import React, { useState } from 'react';
import { Settings, Plus, Save, Trash2, BookOpen, Calendar, ShieldCheck } from 'lucide-react';
import API from '../services/api';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('electives');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const [electiveForm, setElectiveForm] = useState({
    name: '',
    faculty: '',
    credits: 3,
    totalSeats: 60,
    seatsAvailable: 60,
    description: '',
    difficulty: 'Medium',
    type: 'Professional',
    departmentEligibility: ['Computer Science'],
    deadline: format(new Date(), 'yyyy-MM-dd')
  });

  const handleElectiveSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/admin/electives', electiveForm);
      setSuccess('Elective added successfully!');
      setElectiveForm({
          name: '', faculty: '', credits: 3, totalSeats: 60, seatsAvailable: 60,
          description: '', difficulty: 'Medium', type: 'Professional',
          departmentEligibility: ['Computer Science'], deadline: format(new Date(), 'yyyy-MM-dd')
      });
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      alert('Error adding elective');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-text">Admin Control Panel</h1>
        <p className="text-gray-500 mt-1">Manage academic resources and platform settings.</p>
      </div>

      <div className="flex space-x-4 border-b border-border">
        {['electives', 'exams', 'policies', 'events'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-4 text-sm font-bold capitalize transition-all border-b-2 ${
              activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="card p-8 bg-white">
            <h3 className="text-xl font-bold mb-6 flex items-center">
              <Plus className="mr-2 text-primary" size={20} />
              Add New {activeTab.slice(0, -1)}
            </h3>

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-xl mb-6 text-sm font-semibold">
                {success}
              </div>
            )}

            <form onSubmit={handleElectiveSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Resource Name</label>
                  <input 
                    type="text" 
                    value={electiveForm.name}
                    onChange={e => setElectiveForm({...electiveForm, name: e.target.value})}
                    className="input-field" 
                    placeholder="e.g. Advanced Machine Learning" 
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Faculty / Instructor</label>
                  <input 
                    type="text" 
                    value={electiveForm.faculty}
                    onChange={e => setElectiveForm({...electiveForm, faculty: e.target.value})}
                    className="input-field" 
                    placeholder="Dr. Emily Stones" 
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Credits</label>
                  <input 
                    type="number" 
                    value={electiveForm.credits}
                    onChange={e => setElectiveForm({...electiveForm, credits: e.target.value})}
                    className="input-field" 
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                  <textarea 
                    value={electiveForm.description}
                    onChange={e => setElectiveForm({...electiveForm, description: e.target.value})}
                    className="input-field h-32 py-3" 
                    placeholder="Provide a brief overview of the course content..."
                    required
                  ></textarea>
                </div>
              </div>

              <div className="flex justify-end">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="btn-primary flex items-center px-8 py-3"
                >
                  <Save size={18} className="mr-2" />
                  {loading ? 'Saving...' : `Save ${activeTab.slice(0, -1)}`}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-6 bg-gray-50 border-dashed border-2">
            <h4 className="font-bold text-text mb-4">Quick Stats</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Total Electives</span>
                <span className="font-bold">12</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Upcoming Exams</span>
                <span className="font-bold">8</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Active Students</span>
                <span className="font-bold">2,450</span>
              </div>
            </div>
          </div>
          
          <div className="card p-6 bg-primary/5 border border-primary/20">
            <h4 className="font-bold text-primary mb-2">Developer Tools</h4>
            <p className="text-xs text-gray-500 mb-4">Quick actions to populate the database with dummy data for testing.</p>
            <button 
              onClick={async () => {
                setLoading(true);
                try {
                  await API.post('/admin/timetable', {
                    department: 'Computer Science',
                    year: 4,
                    semester: 7,
                    section: 'A',
                    schedule: [
                      { dayOfWeek: 'Monday', periods: [
                        { subject: 'Cloud Computing', startTime: '09:00 AM', endTime: '10:00 AM', room: '301', teacher: 'Dr. Alan Turing' },
                        { subject: 'Compiler Design', startTime: '10:00 AM', endTime: '11:00 AM', room: '302', teacher: 'Prof. Grace Hopper' },
                        { subject: 'Machine Learning Lab', startTime: '11:00 AM', endTime: '01:00 PM', room: 'Lab 4', teacher: 'Dr. Andrew Ng' }
                      ]},
                      { dayOfWeek: 'Tuesday', periods: [
                        { subject: 'Information Security', startTime: '09:00 AM', endTime: '10:00 AM', room: '301', teacher: 'Prof. Rivest' },
                        { subject: 'Cloud Computing', startTime: '10:00 AM', endTime: '11:00 AM', room: '301', teacher: 'Dr. Alan Turing' },
                        { subject: 'Compiler Design', startTime: '11:00 AM', endTime: '12:00 PM', room: '302', teacher: 'Prof. Grace Hopper' }
                      ]},
                      { dayOfWeek: 'Wednesday', periods: [
                        { subject: 'Machine Learning', startTime: '09:00 AM', endTime: '10:00 AM', room: 'Auditorium 1', teacher: 'Dr. Andrew Ng' },
                        { subject: 'Information Security', startTime: '10:00 AM', endTime: '11:00 AM', room: '301', teacher: 'Prof. Rivest' },
                        { subject: 'Project Phase I', startTime: '01:00 PM', endTime: '04:00 PM', room: 'Lab 1', teacher: 'Dr. John Doe' }
                      ]}
                    ]
                  });
                  setSuccess('Timetable seeded successfully!');
                  setTimeout(() => setSuccess(''), 3000);
                } catch (err) {
                  alert('Error seeding timetable');
                } finally {
                  setLoading(false);
                }
              }}
              disabled={loading}
              className="w-full py-2 bg-primary text-white rounded-lg font-bold text-sm hover:bg-primary/90 transition-colors"
            >
              Seed Dummy Timetable
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper for date formatting
function format(date, fmt) {
  const d = new Date(date);
  let month = '' + (d.getMonth() + 1);
  let day = '' + d.getDate();
  let year = d.getFullYear();
  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;
  return [year, month, day].join('-');
}

export default Admin;
