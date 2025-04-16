import React, { useState } from "react";
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { IoIosArrowBack } from "react-icons/io";
const Login = () => {
  const { signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Here you would implement your admin authentication logic
      // For example, checking against predefined admin credentials or making an API call
      if (email === 'admin@gmail.com' && password === '123456') {
        // Successful admin login
        localStorage.setItem('isAdmin', 'true');
        navigate('/dashboard', { replace: true });
        return;
      } else {
        setError('Invalid admin credentials');
      }
    } catch (error) {
      setError('Failed to login. Please try again.');
    }

    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
      navigate('/');
    } catch (error) {
      setError('Google Sign-In Error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div><Link to="/"> <IoIosArrowBack className="hover:text-blue-500"/></Link></div>
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Admin Login</h2>
          <p className="mt-2 text-gray-600">Sign in to access admin dashboard</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleAdminLogin} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Admin Email"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
          >
            {loading ? 'Signing in...' : 'Sign in as Admin'}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:bg-gray-100 disabled:text-gray-400"
        >
          <FcGoogle size={24} />
          <span>Continue with Google</span>
        </button>
      </div>
    </div>
  );
};

export default Login;
