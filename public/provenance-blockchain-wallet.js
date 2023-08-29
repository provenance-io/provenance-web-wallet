// Self running initialization function
(() => {
  // Provenance object
  const provenance = {
    "version": "1.4.0", // Current extension version
    isProvenance: true, // Is this the provenance extension (incase window.provenance is overwritten)
  };
  // Add provenance to global window
  window.provenance = provenance;
})();
