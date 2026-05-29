-- Sosyal medya linkleri (footer)
INSERT INTO public.settings (key, value, label) VALUES
  ('social_instagram', '', 'Instagram URL'),
  ('social_facebook',  '', 'Facebook URL'),
  ('social_x',         '', 'X (Twitter) URL'),
  ('social_linkedin',  '', 'LinkedIn URL'),
  ('social_youtube',   '', 'YouTube URL')
ON CONFLICT (key) DO NOTHING;
