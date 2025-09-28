import { useState } from 'react';
import { X, Mail, MessageCircle, Sparkles } from 'lucide-react';

const CredentialsModal = ({ isOpen, onClose, selectedTrigger, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    api_key: '',
    resendDomainMail: '',
    botToken: '',
    chatId: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const platformConfigs = {
    'Resend Email': {
      icon: <Mail className="w-5 h-5" />,
      platform: 'ResendEmail',
      fields: [
        { name: 'title', label: 'Title', type: 'text', required: true, placeholder: 'My Resend Config' },
        { name: 'api_key', label: 'API Key', type: 'password', required: true, placeholder: 'Enter your Resend API key' },
        { name: 'resendDomainMail', label: 'Domain Email (Optional)', type: 'email', required: false, placeholder: 'noreply@yourdomain.com' }
      ]
    },
    'Telegram': {
      icon: <MessageCircle className="w-5 h-5" />,
      platform: 'Telegram',
      fields: [
        { name: 'title', label: 'Title', type: 'text', required: true, placeholder: 'My Telegram Bot' },
        { name: 'botToken', label: 'Bot Token', type: 'password', required: true, placeholder: 'Enter your Telegram bot token' },
        { name: 'chatId', label: 'Chat ID', type: 'text', required: true, placeholder: 'Enter chat ID' }
      ]
    },
    'Gemini': {
      icon: <Sparkles className="w-5 h-5" />,
      platform: 'Gemini',
      fields: [
        { name: 'title', label: 'Title', type: 'text', required: true, placeholder: 'My Gemini Config' },
        { name: 'api_key', label: 'API Key', type: 'password', required: true, placeholder: 'Enter your Gemini API key' }
      ]
    }
  };

  const currentConfig = platformConfigs[selectedTrigger];

  const validateForm = () => {
    const newErrors = {};
    
    if (!currentConfig) return false;

    currentConfig.fields.forEach(field => {
      const value = formData[field.name];
      
      if (field.required && (!value || value.trim() === '')) {
        newErrors[field.name] = `${field.label} is required`;
      }
      
      if (field.name === 'resendDomainMail' && value && !emailRegex.test(value)) {
        newErrors[field.name] = 'Invalid email address';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      // Prepare data according to schema
      const credentialData = {
        title: formData.title,
        platform: currentConfig.platform,
        data: {}
      };

      // Map form data to schema structure
      currentConfig.fields.forEach(field => {
        if (field.name !== 'title' && formData[field.name]) {
          credentialData.data[field.name] = formData[field.name];
        }
      });

      // Call the onSave callback
      await onSave(credentialData);
      
      // Reset form and close modal
      setFormData({
        title: '',
        api_key: '',
        resendDomainMail: '',
        botToken: '',
        chatId: ''
      });
      onClose();
    } catch (error) {
      console.error('Error saving credentials:', error);
      // You can add error handling here
    } finally {
      setLoading(false);
    }
  };

  const resetAndClose = () => {
    setFormData({
      title: '',
      api_key: '',
      resendDomainMail: '',
      botToken: '',
      chatId: ''
    });
    setErrors({});
    onClose();
  };

  if (!currentConfig) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-96">
          <p>Unsupported trigger type: {selectedTrigger}</p>
          <button onClick={onClose} className="mt-4 px-4 py-2 bg-gray-500 text-white rounded">
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            {currentConfig.icon}
            <h2 className="text-xl font-semibold text-gray-900">
              Setup {selectedTrigger}
            </h2>
          </div>
          <button
            onClick={resetAndClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4 max-h-[calc(90vh-140px)] overflow-y-auto">
          <p className="text-gray-600 text-sm mb-4">
            Please provide your {selectedTrigger} credentials to continue with the workflow setup.
          </p>

          {currentConfig.fields.map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              <input
                type={field.type}
                value={formData[field.name]}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                placeholder={field.placeholder}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors[field.name] ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors[field.name] && (
                <p className="text-red-500 text-xs mt-1">{errors[field.name]}</p>
              )}
            </div>
          ))}

          {/* Helper text for different platforms */}
          <div className="bg-blue-50 p-3 rounded-md">
            <p className="text-sm text-blue-800">
              {selectedTrigger === 'Resend Email' && (
                <>Need help? Get your API key from your <a href="https://resend.com/api-keys" target="_blank" rel="noopener noreferrer" className="underline">Resend dashboard</a></>
              )}
              {selectedTrigger === 'Telegram' && (
                <>Create a bot with <a href="https://t.me/botfather" target="_blank" rel="noopener noreferrer" className="underline">@BotFather</a> to get your bot token and chat ID</>
              )}
              {selectedTrigger === 'Gemini' && (
                <>Get your API key from <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline">Google AI Studio</a></>
              )}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            type="button"
            onClick={resetAndClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`px-6 py-2 rounded-md text-white font-medium transition-colors ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Saving...' : 'Save Credentials'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Demo component to show how to use the modal
export default function CredentialsDemo() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTrigger, setSelectedTrigger] = useState('');
  const [savedCredentials, setSavedCredentials] = useState([]);

  const triggers = ['Resend Email', 'Telegram', 'Gemini'];

  const handleTriggerClick = (trigger) => {
    setSelectedTrigger(trigger);
    setModalOpen(true);
  };

  const handleSaveCredentials = async (credentialData) => {
    // Here you would normally make an API call to save credentials
    console.log('Saving credentials:', credentialData);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Add to saved credentials for demo
    setSavedCredentials(prev => [...prev, credentialData]);
    
    alert('✅ Credentials saved successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Workflow Triggers</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Available Triggers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {triggers.map((trigger) => (
              <button
                key={trigger}
                onClick={() => handleTriggerClick(trigger)}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  {trigger === 'Resend Email' && <Mail className="w-6 h-6 text-blue-500" />}
                  {trigger === 'Telegram' && <MessageCircle className="w-6 h-6 text-blue-500" />}
                  {trigger === 'Gemini' && <Sparkles className="w-6 h-6 text-blue-500" />}
                  <span className="font-medium">{trigger}</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Click to setup credentials
                </p>
              </button>
            ))}
          </div>
        </div>

        {savedCredentials.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Saved Credentials</h2>
            <div className="space-y-2">
              {savedCredentials.map((cred, index) => (
                <div key={index} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="font-medium text-green-800">{cred.title}</div>
                  <div className="text-sm text-green-600">Platform: {cred.platform}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <CredentialsModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          selectedTrigger={selectedTrigger}
          onSave={handleSaveCredentials}
        />
      </div>
    </div>
  );
}