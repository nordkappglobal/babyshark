CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admin can do all on admin_audit_logs" ON admin_audit_logs TO authenticated USING ((auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')));
CREATE POLICY "Admin can do all on achievement_tiers" ON achievement_tiers TO authenticated USING ((auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')));
CREATE POLICY "Admin can do all on campaign_counters" ON campaign_counters TO authenticated USING ((auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')));
