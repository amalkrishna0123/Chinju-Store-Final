import React, { useState } from "react";
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { Mail, Lock, Eye, EyeOff, User, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../Firebase';
import { IoIosArrowBack } from "react-icons/io";

const Login = () => {
  const { signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginType, setLoginType] = useState('admin'); // 'admin' or 'delivery'

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (email === 'admin@gmail.com' && password === '123456') {
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

  const handleDeliveryLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!name || !phone) {
        setError('Please enter name and phone number');
        return;
      }

      const deliveryBoysRef = collection(db, 'deliveryBoys');
      const querySnapshot = await getDocs(deliveryBoysRef);
      const deliveryBoy = querySnapshot.docs.find(
        (doc) => doc.data().name === name && doc.data().phone === phone
      );

      if (deliveryBoy && deliveryBoy.data().status === 'active') {
        localStorage.setItem('isDelivery', 'true');
        localStorage.setItem('deliveryName', name);
        localStorage.setItem('deliveryPhone', phone);
        localStorage.setItem('deliveryBoyId', deliveryBoy.id);
        navigate('/delivery-dashboard', { replace: true });
      } else if (deliveryBoy && deliveryBoy.data().status !== 'active') {
        setError('Your account is currently inactive. Please contact admin.');
      } else {
        setError('Invalid credentials. Please check your name and phone number.');
      }
    } catch (error) {
      setError('Failed to login. Please try again.');
      console.error('Login error:', error);
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
        
        <div className="flex justify-center space-x-4 mb-6">
          <button
            onClick={() => setLoginType('admin')}
            className={`px-4 py-2 rounded-lg ${loginType === 'admin' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Admin Login
          </button>
          <button
            onClick={() => setLoginType('delivery')}
            className={`px-4 py-2 rounded-lg ${loginType === 'delivery' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Delivery Login
          </button>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            {loginType === 'admin' ? 'Admin Login' : 'Delivery Login'}
          </h2>
          <p className="mt-2 text-gray-600">
            {loginType === 'admin' ? 'Sign in to access admin dashboard' : 'Sign in to manage deliveries'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {loginType === 'admin' ? (
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
        ) : (
          <form onSubmit={handleDeliveryLogin} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Your Name"
                />
              </div>

              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Phone Number"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
            >
              {loading ? 'Signing in...' : 'Sign in as Delivery'}
            </button>
          </form>
        )}

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