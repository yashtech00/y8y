import { useState } from 'react';
import { X, Mail, MessageCircle, Sparkles } from 'lucide-react';

interface CredentialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTrigger: string;
  onSave: (credentialData: any) => Promise<void>;
}

const CredentialsModal = ({ isOpen, onClose, selectedTrigger, onSave }: CredentialsModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    api_key: '',
    resendDomainMail: '',
    botToken: '',
    chatId: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
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

  const currentConfig = platformConfigs[selectedTrigger as keyof typeof platformConfigs];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!currentConfig) return false;

    currentConfig.fields.forEach((field: any) => {
      const value = formData[field.name as keyof typeof formData];
      
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

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      // Prepare data according to schema
      const credentialData = {
        title: formData.title,
        platform: currentConfig.platform,
        data: {} as Record<string, string>
      };

      // Map form data to schema structure
      currentConfig.fields.forEach((field: any) => {
        if (field.name !== 'title' && formData[field.name as keyof typeof formData]) {
          credentialData.data[field.name] = formData[field.name as keyof typeof formData];
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
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4 max-h-[calc(90vh-140px)] overflow-y-auto">
          <p className="text-gray-600 text-sm mb-4">
            Please provide your {selectedTrigger} credentials to continue with the workflow setup.
          </p>

          {currentConfig.fields.map((field: any) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              <input
                type={field.type}
                value={formData[field.name as keyof typeof formData]}
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

export default CredentialsModal;