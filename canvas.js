// Configuración inicial
const canvas = document.getElementById('starCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const colors = ['#FFCDA5', '#FFFFFF', '#B2C6E1', "#D38DAB", "#E2907D", "#579E64"]; // Colores de las estrellas
const stars = [];
const numStars = Math.floor(500 + Math.random() * 100); // Número total de estrellas iniciales
const totalTime = 22 * 60 * 1000; // 22 minutos en milisegundos
const explosionInterval = totalTime / numStars; // Intervalo dinámico para explosiones

// Clase para la estrella principal
class Star {
    constructor(x, y, color) {
        this.x = x || Math.random() * canvas.width; // Posición aleatoria en X
        this.y = y || Math.random() * canvas.height; // Posición aleatoria en Y
        this.size = 1.3 * Math.random() * 2; // Tamaño de la estrella
        this.color = color || colors[Math.floor(Math.random() * colors.length)];
        this.exploded = false;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    explode() {
        this.exploded = true;
        createExplosion(this.x, this.y, this.color);
    }
}

// Clase para las partículas de la explosión
class Particle {
    constructor(x, y, size, color, vx, vy) {
        this.x = x; // Posición inicial
        this.y = y;
        this.size = size; // Tamaño inicial de la partícula
        this.color = color; // Color heredado de la estrella
        this.vx = vx; // Velocidad inicial en X
        this.vy = vy; // Velocidad inicial en Y
        this.life = Math.random() * 60 + 30; // Vida útil en frames
        this.opacity = 1; // Opacidad inicial
        this.fade = 1 / this.life; // Velocidad de desvanecimiento
        this.friction = 0.98; // Factor de fricción para desacelerar gradualmente
    }

    update() {
        // Aplicar fricción para reducir gradualmente la velocidad
        this.vx *= this.friction;
        this.vy *= this.friction;

        this.x += this.vx; // Mover la partícula en X
        this.y += this.vy; // Mover la partícula en Y
        this.size = Math.max(this.size - 0.01, 0); // Reducir el tamaño gradualmente
        this.opacity = Math.max(this.opacity - this.fade, 0); // Reducir la opacidad gradualmente
    }

    draw() {
        if (this.size <= 0 || this.opacity <= 0) return; // No dibujar si no es visible
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${hexToRgb(this.color)}, ${this.opacity})`;
        ctx.fill();
    }
}

// Convertir color hexadecimal a RGB
function hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `${r}, ${g}, ${b}`;
}

// Crear una explosión de partículas
function createExplosion(x, y, color) {
    const particles = Math.random() * 30 + 50; // Número de partículas
    for (let i = 0; i < particles; i++) {
        const size = Math.random() * 2 + 1; // Tamaño más pequeño y uniforme
        const angle = Math.random() * Math.PI * 2; // Dirección aleatoria en radianes
        const speed = Math.random() * 0.5 + 0.1; // Velocidad inicial más lenta

        // Calcular velocidad en X e Y basadas en el ángulo
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;

        stars.push(new Particle(x, y, size, color, vx, vy));
    }
}

// Crear estrellas iniciales
function createInitialStars() {
    for (let i = 0; i < numStars; i++) {
        stars.push(new Star());
    }
}

// Seleccionar una estrella aleatoria y hacerla explotar
function explodeRandomStar() {
    const remainingStars = stars.filter(star => star instanceof Star && !star.exploded);
    if (remainingStars.length === 0) return;

    const randomIndex = Math.floor(Math.random() * remainingStars.length);
    const starToExplode = remainingStars[randomIndex];
    starToExplode.explode();

    // Eliminar la estrella del arreglo después de la explosión
    const index = stars.indexOf(starToExplode);
    if (index > -1) {
        stars.splice(index, 1);
    }
}

// Animar las estrellas y partículas
function animate() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = stars.length - 1; i >= 0; i--) {
        const star = stars[i];
        star.draw();

        if (star instanceof Particle) {
            star.update();
            if (star.size <= 0 || star.opacity <= 0) {
                stars.splice(i, 1);
            }
        }
    }
    requestAnimationFrame(animate);
}

// Ajustar el tamaño del canvas al cambiar el tamaño de la ventana
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Inicialización
createInitialStars();
// Clase para las estrellas fugaces
class ShootingStar {
    constructor() {
        // Posición inicial aleatoria fuera del canvas (arriba o izquierda)
        this.x = Math.random() * canvas.width; // Comienza desde cualquier lugar del ancho
        this.y = Math.random() * -canvas.height; // Comienza fuera del canvas, en la parte superior
        this.vx = Math.random() * 6 + 3; // Velocidad en X
        this.vy = Math.random() * 6 + 3; // Velocidad en Y
        this.size = Math.random() * 2 + 2; // Tamaño pequeño
        this.opacity = 1; // Opacidad inicial
        this.fade = 0.005; // Velocidad de desvanecimiento
    }

    update() {
        this.x += this.vx; // Movimiento en X
        this.y += this.vy; // Movimiento en Y
        this.opacity = Math.max(this.opacity - this.fade, 0); // Reducir opacidad gradualmente
    }

    draw() {
        if (this.opacity <= 0) return; // No dibujar si la opacidad es 0
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fill();

        // Dibujar rastro
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x - this.vx * 5, this.y - this.vy * 5); // Línea hacia atrás
        ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity / 2})`;
        ctx.lineWidth = this.size / 2;
        ctx.stroke();
    }
}

// Función para añadir estrellas fugaces esporádicamente
function addShootingStar() {
    stars.push(new ShootingStar());
}

// Modificar `animate` para manejar las estrellas fugaces correctamente
function animate() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = stars.length - 1; i >= 0; i--) {
        const star = stars[i];
        star.draw();

        if (star instanceof ShootingStar || star instanceof Particle) {
            star.update();
            if (star.opacity <= 0 || star.x > canvas.width || star.y > canvas.height) {
                // Eliminar estrellas fugaces que salen del canvas o partículas que se desvanecen
                stars.splice(i, 1);
            }
        }
    }
    requestAnimationFrame(animate);
}

// Añadir estrellas fugaces de forma aleatoria
setInterval(() => {
    addShootingStar();
}, Math.random() * 5000 + 5000); // Una estrella fugaz cada 5-10 segundos

// Usar el intervalo dinámico para las explosiones
setInterval(() => {
    explodeRandomStar();
}, explosionInterval); // Intervalo calculado dinámicamente

animate();
