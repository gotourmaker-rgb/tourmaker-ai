import React from 'react';

const PresetList = ({ data }) => {
    return (
        <div className="preset-list">
            {data.items.map((item) => (
                <div key={item.id} className="preset-card glass-panel">
                    <img src={item.image} alt={item.title} className="preset-img" />
                    <div className="preset-content">
                        <h4>{item.title}</h4>
                        <p className="desc">{item.description}</p>
                        <div className="price">₩{item.price.toLocaleString()}</div>
                        <button className="select-btn">Select</button>
                    </div>
                </div>
            ))}
            <style>{`
        .preset-list {
          display: flex;
          gap: var(--sp-md);
          overflow-x: auto;
          padding: var(--sp-xs) 0 var(--sp-md) 0;
          width: 100%;
        }
        .preset-card {
          min-width: 240px;
          width: 240px;
          flex-shrink: 0;
          background: #fff;
          overflow: hidden;
        }
        .preset-img {
          width: 100%;
          height: 120px;
          object-fit: cover;
        }
        .preset-content {
          padding: var(--sp-sm);
        }
        .desc {
          font-size: 0.8rem;
          color: hsl(var(--tc-muted));
          margin: var(--sp-xs) 0;
          height: 3.2em;
          overflow: hidden;
        }
        .price {
          font-weight: 700;
          color: hsl(var(--pk-primary));
          margin-bottom: var(--sp-sm);
        }
        .select-btn {
          width: 100%;
          padding: var(--sp-xs);
          background: hsl(var(--pk-accent));
          border: none;
          border-radius: var(--rd-sm);
          font-weight: 600;
          cursor: pointer;
        }
      `}</style>
        </div>
    );
};

export default PresetList;
