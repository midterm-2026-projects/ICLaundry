import { Eye, EyeOff, Shield, Lock } from "lucide-react";
import { useState } from "react";

export default function AccountSecurity({ email = "admin@IClaundry.com" }) {
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const validatePasswords = () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      return "All fields are required";  
    }
    if (passwords.new.length < 6) {
      return "New password must be at least 6 characters";
    }
    if (passwords.new !== passwords.confirm) {
      return "New password and confirmation do not match";
    }
    return null;
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validatePasswords();
    if (validationError) return setError(validationError);

    setSuccess("Password updated successfully!");
    setPasswords({ current: "", new: "", confirm: "" });
  };

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3 mb-5">
        <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
          <Shield size={18} className="text-blue-500" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-800">Account Security</h3>
          <p className="text-xs text-gray-400">Manage your password and security settings</p>
        </div>
      </div>

      <div className="flex justify-between items-center bg-gray-50 rounded-lg px-3 py-2.5 mb-5">
        <span className="text-xs text-gray-500">Email</span>
        <input
          type="email"
          value={email}
          readOnly
          className="text-xs font-semibold text-gray-700 bg-transparent text-right outline-none"
        />
      </div>

      <p className="text-xs font-semibold text-gray-500 tracking-wide mb-3">CHANGE PASSWORD</p>
      <div className="border-t border-gray-100 mb-4" />

      <form onSubmit={handleUpdatePassword} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="currentPassword" className="text-xs font-medium text-gray-500">Current Password</label>
          <div className="relative">
            <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              id="currentPassword"
              name="current"
              type={showCurrent ? "text" : "password"}
              placeholder="Enter current password"
              value={passwords.current}
              onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
              className="w-full rounded-lg border border-gray-200 bg-white pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="newPassword" className="text-xs font-medium text-gray-500">New Password</label>
            <div className="relative">
              <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="newPassword"
                name="new"
                type={showNew ? "text" : "password"}
                placeholder="Min 6 characters"
                value={passwords.new}
                onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                className="w-full rounded-lg border border-gray-200 bg-white pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="confirmPassword" className="text-xs font-medium text-gray-500">Confirm New Password</label>
            <div className="relative">
              <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="confirmPassword"
                name="confirm"
                type={showConfirm ? "text" : "password"}
                placeholder="Re-enter new password"
                value={passwords.confirm}
                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                className="w-full rounded-lg border border-gray-200 bg-white pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        </div>

        {error && <p className="text-xs text-red-500">{error}</p>}
        {success && <p className="text-xs text-green-500">{success}</p>}

        <button
          type="submit"
          className="flex items-center gap-1.5 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Lock size={14} />
          Update Password
        </button>
      </form>
    </div>
  );
}
