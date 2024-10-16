'use client';
import { Alert, Box, Button, Collapse, Container, Grid2, IconButton, Stack, styled, TextField } from "@mui/material";
import styles from './login.module.scss';
import '../globals.scss'
import * as yup from 'yup';
import { useFormik } from "formik";
import ClientModel from "@/models/client.model";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import React from "react";
import { TextStatusCode } from "@/utils/textStatusCode";
import { CADASTRO_ROUTES, HOME_ROUTES, RECOVERY_ROUTES } from "@/utils/routes";
import { useRouter } from "next/navigation";
import IconGoggle from "@/components/dumb/icon-social/icon-google/icon";
import IconFacebook from "@/components/dumb/icon-social/icon-facebook/icon";
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import Link from "next/link";
import signIn from "@/lib/firebase/auth/sigIn";
import signInSocialGoogle from "@/lib/firebase/auth/sigInSocial";
import { Colors } from "../assets/theme/colors";

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
  const [open, setOpen] = React.useState(false);
  const [showForm, setShowForm] = React.useState(false);

  const ButtonSocial = styled(Button)({
    fontWeight:"400",
    textTransform:'none'
  });

  const formik = useFormik({
    initialValues: initial,
    validationSchema: validation,
    onSubmit: async (values) => {
      const { error } = await signIn(values.email, values.password);
      if(error) {
        setOpen(true);
      } else {
        router.push(HOME_ROUTES);
      }
    }
  });

  async function loginSocial() {
    const { error } = await signInSocialGoogle();
    if(error) {setOpen(true)} else {router.push(HOME_ROUTES);}
  }

  function handleForm() {
    setShowForm((show)=> !show);
  }

  return (
    <Container>
      <Grid2 container size={{ xs: 12, sm: 8, md: 6 }} margin={"5% auto 0"}>
        <Box sx={{ p: 6, border: '1px solid'+ Colors.gray10, width:'100%' }}>
          <Stack spacing={1}>
            <h1 className={styles.title}>Login</h1>
            <ButtonSocial 
              color="primary"
              className={styles.buttonSocial} 
              variant="outlined" 
              size="large" 
              aria-label="Login Goggle"
              disabled={showForm ? true : false}
              onClick={loginSocial}
            >
              <IconGoggle showOpacity={showForm} size={25}></IconGoggle> 
              Google
            </ButtonSocial>

            <ButtonSocial 
              color="primary"
              className={styles.buttonSocial} 
              variant="outlined" 
              aria-label="Login Facebook" 
              size="large"
              disabled={showForm ? true : false}
            >
              <IconFacebook showOpacity={showForm} size={25}></IconFacebook>
              Facebook
            </ButtonSocial>

            <ButtonSocial 
              color="primary"
              className={styles.buttonSocial} 
              variant="outlined" 
              aria-label="Login por e-mail e senha" 
              size="large"
              onClick={handleForm}
            >
              <EmailOutlinedIcon></EmailOutlinedIcon>
              <span>E-mail</span>
            </ButtonSocial>
          </Stack>
          <Grid2 display={showForm ? 'block' : 'none'}>
            <form className={styles.formLogin} onSubmit={formik.handleSubmit}>
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
              <Link className={styles.recoverPassword} href={RECOVERY_ROUTES}>Esqueceu sua senha</Link>
              <div className={styles.btnSubmit}>
                <Button type="submit" variant="contained" fullWidth disabled={!formik.isValid}>Entrar</Button>
              </div>
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
          <Link className={styles.redirectCadastro} href={CADASTRO_ROUTES}>Ainda não sou cadastrado</Link>
        </Box>
      </Grid2>
    </Container>
  );
}
