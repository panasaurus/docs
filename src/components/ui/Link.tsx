import NextLink from "next/link";

export const Link = ({
        href,
        external = false,
        className = "text-brand",
        children,
        ...props
}: {
        href: string;
        external?: boolean;
        className?: string;
        children: React.ReactNode;
}) => (
        <NextLink
                data-panasaurus-ui="link"
                href={href}
                className={className}
                {...external && {
                        target: "_blank",
                        rel: "noopener noreferrer"
                }}
                {...props}
        >
                {children}
        </NextLink>
);
