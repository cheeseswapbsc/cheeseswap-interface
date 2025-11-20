import React from 'react'
import styled, { css } from 'styled-components'
import { animated, useTransition } from 'react-spring'
import { DialogOverlay, DialogContent } from '@reach/dialog'
import { isMobile } from 'react-device-detect'
import '@reach/dialog/styles.css'

const AnimatedDialogOverlay = animated(DialogOverlay)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StyledDialogOverlay = styled(AnimatedDialogOverlay)`
  &[data-reach-dialog-overlay] {
    z-index: 2;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${({ theme }) => theme.colors.modalBG};
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    transition: backdrop-filter 0.3s ease;
  }
`

const AnimatedDialogContent = animated(DialogContent)
// destructure to not pass custom props to Dialog DOM element
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StyledDialogContent = styled(({ minHeight, maxHeight, mobile, isOpen, ...rest }) => (
  <AnimatedDialogContent {...rest} />
)).attrs({
  'aria-label': 'dialog'
})`
  &[data-reach-dialog-content] {
    margin: 6rem 0 2rem 0;
    border: 1px solid ${({ theme }) => theme.colors.bg3}40;
    background: ${({ theme }) => theme.colors.bg1};
    backdrop-filter: blur(40px);
    -webkit-backdrop-filter: blur(40px);
    box-shadow: 
      0 10px 40px -8px rgba(0, 0, 0, 0.2),
      0 4px 16px -4px rgba(0, 0, 0, 0.25);
    padding: 0px;
    width: 50vw;
    overflow: hidden;
    align-self: ${({ mobile }) => (mobile ? 'flex-end' : 'center')};
    max-width: 480px;
    ${({ maxHeight, mobile }) =>
      maxHeight &&
      css`
        max-height: ${mobile ? `calc(${maxHeight}vh - 5rem)` : `calc(${maxHeight}vh - 8rem)`};
      `}
    ${({ minHeight, mobile }) =>
      minHeight &&
      css`
        min-height: ${mobile ? `calc(${minHeight}vh - 5rem)` : `calc(${minHeight}vh - 8rem)`};
      `}
    display: flex;
    border-radius: 20px;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    
    ${({ theme }) => theme.mediaWidth.upToMedium`
      width: 65vw;
      margin: 5rem 0.5rem 1.5rem 0.5rem;
    `}
    ${({ theme, mobile }) => theme.mediaWidth.upToSmall`
      width: 85vw;
      margin: 4.5rem 0.5rem 1rem 0.5rem;
      border-radius: 20px;
      ${mobile &&
        css`
          width: 100vw;
          margin: 4rem 0 0 0;
          border-bottom-left-radius: 0;
          border-bottom-right-radius: 0;
        `}
    `}
    ${({ theme }) => theme.mediaWidth.upToExtraSmall`
      margin: 4rem 0.5rem 1rem 0.5rem;
    `}
  }
`

interface ModalProps {
  isOpen: boolean
  onDismiss: () => void
  minHeight?: number | false
  maxHeight?: number
  initialFocusRef?: React.RefObject<any>
  children?: React.ReactNode
}

export default function Modal({
  isOpen,
  onDismiss,
  minHeight = false,
  maxHeight = 50,
  initialFocusRef,
  children
}: ModalProps) {
  const fadeTransition = useTransition(isOpen, null, {
    config: { duration: 250, tension: 280, friction: 28 },
    from: { opacity: 0, transform: 'scale(0.96)' },
    enter: { opacity: 1, transform: 'scale(1)' },
    leave: { opacity: 0, transform: 'scale(0.96)' }
  })

  return (
    <>
      {fadeTransition.map(
        ({ item, key, props }) =>
          item && (
            <StyledDialogOverlay key={key} style={props} onDismiss={onDismiss} initialFocusRef={initialFocusRef}>
              <StyledDialogContent
                aria-label="dialog content"
                minHeight={minHeight}
                maxHeight={maxHeight}
                mobile={isMobile}
              >
                {/* prevents the automatic focusing of inputs on mobile by the reach dialog */}
                {!initialFocusRef && isMobile ? <div tabIndex={1} /> : null}
                {children}
              </StyledDialogContent>
            </StyledDialogOverlay>
          )
      )}
    </>
  )
}
