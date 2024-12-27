export type DynamicColumns = {
  headerClassNames: string[];
  titleClassName: string;
  subHeaderClassNames: string[];
  markHeaderClassNames: string[];
  dataClassNames: string[];
  customClassNames: string;
  totalsClassNames: string[];
};

export const getDynamicColumns = (num: number): DynamicColumns => {
  if (num === 1) {
    return <DynamicColumns>{
      headerClassNames: populate('col-span-8', 3),
      titleClassName: 'col-span-4',
      subHeaderClassNames: populate('grid grid-cols-3', 3),
      markHeaderClassNames: populate('col-span-8 grid grid-cols-6', 3),
      dataClassNames: populate('col-span-8 grid grid-cols-6', 3),
      customClassNames: '',
      totalsClassNames: ['col-span-4', 'col-span-8'],
    };
  } else if (num === 2) {
    return <DynamicColumns>{
      headerClassNames: populate('col-span-4', 3),
      titleClassName: 'col-span-4',
      subHeaderClassNames: populate('grid grid-cols-3', 3),
      markHeaderClassNames: populate('col-span-4 grid grid-cols-6', 3),
      dataClassNames: populate('col-span-4 grid grid-cols-6', 3),
      customClassNames: 'd-vertical',
      totalsClassNames: ['col-span-4', 'col-span-8'],
    };
  } else if (num === 3) {
    return <DynamicColumns>{
      headerClassNames: populate('col-span-3', 3),
      titleClassName: 'col-span-3',
      subHeaderClassNames: populate('grid grid-cols-3', 3),
      markHeaderClassNames: populate('col-span-3 grid grid-cols-6', 3),
      dataClassNames: populate('col-span-3 grid grid-cols-6', 3),
      customClassNames: 'd-vertical',
      totalsClassNames: ['col-span-3', 'col-span-9'],
    };
  }
  return <DynamicColumns>{};
};

const populate = (filler: string, n: number): string[] => {
  return Array(n).fill(filler);
};
