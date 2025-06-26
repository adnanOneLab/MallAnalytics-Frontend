import React, { useState } from 'react';
import { X, Mail, Clock, Hash, User, Shield, Send } from 'lucide-react';

// Move InputField outside to avoid re-creation on each render
const InputField = ({ icon: Icon, label, children }) => (
  <div className="group">
    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2 group-hover:text-black transition-colors">
      {Icon && <Icon size={16} className="text-gray-500 group-hover:text-black transition-colors" />}
      {label}
    </label>
    <div className="relative transition-all duration-200">
      {children}
    </div>
  </div>
);

const baseInputClasses = `w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 \
  placeholder-gray-400 transition-all duration-200 \
  focus:border-black focus:ring-4 focus:ring-gray-200 focus:outline-none\
  hover:border-gray-300 bg-gray-50 focus:bg-white`;

const StepModal = ({ 
  open, 
  onClose, 
  onSubmit, 
  form, 
  onChange, 
  editing, 
  senders = [], 
  selectedSender, 
  onSenderChange, 
  suppressionGroups = [], 
  selectedSuppressionGroup, 
  onSuppressionGroupChange 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  if (!open) return null;

  const handleSubmit = async (e) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onSubmit(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-gray-100 animate-in slide-in-from-bottom-4 duration-300 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-black to-gray-800 rounded-t-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Send size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold">{editing ? 'Edit Campaign Step' : 'Create New Step'}</h2>
                <p className="text-blue-100 text-sm">Configure your email campaign step</p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <InputField icon={Mail} label="Email Subject">
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={onChange}
                  className={baseInputClasses}
                  placeholder="Enter your email subject..."
                  required
                />
              </InputField>

              <InputField icon={Hash} label="Step Order">
                <input
                  type="number"
                  name="step_order"
                  value={form.step_order}
                  onChange={onChange}
                  className={baseInputClasses}
                  min={1}
                  placeholder="1"
                  required
                />
              </InputField>
            </div>

            <InputField icon={Mail} label="Email Body">
              <textarea
                name="body"
                value={form.body}
                onChange={onChange}
                className={`${baseInputClasses} min-h-[120px] resize-y`}
                placeholder="Write your email content here..."
                required
              />
            </InputField>

            <InputField icon={Clock} label="Send Date & Time">
              <input
                type="datetime-local"
                name="send_at"
                value={form.send_at}
                onChange={onChange}
                className={baseInputClasses}
                required
                min={(() => {
                  const now = new Date();
                  const pad = n => n.toString().padStart(2, '0');
                  return `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
                })()}
              />
            </InputField>

            <div className="grid md:grid-cols-2 gap-6">
              <InputField icon={User} label="Email Sender">
                <select
                  className={baseInputClasses}
                  value={selectedSender || ''}
                  onChange={onSenderChange}
                  required
                  name="sender"
                >
                  <option value="">Choose sender...</option>
                  {senders.map(sender => (
                    <option key={sender.id} value={sender.id}>
                      {sender.nickname || sender.from?.email || sender.email}
                    </option>
                  ))}
                </select>
              </InputField>

              <InputField icon={Shield} label="Unsubscribe Group">
                <select
                  className={baseInputClasses}
                  value={selectedSuppressionGroup || ''}
                  onChange={onSuppressionGroupChange}
                  name="suppression"
                >
                  <option value="">No unsubscribe group</option>
                  {suppressionGroups.map(group => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </select>
              </InputField>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-6 py-3 text-gray-600 font-medium rounded-xl border-2 border-gray-200 \
                         hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 \
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-gradient-to-r from-black to-gray-800 text-white font-semibold \
                         rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 \
                         disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                         flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    {editing ? 'Update Step' : 'Create Step'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StepModal;