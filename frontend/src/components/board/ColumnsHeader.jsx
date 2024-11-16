const ColumnHeader = ({ index }) => (
    <div
      key={`col-header-${index}`}
      className={`column-header ${index === 0 ? 'first-column' : ''}`}
    >
      {index}
    </div>
  );
  
  export default ColumnHeader;