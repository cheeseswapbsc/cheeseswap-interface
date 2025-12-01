import React from 'react'
import styled from 'styled-components'
import { darken, lighten } from 'polished'

import { RowBetween } from '../Row'
import { ChevronDown } from 'react-feather'
import { Button as RebassButton, ButtonProps } from 'rebass/styled-components'

const Base = styled(RebassButton)<{
  padding?: string
  width?: string
  borderRadius?: string
  altDisabledStyle?: boolean
}>`
  padding: ${({ padding }) => (padding ? padding : '14px 20px')};
  width: ${({ width }) => (width ? width : '100%')};
  font-weight: 600;
  text-align: center;
  border-radius: ${({ borderRadius }) => borderRadius ? borderRadius : '12px'};
  outline: none;
  border: 2px solid transparent;
  color: white;
  text-decoration: none;
  display: flex;
  justify-content: center;
  flex-wrap: nowrap;
  align-items: center;
  cursor: pointer;
  position: relative;
  z-index: 1;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 16px;
  letter-spacing: 0.02em;
  
  &:disabled {
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  > * {
    user-select: none;
  }
`

export const ButtonPrimary = styled(Base)`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary1} 0%, ${({ theme }) => theme.colors.primary2} 100%);
  color: ${({ theme }) => theme.colors.buttonText};
  box-shadow: none !important;
  
  &:hover:not(:disabled) {
    box-shadow: none !important;
    background: linear-gradient(135deg, ${({ theme }) => lighten(0.05, theme.colors.primary1)} 0%, ${({ theme }) => lighten(0.05, theme.colors.primary2)} 100%);
  }
  
  &:focus {
    box-shadow: none !important;
  }
  
  &:active:not(:disabled) {
    box-shadow: none !important;
  }
  
  &:disabled {
    background: ${({ theme, altDisabledStyle }) => (altDisabledStyle ? `linear-gradient(135deg, ${theme.colors.primary1} 0%, ${theme.colors.primary2} 100%)` : theme.colors.bg3)};
    color: ${({ theme, altDisabledStyle }) => (altDisabledStyle ? 'white' : theme.colors.text3)};
    box-shadow: none !important;
    border: 2px solid transparent;
    opacity: ${({ altDisabledStyle }) => (altDisabledStyle ? '0.5' : '0.6')};
  }
`

export const ButtonLight = styled(Base)`
  background: ${({ theme }) => theme.colors.primary6};
  color: ${({ theme }) => theme.colors.primary1};
  font-size: 16px;
  font-weight: 600;
  border: 2px solid transparent;
  pointer-events: auto;
  user-select: none;
  
  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primary5};
    border-color: ${({ theme }) => theme.colors.primary3};
  }
  
  &:focus {
    box-shadow: none !important;
    border-color: ${({ theme }) => theme.colors.primary1};
  }
  
  &:active:not(:disabled) {
    background: ${({ theme }) => darken(0.02, theme.colors.primary5)};
  }
  
  &:disabled {
    opacity: 0.4;
    background: ${({ theme }) => theme.colors.bg3};
    color: ${({ theme }) => theme.colors.text4};
    cursor: not-allowed;
  }
`

export const ButtonGray = styled(Base)`
  background-color: ${({ theme }) => theme.colors.bg3};
  color: ${({ theme }) => theme.colors.text2};
  font-size: 14px;
  font-weight: 700;
  &:focus {
    box-shadow: none !important;
    background-color: ${({ theme, disabled }) => !disabled && darken(0.05, theme.colors.bg2)};
  }
  &:hover {
    background-color: ${({ theme, disabled }) => !disabled && darken(0.05, theme.colors.bg2)};
  }
  &:active {
    box-shadow: none !important;
    background-color: ${({ theme, disabled }) => !disabled && darken(0.1, theme.colors.bg2)};
  }
`

export const ButtonSecondary = styled(Base)`
  background-color: ${({ theme }) => theme.colors.primary5};
  color: ${({ theme }) => theme.colors.primaryText1};
  font-size: 14px;
  border-radius: 8px;
  padding: ${({ padding }) => (padding ? padding : '10px')};

  &:focus {
    box-shadow: none !important;
    background-color: ${({ theme }) => theme.colors.primary4};
  }
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary4};
  }
  &:active {
    box-shadow: none !important;
    background-color: ${({ theme }) => theme.colors.primary4};
  }
  &:disabled {
    background-color: ${({ theme }) => theme.colors.primary5};
    opacity: 50%;
    cursor: auto;
  }
`

