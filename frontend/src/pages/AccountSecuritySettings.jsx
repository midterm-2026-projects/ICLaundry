import { useState } from 'react';
import { Eye, EyeOff, Shield, Lock } from "lucide-react";

export default function Settings() {
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [show, setShow] = useState({ current: false, new: false, confirm: false });
  const [message, setMessage] = useState("");

  // 👇 ITO ANG FUNCTION NA TATAWAGIN KAPAG PININDOT ANG BUTTON
  const handleSubmit = (e) => {
    e.preventDefault(); // Pigilan ang pag-refresh ng pahina
    setMessage(""); // Burahin muna ang lumang mensahe

    // 🔴 UNANG CHECK: Lahat ba ay may laman?
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      return setMessage("All fields are required");
    }

    // 🔴 PANGALAWANG CHECK: Sapat ba ang haba ng password?
    if (passwords.new.length < 6) {
      return setMessage("New Password must be at least 6 characters");
    }

    // 🔴 PANGATLONG CHECK: Magkatulad ba ang dalawang bagong password?
    if (passwords.new !== passwords.confirm) {
      return setMessage("New Password and confirmation do not match");
    }

    // 🟢 KUNG TAMA ANG LAHAT:
    setMessage("Password updated successfully!");
    setPasswords({ current: "", new: "", confirm: "" }); // Burahin ang laman ng input
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-3 mb-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
            <Shield size={20} className="text-blue-500" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Account Security</h2>
            <p className="text-sm text-gray-500">Manage your password and security settings</p>
          </div>
        </div>

        {/* Email Input */}
        <div className="mb-6">
          <label htmlFor="email" className="block text-sm text-gray-500 mb-1">Email</label>
          <input
            id="email"
            type="email"
            readOnly
            value="admin@IClaundry.com"
            className="w-full px-3 py-2 rounded border border-gray-200 bg-gray-100 text-sm text-gray-700 outline-none"
          />
        </div>

        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">CHANGE PASSWORD</p>
        <div className="border-t border-gray-100 mb-6" />

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Current Password */}
          <div className="space-y-1.5">
            <label htmlFor="current-password" className="text-sm font-medium text-gray-700">Current Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="current-password"
                type={show.current ? "text" : "password"}
                placeholder="Enter current password"
                value={passwords.current}
                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                className="w-full rounded-lg border border-gray-200 bg-white pl-10 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShow({ ...show, current: !show.current })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {show.current ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* New & Confirm Password */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label htmlFor="new-password" className="text-sm font-medium text-gray-700">New Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="new-password"
                  type={show.new ? "text" : "password"}
                  placeholder="Min 6 characters"
                  value={passwords.new}
                  onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 bg-white pl-10 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShow({ ...show, new: !show.new })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {show.new ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="confirm-password" className="text-sm font-medium text-gray-700">Confirm New Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="confirm-password"
                  type={show.confirm ? "text" : "password"}
                  placeholder="Re-enter new password"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 bg-white pl-10 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShow({ ...show, confirm: !show.confirm })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {show.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          {/* ✅ DITO LALABAS ANG MENSAHE */}
          {message && <p className="text-sm text-red-500">{message}</p>}

          {/* ✅ ANG BUTTON NA PINIPINDOT MO */}
          <button
            type="submit"
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors"
          >
            <Lock size={16} />
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}