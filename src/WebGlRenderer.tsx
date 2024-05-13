import React, { useEffect, useRef, useState } from 'react';
import ColorTheme from './ColorTheme';

type GlProps = {
    colorTheme: ColorTheme,
    imageBitmap: ImageBitmap | null
}

type GlContext = {
    context: WebGLRenderingContext;
    program: WebGLProgram;
}

type Rendered = {
    renderedAt: number;
}

const WebGlRenderer: React.FC<GlProps> = ({colorTheme, imageBitmap}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    let [program, setProgram] = useState<GlContext | null>(null);
    let renderState = useRef<Rendered | "scheduled">({renderedAt: Date.now()})

    const render = () => {
        const canvas = canvasRef.current;

        if (!canvas || !imageBitmap) return;

        if (!program) return;

        const gl = program.context

        // set colors
        let myVec3Array = new Float32Array(30);
        // iterate over colors, and set them in the array
        colorTheme.colors.forEach((color, index) => {
            myVec3Array[index * 3] = color.r / 255;
            myVec3Array[index * 3 + 1] = color.g / 255;
            myVec3Array[index * 3 + 2] = color.b / 255;
        });
        if (colorTheme.colors.length < 10) {
            // set remaining values in myVec3Array to the last color
            const last = colorTheme.colors[colorTheme.colors.length - 1];
            for (let i = colorTheme.colors.length; i < 10; i++) {
                myVec3Array[i * 3] = last.r / 255;
                myVec3Array[i * 3 + 1] = last.g / 255;
                myVec3Array[i * 3 + 2] = last.b / 255;
            }
        }

        gl.useProgram(program.program)
        let location = gl.getUniformLocation(program.program, 'colors');
        gl.uniform3fv(location, myVec3Array);

        // // Create texture
        const texture = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imageBitmap);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

        // Render
        gl.clearColor(0.5, 0.5, 0.5, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    useEffect(() => {
        const canvas = canvasRef.current;

        if (!canvas || !imageBitmap) return;

        canvas.width = imageBitmap.width;
        canvas.height = imageBitmap.height;

        const gl = canvas.getContext('webgl');
        if (!gl) return;

        // Create vertex shader
        const vertexShaderSource = `
            attribute vec2 position;
            attribute vec2 texCoord;
            varying vec2 vTexCoord;

            void main() {
                gl_Position = vec4(position, 0, 1.0);
                vTexCoord = texCoord;
            }
            `;

        const vertexShader = gl.createShader(gl.VERTEX_SHADER)!;
        gl.shaderSource(vertexShader, vertexShaderSource);
        gl.compileShader(vertexShader);

        // Create fragment shader
        const fragmentShaderSource = `
            precision mediump float;
            uniform sampler2D texture;
            uniform vec3 colors[10];
            varying vec2 vTexCoord;
            
            void main() {
                vec4 texColor = texture2D(texture, vTexCoord);
                float minDistance = distance(texColor.rgb, colors[0]);
                vec3 closestColor = colors[0];
              
                for (int i = 1; i < 10; ++i) { // Replace 10 with the size of your color array
                  float currentDistance = distance(texColor.rgb, colors[i]);
                  if (currentDistance < minDistance) {
                    minDistance = currentDistance;
                    closestColor = colors[i];
                  }
                }
              
                gl_FragColor = vec4(closestColor, 1.0);
            }
            `;

        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!;
        gl.shaderSource(fragmentShader, fragmentShaderSource);
        gl.compileShader(fragmentShader);

        // Create program
        const program = gl.createProgram()!;
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        gl.useProgram(program);

        const vertices = new Float32Array(
            [
                // Triangle 1
                1, -1, 1, 1,
                -1, -1, 0, 1,
                -1, 1, 0, 0,

                // Triangle 2
                -1, 1, 0, 0,
                1, 1, 1, 0,
                1, -1, 1, 1
            ]
        );


        const vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        // Set up attributes
        const positionAttributeLocation = gl.getAttribLocation(program, 'position');
        gl.enableVertexAttribArray(positionAttributeLocation);
        gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 16, 0);

        const texCoordAttributeLocation = gl.getAttribLocation(program, 'texCoord');
        gl.enableVertexAttribArray(texCoordAttributeLocation);
        gl.vertexAttribPointer(texCoordAttributeLocation, 2, gl.FLOAT, false, 16, 8);
        
        let myVec3Array = new Float32Array([
            0.1, 0, 0,
            0.2, 0, 0,
            0.3, 0, 0,
            0.4, 0, 0,
            0.5, 0, 0,
            0.6, 0, 0,
            0.7, 0, 0,
            0.8, 0, 0,
            0.9, 0, 0,
            1, 0, 0,
        ]);
        let location = gl.getUniformLocation(program, 'colors');
        gl.uniform3fv(location, myVec3Array);

        setProgram({ program: program, context: gl })
    }, [imageBitmap])

    useEffect(() => {
        if (renderState.current !== "scheduled") {
            if ((Date.now() - renderState.current.renderedAt) < 30) {
                setTimeout(() => {
                    render()
                    renderState.current = {renderedAt: Date.now()}
                }, 30 - (Date.now() - renderState.current.renderedAt));
                renderState.current = "scheduled";
            } else {
                renderState.current = {renderedAt: Date.now()}
                render()
            }
        }
    }, [program, imageBitmap, colorTheme])


    return <>
        <canvas ref={canvasRef} width="500px" height="500px" />
    </>
};

export default WebGlRenderer;