import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  Save,
  X,
  Shield,
  FileDown,
  Fingerprint,
  Cloud,
  Bell,
  Eye,
  Lock,
  Download,
  Database,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface DashboardSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

interface UserSettings {
  exportSettings: {
    defaultFormat: string;
    includeTimestamp: boolean;
    autoDownload: boolean;
    quality: number;
  };
  biometricSettings: {
    enabled: boolean;
    sensitivityLevel: 'low' | 'medium' | 'high';
    requireBiometric: boolean;
    trackPressure: boolean;
    trackVelocity: boolean;
  };
  blockchainSettings: {
    enabled: boolean;
    autoRecordEvents: boolean;
    verificationLevel: 'basic' | 'standard' | 'enhanced';
  };
  privacySettings: {
    shareAnalytics: boolean;
    retainBiometricData: boolean;
    allowGeolocation: boolean;
  };
  notificationSettings: {
    emailNotifications: boolean;
    documentStatusUpdates: boolean;
    securityAlerts: boolean;
  };
}

const defaultSettings: UserSettings = {
  exportSettings: {
    defaultFormat: 'pdf',
    includeTimestamp: true,
    autoDownload: false,
    quality: 95
  },
  biometricSettings: {
    enabled: true,
    sensitivityLevel: 'medium',
    requireBiometric: false,
    trackPressure: true,
    trackVelocity: true
  },
  blockchainSettings: {
    enabled: true,
    autoRecordEvents: true,
    verificationLevel: 'standard'
  },
  privacySettings: {
    shareAnalytics: false,
    retainBiometricData: true,
    allowGeolocation: false
  },
  notificationSettings: {
    emailNotifications: true,
    documentStatusUpdates: true,
    securityAlerts: true
  }
};

