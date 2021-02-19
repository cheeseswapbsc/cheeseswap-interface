import React, { useRef } from 'react'
import { Lock, Code, PieChart, MessageCircle, DollarSign, Sunrise, Star } from 'react-feather'
import styled from 'styled-components'
import { ReactComponent as MenuIcon } from '../../assets/images/menu.svg'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import useToggle from '../../hooks/useToggle'
import { ExternalLink } from '../Shared'

const StyledMenuIcon = styled(MenuIcon)`
  path {
    stroke: ${({ theme }) => theme.colors.text1};
  }
`

const StyledMenuButton = styled.button`
  width: 100%;
  height: 100%;
  border: none;
  background-color: transparent;
  margin: 0;
  padding: 0;
  height: 36px;
  background-color: ${({ theme }) => theme.colors.bg3};

  padding: 0.15rem 0.5rem;
  border-radius: 0.5rem;

  :hover,
  :focus {
    cursor: pointer;
    outline: none;
    background-color: ${({ theme }) => theme.colors.bg4};
  }

  svg {
    margin-top: 3px;
  }
`

const StyledMenu = styled.div`
  margin-left: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border: none;
  text-align: left;
`

const MenuFlyout = styled.span`
  min-width: 8.125rem;
  background-color: ${({ theme }) => theme.colors.bg1};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);
  border: 2px solid ${({ theme }) => theme.colors.bg3};
  border-radius: 0.5rem;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  font-size: 1rem;
  position: absolute;
  top: 3rem;
  right: 0rem;
  z-index: 100;
`

const MenuItem = styled(ExternalLink)`
  flex: 1;
  display: flex;
  align-items: center;
  padding: 0.5rem 0.5rem;
  color: ${({ theme }) => theme.colors.text1};
  :hover {
    color: ${({ theme }) => theme.colors.text2};
    cursor: pointer;
    text-decoration: none;
  }
  > svg {
    margin-right: 8px;
  }
`

const CODE_LINK = 'https://github.com/cheeseswapbsc/'

export default function Menu() {
  const node = useRef<HTMLDivElement>()
  const [open, toggle] = useToggle(false)

  useOnClickOutside(node, open ? toggle : undefined)

  return (
    // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/30451
    <StyledMenu ref={node as any}>
      <StyledMenuButton onClick={toggle}>
        <StyledMenuIcon />
      </StyledMenuButton>
      {open && (
        <MenuFlyout>
          <MenuItem id="link" href="https://keep3rb.network/">
            <Lock size={14} />
            KP3RB
          </MenuItem>
          <MenuItem id="link" href="https://kiwiswap.finance/">
            <DollarSign size={14} />
            Kiwi🥝
          </MenuItem>
          <MenuItem id="link" href="https://pizzafinance.app/">
            <Star size={14} />
            Pizza🍕
          </MenuItem>
          <MenuItem id="link" href="https://farm.cheeseswap.app/">
            <Sunrise size={14} />
            Farm
          </MenuItem>
          <MenuItem id="link" href="https://info.cheeseswap.app/">
            <PieChart size={14} />
            Chart
          </MenuItem>
          <MenuItem id="link" href="https://t.me/cheesemakerfarm">
            <MessageCircle size={14} />
            Telegram
          </MenuItem>
          <MenuItem id="link" href={CODE_LINK}>
            <Code size={14} />
            Code
          </MenuItem>
        </MenuFlyout>
      )}
    </StyledMenu>
  )
}
