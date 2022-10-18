import React from "react";
import zkDID from 'zkdid'

const HomeIndex: React.FC = () => {
  const did = zkDID.getDID('sssssss');

  return (
    <div>
      {did.id}
    </div>
  );
}

export default HomeIndex;
