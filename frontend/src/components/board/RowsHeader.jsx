const RowHeader = ({ rowIndex }) => (
    <div className={`row-header ${rowIndex === 0 ? 'first-row' : ''}`}>
      {rowIndex}
    </div>
  );

export default RowHeader;