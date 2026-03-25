import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from './admin/AdminLayout';
import { AdminDashboard } from './admin/AdminDashboard';
import { AdminStatusEffectsList } from './admin/AdminStatusEffectsList';
import { AdminStatusEffectEditor } from './admin/AdminStatusEffectEditor';
import { AdminChipsList } from './admin/AdminChipsList';
import { AdminChipEditor } from './admin/AdminChipEditor';
import { AdminCombosList } from './admin/AdminCombosList';
import { AdminComboEditor } from './admin/AdminComboEditor';
import { AdminSkillsList } from './admin/AdminSkillsList';
import { AdminSkillEditor } from './admin/AdminSkillEditor';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="skills" element={<AdminSkillsList />} />
          <Route path="skills/new" element={<AdminSkillEditor />} />
          <Route path="skills/:skillId" element={<AdminSkillEditor />} />
          <Route path="combos" element={<AdminCombosList />} />
          <Route path="combos/new" element={<AdminComboEditor />} />
          <Route path="combos/:comboId" element={<AdminComboEditor />} />
          <Route path="chips" element={<AdminChipsList />} />
          <Route path="chips/:socketId" element={<AdminChipEditor />} />
          <Route path="status-effects" element={<AdminStatusEffectsList />} />
          <Route path="status-effects/new" element={<AdminStatusEffectEditor />} />
          <Route path="status-effects/:effectId" element={<AdminStatusEffectEditor />} />
        </Route>
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
