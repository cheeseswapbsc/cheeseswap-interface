import React from 'react'
import { Text, TextProps } from 'rebass'
import styled from 'styled-components'

const TextWrapper = styled(Text)<{ color: string }>`
  color: ${({ color, theme }) => (theme.colors as any)[color]};
`

export const TYPE = {
  main(props: TextProps) {
    return <TextWrapper fontWeight={700} color={'text2'} {...props} />
  },
  link(props: TextProps) {
    return <TextWrapper fontWeight={700} color={'primary1'} {...props} />
  },
  black(props: TextProps) {
    return <TextWrapper fontWeight={700} color={'text1'} {...props} />
  },
  body(props: TextProps) {
    return <TextWrapper fontWeight={600} fontSize={16} color={'text1'} {...props} />
  },
  largeHeader(props: TextProps) {
    return <TextWrapper fontWeight={600} fontSize={24} {...props} />
  },
  mediumHeader(props: TextProps) {
    return <TextWrapper fontWeight={700} fontSize={18} {...props} />
  },
  subHeader(props: TextProps) {
    return <TextWrapper fontWeight={600} fontSize={14} {...props} />
  },
  blue(props: TextProps) {
    return <TextWrapper fontWeight={700} color={'primary1'} {...props} />
  },
  darkGray(props: TextProps) {
    return <TextWrapper fontWeight={700} color={'text3'} {...props} />
  },
  italic(props: TextProps) {
    return <TextWrapper fontWeight={700} fontSize={13} fontStyle={'italic'} color={'text2'} {...props} />
  },
  error({ error, ...props }: { error: boolean } & TextProps) {
    return <TextWrapper fontWeight={700} color={error ? 'red1' : 'text2'} {...props} />
  }
}
