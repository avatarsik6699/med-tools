import {
	addEdge,
	applyEdgeChanges,
	applyNodeChanges,
	Background,
	BackgroundVariant,
	Controls,
	Handle,
	MiniMap,
	Panel,
	Position,
	ReactFlow,
} from "@xyflow/react";
import { useCallback, useState, type FC } from "react";

import "@xyflow/react/dist/style.css";
import { Button, Flex } from "@mantine/core";

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
		// type: "textUpdater",
		type: "input",
		position: { x: 50, y: 200 },
		data: { label: <div style={{ color: "red" }}>123</div>, value: 123 },
	},
	{ id: "2", position: { x: 0, y: 350 }, data: { label: "2", value: 345 } },
];

const initialEdges = [
	// {
	// 	id: "1-2",
	// 	source: "1",
	// 	target: "2",
	// 	type: "step",
	// 	label: "connects with",
	// 	// sourceHandle: "", // Указываем конкретный handle
	// 	// targetHandle: "2-target-left",
	// },
];

const nodeTypes = { textUpdater: TextUpdaterNode };

const PathwaysPage: FC = () => {
	const [nodes, setNodes] = useState(initialNodes);
	const [edges, setEdges] = useState(initialEdges);

	const addNode = () => {
		const newNode = {
			id: `${nodes.length + 1}`,
			type: "input",
			position: { x: Math.random() * 300, y: Math.random() * 300 },
			data: { label: `Node ${nodes.length + 1}` },
		};
		setNodes((nds) => [...nds, newNode]);
	};

	const deleteSelectedNodes = () => {
		setNodes((nds) => nds.filter((node) => !node.selected));
	};

	console.log(nodes)

	return (
		<>
			<div style={{ width: "100%", height: "87.5vh" }}>
				<ReactFlow
					nodes={nodes}
					edges={edges}
					// nodeTypes={nodeTypes}
					onNodesChange={(changes) =>
						setNodes((nodesSnapshot) =>
							applyNodeChanges(changes, nodesSnapshot),
						)
					}
					onEdgesChange={(changes) =>
						setEdges((edgesSnapshot) =>
							applyEdgeChanges(changes, edgesSnapshot),
						)
					}
					onConnect={(params) =>
						setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot))
					}
					// fitView
				>
					<Panel position="top-left">
						<Flex gap="xs" w="420px">
							<Button onClick={addNode}>Добавить узел</Button>
							<Button onClick={deleteSelectedNodes}>Удалить выбранный</Button>
						</Flex>
					</Panel>

					<Controls />
					<MiniMap />
					<Background variant={BackgroundVariant.Dots} gap={12} size={1} />
				</ReactFlow>
			</div>
		</>
	);
};

export default PathwaysPage;
