'use client';
import { Alert, Button, Container, Grid2, IconButton, Snackbar, SnackbarCloseReason, TextField } from "@mui/material";
import styles from './login.module.css';
import '../globals.css'
import * as yup from 'yup';
import { useFormik } from "formik";
import ClientModel from "@/models/client.model";
import {auth, provider} from "@/services/firebase";
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import React from "react";
import { TextStatusCode } from "@/utils/textStatusCode";
import { CADASTRO_ROUTES, HOME_ROUTES, RECOVERY_ROUTES } from "@/utils/routes";
import { useRouter } from "next/navigation";
import IconGoggle from "@/components/dumb/icon-social/icon-google/icon";
import IconFacebook from "@/components/dumb/icon-social/icon-facebook/icon";
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import { Colors } from "../assets/theme/colors";
import Link from "next/link";

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

const initial: ClientModel = {
  email: '',
  password: ''
}

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const redirectRecorevy = () => router.push(RECOVERY_ROUTES);
  const [open, setOpen] = React.useState(false);
  const [mensageErrorCredential, setmensageErrorCredential] = React.useState(false); 
  const [showForm, setShowForm] = React.useState(false);

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const formik = useFormik({
    initialValues: initial,
    validationSchema: validation,
    onSubmit: (values)=> {
      signInWithEmailAndPassword(auth,values.email,values.password).then(()=> {
        setmensageErrorCredential(false);
        setOpen(true);
        router.push(HOME_ROUTES);
      }).catch(e=> {
        if(e.message){
          setmensageErrorCredential(true);
          setOpen(true);
        };
      });
    }
  });

  function loginSocial() {
    signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      // const token = credential.accessToken;
      // const user = result.user;
      console.log(result);
      console.log('credential', credential)
    }).catch((e) => {
      console.log(e)
      if(e.message){
        setmensageErrorCredential(true);
        setOpen(true);
      };
    });
  }

  function handleForm() {
    setShowForm((show)=> !show);
  }

  return (
    <Container>
      <Grid2 container display={'block'} size={{ xs: 12, sm: 7, md: 4 }} margin={"0 auto"}>
        <h1 className={styles.title}>Login</h1>
        <Button 
          color="secondary"
          className={styles.buttonSocial} 
          variant="outlined" 
          size="large" 
          aria-label="Login Goggle"
          disabled={showForm ? true : false}
          onClick={loginSocial}
        >
          <IconGoggle size={25}></IconGoggle> 
          <span>Goggle</span>
        </Button>

        <Button 
          color="secondary"
          className={styles.buttonSocial} 
          variant="outlined" 
          aria-label="Login Facebook" 
          size="large"
          disabled={showForm ? true : false}
        >
          <IconFacebook size={25}></IconFacebook>
          <span>Facebook</span>
        </Button>

        <Button 
          color="secondary"
          className={styles.buttonSocial} 
          variant="outlined" 
          aria-label="Login por e-mail e senha" 
          size="large"
          onClick={handleForm}
        >
          <EmailOutlinedIcon></EmailOutlinedIcon>
          <span>E-mail</span>
        </Button>
      </Grid2>
      <Grid2 container 
        size={{ xs: 12, sm: 7, md: 4 }} 
        margin={"0 auto"} 
        display={showForm ? 'block' : 'none'}
      >
        <form onSubmit={formik.handleSubmit}>
          <TextField 
            id="email" 
            type="text"
            name="email"
            label="E-mail *" 
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
            label="Senha *" 
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
          <p className={styles.recoverPassword} onClick={redirectRecorevy}>Esqueceu sua senha</p>
          <div className={styles.btnSubmit}>
            <Button type="submit" variant="contained" fullWidth disabled={!formik.isValid}>Entrar</Button>
          </div>
        </form>
      </Grid2>
      <Grid2 container 
        size={{ xs: 12, sm: 7, md: 4 }} 
        margin={"0 auto"} 
      >
        <Link className={styles.redirectCadastro} href={CADASTRO_ROUTES}>Ainda não sou cadastrado</Link>
      </Grid2>
      <Snackbar anchorOrigin={{ vertical: "top", horizontal: "right" }} 
        open={open} 
        autoHideDuration={6000} 
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={mensageErrorCredential ? "error" : 'success'}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {mensageErrorCredential ? TextStatusCode.login.status400 : TextStatusCode.login.status200}
        </Alert>
      </Snackbar>
    </Container>
  );
}
