import { cn } from "@/lib/utils";

interface ContainerProps {
    className?: string;
    children: React.ReactNode;
}

const Container = ({ children, className } : ContainerProps) => {
    return (
        <div aria-label="⏹️ CONTAINER" className={ cn( 'mx-auto lg:max-w-7xl px-4', className ) }>
            {children}
        </div>
    )
}

export default Container