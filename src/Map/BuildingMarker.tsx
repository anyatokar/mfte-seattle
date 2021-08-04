/// <reference types="googlemaps" />
import { useCallback } from 'react';
import { InfoWindow, Marker } from '@react-google-maps/api';
import IBuilding from '../interfaces/IBuilding';

interface IBuildingMarkerProps {
  building: IBuilding,
  isSelected: boolean,
  setSelectedBuilding: (building: IBuilding | null) => void
};

export function BuildingMarker(props: IBuildingMarkerProps) {
  const { building, isSelected, setSelectedBuilding } = props;

  const onMarkerClick = useCallback(
    () => setSelectedBuilding(isSelected ? null : building),
    [isSelected, building, setSelectedBuilding]
  );

  const clearSelection = useCallback(
    () => setSelectedBuilding(null),
    [setSelectedBuilding]
  );

  return (
    <Marker
      animation={ google.maps.Animation.DROP }
      position={{
        lat: building.lat,
        lng: building.lng
      }}
      onClick={ onMarkerClick }
    >
      {
        isSelected &&
        <InfoWindow onCloseClick={ clearSelection }>
          <>
            <strong>
              <a
                href={ building.urlForBuilding }
                target='_blank'
                rel='noreferrer'
              >
                <br/>{ building.buildingName }
              </a>
            </strong>
            <br/>
            <strong>{ building.residentialTargetedArea }</strong>
            <br/>
            { building.streetNum } { building.street }
            <br/>
            { building.city }, { building.state } { building.zip }
            <br/>
            <br/>
            <a href={ `tel:${building.phone}` }>{ building.phone }</a>
            <br/>
          </>
        </InfoWindow>
      }
    </Marker>
  );
}