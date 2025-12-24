import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'

const ChartContainer = styled.div<{ chartHeight?: number }>`
  width: 100%;
  height: ${({ chartHeight }) => (chartHeight ? `${chartHeight}px` : '100%')};
  min-height: ${({ chartHeight }) => (chartHeight ? `${chartHeight}px` : '420px')};
  max-height: ${({ chartHeight }) => (chartHeight ? `${chartHeight}px` : 'none')};
  background: ${({ theme }) => theme.colors.bg1};
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid ${({ theme }) => theme.colors.bg3};
  box-shadow:
    0 4px 16px rgba(0, 0, 0, 0.08),
    0 0 0 1px ${({ theme }) => theme.colors.primary6};
  border-radius: 24px;
  padding: 1rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    box-shadow:
      0 8px 24px rgba(0, 0, 0, 0.12),
      0 0 0 1px ${({ theme }) => theme.colors.primary5};
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`
    height: auto;
    min-height: 360px;
    max-height: none;
  `}
`

interface TradingViewChartProps {
  symbol?: string
  height?: number
}

declare global {
  interface Window {
    TradingView: any
  }
}

export default function TradingViewChart({ symbol = 'BINANCE:BNBUSDT', height }: TradingViewChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const containerIdRef = useRef(`tradingview_chart_${Math.random().toString(36).slice(2)}`)
  const widgetRef = useRef<any>(null)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const instantiateWidget = () => {
      if (!window.TradingView || !containerRef.current) return

      widgetRef.current = new window.TradingView.widget({
        autosize: true,
        symbol,
        interval: '15',
        timezone: 'Etc/UTC',
        theme: 'dark',
        style: '1',
        locale: 'en',
        toolbar_bg: '#1c1c1c',
        enable_publishing: false,
        hide_top_toolbar: false,
        hide_side_toolbar: false,
        allow_symbol_change: true,
        save_image: false,
        container_id: containerIdRef.current,
        studies: ['Volume@tv-basicstudies'],
        disabled_features: ['use_localstorage_for_settings', 'header_saveload', 'header_screenshot'],
        enabled_features: ['hide_left_toolbar_by_default'],
        overrides: {
          'mainSeriesProperties.candleStyle.upColor': '#26a69a',
          'mainSeriesProperties.candleStyle.downColor': '#ef5350',
          'mainSeriesProperties.candleStyle.borderUpColor': '#26a69a',
          'mainSeriesProperties.candleStyle.borderDownColor': '#ef5350',
          'mainSeriesProperties.candleStyle.wickUpColor': '#26a69a',
          'mainSeriesProperties.candleStyle.wickDownColor': '#ef5350'
        }
      })
    }

    if (window.TradingView) {
      instantiateWidget()

      return () => {
        widgetRef.current?.remove()
        widgetRef.current = null
      }
    }

    const scriptId = 'tradingview-widget-script'
    let script = document.getElementById(scriptId) as HTMLScriptElement | null

    if (!script) {
      script = document.createElement('script')
      script.id = scriptId
      script.src = 'https://s3.tradingview.com/tv.js'
      script.async = true
      script.onload = instantiateWidget
      document.head.appendChild(script)
    } else {
      script.addEventListener('load', instantiateWidget)
    }

    return () => {
      widgetRef.current?.remove()
      widgetRef.current = null
      script?.removeEventListener('load', instantiateWidget)
    }
  }, [symbol])

  useEffect(() => {
    if (widgetRef.current?.resize) {
      widgetRef.current.resize()
    }
  }, [height])

  const chartInnerHeight = height ? Math.max(height - 32, 280) : undefined

  return (
    <ChartContainer chartHeight={height}>
      <div
        id={containerIdRef.current}
        ref={containerRef}
        style={{
          height: chartInnerHeight ? `${chartInnerHeight}px` : '100%',
          flex: 1
        }}
      />
    </ChartContainer>
  )
}
