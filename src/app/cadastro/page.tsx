'use client';
import RegisterClientModel from '@/models/register.model';
import { auth } from '@/services/firebase';
import { HOME_ROUTES } from '@/utils/routes';
import { Button, Container, Grid2, TextField } from '@mui/material'
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import React from 'react'
import * as yup from 'yup';

const validation = yup.object({
  name: yup
  .string()
  .required('Digite seu nome'),
  email: yup
  .string()
  .email('Seu e-mail está invalido')
  .required('Insira seu e-mail'),
  cel: yup
  .number()
  .required('Informe o numero do celular'),
  password: yup
  .string()
  .min(8, 'Sua senha deve ter no minimo 8 caracteres')
  .required('É necessario digitar uma senha')
});

const initial: RegisterClientModel = {
  name: '',
  email: '',
  cel: null,
  password: ''
}

export default function Cadastro() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  
  const formik = useFormik({
    initialValues: initial,
    validationSchema: validation,
    onSubmit: (values)=> {
      createUserWithEmailAndPassword(auth,values.email,values.password).then(()=> {
        router.push(HOME_ROUTES);
      }).catch(e=> {
        if(e.message){
          setOpen(true);
        };
      });
    }
  })
  return (
    <Container>
      <h1>Tela de cadastro</h1>
      <Grid2 container size={{ xs: 12, sm: 12, md: 12 }}>
        <form onSubmit={formik.handleSubmit}>
        <TextField 
            id="name" 
            type="text"
            name="name"
            label="Nome" 
            variant="outlined" 
            margin="dense" 
            size="small" 
            fullWidth
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />
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
          <Button type="submit" variant="contained">Entrar</Button>
        </form>
      </Grid2>
    </Container>
  )
}
