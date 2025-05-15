fetch('http://localhost:3000/items')
  .then(res => res.json())
  .then(data => {
    console.log('Datos desde la base de datos:', data);
  });