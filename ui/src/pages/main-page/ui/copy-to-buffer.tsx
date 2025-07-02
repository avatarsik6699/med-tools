import {
	ActionIcon,
	CopyButton,
	Tooltip,
	type CopyButtonProps,
} from "@mantine/core";
import { type FC } from "react";
import { PiCheckThin, PiCopySimpleThin } from "react-icons/pi";

type Props = {
	valueToCopy: CopyButtonProps["value"];
};

const CopyToBuffer: FC<Props> = (props) => {
	return (
		<CopyButton value={props.valueToCopy} timeout={2000}>
			{({ copied, copy }) => (
				<Tooltip
					bg="dark.5"
					label={copied ? "Скопировано" : "Скопировать"}
					withArrow
					position="right"
					transitionProps={{ transition: "fade-right", duration: 300 }}
				>
					<ActionIcon
						color={copied ? "teal" : "gray"}
						variant="transparent"
						onClick={copy}
					>
						{copied ? (
							<PiCheckThin size={16} />
						) : (
							<PiCopySimpleThin size={16} />
						)}
					</ActionIcon>
				</Tooltip>
			)}
		</CopyButton>
	);
};

export default CopyToBuffer;
