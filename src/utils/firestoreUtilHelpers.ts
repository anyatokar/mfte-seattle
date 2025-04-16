import { Address, AmiData, Contact } from "../interfaces/IBuilding";

export function isSameAddress(a: Address, b: Partial<Address>): boolean {
  return (
    a.streetNum === b.streetNum &&
    a.street === b.street &&
    a.city === b.city &&
    a.state === b.state &&
    a.zip === b.zip &&
    a.neighborhood === b.neighborhood &&
    a.streetAddress === b.streetAddress &&
    a.lat === b.lat &&
    a.lng === b.lng
  );
}

export function isSameContact(a: Contact, b: Partial<Contact>): boolean {
  return (
    a.phone === b.phone &&
    a.phone2 === b.phone2 &&
    a.urlForBuilding === b.urlForBuilding
  );
}

export function isSameAmiData(a: AmiData, b: AmiData): boolean {
  const aKeys = Object.keys(a) as (keyof AmiData)[];
  const bKeys = Object.keys(b) as (keyof AmiData)[];

  if (aKeys.length !== bKeys.length) return false;

  for (const key of aKeys) {
    const aValues = a[key];
    const bValues = b[key];

    if (!bValues || aValues.length !== bValues.length) {
      return false;
    }

    // Compare sorted arrays to ensure order doesn't matter
    const sortedA = [...aValues].sort();
    const sortedB = [...bValues].sort();

    for (let i = 0; i < sortedA.length; i++) {
      if (sortedA[i] !== sortedB[i]) return false;
    }
  }

  return true;
}
