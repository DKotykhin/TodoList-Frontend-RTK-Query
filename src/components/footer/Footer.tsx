import React from 'react';

import { Typography } from "@mui/material";
import { Box } from "@mui/system";

import styles from './footer.module.scss';

const Footer: React.FC = () => {
    return (
        <Box className={styles.footer}>
            <Typography className={styles.footer__logo}>
                TodoList
            </Typography>
        </Box>
    )
}

export default Footer;