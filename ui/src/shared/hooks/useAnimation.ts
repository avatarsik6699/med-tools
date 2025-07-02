import { useCallback, useEffect, useRef, useState } from "react";

export const useAnimation = (duration = 100, onComplete?: () => void) => {
	const [isAnimating, setIsAnimating] = useState(false);
	const timeoutRef = useRef<number>(null);

	const start = useCallback(() => {
		if (timeoutRef.current) {
			window.clearTimeout(timeoutRef.current);
		}

		setIsAnimating(true);
		timeoutRef.current = window.setTimeout(() => {
			setIsAnimating(false);
			onComplete?.();
		}, duration);
	}, [duration, onComplete]);

	const stop = useCallback(() => {
		if (timeoutRef.current) {
			window.clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}
		setIsAnimating(false);
	}, []);

	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	return { isRunning: isAnimating, start, stop };
};
