export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      haikus: {
        Row: {
          author_id: string | null
          body: string
          created_at: string
          id: number
          likes_total: number | null
        }
        Insert: {
          author_id?: string | null
          body?: string
          created_at?: string
          id?: number
          likes_total?: number | null
        }
        Update: {
          author_id?: string | null
          body?: string
          created_at?: string
          id?: number
          likes_total?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "haikus_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      hashtags: {
        Row: {
          created_at: string
          haiku_id: number
          hashtag: string
          id: number
        }
        Insert: {
          created_at?: string
          haiku_id: number
          hashtag: string
          id?: number
        }
        Update: {
          created_at?: string
          haiku_id?: number
          hashtag?: string
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "hashtags_haiku_id_fkey"
            columns: ["haiku_id"]
            isOneToOne: false
            referencedRelation: "haikus"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          status: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id: string
          status?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          status?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      user_emails: {
        Row: {
          email: string | null
        }
        Insert: {
          email?: string | null
        }
        Update: {
          email?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      increment_likes: {
        Args: {
          haiku_id: number
          likes_to_add: number
        }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
