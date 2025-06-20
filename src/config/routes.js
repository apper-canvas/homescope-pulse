import Browse from '@/components/pages/Browse';
import PropertyDetails from '@/components/pages/PropertyDetails';
import MapView from '@/components/pages/MapView';
import SavedProperties from '@/components/pages/SavedProperties';
import Compare from '@/components/pages/Compare';

export const routes = {
  browse: {
    id: 'browse',
    label: 'Browse',
    path: '/',
    icon: 'Home',
    component: Browse
  },
  mapView: {
    id: 'mapView',
    label: 'Map View',
    path: '/map',
    icon: 'Map',
    component: MapView
  },
  savedProperties: {
    id: 'savedProperties',
    label: 'Saved Properties',
    path: '/saved',
    icon: 'Heart',
    component: SavedProperties
  },
  compare: {
    id: 'compare',
    label: 'Compare',
    path: '/compare',
    icon: 'GitCompare',
    component: Compare
  },
  propertyDetails: {
    id: 'propertyDetails',
    label: 'Property Details',
    path: '/property/:id',
    icon: 'Building',
    component: PropertyDetails,
    hidden: true
  }
};

export const routeArray = Object.values(routes);
export default routes;