export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      domain_feedback: {
        Row: {
          bad_logo_url: string | null
          created_at: string | null
          domain: string
          feedback: Database["public"]["Enums"]["feedback_type"] | null
          feedback_notes: string | null
          good_logo_url: string | null
          good_selector: string | null
          id: string
        }
        Insert: {
          bad_logo_url?: string | null
          created_at?: string | null
          domain: string
          feedback?: Database["public"]["Enums"]["feedback_type"] | null
          feedback_notes?: string | null
          good_logo_url?: string | null
          good_selector?: string | null
          id?: string
        }
        Update: {
          bad_logo_url?: string | null
          created_at?: string | null
          domain?: string
          feedback?: Database["public"]["Enums"]["feedback_type"] | null
          feedback_notes?: string | null
          good_logo_url?: string | null
          good_selector?: string | null
          id?: string
        }
        Relationships: []
      }
      idea_stages: {
        Row: {
          created_at: string
          id: string
          name: string
          order: number
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          order?: number
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          order?: number
          user_id?: string | null
        }
        Relationships: []
      }
      idea_tags: {
        Row: {
          color: string | null
          created_at: string
          id: string
          name: string
          user_id: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string
          id?: string
          name: string
          user_id?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string
          id?: string
          name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      ideas: {
        Row: {
          content: Json | null
          created_at: string
          id: string
          stage_id: string | null
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          content?: Json | null
          created_at?: string
          id?: string
          stage_id?: string | null
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          content?: Json | null
          created_at?: string
          id?: string
          stage_id?: string | null
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ideas_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "idea_stages"
            referencedColumns: ["id"]
          },
        ]
      }
      ideas_idea_tags: {
        Row: {
          idea_id: string
          tag_id: string
          user_id: string | null
        }
        Insert: {
          idea_id: string
          tag_id: string
          user_id?: string | null
        }
        Update: {
          idea_id?: string
          tag_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ideas_idea_tags_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "ideas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ideas_idea_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "idea_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      imports: {
        Row: {
          concurrency: number | null
          created_at: string
          file_path: string | null
          id: string
          name: string
          original_filename: string | null
          processed_sites: number | null
          retries: number | null
          status: string
          timeout: number | null
          total_sites: number | null
        }
        Insert: {
          concurrency?: number | null
          created_at?: string
          file_path?: string | null
          id?: string
          name: string
          original_filename?: string | null
          processed_sites?: number | null
          retries?: number | null
          status: string
          timeout?: number | null
          total_sites?: number | null
        }
        Update: {
          concurrency?: number | null
          created_at?: string
          file_path?: string | null
          id?: string
          name?: string
          original_filename?: string | null
          processed_sites?: number | null
          retries?: number | null
          status?: string
          timeout?: number | null
          total_sites?: number | null
        }
        Relationships: []
      }
      scraped_sites: {
        Row: {
          created_at: string
          id: string
          import_id: string | null
          logo_url: string | null
          original_row_data: Json | null
          site_url: string
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          import_id?: string | null
          logo_url?: string | null
          original_row_data?: Json | null
          site_url: string
          status: string
        }
        Update: {
          created_at?: string
          id?: string
          import_id?: string | null
          logo_url?: string | null
          original_row_data?: Json | null
          site_url?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "scraped_sites_import_id_fkey"
            columns: ["import_id"]
            isOneToOne: false
            referencedRelation: "imports"
            referencedColumns: ["id"]
          },
        ]
      }
      sites: {
        Row: {
          created_at: string | null
          feedback: Database["public"]["Enums"]["feedback_type"] | null
          feedback_notes: string | null
          id: string
          import_id: string | null
          logo_url: string | null
          status: string
          website_url: string
        }
        Insert: {
          created_at?: string | null
          feedback?: Database["public"]["Enums"]["feedback_type"] | null
          feedback_notes?: string | null
          id?: string
          import_id?: string | null
          logo_url?: string | null
          status: string
          website_url: string
        }
        Update: {
          created_at?: string | null
          feedback?: Database["public"]["Enums"]["feedback_type"] | null
          feedback_notes?: string | null
          id?: string
          import_id?: string | null
          logo_url?: string | null
          status?: string
          website_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "sites_import_id_fkey"
            columns: ["import_id"]
            isOneToOne: false
            referencedRelation: "imports"
            referencedColumns: ["id"]
          },
        ]
      }
      user_videos: {
        Row: {
          channel_name: string
          created_at: string | null
          duration: string
          id: string
          thumbnail_url: string
          title: string
          user_id: string
          video_id: string
        }
        Insert: {
          channel_name: string
          created_at?: string | null
          duration: string
          id?: string
          thumbnail_url: string
          title: string
          user_id: string
          video_id: string
        }
        Update: {
          channel_name?: string
          created_at?: string | null
          duration?: string
          id?: string
          thumbnail_url?: string
          title?: string
          user_id?: string
          video_id?: string
        }
        Relationships: []
      }
      videos: {
        Row: {
          channel: string | null
          channel_url: string | null
          created_at: string | null
          description: string | null
          id: string
          thumbnail: string | null
          title: string
          transcript: string | null
          updated_at: string | null
          url: string
        }
        Insert: {
          channel?: string | null
          channel_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          thumbnail?: string | null
          title: string
          transcript?: string | null
          updated_at?: string | null
          url: string
        }
        Update: {
          channel?: string | null
          channel_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          thumbnail?: string | null
          title?: string
          transcript?: string | null
          updated_at?: string | null
          url?: string
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
      feedback_type:
        | "wrong_image"
        | "not_logo"
        | "low_quality"
        | "no_logo_found"
        | "other"
        | "no_logo"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      feedback_type: [
        "wrong_image",
        "not_logo",
        "low_quality",
        "no_logo_found",
        "other",
        "no_logo",
      ],
    },
  },
} as const
