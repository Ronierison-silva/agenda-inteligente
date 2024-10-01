'use client';
import RegisterModel from '@/models/register.model';
import { Button, Container, Grid2, TextField } from '@mui/material'
import { useFormik } from 'formik';
import React from 'react'
import * as yup from 'yup';

const validation = yup.object({
  companyName: yup
  .string()
  .required('Digite o nome da empresa'),
  email: yup
  .string()
  .email('Seu e-mail está invalido')
  .required('Insira seu e-mail'),
  areaOfActivity: yup
  .string()
  .required('Selecione a area de atuação'),
  cel: yup
  .number()
  .required('Informe o numero do celular'),
  password: yup
  .string()
  .min(8, 'Sua senha deve ter no minimo 8 caracteres')
  .required('É necessario digitar uma senha'),
  confirmPassword: yup
  .string()
  .min(8, 'Confirme sua senha')
  .required('É necessario confirmar sua senha'),
});

const initial: RegisterModel = {
  email: '',
  cel: null,
  password: '',
  confirmPassword: ''
}


export default function Cadastro() {
  const formik = useFormik({
    initialValues: initial,
    validationSchema: validation,
    onSubmit: (values)=> {
      alert(JSON.stringify(values, null,2));
    }
  })
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
            id="cel" 
            type="tel"
            name="cel"
            label="Celular" 
            variant="outlined" 
            margin="dense" 
            size="small" 
            fullWidth
            value={formik.values.cel}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.cel && Boolean(formik.errors.cel)}
            helperText={formik.touched.cel && formik.errors.cel}
          />
          <TextField 
            id="password" 
            type="password"
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
          />
          <TextField 
            id="confirmPassword" 
            type="password"
            name="confirmPassword"
            label="Confirmar senha" 
            variant="outlined" 
            margin="dense" 
            size="small" 
            fullWidth
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
            helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
          />
          <Button type="submit" variant="contained">Entrar</Button>
        </form>
      </Grid2>
    </Container>
  )
}
