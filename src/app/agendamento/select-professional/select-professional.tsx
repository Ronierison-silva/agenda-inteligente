'use client';
import { Checkbox, IconButton, Typography } from '@mui/material';
import Image from 'next/image';
import React from 'react'
import imgProfer from '../../assets/images/imgProfile.webp'
import styleProfessional from './select-professional.module.scss'
import { Colors } from '@/app/assets/theme/colors';
import { CheckCircleOutline, CheckCircleRounded, RadioButtonChecked, RadioButtonUnchecked, TaskAltOutlined } from '@mui/icons-material';

const imageStyle = {
  borderRadius: '2rem',
  border: '4px solid #fff',
  boxShadow: '0 0 0.2rem #00000070'
}

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

export default function SelectProfessional() {
  const [selected, setSelected] = React.useState(false);

  const SelectProfessinal = () => {
    setSelected((selected) => !selected);
  };

  return (
    <article className={styleProfessional.bgSecundary}>
      <div className={styleProfessional.cardProfessionalGrid}> 
        <div className={styleProfessional.cardProfessional} onClick={SelectProfessinal}>
          <Checkbox 
            {...label} 
            icon={<RadioButtonUnchecked color="primary" />} 
            checkedIcon={<CheckCircleRounded sx={{color:Colors.white}} />} 
            checked={selected}
            sx={{
              position:'absolute', 
              padding:'1rem', 
              zIndex:'2'
            }}
          />
          
          <div className={styleProfessional.cardProfessional__info}>
            <Typography
              sx={{
                color:Colors.white,
                fontWeight: 'bold',
                textTransform: 'uppercase',
                lineHeight: 1.2,
                fontSize: '0.9rem'
              }}
            >
              RONIERISON DA SILVA
            </Typography>
          </div>

          <div className="relative w-[195.2px] h-[256.4px]">
            <Image
              src={imgProfer}
              alt="Selecione o profissional"
              style={imageStyle}
              fill
              quality={100}
              className='object-cover'
            />
          </div>
        </div>
        <div className={styleProfessional.cardProfessional}>
          <Checkbox 
            {...label} 
            icon={<RadioButtonUnchecked color="primary" />} 
            checkedIcon={<CheckCircleRounded sx={{color:Colors.white}} />} 
            sx={{
              position:'absolute', 
              padding:'1rem', 
              zIndex:'2'
            }}
          />
          <div className={styleProfessional.cardProfessional__info}>
            <Typography
              sx={{
                color:Colors.white,
                fontWeight: 'bold',
                textTransform: 'uppercase',
                lineHeight: 1.2,
                fontSize: '0.9rem'
              }}
            >
              Robert Oliveira Silva
            </Typography>
          </div>

          <div className="relative w-[195.2px] h-[256.4px]">
            <Image
              src={imgProfer}
              alt="Selecione o profissional"
              style={imageStyle}
              fill
              quality={100}
              className='object-cover'
            />
          </div>
        </div>
      </div>
    </article>
  )
}
