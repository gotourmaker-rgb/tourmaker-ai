import React from 'react';

const AddressPicker = ({ items, onSelect }) => {
    if (!items || items.length === 0) return null;

    return (
        <div className="address-picker">
            <div className="picker-header">장소를 선택해주세요:</div>
            <div className="picker-list">
                {items.map((item, idx) => (
                    <button
                        key={idx}
                        className="picker-item"
                        onClick={() => onSelect(item)}
                    >
                        <div className="place-name">{item.name}</div>
                        {item.address && <div className="place-addr">{item.address}</div>}
                    </button>
                ))}
            </div>
            <style>{`
                .address-picker {
                    background: white;
                    border-radius: 12px;
                    padding: 10px;
                    margin-top: 5px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    width: 100%;
                    max-width: 300px;
                }
                .picker-header {
                    font-size: 0.9rem;
                    font-weight: 600;
                    margin-bottom: 8px;
                    color: #333;
                }
                .picker-list {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }
                .picker-item {
                    text-align: left;
                    background: #f8f9fa;
                    border: 1px solid #eee;
                    padding: 8px 12px;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .picker-item:hover {
                    background: #e9ecef;
                    border-color: #adb5bd;
                }
                .place-name {
                    font-weight: 600;
                    font-size: 0.9rem;
                    color: #2c3e50;
                }
                .place-addr {
                    font-size: 0.75rem;
                    color: #7f8c8d;
                    margin-top: 2px;
                }
            `}</style>
        </div>
    );
};

export default AddressPicker;
