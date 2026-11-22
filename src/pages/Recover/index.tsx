import React from 'react'
import styled from 'styled-components'
import { Shield, Tool, CheckCircle, ArrowRight, Zap, Lock, Search } from 'react-feather'

const PageShell = styled.main`
  width: min(960px, 100%);
  padding: 24px 16px 80px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 28px;
  color: ${({ theme }) => theme.colors.text1};
`

const HeroCard = styled.section`
  position: relative;
  border-radius: 24px;
  background: radial-gradient(circle at 15% 0%, ${({ theme }) => theme.colors.primary6}, transparent 55%),
    ${({ theme }) => theme.colors.bg1};
  border: 1px solid ${({ theme }) => theme.colors.bg3};
  padding: 48px 40px;
  overflow: hidden;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 32px 20px;
  `};
`

const HeroBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.primary1};
  background: ${({ theme }) => theme.colors.primary6};
  border: 1px solid ${({ theme }) => theme.colors.primary5};
  margin-bottom: 16px;
`

const HeroTitle = styled.h1`
  font-size: clamp(1.6rem, 4vw, 2.4rem);
  line-height: 1.15;
  margin: 0 0 12px;
  font-weight: 800;
`

const HeroLead = styled.p`
  margin: 0 0 16px;
  font-size: 1rem;
  line-height: 1.65;
  color: ${({ theme }) => theme.colors.text2};

  strong {
    color: ${({ theme }) => theme.colors.primary1};
  }
`

const HeroNote = styled.p`
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.65;
  color: ${({ theme }) => theme.colors.text2};
`

const Section = styled.section`
  border-radius: 20px;
  background: ${({ theme }) => theme.colors.bg1};
  border: 1px solid ${({ theme }) => theme.colors.bg3};
  padding: 32px 28px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 24px 16px;
  `};
`

const SectionTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 8px;
  font-size: 1.35rem;
  font-weight: 700;

  svg {
    color: ${({ theme }) => theme.colors.primary1};
  }
`

const SectionText = styled.p`
  margin: 0 0 16px;
  color: ${({ theme }) => theme.colors.text2};
  line-height: 1.65;
  font-size: 0.95rem;

  strong {
    color: ${({ theme }) => theme.colors.text1};
  }
`

const TableWrap = styled.div`
  overflow-x: auto;
  border: 1px solid ${({ theme }) => theme.colors.bg3};
  border-radius: 14px;
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;

  th,
  td {
    text-align: left;
    padding: 10px 16px;
    white-space: nowrap;
  }

  thead th {
    background: ${({ theme }) => theme.colors.bg2};
    color: ${({ theme }) => theme.colors.text3};
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: 700;
  }

  tbody tr {
    border-top: 1px solid ${({ theme }) => theme.colors.bg3};
  }

  tbody tr:hover {
    background: ${({ theme }) => theme.colors.bg2};
  }

  td:first-child {
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text1};
  }

  td {
    color: ${({ theme }) => theme.colors.text2};
  }
`

const FootNote = styled.p`
  margin: 14px 0 0;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.text3};

  strong {
    color: ${({ theme }) => theme.colors.primary1};
  }
`

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    grid-template-columns: 1fr;
  `};
`

const RecoveryCard = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.bg3};
  border-radius: 14px;
  padding: 16px;
  background: ${({ theme }) => theme.colors.bg2};

  h3 {
    margin: 0 0 6px;
    font-size: 0.95rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text1};
  }

  p {
    margin: 0;
    font-size: 0.875rem;
    line-height: 1.6;
    color: ${({ theme }) => theme.colors.text2};
  }

  code {
    color: ${({ theme }) => theme.colors.primary1};
    background: ${({ theme }) => theme.colors.primary6};
    padding: 1px 6px;
    border-radius: 6px;
    font-size: 0.8rem;
  }
`

const Steps = styled.ol`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
`

const Step = styled.li`
  display: flex;
  gap: 14px;
  align-items: flex-start;

  h3 {
    margin: 0 0 4px;
    font-size: 0.95rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text1};
  }

  p {
    margin: 0;
    font-size: 0.875rem;
    line-height: 1.6;
    color: ${({ theme }) => theme.colors.text2};

    strong {
      color: ${({ theme }) => theme.colors.primary1};
    }
  }
`

const StepNumber = styled.div`
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 800;
  color: #0e0e16;
  background: ${({ theme }) => theme.colors.primary1};
`

const WhyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    grid-template-columns: 1fr;
  `};
