import React from 'react';

const PaymentLink = ({ data }) => {
    return (
        <div className="payment-card glass-panel">
            <div className="risk-warning">
                <span className="icon">⚠️</span>
                <p>This quote is based on the booked schedule. Extra charges apply for overtime or additional stops.</p>
            </div>
            <div className="total-amount">
                Total: ₩{data.amount.toLocaleString()}
            </div>
            <button className="pay-btn btn-primary" onClick={() => alert('Payment Gateway Integration Mock')}>
                Secure Checkout
            </button>
            <style>{`
        .payment-card {
           margin-top: var(--sp-sm);
           padding: var(--sp-md);
           background: #fff;
           text-align: center;
        }
        .risk-warning {
          background: #FFF4E5;
          color: #663C00;
          padding: var(--sp-sm);
          border-radius: var(--rd-sm);
          font-size: 0.8rem;
          display: flex;
          gap: var(--sp-xs);
          text-align: left;
          margin-bottom: var(--sp-md);
        }
        .total-amount {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: var(--sp-md);
        }
        .pay-btn {
          width: 100%;
          background: #00C853; /* Green for payment */
        }
      `}</style>
        </div>
    );
};

export default PaymentLink;
