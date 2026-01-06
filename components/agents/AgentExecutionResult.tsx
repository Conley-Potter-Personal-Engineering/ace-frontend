import { AgentExecution } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AgentExecutionResultProps {
  result: AgentExecution;
}

export function AgentExecutionResult({ result }: AgentExecutionResultProps) {
  const isSuccess = result.status === 'success';

  return (
    <Card className={`mt-6 border-l-4 ${isSuccess ? 'border-l-green-500' : 'border-l-red-500'}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          {isSuccess ? (
            <CheckCircle2 className="h-6 w-6 text-green-500" />
          ) : (
            <XCircle className="h-6 w-6 text-red-500" />
          )}
          <CardTitle className="text-lg">
            {isSuccess ? 'Execution Successful' : 'Execution Failed'}
          </CardTitle>
          <div className="ml-auto flex items-center text-sm text-muted-foreground">
            <Clock className="mr-1 h-3 w-3" />
            {(result.execution_time_ms / 1000).toFixed(2)}s
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isSuccess ? (
          <SuccessContent result={result} />
        ) : (
          <ErrorContent error={result.error} />
        )}
      </CardContent>
    </Card>
  );
}

function ErrorContent({ error }: { error?: string }) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-red-600">Error Details:</p>
      <pre className="overflow-x-auto rounded bg-red-50 p-2 text-xs text-red-800">
        {error || 'Unknown error occurred'}
      </pre>
      <p className="text-xs text-muted-foreground">
        Check the server logs for more information or try running the agent again.
      </p>
    </div>
  );
}

function SuccessContent({ result }: { result: AgentExecution }) {
  const { agent_name, output } = result;

  if (!output) {
    return <p className="text-sm text-muted-foreground">No output returned.</p>;
  }

  // Specialized rendering based on Agent Name
  if (agent_name === 'ScriptwriterAgent' || agent_name === 'scriptwriter') {
    return (
      <div className="space-y-2 text-sm">
        <div className="grid grid-cols-[100px_1fr] gap-1">
          <span className="font-semibold text-muted-foreground">Script ID:</span>
          <span className="font-mono">{output.script_id}</span>
          <span className="font-semibold text-muted-foreground">Hook:</span>
          <span>&ldquo;{output.hook}&rdquo;</span>
          <span className="font-semibold text-muted-foreground">Length:</span>
          <span>{output.script_text?.split(/\s+/).length ?? 0} words</span>
        </div>
        <div className="pt-2">
          {/* Use default Button for link style for now */}
          <Button variant="outline" size="sm">View Full Script</Button>
        </div>
      </div>
    );
  }

  if (agent_name === 'EditorAgent' || agent_name === 'editor') {
    return (
      <div className="space-y-2 text-sm">
        <div className="grid grid-cols-[100px_1fr] gap-1">
          <span className="font-semibold text-muted-foreground">Asset ID:</span>
          <span className="font-mono">{output.asset_id}</span>
          <span className="font-semibold text-muted-foreground">Duration:</span>
          <span>{output.duration}s</span>
          <span className="font-semibold text-muted-foreground">Storage:</span>
          <a href={output.storage_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline truncate block">
            {output.storage_url}
          </a>
        </div>
        <div className="pt-2">
          <Button variant="outline" size="sm" asChild>
            <a href={output.storage_url} target="_blank" rel="noopener noreferrer">View Video</a>
          </Button>
        </div>
      </div>
    );
  }

  if (agent_name === 'PublisherAgent' || agent_name === 'publisher') {
    return (
      <div className="space-y-2 text-sm">
        <div className="grid grid-cols-[100px_1fr] gap-1">
          <span className="font-semibold text-muted-foreground">Post ID:</span>
          <span className="font-mono">{output.post_id}</span>
          <span className="font-semibold text-muted-foreground">Platform:</span>
          <span className="capitalize">{output.platform}</span>
          <span className="font-semibold text-muted-foreground">Published:</span>
          <span>{new Date(output.published_at).toLocaleString()}</span>
        </div>
        <div className="pt-2">
          <Button variant="outline" size="sm">View Post</Button>
        </div>
      </div>
    );
  }

  // Fallback for unknown agents
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Output Data:</p>
      <pre className="max-h-48 overflow-auto rounded bg-muted p-2 text-xs">
        {JSON.stringify(output, null, 2)}
      </pre>
    </div>
  );
}
