/*
================================================================================
AuthorOS — Database Foundation (013)
Commerce: library, wishlist, orders, order_items, payments, memberships
================================================================================
*/

-- ─── library ─────────────────────────────────────────────────────────────────

CREATE TABLE library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  source VARCHAR(50) NOT NULL DEFAULT 'purchase'
    CHECK (source IN ('purchase', 'gift', 'membership', 'promotion', 'admin', 'sample')),
  format public.digital_format,
  acquired_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  last_opened_at TIMESTAMP WITH TIME ZONE,
  open_count INTEGER NOT NULL DEFAULT 0,
  is_favorite BOOLEAN NOT NULL DEFAULT FALSE,
  deleted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT library_user_book_unique UNIQUE (user_id, book_id)
);

COMMENT ON TABLE library IS 'Reader owned/purchased books (My Library)';
COMMENT ON COLUMN library.source IS 'How the book was added to the library';
COMMENT ON COLUMN library.format IS 'Preferred owned format (epub/pdf)';
COMMENT ON COLUMN library.expires_at IS 'NULL = permanent access; set for rentals/trials';

CREATE INDEX idx_library_user_id ON library(user_id);
CREATE INDEX idx_library_book_id ON library(book_id);
CREATE INDEX idx_library_user_active ON library(user_id, last_opened_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_library_favorites ON library(user_id) WHERE is_favorite = TRUE AND deleted_at IS NULL;

CREATE TRIGGER library_updated_at
  BEFORE UPDATE ON library
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─── wishlist ────────────────────────────────────────────────────────────────

CREATE TABLE wishlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  priority INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  notify_on_sale BOOLEAN NOT NULL DEFAULT TRUE,
  notify_on_release BOOLEAN NOT NULL DEFAULT TRUE,
  added_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT wishlist_user_book_unique UNIQUE (user_id, book_id)
);

COMMENT ON TABLE wishlist IS 'Reader saved books (My Wishlist)';

CREATE INDEX idx_wishlist_user_id ON wishlist(user_id);
CREATE INDEX idx_wishlist_book_id ON wishlist(book_id);
CREATE INDEX idx_wishlist_user_active ON wishlist(user_id, added_at DESC) WHERE deleted_at IS NULL;

CREATE TRIGGER wishlist_updated_at
  BEFORE UPDATE ON wishlist
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─── orders ──────────────────────────────────────────────────────────────────

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  order_number VARCHAR(20) NOT NULL,
  status public.order_status NOT NULL DEFAULT 'pending',
  subtotal NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (subtotal >= 0),
  discount_amount NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (discount_amount >= 0),
  tax_amount NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (tax_amount >= 0),
  shipping_amount NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (shipping_amount >= 0),
  total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (total_amount >= 0),
  currency VARCHAR(10) NOT NULL DEFAULT 'INR',
  billing_email VARCHAR(255) NOT NULL,
  billing_name VARCHAR(200),
  billing_phone VARCHAR(30),
  billing_address JSONB NOT NULL DEFAULT '{}'::jsonb,
  shipping_address JSONB NOT NULL DEFAULT '{}'::jsonb,
  coupon_code VARCHAR(50),
  notes TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  placed_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  deleted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT orders_order_number_unique UNIQUE (order_number)
);

COMMENT ON TABLE orders IS 'Reader purchase orders';
COMMENT ON COLUMN orders.metadata IS 'Gateway refs, UTM, device info (JSON)';

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_placed_at ON orders(placed_at DESC NULLS LAST);
CREATE INDEX idx_orders_number ON orders(order_number);

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TEXT LANGUAGE plpgsql VOLATILE SET search_path = public AS $$
DECLARE next_num BIGINT;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM 4) AS BIGINT)), 0) + 1
  INTO next_num FROM orders WHERE order_number ~ '^AO-[0-9]+$';
  RETURN 'AO-' || LPAD(next_num::TEXT, 8, '0');
END;
$$;

CREATE OR REPLACE FUNCTION public.orders_set_order_number()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    NEW.order_number := public.generate_order_number();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER orders_before_insert_number
  BEFORE INSERT ON orders
  FOR EACH ROW EXECUTE FUNCTION public.orders_set_order_number();

-- ─── order_items ─────────────────────────────────────────────────────────────

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE RESTRICT,
  format public.digital_format,
  title_snapshot VARCHAR(500) NOT NULL,
  sku_snapshot VARCHAR(100),
  unit_price NUMERIC(12, 2) NOT NULL CHECK (unit_price >= 0),
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  discount_amount NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (discount_amount >= 0),
  tax_amount NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (tax_amount >= 0),
  line_total NUMERIC(12, 2) NOT NULL CHECK (line_total >= 0),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  deleted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE order_items IS 'Line items within an order';
COMMENT ON COLUMN order_items.title_snapshot IS 'Immutable title at time of purchase';

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_book_id ON order_items(book_id);

CREATE TRIGGER order_items_updated_at
  BEFORE UPDATE ON order_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─── payments ────────────────────────────────────────────────────────────────

CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  status public.payment_status NOT NULL DEFAULT 'pending',
  provider VARCHAR(50) NOT NULL DEFAULT 'mock',
  provider_payment_id VARCHAR(255),
  provider_order_id VARCHAR(255),
  method VARCHAR(50),
  amount NUMERIC(12, 2) NOT NULL CHECK (amount >= 0),
  currency VARCHAR(10) NOT NULL DEFAULT 'INR',
  failure_reason TEXT,
  receipt_url TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  authorized_at TIMESTAMP WITH TIME ZONE,
  captured_at TIMESTAMP WITH TIME ZONE,
  refunded_at TIMESTAMP WITH TIME ZONE,
  deleted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE payments IS 'Payment transactions linked to orders';
