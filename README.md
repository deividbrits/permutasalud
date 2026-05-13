
# PermutaSalud

## Authors

- [@deividbrits](https://www.github.com/deividbrits)


## Sobre esta App
¿Qué es PermutaSalud?
PermutaSalud es una plataforma web (aplicación Full-Stack) diseñada específicamente para funcionarios de la salud pública en Chile. Su objetivo principal es facilitar el proceso de "permutas" (intercambio de puestos de trabajo) entre profesionales que desean trasladarse a otra ciudad, comuna o región, manteniendo sus condiciones laborales (cargo, categoría, nivel, etc.).

Funciona con una dinámica similar a las aplicaciones de citas (como Tinder), pero enfocada estrictamente en conectar a trabajadores compatibles que desean intercambiar sus lugares de trabajo.

Funcionalidades Principales
Gestión de Perfiles y Preferencias de Movilidad:

Los usuarios pueden registrarse y completar un perfil profesional detallado indicando su rol (ej. enfermero, médico, TENS), categoría, nivel y su ubicación actual (comuna).
Permite establecer preferencias de movilidad muy flexibles: los usuarios pueden elegir si están dispuestos a trasladarse a comunas específicas, a regiones enteras o si tienen disponibilidad de movilidad a nivel nacional.
Sistema de "Matchmaking" (Emparejamiento):

El panel principal (Dashboard) muestra "tarjetas de candidatos" compatibles.
Los usuarios pueden interactuar con estos perfiles aceptándolos ("like") o descartándolos ("pass").
Si dos usuarios se aceptan mutuamente, se produce un "Match", y ambos aparecen en la sección de "Mis Matches", permitiéndoles iniciar el contacto para coordinar la permuta.
Verificación y Seguridad:

Cuenta con un sistema de verificación de usuarios (VerificationProcess, ContractVerification) para asegurar que quienes usan la plataforma son realmente funcionarios de salud con contratos vigentes.
Incluye un Panel de Administración (AdminDashboard) protegido, donde los administradores pueden verificar perfiles de forma manual, gestionar usuarios y supervisar la plataforma.
Notificaciones Automatizadas:

Sistema de notificaciones en la barra de navegación (icono de campana) para alertas en tiempo real.
Integración de correos electrónicos automáticos (correos de bienvenida y avisos de nuevos "matches") para mantener a los usuarios informados.
Autenticación Completa:

Registro e inicio de sesión tradicional con correo y contraseña.
Soporte para inicio de sesión social (Google y Microsoft).
Recuperación de contraseñas.
Arquitectura y Tecnologías Utilizadas (Tech Stack)
La aplicación está construida utilizando tecnologías modernas de desarrollo web:

Frontend (Interfaz de Usuario):

React 19 y TypeScript como base principal.
Vite como entorno de desarrollo y empaquetador, lo que garantiza rapidez.
React Router DOM para la navegación entre las distintas páginas (Dashboard, Perfil, Configuración, etc.).
Tailwind CSS (v4) para el diseño visual y la adaptabilidad a dispositivos móviles (Responsive Design).
Framer Motion para añadir animaciones fluidas a la interfaz.
Lucide React para la iconografía.
Backend y Base de Datos (BaaS):

Está fuertemente respaldada por Firebase (de Google).
Firebase Authentication: Maneja toda la seguridad de acceso de los usuarios.
Cloud Firestore: Base de datos NoSQL donde se guardan los perfiles, las preferencias y el estado de los "matches".
Firebase Cloud Functions (Node.js): Se utilizan para ejecutar lógica en el servidor (backend puro), como por ejemplo, disparar el envío de correos electrónicos a través de la librería nodemailer.