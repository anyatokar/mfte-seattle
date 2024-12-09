import ISorter from "../interfaces/ISorter";

export function genericSort<T>(objectA: T, objectB: T, sorter: ISorter<T>) {
  let comparison = 0;

  if (objectA[sorter.property] > objectB[sorter.property]) {
    comparison = 1;
  } else if (objectA[sorter.property] < objectB[sorter.property]) {
    comparison = -1;
  }

  return sorter.isDescending ? -comparison : comparison;
}
