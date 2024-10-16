'use client';
import { useAuthContext } from "@/context/auth/AuthContext";
import { Box, Button, Container, Grid2, Step, StepButton, StepLabel, Stepper, Typography } from "@mui/material";
import { Colors } from "../assets/theme/colors";
import SelectProfessional from "./select-professional";
import React from "react";
import SelectService from "./select-service";
import SelectTime from "./select-time";
import ConfirmAppointment from "./confirm-appointment";

const steps = [
  'Selecionar profissional',
  'Selecionar serviços',
  'Selecionar horário',
  'Confirmar'
];

export default function Agendamento() {
  //const {userAuth} = useAuthContext();
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState<{
    [i: number]: boolean;
  }>({});

  const handleStep = (step: number) => () => {
    setActiveStep(step);
  };

  const handleNext = () => {
    if (activeStep === steps.length) {
      alert('concluido')
    } else {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep !== 0) setActiveStep(activeStep - 1);
  };

  function getStepContent(step:number) {
    switch (step) {
      case 0:
        return <SelectProfessional />;
      case 1:
        return <SelectService />;
      case 2:
        return <SelectTime />;
      case 3:
        return <ConfirmAppointment />;
      default:
        return "1";
    }
  }

  return (
    <div>
      <main>
        <Container>
          <Grid2 container>
          <Box sx={{ width: '100%' }} margin={"1rem 0 0 0"}>
           <Typography
              variant="h1"
              sx={{
                textAlign:'center',
                margin: '0 0 1rem 0'
              }}
            >
              Agendamento
            </Typography>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label, index) => (
                <Step key={label} color={Colors.secundary} completed={completed[index]}>
                  <StepButton color="inherit" onClick={handleStep(index)}>
                    <StepLabel>{label}</StepLabel>
                  </StepButton>
                </Step>
              ))}
            </Stepper>
            <div>
              {getStepContent(activeStep)}
            </div>
          </Box>
          </Grid2>
        </Container>
        <Button onClick={handleNext}>Next</Button>
        <Button onClick={handleBack}>Back</Button>
      </main>
    </div>
  );
}
