import React, { useEffect, useRef } from "react";

const MatrixBackground = () => {

    let color_schemes = ["#09b800"];
    let canvasRef = useRef(null);

    useEffect(() => {
        let canvas = canvasRef.current;
        let ctx = canvas.getContext("2d");

        // Setting the width and height of the canvas
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Setting up the letters
        let letters = 'ッぇぉぬぶぢすまぱネゼヸ';
        letters = letters.split('');

        // Setting up the columns
        let fontSize = 20,
        columns = canvas.width / fontSize;

        // Setting up the drops
        let drops = [];
        for (let i = 0; i < columns; i++) {
        drops[i] = 1;
        }

        // Setting up the draw function
        function draw() {
            ctx.fillStyle = 'rgba(0, 0, 0, .1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < drops.length; i++) {
                let text = letters[Math.floor(Math.random() * letters.length)];
                let color = color_schemes[Math.floor(Math.random() * color_schemes.length)]
                ctx.fillStyle = color;
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                drops[i]++;
                if (drops[i] * fontSize > canvas.height && Math.random() > .95) {
                    drops[i] = 0;
                }
            }
        }

        // Loop the animation
        setInterval(draw, 33);
    });

    return <canvas ref={canvasRef}></canvas>;
}

export default MatrixBackground;
