import React from 'react'
import styled from 'styled-components'

const PageShell = styled.main`
  width: min(1120px, 100%);
  padding: 56px 24px 120px;
  margin: 0 auto;
  color: ${({ theme }) => theme.colors.text1};
  display: flex;
  flex-direction: column;
  gap: 32px;
`

const HeroCard = styled.section`
  border-radius: 32px;
  padding: 72px 56px;
  background: radial-gradient(circle at 15% 20%, rgba(102, 126, 234, 0.35), transparent 60%),
    radial-gradient(circle at 80% 10%, rgba(16, 185, 129, 0.25), transparent 55%),
    ${({ theme }) => theme.colors.bg1};
  border: 1px solid ${({ theme }) => theme.colors.bg4};
  box-shadow: 0 40px 120px rgba(15, 23, 42, 0.15);
`

const HeroEyebrow = styled.p`
  text-transform: uppercase;
  letter-spacing: 0.22em;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.text3};
  margin: 0 0 18px;
`

const HeroTitle = styled.h1`
  margin: 0 0 24px;
  font-size: clamp(2.6rem, 4vw, 3.4rem);
  line-height: 1.1;
`

const HeroLead = styled.p`
  max-width: 720px;
  font-size: 1.05rem;
  color: ${({ theme }) => theme.colors.text2};
  margin: 0;
`

const HeroMeta = styled.div`
  margin-top: 32px;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
`

const HeroBadge = styled.span`
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.colors.bg4};
  padding: 10px 20px;
  font-size: 0.9rem;
  background: rgba(255, 255, 255, 0.7);
`

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
`

const Card = styled.section`
  border-radius: 24px;
  padding: 28px;
  background: ${({ theme }) => theme.colors.bg1};
  border: 1px solid ${({ theme }) => theme.colors.bg4};
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.08);
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const CardTitle = styled.h2`
  margin: 0;
  font-size: 1.2rem;
`

const CardBody = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text2};
  line-height: 1.5;
`

const DuoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
`

const BulletSection = styled.section`
  border-radius: 26px;
  padding: 32px;
  background: ${({ theme }) => theme.colors.bg2};
  border: 1px solid ${({ theme }) => theme.colors.bg4};
`

const BulletTitle = styled.h3`
  margin: 0 0 16px;
  font-size: 1.1rem;
`

const BulletList = styled.ul`
  margin: 0;
  padding-left: 20px;
  color: ${({ theme }) => theme.colors.text2};
  line-height: 1.5;
`

