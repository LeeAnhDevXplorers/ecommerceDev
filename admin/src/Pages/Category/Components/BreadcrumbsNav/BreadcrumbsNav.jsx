import React from 'react';
import { Breadcrumbs, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';
import HomeIcon from '@mui/icons-material/Home';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const StyleBreadcrumb = styled(Chip)(({ theme }) => {
  const backgroundColor =
    theme.palette.mode === 'light'
      ? theme.palette.grey[100]
      : theme.palette.grey[800];
  return {
    backgroundColor,
    height: theme.spacing(3),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    '&:hover, &:focus': { backgroundColor: theme.palette.grey[200] },
    '&:active': {
      boxShadow: theme.shadows[1],
      backgroundColor: theme.palette.grey[300],
    },
  };
});

const BreadcrumbsNav = () => (
  <Breadcrumbs aria-label="breadcrumb">
    <StyleBreadcrumb
      component="a"
      href="/"
      label="Dashboard"
      icon={<HomeIcon fontSize="small" />}
    />
    <StyleBreadcrumb
      href="#"
      label="Product Categories"
      deleteIcon={<ExpandMoreIcon />}
    />
    <StyleBreadcrumb label="Add Category" />
  </Breadcrumbs>
);

export default BreadcrumbsNav;
