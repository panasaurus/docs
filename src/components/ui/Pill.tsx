import { cva, type VariantProps } from "class-variance-authority";
import { cx } from "class-variance-authority";

const pillVariants = cva(
	"mb-4 flex h-8 cursor-default select-none items-center gap-[6px] rounded-full border px-[11px] py-[4px] backdrop-blur-xl",
	{
		variants: {
			variant: {
				default: "border-brand/30 bg-brand/10 text-brand",
				success: "border-green-500/30 bg-green-500/10 text-green-500",
				warning: "border-yellow-500/30 bg-yellow-500/10 text-yellow-500",
				error: "border-red-500/30 bg-red-500/10 text-red-500"
			}
		},
		defaultVariants: {
			variant: "default"
		}
	}
);

const Pill = ({
	children,
	leftChild,
	variant,
	className
}: {
	children: React.ReactNode;
	leftChild?: React.ReactNode;
	className?: string;
} & VariantProps<typeof pillVariants>) => {
	return (
		<div data-panasaurus-ui="pill" className={cx(pillVariants({ variant, className }))}>
			{leftChild}
			<div className="font-medium text-sm">{children}</div>
		</div>
	);
};

export default Pill;
