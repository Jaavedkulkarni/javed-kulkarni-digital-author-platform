/**
 * AuthorOS Database Types
 * Generated-style schema definitions aligned with Database Foundation migrations.
 * Regenerate via: supabase gen types typescript --local > src/types/database.ts
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type BookWorkflowStatus = 'draft' | 'review' | 'published' | 'archived';
export type DigitalFormat = 'epub' | 'pdf';
export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded' | 'failed';
export type PaymentStatus = 'pending' | 'authorized' | 'captured' | 'failed' | 'refunded' | 'cancelled';
export type MembershipTier = 'free' | 'basic' | 'premium' | 'lifetime';
export type MembershipStatus = 'active' | 'paused' | 'cancelled' | 'expired' | 'trial';
export type NotificationChannel = 'in_app' | 'email' | 'push';
export type NotificationCategory = 'orders' | 'membership' | 'reading' | 'promotions' | 'system' | 'account';
export type DownloadStatus = 'queued' | 'ready' | 'downloading' | 'completed' | 'expired' | 'failed';
export type AnalyticsEventType =
  | 'page_view'
  | 'book_open'
  | 'book_close'
  | 'chapter_start'
  | 'chapter_complete'
  | 'purchase'
  | 'search'
  | 'wishlist_add'
  | 'download_start'
  | 'download_complete'
  | 'custom';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar: string | null;
          status: string;
          phone: string | null;
          preferred_language: string | null;
          timezone: string | null;
          deleted_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar?: string | null;
          status?: string;
          phone?: string | null;
          preferred_language?: string | null;
          timezone?: string | null;
          deleted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar?: string | null;
          status?: string;
          phone?: string | null;
          preferred_language?: string | null;
          timezone?: string | null;
          deleted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      roles: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          is_system: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug?: string;
          description?: string | null;
          is_system?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          is_system?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          id: string;
          user_id: string;
          role_id: string;
          assigned_at: string;
          assigned_by: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          role_id: string;
          assigned_at?: string;
          assigned_by?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          role_id?: string;
          assigned_at?: string;
          assigned_by?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      role_assignment_logs: {
        Row: {
          id: string;
          user_id: string;
          role_id: string;
          action: string;
          assigned_by: string | null;
          reason: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          role_id: string;
          action: string;
          assigned_by?: string | null;
          reason?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          role_id?: string;
          action?: string;
          assigned_by?: string | null;
          reason?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      authors: {
        Row: {
          id: string;
          profile_id: string | null;
          slug: string;
          display_name: string;
          legal_name: string | null;
          bio: string | null;
          short_bio: string | null;
          avatar_storage_path: string | null;
          cover_storage_path: string | null;
          website_url: string | null;
          social_links: Json;
          is_verified: boolean;
          is_featured: boolean;
          status: string;
          sort_order: number;
          deleted_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id?: string | null;
          slug: string;
          display_name: string;
          legal_name?: string | null;
          bio?: string | null;
          short_bio?: string | null;
          avatar_storage_path?: string | null;
          cover_storage_path?: string | null;
          website_url?: string | null;
          social_links?: Json;
          is_verified?: boolean;
          is_featured?: boolean;
          status?: string;
          sort_order?: number;
          deleted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string | null;
          slug?: string;
          display_name?: string;
          legal_name?: string | null;
          bio?: string | null;
          short_bio?: string | null;
          avatar_storage_path?: string | null;
          cover_storage_path?: string | null;
          website_url?: string | null;
          social_links?: Json;
          is_verified?: boolean;
          is_featured?: boolean;
          status?: string;
          sort_order?: number;
          deleted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      publishers: {
        Row: {
          id: string;
          profile_id: string | null;
          slug: string;
          name: string;
          legal_name: string | null;
          description: string | null;
          logo_storage_path: string | null;
          website_url: string | null;
          contact_email: string | null;
          contact_phone: string | null;
          address: Json;
          is_verified: boolean;
          status: string;
          deleted_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id?: string | null;
          slug: string;
          name: string;
          legal_name?: string | null;
          description?: string | null;
          logo_storage_path?: string | null;
          website_url?: string | null;
          contact_email?: string | null;
          contact_phone?: string | null;
          address?: Json;
          is_verified?: boolean;
          status?: string;
          deleted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string | null;
          slug?: string;
          name?: string;
          legal_name?: string | null;
          description?: string | null;
          logo_storage_path?: string | null;
          website_url?: string | null;
          contact_email?: string | null;
          contact_phone?: string | null;
          address?: Json;
          is_verified?: boolean;
          status?: string;
          deleted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          icon: string | null;
          color: string | null;
          sort_order: number | null;
          parent_id: string | null;
          is_active: boolean;
          deleted_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          icon?: string | null;
          color?: string | null;
          sort_order?: number | null;
          parent_id?: string | null;
          is_active?: boolean;
          deleted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          icon?: string | null;
          color?: string | null;
          sort_order?: number | null;
          parent_id?: string | null;
          is_active?: boolean;
          deleted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      books: {
        Row: {
          id: string;
          title: string;
          subtitle: string | null;
          slug: string;
          short_description: string | null;
          full_description: string | null;
          cover_image: string | null;
          category_id: string | null;
          language: string | null;
          isbn: string | null;
          total_pages: number | null;
          amazon_url: string | null;
          sample_pdf_url: string | null;
          publication_date: string | null;
          status: string | null;
          workflow_status: BookWorkflowStatus;
          is_featured: boolean | null;
          is_new_release: boolean | null;
          meta_title: string | null;
          meta_description: string | null;
          og_image: string | null;
          author_name: string | null;
          author_id: string | null;
          publisher_id: string | null;
          series_id: string | null;
          series_order: number | null;
          primary_language: string | null;
          supported_languages: Json;
          epub_storage_path: string | null;
          pdf_storage_path: string | null;
          epub_file_size_bytes: number | null;
          pdf_file_size_bytes: number | null;
          page_count: number | null;
          word_count: number | null;
          published_at: string | null;
          archived_at: string | null;
          reviewed_at: string | null;
          reviewed_by: string | null;
          deleted_at: string | null;
          created_by: string | null;
          updated_by: string | null;
          product_type_id: string | null;
          gallery_images: Json | null;
          regular_price: number | null;
          sale_price: number | null;
          cost_price: number | null;
          currency: string | null;
          sku: string | null;
          downloadable: boolean | null;
          download_file: string | null;
          is_hidden: boolean | null;
          members_only: boolean | null;
          why_read: string | null;
          authors_note: string | null;
          table_of_contents: Json | null;
          related_slugs: Json | null;
          featured_highlights: Json | null;
          sort_order: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          subtitle?: string | null;
          slug: string;
          short_description?: string | null;
          full_description?: string | null;
          cover_image?: string | null;
          category_id?: string | null;
          language?: string | null;
          isbn?: string | null;
          total_pages?: number | null;
          amazon_url?: string | null;
          sample_pdf_url?: string | null;
          publication_date?: string | null;
          status?: string | null;
          workflow_status?: BookWorkflowStatus;
          is_featured?: boolean | null;
          is_new_release?: boolean | null;
          author_id?: string | null;
          publisher_id?: string | null;
          series_id?: string | null;
          primary_language?: string | null;
          supported_languages?: Json;
          epub_storage_path?: string | null;
          pdf_storage_path?: string | null;
          deleted_at?: string | null;
          created_at?: string;
          updated_at?: string;
          [key: string]: unknown;
        };
        Update: {
          [key: string]: unknown;
        };
        Relationships: [];
      };
      book_categories: {
        Row: {
          book_id: string;
          category_id: string;
          is_primary: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          book_id: string;
          category_id: string;
          is_primary?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          book_id?: string;
          category_id?: string;
          is_primary?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      series: {
        Row: {
          id: string;
          author_id: string | null;
          publisher_id: string | null;
          title: string;
          slug: string;
          subtitle: string | null;
          description: string | null;
          cover_storage_path: string | null;
          primary_language: string;
          supported_languages: Json;
          book_count: number;
          is_complete: boolean;
          is_featured: boolean;
          sort_order: number;
          deleted_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          author_id?: string | null;
          publisher_id?: string | null;
          title: string;
          slug: string;
          subtitle?: string | null;
          description?: string | null;
          cover_storage_path?: string | null;
          primary_language?: string;
          supported_languages?: Json;
          book_count?: number;
          is_complete?: boolean;
          is_featured?: boolean;
          sort_order?: number;
          deleted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          [key: string]: unknown;
        };
        Relationships: [];
      };
      chapters: {
        Row: {
          id: string;
          book_id: string;
          parent_chapter_id: string | null;
          title: string;
          slug: string | null;
          chapter_number: number;
          summary: string | null;
          content: string | null;
          content_storage_path: string | null;
          language_code: string;
          word_count: number | null;
          estimated_read_minutes: number | null;
          is_preview: boolean;
          is_published: boolean;
          sort_order: number;
          deleted_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          book_id: string;
          title: string;
          chapter_number: number;
          language_code?: string;
          is_preview?: boolean;
          is_published?: boolean;
          sort_order?: number;
          [key: string]: unknown;
        };
        Update: {
          [key: string]: unknown;
        };
        Relationships: [];
      };
      library: {
        Row: {
          id: string;
          user_id: string;
          book_id: string;
          source: string;
          format: DigitalFormat | null;
          acquired_at: string;
          expires_at: string | null;
          last_opened_at: string | null;
          open_count: number;
          is_favorite: boolean;
          deleted_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          book_id: string;
          source?: string;
          format?: DigitalFormat | null;
          acquired_at?: string;
          expires_at?: string | null;
          is_favorite?: boolean;
          deleted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          [key: string]: unknown;
        };
        Relationships: [];
      };
      wishlist: {
        Row: {
          id: string;
          user_id: string;
          book_id: string;
          priority: number;
          notes: string | null;
          notify_on_sale: boolean;
          notify_on_release: boolean;
          added_at: string;
          deleted_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          book_id: string;
          priority?: number;
          notes?: string | null;
          notify_on_sale?: boolean;
          notify_on_release?: boolean;
          added_at?: string;
          deleted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          [key: string]: unknown;
        };
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          order_number: string;
          status: OrderStatus;
          subtotal: number;
          discount_amount: number;
          tax_amount: number;
          shipping_amount: number;
          total_amount: number;
          currency: string;
          billing_email: string;
          billing_name: string | null;
          billing_phone: string | null;
          billing_address: Json;
          shipping_address: Json;
          coupon_code: string | null;
          notes: string | null;
          metadata: Json;
          placed_at: string | null;
          completed_at: string | null;
          cancelled_at: string | null;
          deleted_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          order_number?: string;
          status?: OrderStatus;
          subtotal?: number;
          total_amount?: number;
          currency?: string;
          billing_email: string;
          billing_address?: Json;
          shipping_address?: Json;
          metadata?: Json;
          deleted_at?: string | null;
          created_at?: string;
          updated_at?: string;
          [key: string]: unknown;
        };
        Update: {
          [key: string]: unknown;
        };
        Relationships: [];
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          book_id: string;
          format: DigitalFormat | null;
          title_snapshot: string;
          sku_snapshot: string | null;
          unit_price: number;
          quantity: number;
          discount_amount: number;
          tax_amount: number;
          line_total: number;
          metadata: Json;
          deleted_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          book_id: string;
          title_snapshot: string;
          unit_price: number;
          quantity?: number;
          line_total: number;
          metadata?: Json;
          [key: string]: unknown;
        };
        Update: {
          [key: string]: unknown;
        };
        Relationships: [];
      };
      payments: {
        Row: {
          id: string;
          order_id: string;
          user_id: string;
          status: PaymentStatus;
          provider: string;
          provider_payment_id: string | null;
          amount: number;
          currency: string;
          failure_reason: string | null;
          metadata: Json;
          authorized_at: string | null;
          captured_at: string | null;
          refunded_at: string | null;
          deleted_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          user_id: string;
          status?: PaymentStatus;
          provider?: string;
          amount: number;
          currency?: string;
          metadata?: Json;
          [key: string]: unknown;
        };
        Update: {
          [key: string]: unknown;
        };
        Relationships: [];
      };
      memberships: {
        Row: {
          id: string;
          user_id: string;
          tier: MembershipTier;
          status: MembershipStatus;
          billing_cycle: string | null;
          price_paid: number | null;
          currency: string;
          auto_renew: boolean;
          trial_ends_at: string | null;
          current_period_start: string | null;
          current_period_end: string | null;
          cancelled_at: string | null;
          provider_subscription_id: string | null;
          metadata: Json;
          deleted_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          tier?: MembershipTier;
          status?: MembershipStatus;
          currency?: string;
          auto_renew?: boolean;
          metadata?: Json;
          [key: string]: unknown;
        };
        Update: {
          [key: string]: unknown;
        };
        Relationships: [];
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          category: NotificationCategory;
          channel: NotificationChannel;
          title: string;
          body: string;
          action_url: string | null;
          action_label: string | null;
          reference_type: string | null;
          reference_id: string | null;
          metadata: Json;
          is_read: boolean;
          read_at: string | null;
          is_archived: boolean;
          archived_at: string | null;
          expires_at: string | null;
          deleted_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          category?: NotificationCategory;
          channel?: NotificationChannel;
          title: string;
          body: string;
          metadata?: Json;
          is_read?: boolean;
          [key: string]: unknown;
        };
        Update: {
          [key: string]: unknown;
        };
        Relationships: [];
      };
      downloads: {
        Row: {
          id: string;
          user_id: string;
          book_id: string;
          format: DigitalFormat;
          status: DownloadStatus;
          storage_path: string | null;
          file_size_bytes: number | null;
          download_count: number;
          max_downloads: number | null;
          expires_at: string | null;
          wifi_only: boolean;
          device_id: string | null;
          last_downloaded_at: string | null;
          completed_at: string | null;
          failure_reason: string | null;
          deleted_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          book_id: string;
          format: DigitalFormat;
          status?: DownloadStatus;
          wifi_only?: boolean;
          [key: string]: unknown;
        };
        Update: {
          [key: string]: unknown;
        };
        Relationships: [];
      };
      reading_progress: {
        Row: {
          id: string;
          user_id: string;
          book_id: string;
          chapter_id: string | null;
          format: DigitalFormat;
          current_page: number | null;
          current_chapter_number: number | null;
          progress_percent: number;
          total_pages: number | null;
          words_read: number;
          reading_time_seconds: number;
          is_completed: boolean;
          completed_at: string | null;
          last_read_at: string;
          device_info: Json;
          deleted_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          book_id: string;
          format?: DigitalFormat;
          progress_percent?: number;
          device_info?: Json;
          [key: string]: unknown;
        };
        Update: {
          [key: string]: unknown;
        };
        Relationships: [];
      };
      bookmarks: {
        Row: {
          id: string;
          user_id: string;
          book_id: string;
          chapter_id: string | null;
          label: string | null;
          page_number: number | null;
          position_percent: number | null;
          cfi_location: string | null;
          note: string | null;
          color: string | null;
          is_auto: boolean;
          deleted_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          book_id: string;
          is_auto?: boolean;
          [key: string]: unknown;
        };
        Update: {
          [key: string]: unknown;
        };
        Relationships: [];
      };
      notes: {
        Row: {
          id: string;
          user_id: string;
          book_id: string;
          chapter_id: string | null;
          title: string | null;
          content: string;
          page_number: number | null;
          position_percent: number | null;
          cfi_location: string | null;
          is_pinned: boolean;
          deleted_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          book_id: string;
          content: string;
          is_pinned?: boolean;
          [key: string]: unknown;
        };
        Update: {
          [key: string]: unknown;
        };
        Relationships: [];
      };
      highlights: {
        Row: {
          id: string;
          user_id: string;
          book_id: string;
          chapter_id: string | null;
          selected_text: string;
          note: string | null;
          color: string;
          page_number: number | null;
          position_start: number | null;
          position_end: number | null;
          cfi_range: string | null;
          deleted_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          book_id: string;
          selected_text: string;
          color?: string;
          [key: string]: unknown;
        };
        Update: {
          [key: string]: unknown;
        };
        Relationships: [];
      };
      user_settings: {
        Row: {
          id: string;
          user_id: string;
          appearance: Json;
          reading: Json;
          notifications: Json;
          language: Json;
          downloads: Json;
          privacy: Json;
          version: number;
          deleted_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          appearance?: Json;
          reading?: Json;
          notifications?: Json;
          language?: Json;
          downloads?: Json;
          privacy?: Json;
          version?: number;
          [key: string]: unknown;
        };
        Update: {
          [key: string]: unknown;
        };
        Relationships: [];
      };
      analytics_events: {
        Row: {
          id: string;
          user_id: string | null;
          session_id: string | null;
          event_type: AnalyticsEventType;
          event_name: string | null;
          book_id: string | null;
          chapter_id: string | null;
          page_path: string | null;
          properties: Json;
          device_type: string | null;
          user_agent: string | null;
          ip_hash: string | null;
          occurred_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          session_id?: string | null;
          event_type: AnalyticsEventType;
          event_name?: string | null;
          book_id?: string | null;
          chapter_id?: string | null;
          page_path?: string | null;
          properties?: Json;
          occurred_at?: string;
          created_at?: string;
          [key: string]: unknown;
        };
        Update: {
          [key: string]: unknown;
        };
        Relationships: [];
      };
      reader_profiles: {
        Row: {
          id: string;
          full_name: string | null;
          display_name: string | null;
          mobile: string | null;
          avatar: string | null;
          language: string | null;
          membership_status: string | null;
          joined_at: string | null;
          last_login: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          display_name?: string | null;
          [key: string]: unknown;
        };
        Update: {
          [key: string]: unknown;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      become_author: {
        Args: {
          p_display_name: string;
        };
        Returns: string;
      };
      apply_user_role_change: {
        Args: {
          p_target_user_id: string;
          p_role_name: string;
          p_action: string;
          p_reason?: string | null;
        };
        Returns: string;
      };
      count_active_super_admins: {
        Args: Record<string, never>;
        Returns: number;
      };
    };
    Enums: {
      book_workflow_status: BookWorkflowStatus;
      digital_format: DigitalFormat;
      order_status: OrderStatus;
      payment_status: PaymentStatus;
      membership_tier: MembershipTier;
      membership_status: MembershipStatus;
      notification_channel: NotificationChannel;
      notification_category: NotificationCategory;
      download_status: DownloadStatus;
      analytics_event_type: AnalyticsEventType;
    };
    CompositeTypes: Record<string, never>;
  };
}

export type PublicSchema = Database['public'];
export type TableName = keyof Database['public']['Tables'];

export type Tables<T extends TableName> = Database['public']['Tables'][T]['Row'];
export type TablesInsert<T extends TableName> = Database['public']['Tables'][T]['Insert'];
export type TablesUpdate<T extends TableName> = Database['public']['Tables'][T]['Update'];

export type Profile = Tables<'profiles'>;
export type Book = Tables<'books'>;
export type Category = Tables<'categories'>;
export type LibraryItem = Tables<'library'>;
export type WishlistItem = Tables<'wishlist'>;
export type Order = Tables<'orders'>;
export type Notification = Tables<'notifications'>;
export type UserSettings = Tables<'user_settings'>;
export type ReadingProgress = Tables<'reading_progress'>;
