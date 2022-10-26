import React, { useEffect, useRef, useState } from "react";
import { MD } from "_src/utils/markdown";

const MarkdownCpt: React.FC<{ md: string; }> = (props) => {
  const el = useRef<HTMLDivElement>(null);
  console.log('MarkdownCpt render');

  useEffect(() => {
    if (!el.current) return;
    const realMd = props.md.split('\n');
    let minPad = 100;
    realMd.forEach(str => {
      if (str.length === 0) return;
      const match = str.match(/^( *)/);
      if (!match) minPad = 0;
      minPad = Math.min(minPad, match[0].length);
    });
    const last = realMd.map(v => v.replace(new RegExp(`^( ){${minPad}}`), '')).join('\n');
    console.log('md render');
    el.current.innerHTML = MD.render(last);
  }, [props.md]);

  return (
    <div ref={el}>
    </div>
  );
}

export default MarkdownCpt;
