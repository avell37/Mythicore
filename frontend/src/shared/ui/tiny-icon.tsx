import Image from 'next/image';

export const TinyIcon = ({ src, alt }: { src: string | null; alt: string }) => {
	if (!src) {
		return <span className="mt-0.5 size-4 shrink-0 rounded-sm bg-white/10" />;
	}

	return (
		<Image
			src={src}
			alt={alt}
			width={16}
			height={16}
			className="mt-0.5 size-4 shrink-0 rounded-sm"
		/>
	);
};
