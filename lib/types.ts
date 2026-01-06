export type AgentStatus = 'ready' | 'busy' | 'error';

export interface Agent {
  name: string;
  display_name: string;
  description: string;
  icon: string; // e.g., lucide icon name or emoji char
  status: AgentStatus;
  endpoint: string;
}

export type ExecutionStatus = 'success' | 'failed';

export interface AgentExecution {
  id: string;
  agent_name: string;
  status: ExecutionStatus;
  executed_at: string; // ISO date string
  execution_time_ms: number;
  output?: any;
  error?: string;
}

// --- Scriptwriter ---

export interface ScriptwriterInput {
  product_id: string;
  creative_pattern_id: string;
  trend_snapshot_id: string;
  workflow_id?: string;
  correlation_id?: string;
}

export interface ScriptwriterOutput {
  script_id: string;
  product_id: string;
  script_text: string;
  hook: string;
  creative_variables: Record<string, any>;
  created_at: string;
  workflow_id?: string;
  correlation_id?: string;
}

// --- Editor ---

export interface EditorComposition {
  duration: number; // positive number, seconds
  tone: 'balanced' | 'dramatic' | 'minimal';
  layout: 'vertical' | 'horizontal' | 'square';
}

export interface EditorInput {
  scriptId: string;
  composition: EditorComposition;
  styleTemplateId?: string;
  renderBackend?: 'local' | 's3' | 'supabase'; // default: "supabase"
  workflow_id?: string;
  correlation_id?: string;
}

export interface EditorOutput {
  asset_id: string;
  script_id: string;
  storage_url: string;
  duration: number;
  tone: string;
  layout: string;
  style_tags: string[];
  metadata: Record<string, any>;
  created_at: string;
  workflow_id?: string;
  correlation_id?: string;
}

// --- Publisher ---

export type Platform = 'instagram' | 'tiktok' | 'youtube';

export interface PublisherInput {
  experiment_id: string;
  platform: Platform;
  workflow_id?: string;
  correlation_id?: string;
}

export interface PublisherOutput {
  post_id: string;
  experiment_id: string;
  platform: string;
  external_post_id: string;
  published_at: string;
  workflow_id?: string;
  correlation_id?: string;
}
