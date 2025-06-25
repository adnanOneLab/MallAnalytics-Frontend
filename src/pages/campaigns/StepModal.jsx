import React from 'react';

const StepModal = ({ open, onClose, onSubmit, form, onChange, editing, senders = [], selectedSender, onSenderChange }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">{editing ? 'Edit Step' : 'Add Step'}</h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Subject</label>
            <input type="text" name="subject" value={form.subject} onChange={onChange} className="w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium">Body</label>
            <textarea name="body" value={form.body} onChange={onChange} className="w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium">Send At</label>
            <input type="datetime-local" name="send_at" value={form.send_at} onChange={onChange} className="w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium">Step Order</label>
            <input type="number" name="step_order" value={form.step_order} onChange={onChange} className="w-full border rounded px-3 py-2" min={1} required />
          </div>
          <div>
            <label className="block text-sm font-medium">Sender</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={selectedSender || ''}
              onChange={onSenderChange}
              required
            >
              <option value="">Select a sender</option>
              {senders.map(sender => (
                <option key={sender.id} value={sender.id}>
                  {sender.nickname || sender.from?.email || sender.email}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end space-x-2">
            <button type="button" className="px-4 py-2 bg-gray-200 rounded" onClick={onClose}>Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StepModal; 