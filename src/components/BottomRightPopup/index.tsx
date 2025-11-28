import React, { useState } from 'react'
import styled from 'styled-components'
import { X } from 'react-feather'

const PopupContainer = styled.div<{ isVisible: boolean }>`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 320px;
  max-width: calc(100vw - 40px);
  background: linear-gradient(135deg, #ff4757 0%, #d63447 100%);
  border: 2px solid #ff6b7a;
  border-radius: 12px;
  box-shadow: 
    0 10px 40px -8px rgba(255, 71, 87, 0.5),
    0 4px 16px -4px rgba(214, 52, 71, 0.4);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  z-index: 1000;
  padding: 16px;
  display: ${({ isVisible }) => (isVisible ? 'block' : 'none')};
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from {
      transform: translateY(100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: calc(100vw - 40px);
    bottom: 10px;
    right: 10px;
  `};
`

const PopupHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`

const PopupTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  padding: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  transition: all 0.2s ease;
  border-radius: 4px;

  &:hover {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.3);
  }

  &:active {
    transform: scale(0.95);
  }
`

const PopupContent = styled.div`
  color: #ffffff;
  font-size: 14px;
  line-height: 1.6;

  p {
    margin: 0 0 12px 0;
    
    &:last-child {
      margin-bottom: 0;
    }
  }

  strong {
    color: #ffeb3b;
    font-weight: 700;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  }

  a {
    color: #ffeb3b;
    text-decoration: underline;
    font-weight: 600;
    
    &:hover {
      color: #fff9c4;
      text-decoration: underline;
    }
  }
`

interface BottomRightPopupProps {
  title?: string
  children?: React.ReactNode
  onClose?: () => void
  defaultVisible?: boolean
}

export default function BottomRightPopup({ 
  title = 'Important Notice', 
  children, 
  onClose,
  defaultVisible = true 
}: BottomRightPopupProps) {
  const [isVisible, setIsVisible] = useState(defaultVisible)

  const handleClose = () => {
    setIsVisible(false)
    if (onClose) {
      onClose()
    }
  }

  const defaultContent = (
    <>
      <p>Hello PIZZA farmers,</p>
      <p>
        For the sustainability of Pizza Farming project, we PIZZA team decided to <strong>SHUT-DOWN</strong> PIZZA staking/pool from <strong>01:00 UTC, 10 December 2025</strong>.
      </p>
      <p>
        Please <strong>UNSTAKE</strong> your PIZZA before given date and time.
      </p>
      <p>
        Pool link: <a href="https://pizza.cheeseswap.app/#/pools" target="_blank" rel="noopener noreferrer">Pizza Pool</a>
      </p>
    </>
  )

  return (
    <PopupContainer isVisible={isVisible}>
      <PopupHeader>
        <PopupTitle>{title}</PopupTitle>
        <CloseButton onClick={handleClose} aria-label="Close">
          <X size={20} />
        </CloseButton>
      </PopupHeader>
      <PopupContent>{children || defaultContent}</PopupContent>
    </PopupContainer>
  )
}
