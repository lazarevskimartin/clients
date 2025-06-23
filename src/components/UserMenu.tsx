import React, { useState } from 'react';
import { Menu, MenuItem, IconButton, Avatar } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import type { UserRole } from '../types';

interface UserMenuProps {
  onProfile: () => void;
  onLogout: () => void;
  onUsers?: () => void;
  role?: UserRole;
}

const UserMenu: React.FC<UserMenuProps> = ({ onProfile, onLogout, onUsers, role }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton onClick={handleMenuOpen} color="inherit">
        <Avatar sx={{ width: 32, height: 32 }}>
          <PersonIcon />
        </Avatar>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { mt: 1 } } }}
      >
        <MenuItem onClick={() => { handleMenuClose(); onProfile(); }}>
          Мој профил
        </MenuItem>
        {role === 'admin' && onUsers && (
          <MenuItem onClick={() => { handleMenuClose(); onUsers(); }}>
            Корисници
          </MenuItem>
        )}
        <MenuItem onClick={() => { handleMenuClose(); onLogout(); }}>
          Одјава
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;
