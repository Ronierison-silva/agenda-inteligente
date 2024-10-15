'use client';
import { useAuthContext } from "@/context/auth/AuthContext";
import { Box, Container, Grid2, Step, StepLabel, Stepper } from "@mui/material";

export default function Home() {
  const {userAuth} = useAuthContext();
  console.log(userAuth)
  const steps = [
    'Selecionar profissional',
    'Selecionar serviços',
    'Selecionar horário',
    'Confirmar'
  ];
  return (
    <div>
      <main>
        <Container>
          <Grid2 container>
          <Box sx={{ width: '100%' }} margin={"2rem 0 0 0"}>
            <Stepper activeStep={0} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
          </Grid2>
        </Container>
      </main>
    </div>
  );
}
