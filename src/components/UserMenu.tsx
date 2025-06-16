import React, { useState } from 'react';
import { Menu, MenuItem, IconButton, Avatar } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

interface UserMenuProps {
  onProfile: () => void;
  onLogout: () => void;
}

const UserMenu: React.FC<Omit<UserMenuProps, 'email'>> = ({ onProfile, onLogout }) => {
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
      >
        <MenuItem onClick={() => { handleMenuClose(); onProfile(); }}>
          Мој профил
        </MenuItem>
        <MenuItem onClick={() => { handleMenuClose(); onLogout(); }}>
          Одјава
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;
