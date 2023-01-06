import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import { GameDisplay } from '../../components/GameDisplay';

// const GameDisplay = dynamic(
//   async () =>
//     await import('../../components/GameDisplay').then(
//       (module) => module.GameDisplay
//     ),
//   { ssr: false }
// );
const index = () => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
  }, []);
  useEffect(() => {}, []);
  return (
    <>
      <div key={Math.random()} id='game'></div>
      {loading ? <GameDisplay /> : null}
    </>
  );
};

export default index;
