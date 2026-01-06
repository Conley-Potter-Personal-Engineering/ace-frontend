import { Agent } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface AgentCardProps {
  agent: Agent;
  isSelected: boolean;
  onSelect: (agent: Agent) => void;
}

export function AgentCard({ agent, isSelected, onSelect }: AgentCardProps) {
  const statusColor =
    agent.status === 'ready'
      ? 'bg-green-500'
      : agent.status === 'busy'
        ? 'bg-yellow-500'
        : 'bg-red-500';

  return (
    <Card
      className={`relative w-80 cursor-pointer transition-all hover:shadow-md ${isSelected ? 'border-primary ring-2 ring-primary/20' : ''
        }`}
      onClick={() => onSelect(agent)}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="text-2xl">{agent.icon}</div>
          <Badge variant="outline" className="flex gap-1.5 align-middle">
            <span className={`block h-2 w-2 rounded-full ${statusColor}`} />
            <span className="capitalize">{agent.status}</span>
          </Badge>
        </div>
        <CardTitle className="mt-2 text-lg">{agent.display_name}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        {agent.description}
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={(e) => {
          e.stopPropagation(); // Prevent card select if we want distinct behavior, but here run selects it too
          onSelect(agent);
        }}>Run Agent</Button>
      </CardFooter>
    </Card>
  );
}
