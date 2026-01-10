interface LoadingWaveProps {
  className?: string;
}

export function LoadingWave({ className = "" }: LoadingWaveProps) {
  return (
    <div className={`loading-wave ${className}`}>
      <div className="loading-bar"></div>
      <div className="loading-bar"></div>
      <div className="loading-bar"></div>
      <div className="loading-bar"></div>
    </div>
  );
}
