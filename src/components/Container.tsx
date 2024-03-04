interface ContainerProps {
  children: React.ReactNode;
}

export const Container = ({ children }: ContainerProps) => {
  return <div className="container max-w-[1024px] p-6 my-0 mx-auto">{children}</div>;
};
