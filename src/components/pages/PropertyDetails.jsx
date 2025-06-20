import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import propertyService from '@/services/api/propertyService';
import savedPropertyService from '@/services/api/savedPropertyService';
import PropertyGallery from '@/components/organisms/PropertyGallery';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    loadProperty();
  }, [id]);

  const loadProperty = async () => {
    setLoading(true);
    setError(null);

    try {
      const [propertyData, savedData] = await Promise.all([
        propertyService.getById(id),
        savedPropertyService.getByPropertyId(id)
      ]);
      
      setProperty(propertyData);
      setIsSaved(!!savedData);
    } catch (err) {
      setError(err.message || 'Failed to load property');
      toast.error('Failed to load property');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToggle = async () => {
    setSaveLoading(true);

    try {
      if (isSaved) {
        await savedPropertyService.deleteByPropertyId(id);
        setIsSaved(false);
        toast.success('Property removed from saved');
      } else {
        await savedPropertyService.create({
          propertyId: id,
          notes: ''
        });
        setIsSaved(true);
        toast.success('Property saved');
      }
    } catch (error) {
      toast.error('Failed to update saved property');
    } finally {
      setSaveLoading(false);
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

  const formatSquareFeet = (sqft) => {
    return new Intl.NumberFormat('en-US').format(sqft);
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-card p-6">
            <SkeletonLoader count={8} />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <ErrorState 
            message={error}
            onRetry={loadProperty}
          />
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <ErrorState 
            message="Property not found"
            onRetry={() => navigate('/')}
          />
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            icon="ArrowLeft"
            onClick={() => navigate(-1)}
          >
            Back to Browse
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Gallery */}
            <PropertyGallery images={property.images} title={property.title} />

            {/* Property Info */}
            <div className="bg-white rounded-lg shadow-card p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="font-display text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    {property.title}
                  </h1>
                  <div className="flex items-center text-gray-600 mb-4">
                    <ApperIcon name="MapPin" className="w-5 h-5 mr-2" />
                    <span>{property.address}</span>
                  </div>
                </div>
                <Badge variant="accent" size="md" className="text-white bg-accent shadow-lg font-bold text-lg">
                  {formatPrice(property.price)}
                </Badge>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <ApperIcon name="Bed" className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <div className="font-semibold text-gray-900">{property.bedrooms}</div>
                  <div className="text-sm text-gray-600">Bedroom{property.bedrooms !== 1 ? 's' : ''}</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <ApperIcon name="Bath" className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <div className="font-semibold text-gray-900">{property.bathrooms}</div>
                  <div className="text-sm text-gray-600">Bathroom{property.bathrooms !== 1 ? 's' : ''}</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <ApperIcon name="Maximize" className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <div className="font-semibold text-gray-900">{formatSquareFeet(property.squareFeet)}</div>
                  <div className="text-sm text-gray-600">Sq Feet</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <ApperIcon name="Calendar" className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <div className="font-semibold text-gray-900">{property.yearBuilt}</div>
                  <div className="text-sm text-gray-600">Year Built</div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h2 className="font-display text-xl font-semibold text-gray-900 mb-3">
                  About This Property
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {property.description}
                </p>
              </div>

              {/* Features */}
              {property.features && property.features.length > 0 && (
                <div>
                  <h2 className="font-display text-xl font-semibold text-gray-900 mb-3">
                    Features & Amenities
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {property.features.map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center"
                      >
                        <ApperIcon name="Check" className="w-5 h-5 text-success mr-3" />
                        <span className="text-gray-700">{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-white rounded-lg shadow-card p-6">
              <h3 className="font-display text-lg font-semibold text-gray-900 mb-4">
                Interested in this property?
              </h3>
              
              <div className="space-y-3 mb-4">
                <Button
                  variant="primary"
                  icon="Phone"
                  className="w-full"
                >
                  Schedule Viewing
                </Button>
                
                <Button
                  variant="outline"
                  icon="Mail"
                  className="w-full"
                >
                  Contact Agent
                </Button>
                
                <Button
                  variant={isSaved ? "secondary" : "ghost"}
                  icon={isSaved ? "Heart" : "Heart"}
                  loading={saveLoading}
                  onClick={handleSaveToggle}
                  className="w-full"
                >
                  {isSaved ? 'Saved' : 'Save Property'}
                </Button>
              </div>

              <Button
                variant="accent"
                icon="GitCompare"
                className="w-full"
                onClick={() => navigate('/compare')}
              >
                Add to Compare
              </Button>
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-lg shadow-card p-6">
              <h3 className="font-display text-lg font-semibold text-gray-900 mb-4">
                Property Details
              </h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Property Type:</span>
                  <span className="font-medium">{property.propertyType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Year Built:</span>
                  <span className="font-medium">{property.yearBuilt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Square Feet:</span>
                  <span className="font-medium">{formatSquareFeet(property.squareFeet)} sqft</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Listed:</span>
                  <span className="font-medium">
                    {format(new Date(property.listingDate), 'MMM d, yyyy')}
                  </span>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-white rounded-lg shadow-card p-6">
              <h3 className="font-display text-lg font-semibold text-gray-900 mb-4">
                Location
              </h3>
              <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center">
                <div className="text-center">
                  <ApperIcon name="Map" className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 text-sm">Interactive map view</p>
                </div>
              </div>
              <Button
                variant="outline"
                icon="Map"
                className="w-full mt-4"
                onClick={() => navigate('/map')}
              >
                View on Map
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyDetails;