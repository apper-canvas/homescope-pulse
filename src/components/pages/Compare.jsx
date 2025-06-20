import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import propertyService from '@/services/api/propertyService';
import savedPropertyService from '@/services/api/savedPropertyService';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import EmptyState from '@/components/molecules/EmptyState';
import ErrorState from '@/components/molecules/ErrorState';

const Compare = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await propertyService.getAll();
      setProperties(data);
      
      // Auto-select first 2 properties for demo
      if (data.length >= 2) {
        setSelectedProperties([data[0], data[1]]);
      }
    } catch (err) {
      setError(err.message || 'Failed to load properties');
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const addPropertyToCompare = (property) => {
    if (selectedProperties.length >= 4) {
      toast.error('You can compare up to 4 properties at once');
      return;
    }
    
    if (selectedProperties.some(p => p.Id === property.Id)) {
      toast.error('Property is already being compared');
      return;
    }
    
    setSelectedProperties(prev => [...prev, property]);
    setShowAddModal(false);
    toast.success('Property added to comparison');
  };

  const removePropertyFromCompare = (propertyId) => {
    setSelectedProperties(prev => prev.filter(p => p.Id !== propertyId));
    toast.success('Property removed from comparison');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatSquareFeet = (sqft) => {
    return new Intl.NumberFormat('en-US').format(sqft);
  };

  const comparisonFields = [
    { key: 'price', label: 'Price', format: formatPrice },
    { key: 'propertyType', label: 'Property Type' },
    { key: 'bedrooms', label: 'Bedrooms' },
    { key: 'bathrooms', label: 'Bathrooms' },
    { key: 'squareFeet', label: 'Square Feet', format: formatSquareFeet },
    { key: 'yearBuilt', label: 'Year Built' },
    { key: 'address', label: 'Address' }
  ];

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SkeletonLoader count={4} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ErrorState message={error} onRetry={loadProperties} />
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen bg-gray-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">
              Compare Properties
            </h1>
            <p className="text-gray-600">
              Compare up to 4 properties side by side to make the best decision
            </p>
          </div>

          <Button
            variant="primary"
            icon="Plus"
            onClick={() => setShowAddModal(true)}
            disabled={selectedProperties.length >= 4}
          >
            Add Property
          </Button>
        </div>

        {selectedProperties.length === 0 ? (
          <EmptyState
            icon="GitCompare"
            title="No properties to compare"
            description="Add properties to start comparing their features side by side."
            actionLabel="Browse Properties"
            onAction={() => navigate('/')}
          />
        ) : (
          <div className="bg-white rounded-lg shadow-card overflow-hidden">
            {/* Property Headers */}
            <div className="grid gap-4 p-6 border-b border-gray-200" style={{
              gridTemplateColumns: `200px repeat(${selectedProperties.length}, 1fr)`
            }}>
              <div></div>
              {selectedProperties.map(property => (
                <div key={property.Id} className="text-center">
                  <div className="relative mb-4">
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removePropertyFromCompare(property.Id)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-error text-white rounded-full flex items-center justify-center hover:bg-error/80"
                    >
                      <ApperIcon name="X" className="w-4 h-4" />
                    </button>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {property.title}
                  </h3>
                  <Badge variant="accent" className="mb-2">
                    {formatPrice(property.price)}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    icon="Eye"
                    onClick={() => navigate(`/property/${property.Id}`)}
                  >
                    View Details
                  </Button>
                </div>
              ))}
            </div>

            {/* Comparison Table */}
            <div className="divide-y divide-gray-200">
              {comparisonFields.map(field => (
                <div
                  key={field.key}
                  className="grid gap-4 p-4 hover:bg-gray-50"
                  style={{
                    gridTemplateColumns: `200px repeat(${selectedProperties.length}, 1fr)`
                  }}
                >
                  <div className="font-medium text-gray-900">
                    {field.label}
                  </div>
                  {selectedProperties.map(property => (
                    <div key={property.Id} className="text-gray-600">
                      {field.format 
                        ? field.format(property[field.key])
                        : property[field.key]
                      }
                    </div>
                  ))}
                </div>
              ))}

              {/* Features Comparison */}
              <div
                className="grid gap-4 p-4"
                style={{
                  gridTemplateColumns: `200px repeat(${selectedProperties.length}, 1fr)`
                }}
              >
                <div className="font-medium text-gray-900">
                  Features
                </div>
                {selectedProperties.map(property => (
                  <div key={property.Id} className="space-y-1">
                    {property.features?.slice(0, 5).map((feature, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600">
                        <ApperIcon name="Check" className="w-4 h-4 text-success mr-2" />
                        {feature}
                      </div>
                    ))}
                    {property.features?.length > 5 && (
                      <div className="text-sm text-gray-500">
                        +{property.features.length - 5} more
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Add Property Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
            >
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Add Property to Compare
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  icon="X"
                  onClick={() => setShowAddModal(false)}
                />
              </div>

              <div className="p-6 max-h-96 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {properties
                    .filter(property => !selectedProperties.some(p => p.Id === property.Id))
                    .map(property => (
                      <motion.div
                        key={property.Id}
                        whileHover={{ scale: 1.02 }}
                        className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-primary"
                        onClick={() => addPropertyToCompare(property)}
                      >
                        <img
                          src={property.images[0]}
                          alt={property.title}
                          className="w-full h-32 object-cover rounded-lg mb-3"
                        />
                        <h4 className="font-medium text-gray-900 mb-2 line-clamp-2">
                          {property.title}
                        </h4>
                        <div className="text-primary font-semibold mb-2">
                          {formatPrice(property.price)}
                        </div>
                        <div className="text-sm text-gray-600">
                          {property.bedrooms} bed • {property.bathrooms} bath • {formatSquareFeet(property.squareFeet)} sqft
                        </div>
                      </motion.div>
                    ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Compare;