import { AppBar, Box, Button, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import Routes, { RouteUrl } from '../Routes';

const NavBar = () => {
  return (
    <AppBar position='static'>
      <Container maxWidth="xl">
        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
          {Object.keys(Routes).map((page) => (
            <Button
              key={page}
              component={Link}
              to={page}
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              {Routes[page as RouteUrl]}
            </Button>
          ))}
        </Box>
      </Container>
    </AppBar>
  );
};

export default NavBar;
