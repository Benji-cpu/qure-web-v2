export type QRCodeType =
  | 'link'
  | 'instagram'
  | 'whatsapp'
  | 'email'
  | 'phone'
  | 'contact'
  | 'paypal'
  | 'wise'
  | 'bitcoin'
  | 'revolut'
  | 'crypto'
  | 'sms'
  | 'wifi'
  | 'text';

export const DEFAULT_QR_TYPE: QRCodeType = 'whatsapp';

export interface QRTypeField {
  key: string;
  label: string;
  required: boolean;
  placeholder: string;
  type?: 'text' | 'email' | 'tel' | 'textarea' | 'select';
  options?: { value: string; label: string }[];
}

export interface QRTypeConfig {
  type: QRCodeType;
  title: string;
  icon: string;
  fields: QRTypeField[];
}

export const QR_TYPES: QRTypeConfig[] = [
  {
    type: 'whatsapp',
    title: 'WhatsApp',
    icon: '💬',
    fields: [
      { key: 'phone', label: 'Phone Number', required: true, placeholder: '+1234567890', type: 'tel' },
      { key: 'message', label: 'Pre-filled Message', required: false, placeholder: 'Hello! I saw your QR code...', type: 'textarea' },
      { key: 'label', label: 'Label', required: false, placeholder: 'WhatsApp Chat' },
    ],
  },
  {
    type: 'instagram',
    title: 'Instagram',
    icon: '📸',
    fields: [
      { key: 'username', label: 'Username', required: true, placeholder: 'username (without @)' },
      { key: 'label', label: 'Label', required: false, placeholder: 'Follow me on Instagram' },
    ],
  },
  {
    type: 'link',
    title: 'Link',
    icon: '🔗',
    fields: [
      { key: 'url', label: 'URL', required: true, placeholder: 'https://example.com' },
      { key: 'label', label: 'Label', required: false, placeholder: 'My Website' },
    ],
  },
  {
    type: 'email',
    title: 'Email',
    icon: '📧',
    fields: [
      { key: 'email', label: 'Email Address', required: true, placeholder: 'email@example.com', type: 'email' },
      { key: 'subject', label: 'Subject', required: false, placeholder: 'Email subject' },
      { key: 'message', label: 'Message', required: false, placeholder: 'Email message', type: 'textarea' },
      { key: 'label', label: 'Label', required: false, placeholder: 'Email Label' },
    ],
  },
  {
    type: 'phone',
    title: 'Phone',
    icon: '📞',
    fields: [
      { key: 'phone', label: 'Phone Number', required: true, placeholder: '+1234567890', type: 'tel' },
      { key: 'label', label: 'Label', required: false, placeholder: 'Phone Label' },
    ],
  },
  {
    type: 'contact',
    title: 'Contact',
    icon: '👤',
    fields: [
      { key: 'firstName', label: 'First Name', required: true, placeholder: 'John' },
      { key: 'lastName', label: 'Last Name', required: true, placeholder: 'Doe' },
      { key: 'phone', label: 'Phone', required: false, placeholder: '+1234567890', type: 'tel' },
      { key: 'email', label: 'Email', required: false, placeholder: 'john@example.com', type: 'email' },
      { key: 'label', label: 'Label', required: false, placeholder: 'Contact Label' },
    ],
  },
  {
    type: 'paypal',
    title: 'PayPal',
    icon: '💳',
    fields: [
      { key: 'paypalme', label: 'PayPal.me Username', required: true, placeholder: 'your-paypal-username' },
      { key: 'amount', label: 'Amount', required: false, placeholder: '25.00' },
      { key: 'currency', label: 'Currency', required: false, placeholder: 'USD' },
      { key: 'label', label: 'Label', required: false, placeholder: 'PayPal Payment' },
    ],
  },
  {
    type: 'wise',
    title: 'Wise',
    icon: '🌍',
    fields: [
      { key: 'wiseTag', label: 'Wise Tag / Username', required: true, placeholder: '@yourtag' },
      { key: 'amount', label: 'Amount', required: false, placeholder: '100.00' },
      { key: 'currency', label: 'Currency', required: false, placeholder: 'USD' },
      { key: 'label', label: 'Label', required: false, placeholder: 'Wise Transfer' },
    ],
  },
  {
    type: 'revolut',
    title: 'Revolut',
    icon: '💳',
    fields: [
      { key: 'revolutTag', label: 'Revolut Tag / Username', required: true, placeholder: '@yourtag' },
      { key: 'amount', label: 'Amount', required: false, placeholder: '50.00' },
      { key: 'currency', label: 'Currency', required: false, placeholder: 'EUR' },
      { key: 'label', label: 'Label', required: false, placeholder: 'Revolut Payment' },
    ],
  },
  {
    type: 'bitcoin',
    title: 'Bitcoin',
    icon: '₿',
    fields: [
      { key: 'address', label: 'Bitcoin Address', required: true, placeholder: 'bc1qxy2kgdygjrsqtzq2n0yrf...' },
      { key: 'amount', label: 'Amount in BTC', required: false, placeholder: '0.001' },
      { key: 'label', label: 'Label', required: false, placeholder: 'Bitcoin Payment' },
    ],
  },
  {
    type: 'crypto',
    title: 'Crypto',
    icon: '🪙',
    fields: [
      { key: 'cryptocurrency', label: 'Cryptocurrency', required: true, placeholder: 'ethereum, litecoin, etc.' },
      { key: 'address', label: 'Wallet Address', required: true, placeholder: '0x742d35Cc6634C0532925a3b...' },
      { key: 'amount', label: 'Amount', required: false, placeholder: '0.5' },
      { key: 'label', label: 'Label', required: false, placeholder: 'Crypto Payment' },
    ],
  },
  {
    type: 'sms',
    title: 'SMS',
    icon: '💬',
    fields: [
      { key: 'phone', label: 'Phone Number', required: true, placeholder: '+1234567890', type: 'tel' },
      { key: 'message', label: 'Message', required: false, placeholder: 'Pre-filled message', type: 'textarea' },
      { key: 'label', label: 'Label', required: false, placeholder: 'SMS Label' },
    ],
  },
  {
    type: 'wifi',
    title: 'WiFi',
    icon: '📶',
    fields: [
      { key: 'ssid', label: 'Network Name (SSID)', required: true, placeholder: 'MyWiFiNetwork' },
      { key: 'password', label: 'Password', required: false, placeholder: 'password123' },
      {
        key: 'encryption',
        label: 'Encryption',
        required: true,
        placeholder: 'WPA',
        type: 'select',
        options: [
          { value: 'WPA', label: 'WPA/WPA2' },
          { value: 'WEP', label: 'WEP' },
          { value: 'nopass', label: 'None' },
        ],
      },
      { key: 'label', label: 'Label', required: false, placeholder: 'WiFi Label' },
    ],
  },
  {
    type: 'text',
    title: 'Text',
    icon: '📝',
    fields: [
      { key: 'text', label: 'Text Content', required: true, placeholder: 'Enter any text...', type: 'textarea' },
      { key: 'label', label: 'Label', required: false, placeholder: 'Text Label' },
    ],
  },
];

