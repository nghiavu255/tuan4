import React, { useState, useCallback } from 'react';
import { Frame, TopBar } from '@shopify/polaris';

export const AppLayout = ({ children }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] =
    useState(false);
  const toggleIsUserMenuOpen = useCallback(
    () =>
      setIsUserMenuOpen(
        (isUserMenuOpen) => !isUserMenuOpen
      ),
    []
  );
  const userMenuMarkup = (
    <TopBar.UserMenu
      detail="Xquenda Andreev"
      initials="D"
      open={isUserMenuOpen}
      onToggle={toggleIsUserMenuOpen}
    />
  );
  const topBarMarkup = (
    <TopBar
      showNavigationToggle
      userMenu={userMenuMarkup}
    />
  );
  return <Frame topBar={topBarMarkup}>{children}</Frame>;
};
