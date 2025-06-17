import React from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';

interface MapModalProps {
  open: boolean;
  onClose: () => void;
  address: string;
}

const MapModal: React.FC<MapModalProps> = ({ open, onClose, address }) => {
  let displayAddress = address;
  if (address && address.includes('АВНОЈ')) {
    const match = address.match(/АВНОЈ\s*(\d+)/);
    if (match) {
      displayAddress = `AVNOJ Blvd ${match[1]}`;
    } else {
      displayAddress = 'AVNOJ Blvd';
    }
  } else if (address && address.includes('Јане Сандански')) {
    const match = address.match(/Јане Сандански\s*(\d+)/);
    if (match) {
      displayAddress = `Boulevard Jane Sandanski ${match[1]}`;
    } else {
      displayAddress = 'Boulevard Jane Sandanski';
    }
  } else if (address && address.includes('Кузман Ј. Питу')) {
    const match = address.match(/Кузман Ј\. Питу\s*(\d+)/);
    if (match) {
      displayAddress = `Boulevard Kuzman Josifovski Pitu ${match[1]}`;
    } else {
      displayAddress = 'Boulevard Kuzman Josifovski Pitu';
    }
  } else if (address && address.includes('Васко Карангелески')) {
    const match = address.match(/Васко Карангелески\s*(\d+)/);
    if (match) {
      displayAddress = `Vasko Karangeleski ${match[1]}`;
    } else {
      displayAddress = 'Vasko Karangeleski';
    }
  } else if (address && address.includes('3-та Македонска Бригада')) {
    const match = address.match(/3-та Македонска Бригада\s*(\d+)/);
    if (match) {
      displayAddress = `3rd Macedonian Brigade Blvd ${match[1]}`;
    } else {
      displayAddress = '3rd Macedonian Brigade Blvd';
    }
  }
  const googleSrc = `https://www.google.com/maps?q=${encodeURIComponent(displayAddress)}&output=embed`;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        Локација на мапа
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          ×
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        <iframe
          title="Google Map"
          width="100%"
          height="400"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src={googleSrc}
        />
      </DialogContent>
    </Dialog>
  );
};

export default MapModal;
