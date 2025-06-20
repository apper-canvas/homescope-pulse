import savedPropertyData from '@/services/mockData/savedProperties.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let savedProperties = [...savedPropertyData];

export const savedPropertyService = {
  async getAll() {
    await delay(200);
    return [...savedProperties];
  },

  async getById(id) {
    await delay(200);
    const saved = savedProperties.find(s => s.Id === parseInt(id, 10));
    if (!saved) {
      throw new Error('Saved property not found');
    }
    return { ...saved };
  },

  async getByPropertyId(propertyId) {
    await delay(200);
    const saved = savedProperties.find(s => s.propertyId === propertyId);
    return saved ? { ...saved } : null;
  },

  async create(savedProperty) {
    await delay(300);
    const maxId = Math.max(...savedProperties.map(s => s.Id), 0);
    const newSaved = {
      ...savedProperty,
      Id: maxId + 1,
      savedDate: new Date().toISOString()
    };
    savedProperties.push(newSaved);
    return { ...newSaved };
  },

  async update(id, data) {
    await delay(300);
    const index = savedProperties.findIndex(s => s.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Saved property not found');
    }
    
    const updated = {
      ...savedProperties[index],
      ...data,
      Id: savedProperties[index].Id
    };
    savedProperties[index] = updated;
    return { ...updated };
  },

  async delete(id) {
    await delay(300);
    const index = savedProperties.findIndex(s => s.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Saved property not found');
    }
    
    const deleted = savedProperties[index];
    savedProperties.splice(index, 1);
    return { ...deleted };
  },

  async deleteByPropertyId(propertyId) {
    await delay(300);
    const index = savedProperties.findIndex(s => s.propertyId === propertyId);
    if (index === -1) {
      throw new Error('Saved property not found');
    }
    
    const deleted = savedProperties[index];
    savedProperties.splice(index, 1);
    return { ...deleted };
  }
};

export default savedPropertyService;