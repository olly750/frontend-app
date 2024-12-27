import '../../../styles/components/Atoms/custom/loading.css';

import React from 'react';

interface Iprops {
  height: number;
  className?: string;
}

export default function SkeletonLoader({ height, className = '' }: Iprops) {
  return <div className={`skeleton-loading ${className}`} style={{ height }} />;
}
