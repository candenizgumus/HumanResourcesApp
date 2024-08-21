import React from 'react';
import { ResponsivePie } from '@nivo/pie';
import { Box, Typography } from '@mui/material';
import { IUser } from '../../../models/IUser';


interface EmployeePositionPieChartProps {
  employeeList: IUser[];
}

const EmployeePositionPieChart: React.FC<EmployeePositionPieChartProps> = ({ employeeList }) => {
// Filter out employees who are not ACTIVE
  const activeEmployees = employeeList.filter(employee => employee.status === 'ACTIVE');

  // Count the number of active employees in each position
  const positionCounts = activeEmployees.reduce<{ [key: string]: number }>((acc, employee) => {
    acc[employee.position] = (acc[employee.position] || 0) + 1;
    return acc;
  }, {});

  // Transform the data into the format required by Nivo Pie
  const chartData = Object.entries(positionCounts).map(([position, count]) => ({
    id: position,
    label: position,
    value: count,
  }));

  return (
    <Box height={400}>
      <ResponsivePie
        data={chartData}
        margin={{right: 20, left: 20 }}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={3}
        activeOuterRadiusOffset={8}
        borderWidth={1}
        borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor="#333333"
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: 'color' }}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
        enableArcLinkLabels={false}
      />
    </Box>
  );
};

export default EmployeePositionPieChart;
