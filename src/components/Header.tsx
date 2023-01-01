import React from 'react';
import styled from 'styled-components';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import SettingsIcon from '@mui/icons-material/Settings';
import { Info } from '@mui/icons-material';
import { Container } from '../routes/root';
import { Box, Paper, Typography } from '@mui/material';
import CalculatorConfigContext, { Season, Year } from '../context/CalculatorConfigContext';
import CraftingMaterials from '../components/CraftingMaterials';
import Modal from '@mui/material/Modal';

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
    margin-top: 20px;
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
  const [show, setShow] = React.useState<boolean>(false);
  const { config, setConfig } = React.useContext(CalculatorConfigContext);
  const [openModal, setOpenModal] = React.useState<boolean>(false);

  return (
    <div style={{background: 'rgba(21, 71, 148, 0.8)', padding: '10px 0', marginBottom: '10px'}}>
      <Container>
        <Row>
          <div className="greedy">
            {props.children}
          </div>
          <div className="icon"
            onClick={() => setShow(!show)}
          >
            <SettingsIcon sx={{ color: '#fff'}}/>
          </div>
          <div className="icon" onClick={() => {setOpenModal(true)}}>
            <Info sx={{ color: '#fff'}}/>
          </div>
        </Row>
        { show && (
          <Row className="space-top">
            <CssFormControl sx={{ minWidth: 120}} size='small'>
              <InputLabel id="demo-simple-select-label">Season</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Season"
                value={config?.season}
                onChange={(e) => setConfig({season: e.target.value as Season})}
              >
                <MenuItem value={Season.EMPTY}>Unspecified</MenuItem>
                <MenuItem value={Season.SPRING}>Spring</MenuItem>
                <MenuItem value={Season.SUMMER}>Summer</MenuItem>
                <MenuItem value={Season.FALL}>Fall</MenuItem>
                <MenuItem value={Season.WINTER}>Winter</MenuItem>
              </Select>
            </CssFormControl>
            <CssFormControl sx={{ minWidth: 120, ml: 1 }} size='small'>
              <InputLabel id="demo-simple-select-label">Year</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Year"
                value={config?.year}
                onChange={(e) => setConfig({year: e.target.value as Year})}
              >
                <MenuItem value={Year.EMPTY}>Unspecified</MenuItem>
                <MenuItem value={Year.ONE}>First Year</MenuItem>
                <MenuItem value={Year.TWO_PLUS}>2+ Year</MenuItem>
              </Select>
            </CssFormControl>
            <div style={{paddingLeft: 10}}>
              <Typography variant="body2" sx={{color: '#fff'}}>
                for more accurate cost calculation
              </Typography>
            </div>
          </Row>
        )}
      </Container>
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
      >
        <Paper sx={{p: 3, maxWidth: 1200, margin: '0 auto', mt: 2, bgColor: '#fff'}}>
          <CraftingMaterials />
        </Paper>
      </Modal>
    </div>
  );
};

export default Header;
