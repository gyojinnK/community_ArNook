const ContentBox: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <div className="w-10/12 lg:w-full mt-20">{children}</div>;
};

export default ContentBox;
