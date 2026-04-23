-- Initial schema: waitlist, testimonials, faqs
-- Landing page tables for dynamic content

-- Waitlist: collect early-access signups
CREATE TABLE IF NOT EXISTS waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  referral_source TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Testimonials: customer quotes displayed on the landing page
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name TEXT NOT NULL,
  author_role TEXT,
  author_company TEXT,
  author_avatar_url TEXT,
  content TEXT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  featured BOOLEAN NOT NULL DEFAULT false,
  sort_order INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- FAQs: frequently asked questions
CREATE TABLE IF NOT EXISTS faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT,
  sort_order INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS: waitlist insertable by anyone (anon key), readable by authenticated only
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert waitlist" ON waitlist
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can read waitlist" ON waitlist
  FOR SELECT TO authenticated
  USING (true);

-- RLS: testimonials readable by all (public-facing content)
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read testimonials" ON testimonials
  FOR SELECT TO anon, authenticated
  USING (true);

-- RLS: faqs readable by all (public-facing content)
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read faqs" ON faqs
  FOR SELECT TO anon, authenticated
  USING (true);
