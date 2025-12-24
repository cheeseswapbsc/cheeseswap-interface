import React from 'react'
import { NavLink } from 'react-router-dom'
import { ChevronDown } from 'react-feather'
import styled, { css } from 'styled-components'

type LinkItem = {
  label: string
  href?: string
  to?: string
}

const PRIMARY_LINKS: LinkItem[] = [
  { label: 'Swap', to: '/swap' },
  { label: 'Transactions', to: '/transactions' }
]

const FARMS_LINKS: LinkItem[] = [
  { label: 'Pizza Farm', href: 'https://pizza.cheeseswap.app' },
  { label: 'Kiwi Farm', href: 'https://kiwi.cheeseswap.app' },
  { label: 'Mango Farm', href: 'https://mango.cheeseswap.app' },
  { label: 'HOTS Farm', href: 'https://hots.cheeseswap.app' },
  { label: 'CNFT Farm', href: 'https://cnft.cheeseswap.app' }
]

const ANALYTICS_LINKS: LinkItem[] = [
  { label: 'Dashboard', href: 'https://info.cheeseswap.app' },
  { label: 'CoinMarketCap', href: 'https://coinmarketcap.com/exchanges/cheeseswap/' },
  { label: 'CoinGecko', href: 'https://www.coingecko.com/en/coins/cheeseswap' }
]

const MORE_LINKS: LinkItem[] = [
  { label: 'Transactions', to: '/transactions' },
  { label: 'Docs', href: 'https://docs.cheeseswap.app' },
  { label: 'API', href: 'https://api.cheeseswap.app' },
  { label: 'Audit (CertiK)', href: 'https://certik.org/projects/cheeseswap/' },
  { label: 'Telegram', href: 'https://t.me/cheesemakerfarm' },
  { label: 'Github', href: 'https://github.com/cheeseswapbsc/' }
]

const Nav: React.FC = () => {
  return (
    <StyledNav>
      {PRIMARY_LINKS.map(link => (
        <StyledRouterLink key={link.label} to={link.to ?? '/'} exact>
          {link.label}
        </StyledRouterLink>
      ))}
      <Dropdown label="Farms" items={FARMS_LINKS} />
      <Dropdown label="Analytics" items={ANALYTICS_LINKS} />
      <Dropdown label="More" items={MORE_LINKS} />
    </StyledNav>
  )
}

const StyledNav = styled.nav`
  align-items: center;
  display: flex;
  font-size: 16px;
  line-height: 45px;
  font-weight: 700;
  gap: 0.5rem;
  flex: 1;
  justify-content: flex-start;
  flex-wrap: nowrap;

  @media (max-width: 1280px) {
    font-size: 14px;
    gap: 0.35rem;
  }

  @media (max-width: 960px) {
    display: none;
  }
`

const navItemStyles = css`
  align-items: center;
  color: ${({ theme }) => theme.colors.text1};
  display: inline-flex;
  font-weight: 700;
  padding: 0 10px;
  text-decoration: none;
  white-space: nowrap;
  transition: color 0.2s ease, opacity 0.2s ease;

  &:hover,
  &.active {
    color: ${({ theme }) => theme.colors.primary1};
  }

  @media (max-width: 1280px) {
    padding: 0 6px;
  }

  @media (max-width: 1100px) {
    padding: 0 4px;
    font-size: 0.9em;
  }
`

const StyledRouterLink = styled(NavLink).attrs({ activeClassName: 'active' })`
  ${navItemStyles}
`

const DropdownToggle = styled.button`
  ${navItemStyles}
  background: transparent;
  border: none;
  cursor: pointer;
  gap: 0.25rem;
  padding-right: 6px;

  svg {
    transition: transform 0.2s ease;
  }

  &:focus {
    outline: none;
  }
`

const DropdownMenu = styled.div`
  position: absolute;
  top: calc(100% - 4px);
  left: 0;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.bg1};
  padding: 0.35rem 0.25rem;
  border-radius: 0.5rem;
  min-width: 180px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
  border: 1px solid ${({ theme }) => theme.colors.bg3};
  opacity: 0;
  pointer-events: none;
  transform: translateY(12px);
  transition: opacity 0.15s ease, transform 0.2s ease;
  z-index: 5;
`

const DropdownWrapper = styled.div`
  position: relative;
  display: inline-flex;

  &:hover ${DropdownMenu},
  &:focus-within ${DropdownMenu} {
    opacity: 1;
    pointer-events: auto;
    transform: translateY(0);
  }

  &:hover ${DropdownToggle} svg,
  &:focus-within ${DropdownToggle} svg {
    transform: rotate(180deg);
  }
`

const dropdownItemStyles = css`
  border-radius: 0.4rem;
  color: ${({ theme }) => theme.colors.text1};
  font-weight: 600;
  padding: 0.45rem 0.75rem;
  text-decoration: none;
  transition: background 0.15s ease, color 0.15s ease;

  &:hover,
  &.active {
    background: ${({ theme }) => theme.colors.bg3};
    color: ${({ theme }) => theme.colors.primary1};
  }
`

const DropdownExternalLink = styled.a`
  ${dropdownItemStyles}
`

const DropdownRouterLink = styled(NavLink).attrs({ activeClassName: 'active' })`
  ${dropdownItemStyles}
`

interface DropdownProps {
  label: string
  items: LinkItem[]
}

const Dropdown: React.FC<DropdownProps> = ({ label, items }) => {
  return (
    <DropdownWrapper>
      <DropdownToggle type="button">
        {label}
        <ChevronDown size={16} />
      </DropdownToggle>
      <DropdownMenu>
        {items.map(item =>
          item.to ? (
            <DropdownRouterLink key={item.label} to={item.to} exact>
              {item.label}
            </DropdownRouterLink>
          ) : (
            <DropdownExternalLink
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {item.label}
            </DropdownExternalLink>
          )
        )}
      </DropdownMenu>
    </DropdownWrapper>
  )
}

export default Nav
