import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { GraphData, FileNode, GraphLink } from '../types';
import { THEME_COLORS } from '../constants';

interface GraphViewProps {
  data: GraphData;
  activeNodeId: string;
  onNodeClick: (nodeId: string) => void;
  visible: boolean;
}

const GraphView: React.FC<GraphViewProps> = ({ data, activeNodeId, onNodeClick, visible }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // D3 Render Logic
  useEffect(() => {
    if (!dimensions.width || !dimensions.height || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous

    // Create a deep copy of data for D3 to mutate
    const nodes = data.nodes.map(d => ({ ...d })) as (FileNode & d3.SimulationNodeDatum)[];
    const links = data.links.map(d => ({ ...d })) as (GraphLink & d3.SimulationLinkDatum<d3.SimulationNodeDatum>)[];

    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(dimensions.width / 2, dimensions.height / 2))
      .force("collide", d3.forceCollide().radius(40));

    // Links
    const link = svg.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(links)
      .enter().append("line")
      .attr("stroke", "#444")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 1.5);

    // Node Group
    const node = svg.append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(nodes)
      .enter().append("g")
      .call(d3.drag<any, any>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
      )
      .on("click", (event, d) => {
        onNodeClick(d.id);
      });

    // Node Circles
    node.append("circle")
      .attr("r", (d) => d.id === activeNodeId ? 12 : 8)
      .attr("fill", (d) => d.id === activeNodeId ? '#ffffff' : THEME_COLORS[d.group % THEME_COLORS.length])
      .attr("stroke", "#fff")
      .attr("stroke-width", (d) => d.id === activeNodeId ? 3 : 1)
      .attr("opacity", 0.9)
      .style("cursor", "pointer")
      .style("transition", "all 0.3s ease");

    // Glow effect for active node
    node.filter(d => d.id === activeNodeId)
      .append("circle")
      .attr("r", 20)
      .attr("fill", "none")
      .attr("stroke", "#ffffff")
      .attr("stroke-opacity", 0.3)
      .attr("stroke-width", 2)
      .classed("animate-pulse", true);


    // Labels
    node.append("text")
      .text(d => d.name)
      .attr("x", 15)
      .attr("y", 4)
      .attr("fill", "#e6e6e6")
      .attr("font-size", "12px")
      .attr("font-family", "JetBrains Mono")
      .style("pointer-events", "none")
      .style("text-shadow", "0 1px 3px rgba(0,0,0,0.8)");

    simulation.on("tick", () => {
      link
        .attr("x1", d => (d.source as any).x)
        .attr("y1", d => (d.source as any).y)
        .attr("x2", d => (d.target as any).x)
        .attr("y2", d => (d.target as any).y);

      node
        .attr("transform", d => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [data, dimensions, activeNodeId, onNodeClick]);

  if (!visible) return null;

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 z-40 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
    >
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-gray-400 text-xs tracking-widest uppercase">
        Navigation Graph (Press TAB to toggle)
      </div>
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
};

export default GraphView;
