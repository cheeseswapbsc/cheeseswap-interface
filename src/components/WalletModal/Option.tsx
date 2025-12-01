
import React from 'react';
import { AiOutlineInfoCircle as AiOutlineInfoCircleRaw } from 'react-icons/ai';
import type { IconBaseProps } from 'react-icons/lib';
import styled, { keyframes } from 'styled-components';
import { ExternalLink } from '../Shared';

const AiOutlineInfoCircle = AiOutlineInfoCircleRaw as React.ComponentType<IconBaseProps>;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const InfoCard = styled.button<{ active?: boolean }>`
  background: ${({ theme, active }) => 
    active 
      ? `linear-gradient(135deg, ${theme.colors.primary1}12 0%, ${theme.colors.primary1}05 100%)`
      : theme.colors.bg2};
  padding: 0.65rem;
  outline: none;
  border: 1px solid;
  border-radius: 10px;
  width: 100%;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  animation: ${slideIn} 0.3s ease-out;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, transparent 0%, ${({ theme }) => theme.colors.primary1}05 100%);
    opacity: 0;
    transition: opacity 0.2s ease;
  }
  
  &:focus {
    box-shadow: none !important;
    border-color: ${({ theme }) => theme.colors.primary1};
  }
  
  border-color: ${({ theme, active }) => 
    active ? theme.colors.primary1 : theme.colors.bg3}40;
`

const OptionCard = styled(InfoCard as any)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.5rem;
  padding: 0.65rem 0.55rem;
  
  &:first-child {
    margin-top: 0;
  }
`

const OptionCardLeft = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap};
  justify-content: center;
  height: 100%;
`

const OptionCardClickable = styled(OptionCard as any)<{ clickable?: boolean }>`
  margin-top: 0;
  cursor: ${({ clickable }) => (clickable ? 'pointer' : 'default')};
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    ${({ clickable, theme }) => clickable && `
      border-color: ${theme.colors.primary1}80;
      transform: translateY(-1px);
      box-shadow: none !important;
      
      &::before {
        opacity: 1;
      }
    `}
  }
  
  &:active {
    ${({ clickable }) => clickable && `
      transform: translateY(0);
    `}
  }
  
  opacity: ${({ disabled }) => (disabled ? '0.5' : '1')};
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};
`

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
`

const GreenCircle = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  justify-content: center;
  align-items: center;

  &:first-child {
    height: 6.5px;
    width: 6.5px;
    margin-right: 6px;
    background-color: ${({ theme }) => theme.colors.green1};
    border-radius: 50%;
    box-shadow: none !important;
    animation: ${pulse} 2s ease-in-out infinite;
  }
`

const CircleWrapper = styled.div`
  color: ${({ theme }) => theme.colors.green1};
  display: flex;
  justify-content: center;
  align-items: center;
`

const HeaderText = styled.div`
  ${({ theme }) => theme.flexRowNoWrap};
  align-items: center;
  color: ${props =>
    props.color === 'blue' ? ({ theme }) => theme.colors.primary1 : ({ theme }) => theme.colors.text1};
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: -0.01em;
`

const SubHeader = styled.div`
  color: ${({ theme }) => theme.colors.text3};
  margin-top: 0.25rem;
  font-size: 0.6375rem;
  line-height: 1.4;
  font-weight: 400;
`

const IconWrapper = styled.div<{ size?: number | null }>`
  ${({ theme }) => theme.flexColumnNoWrap};
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.bg1};
  border-radius: 8px;
  padding: 0.25rem;
  transition: all 0.2s ease;
  
  & > img,
  span {
    height: ${({ size }) => (size ? size + 'px' : '24px')};
    width: ${({ size }) => (size ? size + 'px' : '24px')};
    object-fit: contain;
  }
  
  ${({ theme }) => theme.mediaWidth.upToMedium`
    align-items: center;
    padding: 0.2rem;
    
    & > img,
    span {
      height: 20px;
      width: 20px;
    }
  `};
`

type OptionProps = {
  link?: string | null
  clickable?: boolean
  size?: number | null
  onClick?: null | (() => void)
  color: string
  header: React.ReactNode
  subheader: React.ReactNode | null
  icon: string
  active?: boolean
  id: string
  statusLabel?: string
  tooltip?: string
}

export default function Option({
  link = null,
  clickable = true,
  size,
  onClick = null,
  color,
  header,
  subheader = null,
  icon,
  active = false,
  id,
  statusLabel = '',
  tooltip = ''
}: OptionProps) {
  const content = (
    <OptionCardClickable
      id={id}
      onClick={onClick}
      clickable={clickable && !active}
      active={active}
      role="button"
      aria-pressed={active}
      aria-label={typeof header === 'string' ? header : undefined}
      tabIndex={0}
      onKeyDown={e => {
        if ((e.key === 'Enter' || e.key === ' ') && onClick) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <OptionCardLeft>
        <HeaderText color={color}>
          {active ? (
            <CircleWrapper>
              <GreenCircle>
                <div />
              </GreenCircle>
            </CircleWrapper>
          ) : (
            ''
          )}
          {header}
          {tooltip && (
            <span style={{ marginLeft: 6, cursor: 'pointer' }} title={tooltip} aria-label={tooltip}>
              <AiOutlineInfoCircle size={16} />
            </span>
          )}
        </HeaderText>
        {subheader && <SubHeader>{subheader}</SubHeader>}
        {statusLabel && (
          <div style={{ fontSize: '0.7em', color: '#888', marginTop: 2 }}>{statusLabel}</div>
        )}
      </OptionCardLeft>
      <IconWrapper size={size}>
        <img src={icon} alt={typeof header === 'string' ? `${header} icon` : 'Wallet icon'} />
      </IconWrapper>
    </OptionCardClickable>
  )
  if (link) {
    return <ExternalLink href={link}>{content}</ExternalLink>
  }

  return content
}
