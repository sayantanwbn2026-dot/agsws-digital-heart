import LegalLayout from "./LegalLayout";

const RefundPolicy = () => (
  <LegalLayout
    title="Refund Policy"
    subtitle="When and how AGSWS processes refunds for donations and registration fees."
    updated="April 2026"
  >
    <h2>1. General Principle</h2>
    <p>
      Donations to AGSWS are voluntary contributions to charitable causes and are generally
      non-refundable. However, we recognise genuine errors and offer refunds in specific circumstances
      below.
    </p>

    <h2>2. Eligible Refund Scenarios</h2>
    <ul>
      <li><strong>Duplicate transaction:</strong> Same amount charged twice within 24 hours due to a payment-gateway glitch</li>
      <li><strong>Incorrect amount:</strong> Demonstrably wrong amount charged (e.g. ₹50,000 instead of ₹500)</li>
      <li><strong>Unauthorised transaction:</strong> Donation made without the cardholder's consent (subject to bank verification)</li>
      <li><strong>GoldenAge Care fee:</strong> ₹100 registration fee refundable within 7 days if the parent does not wish to proceed and no service has been rendered</li>
    </ul>

    <h2>3. How to Request a Refund</h2>
    <p>
      Email <a href="mailto:contact@agsws.org">contact@agsws.org</a> within 14 days of the transaction
      with: donation reference number, donor name, transaction date, amount, and reason. Include any
      supporting evidence (bank statement screenshot, etc.).
    </p>

    <h2>4. Processing Time</h2>
    <p>
      Approved refunds are processed within 7–10 business days back to the original payment method.
      Bank credit may take an additional 3–5 business days depending on your card issuer.
    </p>

    <h2>5. Tax Receipts</h2>
    <p>
      If a refund is processed after an 80G receipt has been issued, the receipt will be voided and a
      cancellation notice sent. You must not claim tax exemption on refunded donations.
    </p>

    <h2>6. Non-Refundable Cases</h2>
    <ul>
      <li>Funds already disbursed to beneficiaries</li>
      <li>Requests made beyond 14 days from the transaction date</li>
      <li>Change of heart after donation has been acknowledged</li>
    </ul>

    <h2>7. Contact</h2>
    <p>
      Questions about refunds? Reach us at <a href="mailto:contact@agsws.org">contact@agsws.org</a> or
      call our office during business hours.
    </p>
  </LegalLayout>
);

export default RefundPolicy;
