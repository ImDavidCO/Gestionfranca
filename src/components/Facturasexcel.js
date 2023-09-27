import React, { useState } from 'react';

const API = process.env.REACT_APP_BACKEND;

const ExcelUpload = () => {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (file) {
      const formData = new FormData();
      formData.append('archivo', file);

      try {
        const response = await fetch(`${API}/cargarfacturas`, {
          method: 'POST',
          body: formData,
        });

        if (response.status === 200) {
          // Éxito al cargar el archivo
          setUploadStatus('success');
        } else {
          // Error al cargar el archivo
          setUploadStatus('error');
        }

        // Ocultar los mensajes después de 3 segundos
        setTimeout(() => {
          setUploadStatus(null);
        }, 3000);
      } catch (error) {
        console.error('Error al cargar el archivo:', error);
        // Error al realizar la solicitud
        setUploadStatus('error');

        // Ocultar el mensaje de error después de 3 segundos
        setTimeout(() => {
          setUploadStatus(null);
        }, 3000);
      }
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6">
          <div className="input-group mb-3">
            <input
              className="form-control"
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
            />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <p>
            El archivo debe tener las siguientes columnas: sucursal, productos, cantidad, valor, fecha, estado (activa o anulada).
          </p>
        </div>
        <div className="input-group-append">
          <button
            className="btn btn-dark"
            type="button"
            onClick={handleUpload}
          >
            Cargar Archivo Excel
          </button>
        </div>
      </div>
      {uploadStatus === 'success' && (
        <div className="row">
          <div className="col-md-12 mt-3">
            <div className="alert alert-success" role="alert">
              Archivo cargado con éxito.
            </div>
          </div>
        </div>
      )}
      {uploadStatus === 'error' && (
        <div className="row">
          <div className="col-md-12 mt-3">
            <div className="alert alert-danger" role="alert">
              Error al cargar el archivo. Por favor, intenta de nuevo.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExcelUpload;
