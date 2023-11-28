import React, { useEffect, useRef } from "react";

const MatrixBackground = ({ show }) => {

    let color_schemes = ["#09b800"];
    let canvasRef = useRef(null);
      
        useEffect(() => {
          let canvas = canvasRef.current;
          function startMatrixRain() {
            // Canvas setup
            let ctx = canvas.getContext("2d");
    
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
    
            var letters = 'ッぇぉぬぶぢすまぱネゼヸ';
            letters = letters.split('');
    
            var fontSize = 20,
                columns = canvas.width / fontSize;
    
            var drops = [];
            for (var i = 0; i < columns; i++) {
              drops[i] = 1;
            }
    
            function draw() {
              ctx.fillStyle = 'rgba(0, 0, 0, .1)';
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              for (var i = 0; i < drops.length; i++) {
                var text = letters[Math.floor(Math.random() * letters.length)];
                var color = color_schemes[Math.floor(Math.random() * color_schemes.length)]
                ctx.fillStyle = color;
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                drops[i]++;
                if (drops[i] * fontSize > canvas.height && Math.random() > .95) {
                  drops[i] = 0;
                }
              }
            }
    
            // Store the interval ID to stop the animation later
            var animationInterval = setInterval(draw, 33);
    
            // Store the interval ID in a custom attribute of the canvas element
            canvas.dataset.animationInterval = animationInterval;
          }
    
          // Function to stop the Matrix Rain animation
          function stopMatrixRain() {
            // Retrieve the interval ID from the canvas element's custom attribute
            var canvas = document.querySelector('canvas');
            var animationInterval = canvas.dataset.animationInterval;
    
            // Clear the animation interval to stop the animation
            clearInterval(animationInterval);
          }
          stopMatrixRain()
          if (!show) {
            stopMatrixRain()
          } else {
            startMatrixRain()
          }
        }, [show]);
        
    return <canvas ref={canvasRef}></canvas>;
}


export default MatrixBackground;
