"use client";

import Dropdown from "@/components/DropDown";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { fetchDataGet } from "@/utils.js/fetchData";
import endpoints from "@/config/endpoints";

const FeaturedProperties = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const [locations, setLocations] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [pricingOptions, setPricingOptions] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({
    location: "",
    property: "",
    price: "",
  });

  // Fetch dropdown options from the backend
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const locationData = await fetchDataGet(endpoints.locationOptions);
        setLocations(locationData);

        const propertyData = await fetchDataGet(endpoints.propertyOptions);
        setPropertyTypes(propertyData);

        const priceData = await fetchDataGet(endpoints.pricingOptions);
        setPricingOptions(priceData);
      } catch (error) {
        console.error("Error fetching filter options:", error);
      }
    };

    fetchDropdownData();
  }, []);

  // Handle dropdown selection changes and fetch properties
  const handleDropdownSelect = async (value, type) => {
    const updatedFilters = { ...selectedFilters, [type]: value };
    setSelectedFilters(updatedFilters);

    try {
      const queryParams = new URLSearchParams(updatedFilters).toString();
      const propertiesData = await fetchDataGet(
        `${endpoints.properties}?${queryParams}`
      );
      setFilteredProperties(propertiesData.properties);
    } catch (error) {
      console.error("Error fetching filtered properties:", error);
    }
  };

  return (
    <div className="pb-72">
      <div>
        <h1 className="text-[#221C42] flex justify-center items-center font-workSansMedium font-medium lg:text-6xl pt-20 text-center text-3xl">
          Featured Properties
        </h1>
      </div>

      {/* Dropdowns */}
      <div className="lg:flex gap-11 justify-center items-center mt-16 grid">
        <Dropdown
          options={locations}
          onSelect={(value) => handleDropdownSelect(value, "location")}
          placeholder="Location"
        />
        <Dropdown
          options={propertyTypes}
          onSelect={(value) => handleDropdownSelect(value, "property")}
          placeholder="Property"
        />
        <Dropdown
          options={pricingOptions}
          onSelect={(value) => handleDropdownSelect(value, "price")}
          placeholder="Price"
        />
      </div>

      {/* Slider */}
      <div className="mt-32">
        {/* <Slider {...settings}> */}
        <div>
          {filteredProperties.map((property, index) => {
            return (
              <div key={index}>
                <div className="flex items-center justify-center">
                  <Image
                    src={property?.pictures[0]?.url}
                    alt={"Property Image"}
                    width={600}
                    height={200}
                    className="pb-7"
                  />
                </div>
              </div>
            );
          })}
        </div>
        {/* </Slider> */}
      </div>
    </div>
  );
};

export default FeaturedProperties;