COMMENT ON COLUMN payments.provider IS 'Payment gateway identifier (razorpay, stripe, mock)';

CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_provider_id ON payments(provider_payment_id) WHERE provider_payment_id IS NOT NULL;

CREATE TRIGGER payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─── memberships ─────────────────────────────────────────────────────────────

CREATE TABLE memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tier public.membership_tier NOT NULL DEFAULT 'free',
  status public.membership_status NOT NULL DEFAULT 'active',
  billing_cycle VARCHAR(20) CHECK (billing_cycle IN ('monthly', 'yearly', 'lifetime', 'none')),
  price_paid NUMERIC(12, 2) CHECK (price_paid IS NULL OR price_paid >= 0),
  currency VARCHAR(10) NOT NULL DEFAULT 'INR',
  auto_renew BOOLEAN NOT NULL DEFAULT TRUE,
  trial_ends_at TIMESTAMP WITH TIME ZONE,
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  provider_subscription_id VARCHAR(255),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  deleted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE memberships IS 'Reader membership subscriptions';
COMMENT ON COLUMN memberships.tier IS 'free | basic | premium | lifetime';

CREATE UNIQUE INDEX idx_memberships_user_active ON memberships(user_id)
  WHERE status = 'active' AND deleted_at IS NULL;

CREATE INDEX idx_memberships_user_id ON memberships(user_id);
CREATE INDEX idx_memberships_tier ON memberships(tier);
CREATE INDEX idx_memberships_status ON memberships(status);
CREATE INDEX idx_memberships_period_end ON memberships(current_period_end);

CREATE TRIGGER memberships_updated_at
  BEFORE UPDATE ON memberships
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─── Ownership helper (real implementation) ──────────────────────────────────

CREATE OR REPLACE FUNCTION public.user_owns_book(target_book_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM library l
    WHERE l.user_id = auth.uid()
      AND l.book_id = target_book_id
      AND public.is_not_deleted(l.deleted_at)
      AND (l.expires_at IS NULL OR l.expires_at > NOW())
  );
$$;

COMMENT ON FUNCTION public.user_owns_book IS 'TRUE when user has active library access to the book';

CREATE OR REPLACE FUNCTION public.user_has_active_membership()
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM memberships m
    WHERE m.user_id = auth.uid()
      AND m.status = 'active'::public.membership_status
      AND public.is_not_deleted(m.deleted_at)
      AND (m.current_period_end IS NULL OR m.current_period_end > NOW())
      AND m.tier <> 'free'::public.membership_tier
  );
$$;

-- ─── RLS: library ────────────────────────────────────────────────────────────

ALTER TABLE library ENABLE ROW LEVEL SECURITY;

CREATE POLICY "library_select_own" ON library FOR SELECT TO authenticated
  USING (user_id = auth.uid() AND public.is_not_deleted(deleted_at));

CREATE POLICY "library_insert_own" ON library FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "library_update_own" ON library FOR UPDATE TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "library_delete_own" ON library FOR DELETE TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "library_manage_admin" ON library FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ─── RLS: wishlist ───────────────────────────────────────────────────────────

ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "wishlist_select_own" ON wishlist FOR SELECT TO authenticated
  USING (user_id = auth.uid() AND public.is_not_deleted(deleted_at));

CREATE POLICY "wishlist_insert_own" ON wishlist FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "wishlist_update_own" ON wishlist FOR UPDATE TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "wishlist_delete_own" ON wishlist FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- ─── RLS: orders ─────────────────────────────────────────────────────────────

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "orders_select_own" ON orders FOR SELECT TO authenticated
  USING (user_id = auth.uid() AND public.is_not_deleted(deleted_at));

CREATE POLICY "orders_insert_own" ON orders FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "orders_update_own" ON orders FOR UPDATE TO authenticated
  USING (user_id = auth.uid() AND status = 'pending'::public.order_status)
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "orders_manage_admin" ON orders FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ─── RLS: order_items ────────────────────────────────────────────────────────

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "order_items_select_own" ON order_items FOR SELECT TO authenticated
  USING (
    public.is_not_deleted(deleted_at)
    AND EXISTS (
      SELECT 1 FROM orders o
      WHERE o.id = order_items.order_id AND o.user_id = auth.uid()
    )
  );

CREATE POLICY "order_items_insert_own" ON order_items FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders o
      WHERE o.id = order_items.order_id AND o.user_id = auth.uid()
    )
  );

CREATE POLICY "order_items_manage_admin" ON order_items FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ─── RLS: payments ───────────────────────────────────────────────────────────

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "payments_select_own" ON payments FOR SELECT TO authenticated
  USING (user_id = auth.uid() AND public.is_not_deleted(deleted_at));

CREATE POLICY "payments_insert_system" ON payments FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "payments_manage_admin" ON payments FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ─── RLS: memberships ────────────────────────────────────────────────────────

ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "memberships_select_own" ON memberships FOR SELECT TO authenticated
  USING (user_id = auth.uid() AND public.is_not_deleted(deleted_at));

CREATE POLICY "memberships_insert_own" ON memberships FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "memberships_update_own" ON memberships FOR UPDATE TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "memberships_manage_admin" ON memberships FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());
