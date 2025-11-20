import React from 'react'
import styled from 'styled-components'
import { CardProps, Text } from 'rebass'
import { Box } from 'rebass/styled-components'

const Card = styled(Box)<{ padding?: string; border?: string; borderRadius?: string; flat?: boolean }>`
  width: 100%;
  border-radius: ${({ borderRadius }) => borderRadius || '16px'};
  padding: ${({ padding }) => padding || '20px'};
  border: ${({ border }) => border || 'none'};
  backdrop-filter: blur(20px);
  background: ${({ theme }) => theme.colors.bg1};
  box-shadow: ${({ flat }) => (flat ? 'none' : '0 4px 24px rgba(0, 0, 0, 0.08)')};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    box-shadow: ${({ flat }) => (flat ? 'none' : '0 8px 32px rgba(0, 0, 0, 0.12)')};
  }
`
export default Card

export const LightCard = styled(Card)`
  border: 1px solid ${({ theme }) => theme.colors.bg3};
  background: ${({ theme }) => theme.colors.bg1};
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
`

export const GreyCard = styled(Card)`
  background: ${({ theme }) => theme.colors.bg2};
  border: 1px solid ${({ theme }) => theme.colors.bg3};
`

export const OutlineCard = styled(Card)`
  border: 2px solid ${({ theme }) => theme.colors.primary1};
  background: ${({ theme }) => theme.colors.bg1};
  box-shadow: 0 0 0 1px ${({ theme }) => theme.colors.primary6};
`

export const YellowCard = styled(Card)`
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.05) 100%);
  border: 1px solid rgba(245, 158, 11, 0.3);
  color: ${({ theme }) => theme.colors.yellow2};
  font-weight: 600;
  backdrop-filter: blur(10px);
`

export const PinkCard = styled(Card)`
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(219, 39, 119, 0.05) 100%);
  border: 1px solid rgba(236, 72, 153, 0.3);
  color: ${({ theme }) => theme.colors.primary1};
  font-weight: 600;
  backdrop-filter: blur(10px);
`

const BlueCardStyled = styled(Card)`
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.05) 100%);
  border: 1px solid rgba(59, 130, 246, 0.3);
  color: ${({ theme }) => theme.colors.primary1};
  border-radius: 16px;
  width: fit-content;
  backdrop-filter: blur(10px);
`

export const BlueCard = ({ children, ...rest }: CardProps) => {
  return (
    <BlueCardStyled {...rest}>
      <Text fontWeight={600} color="#3B82F6">
        {children}
      </Text>
    </BlueCardStyled>
  )
}
