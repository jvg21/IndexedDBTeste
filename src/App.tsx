import React from 'react';
import IndexedDb from './indexedDb/IndexedDB';

const App: React.FC = () => {
  const nameTable = 'Carro'
  const db = new IndexedDb('TesteCarro',[nameTable])

   const newData = db.putValue(nameTable,{marca:"volkswagen",modelo:"gol"})
  

  return (
    <>

    </>
  );
};

export default App;
