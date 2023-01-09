import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import { AppBar, Toolbar, IconButton, Typography, Menu, Container, Avatar, Tooltip } from "@mui/material";
import { Box } from "@mui/system";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";

import NavBarMenu from "./NavBarMenu";

import { useAppSelector } from 'store/hook';
import { userSelector } from "store/userSlice";

import { IUser } from "types/userTypes";

import "./navBar.scss";

const Base_URL = process.env.REACT_APP_BACKEND_URL;

const NavBar: React.FC = () => {
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

    const user: IUser = useAppSelector(userSelector);
    const userAvatarURL =
        user.avatarURL ? Base_URL + user.avatarURL : "/";
    const userName = user.name;

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return (
        <AppBar position="static">
            <Container maxWidth="xl" className="navbar">
                <Toolbar disableGutters>
                    <AssignmentTurnedInIcon sx={{ mr: 1 }} />
                    <Typography
                        component={RouterLink}
                        to={userName ? "/" : "/login"}
                        className="navbar link_text"
                    >
                        TodoList
                    </Typography>
                    {userName &&
                        <>
                            <Typography sx={{ mr: 3 }}>{userName}</Typography>
                            <Box>
                                <Tooltip title="Open settings" arrow>
                                    <IconButton
                                        onClick={handleOpenUserMenu}
                                        sx={{ p: 0 }}
                                    >
                                        <Avatar
                                            alt={userName || "TodoList"}
                                            src={userAvatarURL}
                                        />
                                    </IconButton>
                                </Tooltip>
                                <Menu
                                    sx={{ mt: "45px" }}
                                    id="menu-appbar"
                                    anchorEl={anchorElUser}
                                    anchorOrigin={{
                                        vertical: "top",
                                        horizontal: "right",
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: "top",
                                        horizontal: "right",
                                    }}
                                    open={Boolean(anchorElUser)}
                                    onClose={handleCloseUserMenu}
                                >
                                    <Box
                                        sx={{ display: "block" }}
                                        onClick={handleCloseUserMenu}
                                    >
                                        <NavBarMenu />
                                    </Box>
                                </Menu>
                            </Box>
                        </>
                    }
                </Toolbar>
            </Container>
        </AppBar>
    );
};
export default NavBar;
