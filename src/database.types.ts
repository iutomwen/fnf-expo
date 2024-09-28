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
      app_settings: {
        Row: {
          name: string | null
          value: string | null
        }
        Insert: {
          name?: string | null
          value?: string | null
        }
        Update: {
          name?: string | null
          value?: string | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          has_options: boolean | null
          icon: string | null
          id: number
          name: string
        }
        Insert: {
          created_at?: string
          has_options?: boolean | null
          icon?: string | null
          id?: number
          name: string
        }
        Update: {
          created_at?: string
          has_options?: boolean | null
          icon?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      cities: {
        Row: {
          created_at: string
          id: number
          name: string | null
          state_id: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          name?: string | null
          state_id?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          name?: string | null
          state_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "cities_state_id_fkey"
            columns: ["state_id"]
            isOneToOne: false
            referencedRelation: "states"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation: {
        Row: {
          buyer_id: string | null
          buyer_name: string | null
          created_at: string
          id: number
          last_message: string | null
          last_message_profile_id: string | null
          name: string | null
          product_id: number | null
          seller_id: string | null
          seller_name: string | null
          status: boolean | null
          updated_at: string | null
        }
        Insert: {
          buyer_id?: string | null
          buyer_name?: string | null
          created_at?: string
          id?: number
          last_message?: string | null
          last_message_profile_id?: string | null
          name?: string | null
          product_id?: number | null
          seller_id?: string | null
          seller_name?: string | null
          status?: boolean | null
          updated_at?: string | null
        }
        Update: {
          buyer_id?: string | null
          buyer_name?: string | null
          created_at?: string
          id?: number
          last_message?: string | null
          last_message_profile_id?: string | null
          name?: string | null
          product_id?: number | null
          seller_id?: string | null
          seller_name?: string | null
          status?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversation_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversation_last_message_profile_id_fkey"
            columns: ["last_message_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversation_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversation_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      countries: {
        Row: {
          created_at: string
          currency: string | null
          flag: string | null
          id: number
          name: string
        }
        Insert: {
          created_at?: string
          currency?: string | null
          flag?: string | null
          id?: number
          name: string
        }
        Update: {
          created_at?: string
          currency?: string | null
          flag?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          conversation_id: number | null
          created_at: string
          id: number
          message: string | null
          receiver_id: string | null
          sender_id: string | null
        }
        Insert: {
          conversation_id?: number | null
          created_at?: string
          id?: number
          message?: string | null
          receiver_id?: string | null
          sender_id?: string | null
        }
        Update: {
          conversation_id?: number | null
          created_at?: string
          id?: number
          message?: string | null
          receiver_id?: string | null
          sender_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversation"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payment: {
        Row: {
          amount: number | null
          created_at: string
          id: number
          meta_data: Json | null
          payment_type: string | null
          profile_id: string | null
          provider: string | null
          status: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string
          id?: number
          meta_data?: Json | null
          payment_type?: string | null
          profile_id?: string | null
          provider?: string | null
          status?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string
          id?: number
          meta_data?: Json | null
          payment_type?: string | null
          profile_id?: string | null
          provider?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      product_images: {
        Row: {
          created_at: string
          id: number
          image_url: string | null
          product_id: number | null
          uploaded: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          image_url?: string | null
          product_id?: number | null
          uploaded?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          image_url?: string | null
          product_id?: number | null
          uploaded?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_likes: {
        Row: {
          created_at: string
          id: number
          product_id: number | null
          profile_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          product_id?: number | null
          profile_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          product_id?: number | null
          profile_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_likes_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_likes_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      product_reviews: {
        Row: {
          created_at: string
          id: number
          product_id: number | null
          profile_id: string | null
          rating: string | null
          review: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          product_id?: number | null
          profile_id?: string | null
          rating?: string | null
          review?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          product_id?: number | null
          profile_id?: string | null
          rating?: string | null
          review?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_reviews_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      product_views: {
        Row: {
          created_at: string
          id: number
          product_id: number | null
          profile_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          product_id?: number | null
          profile_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          product_id?: number | null
          profile_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_views_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_views_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category_id: number | null
          city_id: number | null
          country_id: number | null
          created_at: string
          delivery_type: string | null
          description: string | null
          id: number
          is_deleted: boolean | null
          is_promoted: boolean | null
          likes: number | null
          name: string | null
          price: number | null
          price_bargain: boolean | null
          product_views: number | null
          state_id: number | null
          status: string | null
          stock: number | null
          store_id: number | null
          sub_category_id: number | null
        }
        Insert: {
          category_id?: number | null
          city_id?: number | null
          country_id?: number | null
          created_at?: string
          delivery_type?: string | null
          description?: string | null
          id?: number
          is_deleted?: boolean | null
          is_promoted?: boolean | null
          likes?: number | null
          name?: string | null
          price?: number | null
          price_bargain?: boolean | null
          product_views?: number | null
          state_id?: number | null
          status?: string | null
          stock?: number | null
          store_id?: number | null
          sub_category_id?: number | null
        }
        Update: {
          category_id?: number | null
          city_id?: number | null
          country_id?: number | null
          created_at?: string
          delivery_type?: string | null
          description?: string | null
          id?: number
          is_deleted?: boolean | null
          is_promoted?: boolean | null
          likes?: number | null
          name?: string | null
          price?: number | null
          price_bargain?: boolean | null
          product_views?: number | null
          state_id?: number | null
          status?: string | null
          stock?: number | null
          store_id?: number | null
          sub_category_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_state_id_fkey"
            columns: ["state_id"]
            isOneToOne: false
            referencedRelation: "states"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_sub_category_id_fkey"
            columns: ["sub_category_id"]
            isOneToOne: false
            referencedRelation: "sub_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          account_type: string | null
          address: string | null
          avatar_url: string | null
          bio: string | null
          city_id: number | null
          country_id: number | null
          created_at: string | null
          disabled: boolean
          first_name: string | null
          gender: string | null
          id: string
          last_name: string | null
          phone: string | null
          role: string | null
          state_id: number | null
          status: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          account_type?: string | null
          address?: string | null
          avatar_url?: string | null
          bio?: string | null
          city_id?: number | null
          country_id?: number | null
          created_at?: string | null
          disabled?: boolean
          first_name?: string | null
          gender?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          role?: string | null
          state_id?: number | null
          status?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          account_type?: string | null
          address?: string | null
          avatar_url?: string | null
          bio?: string | null
          city_id?: number | null
          country_id?: number | null
          created_at?: string | null
          disabled?: boolean
          first_name?: string | null
          gender?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          role?: string | null
          state_id?: number | null
          status?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_state_id_fkey"
            columns: ["state_id"]
            isOneToOne: false
            referencedRelation: "states"
            referencedColumns: ["id"]
          },
        ]
      }
      report_bugs: {
        Row: {
          created_at: string
          description: string | null
          id: number
          profile_id: string | null
          status: boolean | null
          title: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          profile_id?: string | null
          status?: boolean | null
          title?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          profile_id?: string | null
          status?: boolean | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "report_bugs_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      report_list: {
        Row: {
          created_at: string
          id: number
          name: string
          report_id: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          report_id?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          report_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "report_list_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
      report_tickets: {
        Row: {
          created_at: string
          description: string | null
          id: number
          product_id: number | null
          profile_id: string | null
          report_item_id: number | null
          report_type: string | null
          reported_by_id: string | null
          status: boolean | null
          store_id: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          product_id?: number | null
          profile_id?: string | null
          report_item_id?: number | null
          report_type?: string | null
          reported_by_id?: string | null
          status?: boolean | null
          store_id?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          product_id?: number | null
          profile_id?: string | null
          report_item_id?: number | null
          report_type?: string | null
          reported_by_id?: string | null
          status?: boolean | null
          store_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "report_tickets_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_tickets_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_tickets_report_item_id_fkey"
            columns: ["report_item_id"]
            isOneToOne: false
            referencedRelation: "report_list"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_tickets_reported_by_id_fkey"
            columns: ["reported_by_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_tickets_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          created_at: string
          id: number
          name: string | null
          type: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          name?: string | null
          type?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          name?: string | null
          type?: string | null
        }
        Relationships: []
      }
      states: {
        Row: {
          country_id: number
          created_at: string
          id: number
          name: string
        }
        Insert: {
          country_id: number
          created_at?: string
          id?: number
          name: string
        }
        Update: {
          country_id?: number
          created_at?: string
          id?: number
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "states_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
        ]
      }
      store_likes: {
        Row: {
          created_at: string
          id: number
          profile_id: string | null
          store_id: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          profile_id?: string | null
          store_id?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          profile_id?: string | null
          store_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "store_likes_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "store_likes_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      stores: {
        Row: {
          address: string | null
          business_number: string | null
          city_id: number | null
          country_id: number | null
          created_at: string
          description: string | null
          email: string | null
          id: number
          likes: number | null
          logo: string | null
          name: string
          phone: string | null
          profile_id: string | null
          state_id: number | null
          status: boolean | null
          subscription_history_id: number | null
        }
        Insert: {
          address?: string | null
          business_number?: string | null
          city_id?: number | null
          country_id?: number | null
          created_at?: string
          description?: string | null
          email?: string | null
          id?: number
          likes?: number | null
          logo?: string | null
          name: string
          phone?: string | null
          profile_id?: string | null
          state_id?: number | null
          status?: boolean | null
          subscription_history_id?: number | null
        }
        Update: {
          address?: string | null
          business_number?: string | null
          city_id?: number | null
          country_id?: number | null
          created_at?: string
          description?: string | null
          email?: string | null
          id?: number
          likes?: number | null
          logo?: string | null
          name?: string
          phone?: string | null
          profile_id?: string | null
          state_id?: number | null
          status?: boolean | null
          subscription_history_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "stores_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stores_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stores_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stores_state_id_fkey"
            columns: ["state_id"]
            isOneToOne: false
            referencedRelation: "states"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stores_subscription_history_id_fkey"
            columns: ["subscription_history_id"]
            isOneToOne: false
            referencedRelation: "subscription_history"
            referencedColumns: ["id"]
          },
        ]
      }
      sub_categories: {
        Row: {
          category_id: number
          created_at: string
          icon: string | null
          id: number
          name: string
        }
        Insert: {
          category_id: number
          created_at?: string
          icon?: string | null
          id?: number
          name: string
        }
        Update: {
          category_id?: number
          created_at?: string
          icon?: string | null
          id?: number
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "sub_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      subcriptions: {
        Row: {
          allowed_products: number | null
          amount: number
          created_at: string
          description: string | null
          duration: number | null
          id: number
          meta_data: Json | null
          name: string
        }
        Insert: {
          allowed_products?: number | null
          amount: number
          created_at?: string
          description?: string | null
          duration?: number | null
          id?: number
          meta_data?: Json | null
          name: string
        }
        Update: {
          allowed_products?: number | null
          amount?: number
          created_at?: string
          description?: string | null
          duration?: number | null
          id?: number
          meta_data?: Json | null
          name?: string
        }
        Relationships: []
      }
      subscription_history: {
        Row: {
          created_at: string
          end_date: string | null
          id: number
          payment_id: number | null
          start_date: string | null
          status: boolean | null
          store_id: number | null
          subscription_id: number | null
        }
        Insert: {
          created_at?: string
          end_date?: string | null
          id?: number
          payment_id?: number | null
          start_date?: string | null
          status?: boolean | null
          store_id?: number | null
          subscription_id?: number | null
        }
        Update: {
          created_at?: string
          end_date?: string | null
          id?: number
          payment_id?: number | null
          start_date?: string | null
          status?: boolean | null
          store_id?: number | null
          subscription_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "subscription_history_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscription_history_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscription_history_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subcriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      tailors: {
        Row: {
          address: string | null
          age: string | null
          areaOfSpecial: string | null
          city: number | null
          country: number | null
          created_at: string
          description: string | null
          details: string | null
          experience: string | null
          id: number
          name: string | null
          phone: string | null
          profile_id: string | null
          state: number | null
        }
        Insert: {
          address?: string | null
          age?: string | null
          areaOfSpecial?: string | null
          city?: number | null
          country?: number | null
          created_at?: string
          description?: string | null
          details?: string | null
          experience?: string | null
          id?: number
          name?: string | null
          phone?: string | null
          profile_id?: string | null
          state?: number | null
        }
        Update: {
          address?: string | null
          age?: string | null
          areaOfSpecial?: string | null
          city?: number | null
          country?: number | null
          created_at?: string
          description?: string | null
          details?: string | null
          experience?: string | null
          id?: number
          name?: string | null
          phone?: string | null
          profile_id?: string | null
          state?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "tailors_city_fkey"
            columns: ["city"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tailors_country_fkey"
            columns: ["country"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tailors_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tailors_state_fkey"
            columns: ["state"]
            isOneToOne: false
            referencedRelation: "states"
            referencedColumns: ["id"]
          },
        ]
      }
      tickets: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: number
          is_replied: boolean | null
          message: string | null
          profile_id: string | null
          status: boolean | null
          subject: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: number
          is_replied?: boolean | null
          message?: string | null
          profile_id?: string | null
          status?: boolean | null
          subject?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: number
          is_replied?: boolean | null
          message?: string | null
          profile_id?: string | null
          status?: boolean | null
          subject?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tickets_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      username_exists: {
        Args: {
          p_username: string
        }
        Returns: boolean
      }
      verify_user_password: {
        Args: {
          password: string
        }
        Returns: boolean
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
