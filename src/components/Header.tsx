import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Shield, BarChart3, Settings, Plus } from 'lucide-react';
import { Container, colors, Button } from '../styles/components';

const HeaderWrapper = styled.header`
  background: white;
  border-bottom: 1px solid ${colors.gray[200]};
  position: sticky;
  top: 0;
  z-index: 50;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
`;

const HeaderContainer = styled(Container)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4rem;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: ${colors.primary[600]};
  
  &:hover {
    color: ${colors.primary[700]};
  }
`;

const Nav = styled.nav`
  display: none;
  
  @media (min-width: 768px) {
    display: flex;
    align-items: center;
    gap: 2rem;
  }
`;

const NavLink = styled(Link)<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  font-weight: 500;
  color: ${({ $isActive }) => $isActive ? colors.primary[600] : colors.gray[600]};
  background-color: ${({ $isActive }) => $isActive ? colors.primary[50] : 'transparent'};
  transition: all 0.2s ease-in-out;

  &:hover {
    color: ${colors.primary[600]};
    background-color: ${colors.primary[50]};
  }

  svg {
    width: 1rem;
    height: 1rem;
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const MobileMenuButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  background: ${colors.gray[100]};
  color: ${colors.gray[600]};
  
  @media (min-width: 768px) {
    display: none;
  }

  &:hover {
    background: ${colors.gray[200]};
  }
`;

const Header: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <HeaderWrapper>
      <HeaderContainer>
        <Logo to="/">
          <Shield size={28} />
          Scanmesite.com
        </Logo>

        <Nav>
          <NavLink to="/" $isActive={isActive('/')}>
            <BarChart3 />
            Dashboard
          </NavLink>
          <NavLink to="/scans" $isActive={isActive('/scans')}>
            <Shield />
            Scans
          </NavLink>
          <NavLink to="/settings" $isActive={isActive('/settings')}>
            <Settings />
            Settings
          </NavLink>
        </Nav>

        <Actions>
          <Button as={Link} to="/scans/new" size="sm">
            <Plus size={16} />
            New Scan
          </Button>
          
          <MobileMenuButton>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </MobileMenuButton>
        </Actions>
      </HeaderContainer>
    </HeaderWrapper>
  );
};

export default Header;
