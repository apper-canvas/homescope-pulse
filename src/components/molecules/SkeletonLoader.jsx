import { motion } from 'framer-motion';

const SkeletonCard = () => (
  <div className="bg-white rounded-lg shadow-card overflow-hidden">
    <div className="h-48 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
    <div className="p-4 space-y-3">
      <div className="h-5 bg-gray-200 rounded animate-pulse" />
      <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
      <div className="flex justify-between">
        <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
      </div>
    </div>
  </div>
);

const SkeletonLoader = ({ count = 6, type = 'card', className = '' }) => {
  const containerVariants = {
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    visible: {
      opacity: [0.4, 1, 0.4],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  if (type === 'card') {
    return (
      <motion.div
        variants={containerVariants}
        animate="visible"
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}
      >
        {[...Array(count)].map((_, i) => (
          <motion.div key={i} variants={itemVariants}>
            <SkeletonCard />
          </motion.div>
        ))}
      </motion.div>
    );
  }

  if (type === 'list') {
    return (
      <div className={`space-y-4 ${className}`}>
        {[...Array(count)].map((_, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            animate="visible"
            className="bg-white rounded-lg p-4 shadow-card"
          >
            <div className="flex space-x-4">
              <div className="w-24 h-16 bg-gray-200 rounded animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse" />
                <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  // Default skeleton
  return (
    <div className={`space-y-3 ${className}`}>
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          variants={itemVariants}
          animate="visible"
          className="h-6 bg-gray-200 rounded animate-pulse"
        />
      ))}
    </div>
  );
};

export default SkeletonLoader;