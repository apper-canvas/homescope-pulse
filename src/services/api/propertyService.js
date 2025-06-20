import propertyData from '@/services/mockData/properties.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let properties = [...propertyData];

export const propertyService = {
  async getAll() {
    await delay(300);
    return [...properties];
  },

  async getById(id) {
    await delay(200);
    const property = properties.find(p => p.Id === parseInt(id, 10));
    if (!property) {
      throw new Error('Property not found');
    }
    return { ...property };
  },

  async search(filters) {
    await delay(400);
    let filtered = [...properties];

    if (filters.priceMin) {
      filtered = filtered.filter(p => p.price >= filters.priceMin);
    }
    if (filters.priceMax) {
      filtered = filtered.filter(p => p.price <= filters.priceMax);
    }
    if (filters.bedroomsMin) {
      filtered = filtered.filter(p => p.bedrooms >= filters.bedroomsMin);
    }
    if (filters.bathroomsMin) {
      filtered = filtered.filter(p => p.bathrooms >= filters.bathroomsMin);
    }
    if (filters.propertyTypes && filters.propertyTypes.length > 0) {
      filtered = filtered.filter(p => filters.propertyTypes.includes(p.propertyType));
    }
    if (filters.squareFeetMin) {
      filtered = filtered.filter(p => p.squareFeet >= filters.squareFeetMin);
    }
    if (filters.location) {
      filtered = filtered.filter(p => 
        p.address.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    return filtered;
  },

  async create(property) {
    await delay(300);
    const maxId = Math.max(...properties.map(p => p.Id), 0);
    const newProperty = {
      ...property,
      Id: maxId + 1,
      listingDate: new Date().toISOString()
    };
    properties.push(newProperty);
    return { ...newProperty };
  },

  async update(id, data) {
    await delay(300);
    const index = properties.findIndex(p => p.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Property not found');
    }
    
    const updatedProperty = {
      ...properties[index],
      ...data,
      Id: properties[index].Id // Ensure Id cannot be modified
    };
    properties[index] = updatedProperty;
    return { ...updatedProperty };
  },

  async delete(id) {
    await delay(300);
    const index = properties.findIndex(p => p.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Property not found');
    }
    
    const deletedProperty = properties[index];
    properties.splice(index, 1);
    return { ...deletedProperty };
  }
};

export default propertyService;