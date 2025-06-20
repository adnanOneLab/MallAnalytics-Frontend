import React, { useState } from 'react';
import { Search, Plus, User, Edit3 } from 'lucide-react';

export default function EmailCampaignScreen() {
  const [subject, setSubject] = useState('Elevate Your Aviation Projects with Premium Materials');
  const [body, setBody] = useState(`Hi [[first_name]],

I hope this message finds you well! My name is [[sender_first_name]] [[sender_last_name]], and I represent [[sender_company]].

In an industry where precision and reliability are paramount, sourcing the right materials can be a challenge.

I'd love to connect and explore how we can support your upcoming projects. Would you be open to a brief chat this week?

Best,
[[sender_first_name]]`);
  const [applySignature, setApplySignature] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">Campaign</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Add contacts</span>
              </button>
              <button className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900">
                Add Steps
              </button>
            </div>
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-6">
        {/* Tabs */}
        <div className="flex space-x-6 mb-6">
          <div className="border-b-2 border-blue-600 pb-2">
            <span className="text-blue-600 font-medium">Emails</span>
          </div>
          <div className="text-gray-500 pb-2">
            <span>Contacts</span>
          </div>
          <div className="text-gray-500 pb-2">
            <span>Settings</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex space-x-3">
            <button className="bg-white border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 flex items-center space-x-2">
              <span>Dynamic Variables</span>
              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">[ ]</span>
            </button>
            <button className="bg-white border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50">
              Prebuilt Templates
            </button>
            <button className="bg-white border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 flex items-center space-x-2">
              <span>Copy</span>
              <div className="w-4 h-4 border border-gray-400 rounded"></div>
            </button>
          </div>
          <button className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900">
            Wizard Assistant
          </button>
        </div>

        {/* Email Editor */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Editor */}
          <div className="space-y-6">
            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <div className="relative">
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Edit3 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
            </div>

            {/* Body */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Body</label>
              <div className="relative">
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={12}
                  className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
                <Edit3 className="absolute right-3 top-3 text-gray-400 w-4 h-4" />
              </div>
            </div>

            {/* Email Signature Checkbox */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="emailSignature"
                checked={applySignature}
                onChange={(e) => setApplySignature(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="emailSignature" className="text-sm text-gray-700">
                Apply Email Signature
              </label>
            </div>
          </div>

          {/* Right Column - Preview */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preview based on Contact</label>
            <div className="bg-white border border-gray-300 rounded-md p-4 min-h-96">
              <div className="mb-4">
                <div className="text-sm font-medium text-gray-700 mb-2">Body</div>
                <Edit3 className="w-4 h-4 text-gray-400 float-right" />
              </div>
              <div className="text-sm text-gray-800 whitespace-pre-line">
                {body.replace(/\[\[first_name\]\]/g, '[first_name]')
                     .replace(/\[\[sender_first_name\]\]/g, '[sender_first_name]')
                     .replace(/\[\[sender_last_name\]\]/g, '[sender_last_name]')
                     .replace(/\[\[sender_company\]\]/g, '[sender_company]')}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between mt-8">
          <button className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-50">
            Back
          </button>
          <button className="bg-gray-800 text-white px-6 py-2 rounded-md hover:bg-gray-900">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}