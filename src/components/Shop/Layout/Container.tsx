import { cn } from "@/lib/utils";

interface ContainerProps {
    className?: string;
    children: React.ReactNode;
}

const Container = ({ children, className } : ContainerProps) => {
    return (
        <div aria-label="⏹️ CONTAINER" className={ cn( 'mx-auto max-w-7xl', className ) }>
            {children}
        </div>
    )
}

export default Container