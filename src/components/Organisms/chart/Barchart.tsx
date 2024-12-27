import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface IBarchatProps {
  fill?: string;
  xAxisLabel: string;
  dataKey: string;
  data: any[];
}

export default function Barchart({
  data,
  xAxisLabel,
  dataKey,
  fill = '#8884d8',
}: IBarchatProps) {
  return (
    <div className="pt-6">
      <ResponsiveContainer width="100%" height={500}>
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xAxisLabel} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey={dataKey} maxBarSize={50} fill={fill} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
