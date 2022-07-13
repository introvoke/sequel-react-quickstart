import React from "react";
import {
  Box,
  Link,
  AppBar,
  Container,
  Toolbar,
  Menu,
  MenuItem,
  Typography,
  IconButton,
  Button,
  Avatar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";

import brandImg from "../assets/images/brand-img.png";

import { useLogout } from "../providers/AuthProvider";
import { useCompany } from "../providers/CompanyProvider";

const pages = [{ name: "Upcoming Events", route: "/events" }];

export function Nav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleNavigate = (to: string) => {
    setAnchorElNav(null);
    navigate(to);
  };

  const { data: company } = useCompany();
  const logout = useLogout();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <AppBar position="static">
      <Container>
        <Toolbar disableGutters>
          <Link
            to={company ? "/events" : "/login"}
            component={RouterLink}
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontWeight: 700,
              color: "inherit",
              textDecoration: "none",
            }}
          >
            {company && (
              <Avatar
                src={company.logo as string}
                sx={{ bgcolor: "common.white", color: "text.primary" }}
                variant="square"
              >
                {company.name?.[0] ?? ""}
              </Avatar>
            )}
            {!company && (
              <Box
                component="img"
                width="100%"
                maxWidth={100}
                maxHeight={50}
                src={brandImg}
              />
            )}
          </Link>
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={() => setAnchorElNav(null)}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {!!company &&
                pages.map(({ route, name }) => (
                  <MenuItem key={route} onClick={() => handleNavigate(route)}>
                    <Typography textAlign="center">{name}</Typography>
                  </MenuItem>
                ))}
              {!company && (
                <MenuItem onClick={() => handleNavigate("login")}>
                  <Typography textAlign="center">Login</Typography>
                </MenuItem>
              )}
            </Menu>
          </Box>
          {/* Pages */}
          {!!company && (
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {pages.map(({ route, name }) => (
                <Button
                  component={RouterLink}
                  to={route}
                  key={route}
                  sx={{
                    my: 2,
                    color: "#fff",
                    display: "block",
                    textDecoration: pathname === route ? "underline" : "none",
                  }}
                >
                  {name}
                </Button>
              ))}
            </Box>
          )}
          {/* Settings */}
          {!!company && (
            <Box sx={{ flexGrow: 0, display: "flex", alignItems: "center" }}>
              <Button
                endIcon={<LogoutIcon color="inherit" />}
                onClick={handleLogout}
                sx={{ color: "#fff" }}
              >
                Logout
              </Button>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
