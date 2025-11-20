// client/src/components/admin/PieChart.js
import React from 'react';
import { PieChart as RechartsPieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatNumber } from '../../utils/chartUtils';
import { chartColorPalette } from '../../utils/chartUtils';

const PieChart = ({ data, dataKey = 'value', nameKey = 'name', height = 300 }) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsPieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey={dataKey}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill || chartColorPalette[index % chartColorPalette.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => formatNumber(value)} />
        <Legend />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
};

export default PieChart;


