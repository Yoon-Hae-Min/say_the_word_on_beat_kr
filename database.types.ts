export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
	public: {
		Tables: {
			challenges: {
				Row: {
					created_at: string;
					creator_id: string | null;
					difficulty_easy: number | null;
					difficulty_hard: number | null;
					difficulty_normal: number | null;
					game_config: Database["public"]["CompositeTypes"]["game_config_struct"][];
					id: string;
					is_public: boolean;
					show_names: boolean;
					thumbnail_url: string | null;
					title: string;
					view_count: number;
				};
				Insert: {
					created_at?: string;
					creator_id?: string | null;
					difficulty_easy?: number | null;
					difficulty_hard?: number | null;
					difficulty_normal?: number | null;
					game_config: Database["public"]["CompositeTypes"]["game_config_struct"][];
					id?: string;
					is_public?: boolean;
					show_names?: boolean;
					thumbnail_url?: string | null;
					title: string;
					view_count?: number;
				};
				Update: {
					created_at?: string;
					creator_id?: string | null;
					difficulty_easy?: number | null;
					difficulty_hard?: number | null;
					difficulty_normal?: number | null;
					game_config?: Database["public"]["CompositeTypes"]["game_config_struct"][];
					id?: string;
					is_public?: boolean;
					show_names?: boolean;
					thumbnail_url?: string | null;
					title?: string;
					view_count?: number;
				};
				Relationships: [];
			};
			difficulty_votes: {
				Row: {
					challenge_id: string;
					created_at: string | null;
					difficulty_level: string;
					fingerprint: string;
					id: string;
				};
				Insert: {
					challenge_id: string;
					created_at?: string | null;
					difficulty_level: string;
					fingerprint: string;
					id?: string;
				};
				Update: {
					challenge_id?: string;
					created_at?: string | null;
					difficulty_level?: string;
					fingerprint?: string;
					id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "difficulty_votes_challenge_id_fkey";
						columns: ["challenge_id"];
						isOneToOne: false;
						referencedRelation: "challenges";
						referencedColumns: ["id"];
					},
				];
			};
		};
		Views: {
			creator_stats: {
				Row: {
					creator_id: string | null;
					first_created_at: string | null;
					last_created_at: string | null;
					private_challenges: number | null;
					public_challenges: number | null;
					total_challenges: number | null;
					total_views: number | null;
				};
				Relationships: [];
			};
		};
		Functions: {
			delete_old_private_challenges: { Args: never; Returns: undefined };
			increment_view_count: { Args: { row_id: string }; Returns: undefined };
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			beat_slot: {
				imagePath: string | null;
				displayText: string | null;
			};
			game_config_struct: {
				roundIndex: number | null;
				slots: Database["public"]["CompositeTypes"]["beat_slot"][] | null;
			};
		};
	};
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
	DefaultSchemaTableNameOrOptions extends
		| keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
		| { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
				DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
		: never = never,
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
			DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
			Row: infer R;
		}
		? R
		: never
	: DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
		? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
				Row: infer R;
			}
			? R
			: never
		: never;

export type TablesInsert<
	DefaultSchemaTableNameOrOptions extends
		| keyof DefaultSchema["Tables"]
		| { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
		: never = never,
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Insert: infer I;
		}
		? I
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
		? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
				Insert: infer I;
			}
			? I
			: never
		: never;

export type TablesUpdate<
	DefaultSchemaTableNameOrOptions extends
		| keyof DefaultSchema["Tables"]
		| { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
		: never = never,
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Update: infer U;
		}
		? U
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
		? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
				Update: infer U;
			}
			? U
			: never
		: never;

export type Enums<
	DefaultSchemaEnumNameOrOptions extends
		| keyof DefaultSchema["Enums"]
		| { schema: keyof DatabaseWithoutInternals },
	EnumName extends DefaultSchemaEnumNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
		: never = never,
> = DefaultSchemaEnumNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
	: DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
		? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
		: never;

export type CompositeTypes<
	PublicCompositeTypeNameOrOptions extends
		| keyof DefaultSchema["CompositeTypes"]
		| { schema: keyof DatabaseWithoutInternals },
	CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
		: never = never,
> = PublicCompositeTypeNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
	: PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
		? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
		: never;

export const Constants = {
	public: {
		Enums: {},
	},
} as const;
