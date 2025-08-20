// components/upload/ModelSelector.jsx - AI model selection component

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { AI_MODELS } from '@/lib/constants';

/**
 * AI Model Selector component
 * @param {string} selectedModel - Currently selected model
 * @param {Function} onModelChange - Callback when model changes
 * @param {boolean} disabled - Whether selector is disabled
 * @param {string} className - Additional CSS classes
 */
export const ModelSelector = ({
  selectedModel = 'gpt-5',
  onModelChange,
  disabled = false,
  className,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const models = Object.values(AI_MODELS);
  const currentModel = models.find(model => model.id === selectedModel) || models[0];

  const handleModelSelect = (modelId) => {
    onModelChange?.(modelId);
    setIsOpen(false);
  };

  return (
    <div className={cn('relative', className)} {...props}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        AI Model
      </label>
      
      {/* Model selector button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={cn(
          'w-full flex items-center justify-between p-3 rounded-lg border',
          'bg-white dark:bg-gray-800 text-left',
          'border-gray-300 dark:border-gray-600',
          'hover:border-gray-400 dark:hover:border-gray-500',
          'focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent',
          'transition-colors duration-200',
          disabled && 'opacity-50 cursor-not-allowed hover:border-gray-300 dark:hover:border-gray-600',
          isOpen && 'ring-2 ring-emerald-500 border-transparent'
        )}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{currentModel.icon}</span>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              {currentModel.name}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {currentModel.description}
            </p>
          </div>
        </div>
        
        <svg
          className={cn(
            'w-5 h-5 text-gray-400 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-80 overflow-auto">
          {models.map((model) => (
            <button
              key={model.id}
              type="button"
              onClick={() => handleModelSelect(model.id)}
              className={cn(
                'w-full p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700',
                'transition-colors duration-200',
                'first:rounded-t-lg last:rounded-b-lg',
                'border-b border-gray-100 dark:border-gray-700 last:border-b-0',
                selectedModel === model.id && 'bg-emerald-50 dark:bg-emerald-900/20'
              )}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl mt-0.5">{model.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {model.name}
                    </h3>
                    <span className={cn(
                      'text-xs px-2 py-1 rounded-full',
                      model.pricing === 'Premium' 
                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                    )}>
                      {model.pricing}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {model.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-1 mt-2">
                    {model.features.map((feature, index) => (
                      <span
                        key={index}
                        className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                  
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                    Est. time: {model.estimatedTime}
                  </p>
                </div>
                
                {/* Selection indicator */}
                {selectedModel === model.id && (
                  <div className="mt-1">
                    <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
      
      {/* Model info */}
      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        <p>Max tokens: {currentModel.maxTokens.toLocaleString()}</p>
        <p>Features: {currentModel.features.join(', ')}</p>
      </div>
    </div>
  );
};