export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      cms_blog_posts: {
        Row: {
          author: string | null
          content: string | null
          created_at: string
          excerpt: string | null
          id: string
          image: string | null
          is_published: boolean
          published_at: string | null
          slug: string
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          author?: string | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          image?: string | null
          is_published?: boolean
          published_at?: string | null
          slug: string
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          author?: string | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          image?: string | null
          is_published?: boolean
          published_at?: string | null
          slug?: string
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      cms_events: {
        Row: {
          capacity: number | null
          created_at: string
          description: string | null
          event_date: string | null
          id: string
          image: string | null
          is_published: boolean
          location: string | null
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          capacity?: number | null
          created_at?: string
          description?: string | null
          event_date?: string | null
          id?: string
          image?: string | null
          is_published?: boolean
          location?: string | null
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          capacity?: number | null
          created_at?: string
          description?: string | null
          event_date?: string | null
          id?: string
          image?: string | null
          is_published?: boolean
          location?: string | null
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      cms_faqs: {
        Row: {
          answer: string
          category: string | null
          created_at: string
          id: string
          question: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          answer: string
          category?: string | null
          created_at?: string
          id?: string
          question: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          answer?: string
          category?: string | null
          created_at?: string
          id?: string
          question?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      cms_gallery: {
        Row: {
          caption: string | null
          category: string | null
          created_at: string
          id: string
          image: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          caption?: string | null
          category?: string | null
          created_at?: string
          id?: string
          image: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          caption?: string | null
          category?: string | null
          created_at?: string
          id?: string
          image?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      cms_hero: {
        Row: {
          background_image: string | null
          created_at: string
          cta_link: string
          cta_text: string
          headline: string
          id: string
          section_key: string
          subtitle: string
          updated_at: string
        }
        Insert: {
          background_image?: string | null
          created_at?: string
          cta_link?: string
          cta_text?: string
          headline?: string
          id?: string
          section_key?: string
          subtitle?: string
          updated_at?: string
        }
        Update: {
          background_image?: string | null
          created_at?: string
          cta_link?: string
          cta_text?: string
          headline?: string
          id?: string
          section_key?: string
          subtitle?: string
          updated_at?: string
        }
        Relationships: []
      }
      cms_impact_zones: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          is_published: boolean
          metric: string | null
          name: string
          position_x: number
          position_y: number
          sort_order: number
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_published?: boolean
          metric?: string | null
          name: string
          position_x?: number
          position_y?: number
          sort_order?: number
          type?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_published?: boolean
          metric?: string | null
          name?: string
          position_x?: number
          position_y?: number
          sort_order?: number
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      cms_initiatives: {
        Row: {
          created_at: string
          description: string
          icon: string | null
          id: string
          image: string | null
          link: string | null
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          icon?: string | null
          id?: string
          image?: string | null
          link?: string | null
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          icon?: string | null
          id?: string
          image?: string | null
          link?: string | null
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      cms_partners: {
        Row: {
          created_at: string
          id: string
          logo: string | null
          name: string
          sort_order: number
          updated_at: string
          website: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          logo?: string | null
          name: string
          sort_order?: number
          updated_at?: string
          website?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          logo?: string | null
          name?: string
          sort_order?: number
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      cms_payment_config: {
        Row: {
          bank_account_number: string | null
          bank_branch: string | null
          bank_ifsc: string | null
          bank_name: string | null
          created_at: string
          currency: string
          id: string
          max_donation: number
          min_donation: number
          razorpay_enabled: boolean
          razorpay_key_id: string | null
          receipt_prefix: string
          tax_deduction_percentage: number
          updated_at: string
          upi_id: string | null
        }
        Insert: {
          bank_account_number?: string | null
          bank_branch?: string | null
          bank_ifsc?: string | null
          bank_name?: string | null
          created_at?: string
          currency?: string
          id?: string
          max_donation?: number
          min_donation?: number
          razorpay_enabled?: boolean
          razorpay_key_id?: string | null
          receipt_prefix?: string
          tax_deduction_percentage?: number
          updated_at?: string
          upi_id?: string | null
        }
        Update: {
          bank_account_number?: string | null
          bank_branch?: string | null
          bank_ifsc?: string | null
          bank_name?: string | null
          created_at?: string
          currency?: string
          id?: string
          max_donation?: number
          min_donation?: number
          razorpay_enabled?: boolean
          razorpay_key_id?: string | null
          receipt_prefix?: string
          tax_deduction_percentage?: number
          updated_at?: string
          upi_id?: string | null
        }
        Relationships: []
      }
      cms_resources: {
        Row: {
          category: string | null
          color: string | null
          created_at: string
          description: string | null
          file_size: string | null
          file_type: string | null
          file_url: string | null
          id: string
          sort_order: number
          title: string
          updated_at: string
          year: string | null
        }
        Insert: {
          category?: string | null
          color?: string | null
          created_at?: string
          description?: string | null
          file_size?: string | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          sort_order?: number
          title: string
          updated_at?: string
          year?: string | null
        }
        Update: {
          category?: string | null
          color?: string | null
          created_at?: string
          description?: string | null
          file_size?: string | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          sort_order?: number
          title?: string
          updated_at?: string
          year?: string | null
        }
        Relationships: []
      }
      cms_sections: {
        Row: {
          content: Json
          created_at: string
          id: string
          section_key: string
          updated_at: string
        }
        Insert: {
          content?: Json
          created_at?: string
          id?: string
          section_key: string
          updated_at?: string
        }
        Update: {
          content?: Json
          created_at?: string
          id?: string
          section_key?: string
          updated_at?: string
        }
        Relationships: []
      }
      cms_site_settings: {
        Row: {
          announcement_active: boolean
          announcement_text: string | null
          contact_address: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          footer_tagline: string | null
          id: string
          site_name: string
          social_facebook: string | null
          social_instagram: string | null
          social_linkedin: string | null
          social_twitter: string | null
          social_youtube: string | null
          updated_at: string
        }
        Insert: {
          announcement_active?: boolean
          announcement_text?: string | null
          contact_address?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          footer_tagline?: string | null
          id?: string
          site_name?: string
          social_facebook?: string | null
          social_instagram?: string | null
          social_linkedin?: string | null
          social_twitter?: string | null
          social_youtube?: string | null
          updated_at?: string
        }
        Update: {
          announcement_active?: boolean
          announcement_text?: string | null
          contact_address?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          footer_tagline?: string | null
          id?: string
          site_name?: string
          social_facebook?: string | null
          social_instagram?: string | null
          social_linkedin?: string | null
          social_twitter?: string | null
          social_youtube?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      cms_stats: {
        Row: {
          created_at: string
          icon: string | null
          id: string
          label: string
          sort_order: number
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          icon?: string | null
          id?: string
          label: string
          sort_order?: number
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          icon?: string | null
          id?: string
          label?: string
          sort_order?: number
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      cms_stories: {
        Row: {
          category: string | null
          content: string | null
          created_at: string
          excerpt: string | null
          id: string
          image: string | null
          is_published: boolean
          published_at: string | null
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          image?: string | null
          is_published?: boolean
          published_at?: string | null
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          image?: string | null
          is_published?: boolean
          published_at?: string | null
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      cms_team: {
        Row: {
          bio: string | null
          created_at: string
          id: string
          image: string | null
          name: string
          role: string | null
          sort_order: number
          updated_at: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          id?: string
          image?: string | null
          name: string
          role?: string | null
          sort_order?: number
          updated_at?: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          id?: string
          image?: string | null
          name?: string
          role?: string | null
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      cms_testimonials: {
        Row: {
          avatar: string | null
          created_at: string
          id: string
          name: string
          quote: string
          role: string | null
          sort_order: number
          updated_at: string
        }
        Insert: {
          avatar?: string | null
          created_at?: string
          id?: string
          name: string
          quote: string
          role?: string | null
          sort_order?: number
          updated_at?: string
        }
        Update: {
          avatar?: string | null
          created_at?: string
          id?: string
          name?: string
          quote?: string
          role?: string | null
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      donations: {
        Row: {
          amount_cents: number
          cause: string
          created_at: string
          currency: string
          donor_email: string
          donor_name: string
          donor_phone: string | null
          gift_message: string | null
          gift_recipient_email: string | null
          gift_recipient_name: string | null
          id: string
          is_gift: boolean | null
          metadata: Json | null
          show_on_wall: boolean | null
          status: string
          stripe_payment_intent: string | null
          stripe_session_id: string | null
          updated_at: string
        }
        Insert: {
          amount_cents: number
          cause: string
          created_at?: string
          currency?: string
          donor_email: string
          donor_name: string
          donor_phone?: string | null
          gift_message?: string | null
          gift_recipient_email?: string | null
          gift_recipient_name?: string | null
          id?: string
          is_gift?: boolean | null
          metadata?: Json | null
          show_on_wall?: boolean | null
          status?: string
          stripe_payment_intent?: string | null
          stripe_session_id?: string | null
          updated_at?: string
        }
        Update: {
          amount_cents?: number
          cause?: string
          created_at?: string
          currency?: string
          donor_email?: string
          donor_name?: string
          donor_phone?: string | null
          gift_message?: string | null
          gift_recipient_email?: string | null
          gift_recipient_name?: string | null
          id?: string
          is_gift?: boolean | null
          metadata?: Json | null
          show_on_wall?: boolean | null
          status?: string
          stripe_payment_intent?: string | null
          stripe_session_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      goldenage_registrations: {
        Row: {
          amount_cents: number
          created_at: string
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          id: string
          medical_condition: string | null
          parent_address: string | null
          parent_age: number | null
          parent_name: string
          registrant_city: string | null
          registrant_email: string
          registrant_name: string
          registrant_phone: string
          registration_ref: string
          relation: string | null
          status: string
          stripe_payment_intent: string | null
          stripe_session_id: string | null
          updated_at: string
        }
        Insert: {
          amount_cents?: number
          created_at?: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          id?: string
          medical_condition?: string | null
          parent_address?: string | null
          parent_age?: number | null
          parent_name: string
          registrant_city?: string | null
          registrant_email: string
          registrant_name: string
          registrant_phone: string
          registration_ref?: string
          relation?: string | null
          status?: string
          stripe_payment_intent?: string | null
          stripe_session_id?: string | null
          updated_at?: string
        }
        Update: {
          amount_cents?: number
          created_at?: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          id?: string
          medical_condition?: string | null
          parent_address?: string | null
          parent_age?: number | null
          parent_name?: string
          registrant_city?: string | null
          registrant_email?: string
          registrant_name?: string
          registrant_phone?: string
          registration_ref?: string
          relation?: string | null
          status?: string
          stripe_payment_intent?: string | null
          stripe_session_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      newsletter_subscriptions: {
        Row: {
          created_at: string
          email: string
          id: string
          is_active: boolean
          name: string | null
          source: string | null
          subscribed_at: string
          unsubscribed_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_active?: boolean
          name?: string | null
          source?: string | null
          subscribed_at?: string
          unsubscribed_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean
          name?: string | null
          source?: string | null
          subscribed_at?: string
          unsubscribed_at?: string | null
        }
        Relationships: []
      }
      support_applications: {
        Row: {
          admin_notes: string | null
          applicant_name: string
          application_ref: string
          created_at: string
          email: string
          form_data: Json
          id: string
          phone: string
          status: string
          type: string
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          applicant_name: string
          application_ref?: string
          created_at?: string
          email: string
          form_data?: Json
          id?: string
          phone: string
          status?: string
          type: string
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          applicant_name?: string
          application_ref?: string
          created_at?: string
          email?: string
          form_data?: Json
          id?: string
          phone?: string
          status?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
