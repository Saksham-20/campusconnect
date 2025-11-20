// client/src/components/admin/LineChart.js
import React from 'react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatNumber } from '../../utils/chartUtils';

const LineChart = ({ data, xKey = 'date', yKeys = [{ key: 'value', name: 'Value', color: '#3B82F6' }], height = 300 }) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xKey} />
        <YAxis />
        <Tooltip formatter={(value) => formatNumber(value)} />
        <Legend />
        {yKeys.map((yKey) => (
          <Line
            key={yKey.key}
            type="monotone"
            dataKey={yKey.key}
            name={yKey.name}
            stroke={yKey.color || '#3B82F6'}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};

export default LineChart;


