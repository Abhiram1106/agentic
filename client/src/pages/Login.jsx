import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, Lock, Loader2, ArrowLeft } from 'lucide-react';
import API from '../services/api';
import useAuthStore from '../store/useAuthStore';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const setAuth = useAuthStore(state => state.setAuth);
  
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      const response = await API.post('/auth/login', data);
      setAuth(response.data, response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Link to="/" className="fixed top-8 left-8 flex items-center text-gray-500 hover:text-primary transition-colors">
        <ArrowLeft size={20} className="mr-2" />
        Back to Home
      </Link>

      <div className="card max-w-md w-full p-10 bg-white">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary/20">
            <span className="text-white font-bold text-3xl">S</span>
          </div>
          <h2 className="text-3xl font-bold text-text">Welcome Back</h2>
          <p className="text-gray-500 mt-2">Log in to your academic assistant</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
            <div className="flex justify-between mb-1.5">
              <label className="text-sm font-semibold text-gray-700">Password</label>
              <a href="#" className="text-xs font-semibold text-primary hover:underline">Forgot?</a>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                {...register('password', { required: 'Password is required' })}
                type="password"
                placeholder="••••••••"
                className={`input-field pl-10 ${errors.password ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
          </div>

          <button
            disabled={loading}
            className="btn-primary w-full py-3.5 mt-4 flex items-center justify-center text-lg font-bold"
          >
            {loading ? <Loader2 className="animate-spin mr-2" /> : 'Log In'}
          </button>
        </form>

        <p className="text-center mt-8 text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="text-primary font-bold hover:underline">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
