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
      assignments: {
        Row: {
          assigned_at: string
          completed_at: string | null
          disaster_id: string
          id: string
          notes: string
          started_at: string | null
          status: Database["public"]["Enums"]["assignment_status"]
          team_id: string
        }
        Insert: {
          assigned_at?: string
          completed_at?: string | null
          disaster_id: string
          id?: string
          notes?: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["assignment_status"]
          team_id: string
        }
        Update: {
          assigned_at?: string
          completed_at?: string | null
          disaster_id?: string
          id?: string
          notes?: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["assignment_status"]
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "assignments_disaster_id_fkey"
            columns: ["disaster_id"]
            isOneToOne: false
            referencedRelation: "disasters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assignments_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      disasters: {
        Row: {
          created_at: string
          created_by: string | null
          description: string
          id: string
          lat: number
          lng: number
          location_label: string
          severity: Database["public"]["Enums"]["disaster_severity"]
          status: Database["public"]["Enums"]["disaster_status"]
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string
          id?: string
          lat: number
          lng: number
          location_label?: string
          severity?: Database["public"]["Enums"]["disaster_severity"]
          status?: Database["public"]["Enums"]["disaster_status"]
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string
          id?: string
          lat?: number
          lng?: number
          location_label?: string
          severity?: Database["public"]["Enums"]["disaster_severity"]
          status?: Database["public"]["Enums"]["disaster_status"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          body: string
          created_at: string
          id: string
          is_broadcast: boolean
          recipient_id: string | null
          sender_id: string
          team_id: string | null
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          is_broadcast?: boolean
          recipient_id?: string | null
          sender_id: string
          team_id?: string | null
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          is_broadcast?: boolean
          recipient_id?: string | null
          sender_id?: string
          team_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string
          created_at: string
          id: string
          read: boolean
          title: string
          user_id: string
        }
        Insert: {
          body?: string
          created_at?: string
          id?: string
          read?: boolean
          title: string
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          read?: boolean
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          id: string
          name: string
          role: Database["public"]["Enums"]["app_role"]
          team_id: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id: string
          name?: string
          role?: Database["public"]["Enums"]["app_role"]
          team_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          role?: Database["public"]["Enums"]["app_role"]
          team_id?: string | null
        }
        Relationships: []
      }
      resources: {
        Row: {
          created_at: string
          id: string
          lat: number
          lng: number
          location_label: string
          quantity: number
          type: string
        }
        Insert: {
          created_at?: string
          id?: string
          lat?: number
          lng?: number
          location_label?: string
          quantity?: number
          type: string
        }
        Update: {
          created_at?: string
          id?: string
          lat?: number
          lng?: number
          location_label?: string
          quantity?: number
          type?: string
        }
        Relationships: []
      }
      teams: {
        Row: {
          availability_status: Database["public"]["Enums"]["availability_status"]
          created_at: string
          id: string
          lat: number
          lng: number
          location_label: string
          name: string
          type: Database["public"]["Enums"]["team_type"]
          workload: number
        }
        Insert: {
          availability_status?: Database["public"]["Enums"]["availability_status"]
          created_at?: string
          id?: string
          lat?: number
          lng?: number
          location_label?: string
          name: string
          type: Database["public"]["Enums"]["team_type"]
          workload?: number
        }
        Update: {
          availability_status?: Database["public"]["Enums"]["availability_status"]
          created_at?: string
          id?: string
          lat?: number
          lng?: number
          location_label?: string
          name?: string
          type?: Database["public"]["Enums"]["team_type"]
          workload?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      current_team_id: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "ngo" | "government"
      assignment_status: "assigned" | "started" | "completed"
      availability_status: "available" | "busy" | "offline"
      disaster_severity: "low" | "medium" | "high" | "critical"
      disaster_status: "pending" | "in_progress" | "completed"
      team_type: "ngo" | "government"
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
    Enums: {
      app_role: ["admin", "ngo", "government"],
      assignment_status: ["assigned", "started", "completed"],
      availability_status: ["available", "busy", "offline"],
      disaster_severity: ["low", "medium", "high", "critical"],
      disaster_status: ["pending", "in_progress", "completed"],
      team_type: ["ngo", "government"],
    },
  },
} as const