const Callout = styled.section`
  border-radius: 28px;
  padding: 40px;
  border: 1px solid ${({ theme }) => theme.colors.bg4};
  background: linear-gradient(120deg, rgba(102, 126, 234, 0.15), rgba(16, 185, 129, 0.15));
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const InlineLink = styled.a`
  color: ${({ theme }) => theme.colors.primary1};
  font-weight: 600;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`

const primaryPrinciples = [
  {
    title: 'Acceptance of Terms',
    body:
      'By connecting a wallet and interacting with CheeseSwap smart contracts you confirm that you have read, understood, and agree to these Terms. If you disagree with any clause you must stop using the interface immediately.'
  },
  {
    title: 'Non-Custodial Nature',
    body:
      'CheeseSwap never takes custody of user assets. All swaps, liquidity positions, and approvals are executed directly onchain. You are solely responsible for safeguarding wallets and private keys.'
  },
  {
    title: 'Eligibility & Restrictions',
    body:
      'You must be legally permitted to use decentralized exchanges in your jurisdiction, be at least 18 years old, and not be subject to sanctions or anti-money laundering restrictions.'
  }
]

const userObligations = [
  'Use CheeseSwap in compliance with applicable laws, including tax reporting requirements in your jurisdiction.',
  'Only connect wallets you control and verify contract addresses before signing any transaction.',
  'Maintain updated security practices (hardware wallets, multi-factor custody, revoking approvals when not in use).',
  'Immediately discontinue usage if you suspect unauthorized access to your wallet or detect a smart contract issue.'
]

const riskDisclosures = [
  'Smart contract vulnerabilities, front-end bugs, oracle failures, or third-party infrastructure outages may lead to partial or total loss of funds.',
  'Digital assets are highly volatile. Past performance does not guarantee future results, and CheeseSwap does not provide investment advice.',
  'Transactions on public blockchains are irreversible. Double-check destination addresses, token symbols, and slippage settings before signing.',
  'Regulatory shifts could impact the availability of certain assets, pools, or geographies without prior notice.'
]

const disputeSteps = [
  'Gather transaction hashes, wallet addresses, timestamps, and screenshots describing the issue.',
  'Reach out to privacy@cheeseswap.app or legal@cheeseswap.app with the evidence. Do not send seed phrases.',
  'We coordinate with auditors or infrastructure partners when a smart contract or RPC issue is implicated.',
  'If unresolved, disputes are governed by the laws of the British Virgin Islands and handled through binding arbitration in Tortola.'
]

export default function TermsOfService() {
  return (
    <PageShell>
      <HeroCard>
        <HeroEyebrow>Terms of Service</HeroEyebrow>
        <HeroTitle>Transparent responsibilities for every swap.</HeroTitle>
        <HeroLead>
          These Terms describe how you may access and use CheeseSwap, the obligations you accept when connecting a wallet,
          and the risks inherent to decentralized finance. Review them carefully before interacting with our liquidity markets.
        </HeroLead>
        <HeroMeta>
          <HeroBadge>Effective: 27 December 2025</HeroBadge>
          <HeroBadge>Venue: British Virgin Islands</HeroBadge>
          <HeroBadge>Scope: Web App • API • Smart Contracts</HeroBadge>
        </HeroMeta>
      </HeroCard>

      <ContentGrid>
        {primaryPrinciples.map(item => (
          <Card key={item.title}>
            <CardTitle>{item.title}</CardTitle>
            <CardBody>{item.body}</CardBody>
          </Card>
        ))}
      </ContentGrid>

      <DuoGrid>
        <BulletSection>
          <BulletTitle>User Duties</BulletTitle>
          <BulletList>
            {userObligations.map(item => (
              <li key={item}>{item}</li>
            ))}
          </BulletList>
        </BulletSection>
        <BulletSection>
          <BulletTitle>Trading Risks</BulletTitle>
          <BulletList>
            {riskDisclosures.map(item => (
              <li key={item}>{item}</li>
            ))}
          </BulletList>
        </BulletSection>
      </DuoGrid>

      <Card>
        <CardTitle>License & Platform Availability</CardTitle>
        <CardBody>
          CheeseSwap grants you a personal, revocable, non-exclusive, non-transferable license to use the interface subject to
          these Terms. We may suspend or geoblock access to protect users, comply with regulations, or service the platform.
          We reserve the right to update smart contracts and UI components without notice when critical fixes are required.
        </CardBody>
      </Card>

      <Card>
        <CardTitle>Indemnification</CardTitle>
        <CardBody>
          You agree to indemnify and hold harmless CheeseSwap contributors, affiliates, and service providers against claims,
          losses, or expenses arising from your violation of these Terms, misuse of the interface, or infringement of third-party rights.
        </CardBody>
      </Card>

      <BulletSection>
        <BulletTitle>Incident & Dispute Workflow</BulletTitle>
        <BulletList>
          {disputeSteps.map(step => (
            <li key={step}>{step}</li>
          ))}
        </BulletList>
      </BulletSection>

      <Callout>
        <CardTitle>Contact</CardTitle>
        <CardBody>
          Formal notices should be sent to Omega Protocol Ltd., Tortola, BVI, and emailed to <InlineLink href="mailto:legal@cheeseswap.app">legal@cheeseswap.app</InlineLink>.
          Response commitments: 5 business days for critical security issues, 10 business days for general disputes.
        </CardBody>
        <CardBody>
          Continued use of the interface after updates constitutes acceptance of the revised Terms. Monitor the changelog in our docs
          or subscribe to the governance feed for amendments.
        </CardBody>
      </Callout>
    </PageShell>
  )
}
