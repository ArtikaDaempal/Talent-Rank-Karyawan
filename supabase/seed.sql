-- Seed data for departments
insert into departemen (name) values 
('Bidang Produksi / Operasional (Manufaktur)'),
('Bidang Gudang & Inventaris (Logistik)'),
('Bidang Pengiriman & Distribusi (Logistik)'),
('Bidang Maintenance / Perawatan Mesin'),
('Bidang Quality Control (QC)')
on conflict (name) do nothing;
