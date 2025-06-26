import React from 'react';
import Layout from '../../components/layout/Layout';
import { Link } from 'react-router-dom';

const FAQPage = () => {
  const faqCategories = [
    {
      title: "Primeros pasos",
      questions: [
        {
          question: "¿Qué es Taskly?",
          answer: "Taskly es una plataforma de gestión de tareas que te ayuda a organizar tus proyectos, establecer prioridades y colaborar de forma eficiente."
        },
        {
          question: "¿Cómo creo mi primera pizarra?",
          answer: "Para crear tu primera pizarra, accede a tu dashboard y haz clic en el botón '+ Nueva pizarra'. Desde allí, podrás darle un nombre y comenzar a organizar tus tareas en columnas."
        },
        {
          question: "¿Es Taskly gratuito?",
          answer: "Sí, Taskly es completamente gratuito en su versión actual. En el futuro, podrían añadirse planes premium con características adicionales."
        }
      ]
    },
    {
      title: "Gestión de tareas",
      questions: [
        {
          question: "¿Cómo añado una nueva tarea?",
          answer: "Para añadir una tarea, selecciona la pizarra y columna donde quieres crearla y haz clic en el botón '+ Añadir tarea'. Completa los detalles necesarios y guarda los cambios."
        },
        {
          question: "¿Puedo cambiar el orden de mis tareas?",
          answer: "Sí, puedes arrastrar y soltar las tareas para reorganizarlas dentro de una columna o moverlas a otra columna."
        }
      ]
    },
    {
      title: "Cuenta y perfil",
      questions: [
        {
          question: "¿Cómo cambio mi contraseña?",
          answer: "Accede a tu perfil haciendo clic en tu avatar en la parte superior derecha y luego en 'Mi perfil'. Allí encontrarás la opción para cambiar tu contraseña."
        },
        {
          question: "¿Cómo elimino mi cuenta?",
          answer: "En tu perfil, encontrarás la opción 'Eliminar cuenta'. Ten en cuenta que esta acción es irreversible y perderás todos tus datos."
        }
      ]
    }
  ];

  return (
    <Layout>
      <div className="container py-5">
        <div className="text-center mb-4">
          <h1 className="fw-bold mb-2">Preguntas frecuentes</h1>
          <p className="mx-auto" style={{maxWidth: "700px"}}>
            Encuentra respuestas a las preguntas más comunes sobre Taskly
          </p>
        </div>
        
        {/* Categorías FAQ simplificadas */}
        <div className="row mt-4">
          <div className="col-lg-3 mb-4">
            <div className="list-group">
              {faqCategories.map((category, index) => (
                <a 
                  key={index}
                  href={`#category-${index}`} 
                  className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                >
                  {category.title}
                  <span className="badge bg-primary rounded-pill">{category.questions.length}</span>
                </a>
              ))}
            </div>
          </div>
          
          <div className="col-lg-9">
            {faqCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} id={`category-${categoryIndex}`} className="mb-4">
                <h3 className="mb-3">{category.title}</h3>
                <div className="accordion" id={`accordion-${categoryIndex}`}>
                  {category.questions.map((item, itemIndex) => {
                    const accordionId = `category-${categoryIndex}-question-${itemIndex}`;
                    return (
                      <div key={itemIndex} className="accordion-item border mb-2">
                        <h2 className="accordion-header">
                          <button 
                            className="accordion-button collapsed" 
                            type="button" 
                            data-bs-toggle="collapse" 
                            data-bs-target={`#${accordionId}`}
                          >
                            {item.question}
                          </button>
                        </h2>
                        <div 
                          id={accordionId} 
                          className="accordion-collapse collapse" 
                          data-bs-parent={`#accordion-${categoryIndex}`}
                        >
                          <div className="accordion-body">
                            {item.answer}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* No encontraste tu respuesta */}
        <div className="card border-0 bg-light p-4 text-center mt-4">
          <div className="card-body">
            <h3 className="fw-bold mb-2">¿No encontraste la respuesta que buscabas?</h3>
            <p className="mb-3">Nuestro equipo estará encantado de ayudarte</p>
            <Link to="/contact" className="btn btn-primary">Contacta con nosotros</Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FAQPage;
