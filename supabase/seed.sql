-- Seed data for landing page

-- 6 testimonials
INSERT INTO testimonials (author_name, author_role, author_company, content, rating, featured, sort_order) VALUES
  ('Sarah Chen', 'CTO', 'TechCorp',
   'This platform cut our development time in half. We went from idea to production in two weeks — something that would have taken months before.',
   5, true, 1),
  ('Marcus Johnson', 'Founder', 'StartupXYZ',
   'The best investment we made this year. The built-in analytics alone saved us four months of engineering. Our investors were blown away by our velocity.',
   5, true, 2),
  ('Emily Rodriguez', 'Engineering Lead', 'ScaleUp',
   'Incredible developer experience. The codebase is clean, the docs are thorough, and our team was productive from day one. Nothing else comes close.',
   5, true, 3),
  ('David Park', 'Product Manager', 'Momentum',
   'We evaluated 5 alternatives. This was the only one that didn''t feel like a hack. Solid TypeScript, great test coverage, and a team that actually responds.',
   5, false, 4),
  ('Priya Kapoor', 'Solo Founder', 'IndieHack',
   'As a solo founder I can''t afford to waste time on boilerplate. This gave me a 6-month head start. Launched in 3 weeks and already profitable.',
   5, false, 5),
  ('Tom Nakamura', 'Head of Engineering', 'Velocity AI',
   'We migrated our legacy system using this as the new foundation. The migration guide was thorough and our team completed it in a single sprint.',
   5, false, 6)
ON CONFLICT DO NOTHING;

-- 8 FAQs
INSERT INTO faqs (question, answer, category, sort_order) VALUES
  ('What is included in the free trial?',
   'Every plan includes a full-featured 14-day free trial. No credit card required. You get access to all features of the plan you choose, including analytics, API access, and team collaboration.',
   'billing', 1),
  ('Can I change plans later?',
   'Absolutely. You can upgrade or downgrade your plan at any time. When upgrading, you''ll be prorated for the remainder of your billing cycle. Downgrades take effect at the next billing date.',
   'billing', 2),
  ('Is my data secure?',
   'Security is our top priority. We are SOC 2 Type II certified, use end-to-end encryption for data in transit and at rest, and support SSO/SAML for enterprise customers. All data is hosted on ISO 27001-certified infrastructure.',
   'security', 3),
  ('Do you offer a self-hosted option?',
   'Yes — our Enterprise plan includes the option for on-premise deployment. Contact our sales team for details on infrastructure requirements and pricing.',
   'product', 4),
  ('What kind of support do you offer?',
   'All plans include community support via our forum. Pro plans get priority email support with a 4-hour SLA. Enterprise customers receive a dedicated account manager and custom SLA terms.',
   'support', 5),
  ('Can I use my own domain?',
   'Yes. Custom domains are available on all plans. Starter plans support one custom domain, while Pro and Enterprise plans support unlimited custom domains with automatic SSL provisioning.',
   'product', 6),
  ('How does billing work?',
   'We bill monthly or annually (with a 20% discount for annual plans). All prices are in USD. We accept all major credit cards and can arrange invoicing for Enterprise customers.',
   'billing', 7),
  ('What happens when I cancel?',
   'You can cancel anytime with no penalties. Your account will remain active until the end of your current billing period. After that, your data is retained for 30 days in case you change your mind.',
   'billing', 8)
ON CONFLICT DO NOTHING;

-- 3 sample waitlist entries
INSERT INTO waitlist (email, name, referral_source) VALUES
  ('alice@example.com', 'Alice Example', 'twitter'),
  ('bob@example.com', 'Bob Builder', 'product_hunt'),
  ('carol@example.com', 'Carol Developer', 'google')
ON CONFLICT (email) DO NOTHING;
