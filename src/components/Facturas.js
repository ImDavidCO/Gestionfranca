import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';

const API = process.env.REACT_APP_BACKEND;

const Facturast = () => {
  const [facturas, setFacturas] = useState([]);
  const estado = 'activa';
  const [editingFactura, setEditingFactura] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [mostrarDetalles, setMostrarDetalles] = useState(false);
  const [editedFecha, setEditedFecha] = useState('');

  const handleSubmit = async (data) => {
    try {
      const id = data.id;
      const res = await fetch(`${API}/facturas/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          fecha: editedFecha, // Actualiza la fecha con la fecha editada
          estado,
        }),
      });

      if (res.status === 200) {
        setSuccessMessage('Factura actualizada con éxito');
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000); // Ocultar el mensaje después de 3 segundos
      }

      const result = await res.json();
      console.log(result);
      // Actualiza la lista de facturas después de guardar
      getFacturas();
    } catch (error) {
      console.error('Error al guardar la factura', error);
    }
  };

  const getFacturas = async () => {
    const res = await fetch(`${API}/facturas`);
    const data = await res.json();
    console.log(data);
    setFacturas(data);
  };

  useEffect(() => {
    getFacturas();
  }, []);

  const startEditingFactura = (factura) => {
    setEditingFactura(factura);
    setEditedFecha(format(new Date(factura.fecha), 'yyyy-MM-dd')); // Mostrar la fecha original en el formato deseado
  };

  const saveEditedFactura = () => {
    if (editingFactura) {
      handleSubmit(editingFactura);
      setEditingFactura(null);
    }
  };

  const anularFactura = async (id) => {
    const userResponse = window.confirm('¿Está seguro que desea anular la factura?');
    if (userResponse) {
      try {
        const res = await fetch(`${API}/facturas/${id}/anular`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (res.status === 200) {
          setSuccessMessage('Factura anulada con éxito');
          setTimeout(() => {
            setSuccessMessage('');
          }, 3000); // Ocultar el mensaje después de 3 segundos
          await getFacturas();
        } else {
          console.error('Error al anular la factura');
        }
      } catch (error) {
        console.error('Error de red:', error);
      }
    }
  };

  const deleteFactura = async (id) => {
    const userResponse = window.confirm('¿Está seguro que desea eliminar la factura?');
    if (userResponse) {
      const res = await fetch(`${API}/facturas/${id}`, {
        method: 'DELETE',
      });
      if (res.status === 200) {
        setSuccessMessage('Factura eliminada con éxito');
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000); // Ocultar el mensaje después de 3 segundos
        await res.json();
        await getFacturas();
      }
    }
  };

  const calcularTotalFacturasActivas = () => {
    let total = 0;
    facturas.forEach((factura) => {
      if (factura.estado === 'activa') {
        total += factura.precio;
      }
    });
    return total;
  };

  return (
    <div className="row">
      {successMessage && (
        <div className="alert alert-success mt-3" role="alert">
          {successMessage}
        </div>
      )}
      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr className="tr text-align-center">
              <th>Sucursal</th>
              <th>Fecha</th>
              <th>Codigo</th>
              <th>Productos</th>
              <th>Cantidad</th>
              <th>Valor</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {facturas.map((factura) => (
              <tr key={factura.id}>
                <td>
                  {editingFactura && editingFactura.id === factura.id ? (
                    <input
                      type="text"
                      value={editingFactura.sucursal}
                      onChange={(e) =>
                        setEditingFactura({
                          ...editingFactura,
                          sucursal: e.target.value,
                        })
                      }
                    />
                  ) : (
                    factura.sucursal
                  )}
                </td>
                <td>
                  {editingFactura && editingFactura.id === factura.id ? (
                    <input
                      type="date"
                      value={editedFecha} // Mostrar la fecha editada
                      onChange={(e) => setEditedFecha(e.target.value)}
                    />
                  ) : (
                    format(new Date(factura.fecha), 'dd/MM/yyyy')
                  )}
                </td>
                <td>{factura.id}</td>
                <td>
                  {editingFactura && editingFactura.id === factura.id ? (
                    <input
                      type="text"
                      value={editingFactura.productos}
                      onChange={(e) =>
                        setEditingFactura({
                          ...editingFactura,
                          productos: e.target.value,
                        })
                      }
                    />
                  ) : (
                    factura.productos
                  )}
                </td>
                <td>
                  {editingFactura && editingFactura.id === factura.id ? (
                    <input
                      type="number"
                      value={editingFactura.cantidad}
                      onChange={(e) =>
                        setEditingFactura({
                          ...editingFactura,
                          cantidad: e.target.value,
                        })
                      }
                    />
                  ) : (
                    factura.cantidad
                  )}
                </td>
                <td>
                  {editingFactura && editingFactura.id === factura.id ? (
                    <input
                      type="text"
                      value={editingFactura.precio}
                      onChange={(e) =>
                        setEditingFactura({
                          ...editingFactura,
                          precio: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <span style={{ color: factura.estado === 'anulada' ? 'red' : 'inherit' }}>
                      ${factura.precio}
                    </span>
                  )}
                </td>
                <td>
                  {factura.estado}
                </td>
                <td>
                  {editingFactura && editingFactura.id === factura.id ? (
                    <>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={saveEditedFactura}
                      >
                        Guardar
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setEditingFactura(null)}
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="btn btn-primary btn-sm w-100"
                        onClick={() => startEditingFactura(factura)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-secondary btn-sm btn-block w-100"
                        onClick={() => anularFactura(factura.id)}
                      >
                        Anular
                      </button>
                      <button
                        className="btn btn-danger btn-sm btn-block w-100"
                        onClick={() => deleteFactura(factura.id)}
                      >
                        Eliminar
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className='row'>
        <button
            className="btn btn-secondary"
            onClick={() => setMostrarDetalles(true)}
          >
            Mostrar Detalles
        </button>
      {mostrarDetalles && (
        <div className="ventana-emergente">
          <h3>Total de Facturas Activas:</h3>
          <p>${calcularTotalFacturasActivas()}</p>
          <button
            className="btn btn-dark"
            onClick={() => setMostrarDetalles(false)}
          >
            Cerrar
          </button>
        </div>
      )}
      </div>
    </div>
  );
};

export default Facturast;
