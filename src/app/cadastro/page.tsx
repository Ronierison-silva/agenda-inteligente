'use client';
import signUp from '@/lib/firebase/auth/signUp';
import RegisterClientModel from '@/models/register.model';
import { LOGIN_ROUTES } from '@/utils/routes';
import { TextStatusCode } from '@/utils/textStatusCode';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Alert, Button, Collapse, Container, Grid2, IconButton, TextField } from '@mui/material';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import React from 'react'
import * as yup from 'yup';

const validation = yup.object({
  email: yup
  .string()
  .email('Seu e-mail está invalido')
  .required('Insira seu e-mail'),
  password: yup
  .string()
  .min(8, 'Sua senha deve ter no minimo 8 caracteres')
  .required('É necessario digitar uma senha')
});

const initial: RegisterClientModel = {
  email: '',
  password: ''
}

export default function Cadastro() {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const [open, setOpen] = React.useState(false);
  
  const formik = useFormik({
    initialValues: initial,
    validationSchema: validation,
    onSubmit: async (values) => {
      const { error } = await signUp(values.email, values.password);
      if(error) {
        setOpen(true);
      } else {
        router.push(LOGIN_ROUTES);
      }
    }
  });

  return (
    <Container>
      <h1>Tela de cadastro</h1>
      <Grid2 container size={{ xs: 12, sm: 12, md: 12 }}>
        <form onSubmit={formik.handleSubmit}>
          <TextField 
            id="email" 
            type="text"
            name="email"
            label="E-mail" 
            variant="outlined" 
            margin="dense" 
            size="small" 
            fullWidth
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          <TextField 
            id="password" 
            type={showPassword ? 'text' : 'password'}
            name="password"
            label="Senha" 
            variant="outlined" 
            margin="dense" 
            size="small" 
            fullWidth
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            slotProps={{
              input: {
                endAdornment: (
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              },
            }}
          />
          <Button type="submit" variant="contained" disabled={!formik.isValid}>Entrar</Button>
        </form>
        <Collapse in={open}>
          <Alert
            onClose={() => {setOpen(false)}}
            severity="error"
            variant="filled"
            sx={{ width: '100%' }}
          >
            {TextStatusCode.login.status400}
          </Alert>
        </Collapse>
      </Grid2>
    </Container>
  )
}
