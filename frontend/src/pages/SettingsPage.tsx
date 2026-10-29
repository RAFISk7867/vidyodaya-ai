import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Settings,
  Key,
  User,
  Moon,
  Sun,
  Trash2,
  LogOut,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Save,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { api } from '../api';
import { GeminiStatus } from '../types';
import { Toast } from '../components/common/Toast';

export const SettingsPage: React.FC = () => {
  const { user, updateUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(user?.full_name || '');
  const [geminiStatus, setGeminiStatus] = useState<GeminiStatus | null>(null);
  const [inputApiKey, setInputApiKey] = useState('');
  const [isUpdatingKey, setIsUpdatingKey] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isDeletingData, setIsDeletingData] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchStatus = async () => {
    try {
      const res = await api.getGeminiStatus();
      setGeminiStatus(res);
    } catch {
      // Ignored
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;
    setIsUpdatingProfile(true);
    setError(null);
    setSuccess(null);

    try {
      const updated = await api.updateProfile({ full_name: fullName.trim() });
      updateUser(updated);
      setSuccess('Profile updated successfully.');
    } catch (err: any) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleUpdateApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputApiKey.trim()) return;
    setIsUpdatingKey(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await api.updateGeminiKey(inputApiKey.trim());
      setGeminiStatus(res);
      setInputApiKey('');
      setSuccess('Gemini API Key successfully updated! Real AI generation is operational.');
    } catch (err: any) {
      setError(err.message || 'Failed to update Gemini API key.');
    } finally {
      setIsUpdatingKey(false);
    }
  };

  const handleDeleteData = async () => {
    if (
      !confirm(
        'WARNING: This will permanently delete all your uploaded documents, study notes, question sets, and quiz attempts. This action cannot be undone. Continue?'
      )
    ) {
      return;
    }

    setIsDeletingData(true);
    setError(null);
    setSuccess(null);

    try {
      await api.deleteUserData();
      setSuccess('All study materials, documents, and quiz records deleted successfully.');
    } catch (err: any) {
      setError(err.message || 'Failed to delete data.');
    } finally {
      setIsDeletingData(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-indigo-600" />
          <span>Platform Settings</span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage your account profile, Gemini AI credentials, theme appearance, and storage data.
        </p>
      </div>

      {error && <Toast type="error" message={error} onClose={() => setError(null)} />}
      {success && <Toast type="success" message={success} onClose={() => setSuccess(null)} />}

      {/* 1. Gemini AI Configuration Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Google Gemini API Integration
              </h3>
              <p className="text-xs text-slate-500">Official google-genai SDK runtime configuration</p>
            </div>
          </div>

          <span
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
              geminiStatus?.is_configured
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
            }`}
          >
            {geminiStatus?.is_configured ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Operational</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                <span>Key Required</span>
              </>
            )}
          </span>
        </div>

        <div className="text-xs text-slate-600 dark:text-slate-400 space-y-2">
          <p>
            Current Model:{' '}
            <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
              {geminiStatus?.model || 'gemini-3.8-flash'}
            </span>
          </p>
          <p>{geminiStatus?.message}</p>
        </div>

        <form onSubmit={handleUpdateApiKey} className="pt-2 flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <input
              type="password"
              value={inputApiKey}
              onChange={(e) => setInputApiKey(e.target.value)}
              placeholder="Paste Google Gemini API Key (AIzaSy...)"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={isUpdatingKey || !inputApiKey.trim()}
            className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-all shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isUpdatingKey ? 'Updating...' : 'Set API Key'}</span>
          </button>
        </form>
        <p className="text-[11px] text-slate-400">
          Keys can also be permanently stored in your <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">backend/.env</code> file as <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">GEMINI_API_KEY</code>.
        </p>
      </div>

      {/* 2. Profile Details */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <User className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Student Profile
            </h3>
            <p className="text-xs text-slate-500">Your registered credentials</p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4 pt-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Registered Email
              </label>
              <input
                type="text"
                disabled
                value={user?.email || ''}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs font-medium cursor-not-allowed"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isUpdatingProfile}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isUpdatingProfile ? 'Saving...' : 'Save Profile'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* 3. Appearance & Theme */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
            Visual Theme
          </h3>
          <p className="text-xs text-slate-500">
            Current mode: <span className="font-semibold capitalize">{theme}</span>
          </p>
        </div>

        <button
          onClick={toggleTheme}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition-colors"
        >
          {theme === 'dark' ? (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span>Switch to Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-slate-600" />
              <span>Switch to Dark Mode</span>
            </>
          )}
        </button>
      </div>

      {/* 4. Danger Zone - Data Deletion & Logout */}
      <div className="p-6 sm:p-8 rounded-3xl bg-rose-50/40 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/60 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-rose-900 dark:text-rose-200 mb-1">
            Data Management & Account Control
          </h3>
          <p className="text-xs text-rose-700/80 dark:text-rose-300/70">
            Control your persisted learning records and secure sign-out.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handleDeleteData}
            disabled={isDeletingData}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-rose-700 dark:text-rose-300 bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-800 hover:bg-rose-50 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{isDeletingData ? 'Clearing Data...' : 'Clear All Study Records'}</span>
          </button>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

