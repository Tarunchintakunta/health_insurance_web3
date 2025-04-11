import React, { useState } from 'react';
import { ethers } from 'ethers';
import Button from './Button';

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
  
  // Get icon based on category
  const getIcon = () => {
    switch (plan.category) {
      case 'Dental':
        return (
          <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'General Health':
        return (
          <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        );
      case 'Vision':
        return (
          <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        );
      case 'Preventative Care':
        return (
          <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        );
      default:
        return (
          <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
    }
  };
  
  return (
    <div className={`bg-white rounded-lg shadow-lg overflow-hidden border-2 ${isSelected ? 'border-primary-500' : 'border-transparent'} transition-all duration-200`}>
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            {getIcon()}
            <h3 className="text-xl font-semibold text-gray-800">{plan.name}</h3>
          </div>
          <div className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
            {plan.category}
          </div>
        </div>
        
        <p className="mt-4 text-gray-600">{plan.description}</p>
        
        <div className="mt-6 border-t border-b border-gray-200 py-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Base Premium</p>
              <p className="text-lg font-semibold text-gray-800">{parseFloat(basePremium).toFixed(5)} ETH</p>
            </div>
            <div>
              <label htmlFor={`people-${plan.id}`} className="block text-sm text-gray-500">People Covered</label>
              <select
                id={`people-${plan.id}`}
                value={people}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
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
            <div className="mt-2 bg-green-50 text-green-700 px-3 py-1 rounded-md text-sm">
              {calculateDiscount(people)}% discount applied for multiple people
            </div>
          )}
        </div>
        
        <div className="mt-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total Premium</p>
            <p className="text-2xl font-bold text-primary-600">{premium.toFixed(6)} ETH</p>
          </div>
          <Button 
            onClick={handleSelect}
            variant={isSelected ? 'secondary' : 'primary'}
          >
            {isSelected ? 'Selected' : 'Select Plan'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PlanCard;