import React from 'react'
import { Text, TextProps } from 'rebass'
import styled from 'styled-components'

const TextWrapper = styled(Text)<{ color: string }>`
  color: ${({ color, theme }) => (theme.colors as any)[color]};
`

const Main = (props: TextProps) => <TextWrapper fontWeight={700} color="text2" {...props} />
const Link = (props: TextProps) => <TextWrapper fontWeight={700} color="primary1" {...props} />
const Black = (props: TextProps) => <TextWrapper fontWeight={700} color="text1" {...props} />
const Body = (props: TextProps) => <TextWrapper fontWeight={600} fontSize={16} color="text1" {...props} />
const LargeHeader = (props: TextProps) => <TextWrapper fontWeight={600} fontSize={24} {...props} />
const MediumHeader = (props: TextProps) => <TextWrapper fontWeight={700} fontSize={18} {...props} />
const SubHeader = (props: TextProps) => <TextWrapper fontWeight={600} fontSize={14} {...props} />
const Blue = (props: TextProps) => <TextWrapper fontWeight={700} color="primary1" {...props} />
const DarkGray = (props: TextProps) => <TextWrapper fontWeight={700} color="text3" {...props} />
const Italic = (props: TextProps) => (
  <TextWrapper fontWeight={700} fontSize={13} fontStyle="italic" color="text2" {...props} />
)
const ErrorText = ({ error, ...props }: { error: boolean } & TextProps) => (
  <TextWrapper fontWeight={700} color={error ? 'red1' : 'text2'} {...props} />
)

export const TYPE = {
  Main,
  Link,
  Black,
  Body,
  LargeHeader,
  MediumHeader,
  SubHeader,
  Blue,
  DarkGray,
  Italic,
  Error: ErrorText
}
