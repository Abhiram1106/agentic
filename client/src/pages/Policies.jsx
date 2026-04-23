import React, { useState, useEffect } from 'react';
import { Search, ShieldCheck, ChevronRight, BookOpen, Info, AlertCircle } from 'lucide-react';
import API from '../services/api';

const Policies = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPolicy, setSelectedPolicy] = useState(null);

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const res = await API.get('/student/policies');
        setPolicies(res.data);
      } catch (err) {
        console.error('Error fetching policies', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPolicies();
  }, []);

  const filteredPolicies = policies.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-text">Policy Center</h1>
        <p className="text-gray-500 mt-1">Official academic rules, regulations, and guidelines.</p>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="What policy are you looking for? (e.g., Attendance, Grading...)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-6 py-4 bg-white border border-border rounded-2xl shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading ? (
          [1, 2].map(i => <div key={i} className="card h-40 animate-pulse bg-gray-50"></div>)
        ) : filteredPolicies.length > 0 ? filteredPolicies.map((policy) => (
          <div 
            key={policy._id} 
            onClick={() => setSelectedPolicy(policy)}
            className="card p-6 cursor-pointer hover:border-primary/50 hover:shadow-md transition-all group"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-primary/5 text-primary rounded-xl group-hover:bg-primary group-hover:text-white transition-colors">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-text">{policy.title}</h3>
                  <p className="text-sm font-medium text-gray-500 mt-1">{policy.category}</p>
                </div>
              </div>
              <ChevronRight className="text-gray-300 group-hover:text-primary mt-2" />
            </div>
            <p className="mt-4 text-gray-600 text-sm leading-relaxed">{policy.summary}</p>
          </div>
        )) : (
          <div className="col-span-full py-12 text-center text-gray-500">
            <Info className="mx-auto mb-2 text-gray-300" size={32} />
            <p>No results found for "{searchTerm}"</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedPolicy && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-8 border-b border-border flex justify-between items-center">
              <div>
                <span className="text-xs font-bold text-primary uppercase tracking-widest">{selectedPolicy.category}</span>
                <h2 className="text-2xl font-bold text-text mt-1">{selectedPolicy.title}</h2>
              </div>
              <button 
                onClick={() => setSelectedPolicy(null)}
                className="p-2 hover:bg-gray-100 rounded-lg text-gray-400"
              >
                <ChevronRight className="rotate-90 md:rotate-0" />
              </button>
            </div>
            <div className="p-8 overflow-y-auto leading-relaxed text-gray-700 space-y-4">
              {selectedPolicy.content.split('\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
              <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start space-x-3 text-blue-700 text-sm">
                <AlertCircle className="shrink-0 mt-0.5" size={18} />
                <p><strong>Note:</strong> Policies are subject to change. Always consult your department head for the latest updates.</p>
              </div>
            </div>
            <div className="p-6 bg-gray-50 border-t border-border text-right">
              <button 
                onClick={() => setSelectedPolicy(null)}
                className="btn-primary"
              >
                Close Policy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Policies;
