import React, { useState } from "react";
import Papa from "papaparse";

function App() {
  /* dati */
  const [products, setProducts] = useState([]);

  /* stato filtro prezzo */
  const [showOnlyWithPrice, setShowOnlyWithPrice] = useState(false);

  /* mostra altri */
  const [visibleCount, setVisibleCount] = useState(10);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];

    /* se il file è presente */
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const parsed = results.data.map((row) => ({
            ...row,
            price: row.price ? parseFloat(row.price) : null,
          }));
          setProducts(parsed);
          setVisibleCount(15);
          console.log(results);
          
        },
      });
    }
  };

  /* ternario prodotti con prezzi o senza */
  const filteredProducts = showOnlyWithPrice ? products.filter((p) => p.price !== null) : products;

  /* prodotti visibili */
  const visibleProducts = filteredProducts.slice(0, visibleCount);

  /* funzione mostra ancora */
  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 20);
  };

  return (
    <div className="container py-5">
      <h1 className="mb-4">Importazione CSV Prodotti</h1>

      {/* input caricamento file */}
      <div className="mb-3 col-6">
        <label htmlFor="csvInput" className="form-label">
          Carica file CSV:
        </label>
        <input
          type="file"
          accept=".csv"
          className="form-control"
          id="csvInput"
          onChange={handleFileUpload}
        />
      </div>

      {/* tabella mostra se */}
      {products.length > 0 && (
        <div>
          <div className="form-check form-switch my-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="priceFilter"
              checked={showOnlyWithPrice}
              onChange={() => {
                setShowOnlyWithPrice((prev) => !prev);
                setVisibleCount(15);
              }}
            />
            <label className="form-check-label" htmlFor="priceFilter">
              Mostra solo prodotti con prezzo
            </label>
          </div>

          <div className="table-responsive">
            <table className="table table-striped table-bordered mt-3">
              <thead className="table-dark">
                <tr>
                  {Object.keys(products[0]).map((key) => (
                    <th key={key}>
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibleProducts.map((product, i) => (
                  <tr key={i}>
                    <td>{product.name}</td>
                    <td>{product.barcode}</td>
                    <td>{product.brand}</td>
                    <td>{product.category}</td>
                    <td>{product.quantity}</td>
                    <td>{product.weight}</td>
                    <td>
                      {product.price !== null ? product.price.toFixed(2) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* button mostra altri */}
          {visibleCount < filteredProducts.length && (
            <div className="text-center mt-3">
              <button className="btn btn-primary" onClick={handleShowMore}>
                Mostra altri
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
