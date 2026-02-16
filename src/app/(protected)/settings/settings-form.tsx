"use client";

import { useState, useTransition } from "react";
import { saveSettings, saveGeminiKey, resetAllData } from "@/lib/actions/data";
import { GlassCard } from "@/components/glass-card";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings,
  Key,
  AlertTriangle,
  Save,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";
import type { Settings as SettingsType } from "@/lib/types";

export function SettingsForm({
  settings,
}: {
  settings: SettingsType | null;
}) {
  const [isPending, startTransition] = useTransition();
  const [showKey, setShowKey] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  function handleSaveProfile(formData: FormData) {
    startTransition(async () => {
      const result = await saveSettings(formData);
      if (result?.error) toast.error(result.error);
      else toast.success("Settings saved! Savings plan generated.");
    });
  }

  function handleSaveKey(formData: FormData) {
    startTransition(async () => {
      const result = await saveGeminiKey(formData);
      if (result?.error) toast.error(result.error);
      else toast.success("API key saved!");
    });
  }

  function handleReset() {
    startTransition(async () => {
      const result = await resetAllData();
      if (result?.error) toast.error(result.error);
      else {
        toast.success("All data has been reset.");
        setShowConfirm(false);
      }
    });
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Profile Settings */}
      <GlassCard>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Savings Profile</h3>
            <p className="text-white/50 text-xs">
              Configure your income and savings goals
            </p>
          </div>
        </div>
        <form action={handleSaveProfile} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">
              Monthly Income (Rs.)
            </label>
            <input
              name="income"
              type="number"
              min="0"
              required
              defaultValue={settings?.income || ""}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition"
              placeholder="e.g. 100000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">
              Total Saving Target (Rs.)
            </label>
            <input
              name="target"
              type="number"
              min="0"
              required
              defaultValue={settings?.target || ""}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition"
              placeholder="e.g. 50000"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">
                Duration (days)
              </label>
              <input
                name="duration"
                type="number"
                min="1"
                max="365"
                required
                defaultValue={settings?.duration || 30}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">
                Start Date
              </label>
              <input
                name="start_date"
                type="date"
                required
                defaultValue={
                  settings?.start_date ||
                  new Date().toISOString().split("T")[0]
                }
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold hover:from-emerald-600 hover:to-cyan-600 transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isPending ? "Saving..." : "Save & Generate Plan"}
          </button>
        </form>
      </GlassCard>

      {/* AI Settings */}
      <GlassCard>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
            <Key className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold">AI Settings</h3>
            <p className="text-white/50 text-xs">
              Configure your Gemini API key for AI features
            </p>
          </div>
        </div>
        <form action={handleSaveKey} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">
              Gemini API Key
            </label>
            <div className="relative">
              <input
                name="gemini_api_key"
                type={showKey ? "text" : "password"}
                defaultValue={settings?.gemini_api_key || ""}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition pr-12"
                placeholder="AIza..."
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
              >
                {showKey ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            <p className="text-white/30 text-xs mt-2">
              Get your key from{" "}
              <a
                href="https://aistudio.google.com/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 hover:text-purple-300"
              >
                Google AI Studio
              </a>
            </p>
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:from-purple-600 hover:to-pink-600 transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isPending ? "Saving..." : "Save API Key"}
          </button>
        </form>
      </GlassCard>

      {/* Danger Zone */}
      <GlassCard className="border-red-500/20">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Danger Zone</h3>
            <p className="text-white/50 text-xs">Irreversible actions</p>
          </div>
        </div>

        <AnimatePresence>
          {showConfirm ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3"
            >
              <p className="text-red-300 text-sm">
                This will permanently delete all your savings plans,
                transactions, and settings. Are you sure?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleReset}
                  disabled={isPending}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition font-medium disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  {isPending ? "Deleting..." : "Yes, Delete Everything"}
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/10 text-white/70 hover:bg-white/20 transition font-medium"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          ) : (
            <button
              onClick={() => setShowConfirm(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition font-medium"
            >
              <Trash2 className="w-4 h-4" />
              Reset All Data
            </button>
          )}
        </AnimatePresence>
      </GlassCard>
    </div>
  );
}
