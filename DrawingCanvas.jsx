import { Button } from "@mui/material";
import React, { useRef, useEffect, useState } from "react";
import style from "@styles/DrawingCanvas.module.css";
import axios from "axios";
// import { Image as nextImage } from "next/image";
// import camion from "@img/camion.jpeg";
function DrawingCanvas() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [linesDrawn, setLinesDrawn] = useState(0);
  const [linePositions, setLinePositions] = useState([]);
  const [currentLineStart, setCurrentLineStart] = useState(null);
  const [currentLineEnd, setCurrentLineEnd] = useState(null);
  const [info, setInfo] = useState({});

  const drawImageOnCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      // Draw the image onto the canvas
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    img.src = "/asset/img/camion.jpeg";

    img.onerror = (error) => {
      console.error("Error loading image:", error);
    };
  };

  useEffect(() => {
    drawImageOnCanvas(); // Dibuja la imagen al cargar el componente
  }, []);

  const drawLine = (start, end, context) => {
    context.beginPath();
    context.moveTo(start.x, start.y);
    context.lineTo(end.x, end.y);
    context.stroke();
  };

  const startDrawing = (e) => {
    if (linesDrawn >= 4) return; // Limitar a solo 4 líneas
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    setCurrentLineStart({ x, y });
    setCurrentLineEnd({ x, y }); // Inicialmente, la posición final es igual a la posición inicial
  };

  const endDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    setLinesDrawn(linesDrawn + 1);
    setLinePositions([
      ...linePositions,
      { start: currentLineStart, end: currentLineEnd },
    ]);
  };

  const updateEndPosition = (e) => {
    if (!isDrawing) return;
    // const canvas = canvasRef.current;
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    setCurrentLineEnd({ x, y });
  };

  const drawLineFromStartToEnd = () => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    drawLine(currentLineStart, currentLineEnd, ctx);
    endDrawing(); // Finaliza el dibujo de la línea
  };

  const clear = () => {
    console.log(linePositions);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setLinesDrawn(0);
    setLinePositions([]);
    drawImageOnCanvas();
  };

  useEffect(() => {
    const getInfo = async () => {
        try {
            const response = await axios.get('https://reqres.in/api/users/1');
            setInfo(response.data.data); // Assuming "data" contains the user data
        } catch (error) {
            setError(error.message);
            console.error('Error fetching data:', error);
        }
    };

    getInfo();
    console.log(info.id);
}, []);


  return (
    <>
      <h2 style={{ padding: "5px", margin: "20px", display: "flex" }}>
        Clickee sobre la imagen para colocar lineas de disparo
      </h2>
      <div className={style.container}>
        <div className={style.foto}>
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            onMouseDown={startDrawing}
            onMouseMove={updateEndPosition}
            onMouseUp={drawLineFromStartToEnd}
          />
        </div>

        <div>
          {linePositions.map((line, index) => (
            <div key={index}>
              <label>Linea {index + 1}:</label>
              <input
                className={style.inputs}
                type="text"
                value={`Inicio: (${line.start.x}, ${line.start.y}) | Final: (${line.end.x}, ${line.end.y})`}
                readOnly
              />
            </div>
          ))}
          <div style={{ marginTop: "20px", gap: "15px", display: "flex" }}>
            <select className={style.selectCss} name="" id="">
              <option disabled selected>Seleccione una opcion</option>
               {Object.keys(info).map((key) => (
                        <option key={key} value={info[key]}>{key}</option>
                    ))}
            </select>
            <Button onClick={clear} variant="contained">
              Limpiar
            </Button>
            <Button variant="contained">Enviar</Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default DrawingCanvas;
