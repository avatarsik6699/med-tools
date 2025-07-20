import { useCallback, type FC } from "react";
import {
	ReactFlow,
	MiniMap,
	Controls,
	Background,
	useNodesState,
	useEdgesState,
	addEdge,
	BackgroundVariant,
	Handle,
	Position,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function TextUpdaterNode(props: any) {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const onChange = useCallback((evt: any) => {
		console.log(evt.target.value);
	}, []);
	console.log(props);
	return (
		<div className="text-updater-node">
			<Handle
				type="target"
				position={Position.Top}
				id={`${props.id}-target-top`}
			/>
			<div>
				<label htmlFor="text">Text:</label>
				<input id="text" name="text" onChange={onChange} className="nodrag" />
			</div>

			<Handle
				type="source"
				position={Position.Right}
				id={`${props.id}-source-right`}
			/>
		</div>
	);
}

const initialNodes = [
	{
		id: "1",
		type: "textUpdater",
		position: { x: 0, y: 0 },
		data: { label: "1", value: 123 },
	},
	{ id: "2", position: { x: 0, y: 100 }, data: { label: "2", value: 345 } },
];

const initialEdges = [
	{
		id: "e1-2",
		source: "1",
		target: "2",
		sourceHandle: "1-source-right", // Указываем конкретный handle
		// targetHandle: "2-target-left",
	},
];

const nodeTypes = { textUpdater: TextUpdaterNode };

const PathwaysPage: FC = () => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [nodes, _, onNodesChange] = useNodesState(initialNodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

	const onConnect = useCallback(
		(params: unknown) => setEdges((eds) => addEdge(params as never, eds)),
		[setEdges],
	);

	return (
		<div style={{ width: "100%", height: "87.5vh" }}>
			<ReactFlow
				nodes={nodes}
				edges={edges}
				nodeTypes={nodeTypes}
				onNodesChange={onNodesChange}
				onEdgesChange={onEdgesChange}
				onConnect={onConnect}
				fitView
			>
				<Controls />
				<MiniMap />
				<Background variant={BackgroundVariant.Dots} gap={12} size={1} />
			</ReactFlow>
		</div>
	);
};

export default PathwaysPage;
