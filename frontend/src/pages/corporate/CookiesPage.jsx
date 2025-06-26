import React from 'react';
import Layout from '../../components/layout/Layout';
import { CONTACT_EMAILS } from '../../config/constants';

const CookiesPage = () => {
  return (
    <Layout>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <h1 className="fw-bold mb-4">Política de Cookies</h1>
            <p className="text-muted mb-4">Última actualización: 26 de junio de 2025</p>
            
            <div className="card mb-4">
              <div className="card-body p-4">
                <h2 className="h4 mb-3">1. ¿Qué son las cookies?</h2>
                <p>Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas un sitio web. Permiten que los sitios web funcionen de manera eficiente y proporcionan información a los propietarios del sitio.</p>
              </div>
            </div>
            
            <div className="card mb-4">
              <div className="card-body p-4">
                <h2 className="h4 mb-3">2. Tipos de cookies que utilizamos</h2>
                <ul>
                  <li><strong>Cookies esenciales:</strong> Necesarias para el funcionamiento del sitio.</li>
                  <li><strong>Cookies analíticas:</strong> Nos ayudan a entender cómo utilizas el sitio.</li>
                  <li><strong>Cookies de funcionalidad:</strong> Personalizan tu experiencia.</li>
                </ul>
              </div>
            </div>
            
            <div className="card mb-4">
              <div className="card-body p-4">
                <h2 className="h4 mb-3">3. Cookies específicas</h2>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Cookie</th>
                      <th>Propósito</th>
                      <th>Duración</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>_session</td>
                      <td>Mantiene tu sesión activa</td>
                      <td>Sesión</td>
                    </tr>
                    <tr>
                      <td>auth_token</td>
                      <td>Autenticación</td>
                      <td>30 días</td>
                    </tr>
                    <tr>
                      <td>_ga</td>
                      <td>Análisis de uso</td>
                      <td>2 años</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="card mb-4">
              <div className="card-body p-4">
                <h2 className="h4 mb-3">4. Control de cookies</h2>
                <p>Puedes controlar y eliminar las cookies a través de la configuración de tu navegador. Ten en cuenta que limitar las cookies puede afectar la funcionalidad del sitio.</p>
              </div>
            </div>
            
            <div className="card">
              <div className="card-body p-4">
                <h2 className="h4 mb-3">5. Contacto</h2>
                <p>Si tienes preguntas sobre nuestro uso de cookies, contáctanos en:</p>
                <p><a href={`mailto:${CONTACT_EMAILS.SUPPORT}`}>{CONTACT_EMAILS.SUPPORT}</a></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CookiesPage;
