// src/components/PlanCard.jsx
import React, { useState } from 'react';
import { ethers } from 'ethers';

const PlanCard = ({ plan, onSelect }) => {
  const [people, setPeople] = useState(1);
  const [isSelected, setIsSelected] = useState(false);
  
  const basePremium = ethers.utils.formatEther(plan.basePremium);
  
  // Calculate discount based on number of people
  const calculateDiscount = (numPeople) => {
    return (numPeople - 1) * 5; // 5% discount per additional person
  };
  
  // Calculate premium with discount
  const calculatePremium = () => {
    const discount = calculateDiscount(people);
    const discountFactor = 100 - discount;
    return (parseFloat(basePremium) * people * discountFactor) / 100;
  };
  
  const premium = calculatePremium();
  
  const handleChange = (e) => {
    setPeople(parseInt(e.target.value));
  };
  
  const handleSelect = () => {
    const isNowSelected = !isSelected;
    setIsSelected(isNowSelected);
    
    if (isNowSelected) {
      onSelect({
        ...plan,
        people,
        premium
      });
    } else {
      onSelect(null);
    }
  };
  
  return (
    <div style={{
      border: isSelected ? '2px solid #4CAF50' : '1px solid #e9ecef',
      borderRadius: '8px',
      padding: '1.5rem',
      backgroundColor: 'white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      transition: 'all 0.3s ease'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: '0' }}>{plan.name}</h3>
        <span style={{ 
          backgroundColor: '#e8f5e9', 
          color: '#4CAF50', 
          padding: '0.25rem 0.75rem', 
          borderRadius: '16px',
          fontSize: '0.875rem'
        }}>
          {plan.category}
        </span>
      </div>
      
      <p style={{ color: '#6c757d', marginBottom: '1.5rem' }}>{plan.description}</p>
      
      <div style={{ padding: '1rem 0', borderTop: '1px solid #e9ecef', borderBottom: '1px solid #e9ecef', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <p style={{ color: '#6c757d', fontSize: '0.875rem', margin: '0 0 0.25rem 0' }}>Base Premium</p>
            <p style={{ fontWeight: 'bold', margin: 0 }}>{parseFloat(basePremium).toFixed(5)} ETH</p>
          </div>
          <div>
            <label htmlFor={`people-${plan.id}`} style={{ color: '#6c757d', fontSize: '0.875rem', display: 'block', marginBottom: '0.25rem' }}>
              People Covered
            </label>
            <select
              id={`people-${plan.id}`}
              value={people}
              onChange={handleChange}
              style={{
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid #ced4da',
                width: '100%'
              }}
            >
              <option value={1}>1 Person</option>
              <option value={2}>2 People</option>
              <option value={3}>3 People</option>
              <option value={4}>4 People</option>
              <option value={5}>5 People</option>
            </select>
          </div>
        </div>
        
        {people > 1 && (
          <div style={{
            backgroundColor: '#e8f5e9',
            color: '#388e3c',
            padding: '0.5rem',
            borderRadius: '4px',
            fontSize: '0.875rem'
          }}>
            {calculateDiscount(people)}% discount applied for multiple people
          </div>
        )}
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ color: '#6c757d', fontSize: '0.875rem', margin: '0 0 0.25rem 0' }}>Total Premium</p>
          <p style={{ fontWeight: 'bold', fontSize: '1.25rem', color: '#4CAF50', margin: 0 }}>{premium.toFixed(6)} ETH</p>
        </div>
        <button 
          onClick={handleSelect}
          style={{
            backgroundColor: isSelected ? '#e8f5e9' : '#4CAF50',
            color: isSelected ? '#4CAF50' : 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          {isSelected ? 'Selected' : 'Select Plan'}
        </button>
      </div>
    </div>
  );
};

export default PlanCard;