export const ButtonPink = styled(Base)`
  background-color: ${({ theme }) => theme.colors.primary1};
  color: white;

  &:focus {
    box-shadow: none !important;
    background-color: ${({ theme }) => darken(0.05, theme.colors.primary1)};
  }
  &:hover {
    background-color: ${({ theme }) => darken(0.05, theme.colors.primary1)};
  }
  &:active {
    box-shadow: none !important;
    background-color: ${({ theme }) => darken(0.1, theme.colors.primary1)};
  }
  &:disabled {
    background-color: ${({ theme }) => theme.colors.primary1};
    opacity: 50%;
    cursor: auto;
  }
`

export const ButtonOutlined = styled(Base)`
  border: 2px solid ${({ theme }) => theme.colors.primary1};
  background-color: transparent;
  color: ${({ theme }) => theme.colors.primary1};
  backdrop-filter: blur(10px);

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.primary6};
    border-color: ${({ theme }) => theme.colors.primary2};
  }
  
  &:focus {
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary6};
  }
  
  &:active:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.primary5};
  }
  
  &:disabled {
    opacity: 0.4;
    border-color: ${({ theme }) => theme.colors.bg4};
    color: ${({ theme }) => theme.colors.text4};
  }
`

export const ButtonEmpty = styled(Base)`
  background-color: transparent;
  color: ${({ theme }) => theme.colors.primary1};
  display: flex;
  justify-content: center;
  align-items: center;

  &:focus {
    background-color: ${({ theme }) => theme.colors.advancedBG};
  }
  &:hover {
    background-color: ${({ theme }) => theme.colors.advancedBG};
  }
  &:active {
    background-color: ${({ theme }) => theme.colors.advancedBG};
  }
  &:disabled {
    opacity: 50%;
    cursor: auto;
  }
`

export const ButtonWhite = styled(Base)`
  border: 2px solid #edeef2;
  background-color: ${({ theme }) => theme.colors.bg1};
  color: black;

  &:focus {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    box-shadow: 0 0 0 1pt ${darken(0.05, '#edeef2')};
  }
  &:hover {
    box-shadow: 0 0 0 1pt ${darken(0.1, '#edeef2')};
  }
  &:active {
    box-shadow: 0 0 0 1pt ${darken(0.1, '#edeef2')};
  }
  &:disabled {
    opacity: 50%;
    cursor: auto;
  }
`

const ButtonConfirmedStyle = styled(Base)`
  background-color: ${({ theme }) => lighten(0.5, theme.colors.green1)};
  color: ${({ theme }) => theme.colors.green1};
  border: 2px solid ${({ theme }) => theme.colors.green1};

  &:disabled {
    opacity: 50%;
    cursor: auto;
  }
`

const ButtonErrorStyle = styled(Base)`
  background-color: ${({ theme }) => theme.colors.red1};
  border: 2px solid ${({ theme }) => theme.colors.red1};

  &:focus {
    box-shadow: none !important;
    background-color: ${({ theme }) => darken(0.05, theme.colors.red1)};
  }
  &:hover {
    background-color: ${({ theme }) => darken(0.05, theme.colors.red1)};
  }
  &:active {
    box-shadow: none !important;
    background-color: ${({ theme }) => darken(0.1, theme.colors.red1)};
  }
  &:disabled {
    opacity: 50%;
    cursor: auto;
    box-shadow: none;
    background-color: ${({ theme }) => theme.colors.red1};
    border: 2px solid ${({ theme }) => theme.colors.red1};
  }
`

export function ButtonConfirmed({
  confirmed,
  altDisabledStyle,
  ...rest
}: { confirmed?: boolean; altDisabledStyle?: boolean } & ButtonProps) {
  if (confirmed) {
    return <ButtonConfirmedStyle {...rest} />
  } else {
    return <ButtonPrimary {...rest} altDisabledStyle={altDisabledStyle} />
  }
}

export function ButtonError({ error, ...rest }: { error?: boolean } & ButtonProps) {
  if (error) {
    return <ButtonErrorStyle {...rest} />
  } else {
    return <ButtonPrimary {...rest} />
  }
}

export function ButtonDropdown({ disabled = false, children, ...rest }: { disabled?: boolean } & ButtonProps) {
  return (
    <ButtonPrimary {...rest} disabled={disabled}>
      <RowBetween>
        <div style={{ display: 'flex', alignItems: 'center' }}>{children}</div>
        <ChevronDown size={24} />
      </RowBetween>
    </ButtonPrimary>
  )
}

export function ButtonDropdownLight({ disabled = false, children, ...rest }: { disabled?: boolean } & ButtonProps) {
  return (
    <ButtonOutlined {...rest} disabled={disabled}>
      <RowBetween>
        <div style={{ display: 'flex', alignItems: 'center' }}>{children}</div>
        <ChevronDown size={24} />
      </RowBetween>
    </ButtonOutlined>
  )
}

export function ButtonRadio({ active, ...rest }: { active?: boolean } & ButtonProps) {
  if (!active) {
    return <ButtonWhite {...rest} />
  } else {
    return <ButtonPrimary {...rest} />
  }
}
