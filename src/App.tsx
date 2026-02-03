import { Routes, Route } from 'react-router-dom';
import { useTheme } from '@/hooks/useTheme';
import { AppShell } from '@/components/layout/AppShell';
import { TabBar } from '@/components/ui/TabBar';
import { Home } from '@/routes/Home';
import { Backgrounds } from '@/routes/Backgrounds';
import { Export } from '@/routes/Export';
import { Premium } from '@/routes/Premium';
import { QRCreate } from '@/routes/QRCreate';
import { QREdit } from '@/routes/QREdit';
import { PurchaseSuccess } from '@/routes/PurchaseSuccess';
import { PurchaseCancel } from '@/routes/PurchaseCancel';

export default function App() {
  // Initialize theme
  useTheme();

  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/backgrounds" element={<Backgrounds />} />
        <Route path="/export" element={<Export />} />
        <Route path="/premium" element={<Premium />} />
        <Route path="/qr/new" element={<QRCreate />} />
        <Route path="/qr/:id" element={<QREdit />} />
        <Route path="/purchase/success" element={<PurchaseSuccess />} />
        <Route path="/purchase/cancel" element={<PurchaseCancel />} />
      </Routes>
      <TabBar />
    </AppShell>
  );
}
