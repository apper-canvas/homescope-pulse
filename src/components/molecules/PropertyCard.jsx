import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';
import savedPropertyService from '@/services/api/savedPropertyService';

const PropertyCard = ({ property, isSaved: initialSaved = false, onSaveToggle }) => {
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);

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

  const handleSaveToggle = async (e) => {
    e.stopPropagation();
    setLoading(true);

    try {
      if (isSaved) {
        await savedPropertyService.deleteByPropertyId(property.Id.toString());
        setIsSaved(false);
        toast.success('Property removed from saved');
      } else {
        await savedPropertyService.create({
          propertyId: property.Id.toString(),
          notes: ''
        });
        setIsSaved(true);
        toast.success('Property saved');
      }
      
      if (onSaveToggle) {
        onSaveToggle(property.Id, !isSaved);
      }
    } catch (error) {
      toast.error('Failed to update saved property');
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = () => {
    navigate(`/property/${property.Id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-white rounded-lg shadow-card hover:shadow-card-hover transition-all duration-200 cursor-pointer overflow-hidden"
      onClick={handleCardClick}
    >
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        <motion.img
          src={property.images[0]}
          alt={property.title}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Price Badge */}
        <div className="absolute top-3 left-3">
          <Badge variant="accent" size="md" className="text-white bg-accent shadow-lg font-semibold">
            {formatPrice(property.price)}
          </Badge>
        </div>

        {/* Save Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleSaveToggle}
          disabled={loading}
          className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
        >
          {loading ? (
            <ApperIcon name="Loader2" className="w-5 h-5 text-gray-600 animate-spin" />
          ) : (
            <ApperIcon 
              name="Heart" 
              className={`w-5 h-5 transition-colors ${
                isSaved ? 'text-error fill-current' : 'text-gray-600'
              }`} 
            />
          )}
        </motion.button>

        {/* Property Type Badge */}
        <div className="absolute bottom-3 left-3">
          <Badge variant="default" className="bg-white/90 backdrop-blur-sm shadow-sm">
            {property.propertyType}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-display font-semibold text-lg text-gray-900 mb-2 line-clamp-1">
          {property.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex items-start">
          <ApperIcon name="MapPin" className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
          <span className="min-w-0">{property.address}</span>
        </p>

        {/* Property Stats */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <ApperIcon name="Bed" className="w-4 h-4 mr-1" />
              <span>{property.bedrooms} bed{property.bedrooms !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center">
              <ApperIcon name="Bath" className="w-4 h-4 mr-1" />
              <span>{property.bathrooms} bath{property.bathrooms !== 1 ? 's' : ''}</span>
            </div>
          </div>
          <div className="flex items-center text-secondary font-medium">
            <ApperIcon name="Maximize" className="w-4 h-4 mr-1" />
            <span>{formatSquareFeet(property.squareFeet)} sqft</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;