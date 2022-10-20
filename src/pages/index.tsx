import React from "react";
import zkDID from '../dist'

const HomeIndex: React.FC = () => {
  const did = zkDID.did.getDID('sssssss');

  return (
    <div>
      {did.id}
    </div>
  );
}

export default HomeIndex;
