import React, { useState, useEffect } from 'react';

const API = process.env.REACT_APP_BACKEND;

const Facturasform = () => {
  const [productosLista, setProductosLista] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState('');
  const [valorSeleccionado, setValorSeleccionado] = useState('');
  const [fecha, setFecha] = useState('');
  const [sucursal, setSucursal] = useState('');
  const [sucursales, setSucursales] = useState([]);
  const estado = 'activa';
  const [productosAgregados, setProductosAgregados] = useState([]);
  const [facturaCreada, setFacturaCreada] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Obtener la fecha actual y formatearla como 'YYYY-MM-DD'
    const today = new Date();
    const formattedDate = `${today.getFullYear()}-${(today.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
    setFecha(formattedDate);
  }, []);

  const cargarSucursales = async () => {
    try {
      const response = await fetch(`${API}/sucursal`);
      if (response.ok) {
        const data = await response.json();
        setSucursales(data);
      } else {
        console.error('Error al cargar la lista de sucursales');
      }
    } catch (error) {
      console.error('Error al cargar la lista de sucursales:', error);
    }
  };

  useEffect(() => {
    cargarSucursales();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar que todos los campos estén llenos
    if (!fecha || !sucursal || !productosAgregados.length) {
      setError('Todos los campos son obligatorios');

      // Limpiar el mensaje de error después de 3 segundos
      setTimeout(() => {
        setError('');
      }, 1500);

      return;
    }

    const res = await fetch(`${API}/crearfactura`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productos: productosAgregados.map((item) => item.producto),
        valor: totalPrecio,
        cantidad: productosAgregados.length,
        fecha,
        sucursal,
        estado,
      }),
    });

    if (res.status === 200) {
      // La factura se creó con éxito, mostrar mensaje
      setFacturaCreada(true);
      setError(''); // Limpiar mensaje de error

      // Limpiar los campos del formulario y reiniciar el estado después de 2 segundos
      setTimeout(() => {
        setProductoSeleccionado('');
        setValorSeleccionado('');
        setSucursal('');
        setProductosAgregados([]);
        setFacturaCreada(false);
      }, 2000);
    } else {
      // Manejar errores u otros estados de respuesta aquí
      console.error('Error al crear la factura');
    }
  };

  const handleAgregarProducto = () => {
    if (productoSeleccionado && valorSeleccionado) {
      setProductosAgregados([
        ...productosAgregados,
        { producto: productoSeleccionado, valor: valorSeleccionado },
      ]);
      // Limpiar la selección después de agregar
      setProductoSeleccionado('');
      setValorSeleccionado('');
    }
  };

  const cargarRepuestos = async () => {
    try {
      const response = await fetch(`${API}/repuestos`);
      if (response.ok) {
        const data = await response.json();
        setProductosLista(data);
      } else {
        console.error('Error al cargar la lista de repuestos');
      }
    } catch (error) {
      console.error('Error al cargar la lista de repuestos:', error);
    }
  };

  useEffect(() => {
    cargarRepuestos();
  }, []);

  const [totalPrecio, setTotalPrecio] = useState(0);

  useEffect(() => {
    const precios = productosAgregados.map((item) => parseFloat(item.valor));
    const total = precios.reduce((acc, current) => acc + current, 0);
    setTotalPrecio(total);
  }, [productosAgregados]);

  const handleProductoChange = (event) => {
    const selectedValue = event.target.value;
    const cantidadProductos = productosAgregados.length;
    if (cantidadProductos < 5)  {
      if (selectedValue) {
        // Busca el producto seleccionado en productosLista
        const selectedProduct = productosLista.find(
          (item) => item.valor_unit === parseFloat(selectedValue)
        );
        console.log(selectedProduct);
        if (selectedProduct) {
          setValorSeleccionado(selectedValue);
          setProductoSeleccionado(selectedProduct.referencia);
        } else {
          setValorSeleccionado('');
          setProductoSeleccionado('');
        }
      } else {
        setValorSeleccionado('');
        setProductoSeleccionado('');
      }
    }
  };

  return (
    <div className='container'>
      {error && (
        <div className='alert alert-danger' role='alert'>
          {error}
        </div>
      )}
      {facturaCreada && (
        <div className='alert alert-success' role='alert'>
          Factura Creada
        </div>
      )}
      <button className='btn btn-primary btn-block-md position-absolute' onClick={handleSubmit}>
        Guardar
      </button>
      <div className='row justify-content-center p-3'>
        <div className='col-md-4'>
          <form className='card bg-grey'>
            <div className='form-group'>
              <input
                className='form-control form-control-sm'
                type='date'
                onChange={(e) => setFecha(e.target.value)}
                value={fecha}
              />
            </div>
            <div className='form-group'>
        <select
          onChange={(e) => setSucursal(e.target.value)}
          value={sucursal}
          className='form-select'
        >
          <option value=''>Seleccionar Sucursal</option>
          {sucursales.map((sucursal) => (
            <option key={sucursal.codigo} value={sucursal.nombre}>
              {sucursal.nombre}
            </option>
          ))}
        </select>
      </div>
            <div className='form-group'>
              <select
                onChange={handleProductoChange}
                value={valorSeleccionado}
                className='form-select'
              >
                <option value=''>Seleccionar Producto</option>
                {productosLista.map((item, index) => (
                  <option key={index} value={item.valor_unit}>
                    {item.referencia} - {item.codigo_ref} - {item.valor_unit}
                  </option>
                ))}
              </select>
            </div>
            <div className='form-group'>
              <input
                type='text'
                onChange={(e) => {
                  const inputValue = e.target.value;
                  if (inputValue === '' || /^\d+(\.\d*)?$/.test(inputValue)) {
                    setValorSeleccionado(inputValue);
                  }
                }}
                value={valorSeleccionado}
                className='form-control'
                placeholder='Valor'
                autoFocus
              />
            </div>
            <div className="d-flex align-items-center justify-content-center mt-3">
              <button
                className='btn btn-success'
                type='button'
                onClick={handleAgregarProducto}
              >
                Agregar Producto
              </button>
            </div>
          </form>
        </div>
      </div>
      {productoSeleccionado && valorSeleccionado && (
        <div className='row justify-content-center'>
          <div className='table table-responsive'>
            <h2>Producto Seleccionado:</h2>
            <table className='table'>
              <thead className='thead-dark'>
                <tr>
                  <th scope='col'>Producto</th>
                  <th scope='col'>Valor</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{productoSeleccionado}</td>
                  <td>${valorSeleccionado}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
      {productosAgregados.length > 0 && (
        <div className='row justify-content-center'>
          <div className='table table-responsive'>
            <h2>Lista de Productos Agregados:</h2>
            <table className='table'>
              <thead className='thead-dark'>
                <tr>
                  <th scope='col'>Productos</th>
                  <th scope='col'>Valor</th>
                </tr>
              </thead>
              <tbody>
                {productosAgregados.map((producto, index) => (
                  <tr key={index}>
                    <td>{producto.producto}</td>
                    <td>${producto.valor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p>Total de Precios: ${totalPrecio}</p>
            {productosAgregados.length > 0 && (
              <p>Cantidad de Productos: {productosAgregados.length}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Facturasform;
