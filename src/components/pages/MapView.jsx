import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import propertyService from '@/services/api/propertyService';
import savedPropertyService from '@/services/api/savedPropertyService';
import PropertyCard from '@/components/molecules/PropertyCard';
import SearchBar from '@/components/molecules/SearchBar';
import FilterPanel from '@/components/molecules/FilterPanel';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import EmptyState from '@/components/molecules/EmptyState';
import ErrorState from '@/components/molecules/ErrorState';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';

const MapView = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [savedProperties, setSavedProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
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
  const [showFilters, setShowFilters] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 47.6062, lng: -122.3321 });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    searchProperties();
  }, [searchTerm, filters]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [propertiesData, savedData] = await Promise.all([
        propertyService.getAll(),
        savedPropertyService.getAll()
      ]);
      
      setProperties(propertiesData);
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
      setProperties(results);
    } catch (err) {
      setError(err.message || 'Search failed');
      toast.error('Search failed');
    } finally {
      setLoading(false);
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
      const newSaved = {
        Id: Date.now(),
        propertyId: propertyId.toString(),
        savedDate: new Date().toISOString(),
        notes: ''
      };
      setSavedProperties(prev => [...prev, newSaved]);
    } else {
      setSavedProperties(prev => prev.filter(saved => saved.propertyId !== propertyId.toString()));
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const isSaved = (propertyId) => {
    return savedProperties.some(saved => saved.propertyId === propertyId.toString());
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
      className="h-screen bg-gray-50 flex flex-col"
    >
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <SearchBar 
                onSearch={handleSearch}
                placeholder="Search properties on map..."
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={showFilters ? "primary" : "outline"}
                icon="Filter"
                onClick={() => setShowFilters(!showFilters)}
              >
                Filters
                {hasActiveFilters() && (
                  <Badge variant="accent" size="xs" className="ml-2">
                    {Object.values(filters).filter(v => v && (Array.isArray(v) ? v.length > 0 : true)).length}
                  </Badge>
                )}
              </Button>
              <Button
                variant="outline"
                icon="Grid3X3"
                onClick={() => navigate('/')}
              >
                Grid View
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Filters Sidebar */}
        {showFilters && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="bg-white border-r border-gray-200 overflow-y-auto"
          >
            <div className="p-4">
              <FilterPanel
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onClearFilters={handleClearFilters}
              />
            </div>
          </motion.div>
        )}

        {/* Map Container */}
        <div className="flex-1 relative">
          {/* Mock Map */}
          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-green-100 relative overflow-hidden">
            {/* Map Background Pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="w-full h-full" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='53' cy='7' r='1'/%3E%3Ccircle cx='7' cy='53' r='1'/%3E%3Ccircle cx='53' cy='53' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }} />
            </div>

            {/* Property Markers */}
            {!loading && properties.map((property, index) => (
              <motion.div
                key={property.Id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="absolute cursor-pointer"
                style={{
                  left: `${20 + (index % 5) * 15}%`,
                  top: `${20 + Math.floor(index / 5) * 20}%`,
                }}
                onClick={() => setSelectedProperty(property)}
              >
                <div className="relative">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="bg-white rounded-lg shadow-lg px-3 py-2 border-2 border-primary"
                  >
                    <div className="text-sm font-semibold text-primary">
                      {formatPrice(property.price)}
                    </div>
                  </motion.div>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                    <div className="w-0 h-0 border-l-4 border-r-4 border-t-6 border-transparent border-t-primary"></div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Loading State */}
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                <div className="text-center">
                  <ApperIcon name="Loader2" className="w-8 h-8 animate-spin text-primary mx-auto mb-2" />
                  <p className="text-gray-600">Loading map...</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                <ErrorState message={error} onRetry={loadData} />
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && properties.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                <EmptyState
                  icon="Map"
                  title="No properties found"
                  description="Try adjusting your search criteria to find properties in this area."
                  actionLabel="Clear Filters"
                  onAction={handleClearFilters}
                />
              </div>
            )}

            {/* Map Controls */}
            <div className="absolute top-4 right-4 space-y-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50"
              >
                <ApperIcon name="Plus" className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50"
              >
                <ApperIcon name="Minus" className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Results Counter */}
            <div className="absolute bottom-4 left-4">
              <div className="bg-white rounded-lg shadow-lg px-4 py-2">
                <div className="text-sm text-gray-600">
                  {properties.length} {properties.length === 1 ? 'property' : 'properties'} shown
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Property Details Sidebar */}
        {selectedProperty && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 400, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="bg-white border-l border-gray-200 overflow-y-auto"
          >
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-900">Property Details</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  icon="X"
                  onClick={() => setSelectedProperty(null)}
                />
              </div>
              
              <PropertyCard
                property={selectedProperty}
                isSaved={isSaved(selectedProperty.Id)}
                onSaveToggle={handleSaveToggle}
              />
              
              <div className="mt-4 space-y-2">
                <Button
                  variant="primary"
                  icon="Eye"
                  className="w-full"
                  onClick={() => navigate(`/property/${selectedProperty.Id}`)}
                >
                  View Details
                </Button>
                <Button
                  variant="outline"
                  icon="GitCompare"
                  className="w-full"
                  onClick={() => navigate('/compare')}
                >
                  Add to Compare
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default MapView;