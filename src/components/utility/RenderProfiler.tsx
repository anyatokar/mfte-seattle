import React, { Profiler } from "react";

interface RenderProfilerProps {
  id: string;
  isProfilerOn: boolean;
  children: React.ReactNode;
}

const RenderProfiler: React.FC<RenderProfilerProps> = ({
  id,
  isProfilerOn,
  children,
}) => {
  return (
    <Profiler
      id={id}
      onRender={(
        id,
        phase,
        actualDuration,
        baseDuration,
        startTime,
        commitTime
      ) => {
        if (isProfilerOn) {
          console.log({
            id,
            phase,
            actualDuration,
            baseDuration,
            startTime,
            commitTime,
          });
        }
      }}
    >
      {children}
    </Profiler>
  );
};

export default RenderProfiler;
