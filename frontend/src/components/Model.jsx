// eslint-disable-next-line react/prop-types
const Model = ({ children, isModelShow }) => {
  if (!isModelShow) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      
      <div
        className="w-full max-w-lg rounded-lg border border-border bg-bgSecondary shadow-lg"
        role="dialog"
        aria-modal="true"
      >
        {children}
      </div>

    </div>
  );
};

export default Model;