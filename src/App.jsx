import React, { useState } from "react";
import Papa from "papaparse";

function App() {
  /* dati */
  const [products, setProducts] = useState([]);

  /* stato filtro prezzo */
  const [showOnlyWithPrice, setShowOnlyWithPrice] = useState(false);

  /* mostra altri */
  const [visibleCount, setVisibleCount] = useState(10);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Controlla tipo MIME
    if (file.type !== "text/csv" && file.type !== "application/vnd.ms-excel") {
      setMessage("Per favore carica un file CSV valido.");
      return;
    }

    setLoading(true); 

    /* libreria legge e parsa file */
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors && results.errors.length > 0) {
          console.error("Parsing error:", results.errors);
          setMessage("Errore durante il parsing: " + results.errors[0].message);
          setLoading(false);
          return;
        }

        const parsed = results.data.map((row) => ({
          ...row,
          price: row.price ? parseFloat(row.price) : null,
          quantity: row.quantity ? parseInt(row.quantity) : 0,
          weight: row.weight ? parseFloat(row.weight) : null,
        }));

        setProducts(parsed);
        setVisibleCount(15);
        setMessage("");
        setLoading(false);
      },
    });
  };

  /* ternario prodotti con prezzi o senza */
  const filteredProducts = showOnlyWithPrice
    ? products.filter((p) => p.price !== null)
    : products;

  /* prodotti visibili */
  const visibleProducts = filteredProducts.slice(0, visibleCount);

  /* funzione mostra ancora */
  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 20);
  };

  return (
    <div className="container py-5">
      <h1 className="mb-4">Importazione CSV Prodotti</h1>

      <div className="mb-3 col-6">
        <label htmlFor="csvInput" className="form-label">
          Carica file CSV:
        </label>
        <input
          type="file"
          accept=".csv,text/csv"
          className="form-control"
          id="csvInput"
          onChange={handleFileUpload}
          disabled={loading}
        />

        {/* messaggio errore/avviso */}
        {message && (
          <div className="alert alert-warning mt-2" role="alert">
            {message}
          </div>
        )}
      </div>

      {/* caricamento */}
      {loading && (
        <div className="mb-3">
          <div className="spinner-border text-primary" role="status" />
          <span className="ms-2">Caricamento in corso...</span>
        </div>
      )}

      {products.length > 0 && (
        <>
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
              disabled={loading}
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
                    {Object.keys(product).map((field) => (
                      <td key={field}>
                        {field === "price" && product[field] !== null
                          ? product[field].toFixed(2)
                          : product[field] ?? "—"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {visibleCount < filteredProducts.length && (
            <div className="text-center mt-3">
              <button
                className="btn btn-primary"
                onClick={handleShowMore}
                disabled={loading}
              >
                Mostra altri
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
