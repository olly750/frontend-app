import React from 'react';

import Heading from '../../components/Atoms/Text/Heading';

interface IContentSpan {
  title: string;
  subTitle?: string;
  children?: React.ReactNode;
  className?: string;
}

export default function ContentSpan({
  title,
  subTitle,
  className,
  children,
}: IContentSpan) {
  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <Heading color="txt-secondary" fontSize="base">
        {title}
      </Heading>
      <Heading fontWeight="semibold" fontSize="sm">
        {children || subTitle}
      </Heading>
    </div>
  );
}
