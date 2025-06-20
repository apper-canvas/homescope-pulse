import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import propertyService from '@/services/api/propertyService';
import savedPropertyService from '@/services/api/savedPropertyService';
import SearchBar from '@/components/molecules/SearchBar';
import FilterPanel from '@/components/molecules/FilterPanel';
import PropertyGrid from '@/components/organisms/PropertyGrid';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import EmptyState from '@/components/molecules/EmptyState';
import ErrorState from '@/components/molecules/ErrorState';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const Browse = () => {
  const [properties, setProperties] = useState([]);
  const [savedProperties, setSavedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    priceMin: null,
    priceMax: null,
    bedroomsMin: null,
    bathroomsMin: null,
    propertyTypes: [],
    squareFeetMin: null
  });
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [sortBy, setSortBy] = useState('newest'); // newest, price-low, price-high

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    searchProperties();
  }, [searchTerm, filters, sortBy]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [propertiesData, savedData] = await Promise.all([
        propertyService.getAll(),
        savedPropertyService.getAll()
      ]);
      
      setProperties(sortProperties(propertiesData, sortBy));
      setSavedProperties(savedData);
    } catch (err) {
      setError(err.message || 'Failed to load properties');
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const searchProperties = async () => {
    if (!searchTerm && !hasActiveFilters()) {
      loadData();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const searchFilters = {
        ...filters,
        location: searchTerm
      };
      
      const results = await propertyService.search(searchFilters);
      setProperties(sortProperties(results, sortBy));
    } catch (err) {
      setError(err.message || 'Search failed');
      toast.error('Search failed');
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
        return sorted.sort((a, b) => new Date(b.listingDate) - new Date(a.listingDate));
    }
  };

  const hasActiveFilters = () => {
    return filters.priceMin || filters.priceMax || filters.bedroomsMin || 
           filters.bathroomsMin || (filters.propertyTypes && filters.propertyTypes.length > 0) || 
           filters.squareFeetMin;
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      priceMin: null,
      priceMax: null,
      bedroomsMin: null,
      bathroomsMin: null,
      propertyTypes: [],
      squareFeetMin: null
    });
    setSearchTerm('');
  };

  const handleSaveToggle = (propertyId, isSaved) => {
    if (isSaved) {
      // Property was saved, add to saved list
      const newSaved = {
        Id: Date.now(), // Temporary ID
        propertyId: propertyId.toString(),
        savedDate: new Date().toISOString(),
        notes: ''
      };
      setSavedProperties(prev => [...prev, newSaved]);
    } else {
      // Property was unsaved, remove from saved list
      setSavedProperties(prev => prev.filter(saved => saved.propertyId !== propertyId.toString()));
    }
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
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
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">
            Discover Your Perfect Home
          </h1>
          <p className="text-gray-600">
            Browse through our curated collection of exceptional properties
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar 
            onSearch={handleSearch}
            placeholder="Search by location, property type, or features..."
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <FilterPanel
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Controls Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="text-sm text-gray-600">
                {loading ? (
                  'Loading properties...'
                ) : (
                  `${properties.length} ${properties.length === 1 ? 'property' : 'properties'} found`
                )}
              </div>

              <div className="flex items-center gap-4">
                {/* Sort Options */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="newest">Newest First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>

                {/* View Toggle */}
                <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-primary text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <ApperIcon name="Grid3X3" className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 transition-colors ${
                      viewMode === 'list'
                        ? 'bg-primary text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <ApperIcon name="List" className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            {loading ? (
              <SkeletonLoader count={6} type="card" />
            ) : error ? (
              <ErrorState 
                message={error}
                onRetry={loadData}
              />
            ) : properties.length === 0 ? (
              <EmptyState
                icon="Search"
                title={searchTerm || hasActiveFilters() ? "No properties found" : "No properties available"}
                description={
                  searchTerm || hasActiveFilters() 
                    ? "Try adjusting your search criteria or filters to find more properties."
                    : "Check back later for new property listings."
                }
                actionLabel={searchTerm || hasActiveFilters() ? "Clear Filters" : null}
                onAction={searchTerm || hasActiveFilters() ? handleClearFilters : null}
              />
            ) : (
              <PropertyGrid
                properties={properties}
                savedProperties={savedProperties}
                onSaveToggle={handleSaveToggle}
              />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Browse;