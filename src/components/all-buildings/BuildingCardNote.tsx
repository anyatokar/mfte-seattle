import { useState, useEffect, MutableRefObject } from "react";
import { addNote } from "../../utils/firestoreUtils";
import useDebounce from "../../hooks/useDebounce";
import ISavedBuilding from "../../interfaces/ISavedBuilding";
import Form from "react-bootstrap/Form";

export interface AllBuildingCardProps {
  buildingID: string;
  savedHomeData: ISavedBuilding;
  shouldScroll: MutableRefObject<boolean>;
  currentUserId: string;
}

const BuildingCardNote: React.FC<AllBuildingCardProps> = ({
  buildingID,
  savedHomeData,
  shouldScroll,
  currentUserId,
}) => {
  // Saved Buildings - note form
  const originalNote = savedHomeData?.note || "";

  const [updatedNote, setUpdatedNote] = useState(originalNote);

  // This runs every time component re-renders (on every keystroke).
  // But it only updates when user stops typing.
  const debouncedNote = useDebounce(updatedNote, 1000);

  useEffect(() => {
    if (debouncedNote !== undefined && debouncedNote !== originalNote) {
      shouldScroll.current = false;
      handleNoteUpdate(debouncedNote);
    }
  }, [debouncedNote]);

  async function handleNoteUpdate(debouncedNote: string): Promise<void> {
    return addNote(currentUserId, buildingID, debouncedNote)
      .then(() => {
        console.log("Note updated successfully.");
      })
      .catch((error: any) => {
        console.error("Error updating document: ", error);
      });
  }

  return (
    <Form>
      <Form.Label>Notes</Form.Label>
      <Form.Group className="mb-2">
        <Form.Control
          as="textarea"
          name="note"
          rows={2}
          value={updatedNote}
          onChange={(e) => setUpdatedNote(e.target.value)}
        />
      </Form.Group>
    </Form>
  );
};

export default BuildingCardNote;
