import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const NotFound = () => {
  const navigate = useNavigate();

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <motion.div 
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen bg-gray-50 flex items-center justify-center"
    >
      <div className="max-w-md mx-auto text-center px-4">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="inline-block mb-6"
        >
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
            <ApperIcon name="Home" className="w-12 h-12 text-primary" />
          </div>
        </motion.div>

        <h1 className="font-display text-4xl font-bold text-gray-900 mb-4">
          404
        </h1>
        
        <h2 className="font-display text-xl font-semibold text-gray-900 mb-4">
          Page Not Found
        </h2>
        
        <p className="text-gray-600 mb-8">
          The property you're looking for doesn't exist or has been moved. 
          Let's get you back to browsing amazing homes.
        </p>
        
        <div className="space-y-3">
          <Button
            variant="primary"
            icon="Home"
            onClick={() => navigate('/')}
            className="w-full"
          >
            Browse Properties
          </Button>
          
          <Button
            variant="outline"
            icon="ArrowLeft"
            onClick={() => navigate(-1)}
            className="w-full"
          >
            Go Back
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default NotFound;