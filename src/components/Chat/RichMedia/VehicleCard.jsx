import React from 'react';

const VehicleCard = ({ data }) => {
    const { vehicle, price } = data;

    // Mock images based on ID
    const getImage = (id) => {
        if (id.includes('premium')) return 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=600&q=80'; // Carnival/Luxury Van
        if (id.includes('bus')) return 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80'; // Bus
        return 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=600&q=80'; // General Van
    };

    return (
        <div className="vehicle-card glass-panel">
            <img src={getImage(vehicle.id)} alt={vehicle.name} className="vehicle-img" />
            <div className="vehicle-info">
                <h3>{vehicle.name}</h3>
                <p className="vehicle-specs">Max {vehicle.maxPax} Pax • {vehicle.maxLuggage} Luggage</p>
                <div className="price-tag">
                    <span className="label">Est. Total</span>
                    <span className="amount">₩{price.toLocaleString()}</span>
                </div>
            </div>
            <style>{`
        .vehicle-card {
          margin-top: var(--sp-sm);
          overflow: hidden;
          background: #fff;
        }
        .vehicle-img {
          width: 100%;
          height: 140px;
          object-fit: cover;
        }
        .vehicle-info {
          padding: var(--sp-md);
        }
        .vehicle-specs {
          color: hsl(var(--tc-muted));
          font-size: 0.85rem;
          margin-bottom: var(--sp-sm);
        }
        .price-tag {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-weight: 700;
          color: hsl(var(--pk-primary));
        }
        .label {
          font-size: 0.8rem;
          text-transform: uppercase;
          opacity: 0.8;
        }
        .amount {
          font-size: 1.2rem;
        }
      `}</style>
        </div>
    );
};

export default VehicleCard;
