const Legend: React.FC = () => {
  return (
    <div style={legendStyles}>
      <h6>Legend</h6>
      <div>
        <span style={colorBox(true)}></span> MFTE units available
      </div>
      <div>
        <span style={colorBox(false)}></span> Unknown availability
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
};

const colorBox = (hasListing: boolean): React.CSSProperties => ({
  display: "inline-block",
  width: "15px",
  height: "15px",
  backgroundColor: hasListing ? "red" : "#10345c",
  marginRight: "5px",
  opacity: hasListing ? 1 : 0.8,
  border: "1px solid black",
  borderRadius: "2px",
});

export default Legend;
