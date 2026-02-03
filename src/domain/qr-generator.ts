import type {
  QRCodeType,
  QRCodeTypeData,
  LinkData,
  InstagramData,
  WhatsAppData,
  EmailData,
  PhoneData,
  ContactData,
  PayPalData,
  WiseData,
  BitcoinData,
  RevolutData,
  CryptoData,
  SMSData,
  WiFiData,
  TextData,
} from './qr-types';

function normalizeUrl(url: string): string {
  const trimmed = (url || '').trim();
  if (!trimmed) return '';
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export function generateContent(type: QRCodeType, data: QRCodeTypeData): string {
  switch (type) {
    case 'link': return generateLinkContent(data as LinkData);
    case 'instagram': return generateInstagramContent(data as InstagramData);
    case 'whatsapp': return generateWhatsAppContent(data as WhatsAppData);
    case 'email': return generateEmailContent(data as EmailData);
    case 'phone': return generatePhoneContent(data as PhoneData);
    case 'contact': return generateContactContent(data as ContactData);
    case 'paypal': return generatePayPalContent(data as PayPalData);
    case 'wise': return generateWiseContent(data as WiseData);
    case 'bitcoin': return generateBitcoinContent(data as BitcoinData);
    case 'revolut': return generateRevolutContent(data as RevolutData);
    case 'crypto': return generateCryptoContent(data as CryptoData);
    case 'sms': return generateSMSContent(data as SMSData);
    case 'wifi': return generateWiFiContent(data as WiFiData);
    case 'text': return generateTextContent(data as TextData);
    default: throw new Error(`Unsupported QR code type: ${type}`);
  }
}

function generateLinkContent(data: LinkData): string {
  return normalizeUrl(data.url);
}

function generateInstagramContent(data: InstagramData): string {
  const username = (data.username || '').replace(/^@/, '').trim();
  return `https://instagram.com/${encodeURIComponent(username)}`;
}

function generateWhatsAppContent(data: WhatsAppData): string {
  const cleanPhone = data.phone.replace(/[^0-9]/g, '');
  let url = `https://wa.me/${cleanPhone}`;
  if (data.message) {
    url += `?text=${encodeURIComponent(data.message)}`;
  }
  return url;
}

function generateEmailContent(data: EmailData): string {
  let content = `mailto:${data.email}`;
  const params: string[] = [];
  if (data.subject) params.push(`subject=${encodeURIComponent(data.subject)}`);
  if (data.message) params.push(`body=${encodeURIComponent(data.message)}`);
  if (params.length > 0) content += `?${params.join('&')}`;
  return content;
}

function generatePhoneContent(data: PhoneData): string {
  return `tel:${data.phone}`;
}

function generateContactContent(data: ContactData): string {
  const vcard = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${data.lastName};${data.firstName}`,
    `FN:${data.firstName} ${data.lastName}`,
  ];
  if (data.phone) vcard.push(`TEL:${data.phone}`);
  if (data.email) vcard.push(`EMAIL:${data.email}`);
  vcard.push('END:VCARD');
  return vcard.join('\n');
}

function generatePayPalContent(data: PayPalData): string {
  const cleanHandle = (data.paypalme || '').replace(/^@/, '').replace(/\s+/g, '').trim();
  let url = `https://paypal.me/${encodeURIComponent(cleanHandle)}`;
  if (data.amount) {
    url += `/${data.amount}`;
    if (data.currency) url += data.currency.toUpperCase();
  }
  return url;
}

function generateWiseContent(data: WiseData): string {
  const cleanTag = (data.wiseTag || '').replace(/^@/, '').trim();
  let content = `https://wise.com/pay/me/${encodeURIComponent(cleanTag)}`;
  const params: string[] = [];
  if (data.amount) params.push(`amount=${data.amount}`);
  if (data.currency) params.push(`currency=${data.currency.toUpperCase()}`);
  if (params.length > 0) content += `?${params.join('&')}`;
  return content;
}

function generateBitcoinContent(data: BitcoinData): string {
  let content = `bitcoin:${data.address}`;
  if (data.amount) content += `?amount=${data.amount}`;
  return content;
}

function generateRevolutContent(data: RevolutData): string {
  const cleanTag = (data.revolutTag || '').replace(/^@/, '').trim();
  let content = `https://revolut.com/pay/me/${encodeURIComponent(cleanTag)}`;
  const params: string[] = [];
  if (data.amount) params.push(`amount=${data.amount}`);
  if (data.currency) params.push(`currency=${data.currency.toUpperCase()}`);
  if (params.length > 0) content += `?${params.join('&')}`;
  return content;
}

function generateCryptoContent(data: CryptoData): string {
  const crypto = (data.cryptocurrency || '').toLowerCase().trim();
  let content = `${crypto}:${data.address}`;
  if (data.amount) content += `?amount=${data.amount}`;
  return content;
}

function generateSMSContent(data: SMSData): string {
  let content = `sms:${data.phone}`;
  if (data.message) content += `?body=${encodeURIComponent(data.message)}`;
  return content;
}

function generateWiFiContent(data: WiFiData): string {
  const enc = data.encryption || 'WPA';
  const hidden = data.hidden ? 'true' : 'false';
  return `WIFI:T:${enc};S:${data.ssid};P:${data.password || ''};H:${hidden};;`;
}

function generateTextContent(data: TextData): string {
  return data.text;
}

export function generateLabel(type: QRCodeType, data: QRCodeTypeData): string {
  if ('label' in data) {
    const explicit = (data as { label?: string }).label;
    if (explicit !== undefined && explicit !== null) {
      const trimmed = explicit.trim();
      if (trimmed) return trimmed;
    }
  }

  switch (type) {
    case 'link': {
      const d = data as LinkData;
      try { return new URL(normalizeUrl(d.url)).hostname; } catch { return d.url; }
    }
    case 'instagram': return `@${(data as InstagramData).username.replace('@', '')}`;
    case 'whatsapp': return `WhatsApp: ${(data as WhatsAppData).phone}`;
    case 'email': return (data as EmailData).email;
    case 'phone': return (data as PhoneData).phone;
    case 'contact': { const d = data as ContactData; return `${d.firstName} ${d.lastName}`; }
    case 'paypal': return `PayPal: ${(data as PayPalData).paypalme}`;
    case 'wise': return `Wise: ${(data as WiseData).wiseTag.replace(/^@/, '')}`;
    case 'bitcoin': return `Bitcoin: ${(data as BitcoinData).address.substring(0, 20)}...`;
    case 'revolut': return `Revolut: ${(data as RevolutData).revolutTag.replace(/^@/, '')}`;
    case 'crypto': {
      const d = data as CryptoData;
      const name = d.cryptocurrency.charAt(0).toUpperCase() + d.cryptocurrency.slice(1).toLowerCase();
      return `${name}: ${d.address.substring(0, 20)}...`;
    }
    case 'sms': return `SMS: ${(data as SMSData).phone}`;
    case 'wifi': return `WiFi: ${(data as WiFiData).ssid}`;
    case 'text': return `Text: ${(data as TextData).text.substring(0, 30)}${(data as TextData).text.length > 30 ? '...' : ''}`;
    default: return 'QR Code';
  }
}