`

const WhyCard = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.bg3};
  border-radius: 14px;
  padding: 18px 16px;
  background: ${({ theme }) => theme.colors.bg2};
  text-align: center;

  svg {
    color: ${({ theme }) => theme.colors.primary1};
    margin-bottom: 8px;
  }

  h3 {
    margin: 0 0 6px;
    font-size: 0.95rem;
    font-weight: 700;
  }

  p {
    margin: 0;
    font-size: 0.85rem;
    line-height: 1.6;
    color: ${({ theme }) => theme.colors.text2};
  }
`

const CtaCard = styled.section`
  border-radius: 20px;
  padding: 40px 28px;
  text-align: center;
  background: ${({ theme }) => theme.colors.bg6};
  border: 1px solid ${({ theme }) => theme.colors.primary5};

  h2 {
    margin: 0 0 10px;
    font-size: 1.4rem;
    font-weight: 800;
  }

  p {
    margin: 0 0 20px;
    color: ${({ theme }) => theme.colors.text2};
    font-size: 0.95rem;
  }
`

const CtaRow = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
`

const PrimaryCta = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.95rem;
  text-decoration: none;
  color: #0e0e16;
  background: ${({ theme }) => theme.colors.primary1};
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primary2};
    transform: translateY(-1px);
  }
`

const SecondaryCta = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.95rem;
  text-decoration: none;
  color: ${({ theme }) => theme.colors.primary1};
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.primary4};
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primary6};
    transform: translateY(-1px);
  }
