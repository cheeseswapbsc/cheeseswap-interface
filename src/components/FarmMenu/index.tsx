import React, { useRef } from 'react'
import styled from 'styled-components'
// import { ReactComponent as MenuIcon } from '../../assets/images/menu.svg'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import useToggle from '../../hooks/useToggle'
import { ExternalLink } from '../Shared'


const StyledMenuButton = styled.div`
  width: 100%;
  height: 100%;
`

const StyledMenu = styled.div`
  margin-left: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border: 2px;
  text-align: left;
`

const MenuFlyout = styled.span`
  min-width: 9rem;
  background-color: ${({ theme }) => theme.colors.bg1};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);
  border: 2px solid ${({ theme }) => theme.colors.bg3};
  border-radius: 0.5rem;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  font-size: 1.1rem;
  position: absolute;
  top: 3rem;
  right: 0rem;
  z-index: 100;
`

const MenuItem = styled(ExternalLink)`
  flex: 1;
  display: flex;
  line-height: 18px;
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


export default function FarmMenu() {
  const node = useRef<HTMLDivElement>()
  const [open, toggle] = useToggle(false)

  useOnClickOutside(node, open ? toggle : undefined)

  return (
    // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/30451
    <StyledMenu ref={node as any}>
      <StyledMenuButton onClick={toggle}>
        Farms
      </StyledMenuButton>
      {open && (
        <MenuFlyout>
          <MenuItem id="link" href="https://cid.bscindex.com/">
            CID Farm
          </MenuItem>
          <MenuItem id="link" href="https://pid.bscindex.com/">
            PKID Farm
          </MenuItem>
          <MenuItem id="link" href="https://kiwiswap.finance/">
            Kiwi Farm
          </MenuItem>
          <MenuItem id="link" href="https://pizzafinance.app/">
            Pizza Farm
          </MenuItem>
          <MenuItem id="link" href="https://hotdog.cafe/">
            Hots Farm
          </MenuItem>
          <MenuItem id="link" href="https://cheesemaker.farm/">
            cNFT Farm
          </MenuItem>
        </MenuFlyout>
      )}
    </StyledMenu>
  )
}
