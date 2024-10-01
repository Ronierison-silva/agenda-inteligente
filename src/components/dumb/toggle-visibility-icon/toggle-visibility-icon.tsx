'use client';

import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton } from "@mui/material";

export default function ToggleVisibilityIcon(showPassword:boolean) {
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  return (
    <IconButton
      aria-label="toggle password visibility"
      onClick={handleClickShowPassword}
    >
      {showPassword ? <VisibilityOff /> : <Visibility />}
    </IconButton>
  );
}