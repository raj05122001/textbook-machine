// components/upload/ProcessingStatus.jsx - Processing status and progress display

import { LoadingSpinner, ProgressBar } from '@/components/ui';
import { PROCESSING_STAGES } from '@/lib/constants';

/**
 * Processing Status component to show upload and generation progress
 * @param {string} currentStage - Current processing stage
 * @param {number} progress - Overall progress percentage (0-100)
 * @param {Object} stageDetails - Details about current stage
 * @param {Array} stages - Array of processing stages
 * @param {string} error - Error message if any
 * @param {boolean} isComplete - Whether processing is complete
 * @param {string} className - Additional CSS classes
 */
export const ProcessingStatus = ({
  currentStage = null,
  progress = 0,
  stageDetails = null,
  stages = PROCESSING_STAGES,
  error = null,
  isComplete = false,
  className,
  ...props
}) => {
  const currentStageIndex = stages.findIndex(stage => stage.id === currentStage);
  
  return (
    <div className={cn('bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6', className)} {...props}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {isComplete ? 'Processing Complete' : error ? 'Processing Failed' : 'Processing Content'}
        </h3>
        
        {!error && !isComplete && (
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {Math.round(progress)}%
          </span>
        )}
      </div>

      {/* Overall progress bar */}
      {!error && !isComplete && (
        <div className="mb-6">
          <ProgressBar 
            value={progress} 
            size="md" 
            className="mb-2"
          />
        </div>
      )}

      {/* Current stage indicator */}
      {currentStage && stageDetails && !error && !isComplete && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-3">
            <LoadingSpinner size="sm" color="blue" />
            <div>
              <p className="font-medium text-blue-900 dark:text-blue-300">
                {stageDetails.name}
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-400">
                {stageDetails.description}
              </p>
              {stageDetails.estimatedTime && (
                <p className="text-xs text-blue-600 dark:text-blue-500 mt-1">
                  Estimated time: {stageDetails.estimatedTime}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-medium text-red-900 dark:text-red-300">
                Processing Failed
              </p>
              <p className="text-sm text-red-700 dark:text-red-400">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Success state */}
      {isComplete && !error && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-medium text-green-900 dark:text-green-300">
                Content Generated Successfully
              </p>
              <p className="text-sm text-green-700 dark:text-green-400">
                Your textbook is ready for editing and review.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Processing stages timeline */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Processing Steps
        </h4>
        
        {stages.map((stage, index) => {
          const isCurrentStage = stage.id === currentStage;
          const isPastStage = currentStageIndex > index;
          const isFutureStage = currentStageIndex < index && !isComplete;
          const isCompletedStage = isComplete || isPastStage;

          return (
            <div
              key={stage.id}
              className={cn(
                'flex items-center gap-3 p-3 rounded-lg transition-colors duration-200',
                isCurrentStage && 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800',
                isCompletedStage && !isCurrentStage && 'bg-green-50 dark:bg-green-900/20',
                isFutureStage && 'bg-gray-50 dark:bg-gray-800/50'
              )}
            >
              {/* Stage indicator */}
              <div className={cn(
                'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
                isCurrentStage && 'bg-blue-100 dark:bg-blue-900/40',
                isCompletedStage && !isCurrentStage && 'bg-green-100 dark:bg-green-900/40',
                isFutureStage && 'bg-gray-100 dark:bg-gray-700',
                error && isCurrentStage && 'bg-red-100 dark:bg-red-900/40'
              )}>
                {isCurrentStage && !error ? (
                  <LoadingSpinner size="xs" color="blue" />
                ) : isCompletedStage && !isCurrentStage ? (
                  <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : error && isCurrentStage ? (
                  <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <span className={cn(
                    'text-sm font-medium',
                    isCurrentStage && 'text-blue-600 dark:text-blue-400',
                    isCompletedStage && !isCurrentStage && 'text-green-600 dark:text-green-400',
                    isFutureStage && 'text-gray-400 dark:text-gray-500'
                  )}>
                    {index + 1}
                  </span>
                )}
              </div>

              {/* Stage content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{stage.icon}</span>
                  <p className={cn(
                    'font-medium',
                    isCurrentStage && 'text-blue-900 dark:text-blue-300',
                    isCompletedStage && !isCurrentStage && 'text-green-900 dark:text-green-300',
                    isFutureStage && 'text-gray-500 dark:text-gray-400',
                    error && isCurrentStage && 'text-red-900 dark:text-red-300'
                  )}>
                    {stage.name}
                  </p>
                </div>
                
                <p className={cn(
                  'text-sm mt-1',
                  isCurrentStage && 'text-blue-700 dark:text-blue-400',
                  isCompletedStage && !isCurrentStage && 'text-green-700 dark:text-green-400',
                  isFutureStage && 'text-gray-400 dark:text-gray-500',
                  error && isCurrentStage && 'text-red-700 dark:text-red-400'
                )}>
                  {stage.description}
                </p>
                
                {stage.estimatedTime && (
                  <p className={cn(
                    'text-xs mt-1',
                    isCurrentStage && 'text-blue-600 dark:text-blue-500',
                    isCompletedStage && !isCurrentStage && 'text-green-600 dark:text-green-500',
                    isFutureStage && 'text-gray-400 dark:text-gray-500',
                    error && isCurrentStage && 'text-red-600 dark:text-red-500'
                  )}>
                    {stage.estimatedTime}
                  </p>
                )}
              </div>

              {/* Stage status */}
              {isCompletedStage && !isCurrentStage && (
                <div className="flex-shrink-0">
                  <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 px-2 py-1 rounded-full">
                    Completed
                  </span>
                </div>
              )}
              
              {isCurrentStage && !error && (
                <div className="flex-shrink-0">
                  <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 px-2 py-1 rounded-full">
                    In Progress
                  </span>
                </div>
              )}
              
              {error && isCurrentStage && (
                <div className="flex-shrink-0">
                  <span className="text-xs bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 px-2 py-1 rounded-full">
                    Failed
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Processing statistics */}
      {(isComplete || currentStage) && !error && (
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {isComplete ? stages.length : currentStageIndex + 1}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {isComplete ? 'Completed' : 'Current Step'}
              </p>
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {stages.length}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Total Steps
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Action buttons */}
      {(isComplete || error) && (
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex gap-3">
            {isComplete && (
              <button className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                Continue to Editor
              </button>
            )}
            
            {error && (
              <>
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Retry Processing
                </button>
                <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  Start Over
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Enhanced Processing Status with real-time updates
export const LiveProcessingStatus = ({
  onStageChange,
  onComplete,
  onError,
  ...props
}) => {
  const [currentStage, setCurrentStage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [stageDetails, setStageDetails] = useState(null);
  const [error, setError] = useState(null);
  const [isComplete, setIsComplete] = useState(false);

  // Simulate processing stages (replace with real API calls)
  const startProcessing = async () => {
    setError(null);
    setIsComplete(false);
    setProgress(0);

    const stages = PROCESSING_STAGES;
    
    try {
      for (let i = 0; i < stages.length; i++) {
        const stage = stages[i];
        
        setCurrentStage(stage.id);
        setStageDetails(stage);
        onStageChange?.(stage);
        
        // Simulate processing time
        const duration = 2000 + Math.random() * 3000; // 2-5 seconds
        const steps = 50;
        const stepDuration = duration / steps;
        
        for (let step = 0; step <= steps; step++) {
          const stageProgress = (step / steps) * 100;
          const overallProgress = ((i + (step / steps)) / stages.length) * 100;
          
          setProgress(overallProgress);
          
          if (step < steps) {
            await new Promise(resolve => setTimeout(resolve, stepDuration));
          }
        }
      }
      
      setIsComplete(true);
      setCurrentStage(null);
      setStageDetails(null);
      onComplete?.();
      
    } catch (err) {
      setError(err.message || 'Processing failed');
      onError?.(err);
    }
  };

  return (
    <ProcessingStatus
      currentStage={currentStage}
      progress={progress}
      stageDetails={stageDetails}
      error={error}
      isComplete={isComplete}
      {...props}
    />
  );
};

export default {
  FileDropzone,
  FilePreview,
  ModelSelector,
  ProcessingStatus,
  LiveProcessingStatus
};


