import * as React from 'react';
import Badge from '@mui/joy/Badge';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';

export default function Market({ count }) {
  return (
      <Badge badgeContent={count} showZero>
        <Typography level="h1" component="h2">
          🛍
        </Typography>
      </Badge>
  
  );
}