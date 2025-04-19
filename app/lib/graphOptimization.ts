import { FireZone, Resource, GraphNode, GraphEdge } from './types';
import { calculateEdgeWeight } from './mockData';

class PriorityQueue {
  private values: [number, GraphNode][] = [];

  enqueue(node: GraphNode, priority: number) {
    this.values.push([priority, node]);
    this.sort();
  }

  dequeue(): [number, GraphNode] | undefined {
    return this.values.shift();
  }

  sort() {
    this.values.sort((a, b) => a[0] - b[0]);
  }
}

export const buildResourceAllocationGraph = (
  fireZones: FireZone[],
  resources: Resource[],
  windSpeed: number
): { nodes: GraphNode[]; edges: GraphEdge[] } => {
  const nodes: GraphNode[] = [
    ...fireZones.map(zone => ({
      id: zone.id,
      type: 'zone' as const,
      data: zone,
    })),
    ...resources.map(resource => ({
      id: resource.id,
      type: 'resource' as const,
      data: resource,
    })),
  ];

  const edges: GraphEdge[] = [];

  // Create edges between resources and fire zones
  resources.forEach(resource => {
    fireZones.forEach(zone => {
      const weight = calculateEdgeWeight(
        resource.currentLocation,
        zone.coordinates,
        windSpeed
      );
      edges.push({
        from: resource.id,
        to: zone.id,
        weight,
      });
    });
  });

  return { nodes, edges };
};

export const findOptimalAssignments = (
  graph: { nodes: GraphNode[]; edges: GraphEdge[] },
  priorityScores: { [key: string]: number }
): { [key: string]: string[] } => {
  const assignments: { [key: string]: string[] } = {};
  const resourceNodes = graph.nodes.filter(node => node.type === 'resource');
  const zoneNodes = graph.nodes.filter(node => node.type === 'zone');

  // Initialize assignments
  zoneNodes.forEach(zone => {
    assignments[zone.id] = [];
  });

  // Sort zones by priority score
  const sortedZones = [...zoneNodes].sort(
    (a, b) => priorityScores[b.id] - priorityScores[a.id]
  );

  // Assign resources to zones based on priority and distance
  sortedZones.forEach(zone => {
    const availableResources = resourceNodes.filter(
      resource =>
        !Object.values(assignments).flat().includes(resource.id)
    );

    if (availableResources.length === 0) return;

    // Find closest resources
    const zoneEdges = graph.edges.filter(edge => edge.to === zone.id);
    const sortedResources = availableResources
      .map(resource => ({
        resource,
        weight: zoneEdges.find(edge => edge.from === resource.id)?.weight || Infinity,
      }))
      .sort((a, b) => a.weight - b.weight);

    // Assign closest resources based on zone priority
    const numResourcesToAssign = Math.ceil(
      (priorityScores[zone.id] / Math.max(...Object.values(priorityScores))) *
        Math.min(3, availableResources.length)
    );

    assignments[zone.id] = sortedResources
      .slice(0, numResourcesToAssign)
      .map(r => r.resource.id);
  });

  return assignments;
}; 