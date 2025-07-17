import { useRef, useEffect, useState, MutableRefObject } from "react";
import { useMap } from "@vis.gl/react-google-maps";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import type { Marker } from "@googlemaps/markerclusterer";
import IBuilding from "../../interfaces/IBuilding";
import ISavedBuilding from "../../interfaces/ISavedBuilding";

import BuildingMarker from "./BuildingMarker";
import { getSavedData } from "../all-buildings/BuildingsList";

interface IAllMarkersProps {
  buildingsToMap: IBuilding[];
  shouldScroll: MutableRefObject<boolean>;
  savedBuildings: ISavedBuilding[];
  setSelectedBuildingId: React.Dispatch<React.SetStateAction<string | null>>;
  selectedBuildingId: string | null;
}

export type MarkersObj = {
  [key: string]: Marker;
};

const AllMarkers: React.FC<IAllMarkersProps> = ({
  buildingsToMap,
  shouldScroll,
  savedBuildings,
  setSelectedBuildingId,
  selectedBuildingId,
}) => {
  const map = useMap();
  const [markers, setMarkers] = useState<MarkersObj>({});

  const clusterer = useRef<MarkerClusterer | null>(null);

  useEffect(() => {
    if (!map) return;
    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer({ map });
    }
  }, [map]);

  useEffect(() => {
    clusterer.current?.clearMarkers();
    clusterer.current?.addMarkers(Object.values(markers));
  }, [markers]);

  const updateMarkerRefs = (
    marker: Marker | null,
    key: string
  ): MarkersObj | undefined => {
    if (marker && markers[key]) return;
    if (!marker && !markers[key]) return;

    setMarkers((prev) => {
      if (marker) {
        return { ...prev, [key]: marker };
      } else {
        const newMarkers = { ...prev };
        delete newMarkers[key];
        return newMarkers;
      }
    });
  };

  function handleMarkerClick(
    ev: google.maps.MapMouseEvent,
    building: IBuilding
  ) {
    if (!map) return;
    if (!ev.latLng) return;
    console.log("marker clicked:", ev.latLng.toString());
    map.panTo(ev.latLng);
    setSelectedBuildingId(building.buildingID);
  }

  return (
    <>
      {buildingsToMap.map((building) => (
        <BuildingMarker
          key={building.buildingID}
          building={building}
          updateMarkerRefs={updateMarkerRefs}
          isSelected={building.buildingID === selectedBuildingId}
          clearSelection={() => setSelectedBuildingId(null)}
          savedHomeData={getSavedData(savedBuildings, building)}
          shouldScroll={shouldScroll}
          onMarkerClick={handleMarkerClick}
        />
      ))}
    </>
  );
};

export default AllMarkers;
