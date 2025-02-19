const Legend: React.FC = () => {
  return (
    <div style={legendStyles}>
      <h6 className="visually-hidden">Legend</h6>
      <div style={legendItemStyle}>
        <span style={colorBox("hasListing")}></span>
        <span>MFTE units available</span>
      </div>
      <div style={legendItemStyle}>
        <span style={colorBox("availUnknown")}></span>
        <span>Unknown availability</span>
      </div>
      <div style={legendItemStyle}>
        <span style={colorBox("saved")}></span>
        <span>Saved</span>
      </div>
    </div>
  );
};

const legendStyles: React.CSSProperties = {
  background: "white",
  padding: "7px",
  margin: "3px",
  fontSize: "14px",
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
  borderRadius: "5px",
  maxWidth: "200px",
};

const legendItemStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  marginBottom: "0px",
  gap: "2px",
};

const colorBox = (
  type: "hasListing" | "availUnknown" | "saved"
): React.CSSProperties => ({
  width: "15px",
  height: "15px",
  backgroundColor:
    type === "hasListing"
      ? "red"
      : type === "availUnknown"
        ? "#10345c"
        : "white",
  marginRight: "5px",
  opacity: type === "hasListing" ? 1 : 0.8,
  borderRadius: "4px",
  border: type === "saved" ? "2px solid black" : "none",
});

export default Legend;
