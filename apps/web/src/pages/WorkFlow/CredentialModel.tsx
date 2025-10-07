import { useState, useEffect } from 'react';
import { X, Mail, MessageCircle, Sparkles } from 'lucide-react';

interface Credential {
  id: string;
  title: string;
  platform: string;
  data: {
    chatId?: string;
    botToken?: string;
    api_key?: string;
    resendDomainMail?: string;
  };
  userId: string;
  createdAt?: string;
}

interface CredentialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTrigger: string;
  onSave: (credentialData: any) => Promise<void>;
  credentialToEdit?: Credential | null;
}

const CredentialsModal = ({ isOpen, onClose, selectedTrigger, onSave, credentialToEdit }: CredentialsModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    api_key: '',
    resendDomainMail: '',
    botToken: '',
    chatId: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Pre-fill form when editing
  useEffect(() => {
    if (credentialToEdit && isOpen) {
      setFormData({
        title: credentialToEdit.title || '',
        api_key: credentialToEdit.data?.api_key || '',
        resendDomainMail: credentialToEdit.data?.resendDomainMail || '',
        botToken: credentialToEdit.data?.botToken || '',
        chatId: credentialToEdit.data?.chatId || ''
      });
    } else if (!isOpen) {
      // Reset form when modal closes
      setFormData({
        title: '',
        api_key: '',
        resendDomainMail: '',
        botToken: '',
        chatId: ''
      });
      setErrors({});
    }
  }, [credentialToEdit, isOpen]);

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
        <div className="bg-card border border-border rounded-lg shadow-card p-6 w-96">
          <p className="text-foreground">Unsupported trigger type: {selectedTrigger}</p>
          <button onClick={onClose} className="mt-4 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md transition-smooth">
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg shadow-card w-full max-w-md max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            {currentConfig.icon}
            <h2 className="text-xl font-semibold text-foreground">
              {credentialToEdit ? 'Edit' : 'Setup'} {selectedTrigger}
            </h2>
          </div>
          <button
            onClick={resetAndClose}
            className="p-2 hover:bg-muted rounded-full transition-smooth"
            title="Close modal"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4 max-h-[calc(90vh-140px)] overflow-y-auto">
          <p className="text-muted-foreground text-sm mb-4">
            Please provide your {selectedTrigger} credentials to continue with the workflow setup.
          </p>

          {currentConfig.fields.map((field: any) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-foreground mb-1">
                {field.label}
                {field.required && <span className="text-destructive ml-1">*</span>}
              </label>
              <input
                type={field.type}
                value={formData[field.name as keyof typeof formData]}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                placeholder={field.placeholder}
                className={`w-full px-3 py-2 border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-smooth ${
                  errors[field.name] ? 'border-destructive' : 'border-border'
                }`}
              />
              {errors[field.name] && (
                <p className="text-destructive text-xs mt-1">{errors[field.name]}</p>
              )}
            </div>
          ))}

          {/* Helper text for different platforms */}
          <div className="bg-muted/50 border border-border p-3 rounded-md">
            <p className="text-sm text-muted-foreground">
              {selectedTrigger === 'Resend Email' && (
                <>Need help? Get your API key from your <a href="https://resend.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 underline transition-smooth">Resend dashboard</a></>
              )}
              {selectedTrigger === 'Telegram' && (
                <>Create a bot with <a href="https://t.me/botfather" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 underline transition-smooth">@BotFather</a> to get your bot token and chat ID</>
              )}
              {selectedTrigger === 'Gemini' && (
                <>Get your API key from <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 underline transition-smooth">Google AI Studio</a></>
              )}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-border bg-muted/30">
          <button
            type="button"
            onClick={resetAndClose}
            className="px-4 py-2 text-muted-foreground border border-border rounded-md hover:bg-muted transition-smooth"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`px-6 py-2 rounded-md text-primary-foreground font-medium transition-smooth ${
              loading
                ? 'bg-muted cursor-not-allowed text-muted-foreground'
                : 'bg-primary hover:bg-primary/90 shadow-primary'
            }`}
          >
            {loading ? (credentialToEdit ? 'Updating...' : 'Saving...') : (credentialToEdit ? 'Update Credentials' : 'Save Credentials')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CredentialsModal;