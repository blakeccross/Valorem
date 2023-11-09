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
      catalog: {
        Row: {
          " SKU ": number | null
          " UOM ": string | null
          category: string | null
          client: string | null
          cost: number | null
          description: string | null
          id: string
          notes: string | null
          revenue: number | null
        }
        Insert: {
          " SKU "?: number | null
          " UOM "?: string | null
          category?: string | null
          client?: string | null
          cost?: number | null
          description?: string | null
          id?: string
          notes?: string | null
          revenue?: number | null
        }
        Update: {
          " SKU "?: number | null
          " UOM "?: string | null
          category?: string | null
          client?: string | null
          cost?: number | null
          description?: string | null
          id?: string
          notes?: string | null
          revenue?: number | null
        }
        Relationships: []
      }
      "catalog-pricing": {
        Row: {
          created_at: string
          homedepot_price: number | null
          id: number
          lowes_price: number | null
          sku: string | null
        }
        Insert: {
          created_at?: string
          homedepot_price?: number | null
          id?: number
          lowes_price?: number | null
          sku?: string | null
        }
        Update: {
          created_at?: string
          homedepot_price?: number | null
          id?: number
          lowes_price?: number | null
          sku?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {
          address: string | null
          created_at: string | null
          date_time: string | null
          id: number
          location: unknown | null
          name: string | null
          type: string | null
          user_id: number | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          date_time?: string | null
          id?: number
          location?: unknown | null
          name?: string | null
          type?: string | null
          user_id?: number | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          date_time?: string | null
          id?: number
          location?: unknown | null
          name?: string | null
          type?: string | null
          user_id?: number | null
        }
        Relationships: []
      }
      orders: {
        Row: {
          address: string | null
          change_order: boolean
          closed: string | null
          cost: number | null
          created_at: string | null
          delivered: string | null
          description: string | null
          fulfilled: string | null
          id: number
          installed: string | null
          location: unknown | null
          order_id: number
          processed: string | null
          project_name: string | null
          size: number | null
          start_date: string | null
          status: string | null
          trade: string | null
        }
        Insert: {
          address?: string | null
          change_order?: boolean
          closed?: string | null
          cost?: number | null
          created_at?: string | null
          delivered?: string | null
          description?: string | null
          fulfilled?: string | null
          id?: number
          installed?: string | null
          location?: unknown | null
          order_id?: number
          processed?: string | null
          project_name?: string | null
          size?: number | null
          start_date?: string | null
          status?: string | null
          trade?: string | null
        }
        Update: {
          address?: string | null
          change_order?: boolean
          closed?: string | null
          cost?: number | null
          created_at?: string | null
          delivered?: string | null
          description?: string | null
          fulfilled?: string | null
          id?: number
          installed?: string | null
          location?: unknown | null
          order_id?: number
          processed?: string | null
          project_name?: string | null
          size?: number | null
          start_date?: string | null
          status?: string | null
          trade?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          }
        ]
      }
      "product-confirm": {
        Row: {
          created_at: string
          event: number | null
          id: number
          name: string | null
          quantity: number | null
          status: string | null
        }
        Insert: {
          created_at?: string
          event?: number | null
          id?: number
          name?: string | null
          quantity?: number | null
          status?: string | null
        }
        Update: {
          created_at?: string
          event?: number | null
          id?: number
          name?: string | null
          quantity?: number | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product-confirm_event_fkey"
            columns: ["event"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          }
        ]
      }
      products: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          orderId: number | null
          price: number
          quantity: number
          size: number | null
          type: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          orderId?: number | null
          price: number
          quantity?: number
          size?: number | null
          type?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          orderId?: number | null
          price?: number
          quantity?: number
          size?: number | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_orderId_fkey"
            columns: ["orderId"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          role: Database["public"]["Enums"]["role_enum"]
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["role_enum"]
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["role_enum"]
        }
        Relationships: []
      }
      warranties: {
        Row: {
          contractor_id: string | null
          created_at: string
          id: number
          link: string | null
          name: string | null
          period: number | null
          product_id: number | null
          start_date: string | null
        }
        Insert: {
          contractor_id?: string | null
          created_at?: string
          id?: number
          link?: string | null
          name?: string | null
          period?: number | null
          product_id?: number | null
          start_date?: string | null
        }
        Update: {
          contractor_id?: string | null
          created_at?: string
          id?: number
          link?: string | null
          name?: string | null
          period?: number | null
          product_id?: number | null
          start_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "warranties_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "warranties_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      distance_from_location: {
        Args: {
          lat: number
          long: number
          event_id: number
        }
        Returns: {
          dist_meters: number
        }[]
      }
      get_order_by_id: {
        Args: {
          order_id: number
        }
        Returns: {
          id: number
          customer_id: number
          order_date: string
        }[]
      }
    }
    Enums: {
      role_enum: "contractor" | "client"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
