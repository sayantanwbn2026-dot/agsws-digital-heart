import LegalLayout from "./LegalLayout";

const PrivacyPolicy = () => (
  <LegalLayout
    title="Privacy Policy"
    subtitle="How AGSWS collects, uses, and protects your personal information."
    updated="April 2026"
  >
    <h2>1. Information We Collect</h2>
    <p>
      We collect information you provide directly: name, email, phone, postal address, and payment
      details when you donate, register a parent for GoldenAge Care, apply for support, or subscribe
      to our newsletter. We also collect technical data (IP address, browser type, pages visited)
      through standard analytics.
    </p>

    <h2>2. How We Use Your Information</h2>
    <ul>
      <li>Process donations and issue 80G tax-exemption receipts</li>
      <li>Deliver GoldenAge Care services and emergency contact response</li>
      <li>Review and respond to support applications</li>
      <li>Send transactional confirmations, impact updates, and newsletter content</li>
      <li>Comply with legal, tax, and audit obligations</li>
    </ul>

    <h2>3. Sharing & Disclosure</h2>
    <p>
      We never sell your data. We share information only with: payment processors (Stripe) to complete
      transactions, government bodies as required by law, and service providers (email, hosting) bound
      by confidentiality agreements.
    </p>

    <h2>4. Data Security</h2>
    <p>
      All payment data is processed by PCI-DSS compliant providers. Personal data is stored on encrypted
      servers with role-based access. We never store full card numbers.
    </p>

    <h2>5. Your Rights</h2>
    <ul>
      <li>Request a copy of your data</li>
      <li>Request correction or deletion (subject to legal retention requirements)</li>
      <li>Unsubscribe from marketing emails at any time</li>
      <li>Opt out of donor wall display</li>
    </ul>

    <h2>6. Cookies</h2>
    <p>
      We use essential cookies for site functionality and analytics cookies to improve our services.
      You can manage cookie preferences via the consent banner.
    </p>

    <h2>7. Contact</h2>
    <p>
      For privacy queries, contact us at <a href="mailto:contact@agsws.org">contact@agsws.org</a>.
    </p>
  </LegalLayout>
);

export default PrivacyPolicy;
