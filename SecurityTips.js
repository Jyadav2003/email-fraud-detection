// src/components/common/SecurityTips.js
import React from 'react';
import { Shield, AlertCircle, CheckCircle, Mail, Link } from 'lucide-react';

const SecurityTips = () => {
  const tips = [
    {
      id: 1,
      title: 'Check sender email addresses carefully',
      description: 'Look for misspellings or unusual domains that mimic legitimate companies.',
      icon: <Mail className="h-5 w-5 text-indigo-500" />
    },
    {
      id: 2,
      title: 'Be wary of urgent requests',
      description: 'Scammers often create a false sense of urgency to bypass your rational thinking.',
      icon: <AlertCircle className="h-5 w-5 text-yellow-500" />
    },
    {
      id: 3,
      title: 'Never share sensitive information via email',
      description: 'Legitimate organizations won't ask for passwords or personal information via email.',
      icon: <Shield className="h-5 w-5 text-red-500" />
    },
    {
      id: 4,
      title: 'Hover over links before clicking',
      description: 'Verify the actual URL destination before clicking any links in emails.',
      icon: <Link className="h-5 w-5 text-blue-500" />
    },
    {
      id: 5,
      title: 'Use multi-factor authentication',
      description: 'Enable 2FA/MFA on your accounts to add an extra layer of security.',
      icon: <CheckCircle className="h-5 w-5 text-green-500" />
    }
  ];

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center mb-4">
        <Shield className="h-6 w-6 text-indigo-600 mr-2" />
        <h3 className="text-lg font-medium text-gray-900">Email Security Tips</h3>
      </div>
      <div className="space-y-4">
        {tips.map((tip) => (
          <div key={tip.id} className="flex">
            <div className="flex-shrink-0 mt-1">
              {tip.icon}
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-gray-900">{tip.title}</h4>
              <p className="text-sm text-gray-500">{tip.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SecurityTips;