`

const PROTOCOLS: { name: string; networks: string; support: string }[] = [
  { name: 'PancakeSwap', networks: 'BSC & Ethereum', support: 'V1, V2, V3 & MasterChef Farms' },
  { name: 'CheeseSwap', networks: 'BSC', support: 'V1, V2 & HybridStaking Pools' },
  { name: 'BakerySwap', networks: 'BSC & Ethereum', support: 'V1, V2 & Bakery MasterChef Pools' },
  { name: 'Uniswap', networks: 'Ethereum & BSC', support: 'V1, V2, V3 & Staking Contracts' },
  { name: 'SushiSwap', networks: 'Ethereum & BSC', support: 'V2, V3 & Original MasterChef / MiniChef' },
  { name: 'ApeSwap', networks: 'BSC & Ethereum', support: 'V2 AMM & Banana MasterChef Farms' },
  { name: 'Biswap', networks: 'BSC', support: 'V2 AMM & BSW MasterChef Pools' },
  { name: 'MDEX', networks: 'BSC & Ethereum', support: 'V2 AMM & Liquidity Mining Contracts' },
  { name: 'ShibaSwap', networks: 'Ethereum', support: 'V1 AMM & BoneYard (MasterChef) Pools' },
  { name: 'BabySwap', networks: 'BSC', support: 'V2 AMM & BABY Yield Farms' },
  { name: 'JulSwap (SwapLiquidity)', networks: 'BSC', support: 'V1, V2 & Staking Pools' },
  { name: 'WaultSwap', networks: 'BSC', support: 'WEX AMM & MasterChef Contracts' },
  { name: 'Goose Finance', networks: 'BSC', support: 'EGG AMM & MasterChef Yield Pools' }
]

export default function Recover() {
  return (
    <PageShell>
      <HeroCard>
        <HeroBadge>
          <Zap size={13} /> Asset Recovery
        </HeroBadge>
        <HeroTitle>DeFi Liquidity Pool &amp; Smart Contract Asset Recovery Service</HeroTitle>
        <HeroLead>
          Unlock your stranded crypto assets — even when the front-end is gone. Have you deposited funds into a
          Decentralized Exchange (DEX) or yield farm only to find the website offline, deprecated, or throwing RPC
          errors? <strong>Your funds are not lost.</strong>
        </HeroLead>
        <HeroNote>
          Because decentralized protocols live permanently on the blockchain, your tokens remain safely inside the
          underlying smart contracts — they simply require direct contract execution to retrieve. We provide
          specialized, non-custodial technical assistance to help you safely interact with underlying Automated
          Market Maker (AMM) Routers, LP Pair Contracts, and MasterChef Yield Farming Contracts across Ethereum
          (ERC-20) and BNB Smart Chain (BEP-20).
        </HeroNote>
      </HeroCard>

      <Section>
        <SectionTitle>
          <Tool size={20} /> Supported Protocols &amp; DApps
        </SectionTitle>
        <SectionText>
          We support direct smart contract extraction across virtually all Uniswap- and PancakeSwap-derived forks:
        </SectionText>
        <TableWrap>
          <Table>
            <thead>
              <tr>
                <th>Protocol / DApp</th>
                <th>Network(s)</th>
                <th>Supported Versions &amp; Contracts</th>
              </tr>
            </thead>
            <tbody>
              {PROTOCOLS.map(p => (
                <tr key={p.name}>
                  <td>{p.name}</td>
                  <td>{p.networks}</td>
                  <td>{p.support}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableWrap>
        <FootNote>
          Don&apos;t see your dApp listed? We support <strong>any</strong> custom or discontinued EVM smart contract
          built on standard AMM Factory/Router or MasterChef architecture.
        </FootNote>
      </Section>

      <Section>
        <SectionTitle>
          <Search size={20} /> What We Can Recover For You
        </SectionTitle>
        <CardGrid>
          <RecoveryCard>
            <h3>Unstaking from Dead Farms</h3>
            <p>
              Calling <code>withdraw</code> or <code>emergencyWithdraw</code> directly on discontinued MasterChef
              contracts when the UI buttons no longer work.
            </p>
          </RecoveryCard>
          <RecoveryCard>
            <h3>Removing Trapped Liquidity</h3>
            <p>
              Calling <code>removeLiquidity</code> or <code>removeLiquidityETH</code> directly via the Router
              contract — or burning LP tokens directly via the Pair contract — to split LP tokens back into your
              underlying assets.
            </p>
          </RecoveryCard>
          <RecoveryCard>
            <h3>Deprecated Version Migrations</h3>
            <p>
              Retrieving liquidity left behind in legacy pools (e.g., PancakeSwap V1, CheeseSwap V1, or BakerySwap
              V1).
            </p>
          </RecoveryCard>
          <RecoveryCard>
            <h3>Custom &amp; Unverified Contracts</h3>
            <p>
              Decoding bytecode and constructing custom transaction payloads for lesser-known or abandoned yield
              farms.
            </p>
          </RecoveryCard>
        </CardGrid>
      </Section>

      <Section>
        <SectionTitle>
          <CheckCircle size={20} /> How Our Recovery Process Works
        </SectionTitle>
        <Steps>
          <Step>
            <StepNumber>1</StepNumber>
            <div>
              <h3>Free On-Chain Assessment</h3>
              <p>
                Provide your public wallet address (or the contract/transaction hash). Our engineers trace your LP
                tokens and staked positions directly on BscScan or Etherscan.
              </p>
            </div>
          </Step>
          <Step>
            <StepNumber>2</StepNumber>
            <div>
              <h3>Custom Recovery Plan &amp; Quote</h3>
              <p>
                We verify that your funds are recoverable on-chain and provide a transparent breakdown of the exact
                steps required, along with a clear service fee structure (no upfront payment required for
                diagnostics).
              </p>
            </div>
          </Step>
          <Step>
            <StepNumber>3</StepNumber>
            <div>
              <h3>100% Win-Win Execution</h3>
              <p>
                 We guide you step-by-step guide through executing the verified contract calls from your own wallet (MetaMask, Trust Wallet, Ledger,
                or Safe), or provide a pre-built transaction payload for you to review and sign safely.
              </p>
            </div>
          </Step>
          <Step>
            <StepNumber>4</StepNumber>
            <div>
              <h3>Assets Returned to Your Wallet</h3>
              <p>Once the transaction confirms on-chain, the underlying tokens are deposited directly into your wallet.</p>
            </div>
          </Step>
        </Steps>
      </Section>

      <Section>
        <SectionTitle>
          <Shield size={20} /> Why Choose Us?
        </SectionTitle>
        <WhyGrid>
          <WhyCard>
            <Lock size={22} />
            <h3>Zero Custody Risk</h3>
            <p>Your keys stay in your hands at every stage of the process.</p>
          </WhyCard>
          <WhyCard>
            <Tool size={22} />
            <h3>Deep EVM Expertise</h3>
            <p>Proven experience decoding complex MasterChef, Router, and custom proxy contracts.</p>
          </WhyCard>
          <WhyCard>
            <CheckCircle size={22} />
            <h3>Success-Based Model</h3>
            <p>You only pay upon verified confirmation that your assets are recoverable.</p>
          </WhyCard>
        </WhyGrid>
      </Section>

      <CtaCard>
        <h2>Start Your Recovery Assessment Today</h2>
        <p>
          Don&apos;t let a broken website keep you from your crypto. Submit your wallet address or contract details
          now for a fast, confidential evaluation.
        </p>
        <CtaRow>
          <PrimaryCta href="https://cheeseswap.app" target="_blank" rel="noopener noreferrer">
            Visit CheeseSwap.App <ArrowRight size={16} />
          </PrimaryCta>
          <SecondaryCta href="https://discord.gg/KeFQnRmyW8" target="_blank" rel="noopener noreferrer">
            For Direct Support: Join our Discord
          </SecondaryCta>
        </CtaRow>
      </CtaCard>
    </PageShell>
  )
}
