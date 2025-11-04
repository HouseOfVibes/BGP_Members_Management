import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await login(data);
      // Navigation is handled by AuthContext
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-bgp flex items-center justify-center">
        <LoadingSpinner size="large" message="Signing you in..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-bgp flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome Back
          </h1>
          <h2 className="bgp-header-2 text-bgp-gold">
            Admin Login
          </h2>
          <p className="mt-2 text-bgp-gray-medium">
            Sign in to manage BGP members
          </p>
        </div>

        {/* Login Form */}
        <div className="bgp-card-dark">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="bgp-label-dark">Username or Email</label>
              <input
                type="text"
                {...register('username', { 
                  required: 'Username or email is required' 
                })}
                className="bgp-input-dark"
                placeholder="Enter your username or email"
                autoComplete="username"
              />
              {errors.username && (
                <p className="text-red-400 text-sm mt-1">{errors.username.message}</p>
              )}
            </div>

            <div>
              <label className="bgp-label-dark">Password</label>
              <input
                type="password"
                {...register('password', { 
                  required: 'Password is required' 
                })}
                className="bgp-input-dark"
                placeholder="Enter your password"
                autoComplete="current-password"
              />
              {errors.password && (
                <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bgp-btn-primary"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </div>
          </form>

          {/* Development Info */}
          <div className="mt-6 p-4 bg-yellow-900 bg-opacity-50 rounded-lg border border-yellow-600">
            <h4 className="text-yellow-300 font-medium mb-2">Development Mode</h4>
            <p className="text-yellow-200 text-sm mb-2">
              Default admin credentials:
            </p>
            <ul className="text-yellow-200 text-sm space-y-1">
              <li><strong>Username:</strong> admin</li>
              <li><strong>Password:</strong> admin123</li>
            </ul>
            <p className="text-yellow-200 text-xs mt-2">
              Note: These credentials only work if you've set up the database and created an admin user.
            </p>
          </div>
        </div>

        {/* Footer Links */}
        <div className="text-center">
          <Link 
            to="/" 
            className="text-bgp-gray-medium hover:text-white transition-colors"
          >
            ← Back to Home
          </Link>
          
          <div className="mt-4">
            <Link 
              to="/register" 
              className="text-bgp-teal hover:text-bgp-teal-hover transition-colors"
            >
              New member? Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;