const Legend: React.FC = () => {
  return (
    <div style={legendStyles}>
      <h6 style={legendHeaderStyle}>Legend</h6>
      <div style={legendItemStyle}>
        <span style={colorBox(true)}></span>
        <span>MFTE units available</span>
      </div>
      <div style={legendItemStyle}>
        <span style={colorBox(false)}></span>
        <span>Unknown availability</span>
      </div>
    </div>
  );
};

const legendStyles: React.CSSProperties = {
  background: "white",
  padding: "10px",
  margin: "10px",
  border: "1px solid #ccc",
  fontSize: "14px",
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
  borderRadius: "8px",
  maxWidth: "200px",
};

const legendHeaderStyle: React.CSSProperties = {
  fontSize: "16px",
  fontWeight: "bold",
  marginBottom: "10px",
};

const legendItemStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  marginBottom: "5px",
  gap: "3px",
};

const colorBox = (hasListing: boolean): React.CSSProperties => ({
  width: "15px",
  height: "15px",
  backgroundColor: hasListing ? "red" : "#10345c",
  marginRight: "5px",
  opacity: hasListing ? 1 : 0.8,
  border: "1px solid black",
  borderRadius: "4px",
});

export default Legend;
