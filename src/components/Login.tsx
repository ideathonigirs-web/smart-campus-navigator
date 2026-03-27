import React, { useState } from 'react';
import { User } from '../types';
import { GraduationCap, Lock, Mail, Loader2, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion'; 
// Firebase SDK imports
import { auth, db } from '../firebase'; 
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

interface LoginProps {
  onLogin: (user: User) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Firebase Authentication moolama login panrom
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const fbUser = userCredential.user;

      // 2. Login aana udane Firestore-la irundhu user details edukkurom
      // FIX: Neenga Firestore-la email-aiye document ID-aa kuduthurukkeenga
      const userDocRef = doc(db, "users", email.toLowerCase().trim());
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        
        // Success: Parent component-ku data anupuroam
        // types.ts-la 'id' string-aa iruppadhala inge error varaadhu
        onLogin({
          id: fbUser.uid, // Firebase UID is a string
          name: userData.name || fbUser.email?.split('@')[0],
          email: fbUser.email!,
          role: userData.role || 'student', 
          department_id: userData.department_id || '1', // String-aa anupuvom
          department_name: userData.department_name || 'General'
        } as User); // Proper casting
      } else {
        setError("User record not found in Firestore database.");
      }
    } catch (err: any) {
      console.error("Login Error:", err.code);
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Invalid credentials. Check your email and password.');
      } else if (err.code === 'auth/user-not-found') {
        setError('No account found with this email.');
      } else {
        setError('Login failed. Please check your internet connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVisitorLogin = () => {
    onLogin({
      id: '999', // Quotation ulla kudukka vendum (string)
      name: 'Guest Visitor',
      email: 'visitor@campus.edu',
      role: 'visitor',
      department_id: '1',
      department_name: 'General'
    } as User);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-200">
              <GraduationCap className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 text-center">Smart Campus<br/><span className="text-indigo-600">Navigator</span></h1>
          </div>
          <p className="text-slate-500 text-sm mt-1">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                placeholder="name@college.edu"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm text-center font-medium bg-red-50 py-2 rounded-lg"
            >
              {error}
            </motion.p>
          )}

          <div className="space-y-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
            </button>

            <button
              type="button"
              onClick={handleVisitorLogin}
              className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              Visitor
            </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Demo Credentials</p>
          <div className="mt-3 grid grid-cols-3 gap-2 text-[10px]">
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
              <p className="text-indigo-600 font-bold">Faculty</p>
              <p className="text-slate-500">faculty@college.edu</p>
            </div>
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
              <p className="text-indigo-600 font-bold">Student</p>
              <p className="text-slate-500">student@college.edu</p>
            </div>
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
              <p className="text-indigo-600 font-bold">Admin</p>
              <p className="text-slate-500">admin@college.edu</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}