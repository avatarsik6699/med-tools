import { Link, type LinkProps } from "@tanstack/react-router";
import { type FC, type HTMLAttributes } from "react";

type Props = LinkProps & HTMLAttributes<HTMLAnchorElement> & {};

const RouterLink: FC<Props> = ({ children, className, ...props }) => {
	return (
		<Link {...props} className={className}>
			{children}
		</Link>
	);
};

export default RouterLink;
