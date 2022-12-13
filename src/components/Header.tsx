import React from 'react';
import styled from 'styled-components';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import SettingsIcon from '@mui/icons-material/Settings';
import { Container } from '../App';
import { Typography } from '@mui/material';

type HeaderProps = {
  children: React.ReactNode;
};

const CssFormControl = styled(FormControl)({
  '& label.Mui-focused': {
    color: '#fff',
  },
  '& .MuiFormLabel-root': {
    color: 'rgba(255,255,255,0.6)',
  },
  '& .MuiInputBase-input': {
    color: '#fff'
  },
  '& .MuiInputBase-root': {
    '& fieldset': {
      borderColor: 'rgba(255,255,255,0.6)',
    },
    '&:hover fieldset': {
      borderColor: '#fff',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#fff',
    },
  },
  '& .MuiSvgIcon-root': {
    fill: '#fff'
  }
});

const Row = styled.div`
  display: flex;
  align-items: center;
  &.space-top {
    margin-top: 10px;
  }
  .greedy {
    flex: 1;
  }
  .icon {
    line-height: 0;
    padding-left: 10px;
    cursor: pointer;
  }
`;

const Header: React.FC<HeaderProps> = (props) => {
  return (
    <div style={{background: 'rgba(21, 71, 148, 0.8)', padding: '10px 0', marginBottom: '10px'}}>
      <Container>
        <Row>
          <div className="greedy">
            {props.children}
          </div>
          <div className="icon">
            <SettingsIcon sx={{ color: '#fff'}}/>
          </div>
        </Row>
        <Row className="space-top">
          <CssFormControl sx={{ minWidth: 120}} size='small'>
            <InputLabel id="demo-simple-select-label">Season</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Season"
              // value={age}
              // onChange={handleChange}
            >
              <MenuItem value={10}>Spring</MenuItem>
              <MenuItem value={20}>Summer</MenuItem>
              <MenuItem value={30}>Fall</MenuItem>
              <MenuItem value={30}>Winter</MenuItem>
            </Select>
          </CssFormControl>
          <CssFormControl sx={{ minWidth: 120, ml: 1 }} size='small'>
            <InputLabel id="demo-simple-select-label">Year</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Year"
              // value={age}
              // onChange={handleChange}
            >
              <MenuItem value={10}>First Year</MenuItem>
              <MenuItem value={20}>2+ Year</MenuItem>
            </Select>
          </CssFormControl>
          <div style={{paddingLeft: 10}}>
            <Typography variant="body2" sx={{color: '#fff'}}>
              for more accurate cost calculation
            </Typography>
          </div>
        </Row>
      </Container>
    </div>
  );
};

export default Header;
