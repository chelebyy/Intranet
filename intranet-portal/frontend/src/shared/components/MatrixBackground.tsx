import React, { useEffect, useRef } from 'react';

interface GridParticle {
    x: number;
    y: number;
    char: string;
    alpha: number;
    color: string;
}

const MatrixBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: 0, y: 0 });

    // Animasyon ayarları
    const gridSize = 15;
    const mouseRadius = 150;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()';

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let particles: GridParticle[][] = [];
        let cols = 0;
        let rows = 0;

        // Renk paleti
        const colorChoices = [
            [0, Math.floor(Math.random() * 150) + 105, 50],      // Yeşil
            [Math.floor(Math.random() * 150) + 105, 0, 50],      // Kırmızı
            [0, 50, Math.floor(Math.random() * 150) + 105],      // Mavi
            [Math.floor(Math.random() * 100) + 105, 0, 155],     // Mor
            [0, Math.floor(Math.random() * 100) + 155, 155],     // Turkuaz
            [Math.floor(Math.random() * 100) + 155, 155, 0]      // Sarı/Altın
        ];

        const getRandomColor = () => {
            const color = colorChoices[Math.floor(Math.random() * colorChoices.length)];
            return `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
        };

        // Yardımcı fonksiyonlar
        const map = (value: number, start1: number, stop1: number, start2: number, stop2: number) => {
            return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
        };

        const lerp = (start: number, end: number, amt: number) => {
            return (1 - amt) * start + amt * end;
        };

        // Grid oluşturma
        const setupGrid = () => {
            cols = Math.floor(canvas.width / gridSize);
            rows = Math.floor(canvas.height / gridSize);
            particles = [];

            for (let i = 0; i < cols; i++) {
                particles[i] = [];
                for (let j = 0; j < rows; j++) {
                    particles[i][j] = {
                        x: i * gridSize + gridSize / 2,
                        y: j * gridSize + gridSize / 2,
                        char: characters[Math.floor(Math.random() * characters.length)],
                        alpha: 0,
                        color: getRandomColor()
                    };
                }
            }
        };

        // Canvas boyutlandırma
        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            setupGrid();
        };

        // Mouse hareketi
        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };

        // Animasyon döngüsü
        const animate = () => {
            ctx.fillStyle = 'rgba(10, 14, 25, 0.98)'; // Arka plan rengi (koyu lacivert)
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    const particle = particles[i][j];
                    // Mouse ile parçacık arasındaki mesafe
                    const dx = mouseRef.current.x - particle.x;
                    const dy = mouseRef.current.y - particle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < mouseRadius) {
                        // Mouse yakınındaysa parla
                        const targetAlpha = map(distance, 0, mouseRadius, 2, 0.05);
                        particle.alpha = lerp(particle.alpha, targetAlpha, 0.15);

                        // Rastgele karakter değiştir
                        if (Math.random() < 0.05) {
                            particle.char = characters[Math.floor(Math.random() * characters.length)];
                        }
                    } else {
                        // Uzaktaysa sönükleş
                        particle.alpha = lerp(particle.alpha, 0.05, 0.1);
                    }

                    // Çizim
                    if (particle.alpha > 0.01) {
                        ctx.save();
                        ctx.globalAlpha = Math.min(particle.alpha, 1);
                        ctx.fillStyle = particle.color;
                        ctx.font = '13px monospace';
                        ctx.fillText(particle.char, particle.x, particle.y);
                        ctx.restore();
                    }
                }
            }
            animationFrameId = requestAnimationFrame(animate);
        };

        // Başlatma
        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);
        handleResize();
        animate();

        // Temizlik
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="fixed inset-0 w-screen h-screen z-0 bg-[#0B0E18] overflow-hidden">
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full opacity-15"
            />
        </div>
    );
};

export default MatrixBackground;