const DashboardSettings: React.FC<DashboardSettingsProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [activeTab, setActiveTab] = useState('export');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // Load settings from localStorage on mount
  useEffect(() => {
    if (user) {
      const savedSettings = localStorage.getItem(`settings_${user.id}`);
      if (savedSettings) {
        try {
          setSettings(JSON.parse(savedSettings));
        } catch (error) {
          console.error('Error loading settings:', error);
        }
      }
    }
  }, [user]);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus(null);

    try {
      // Save to localStorage (in production, you'd save to backend)
      if (user) {
        localStorage.setItem(`settings_${user.id}`, JSON.stringify(settings));
      }

      setSaveStatus({
        type: 'success',
        message: 'Settings saved successfully!'
      });

      // Auto-clear success message after 3 seconds
      setTimeout(() => {
        setSaveStatus(null);
      }, 3000);

    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveStatus({
        type: 'error',
        message: 'Failed to save settings. Please try again.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const updateSettings = (section: keyof UserSettings, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const tabs = [
    { id: 'export', name: 'Export', icon: FileDown },
    { id: 'biometric', name: 'Biometric', icon: Fingerprint },
    { id: 'blockchain', name: 'Blockchain', icon: Shield },
    { id: 'privacy', name: 'Privacy', icon: Lock },
    { id: 'notifications', name: 'Notifications', icon: Bell }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Settings className="w-6 h-6" />
              <div>
                <h2 className="text-2xl font-bold">Dashboard Settings</h2>
                <p className="text-blue-100 mt-1">Customize your signature experience</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Status Messages */}
        {saveStatus && (
          <motion.div
            className={`mx-6 mt-6 p-4 rounded-lg border ${
              saveStatus.type === 'success' 
                ? 'bg-green-50 border-green-200 text-green-800' 
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center space-x-2">
              {saveStatus.type === 'success' ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <span className="font-medium">{saveStatus.message}</span>
            </div>
          </motion.div>
        )}

        <div className="flex h-[calc(90vh-200px)]">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 border-r">
            <div className="p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-100 text-primary-700 border border-primary-200'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span className="font-medium">{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              {/* Export Settings */}
              {activeTab === 'export' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Export Preferences</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Default Export Format
                        </label>
                        <select
                          value={settings.exportSettings.defaultFormat}
                          onChange={(e) => updateSettings('exportSettings', 'defaultFormat', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          <option value="pdf">PDF Document</option>
                          <option value="png">PNG Image</option>
                          <option value="jpeg">JPEG Image</option>
                          <option value="webp">WebP Image</option>
                          <option value="json">JSON Data</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Image Quality (for JPEG/WebP)
                        </label>
                        <input
                          type="range"
                          min="50"
                          max="100"
                          value={settings.exportSettings.quality}
                          onChange={(e) => updateSettings('exportSettings', 'quality', parseInt(e.target.value))}
                          className="w-full"
                        />
                        <div className="text-center text-sm text-gray-600 mt-1">
                          {settings.exportSettings.quality}%
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={settings.exportSettings.includeTimestamp}
                            onChange={(e) => updateSettings('exportSettings', 'includeTimestamp', e.target.checked)}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">Include timestamp in filename</span>
                        </label>

                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={settings.exportSettings.autoDownload}
                            onChange={(e) => updateSettings('exportSettings', 'autoDownload', e.target.checked)}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">Auto-download after export</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Biometric Settings */}
              {activeTab === 'biometric' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Biometric Signature Settings</h3>
                    
                    <div className="space-y-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.biometricSettings.enabled}
                          onChange={(e) => updateSettings('biometricSettings', 'enabled', e.target.checked)}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm font-medium text-gray-700">Enable biometric capture</span>
                      </label>

                      {settings.biometricSettings.enabled && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Sensitivity Level
                            </label>
                            <select
                              value={settings.biometricSettings.sensitivityLevel}
                              onChange={(e) => updateSettings('biometricSettings', 'sensitivityLevel', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            >
                              <option value="low">Low - Basic capture</option>
                              <option value="medium">Medium - Standard capture</option>
                              <option value="high">High - Detailed capture</option>
                            </select>
                          </div>

                          <div className="space-y-3">
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={settings.biometricSettings.requireBiometric}
                                onChange={(e) => updateSettings('biometricSettings', 'requireBiometric', e.target.checked)}
                                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                              />
                              <span className="ml-2 text-sm text-gray-700">Require biometric for all signatures</span>
                            </label>

                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={settings.biometricSettings.trackPressure}
                                onChange={(e) => updateSettings('biometricSettings', 'trackPressure', e.target.checked)}
                                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                              />
                              <span className="ml-2 text-sm text-gray-700">Track pressure variations</span>
                            </label>

                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={settings.biometricSettings.trackVelocity}
                                onChange={(e) => updateSettings('biometricSettings', 'trackVelocity', e.target.checked)}
                                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                              />
                              <span className="ml-2 text-sm text-gray-700">Track stroke velocity</span>
                            </label>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Blockchain Settings */}
              {activeTab === 'blockchain' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Blockchain Audit Settings</h3>
                    
                    <div className="space-y-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.blockchainSettings.enabled}
                          onChange={(e) => updateSettings('blockchainSettings', 'enabled', e.target.checked)}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm font-medium text-gray-700">Enable blockchain audit trail</span>
                      </label>

                      {settings.blockchainSettings.enabled && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Verification Level
                            </label>
                            <select
                              value={settings.blockchainSettings.verificationLevel}
                              onChange={(e) => updateSettings('blockchainSettings', 'verificationLevel', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            >
                              <option value="basic">Basic - Simple hash verification</option>
                              <option value="standard">Standard - Full chain verification</option>
                              <option value="enhanced">Enhanced - Advanced cryptographic verification</option>
                            </select>
                          </div>

                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={settings.blockchainSettings.autoRecordEvents}
                              onChange={(e) => updateSettings('blockchainSettings', 'autoRecordEvents', e.target.checked)}
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-700">Automatically record all events</span>
                          </label>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Privacy Settings */}
              {activeTab === 'privacy' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Privacy & Data</h3>
                    
                    <div className="space-y-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.privacySettings.shareAnalytics}
                          onChange={(e) => updateSettings('privacySettings', 'shareAnalytics', e.target.checked)}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Share usage analytics</span>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.privacySettings.retainBiometricData}
                          onChange={(e) => updateSettings('privacySettings', 'retainBiometricData', e.target.checked)}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Retain biometric data for security</span>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.privacySettings.allowGeolocation}
                          onChange={(e) => updateSettings('privacySettings', 'allowGeolocation', e.target.checked)}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Allow geolocation for audit trail</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Notification Settings */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Notification Preferences</h3>
                    
                    <div className="space-y-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.notificationSettings.emailNotifications}
                          onChange={(e) => updateSettings('notificationSettings', 'emailNotifications', e.target.checked)}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Email notifications</span>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.notificationSettings.documentStatusUpdates}
                          onChange={(e) => updateSettings('notificationSettings', 'documentStatusUpdates', e.target.checked)}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Document status updates</span>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.notificationSettings.securityAlerts}
                          onChange={(e) => updateSettings('notificationSettings', 'securityAlerts', e.target.checked)}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Security alerts</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Settings are saved locally and will be synced to your account.
          </p>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center space-x-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Settings</span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardSettings;
