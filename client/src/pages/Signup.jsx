import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { User, Mail, Lock, Loader2, ArrowLeft, School, Hash, Bookmark } from 'lucide-react';
import API from '../services/api';
import useAuthStore from '../store/useAuthStore';

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const setAuth = useAuthStore(state => state.setAuth);
  
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      const response = await API.post('/auth/signup', data);
      setAuth(response.data, response.data.token);
      navigate('/dashboard');
    } catch (err) {
      console.error('Signup Error:', err);
      const message = err.response?.data?.message || err.message || 'Signup failed. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const departments = ['Computer Science', 'Information Technology', 'Electronics', 'Mechanical', 'Civil', 'Electrical'];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 py-12">
      <Link to="/" className="fixed top-8 left-8 flex items-center text-gray-500 hover:text-primary transition-colors">
        <ArrowLeft size={20} className="mr-2" />
        Back to Home
      </Link>

      <div className="card max-w-2xl w-full p-10 bg-white">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-text">Create Account</h2>
          <p className="text-gray-500 mt-2">Join the smart academic community</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
             <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
             <div className="relative">
               <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
               <input
                 {...register('fullName', { required: 'Full name is required' })}
                 type="text"
                 placeholder="John Doe"
                 className={`input-field pl-10 ${errors.fullName ? 'border-red-500' : ''}`}
               />
             </div>
             {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                {...register('email', { required: 'Email is required' })}
                type="email"
                placeholder="student@college.edu"
                className={`input-field pl-10 ${errors.email ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })}
                type="password"
                placeholder="••••••••"
                className={`input-field pl-10 ${errors.password ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Roll Number</label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                {...register('rollNumber', { required: 'Required' })}
                type="text"
                placeholder="CSE2101"
                className={`input-field pl-10 ${errors.rollNumber ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.rollNumber && <p className="text-xs text-red-500 mt-1">{errors.rollNumber.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Department</label>
            <div className="relative">
              <School className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <select
                {...register('department', { required: 'Required' })}
                className="input-field pl-10 appearance-none bg-white"
              >
                <option value="">Select Dept</option>
                {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Year</label>
            <select {...register('year', { required: true })} className="input-field">
              {[1, 2, 3, 4].map(y => <option key={y} value={y}>Year {y}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Semester</label>
            <select {...register('semester', { required: true })} className="input-field">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>Sem {s}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Section</label>
            <select {...register('section', { required: true })} className="input-field">
              {['A', 'B', 'C', 'D'].map(sec => <option key={sec} value={sec}>Section {sec}</option>)}
            </select>
          </div>

          <div className="md:col-span-2">
            <button
              disabled={loading}
              className="btn-primary w-full py-3.5 mt-4 flex items-center justify-center text-lg font-bold"
            >
              {loading ? <Loader2 className="animate-spin mr-2" /> : 'Create Account'}
            </button>
          </div>
        </form>

        <p className="text-center mt-8 text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-bold hover:underline">Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
