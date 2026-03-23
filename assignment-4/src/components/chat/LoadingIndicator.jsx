function LoadingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="max-w-[70%] rounded-2xl rounded-tl-md border border-white/10 bg-white/5 px-4 py-3 text-[13px] text-slate-300 shadow-sm">
        Assistant is typing...
      </div>
    </div>
  );
}

export default LoadingIndicator;
