import React from 'react'
import styled from 'styled-components'

export const BodyWrapper = styled.div`
  position: relative;
  max-width: 480px;
  width: 100%;
  background: ${({ theme }) => theme.colors.bg1};
  border: 2px solid ${({ theme }) => theme.colors.primary6};
  box-shadow: 0px 6px 10px rgba(0,0,0,0.05);
  border-radius: 20px;
  padding: 0.75rem;
`

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function AppBody({ children }: { children: React.ReactNode }) {
  return <BodyWrapper>{children}</BodyWrapper>
}
