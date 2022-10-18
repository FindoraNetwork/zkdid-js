import React from "react";
import * as zkDID from 'zkdid/did'

const HomeIndex: React.FC = () => {
  const did = zkDID.getDID('sssssss');

  return (
    <div>
      {did.id}
    </div>
  );
}

export default HomeIndex;
