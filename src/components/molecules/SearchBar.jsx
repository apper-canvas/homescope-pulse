import React, { useState } from "react";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import AppIcon from "@/components/atoms/AppIcon";
const SearchBar = ({ onSearch, placeholder = "Search by location, property type, or features...", className = '' }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} className={`flex gap-2 ${className}`}>
      <div className="flex-1 relative">
        <Input
          icon="Search"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
className="absolute right-3 top-4 text-gray-400 hover:text-gray-600"
          >
            <AppIcon name="X" className="w-5 h-5" />
          </button>
        )}
      </div>
      <Button type="submit" variant="primary" icon="Search" size="lg">
        Search
      </Button>
    </form>
  );
};

export default SearchBar;