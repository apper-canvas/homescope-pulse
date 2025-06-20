import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import savedPropertyService from '@/services/api/savedPropertyService';
import propertyService from '@/services/api/propertyService';
import PropertyGrid from '@/components/organisms/PropertyGrid';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import EmptyState from '@/components/molecules/EmptyState';
import ErrorState from '@/components/molecules/ErrorState';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const SavedProperties = () => {
  const [savedProperties, setSavedProperties] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    loadSavedProperties();
  }, []);

  const loadSavedProperties = async () => {
    setLoading(true);
    setError(null);

    try {
      const savedData = await savedPropertyService.getAll();
      setSavedProperties(savedData);

      if (savedData.length > 0) {
        // Get all properties to display full details
        const allProperties = await propertyService.getAll();
        const savedPropertyIds = savedData.map(saved => parseInt(saved.propertyId, 10));
        const filteredProperties = allProperties.filter(property => 
          savedPropertyIds.includes(property.Id)
        );
        
        setProperties(sortProperties(filteredProperties, sortBy));
      } else {
        setProperties([]);
      }
    } catch (err) {
      setError(err.message || 'Failed to load saved properties');
      toast.error('Failed to load saved properties');
    } finally {
      setLoading(false);
    }
  };

  const sortProperties = (propertiesArray, sortOption) => {
    const sorted = [...propertiesArray];
    
    switch (sortOption) {
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'newest':
      default:
        return sorted.sort((a, b) => {
          const aSaved = savedProperties.find(s => s.propertyId === a.Id.toString());
          const bSaved = savedProperties.find(s => s.propertyId === b.Id.toString());
          return new Date(bSaved?.savedDate || 0) - new Date(aSaved?.savedDate || 0);
        });
    }
  };

  const handleSaveToggle = async (propertyId, isSaved) => {
    if (!isSaved) {
      // Property was unsaved, remove from both lists
      try {
        await savedPropertyService.deleteByPropertyId(propertyId.toString());
        setSavedProperties(prev => prev.filter(saved => saved.propertyId !== propertyId.toString()));
        setProperties(prev => prev.filter(property => property.Id !== propertyId));
        toast.success('Property removed from saved');
      } catch (error) {
        toast.error('Failed to remove property');
      }
    }
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    setProperties(prev => sortProperties(prev, newSort));
  };

  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to remove all saved properties?')) {
      setLoading(true);
      try {
        // Delete all saved properties
        await Promise.all(
          savedProperties.map(saved => savedPropertyService.delete(saved.Id))
        );
        setSavedProperties([]);
        setProperties([]);
        toast.success('All saved properties removed');
      } catch (error) {
        toast.error('Failed to clear saved properties');
      } finally {
        setLoading(false);
      }
    }
  };

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
      className="min-h-screen bg-gray-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">
              Saved Properties
            </h1>
            <p className="text-gray-600">
              Properties you've bookmarked for future reference
            </p>
          </div>

          {!loading && properties.length > 0 && (
            <div className="flex items-center gap-4">
              {/* Sort Options */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="newest">Recently Saved</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>

              {/* Clear All Button */}
              <Button
                variant="outline"
                size="sm"
                icon="Trash2"
                onClick={handleClearAll}
                className="text-error border-error hover:bg-error hover:text-white"
              >
                Clear All
              </Button>
            </div>
          )}
        </div>

        {/* Stats */}
        {!loading && !error && (
          <div className="mb-6">
            <div className="text-sm text-gray-600">
              {properties.length} saved {properties.length === 1 ? 'property' : 'properties'}
            </div>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <SkeletonLoader count={6} type="card" />
        ) : error ? (
          <ErrorState 
            message={error}
            onRetry={loadSavedProperties}
          />
        ) : properties.length === 0 ? (
          <EmptyState
            icon="Heart"
            title="No saved properties"
            description="Start browsing properties and save the ones you like to see them here."
            actionLabel="Browse Properties"
            onAction={() => window.location.href = '/'}
          />
        ) : (
          <PropertyGrid
            properties={properties}
            savedProperties={savedProperties}
            onSaveToggle={handleSaveToggle}
          />
        )}
      </div>
    </motion.div>
  );
};

export default SavedProperties;