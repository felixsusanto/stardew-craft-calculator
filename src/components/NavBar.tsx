import { AppBar, Box, Button, Container } from '@mui/material';

const NavBar = () => {
  return (
    <AppBar position='static'>
      <Container maxWidth="xl">
        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
          {['Craftable', 'Cooking Recipes'].map((page) => (
            <Button
              key={page}
              // onClick={handleCloseNavMenu}
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              {page}
            </Button>
          ))}
        </Box>
      </Container>
    </AppBar>
  );
};

export default NavBar;
