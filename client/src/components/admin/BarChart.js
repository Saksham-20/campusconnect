// client/src/components/admin/BarChart.js
import React from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatNumber } from '../../utils/chartUtils';

const BarChart = ({ data, xKey = 'name', yKeys = [{ key: 'value', name: 'Value', color: '#3B82F6' }], height = 300 }) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xKey} />
        <YAxis />
        <Tooltip formatter={(value) => formatNumber(value)} />
        <Legend />
        {yKeys.map((yKey) => (
          <Bar
            key={yKey.key}
            dataKey={yKey.key}
            name={yKey.name}
            fill={yKey.color || '#3B82F6'}
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};

export default BarChart;


