// client/src/utils/chartUtils.js

// Color schemes for charts
export const chartColors = {
  primary: '#3B82F6',
  secondary: '#8B5CF6',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#06B6D4',
  gray: '#6B7280'
};

export const chartColorPalette = [
  '#3B82F6', // blue
  '#8B5CF6', // purple
  '#10B981', // green
  '#F59E0B', // yellow
  '#EF4444', // red
  '#06B6D4', // cyan
  '#F97316', // orange
  '#EC4899'  // pink
];

// Format date for charts
export const formatDate = (dateString, format = 'short') => {
  const date = new Date(dateString);
  
  if (format === 'short') {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } else if (format === 'long') {
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  } else if (format === 'month') {
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }
  
  return date.toLocaleDateString();
};

// Format number with commas
export const formatNumber = (num) => {
  return new Intl.NumberFormat('en-US').format(num);
};

// Format percentage
export const formatPercentage = (value, total) => {
  if (!total || total === 0) return '0%';
  return `${((value / total) * 100).toFixed(1)}%`;
};

// Prepare data for pie chart
export const preparePieChartData = (data, labelKey, valueKey) => {
  return data.map((item, index) => ({
    name: item[labelKey],
    value: item[valueKey],
    fill: chartColorPalette[index % chartColorPalette.length]
  }));
};

// Prepare data for line chart
export const prepareLineChartData = (data, xKey = 'date', yKeys = ['value']) => {
  return data.map(item => {
    const result = { [xKey]: formatDate(item[xKey]) };
    yKeys.forEach(key => {
      result[key] = item[key] || 0;
    });
    return result;
  });
};

// Prepare data for bar chart
export const prepareBarChartData = (data, xKey, yKey) => {
  return data.map(item => ({
    name: item[xKey],
    value: item[yKey] || 0
  }));
};

// Get chart configuration
export const getChartConfig = (type = 'line') => {
  const baseConfig = {
    margin: { top: 5, right: 30, left: 20, bottom: 5 },
    colors: chartColorPalette
  };

  if (type === 'line') {
    return {
      ...baseConfig,
      strokeWidth: 2,
      dot: { r: 4 },
      activeDot: { r: 6 }
    };
  }

  if (type === 'bar') {
    return {
      ...baseConfig,
      barSize: 40
    };
  }

  return baseConfig;
};


