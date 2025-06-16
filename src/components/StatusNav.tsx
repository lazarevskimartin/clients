import React from 'react';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CancelIcon from '@mui/icons-material/Cancel';

interface StatusNavProps {
  value: string;
  onChange: (value: string) => void;
}

const StatusNav: React.FC<StatusNavProps> = ({ value, onChange }) => {
  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1200 }} elevation={3}>
      <BottomNavigation
        showLabels
        value={value}
        onChange={(_, newValue) => onChange(newValue)}
        sx={{
          '& .Mui-selected, & .Mui-selected .MuiBottomNavigationAction-label': {
            color: 'black !important',
          },
          '& .MuiBottomNavigationAction-label': {
            fontWeight: 600,
            fontSize: '1rem',
          },
        }}
      >
        <BottomNavigationAction label="Доставени" value="delivered" icon={<CheckCircleIcon color={value === 'delivered' ? 'success' : 'inherit'} />} />
        <BottomNavigationAction label="Во тек" value="pending" icon={<HourglassEmptyIcon color={value === 'pending' ? 'warning' : 'inherit'} />} />
        <BottomNavigationAction label="Недоставени" value="undelivered" icon={<CancelIcon color={value === 'undelivered' ? 'error' : 'inherit'} />} />
      </BottomNavigation>
    </Paper>
  );
};

export default StatusNav;