// Data interfaces
export interface LinkData { url: string; label?: string }
export interface InstagramData { username: string; label?: string }
export interface WhatsAppData { phone: string; message?: string; label?: string }
export interface EmailData { email: string; subject?: string; message?: string; label?: string }
export interface PhoneData { phone: string; label?: string }
export interface ContactData { firstName: string; lastName: string; phone?: string; email?: string; label?: string }
export interface PayPalData { paypalme: string; amount?: string; currency?: string; label?: string }
export interface WiseData { wiseTag: string; amount?: string; currency?: string; label?: string }
export interface BitcoinData { address: string; amount?: string; label?: string }
export interface RevolutData { revolutTag: string; amount?: string; currency?: string; label?: string }
export interface CryptoData { cryptocurrency: string; address: string; amount?: string; label?: string }
export interface SMSData { phone: string; message?: string; label?: string }
export interface WiFiData { ssid: string; password?: string; encryption: 'WPA' | 'WEP' | 'nopass'; hidden?: boolean; label?: string }
export interface TextData { text: string; label?: string }

export type QRCodeTypeData =
  | LinkData
  | InstagramData
  | WhatsAppData
  | EmailData
  | PhoneData
  | ContactData
  | PayPalData
  | WiseData
  | BitcoinData
  | RevolutData
  | CryptoData
  | SMSData
  | WiFiData
  | TextData;

export interface QRCodeDesign {
  color: string;
  backgroundColor: string;
}

export interface QRCodeData {
  id: string;
  type: QRCodeType;
  label: string;
  data: QRCodeTypeData;
  content: string;
  createdAt: string;
  design?: QRCodeDesign;
}

export const DEFAULT_QURE_QR_URL = 'https://qure-web-gilt.vercel.app/';
export const DEFAULT_QURE_QR_ID = 'default-qure';

export const DEFAULT_QURE_QR: QRCodeData = {
  id: DEFAULT_QURE_QR_ID,
  type: 'link',
  label: 'QuRe',
  data: { url: DEFAULT_QURE_QR_URL },
  content: DEFAULT_QURE_QR_URL,
  createdAt: '',
  design: { color: '#000000', backgroundColor: '#FFFFFF' },
};
