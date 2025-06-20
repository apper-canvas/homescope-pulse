import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';

const FilterPanel = ({ 
  filters, 
  onFiltersChange, 
  onClearFilters,
  className = '' 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const propertyTypes = ['House', 'Condo', 'Townhouse', 'Apartment'];
  const bedroomOptions = [1, 2, 3, 4, 5];
  const bathroomOptions = [1, 1.5, 2, 2.5, 3, 3.5, 4];

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const handlePropertyTypeToggle = (type) => {
    const currentTypes = filters.propertyTypes || [];
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type];
    
    handleFilterChange('propertyTypes', newTypes);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.priceMin || filters.priceMax) count++;
    if (filters.bedroomsMin) count++;
    if (filters.bathroomsMin) count++;
    if (filters.propertyTypes?.length > 0) count++;
    if (filters.squareFeetMin) count++;
    return count;
  };

  const activeCount = getActiveFiltersCount();

  return (
    <div className={`bg-white rounded-lg shadow-card ${className}`}>
      {/* Filter Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <ApperIcon name="Filter" className="w-5 h-5 text-gray-600" />
          <h3 className="font-medium text-gray-900">Filters</h3>
          {activeCount > 0 && (
            <Badge variant="primary">{activeCount}</Badge>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {activeCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              icon="X"
            >
              Clear
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            icon={isExpanded ? 'ChevronUp' : 'ChevronDown'}
          >
            {isExpanded ? 'Less' : 'More'}
          </Button>
        </div>
      </div>

      {/* Always Visible Filters */}
      <div className="p-4 space-y-4">
        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price Range
          </label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              placeholder="Min Price"
              value={filters.priceMin || ''}
              onChange={(e) => handleFilterChange('priceMin', e.target.value ? parseInt(e.target.value) : null)}
            />
            <Input
              type="number"
              placeholder="Max Price"
              value={filters.priceMax || ''}
              onChange={(e) => handleFilterChange('priceMax', e.target.value ? parseInt(e.target.value) : null)}
            />
          </div>
        </div>

        {/* Bedrooms */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Minimum Bedrooms
          </label>
          <div className="flex flex-wrap gap-2">
            {bedroomOptions.map(num => (
              <motion.button
                key={num}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleFilterChange('bedroomsMin', filters.bedroomsMin === num ? null : num)}
                className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  filters.bedroomsMin === num
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-primary'
                }`}
              >
                {num}+
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Expandable Filters */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-200 overflow-hidden"
          >
            <div className="p-4 space-y-4">
              {/* Bathrooms */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Bathrooms
                </label>
                <div className="flex flex-wrap gap-2">
                  {bathroomOptions.map(num => (
                    <motion.button
                      key={num}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleFilterChange('bathroomsMin', filters.bathroomsMin === num ? null : num)}
                      className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                        filters.bathroomsMin === num
                          ? 'bg-primary text-white border-primary'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-primary'
                      }`}
                    >
                      {num}+
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Property Types */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Type
                </label>
                <div className="flex flex-wrap gap-2">
                  {propertyTypes.map(type => (
                    <motion.button
                      key={type}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handlePropertyTypeToggle(type)}
                      className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                        filters.propertyTypes?.includes(type)
                          ? 'bg-primary text-white border-primary'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-primary'
                      }`}
                    >
                      {type}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Square Feet */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Square Feet
                </label>
                <Input
                  type="number"
                  placeholder="e.g. 1200"
                  value={filters.squareFeetMin || ''}
                  onChange={(e) => handleFilterChange('squareFeetMin', e.target.value ? parseInt(e.target.value) : null)}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FilterPanel;