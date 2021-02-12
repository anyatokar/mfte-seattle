import ISorter from "../interfaces/ISorter";

export function genericSort<T>(
  objectA: T,
  objectB: T,
  sorter: ISorter<T>
) {
  const result = () => {
    if (objectA[sorter.property] > objectB[sorter.property]) {
      return 1;
    } else if (objectA[sorter.property] < objectB[sorter.property]) {
      return -1;
    } else {
      return 0;
    }
  }

  return sorter.isDescending ? result() * -1 : result();
}
